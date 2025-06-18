export function exportAsReactComponent(formElements, formOptions = {}) {
  const fieldsJsx = formElements
    .map((field) => {
      // Include all field settings and conditional logic as props/data attributes
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
`;
}
