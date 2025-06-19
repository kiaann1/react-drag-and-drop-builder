export function exportAsReactComponent(formElements, formOptions = {}) {
  const fieldsJsx = formElements
    .map((field) => {
      // Always include conditionalLogic as exported from ConditionalLogicModal
      const logicAttr = field.conditionalLogic
        ? `data-conditional-logic='${JSON.stringify(field.conditionalLogic)}'`
        : '';
      const required = field.required ? 'required' : '';
      const placeholder = field.placeholder || field.label || '';
      const helpText = field.helpText
        ? `<div className="form-text">${field.helpText}</div>`
        : '';
      const customClass = field.customClass ? ` ${field.customClass}` : '';
      const disabled = field.disabled ? 'disabled' : '';
      const label = field.label || field.id || '';
      const id = field.id || '';
      const name = field.id || '';
      switch (field.type) {
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
          return `<div key="${id}" className="mb-3">
  <label htmlFor="${id}" className="form-label">${label}${
            field.required ? ' *' : ''
          }</label>
  <input
    type="${
      field.type === 'website'
        ? 'url'
        : field.type === 'phone'
        ? 'tel'
        : 'text'
    }"
    className={"form-control${customClass}"}
    id="${id}"
    name="${name}"
    placeholder="${placeholder}"
    ${required} ${disabled}
    defaultValue={${JSON.stringify(field.defaultValue || '')}}
    minLength={${field.minLength || 'undefined'}}
    maxLength={${field.maxLength || 'undefined'}}
    ${logicAttr}
  />
  ${helpText}
</div>`;
        // Add more cases as needed for other field types...
        default:
          return '';
      }
    })
    .join('\n    ');

  return `import React from 'react';

const ExportedForm = () => (
  <form>
    ${fieldsJsx}
    <button type="submit" className="btn btn-primary">${
      formOptions.submitButtonText || 'Submit Form'
    }</button>
  </form>
);

export default ExportedForm;

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
`;
}
