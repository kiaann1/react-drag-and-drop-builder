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
  
  if (isWizard) {
    // For wizard forms, create one CF7 form per step
    const stepForms = steps.map((step, stepIndex) => {
      const stepFields = step.fields.map(element => generateFieldCf7(element, formOptions)).filter(f => f).join('\n');
      
      const navigationComments = [];
      if (stepIndex > 0) {
        navigationComments.push('<!-- Add previous step button with multi-step plugin -->');
      }
      if (stepIndex < steps.length - 1) {
        navigationComments.push('<!-- Add next step button with multi-step plugin -->');
      } else {
        navigationComments.push('<!-- This is the final step with submit button -->');
      }
      
      return `
<!-- Step ${stepIndex + 1}: ${step.title} -->
<!-- ${step.description} -->
${navigationComments.join('\n')}

${stepFields}

${stepIndex === steps.length - 1 ? `[submit "${formOptions.submitButtonText || 'Send'}"]` : '<!-- Next step button handled by multi-step plugin -->'}
`;
    });
    
    return `<!-- Multi-Step Contact Form 7 -->
<!-- Note: This requires a multi-step plugin like CF7 Multi-Step Forms -->
<!-- Each step should be a separate form or handled by your multi-step plugin -->

${stepForms.join('\n<!-- End Step -->\n')}

<!-- Wizard Structure -->
<!-- Steps: ${steps.map(s => s.title).join(' -> ')} -->`;
  }
  
  // Single step form
  const fieldsCf7 = formElements.map(element => generateFieldCf7(element, formOptions)).filter(f => f).join('\n');
  
  return `
<!-- Contact Form 7 Shortcode -->
${fieldsCf7}
[submit "${formOptions.submitButtonText || 'Send'}"]
`;
}

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

function generateFieldCf7(element, formOptions = {}) {
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
    case 'file':
      fieldShortcode = `[file${required} ${name}]`;
      break;
    default:
      fieldShortcode = `[${cf7Type}${required} ${name} placeholder "${element.placeholder || element.label || ''}"]`;
  }

  const helpText = element.helpText
    ? `<div style="font-size:12px;color:${formOptions.placeholderTextColor || '#9CA3AF'};margin-top:4px;">${element.helpText}</div>`
    : '';

  return `${logicComment}<div style="margin-bottom:18px;">
  <label style="display:block;font-weight:500;color:${formOptions.labelTextColor || '#374151'};margin-bottom:6px;">${element.label || name}${element.required ? ' *' : ''}</label>
  <span style="display:block;color:${formOptions.inputTextColor || '#111827'};margin-bottom:2px;">${fieldShortcode}</span>
  ${helpText}
</div>`;
}
