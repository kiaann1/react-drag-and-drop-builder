// Helper function to split form elements into wizard steps
function splitIntoSteps(formElements) {
  if (!formElements || formElements.length === 0) {
    return { steps: [], isWizard: false };
  }

  const steps = [];
  let currentStep = {
    id: 'step-0',
    title: 'Step 1',
    description: '',
    fields: []
  };

  formElements.forEach((element) => {
    if (element.type === 'pageBreak') {
      // Complete current step if it has fields
      if (currentStep.fields.length > 0) {
        steps.push(currentStep);
      }
      
      // Start new step
      currentStep = {
        id: `step-${steps.length}`,
        title: element.label || `Step ${steps.length + 2}`,
        description: element.helpText || '',
        fields: []
      };
    } else {
      currentStep.fields.push(element);
    }
  });

  // Add the last step if it has fields
  if (currentStep.fields.length > 0) {
    steps.push(currentStep);
  }

  // If no page breaks found, treat entire form as single step
  if (steps.length === 0 && formElements.length > 0) {
    steps.push({
      id: 'step-0',
      title: 'Form',
      description: '',
      fields: formElements.filter(el => el.type !== 'pageBreak')
    });
  }

  return { 
    steps, 
    isWizard: steps.length > 1
  };
}

export function exportAsCf7(formElements, formOptions = {}) {
  const { steps, isWizard } = splitIntoSteps(formElements);
  
  // Map builder types to CF7 shortcode types
  const typeMap = {
    text: 'text',
    paragraph: 'textarea',
    email: 'email',
    number: 'number',
    date: 'date',
    phone: 'tel',
    select: 'select',
    checkbox: 'checkbox',
    radio: 'radio',
    file: 'file',
    input: 'text',
    url: 'url',
  };

  const generateFieldCf7 = (element) => {
    // Always include conditionalLogic as exported from ConditionalLogicModal
    const logicComment = element.conditionalLogic
      ? `<!-- conditionalLogic: ${JSON.stringify(element.conditionalLogic)} -->\n`
      : '';
    
    // Skip pageBreak elements
    if (element.type === 'pageBreak') {
      return '';
    }
    
    const cf7Type = typeMap[element.type] || 'text';
    const required = element.required ? '*' : '';
    const name = element.id || 'field';
    let fieldShortcode = '';
    
    switch (cf7Type) {
      case 'textarea':
        fieldShortcode = `[textarea${required} ${name} placeholder "${element.placeholder || element.label || ''}"]`;
        break;
      case 'select':
        if (element.options && element.options.length > 0) {
          const options = element.options.map(opt => opt.label || opt.value).join(' ');
          fieldShortcode = `[select${required} ${name} "${options}"]`;
        } else {
          fieldShortcode = `[select${required} ${name}]`;
        }
        break;
      case 'checkbox':
        if (element.options && element.options.length > 0) {
          const options = element.options.map(opt => opt.label || opt.value).join(' ');
          fieldShortcode = `[checkbox${required} ${name} "${options}"]`;
        } else {
          fieldShortcode = `[checkbox${required} ${name}]`;
        }
        break;
      case 'radio':
        if (element.options && element.options.length > 0) {
          const options = element.options.map(opt => opt.label || opt.value).join(' ');
          fieldShortcode = `[radio${required} ${name} "${options}"]`;
        } else {
          fieldShortcode = `[radio${required} ${name}]`;
        }
        break;
      default:
        fieldShortcode = `[${cf7Type}${required} ${name} placeholder "${element.placeholder || element.label || ''}"]`;
        break;
    }

    const label = element.label ? `<label>${element.label}${required ? ' *' : ''}</label>\n` : '';
    const helpText = element.helpText ? `<div class="help-text">${element.helpText}</div>\n` : '';
    
    return logicComment + label + fieldShortcode + '\n' + helpText;
  };

  if (isWizard) {
    // Generate multi-step CF7 form
    // Note: Contact Form 7 doesn't natively support multi-step forms
    // This creates multiple forms that can be used with a multi-step plugin
    const stepForms = steps.map((step, stepIndex) => {
      const stepFields = step.fields.map(generateFieldCf7).join('\n');
      
      return `
<!-- Step ${stepIndex + 1}: ${step.title} -->
<!-- Form Name: ${formOptions.formTitle || 'Form'} - Step ${stepIndex + 1} -->
${step.description ? `<p class="step-description">${step.description}</p>` : ''}

${stepFields}

<!-- Navigation for Step ${stepIndex + 1} -->
${stepIndex > 0 ? '[submit "Previous" "btn-secondary step-prev"]' : ''}
${stepIndex < steps.length - 1 ? '[submit "Next" "btn-primary step-next"]' : '[submit "Submit" "btn-primary"]'}

<!-- Step Progress: ${stepIndex + 1}/${steps.length} -->
`;
    });

    return `<!-- Multi-Step Contact Form 7 Export -->
<!-- Total Steps: ${steps.length} -->
<!-- Note: CF7 doesn't natively support multi-step forms. Use with a multi-step plugin like "Multi-Step for Contact Form 7" -->
<!-- Form Title: ${formOptions.formTitle || 'Multi-Step Form'} -->
${formOptions.formDescription ? `<!-- Form Description: ${formOptions.formDescription} -->` : ''}

${stepForms.join('\n\n<!-- End of Step -->\n\n')}

<!-- Wizard Navigation CSS (add to your theme) -->
<!-- 
<style>
.wizard-form .step { display: none; }
.wizard-form .step.active { display: block; }
.wizard-navigation { margin-top: 20px; }
.step-progress { 
  background: #f0f0f0; 
  height: 4px; 
  margin-bottom: 20px; 
}
.step-progress-fill { 
  background: #007cba; 
  height: 100%; 
  transition: width 0.3s ease; 
}
</style>
-->`;
  } else {
    // Generate single-step CF7 form
    const fieldsCf7 = formElements
      .filter(el => el.type !== 'pageBreak')
      .map(generateFieldCf7)
      .join('\n');

    return `<!-- Contact Form 7 Export -->
<!-- Form: ${formOptions.formTitle || 'Contact Form'} -->
${formOptions.formDescription ? `<!-- Description: ${formOptions.formDescription} -->` : ''}

${fieldsCf7}

[submit "${formOptions.submitButtonText || 'Submit'}"]`;
  }
}
