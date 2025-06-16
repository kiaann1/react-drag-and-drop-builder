import React, { useState } from 'react';

const SaveFormModal = ({ isOpen, onClose, formElements, formOptions = {} }) => {
  const [formName, setFormName] = useState(formOptions.formTitle || '');
  const [selectedFormat, setSelectedFormat] = useState('html');

  const exportFormats = [
    { value: 'html', label: 'HTML (Ready to Use)' },
    { value: 'wordpress', label: 'WordPress Shortcode' },
    { value: 'contact-form-7', label: 'Contact Form 7' },
    { value: 'json', label: 'JSON Data' },
    { value: 'react', label: 'React Component' },
    { value: 'typescript', label: 'TypeScript Component' },
    { value: 'vue', label: 'Vue Component' },
    { value: 'css-framework', label: 'HTML + Bootstrap' },
  ];

  const generateJSON = () => {
    return JSON.stringify({ name: formName, elements: formElements }, null, 2);
  };

  const generateWordPressShortcode = () => {
    const elementsShortcode = formElements.map(element => {
      const attrs = [
        `type="${element.type}"`,
        `name="${element.id}"`,
        element.required ? 'required' : '',
        element.placeholder ? `placeholder="${element.placeholder}"` : `placeholder="${element.label}"`,
        element.customClass ? `class="${element.customClass}"` : '',
      ].filter(attr => attr).join(' ');
      
      if (element.type === 'select' && element.options) {
        const options = element.options.map(opt => `"${opt.label}"`).join(' ');
        return `[select ${attrs} options="${options}"]`;
      }
      
      return `[${element.type} ${attrs}]`;
    }).join('\n');

    return `[contact-form-7 id="${Date.now()}" title="${formName}"]
<label> ${formName} </label>

${elementsShortcode}

[submit "Send"]
[/contact-form-7]`;
  };

  const generateContactForm7 = () => {
    const cf7Elements = formElements.map(element => {
      const required = element.required ? '*' : '';
      const id = element.id;
      
      switch (element.type) {
        case 'text':
        case 'input':
          return `<label> ${element.label}${required}
    [text${required} ${id} placeholder "${element.placeholder || element.label}"] </label>`;
        
        case 'email':
          return `<label> ${element.label}${required}
    [email${required} ${id} placeholder "${element.placeholder || element.label}"] </label>`;
        
        case 'textarea':
          return `<label> ${element.label}${required}
    [textarea${required} ${id} placeholder "${element.placeholder || element.label}"] </label>`;
        
        case 'select':
          const options = element.options?.map(opt => opt.label).join(' ') || 'Option 1 Option 2';
          return `<label> ${element.label}${required}
    [select${required} ${id} "${options}"] </label>`;
        
        case 'checkbox':
          return `<label> [checkbox ${id} "${element.label}"] </label>`;
        
        case 'radio':
          const radioOptions = element.options?.map(opt => opt.label).join(' ') || 'Option 1 Option 2';
          return `<label> ${element.label}${required}
    [radio${required} ${id} "${radioOptions}"] </label>`;
        
        case 'phone':
          return `<label> ${element.label}${required}
    [tel${required} ${id} placeholder "${element.placeholder || element.label}"] </label>`;
        
        case 'number':
          return `<label> ${element.label}${required}
    [number${required} ${id} placeholder "${element.placeholder || element.label}"] </label>`;
        
        case 'date':
          return `<label> ${element.label}${required}
    [date${required} ${id}] </label>`;
        
        default:
          return `<label> ${element.label}${required}
    [text${required} ${id} placeholder "${element.placeholder || element.label}"] </label>`;
      }
    }).join('\n\n');

    return `<div class="contact-form">
${cf7Elements}

[submit "Send Message"]
</div>`;
  };

  const generateReactComponent = () => {
    const componentName = formName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') || 'CustomForm';
    
    if (!formElements || formElements.length === 0) {
      return `import React, { useState } from 'react';

const ${componentName} = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="custom-form">
      <p>No form elements added</p>
    </form>
  );
};

export default ${componentName};`;
    }

    // Generate state fields based on form elements
    const stateFields = formElements.map((element, index) => {
      const fieldName = element?.id ? element.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${index}`;
      return `${fieldName}: ''`;
    }).join(',\n    ');

    // Generate form fields
    const formFields = formElements.map((element, index) => {
      const label = element?.label || 'Untitled';
      const type = element?.type || 'text';
      const fieldName = element?.id ? element.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${index}`;
      const placeholder = element?.placeholder || label;
      const required = element?.required ? 'required' : '';
      
      switch (type) {
        case 'text':
        case 'email':
        case 'phone':
        case 'password':
        case 'company':
          return `      <div className="form-group">
        <label htmlFor="${fieldName}">${label}${element?.required ? ' *' : ''}</label>
        <input
          type="${type === 'phone' ? 'tel' : type === 'company' ? 'text' : type}"
          id="${fieldName}"
          name="${fieldName}"
          value={formData.${fieldName} || ''}
          onChange={handleChange}
          placeholder="${placeholder}"
          className="form-input"
          ${required}
        />
      </div>`;
        case 'textarea':
          return `      <div className="form-group">
        <label htmlFor="${fieldName}">${label}${element?.required ? ' *' : ''}</label>
        <textarea
          id="${fieldName}"
          name="${fieldName}"
          value={formData.${fieldName} || ''}
          onChange={handleChange}
          placeholder="${placeholder}"
          className="form-textarea"
          ${required}
        />
      </div>`;
        case 'select':
          const options = element?.options || [];
          return `      <div className="form-group">
        <label htmlFor="${fieldName}">${label}${element?.required ? ' *' : ''}</label>
        <select
          id="${fieldName}"
          name="${fieldName}"
          value={formData.${fieldName} || ''}
          onChange={handleChange}
          className="form-select"
          ${required}
        >
          <option value="">Select ${label}</option>
          ${options.map(option => `<option value="${option}">${option}</option>`).join('\n          ')}
        </select>
      </div>`;
        case 'checkbox':
          return `      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="${fieldName}"
            checked={formData.${fieldName} || false}
            onChange={(e) => setFormData(prev => ({ ...prev, ${fieldName}: e.target.checked }))}
            className="form-checkbox"
          />
          ${label}${element?.required ? ' *' : ''}
        </label>
      </div>`;
        case 'button':
          return `      <button type="submit" className="form-button">
        ${label}
      </button>`;
        default:
          return `      <div className="form-element">${label}</div>`;
      }
    }).join('\n');

    return `import React, { useState } from 'react';

const ${componentName} = () => {
  const [formData, setFormData] = useState({
    ${stateFields}
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = [${formElements.filter(el => el?.required).map((el, idx) => {
      const fieldName = el?.id ? el.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${formElements.indexOf(el)}`;
      return `'${fieldName}'`;
    }).join(', ')}];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields: ' + missingFields.join(', '));
      return;
    }

    console.log('Form submitted:', formData);
    
    // Add your form submission logic here
    // Example: send to API
    // fetch('/api/submit-form', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="custom-form">
