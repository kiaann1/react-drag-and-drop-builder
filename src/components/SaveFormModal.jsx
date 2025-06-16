import React, { useState } from 'react';
import generateHTML from '../utils/generateHTML';
import hexToRgb from '../utils/hexToRgb';

const SaveFormModal = ({ isOpen, onClose, formElements, formOptions = {} }) => {
  const [formName, setFormName] = useState(formOptions.formTitle || '');
  const [selectedFormat, setSelectedFormat] = useState('html');

  // --- CODE GENERATION FUNCTIONS ---
  const generateJSON = () => {
    return JSON.stringify({
      name: formName,
      elements: formElements,
      formOptions: formOptions,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0',
        totalElements: formElements.length,
        requiredElements: formElements.filter(el => el?.required).length,
      },
    }, null, 2);
  };

  const generateWordPressShortcode = () => {
    const elementsShortcode = formElements.map(element => {
      const attrs = [
        `type="${element.type}"`,
        `name="${element.id}"`,
        element.required ? 'required' : '',
        element.placeholder ? `placeholder="${element.placeholder}"` : `placeholder="${element.label}"`,
        element.customClass ? `class="${element.customClass}"` : '',
        element.defaultValue ? `default="${element.defaultValue}"` : '',
        element.helpText ? `help="${element.helpText}"` : '',
      ].filter(attr => attr).join(' ');
      
      if (element.type === 'select' && element.options) {
        const options = element.options.map(opt => `"${opt.label}"`).join(' ');
        return `[select ${attrs} options="${options}"]`;
      }
      
      return `[${element.type} ${attrs}]`;
    }).join('\n');

    return `[contact-form-7 id="${Date.now()}" title="${formOptions.formTitle || formName}"]
${formOptions.formTitle ? `<h2>${formOptions.formTitle}</h2>` : ''}
${formOptions.formDescription ? `<p>${formOptions.formDescription}</p>` : ''}

${elementsShortcode}

[submit "${formOptions.submitButtonText || 'Send'}"]

<style>
.wpcf7-form {
  background: ${formOptions.backgroundColor || '#FFFFFF'};
  padding: 30px;
  border-radius: 8px;
}
.wpcf7-form input, .wpcf7-form textarea, .wpcf7-form select {
  color: ${formOptions.inputTextColor || '#111827'};
  border-color: ${formOptions.inputBorderColor || '#D1D5DB'};
}
.wpcf7-form label {
  color: ${formOptions.labelTextColor || '#374151'};
}
.wpcf7-submit {
  background: ${formOptions.submitButtonColor || '#3B82F6'} !important;
  color: ${formOptions.submitButtonTextColor || '#FFFFFF'} !important;
}
.wpcf7-submit:hover {
  background: ${formOptions.submitButtonHoverColor || '#2563EB'} !important;
}
</style>
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
    [text${required} ${id} placeholder "${element.placeholder || element.label}"${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
        
        case 'email':
          return `<label> ${element.label}${required}
    [email${required} ${id} placeholder "${element.placeholder || element.label}"${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
        
        case 'paragraph':
          return `<label> ${element.label}${required}
    [textarea${required} ${id} placeholder "${element.placeholder || element.label}"${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
        
        case 'select':
          const options = element.options?.map(opt => opt.label).join(' ') || 'Option 1 Option 2';
          return `<label> ${element.label}${required}
    [select${required} ${id} "${options}"${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
        
        case 'checkbox':
          const checkboxOptions = element.options?.map(opt => opt.label).join(' ') || element.label;
          return `<label> [checkbox ${id} "${checkboxOptions}"] </label>`;
        
        case 'radio':
          const radioOptions = element.options?.map(opt => opt.label).join(' ') || 'Option 1 Option 2';
          return `<label> ${element.label}${required}
    [radio${required} ${id} "${radioOptions}"${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
        
        case 'phone':
          return `<label> ${element.label}${required}
    [tel${required} ${id} placeholder "${element.placeholder || element.label}"${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
        
        case 'number':
          return `<label> ${element.label}${required}
    [number${required} ${id} placeholder "${element.placeholder || element.label}"${element.min ? ` min:${element.min}` : ''}${element.max ? ` max:${element.max}` : ''}${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
        
        case 'date':
          return `<label> ${element.label}${required}
    [date${required} ${id}${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
        
        case 'file':
          return `<label> ${element.label}${required}
    [file${required} ${id}] </label>`;
        
        default:
          return `<label> ${element.label}${required}
    [text${required} ${id} placeholder "${element.placeholder || element.label}"${element.defaultValue ? ` default:${element.defaultValue}` : ''}] </label>`;
      }
    }).join('\n\n');

    return `<div class="contact-form" style="background: ${formOptions.backgroundColor || '#FFFFFF'}; padding: 30px; border-radius: 8px;">
${formOptions.formTitle ? `<h2 style="color: ${formOptions.labelTextColor || '#374151'};">${formOptions.formTitle}</h2>` : ''}
${formOptions.formDescription ? `<p style="color: ${formOptions.labelTextColor || '#666'};">${formOptions.formDescription}</p>` : ''}

${cf7Elements}

[submit "${formOptions.submitButtonText || 'Send Message'}" id:submit]
</div>

<style>
.contact-form label {
  color: ${formOptions.labelTextColor || '#374151'};
  font-weight: 500;
}
.contact-form input, .contact-form textarea, .contact-form select {
  color: ${formOptions.inputTextColor || '#111827'};
  border: 1px solid ${formOptions.inputBorderColor || '#D1D5DB'};
  background: ${formOptions.backgroundColor || '#FFFFFF'};
  padding: 12px;
  border-radius: 4px;
  width: 100%;
  margin: 5px 0 15px 0;
}
.contact-form input:focus, .contact-form textarea:focus, .contact-form select:focus {
  border-color: ${formOptions.inputFocusBorderColor || '#3B82F6'};
  outline: none;
}
.contact-form input::placeholder, .contact-form textarea::placeholder {
  color: ${formOptions.placeholderTextColor || '#9CA3AF'};
}
#submit {
  background: ${formOptions.submitButtonColor || '#3B82F6'} !important;
  color: ${formOptions.submitButtonTextColor || '#FFFFFF'} !important;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}
#submit:hover {
  background: ${formOptions.submitButtonHoverColor || '#2563EB'} !important;
}
${formOptions.showValidationOnSubmit ? `
.wpcf7-not-valid {
  border-color: #e74c3c !important;
}
.wpcf7-validation-errors {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}` : ''}
</style>`;
  };

  const generateTypeScriptComponent = () => {
    const componentName = formName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') || 'CustomForm';
    
    if (!formElements || formElements.length === 0) {
      return `import React, { useState, FC } from 'react';

interface FormData {
  [key: string]: string | boolean | string[];
}

const ${componentName}: FC = () => {
  const [formData, setFormData] = useState<FormData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    ${formOptions.successMessage ? `alert('${formOptions.successMessage}');` : '// Add your form submission logic here'}
    ${formOptions.redirectUrl ? `// window.location.href = '${formOptions.redirectUrl}';` : ''}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        ${formOptions.formTitle ? `<h2 style={titleStyle}>${formOptions.formTitle}</h2>` : ''}
        ${formOptions.formDescription ? `<p style={descriptionStyle}>${formOptions.formDescription}</p>` : ''}
        <p>No form elements added</p>
        <button type="submit" style={buttonStyle}>
          ${formOptions.submitButtonText || 'Submit Form'}
        </button>
      </form>
    </div>
  );
};

// Styled components with form options
const containerStyle: React.CSSProperties = {
  backgroundColor: '${formOptions.containerBackgroundColor || '#f5f5f5'}',
  padding: '20px',
  minHeight: '100vh'
};

const formStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '30px',
  backgroundColor: '${formOptions.backgroundColor || 'white'}',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
};

const titleStyle: React.CSSProperties = {
  color: '${formOptions.labelTextColor || '#333'}',
  marginBottom: '${formOptions.formDescription ? '10px' : '30px'}',
  fontSize: '24px',
  fontWeight: 'bold'
};

const descriptionStyle: React.CSSProperties = {
  color: '${formOptions.labelTextColor || '#666'}',
  marginBottom: '30px',
  fontSize: '16px'
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '${formOptions.submitButtonColor || '#007bff'}',
  color: '${formOptions.submitButtonTextColor || 'white'}',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '500',
  width: '100%',
  marginTop: '20px'
};

export default ${componentName};`;
    }

    // Generate state fields and interfaces
    const stateFields = formElements.map((element) => {
      const fieldName = element?.id ? element.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${formElements.indexOf(element)}`;
      const fieldType = element.type === 'checkbox' ? 'boolean' : element.type === 'multiselect' ? 'string[]' : 'string';
      return `${fieldName}: ${element.defaultValue ? `'${element.defaultValue}'` : fieldType === 'boolean' ? 'false' : fieldType === 'string[]' ? '[]' : "''"};`;
    }).join('\n    ');

    const interfaceFields = formElements.map((element) => {
      const fieldName = element?.id ? element.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${formElements.indexOf(element)}`;
      const fieldType = element.type === 'checkbox' ? 'boolean' : element.type === 'multiselect' ? 'string[]' : 'string';
      return `${fieldName}: ${fieldType};`;
    }).join('\n  ');

    // Generate required fields
    const requiredFields = formElements.filter(el => el?.required).map((element) => {
      const fieldName = element?.id ? element.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${formElements.indexOf(element)}`;
      return `'${fieldName}'`;
    }).join(', ');

    // Check if there's already a submit button
    const hasSubmitButton = formElements.some(el => el?.type === 'button');

    // Generate form fields with proper TypeScript types
    const formFields = formElements.map((element, index) => {
      const label = element?.label || 'Untitled';
      const type = element?.type || 'text';
      const fieldName = element?.id ? element.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${index}`;
      const placeholder = element?.placeholder || label;
      const required = element?.required ? 'required' : '';
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
          return `        <div style={formGroupStyle}>
          <label htmlFor="${fieldName}" style={labelStyle}>
            ${label}${showAsterisk ? ' *' : ''}
          </label>
          <input
            type="${type === 'phone' ? 'tel' : type === 'company' || type === 'name' || type === 'firstName' || type === 'lastName' || type === 'address' || type === 'city' || type === 'zipCode' ? 'text' : type === 'website' ? 'url' : type}"
            id="${fieldName}"
            name="${fieldName}"
            value={(formData.${fieldName} as string) || ''}
            onChange={handleChange}
            placeholder="${placeholder}"
            style={inputStyle}
            ${required}
            ${element.minLength ? `minLength={${element.minLength}}` : ''}
            ${element.maxLength ? `maxLength={${element.maxLength}}` : ''}
          />
          ${element.helpText ? `<div style={helpTextStyle}>${element.helpText}</div>` : ''}
        </div>`;
        
        case 'paragraph':
          return `        <div style={formGroupStyle}>
          <label htmlFor="${fieldName}" style={labelStyle}>
            ${label}${showAsterisk ? ' *' : ''}
          </label>
          <textarea
            id="${fieldName}"
            name="${fieldName}"
            value={(formData.${fieldName} as string) || ''}
            onChange={handleChange}
            placeholder="${placeholder}"
            style={{...inputStyle, minHeight: '100px', resize: 'vertical' as const}}
            rows={${element.size === 'small' ? '2' : element.size === 'large' ? '6' : '4'}}
            ${required}
            ${element.minLength ? `minLength={${element.minLength}}` : ''}
            ${element.maxLength ? `maxLength={${element.maxLength}}` : ''}
          />
          ${element.helpText ? `<div style={helpTextStyle}>${element.helpText}</div>` : ''}
        </div>`;
        
        case 'number':
          return `        <div style={formGroupStyle}>
          <label htmlFor="${fieldName}" style={labelStyle}>
            ${label}${showAsterisk ? ' *' : ''}
          </label>
          <input
            type="number"
            id="${fieldName}"
            name="${fieldName}"
            value={(formData.${fieldName} as string) || ''}
            onChange={handleChange}
            placeholder="${placeholder}"
            style={inputStyle}
            ${required}
            ${element.min !== undefined ? `min={${element.min}}` : ''}
            ${element.max !== undefined ? `max={${element.max}}` : ''}
            ${element.step !== undefined ? `step={${element.step}}` : ''}
          />
          ${element.helpText ? `<div style={helpTextStyle}>${element.helpText}</div>` : ''}
        </div>`;
        
        case 'select':
          const options = element?.options || [];
          return `        <div style={formGroupStyle}>
          <label htmlFor="${fieldName}" style={labelStyle}>
            ${label}${showAsterisk ? ' *' : ''}
          </label>
          <select
            id="${fieldName}"
            name="${fieldName}"
            value={(formData.${fieldName} as string) || ''}
            onChange={handleChange}
            style={inputStyle}
            ${required}
          >
            <option value="">Select ${label}</option>
            ${options.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n            ')}
          </select>
          ${element.helpText ? `<div style={helpTextStyle}>${element.helpText}</div>` : ''}
        </div>`;
        
        case 'checkbox':
          const checkboxOptions = element?.options || [];
          return `        <div style={formGroupStyle}>
          <label style={labelStyle}>${label}${showAsterisk ? ' *' : ''}</label>
          ${checkboxOptions.map((option, idx) => `<label key="${idx}" style={checkboxLabelStyle}>
            <input
              type="checkbox"
              name="${fieldName}"
              value="${option.value}"
              checked={Array.isArray(formData.${fieldName}) && (formData.${fieldName} as string[]).includes('${option.value}')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                const currentValues = (formData.${fieldName} as string[]) || [];
                if (e.target.checked) {
                  setFormData(prev => ({ ...prev, ${fieldName}: [...currentValues, value] }));
                } else {
                  setFormData(prev => ({ ...prev, ${fieldName}: currentValues.filter(v => v !== value) }));
                }
              }}
              style={checkboxStyle}
            />
            ${option.label}
          </label>`).join('\n          ')}
          ${element.helpText ? `<div style={helpTextStyle}>${element.helpText}</div>` : ''}
        </div>`;
        
        case 'button':
          return `        <button type="submit" style={buttonStyle}>
          ${label}
        </button>`;
        
        default:
          return `        <div style={formGroupStyle}>
          <label htmlFor="${fieldName}" style={labelStyle}>${label}</label>
          <input
            type="text"
            id="${fieldName}"
            name="${fieldName}"
            value={(formData.${fieldName} as string) || ''}
            onChange={handleChange}
            placeholder="${placeholder}"
            style={inputStyle}
          />
        </div>`;
      }
    }).join('\n');

    return `import React, { useState, FC } from 'react';

interface FormData {
  ${interfaceFields}
}

const ${componentName}: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    ${stateFields}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation with form options
    ${formOptions.showValidationOnSubmit !== false ? `
    const requiredFields: (keyof FormData)[] = [${requiredFields}];
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return !value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0);
    });
    
    if (missingFields.length > 0) {
      alert('${formOptions.errorMessage || 'Please fill in all required fields'}');
      return;
    }` : ''}

    console.log('Form submitted:', formData);
    
    ${formOptions.successMessage ? `alert('${formOptions.successMessage}');` : '// Add your form submission logic here'}
    
    ${formOptions.redirectUrl ? `// Redirect after successful submission
    // window.location.href = '${formOptions.redirectUrl}';` : ''}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        ${formOptions.formTitle ? `<h2 style={titleStyle}>${formOptions.formTitle}</h2>` : ''}
        ${formOptions.formDescription ? `<p style={descriptionStyle}>${formOptions.formDescription}</p>` : ''}
${formFields}
${!hasSubmitButton ? `        <button type="submit" style={buttonStyle}>
          ${formOptions.submitButtonText || 'Submit Form'}
        </button>` : ''}
      </form>
    </div>
  );
};

// Inline styles based on form options
const containerStyle: React.CSSProperties = {
  backgroundColor: '${formOptions.containerBackgroundColor || '#f5f5f5'}',
  padding: '20px',
  minHeight: '100vh'
};

const formStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '30px',
  backgroundColor: '${formOptions.backgroundColor || 'white'}',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
};

const titleStyle: React.CSSProperties = {
  color: '${formOptions.labelTextColor || '#333'}',
  marginBottom: '${formOptions.formDescription ? '10px' : '30px'}',
  fontSize: '24px',
  fontWeight: 'bold'
};

const descriptionStyle: React.CSSProperties = {
  color: '${formOptions.labelTextColor || '#666'}',
  marginBottom: '30px',
  fontSize: '16px'
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: '20px'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: '500',
  color: '${formOptions.labelTextColor || '#333'}',
  fontSize: '14px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid ${formOptions.inputBorderColor || '#ddd'}',
  borderRadius: '4px',
  fontSize: '14px',
  color: '${formOptions.inputTextColor || '#111827'}',
  backgroundColor: '${formOptions.backgroundColor || '#FFFFFF'}',
  transition: 'border-color 0.3s ease'
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '${formOptions.submitButtonColor || '#007bff'}',
  color: '${formOptions.submitButtonTextColor || 'white'}',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '500',
  width: '100%',
  marginTop: '20px'
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  fontSize: '14px',
  marginBottom: '8px',
  color: '${formOptions.labelTextColor || '#333'}'
};

const checkboxStyle: React.CSSProperties = {
  marginRight: '8px',
  width: 'auto'
};

const helpTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#666',
  marginTop: '5px'
};

export default ${componentName};`;
  };

  const generateVueComponent = () => {
    const componentName = formName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') || 'CustomForm';
    
    if (!formElements || formElements.length === 0) {
      return `<template>
  <div :style="containerStyle">
    <form @submit.prevent="handleSubmit" :style="formStyle">
      ${formOptions.formTitle ? `<h2 :style="titleStyle">${formOptions.formTitle}</h2>` : ''}
      ${formOptions.formDescription ? `<p :style="descriptionStyle">${formOptions.formDescription}</p>` : ''}
      <p>No form elements added</p>
      <button type="submit" :style="buttonStyle">
        ${formOptions.submitButtonText || 'Submit Form'}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: '${componentName}',
  data() {
    return {
      formData: {},
      containerStyle: {
        backgroundColor: '${formOptions.containerBackgroundColor || '#f5f5f5'}',
        padding: '20px',
        minHeight: '100vh'
      },
      formStyle: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: '${formOptions.backgroundColor || 'white'}',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
      },
      titleStyle: {
        color: '${formOptions.labelTextColor || '#333'}',
        marginBottom: '${formOptions.formDescription ? '10px' : '30px'}',
        fontSize: '24px',
        fontWeight: 'bold'
      },
      descriptionStyle: {
        color: '${formOptions.labelTextColor || '#666'}',
        marginBottom: '30px',
        fontSize: '16px'
      },
      buttonStyle: {
        backgroundColor: '${formOptions.submitButtonColor || '#007bff'}',
        color: '${formOptions.submitButtonTextColor || 'white'}',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        width: '100%',
        marginTop: '20px'
      }
    }
  },
  methods: {
    handleSubmit() {
      console.log('Form submitted:', this.formData);
      ${formOptions.successMessage ? `alert('${formOptions.successMessage}');` : '// Add your form submission logic here'}
      ${formOptions.redirectUrl ? `// window.location.href = '${formOptions.redirectUrl}';` : ''}
    }
  }
}
</script>`;
    }

    // Check if there's already a submit button
    const hasSubmitButton = formElements.some(el => el?.type === 'button');

    // Generate Vue data properties
    const dataProperties = formElements.map((element) => {
      const fieldName = element?.id ? element.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${formElements.indexOf(element)}`;
      return `${fieldName}: '${element.defaultValue || ''}'`;
    }).join(',\n        ');

    // Generate required fields for validation
    const requiredFields = formElements.filter(el => el?.required).map((element) => {
      const fieldName = element?.id ? element.id.replace(/[^a-zA-Z0-9]/g, '_') : `field_${formElements.indexOf(element)}`;
      return `'${fieldName}'`;
    }).join(', ');

    return `<template>
  <div :style="containerStyle">
    <form @submit.prevent="handleSubmit" :style="formStyle">
      ${formOptions.formTitle ? `<h2 :style="titleStyle">${formOptions.formTitle}</h2>` : ''}
      ${formOptions.formDescription ? `<p :style="descriptionStyle">${formOptions.formDescription}</p>` : ''}
    </form>
  </div>
</template>

<script>
export default {
  name: '${componentName}',
  data() {
    return {
      formData: {
        ${dataProperties}
      },
      // Styling based on form options
      containerStyle: {
        backgroundColor: '${formOptions.containerBackgroundColor || '#f5f5f5'}',
        padding: '20px',
        minHeight: '100vh'
      },
      formStyle: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: '${formOptions.backgroundColor || 'white'}',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
      },
      titleStyle: {
        color: '${formOptions.labelTextColor || '#333'}',
        marginBottom: '${formOptions.formDescription ? '10px' : '30px'}',
        fontSize: '24px',
        fontWeight: 'bold'
      },
      descriptionStyle: {
        color: '${formOptions.labelTextColor || '#666'}',
        marginBottom: '30px',
        fontSize: '16px'
      },
      buttonStyle: {
        backgroundColor: '${formOptions.submitButtonColor || '#007bff'}',
        color: '${formOptions.submitButtonTextColor || 'white'}',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        width: '100%',
        marginTop: '20px'
      },
      helpTextStyle: {
        fontSize: '12px',
        color: '#666',
        marginTop: '5px'
      }
    }
  },
  methods: {
    handleSubmit() {
      ${formOptions.showValidationOnSubmit !== false ? `
      // Validation
      const requiredFields = [${requiredFields}];
      const missingFields = requiredFields.filter(field => {
        const value = this.formData[field];
        return !value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0);
      });
      
      if (missingFields.length > 0) {
        alert('${formOptions.errorMessage || 'Please fill in all required fields'}');
        return;
      }` : ''}

      console.log('Form submitted:', this.formData);
      
      ${formOptions.successMessage ? `alert('${formOptions.successMessage}');` : '// Add your form submission logic here'}
      
      ${formOptions.redirectUrl ? `// Redirect after successful submission
      // window.location.href = '${formOptions.redirectUrl}';` : ''}
    }
  }
}
</script>

