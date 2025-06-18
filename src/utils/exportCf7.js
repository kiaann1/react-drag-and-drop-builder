export function exportAsCf7(formElements, formOptions = {}) {
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

  const fieldsCf7 = formElements.map(element => {
    // Always include conditionalLogic as exported from ConditionalLogicModal
    const logicComment = element.conditionalLogic
      ? `<!-- conditionalLogic: ${JSON.stringify(element.conditionalLogic)} -->\n`
      : '';
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
  }).join('\n');

  return `
<!-- Contact Form 7 Shortcode -->
${fieldsCf7}
[submit "${formOptions.submitButtonText || 'Send'}"]
`;
}