${formFields}
    </form>
  );
};

// CSS styles (add these to your CSS file)
const styles = \`
.custom-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.form-checkbox {
  margin-right: 8px;
  width: auto;
}

.form-button {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.form-button:hover {
  background: #0056b3;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
\`;

export default ${componentName};`;
  };

  const generateHTML = () => {
    if (!formElements || formElements.length === 0) {
      return `<!DOCTYPE html>
<html>
<head>
  <title>${formName || 'Form'}</title>
  <style>
    .custom-form { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <form class="custom-form">
    <p>No form elements added</p>
    <button type="submit" class="form-button">Submit</button>
  </form>
</body>
</html>`;
    }

    // Check if there's already a submit button, if not add one
    const hasSubmitButton = formElements.some(el => el?.type === 'button');

    // Generate comprehensive CSS with form options
    const generateCSS = () => {
      return `
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: ${formOptions.containerBackgroundColor || '#f5f5f5'};
    }
    
    .custom-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      background: ${formOptions.backgroundColor || 'white'};
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .form-title {
      color: ${formOptions.labelTextColor || '#333'};
      margin-bottom: ${formOptions.formDescription ? '10px' : '30px'};
      font-size: 24px;
      font-weight: bold;
    }
    
    .form-description {
      color: ${formOptions.labelTextColor || '#666'};
      margin-bottom: 30px;
      font-size: 16px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: ${formOptions.labelTextColor || '#333'};
      font-size: 14px;
    }
    
    .form-input,
    .form-textarea,
    .form-select {
      width: 100%;
      padding: 12px;
      border: 1px solid ${formOptions.inputBorderColor || '#ddd'};
      border-radius: 4px;
      font-size: 14px;
      color: ${formOptions.inputTextColor || '#111827'};
      background-color: ${formOptions.backgroundColor || '#FFFFFF'};
      transition: border-color 0.3s ease;
    }
    
    .form-input::placeholder,
    .form-textarea::placeholder {
      color: ${formOptions.placeholderTextColor || '#9CA3AF'};
    }
    
    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: ${formOptions.inputFocusBorderColor || '#007bff'};
      box-shadow: 0 0 0 2px rgba(${formOptions.inputFocusBorderColor ? hexToRgb(formOptions.inputFocusBorderColor) : '0, 123, 255'}, 0.25);
    }
    
    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .checkbox-group,
    .radio-group {
      margin-bottom: 20px;
    }
    
    .checkbox-label,
    .radio-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 8px;
      color: ${formOptions.labelTextColor || '#333'};
    }
    
    .form-checkbox,
    .form-radio {
      margin-right: 8px;
      width: auto;
    }
    
    .form-button {
      background: ${formOptions.submitButtonColor || '#007bff'};
      color: ${formOptions.submitButtonTextColor || 'white'};
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: background-color 0.3s ease;
      margin-top: 10px;
      width: 100%;
    }
    
    .form-button:hover {
      background: ${formOptions.submitButtonHoverColor || '#0056b3'};
    }
    
    .required {
      color: #e74c3c;
    }
    
    .help-text {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
      display: none;
    }
    
    .field-error {
      border-color: #e74c3c !important;
    }
    
    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 12px;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      margin-bottom: 20px;
      display: none;
    }`;
    };

    // Helper function to convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '0, 123, 255';
    };

    // Generate JavaScript with validation and form options
    const generateJS = () => {
      const requiredFields = formElements.filter(el => el?.required).map(el => el.id);
      const validationEnabled = formOptions.showValidationOnBlur || formOptions.showValidationOnSubmit;
      
      return `
    function handleSubmit(event) {
      event.preventDefault();
      
      const form = event.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Handle checkboxes separately
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        data[checkbox.name] = checkbox.checked;
      });
      
      ${validationEnabled ? `
      // Validation
      const requiredFields = [${requiredFields.map(id => `'${id}'`).join(', ')}];
      let hasErrors = false;
      
      // Clear previous errors
      document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');
      document.querySelectorAll('.field-error').forEach(field => field.classList.remove('field-error'));
      
      requiredFields.forEach(fieldName => {
        const field = form.querySelector('[name="' + fieldName + '"]');
        const value = data[fieldName];
        
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          hasErrors = true;
          ${formOptions.highlightErrorFields ? `
          if (field) {
            field.classList.add('field-error');
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) {
              errorMsg.style.display = 'block';
              errorMsg.textContent = 'This field is required';
            }
          }` : ''}
        }
      });
      
      if (hasErrors) {
        ${formOptions.errorMessage ? `alert('${formOptions.errorMessage}');` : `alert('Please fill in all required fields');`}
        return;
      }` : ''}
      
      console.log('Form submitted:', data);
      
      // Success handling
      ${formOptions.successMessage ? `
      const successDiv = document.createElement('div');
      successDiv.className = 'success-message';
      successDiv.style.display = 'block';
      successDiv.textContent = '${formOptions.successMessage}';
      form.insertBefore(successDiv, form.firstChild);` : ''}
      
      ${formOptions.redirectUrl ? `
      setTimeout(() => {
        window.location.href = '${formOptions.redirectUrl}';
      }, 2000);` : `
      // Replace with your form submission logic
      alert('Form submitted successfully! Check console for data.');`}
    }
    
    ${validationEnabled && formOptions.showValidationOnBlur ? `
    // Real-time validation on blur
    document.addEventListener('DOMContentLoaded', function() {
      const requiredFields = [${requiredFields.map(id => `'${id}'`).join(', ')}];
      
      requiredFields.forEach(fieldName => {
        const field = document.querySelector('[name="' + fieldName + '"]');
        if (field) {
          field.addEventListener('blur', function() {
            const value = this.value;
            const errorMsg = this.parentNode.querySelector('.error-message');
            
            if (!value || value.trim() === '') {
              this.classList.add('field-error');
              if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'This field is required';
              }
            } else {
              this.classList.remove('field-error');
              if (errorMsg) {
                errorMsg.style.display = 'none';
              }
            }
          });
        }
      });
    });` : ''}`;
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formName || 'Form'}</title>
  <style>${generateCSS()}</style>
