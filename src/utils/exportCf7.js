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
    // Simple CF7 multi-step format compatible with WordPress plugins
    const stepSections = steps.map((step, stepIndex) => {
      const stepFields = step.fields.map(element => generateFieldCf7(element, formOptions, true)).filter(f => f).join('\n\n');
      
      return `<!-- ========== STEP ${stepIndex + 1}: ${step.title.toUpperCase()} ========== -->
${step.description ? `<!-- ${step.description} -->` : ''}

${stepFields}

<!-- ========== END STEP ${stepIndex + 1} ========== -->`;
    });
    
    return `<!-- MULTI-STEP CONTACT FORM 7 -->
<!-- IMPORTANT: Install a CF7 multi-step plugin first! -->
<!-- Recommended: "CF7 Multi-Step Forms" from WordPress repository -->

${stepSections.join('\n\n')}

[submit "${formOptions.submitButtonText || 'Send'}"]

<!-- PLUGIN SETUP INSTRUCTIONS -->
<!-- 1. Install "CF7 Multi-Step Forms" plugin -->
<!-- 2. In CF7 form editor, wrap each step with [step] shortcodes -->
<!-- 3. Example: [step step_name="step1"]...fields...[/step] -->
<!-- 4. The plugin will handle navigation automatically -->

<!-- ALTERNATIVE PLUGIN-READY FORMAT -->
<!-- Copy this version if your plugin uses different syntax: -->

[step step_name="step1" step_title="${steps[0]?.title || 'Step 1'}"]
${steps[0]?.fields.map(element => generateFieldCf7(element, formOptions, false)).filter(f => f).join('\n') || ''}
[/step]

${steps.slice(1).map((step, index) => `
[step step_name="step${index + 2}" step_title="${step.title}"]
${step.fields.map(element => generateFieldCf7(element, formOptions, false)).filter(f => f).join('\n')}
[/step]`).join('')}

[submit "${formOptions.submitButtonText || 'Send'}"]`;
  }
  
  // Single step form - clean and simple
  const fieldsCf7 = formElements.map(element => generateFieldCf7(element, formOptions, true)).filter(f => f).join('\n\n');
  
  return `<!-- CONTACT FORM 7 SHORTCODE -->
<!-- Ready to paste into WordPress Contact Form 7 -->

${fieldsCf7}

[submit "${formOptions.submitButtonText || 'Send'}"]`;
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

function generateFieldCf7(element, formOptions = {}, includeLabel = true) {
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

  if (includeLabel) {
    const label = element.label || name;
    const helpText = element.helpText ? `<!-- Help: ${element.helpText} -->` : '';
    
    return `${logicComment}${label}${element.required ? ' *' : ''}
${fieldShortcode}
${helpText}`;
  } else {
    return `${logicComment}${fieldShortcode}`;
  }
}

