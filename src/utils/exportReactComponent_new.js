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

export function exportAsReactComponent(formElements, formOptions = {}) {
  const { steps, isWizard } = splitIntoSteps(formElements);
  
  const generateFieldJsx = (field) => {
    // Always include conditionalLogic as exported from ConditionalLogicModal
    const logicAttr = field.conditionalLogic
      ? `data-conditional-logic='${JSON.stringify(field.conditionalLogic)}'`
      : '';
    const required = field.required ? 'required' : '';
    const placeholder = field.placeholder || field.label || '';
    const helpText = field.helpText
      ? `      <div className="form-text">${field.helpText}</div>`
      : '';
    const customClass = field.customClass ? ` ${field.customClass}` : '';
    const disabled = field.disabled ? 'disabled' : '';
    const label = field.label || field.id || '';
    const id = field.id || '';
    const name = field.id || '';
    
    // Skip pageBreak elements
    if (field.type === 'pageBreak') {
      return '';
    }

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
        return `    <div key="${id}" className="mb-3">
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

      case 'paragraph':
        return `    <div key="${id}" className="mb-3">
      <label htmlFor="${id}" className="form-label">${label}${
          field.required ? ' *' : ''
        }</label>
      <textarea
        className={"form-control${customClass}"}
        id="${id}"
        name="${name}"
        placeholder="${placeholder}"
        rows={${field.size === 'small' ? '2' : field.size === 'large' ? '6' : '4'}}
        ${required} ${disabled}
        defaultValue={${JSON.stringify(field.defaultValue || '')}}
        minLength={${field.minLength || 'undefined'}}
        maxLength={${field.maxLength || 'undefined'}}
        ${logicAttr}
      />
${helpText}
    </div>`;

      case 'select':
        const selectOptions = field.options || [{ label: 'Option 1', value: 'option1' }];
        return `    <div key="${id}" className="mb-3">
      <label htmlFor="${id}" className="form-label">${label}${
          field.required ? ' *' : ''
        }</label>
      <select
        className={"form-control form-select${customClass}"}
        id="${id}"
        name="${name}"
        ${required} ${disabled}
        defaultValue={${JSON.stringify(field.defaultValue || '')}}
        ${logicAttr}
      >
        <option value="">${placeholder || 'Select an option'}</option>
        ${selectOptions.map(opt => 
          `<option value="${opt.value}">${opt.label}</option>`
        ).join('\n        ')}
      </select>
${helpText}
    </div>`;

      case 'radio':
        const radioOptions = field.options || [{ label: 'Option 1', value: 'option1' }];
        return `    <div key="${id}" className="mb-3">
      <fieldset>
        <legend className="form-label">${label}${
          field.required ? ' *' : ''
        }</legend>
        ${radioOptions.map((opt, idx) => `
        <div className="form-check">
          <input
            className={"form-check-input${customClass}"}
            type="radio"
            id="${id}_${idx}"
            name="${name}"
            value="${opt.value}"
            defaultChecked={${field.defaultValue === opt.value}}
            ${required && idx === 0 ? 'required' : ''} ${disabled}
            ${logicAttr}
          />
          <label className="form-check-label" htmlFor="${id}_${idx}">
            ${opt.label}
          </label>
        </div>`).join('\n        ')}
      </fieldset>
${helpText}
    </div>`;

      case 'checkbox':
        const checkboxOptions = field.options || [{ label: 'Checkbox 1', value: 'checkbox1' }];
        return `    <div key="${id}" className="mb-3">
      <fieldset>
        <legend className="form-label">${label}${
          field.required ? ' *' : ''
        }</legend>
        ${checkboxOptions.map((opt, idx) => `
        <div className="form-check">
          <input
            className={"form-check-input${customClass}"}
            type="checkbox"
            id="${id}_${idx}"
            name="${name}[]"
            value="${opt.value}"
            defaultChecked={${Array.isArray(field.defaultValue) && field.defaultValue.includes(opt.value)}}
            ${disabled}
            ${logicAttr}
          />
          <label className="form-check-label" htmlFor="${id}_${idx}">
            ${opt.label}
          </label>
        </div>`).join('\n        ')}
      </fieldset>
${helpText}
    </div>`;

      case 'number':
        return `    <div key="${id}" className="mb-3">
      <label htmlFor="${id}" className="form-label">${label}${
          field.required ? ' *' : ''
        }</label>
      <input
        type="number"
        className={"form-control${customClass}"}
        id="${id}"
        name="${name}"
        placeholder="${placeholder}"
        ${required} ${disabled}
        defaultValue={${JSON.stringify(field.defaultValue || '')}}
        min={${field.min !== undefined ? field.min : 'undefined'}}
        max={${field.max !== undefined ? field.max : 'undefined'}}
        step={${field.step !== undefined ? field.step : 'undefined'}}
        ${logicAttr}
      />
${helpText}
    </div>`;

      default:
        return '';
    }
  };

  if (isWizard) {
    // Generate wizard React component
    const wizardStepsJsx = steps.map((step, stepIndex) => `
  const Step${stepIndex} = () => (
    <div className="wizard-step" data-step="${stepIndex}">
      <div className="step-header">
        <h3 className="step-title">${step.title}</h3>
        ${step.description ? `<p className="step-description">${step.description}</p>` : ''}
      </div>
      <div className="step-content">
${step.fields.map(generateFieldJsx).join('\n')}
      </div>
    </div>
  );`).join('\n');

    return `import React, { useState } from 'react';

const WizardForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const totalSteps = ${steps.length};

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

${wizardStepsJsx}

  const steps = [${steps.map((_, index) => `Step${index}`).join(', ')}];
  const CurrentStep = steps[currentStep];

  return (
    <div className="wizard-form-container">
      ${formOptions.formTitle ? `<h1 className="form-title">${formOptions.formTitle}</h1>` : ''}
      ${formOptions.formDescription ? `<p className="form-description">${formOptions.formDescription}</p>` : ''}
      
      <form onSubmit={handleSubmit} onChange={handleInputChange}>
        <div className="wizard-progress">
          <div className="progress-info">Step {currentStep + 1} of {totalSteps}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: \`\${((currentStep + 1) / totalSteps) * 100}%\` }}
            />
          </div>
        </div>

        <CurrentStep />

        <div className="wizard-navigation">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="btn btn-secondary"
          >
            ${formOptions.prevButtonText || 'Previous'}
          </button>
          
          {currentStep === totalSteps - 1 ? (
            <button type="submit" className="btn btn-primary">
              ${formOptions.submitButtonText || 'Submit'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              ${formOptions.nextButtonText || 'Next'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WizardForm;`;
  } else {
    // Generate single-step React component
    const fieldsJsx = formElements
      .filter(el => el.type !== 'pageBreak')
      .map(generateFieldJsx)
      .join('\n');

    return `import React, { useState } from 'react';

const ExportedForm = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="form-container">
      ${formOptions.formTitle ? `<h1 className="form-title">${formOptions.formTitle}</h1>` : ''}
      ${formOptions.formDescription ? `<p className="form-description">${formOptions.formDescription}</p>` : ''}
      
      <form onSubmit={handleSubmit} onChange={handleInputChange}>
${fieldsJsx}
        <button type="submit" className="btn btn-primary">
          ${formOptions.submitButtonText || 'Submit Form'}
        </button>
      </form>
    </div>
  );
};

export default ExportedForm;`;
  }
}

// Conditional logic evaluation utilities (for reference)
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
    case 'true':
    case 'isTrue':
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
    case 'false':
      return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
    default: return true;
  }
}

function evaluateLogic(conditionalLogic, formValues) {
  if (!conditionalLogic || !conditionalLogic.rules || conditionalLogic.rules.length === 0) return true;
  const { rules, combinator, action } = conditionalLogic;
  const results = rules.map(rule => evaluateCondition(rule, formValues));
  const passed = (combinator === 'OR' ? results.some(Boolean) : results.every(Boolean));
  if (action === 'show') return passed;
  if (action === 'hide') return !passed;
  return true;
}