</head>
<body>
  <form class="custom-form" onsubmit="handleSubmit(event)">
    ${formOptions.formTitle ? `<h2 class="form-title">${formOptions.formTitle}</h2>` : ''}
    ${formOptions.formDescription ? `<p class="form-description">${formOptions.formDescription}</p>` : ''}
    
${formElements.map((element, index) => {
  const label = element?.label || 'Untitled';
  const type = element?.type || 'text';
  const fieldName = element?.id || `field_${index}`;
  const placeholder = element?.placeholder || label;
  const required = element?.required ? 'required' : '';
  const helpText = element?.helpText || '';
  const showAsterisk = element?.required && formOptions.showRequiredAsterisk !== false;
  
  switch (type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'password':
    case 'company':
    case 'name':
    case 'firstName':
    case 'lastName':
    case 'address':
    case 'city':
    case 'zipCode':
    case 'website':
      return `    <div class="form-group">
      <label for="${fieldName}">${label}${showAsterisk ? ' <span class="required">*</span>' : ''}</label>
      <input 
        type="${type === 'phone' ? 'tel' : type === 'company' || type === 'name' || type === 'firstName' || type === 'lastName' || type === 'address' || type === 'city' || type === 'zipCode' ? 'text' : type === 'website' ? 'url' : type}" 
        id="${fieldName}" 
        name="${fieldName}" 
        placeholder="${placeholder}" 
        class="form-input" 
        ${required}
        ${element.defaultValue ? `value="${element.defaultValue}"` : ''}
      />
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
    
    case 'paragraph':
      return `    <div class="form-group">
      <label for="${fieldName}">${label}${showAsterisk ? ' <span class="required">*</span>' : ''}</label>
      <textarea 
        id="${fieldName}" 
        name="${fieldName}" 
        placeholder="${placeholder}" 
        class="form-textarea" 
        ${required}
        rows="${element.size === 'small' ? '2' : element.size === 'large' ? '6' : '4'}"
      >${element.defaultValue || ''}</textarea>
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
    
    case 'select':
      const options = element?.options || [];
      return `    <div class="form-group">
      <label for="${fieldName}">${label}${showAsterisk ? ' <span class="required">*</span>' : ''}</label>
      <select id="${fieldName}" name="${fieldName}" class="form-select" ${required}>
        <option value="">Select ${label}</option>
        ${options.map(option => `<option value="${option.value}"${element.defaultValue === option.value ? ' selected' : ''}>${option.label}</option>`).join('\n        ')}
      </select>
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
    
    case 'checkbox':
      const checkboxOptions = element?.options || [];
      return `    <div class="checkbox-group">
      <label class="form-group-label">${label}${showAsterisk ? ' <span class="required">*</span>' : ''}</label>
      ${checkboxOptions.map((option, idx) => `
      <label class="checkbox-label">
        <input type="checkbox" name="${fieldName}" class="form-checkbox" value="${option.value}" />
        ${option.label}
      </label>`).join('')}
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
    
    case 'radio':
      const radioOptions = element?.options || [];
      return `    <div class="radio-group">
      <label class="form-group-label">${label}${showAsterisk ? ' <span class="required">*</span>' : ''}</label>
      ${radioOptions.map((option, idx) => `
      <label class="radio-label">
        <input type="radio" name="${fieldName}" class="form-radio" value="${option.value}"${element.defaultValue === option.value ? ' checked' : ''} ${required} />
        ${option.label}
      </label>`).join('')}
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
    
    case 'number':
      return `    <div class="form-group">
      <label for="${fieldName}">${label}${showAsterisk ? ' <span class="required">*</span>' : ''}</label>
      <input 
        type="number" 
        id="${fieldName}" 
        name="${fieldName}" 
        placeholder="${placeholder}" 
        class="form-input" 
        ${required}
        ${element.min !== undefined ? `min="${element.min}"` : ''}
        ${element.max !== undefined ? `max="${element.max}"` : ''}
        ${element.step !== undefined ? `step="${element.step}"` : ''}
        ${element.defaultValue ? `value="${element.defaultValue}"` : ''}
      />
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
    
    case 'date':
    case 'time':
    case 'datetime':
      return `    <div class="form-group">
      <label for="${fieldName}">${label}${showAsterisk ? ' <span class="required">*</span>' : ''}</label>
      <input 
        type="${type === 'datetime' ? 'datetime-local' : type}" 
        id="${fieldName}" 
        name="${fieldName}" 
        class="form-input" 
        ${required}
        ${element.defaultValue ? `value="${element.defaultValue}"` : ''}
      />
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
    
    case 'file':
    case 'image':
      return `    <div class="form-group">
      <label for="${fieldName}">${label}${showAsterisk ? ' <span class="required">*</span>' : ''}</label>
      <input 
        type="file" 
        id="${fieldName}" 
        name="${fieldName}" 
        class="form-input" 
        ${required}
        ${type === 'image' ? 'accept="image/*"' : ''}
      />
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
    
    case 'button':
      return `    <button type="submit" class="form-button">${label}</button>`;
    
    default:
      return `    <div class="form-group">
      <label for="${fieldName}">${label}</label>
      <input type="text" id="${fieldName}" name="${fieldName}" placeholder="${placeholder}" class="form-input" />
      ${helpText ? `<div class="help-text">${helpText}</div>` : ''}
      <div class="error-message"></div>
    </div>`;
  }
}).join('\n')}
${!hasSubmitButton ? `    <button type="submit" class="form-button">${formOptions.submitButtonText || 'Submit Form'}</button>` : ''}
  </form>

  <script>${generateJS()}</script>