<style scoped>
input:focus, textarea:focus, select:focus {
  border-color: ${formOptions.inputFocusBorderColor || '#007bff'} !important;
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
}

input::placeholder, textarea::placeholder {
  color: ${formOptions.placeholderTextColor || '#9CA3AF'};
}

button:hover {
  background-color: ${formOptions.submitButtonHoverColor || '#0056b3'} !important;
}
</style>`;
  };

  const generateBootstrapHTML = () => {
    const htmlElements = formElements.map(element => {
      const required = element.required ? 'required' : '';
      const placeholder = element.placeholder || element.label;
      const id = element.id;
      const name = element.id;
      const helpText = element.helpText;
      const showAsterisk = element.required && formOptions.showRequiredAsterisk !== false;
      
      switch (element.type) {
        case 'text':
        case 'input':
        case 'email':
        case 'password':
        case 'phone':
        case 'number':
        case 'date':
        case 'time':
        case 'name':
        case 'company':
        case 'address':
        case 'city':
        case 'zipCode':
        case 'website':
          const inputType = element.type === 'input' ? 'text' : 
                           element.type === 'phone' ? 'tel' : 
                           element.type === 'company' || element.type === 'name' || element.type === 'address' || element.type === 'city' || element.type === 'zipCode' ? 'text' :
                           element.type === 'website' ? 'url' : element.type;
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
            <input 
                type="${inputType}" 
                class="form-control" 
                id="${id}" 
                name="${name}" 
                placeholder="${placeholder}" 
                ${required}
                ${element.defaultValue ? `value="${element.defaultValue}"` : ''}
                ${element.minLength ? `minlength="${element.minLength}"` : ''}
                ${element.maxLength ? `maxlength="${element.maxLength}"` : ''}
                ${element.min !== undefined ? `min="${element.min}"` : ''}
                ${element.max !== undefined ? `max="${element.max}"` : ''}
                ${element.step !== undefined ? `step="${element.step}"` : ''}
            >
            ${helpText ? `<div class="form-text">${helpText}</div>` : ''}
        </div>`;
        
        case 'paragraph':
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
            <textarea 
                class="form-control" 
                id="${id}" 
                name="${name}" 
                rows="${element.size === 'small' ? '2' : element.size === 'large' ? '6' : '4'}" 
                placeholder="${placeholder}" 
                ${required}
                ${element.minLength ? `minlength="${element.minLength}"` : ''}
                ${element.maxLength ? `maxlength="${element.maxLength}"` : ''}
            >${element.defaultValue || ''}</textarea>
            ${helpText ? `<div class="form-text">${helpText}</div>` : ''}
        </div>`;
        
        case 'select':
          const options = element.options?.map(opt => 
            `                <option value="${opt.value}"${element.defaultValue === opt.value ? ' selected' : ''}>${opt.label}</option>`
          ).join('\n') || `                <option value="">No options available</option>`;
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
            <select class="form-select" id="${id}" name="${name}" ${required}>
                <option value="">Choose...</option>
${options}
            </select>
            ${helpText ? `<div class="form-text">${helpText}</div>` : ''}
        </div>`;
        
        case 'checkbox':
          const checkboxOptions = element.options?.map((opt, index) => 
            `            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="${name}" id="${id}_${index}" value="${opt.value}">
                <label class="form-check-label" for="${id}_${index}">${opt.label}</label>
            </div>`
          ).join('\n') || `            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="${name}" id="${id}">
                <label class="form-check-label" for="${id}">${element.label}</label>
            </div>`;
          return `        <div class="mb-3">
            <label class="form-label">${element.label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
${checkboxOptions}
            ${helpText ? `<div class="form-text">${helpText}</div>` : ''}
        </div>`;
        
        case 'radio':
          const radioOptions = element.options?.map((opt, index) => 
            `            <div class="form-check">
                <input class="form-check-input" type="radio" name="${name}" id="${id}_${index}" value="${opt.value}"${element.defaultValue === opt.value ? ' checked' : ''} ${required}>
                <label class="form-check-label" for="${id}_${index}">${opt.label}</label>
            </div>`
          ).join('\n') || '';
          return `        <div class="mb-3">
            <label class="form-label">${element.label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
${radioOptions}
            ${helpText ? `<div class="form-text">${helpText}</div>` : ''}
        </div>`;
        
        case 'file':
        case 'image':
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}${showAsterisk ? ' <span class="text-danger">*</span>' : ''}</label>
            <input type="file" class="form-control" id="${id}" name="${name}" ${required} ${element.type === 'image' ? 'accept="image/*"' : ''}>
            ${helpText ? `<div class="form-text">${helpText}</div>` : ''}
        </div>`;
        
        case 'button':
          return `        <button type="submit" class="btn btn-primary btn-lg w-100">${element.label}</button>`;
        
        default:
          return `        <div class="mb-3">
            <label for="${id}" class="form-label">${element.label}</label>
            <input type="text" class="form-control" id="${id}" name="${name}" placeholder="${placeholder}">
            ${helpText ? `<div class="form-text">${helpText}</div>` : ''}
        </div>`;
      }
    }).join('\n\n');

    const hasSubmitButton = formElements.some(el => el?.type === 'button');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formOptions.formTitle || formName}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: ${formOptions.containerBackgroundColor || '#f8f9fa'};
        }
        .form-container {
            background-color: ${formOptions.backgroundColor || '#ffffff'};
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .form-label {
            color: ${formOptions.labelTextColor || '#212529'};
            font-weight: 500;
        }
        .form-control, .form-select {
            color: ${formOptions.inputTextColor || '#212529'};
            border-color: ${formOptions.inputBorderColor || '#ced4da'};
            background-color: ${formOptions.backgroundColor || '#ffffff'};
        }
        .form-control:focus, .form-select:focus {
            border-color: ${formOptions.inputFocusBorderColor || '#86b7fe'};
            box-shadow: 0 0 0 0.25rem rgba(${formOptions.inputFocusBorderColor ? hexToRgb(formOptions.inputFocusBorderColor) : '13, 110, 253'}, 0.25);
        }
        .form-control::placeholder {
            color: ${formOptions.placeholderTextColor || '#6c757d'};
        }
        .btn-primary {
            background-color: ${formOptions.submitButtonColor || '#0d6efd'};
            border-color: ${formOptions.submitButtonColor || '#0d6efd'};
            color: ${formOptions.submitButtonTextColor || '#ffffff'};
        }
        .btn-primary:hover {
            background-color: ${formOptions.submitButtonHoverColor || '#0b5ed7'};
            border-color: ${formOptions.submitButtonHoverColor || '#0b5ed7'};
        }
        .form-title {
            color: ${formOptions.labelTextColor || '#212529'};
            margin-bottom: ${formOptions.formDescription ? '1rem' : '2rem'};
        }
        .form-description {
            color: ${formOptions.labelTextColor || '#6c757d'};
            margin-bottom: 2rem;
        }
        ${formOptions.showValidationOnSubmit !== false ? `
        .was-validated .form-control:invalid,
        .was-validated .form-select:invalid {
            border-color: #dc3545;
        }
        .was-validated .form-control:invalid:focus,
        .was-validated .form-select:invalid:focus {
            box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
        }` : ''}
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
                        
${!hasSubmitButton ? `                        <div class="d-grid mt-4">
                            <button type="submit" class="btn btn-primary btn-lg">${formOptions.submitButtonText || 'Submit Form'}</button>
                        </div>` : ''}
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('bootstrapForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            ${formOptions.showValidationOnSubmit !== false ? `
            // Bootstrap validation
            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                ${formOptions.errorMessage ? `alert('${formOptions.errorMessage}');` : ''}
                return;
            }` : ''}
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Handle checkboxes
            const checkboxes = this.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (!data[checkbox.name]) {
                    data[checkbox.name] = [];
                }
                if (checkbox.checked) {
                    if (Array.isArray(data[checkbox.name])) {
                        data[checkbox.name].push(checkbox.value);
                    } else {
                        data[checkbox.name] = [data[checkbox.name], checkbox.value];
                    }
                }
            });
            
            console.log('Form submitted:', data);
            
            ${formOptions.successMessage ? `
            alert('${formOptions.successMessage}');` : `
            alert('Form submitted successfully! Check console for data.');`}
            
            ${formOptions.redirectUrl ? `
            // Redirect after successful submission
            setTimeout(() => {
                window.location.href = '${formOptions.redirectUrl}';
            }, 2000);` : ''}
        });
        
        ${formOptions.showValidationOnBlur ? `
        // Real-time validation on blur
        document.querySelectorAll('#bootstrapForm input, #bootstrapForm textarea, #bootstrapForm select').forEach(field => {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            });
        });` : ''}
    </script>
</body>
</html>`;
  };

  const generateSvelteComponent = () => {
    // Basic Svelte component export (expand as needed for your form structure)
    return `<script>
  let formData = {};
  function handleSubmit(event) {
    event.preventDefault();
    // Add validation and submission logic here
    console.log('Form submitted:', formData);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  {#each ${JSON.stringify(formElements)} as element}
    {#if element.type === 'text' || element.type === 'email' || element.type === 'password'}
      <label>{element.label}{element.required ? ' *' : ''}</label>
      <input type={element.type} bind:value={formData[element.id]} placeholder={element.placeholder} required={element.required} />
    {/if}
    <!-- Add more field types as needed -->
  {/each}
  <button type="submit">{formOptions.submitButtonText || 'Submit'}</button>
</form>
<style>
  /* Add your styles here */
</style>`;
  };

  // Ensure Shortcode export is present (already implemented as generateWordPressShortcode)

  // Update exportFormats to include Svelte and Shortcode
  const exportFormats = [
    { value: 'html', label: 'HTML (Ready to Use)' },
    { value: 'json', label: 'JSON Data' },
    { value: 'react', label: 'React Component' },
    { value: 'typescript', label: 'TypeScript Component' },
    { value: 'svelte', label: 'Svelte Component' },
    { value: 'wordpress', label: 'WordPress Shortcode' },
    { value: 'contact-form-7', label: 'Contact Form 7' },
    { value: 'css-framework', label: 'HTML + Bootstrap' },
  ];

  // Update generateCode to support Svelte
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
      case 'svelte': return generateSvelteComponent();
      default: return generateJSON();
    }
  };

  // Update getFileExtension to support Svelte
  const getFileExtension = () => {
    const extensions = {
      html: 'html',
      'css-framework': 'html',
      json: 'json',
      vue: 'vue',
      typescript: 'tsx',
      react: 'jsx',
      wordpress: 'txt',
      'contact-form-7': 'txt',
      svelte: 'svelte',
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
      formOptions: formOptions,
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
