export function exportAsHtml(formElements, formName = '', formOptions = {}, hexToRgb = () => '13, 110, 253') {
  // Build HTML for each field, including all settings and conditional logic as data attributes
  const htmlElements = formElements.map(element => {
    // Always include conditionalLogic as exported from ConditionalLogicModal
    const logicAttr = element.conditionalLogic
      ? ` data-conditional-logic='${JSON.stringify(element.conditionalLogic)}'`
      : '';
    const required = element.required ? 'required' : '';
    const placeholder = element.placeholder || element.label || '';
    const helpText = element.helpText ? `<div class="form-text">${element.helpText}</div>` : '';
    const showAsterisk = element.required && formOptions.showRequiredAsterisk !== false;
    const customClass = element.customClass ? ` ${element.customClass}` : '';
    const disabled = element.disabled ? 'disabled' : '';
    const label = element.label || element.id || '';
    const id = element.id || '';
    const name = element.id || '';
    const widthClass = element.width && element.width !== 'full'
      ? (element.width === 'half' ? 'w-1/2 pr-2' : element.width === 'third' ? 'w-1/3 pr-2' : element.width === 'quarter' ? 'w-1/4 pr-2' : 'w-full')
      : 'w-full';

    switch (element.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'name':
      case 'firstName':
      case 'lastName':
      case 'company':
      case 'jobTitle':
      case 'address':
      case 'city':
      case 'zipCode':
      case 'website':
        return `<div class="mb-3 ${widthClass}">
  <label for="${id}" class="form-label">${label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
  <input 
    type="${element.type === 'website' ? 'url' : element.type === 'phone' ? 'tel' : 'text'}"
    class="form-control${customClass}" 
    id="${id}" 
    name="${name}" 
    placeholder="${placeholder}" 
    ${required} ${disabled}
    ${element.defaultValue ? `value="${element.defaultValue}"` : ''}
    ${element.minLength ? `minlength="${element.minLength}"` : ''}
    ${element.maxLength ? `maxlength="${element.maxLength}"` : ''}
    ${logicAttr}
  >
  ${helpText}
</div>`;
      case 'paragraph':
        return `<div class="mb-3 ${widthClass}">
  <label for="${id}" class="form-label">${label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
  <textarea 
    class="form-control${customClass}" 
    id="${id}" 
    name="${name}" 
    rows="${element.size === 'small' ? '2' : element.size === 'large' ? '6' : '4'}" 
    placeholder="${placeholder}" 
    ${required} ${disabled}
    ${element.minLength ? `minlength="${element.minLength}"` : ''}
    ${element.maxLength ? `maxlength="${element.maxLength}"` : ''}
    ${logicAttr}
  >${element.defaultValue || ''}</textarea>
  ${helpText}
</div>`;
      case 'select':
        const options = (element.options || []).map(opt =>
          `<option value="${opt.value}"${element.defaultValue === opt.value ? ' selected' : ''}>${opt.label}</option>`
        ).join('\n') || `<option value="">No options available</option>`;
        return `<div class="mb-3 ${widthClass}">
  <label for="${id}" class="form-label">${label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
  <select class="form-select${customClass}" id="${id}" name="${name}" ${required} ${disabled} ${logicAttr}>
    <option value="">${placeholder || 'Select an option'}</option>
    ${options}
  </select>
  ${helpText}
</div>`;
      case 'checkbox':
        const checkboxOptions = (element.options || []).map((opt, idx) =>
          `<div class="form-check">
    <input class="form-check-input${customClass}" type="checkbox" name="${name}" id="${id}_${idx}" value="${opt.value}" ${logicAttr} ${disabled}>
    <label class="form-check-label" for="${id}_${idx}">${opt.label}</label>
  </div>`
        ).join('\n') || '';
        return `<div class="mb-3 ${widthClass}">
  <label class="form-label">${label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
  ${checkboxOptions}
  ${helpText}
</div>`;
      case 'radio':
        const radioOptions = (element.options || []).map((opt, idx) =>
          `<div class="form-check">
    <input class="form-check-input${customClass}" type="radio" name="${name}" id="${id}_${idx}" value="${opt.value}" ${element.defaultValue === opt.value ? 'checked' : ''} ${required} ${logicAttr} ${disabled}>
    <label class="form-check-label" for="${id}_${idx}">${opt.label}</label>
  </div>`
        ).join('\n') || '';
        return `<div class="mb-3 ${widthClass}">
  <label class="form-label">${label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
  ${radioOptions}
  ${helpText}
</div>`;
      case 'number':
        return `<div class="mb-3 ${widthClass}">
  <label for="${id}" class="form-label">${label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
  <input 
    type="number"
    class="form-control${customClass}" 
    id="${id}" 
    name="${name}" 
    placeholder="${placeholder}" 
    ${required} ${disabled}
    ${element.defaultValue ? `value="${element.defaultValue}"` : ''}
    ${element.min !== undefined ? `min="${element.min}"` : ''}
    ${element.max !== undefined ? `max="${element.max}"` : ''}
    ${element.step !== undefined ? `step="${element.step}"` : ''}
    ${logicAttr}
  >
  ${helpText}
</div>`;
      // Add more cases as needed for other field types...
      default:
        return '';
    }
  }).join('\n\n');


  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formOptions.formTitle || formName}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background-color: ${formOptions.containerBackgroundColor || '#f8f9fa'}; }
    .form-container { background-color: ${formOptions.backgroundColor || '#ffffff'}; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);}
    .form-label { color: ${formOptions.labelTextColor || '#212529'}; font-weight: 500; }
    .form-control, .form-select { color: ${formOptions.inputTextColor || '#212529'}; border-color: ${formOptions.inputBorderColor || '#ced4da'}; background-color: ${formOptions.backgroundColor || '#ffffff'}; }
    .form-control:focus, .form-select:focus { border-color: ${formOptions.inputFocusBorderColor || '#86b7fe'}; box-shadow: 0 0 0 0.25rem rgba(${formOptions.inputFocusBorderColor ? hexToRgb(formOptions.inputFocusBorderColor) : '13, 110, 253'}, 0.25);}
    .form-control::placeholder { color: ${formOptions.placeholderTextColor || '#6c757d'}; }
    .btn-primary { background-color: ${formOptions.submitButtonColor || '#0d6efd'}; border-color: ${formOptions.submitButtonColor || '#0d6efd'}; color: ${formOptions.submitButtonTextColor || '#ffffff'}; }
    .btn-primary:hover { background-color: ${formOptions.submitButtonHoverColor || '#0b5ed7'}; border-color: ${formOptions.submitButtonHoverColor || '#0b5ed7'}; }
    .form-title { color: ${formOptions.labelTextColor || '#212529'}; margin-bottom: ${formOptions.formDescription ? '1rem' : '2rem'}; }
    .form-description { color: ${formOptions.labelTextColor || '#6c757d'}; margin-bottom: 2rem; }
  </style>