</body>
</html>`;
  };

  const generateVueComponent = () => {
    const componentName = formName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') || 'CustomForm';
    
    if (!formElements || formElements.length === 0) {
      return `<template>
  <form class="custom-form">
    <!-- No form elements -->
  </form>
</template>

<script>
export default {
  name: '${componentName}'
}
</script>`;
    }

    return `<template>
  <form class="custom-form">
${formElements.map(element => {
  const label = element?.label || 'Untitled';
  const type = element?.type || 'text';
  
  switch (type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'password':
    case 'company':
      return `    <input type="${type === 'phone' ? 'tel' : type === 'company' ? 'text' : type}" :placeholder="'${label}'" class="form-input" />`;
    case 'textarea':
      return `    <textarea :placeholder="'${label}'" class="form-textarea"></textarea>`;
    case 'button':
      return `    <button type="submit" class="form-button">${label}</button>`;
    case 'select':
      return `    <select class="form-select">
      <option value="">${label}</option>
    </select>`;
    default:
      return `    <div class="form-element">${label}</div>`;
  }
}).join('\n')}
  </form>
</template>

<script>
export default {
  name: '${componentName}'
}
</script>`;
  };

  const generateTypeScriptComponent = () => {
    const componentName = formName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') || 'CustomForm';
    
    if (!formElements || formElements.length === 0) {
      return `import React, { FC } from 'react';

