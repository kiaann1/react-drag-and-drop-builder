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

export function exportAsHtml(formElements, formName = '', formOptions = {}, hexToRgb = () => '13, 110, 253') {
  const { steps, isWizard } = splitIntoSteps(formElements);
  
  // Generate CSS styles
  const generateStyles = () => {
    const primaryColor = formOptions.submitButtonColor || '#3B82F6';
    const primaryRgb = hexToRgb(primaryColor);
    
    return `
    <style>
      /* Form Container Styles */
      .form-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: ${formOptions.containerBackgroundColor || '#F9FAFB'};
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      /* Form Title */
      .form-title {
        color: ${formOptions.titleColor || '#1F2937'};
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
      }
      
      .form-description {
        color: ${formOptions.descriptionColor || '#6B7280'};
        margin-bottom: 24px;
      }
      
      /* Wizard Styles */
      .wizard-container {
        display: ${isWizard ? 'block' : 'none'};
      }
      
      .wizard-step {
        display: none;
      }
      
      .wizard-step.active {
        display: block;
      }
      
      .wizard-navigation {
        background: white;
        border-top: 1px solid #e5e7eb;
        padding: 16px;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .wizard-progress {
        flex: 1;
        max-width: 400px;
        margin-right: 24px;
      }
      
      .progress-bar {
        background: #e5e7eb;
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .progress-fill {
        background: ${primaryColor};
        height: 100%;
        transition: width 0.3s ease;
      }
      
      .step-indicators {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
      }
      
      .step-indicator {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        background: #e5e7eb;
        color: #6b7280;
        transition: all 0.3s ease;
      }
      
      .step-indicator.active,
      .step-indicator.completed {
        background: ${primaryColor};
        color: white;
      }
      
      /* Form Field Styles */
      .form-group {
        margin-bottom: 16px;
      }
      
      .form-label {
        display: block;
        font-weight: 500;
        margin-bottom: 4px;
        color: ${formOptions.labelTextColor || '#374151'};
      }
      
      .form-control {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid ${formOptions.inputBorderColor || '#D1D5DB'};
        border-radius: 6px;
        background-color: ${formOptions.backgroundColor || '#FFFFFF'};
        color: ${formOptions.inputTextColor || '#111827'};
        font-size: 14px;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }
      
      .form-control:focus {
        outline: none;
        border-color: ${formOptions.inputFocusBorderColor || '#3B82F6'};
        box-shadow: 0 0 0 3px rgba(${primaryRgb}, 0.1);
      }
      
      .form-control::placeholder {
        color: ${formOptions.placeholderTextColor || '#9CA3AF'};
      }
      
      .form-text {
        font-size: 12px;
        color: #6b7280;
        margin-top: 4px;
      }
      
      /* Button Styles */
      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
        text-decoration: none;
        display: inline-block;
        text-align: center;
      }
      
      .btn-primary {
        background-color: ${formOptions.submitButtonColor || '#3B82F6'};
        color: ${formOptions.submitButtonTextColor || '#FFFFFF'};
      }
      
      .btn-primary:hover {
        background-color: ${formOptions.submitButtonHoverColor || '#2563EB'};
      }
      
      .btn-secondary {
        background-color: #6b7280;
        color: white;
        border: 1px solid #6b7280;
      }
      
      .btn-secondary:hover {
        background-color: #4b5563;
      }
      
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      /* Width Classes */
      .w-full { width: 100%; }
      .w-1\\/2 { width: 50%; padding-right: 8px; display: inline-block; vertical-align: top; }
      .w-1\\/3 { width: 33.333%; padding-right: 8px; display: inline-block; vertical-align: top; }
      .w-1\\/4 { width: 25%; padding-right: 8px; display: inline-block; vertical-align: top; }
      
      /* Responsive */
      @media (max-width: 768px) {
        .w-1\\/2, .w-1\\/3, .w-1\\/4 {
          width: 100%;
          padding-right: 0;
          display: block;
        }
        
        .wizard-navigation {
          flex-direction: column;
          gap: 16px;
        }
        
        .wizard-progress {
          margin-right: 0;
          width: 100%;
        }
      }
    </style>`;
  };

  // Generate JavaScript for wizard functionality
  const generateWizardScript = () => {
    if (!isWizard) return '';
    
    return `
    <script>
      class FormWizard {
        constructor() {
          this.currentStep = 0;
          this.totalSteps = ${steps.length};
          this.init();
        }
        
        init() {
          this.updateDisplay();
          this.bindEvents();
        }
        
        bindEvents() {
          const nextBtns = document.querySelectorAll('.wizard-next');
          const prevBtns = document.querySelectorAll('.wizard-prev');
          const submitBtn = document.querySelector('.wizard-submit');
          
          nextBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              this.nextStep();
            });
          });
          
          prevBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              this.prevStep();
            });
          });
          
          if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
              e.preventDefault();
              this.submitForm();
            });
          }
        }
        
        nextStep() {
          if (this.validateCurrentStep() && this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.updateDisplay();
          }
        }
        
        prevStep() {
          if (this.currentStep > 0) {
            this.currentStep--;
            this.updateDisplay();
          }
        }
        
        updateDisplay() {
          // Hide all steps
          document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
          });
          
          // Show current step
          const currentStepEl = document.querySelector(\`.wizard-step[data-step="\${this.currentStep}"]\`);
          if (currentStepEl) {
            currentStepEl.classList.add('active');
          }
          
          // Update progress bar
          const progress = ((this.currentStep + 1) / this.totalSteps) * 100;
          const progressBar = document.querySelector('.progress-fill');
          if (progressBar) {
            progressBar.style.width = progress + '%';
          }
          
          // Update step indicators
          document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index < this.currentStep) {
              indicator.classList.add('completed');
            } else if (index === this.currentStep) {
              indicator.classList.add('active');
            }
          });
          
          // Update step info
          const stepInfo = document.querySelector('.wizard-step-info');
          if (stepInfo) {
            stepInfo.textContent = \`Step \${this.currentStep + 1} of \${this.totalSteps}\`;
          }
        }
        
        validateCurrentStep() {
          const currentStepEl = document.querySelector(\`.wizard-step[data-step="\${this.currentStep}"]\`);
          if (!currentStepEl) return true;
          
          const requiredFields = currentStepEl.querySelectorAll('[required]');
          let isValid = true;
          
          requiredFields.forEach(field => {
            if (!field.value.trim()) {
              field.style.borderColor = '#ef4444';
              isValid = false;
            } else {
              field.style.borderColor = '';
            }
          });
          
          if (!isValid) {
            alert('Please fill in all required fields before proceeding.');
          }
          
          return isValid;
        }
        
        submitForm() {
          if (this.validateCurrentStep()) {
            // Collect all form data
            const formData = new FormData(document.querySelector('#wizardForm'));
            const data = Object.fromEntries(formData.entries());
            
            // You can customize this to submit to your endpoint
            console.log('Form submitted:', data);
            alert('Form submitted successfully!');
          }
        }
      }
      
      // Initialize wizard when DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        new FormWizard();
      });
    </script>`;
  };
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
