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

export function exportAsTypescriptComponent(formFields, formName = '', formOptions = {}) {
  const { steps, isWizard } = splitIntoSteps(formFields);

  // TypeScript interfaces
  const generateInterfaces = () => `
interface FormData {
  [key: string]: string | number | boolean | string[];
}

interface FormFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  formData: FormData;
}

${isWizard ? `
interface WizardStepProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}
` : ''}`;

  const generateFieldJsx = (field) => {
    // Always include conditionalLogic as exported from ConditionalLogicModal
    const logicAttr = field.conditionalLogic
      ? `data-conditional-logic='${JSON.stringify(field.conditionalLogic)}'`
      : '';
    const required = field.required ? 'required' : '';
    const placeholder = field.placeholder || field.label || '';
    const helpText = field.helpText ? `      <div className="form-text">${field.helpText}</div>` : '';
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
      <label htmlFor="${id}" className="form-label">${label}${field.required ? ' *' : ''}</label>
      <input
        type="${field.type === 'website' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}"
        className={"form-control${customClass}"}
        id="${id}"
        name="${name}"
        placeholder="${placeholder}"
        ${required} ${disabled}
        value={formData.${id} as string || ''}
        onChange={onChange}
        minLength={${field.minLength || 'undefined'}}
        maxLength={${field.maxLength || 'undefined'}}
        ${logicAttr}
      />
${helpText}
    </div>`;

      case 'paragraph':
        return `    <div key="${id}" className="mb-3">
      <label htmlFor="${id}" className="form-label">${label}${field.required ? ' *' : ''}</label>
      <textarea
        className={"form-control${customClass}"}
        id="${id}"
        name="${name}"
        placeholder="${placeholder}"
        rows={${field.size === 'small' ? '2' : field.size === 'large' ? '6' : '4'}}
        ${required} ${disabled}
        value={formData.${id} as string || ''}
        onChange={onChange}
        minLength={${field.minLength || 'undefined'}}
        maxLength={${field.maxLength || 'undefined'}}
        ${logicAttr}
      />
${helpText}
    </div>`;

      case 'select':
        const selectOptions = field.options || [{ label: 'Option 1', value: 'option1' }];
        return `    <div key="${id}" className="mb-3">
      <label htmlFor="${id}" className="form-label">${label}${field.required ? ' *' : ''}</label>
      <select
        className={"form-control form-select${customClass}"}
        id="${id}"
        name="${name}"
        ${required} ${disabled}
        value={formData.${id} as string || ''}
        onChange={onChange}
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
        <legend className="form-label">${label}${field.required ? ' *' : ''}</legend>
        ${radioOptions.map((opt, idx) => `
        <div className="form-check">
          <input
            className={"form-check-input${customClass}"}
            type="radio"
            id="${id}_${idx}"
            name="${name}"
            value="${opt.value}"
            checked={formData.${id} === '${opt.value}'}
            onChange={onChange}
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
        <legend className="form-label">${label}${field.required ? ' *' : ''}</legend>
        ${checkboxOptions.map((opt, idx) => `
        <div className="form-check">
          <input
            className={"form-check-input${customClass}"}
            type="checkbox"
            id="${id}_${idx}"
            name="${name}[]"
            value="${opt.value}"
            checked={Array.isArray(formData.${id}) && (formData.${id} as string[]).includes('${opt.value}')}
            onChange={onChange}
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
      <label htmlFor="${id}" className="form-label">${label}${field.required ? ' *' : ''}</label>
      <input
        type="number"
        className={"form-control${customClass}"}
        id="${id}"
        name="${name}"
        placeholder="${placeholder}"
        ${required} ${disabled}
        value={formData.${id} as number || ''}
        onChange={onChange}
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
    // Generate wizard TypeScript component
    const wizardStepsJsx = steps.map((step, stepIndex) => `
const Step${stepIndex}: React.FC<WizardStepProps> = ({ formData, onChange }) => (
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

    return `import React, { useState, FormEvent, ChangeEvent } from 'react';

${generateInterfaces()}

const WizardForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({});
  const totalSteps = ${steps.length};

  const handleNext = (): void => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

${wizardStepsJsx}

  const steps: React.FC<WizardStepProps>[] = [${steps.map((_, index) => `Step${index}`).join(', ')}];
  const CurrentStep = steps[currentStep];

  return (
    <div className="wizard-form-container">
      ${formOptions.formTitle ? `<h1 className="form-title">${formOptions.formTitle}</h1>` : ''}
      ${formOptions.formDescription ? `<p className="form-description">${formOptions.formDescription}</p>` : ''}
      
      <form onSubmit={handleSubmit}>
        <div className="wizard-progress">
          <div className="progress-info">Step {currentStep + 1} of {totalSteps}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: \`\${((currentStep + 1) / totalSteps) * 100}%\` }}
            />
          </div>
        </div>

        <CurrentStep formData={formData} onChange={handleInputChange} />

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
    // Generate single-step TypeScript component
    const fieldsJsx = formFields
      .filter(el => el.type !== 'pageBreak')
      .map(generateFieldJsx)
      .join('\n');

    return `import React, { useState, FormEvent, ChangeEvent } from 'react';

${generateInterfaces()}

const ExportedForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="form-container">
      ${formOptions.formTitle ? `<h1 className="form-title">${formOptions.formTitle}</h1>` : ''}
      ${formOptions.formDescription ? `<p className="form-description">${formOptions.formDescription}</p>` : ''}
      
      <form onSubmit={handleSubmit}>
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