const ${componentName}: FC = () => {
  return (
    <form className="custom-form">
      {/* No form elements */}
    </form>
  );
};

export default ${componentName};`;
    }
    
    return `import React, { FC } from 'react';

const ${componentName}: FC = () => {
  return (
    <form className="custom-form">
${formElements.map(element => {
  const label = element?.label || 'Untitled';
  const type = element?.type || 'text';
  
  switch (type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'password':
    case 'company':
      return `      <input type="${type === 'phone' ? 'tel' : type === 'company' ? 'text' : type}" placeholder="${label}" className="form-input" />`;
    case 'textarea':
      return `      <textarea placeholder="${label}" className="form-textarea"></textarea>`;
    case 'button':
      return `      <button type="submit" className="form-button">${label}</button>`;
    case 'select':
      return `      <select className="form-select">
        <option value="">${label}</option>
      </select>`;
    default:
      return `      <div className="form-element">${label}</div>`;
  }
}).join('\n')}
    </form>
  );
};

export default ${componentName};`;
  };

  const generateShortcode = () => {
    if (!formElements || formElements.length === 0) {
      return `[form name="${formName || 'Untitled Form'}"]
[/form]`;
    }

    const elementsShortcode = formElements.map(element => {
      const type = element?.type || 'text';
      const label = element?.label || 'Untitled';
      const attrs = [
        `type="${type}"`,
        `label="${label}"`,
        element?.required ? 'required="true"' : '',
        element?.placeholder ? `placeholder="${element.placeholder}"` : '',
        element?.helpText ? `help="${element.helpText}"` : '',
        element?.defaultValue ? `default="${element.defaultValue}"` : '',
        element?.customClass ? `class="${element.customClass}"` : '',
        element?.options && element.options.length > 0 ? `options="${element.options.join(',')}"` : ''
      ].filter(attr => attr).join(' ');
      
      return `[form_field ${attrs}]`;
    }).join('\n');

    return `[form name="${formName || 'Untitled Form'}"]