</head>
<body>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="form-container p-4">
          ${formOptions.formTitle ? `<h2 class="form-title text-center">${formOptions.formTitle}</h2>` : ''}
          ${formOptions.formDescription ? `<p class="form-description text-center">${formOptions.formDescription}</p>` : ''}
          <form id="bootstrapForm" novalidate>
            ${htmlElements}
            <div class="d-grid mt-4">
              <button type="submit" class="btn btn-primary btn-lg">${formOptions.submitButtonText || 'Submit Form'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// If you have any conditional logic evaluation, update it as follows:
function evaluateCondition(rule, formValues) {
  const { field, operator, value } = rule;
  const fieldValue = formValues[field];

  switch (operator) {
    case 'equals': return fieldValue == value;
    case 'notEquals': return fieldValue != value;
    case 'contains': return String(fieldValue ?? '').includes(value);
    case 'greaterThan': return Number(fieldValue) > Number(value);
    case 'lessThan': return Number(fieldValue) < Number(value);
    case 'isEmpty': return !fieldValue || fieldValue === '';
    case 'isNotEmpty': return !!fieldValue && fieldValue !== '';
    case 'startsWith': return String(fieldValue ?? '').startsWith(value);
    case 'endsWith': return String(fieldValue ?? '').endsWith(value);
    case 'matches':
      try { return new RegExp(value).test(fieldValue ?? ''); } catch { return false; }
    case 'in':
      return value.split(',').map(v => v.trim()).includes(fieldValue);
    case 'notIn':
      return !value.split(',').map(v => v.trim()).includes(fieldValue);
    case 'checked':
    case 'isChecked':
      if (Array.isArray(fieldValue)) {
        if (value && value !== '') {
          return fieldValue.includes(value);
        }
        return fieldValue.length > 0;
      }
      if (typeof fieldValue === 'string') {
        if (value && value !== '') {
          return fieldValue === value;
        }
        return !!fieldValue;
      }
      return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    case 'notChecked':
      if (Array.isArray(fieldValue)) {
        if (value && value !== '') {
          return !fieldValue.includes(value);
        }
        return fieldValue.length === 0;
      }
      if (typeof fieldValue === 'string') {
        if (value && value !== '') {
          return fieldValue !== value;
        }
        return !fieldValue;
      }
      return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
    case 'true': return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    case 'false': return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
    default: return true;
  }
}