${elementsShortcode}
[/form]`;
  };

  const generateBootstrapHTML = () => {
    const htmlElements = formElements.map(element => {
      const required = element.required ? 'required' : '';
      const placeholder = element.placeholder || element.label;
      const id = element.id;
      const name = element.id;
      
      switch (element.type) {
        case 'text':
        case 'input':
        case 'email':
        case 'password':
        case 'phone':
        case 'number':
        case 'date':
          const inputType = element.type === 'input' ? 'text' : element.type === 'phone' ? 'tel' : element.type;
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}${element.required ? ' <span class="text-danger">*</span>' : ''}</label>
            <input type="${inputType}" class="form-control" id="${id}" name="${name}" placeholder="${placeholder}" ${required}>
        </div>`;
        
        case 'textarea':
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}${element.required ? ' <span class="text-danger">*</span>' : ''}</label>
            <textarea class="form-control" id="${id}" name="${name}" rows="4" placeholder="${placeholder}" ${required}></textarea>
        </div>`;
        
        case 'select':
          const options = element.options?.map(opt => 
            `                <option value="${opt.value}">${opt.label}</option>`
          ).join('\n') || '                <option value="">No options available</option>';
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}${element.required ? ' <span class="text-danger">*</span>' : ''}</label>
            <select class="form-select" id="${id}" name="${name}" ${required}>
                <option value="">Choose...</option>
${options}
            </select>
        </div>`;
        
        case 'checkbox':
          return `        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="${id}" name="${name}">
            <label class="form-check-label" for="${id}">${element.label}</label>
        </div>`;
        
        case 'radio':
          const radioOptions = element.options?.map((opt, index) => 
            `            <div class="form-check">
                <input class="form-check-input" type="radio" name="${name}" id="${id}_${index}" value="${opt.value}">
                <label class="form-check-label" for="${id}_${index}">${opt.label}</label>
            </div>`
          ).join('\n') || '';
          return `        <div class="mb-3">
            <label class="form-label">${element.label}${element.required ? ' <span class="text-danger">*</span>' : ''}</label>
${radioOptions}
        </div>`;
        
        default:
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}</label>
            <input type="text" class="form-control" id="${id}" name="${name}" placeholder="${placeholder}">
        </div>`;
      }
    }).join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formName}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card shadow">
                    <div class="card-body">
                        <h2 class="card-title text-center mb-4">${formName}</h2>
                        
                        <form id="bootstrapForm" novalidate>
${htmlElements}
                            
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-lg">Submit Form</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('bootstrapForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Bootstrap validation
            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }
            
            // Form is valid - submit it
            alert('Form submitted successfully! (Replace this with your form handler)');
            
            // Example integration with popular form services:
            // Formspree: action="https://formspree.io/f/YOUR_FORM_ID" method="POST"
            // Netlify: data-netlify="true"
            // EmailJS: Use EmailJS SDK
        });
    </script>
</body>
</html>`;
  };

  const generateCode = () => {
    switch (selectedFormat) {
      case 'json': return generateJSON();
      case 'wordpress': return generateWordPressShortcode();
      case 'contact-form-7': return generateContactForm7();
      case 'react': return generateReactComponent();
      case 'html': return generateHTML();
      case 'typescript': return generateTypeScriptComponent();
      case 'vue': return generateVueComponent();
      case 'css-framework': return generateBootstrapHTML();
      default: return generateJSON();
    }
  };

  const getFileExtension = () => {
    const extensions = {
      html: 'html',
      'css-framework': 'html',
      json: 'json',
      vue: 'vue',
      typescript: 'tsx',
      react: 'jsx',
      wordpress: 'txt',
      'contact-form-7': 'txt'
    };
    return extensions[selectedFormat] || 'txt';
  };

  const handleExport = () => {
    if (!formName.trim()) {
      alert('Please enter a form name before exporting.');
      return;
    }

    const code = generateCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formName.replace(/[^a-zA-Z0-9]/g, '_') || 'form'}.${getFileExtension()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      alert('Please enter a form name before saving.');
      return;
    }

    const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    savedForms.push({
      name: formName,
      elements: formElements,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('savedForms', JSON.stringify(savedForms));
    alert('Form saved successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-5/6 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Save & Export Form</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Name:</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter form name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format:</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {exportFormats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">Elements in form: {formElements.length}</p>
                <p>Selected format: {exportFormats.find(f => f.value === selectedFormat)?.label}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code Preview:</label>
              <textarea
                value={generateCode()}
                readOnly
                className="w-full h-80 p-3 border border-gray-300 rounded-md font-mono text-xs bg-gray-50 resize-none"
                placeholder="Generated code will appear here..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            disabled={!formName.trim()}
          >
            Save to Browser
          </button>
          <button 
            onClick={handleExport} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={!formName.trim()}
          >
            Export {exportFormats.find(f => f.value === selectedFormat)?.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveFormModal;
