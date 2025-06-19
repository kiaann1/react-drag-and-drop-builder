import React, { useState, useCallback, useMemo } from 'react';
import StarRating from './StarRating';
import FormOptionsModal from './FormOptionsModal';

// --- Add conditional logic evaluation utility ---
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
    case 'checked': return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    case 'notChecked': return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
    case 'true': return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    case 'false': return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
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
  // For enable/disable/require/unrequire, always show, but you can add logic for those as needed
  return true;
}

const LivePreview = React.memo(({ formElements = [], isExpanded, onToggleExpand, formOptions = {}, onUpdateFormOptions }) => {
  // Always call all hooks first, before any conditional logic
  const [colorValues, setColorValues] = useState({});
  const [rangeValues, setRangeValues] = useState({});
  const [showFormOptions, setShowFormOptions] = useState(false);
  const [error, setError] = useState('');
  // --- Track form values for conditional logic ---
  const [formValues, setFormValues] = useState({});

  // Validate and sanitize form elements
  const validateElement = useCallback((element) => {
    if (!element || typeof element !== 'object') return false;
    if (!element.id || typeof element.id !== 'string') return false;
    if (!element.type || typeof element.type !== 'string') return false;
    return true;
  }, []);

  const sanitizeFormOptions = useCallback((options) => {
    if (!options || typeof options !== 'object') return {};

    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    
    return {
      ...options,
      formTitle: options.formTitle ? String(options.formTitle).slice(0, 200) : '',
      formDescription: options.formDescription ? String(options.formDescription).slice(0, 1000) : '',
      submitButtonText: options.submitButtonText ? String(options.submitButtonText).slice(0, 100) : 'Submit Form',
      submitButtonColor: options.submitButtonColor && colorRegex.test(options.submitButtonColor) ? options.submitButtonColor : '#3B82F6',
      submitButtonHoverColor: options.submitButtonHoverColor && colorRegex.test(options.submitButtonHoverColor) ? options.submitButtonHoverColor : '#2563EB',
      submitButtonTextColor: options.submitButtonTextColor && colorRegex.test(options.submitButtonTextColor) ? options.submitButtonTextColor : '#FFFFFF',
    };
  }, []);

  const handleColorChange = useCallback((elementId, value) => {
    // Validate color format
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorRegex.test(value)) {
      setError('Invalid color format');
      return;
    }

    setColorValues(prev => ({ ...prev, [elementId]: value }));
    setError('');
  }, []);

  const handleRangeChange = useCallback((elementId, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setError('Invalid range value');
      return;
    }

    setRangeValues(prev => ({ ...prev, [elementId]: numValue }));
    setError('');
  }, []);

  // Filter and validate elements
  const validElements = useMemo(() => {
    return formElements.filter(validateElement);
  }, [formElements, validateElement]);

  const sanitizedFormOptions = useMemo(() => {
    return sanitizeFormOptions(formOptions);
  }, [formOptions, sanitizeFormOptions]);

  // --- Update formValues on input change ---
  const handleInputChange = useCallback((id, value) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  }, []);

  // For checkboxes (multiple selection)
  const handleCheckboxChange = useCallback((id, value, checked) => {
    setFormValues(prev => {
      const prevValue = prev[id] || [];
      if (checked) {
        return { ...prev, [id]: [...prevValue, value] };
      } else {
        return { ...prev, [id]: prevValue.filter(v => v !== value) };
      }
    });
  }, []);

  const renderPreviewElement = (element) => {
    // Add safety check for undefined elements
    if (!element || !element.type) {
      return null;
    }

    // --- Conditional logic: skip rendering if logic fails ---
    if (element.conditionalLogic && !evaluateLogic(element.conditionalLogic, formValues)) {
      return null;
    }

    // Get field styling classes with form options applied
    const getFieldClasses = () => {
      let classes = "border rounded-md focus:outline-none focus:ring-2";
      
      // Size classes
      switch (element.size) {
        case 'small':
          classes += " p-2 text-sm";
          break;
        case 'large':
          classes += " p-4 text-lg";
          break;
        default: // medium
          classes += " p-3";
      }

      // Custom CSS class (without dot)
      if (element.customClass) {
        classes += ` ${element.customClass}`;
      }

      return classes;
    };

    // Get dynamic styles based on form options
    const getFieldStyles = () => {
      return {
        color: formOptions.inputTextColor || '#111827',
        borderColor: formOptions.inputBorderColor || '#D1D5DB',
        backgroundColor: formOptions.backgroundColor || '#FFFFFF',
        '--focus-border-color': formOptions.inputFocusBorderColor || '#3B82F6',
      };
    };

    // Get label styles
    const getLabelStyles = () => {
      return {
        color: formOptions.labelTextColor || '#374151',
      };
    };

    // Get placeholder styles
    const getPlaceholderStyles = () => {
      return {
        '--placeholder-color': formOptions.placeholderTextColor || '#9CA3AF',
      };
    };

    // Get container width classes (with safety check)
    const getContainerClasses = () => {
      const width = element.width || 'full'; // Default to full if undefined
      switch (width) {
        case 'half':
          return "w-1/2 pr-2 inline-block align-top";
        case 'third':
          return "w-1/3 pr-2 inline-block align-top";
        case 'quarter':
          return "w-1/4 pr-2 inline-block align-top";
        default: // full
          return "w-full";
      }
    };

    // Get default options if none exist
    const getElementOptions = () => {
      if (element.type === 'checkbox') {
        if (Array.isArray(element.options)) {
          return element.options
            .filter(opt => typeof opt.value !== 'undefined' && opt.value !== null && opt.value !== '')
            .map((opt, idx) => ({
              ...opt,
              label:
                typeof opt.label === 'string' && opt.label.trim() !== ''
                  ? opt.label
                  : `Checkbox ${idx + 1}`
            }));
        }
        // Default for new checkbox fields
        return [{ label: 'Checkbox 1', value: 'checked' }];
      }
      if (Array.isArray(element.options) && element.options.length > 0) {
        return element.options
          .filter(opt => typeof opt.value !== 'undefined' && opt.value !== null && opt.value !== '')
          .map((opt, idx) => ({
            ...opt,
            label: typeof opt.label === 'string' && opt.label.trim() !== ''
              ? opt.label
              : `Option ${idx + 1}`
          }));
      }
      // Default options for new fields
      switch (element.type) {
        case 'select':
        case 'radio':
        case 'multiselect':
          return [
            { label: 'Option 1', value: 'option1' },
          ];
        case 'checkbox':
          return [
            { label: 'Checkbox 1', value: 'checked' }
          ];
        default:
          return [];
      }
    };

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
      case 'Post Code':
      case 'message':
      case 'website':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label 
                htmlFor={element.id} 
                className="block text-sm font-medium mb-2"
                style={{ color: formOptions.labelTextColor }}
              >
                {element.label}
                {element.required && formOptions.showRequiredAsterisk !== false && (
                  <span style={{ color: formOptions.requiredAsteriskColor }}>{formOptions.requiredAsterisk || '*'}</span>
                )}
              </label>
            )}
            <input
              id={element.id}
              name={element.id}
              type={element.type === 'name' || element.type === 'firstName' || element.type === 'lastName' || element.type === 'company' || element.type === 'jobTitle' || element.type === 'address' || element.type === 'city' || element.type === 'zipCode' ? 'text' : element.type === 'website' ? 'url' : element.type}
              placeholder={element.placeholder}
              disabled={element.disabled}
              defaultValue={element.defaultValue}
              className={getFieldClasses()}
              style={{
                ...getFieldStyles(),
                ...getPlaceholderStyles(),
                '--tw-ring-color': formOptions.inputFocusBorderColor || '#3B82F6',
              }}
              onChange={e => handleInputChange(element.id, e.target.value)}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

    

      case 'datetime':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <input
              type="datetime-local"
              disabled={element.disabled}
              defaultValue={element.defaultValue}
              className={getFieldClasses()}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'image':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={element.disabled}
              className={getFieldClasses()}
            />
            <p className="text-xs text-gray-500 mt-1">Accepts: JPG, PNG, GIF, WebP</p>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'yesno':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name={element.id} 
                  value="yes"
                  disabled={element.disabled}
                  defaultChecked={element.defaultValue === 'yes'}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name={element.id} 
                  value="no"
                  disabled={element.disabled}
                  defaultChecked={element.defaultValue === 'no'}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'range':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label htmlFor={element.id} className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              <input
                id={element.id}
                name={element.id}
                type="range"
                min={element.min || 0}
                max={element.max || 100}
                step={element.step || 1}
                disabled={element.disabled}
                defaultValue={element.defaultValue || 50}
                onChange={(e) => setRangeValues(prev => ({ ...prev, [element.id]: e.target.value }))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${element.customClass || ''}`}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{element.min || 0}</span>
                <span className="font-medium">Value: {rangeValues[element.id] || element.defaultValue || 50}</span>
                <span>{element.max || 100}</span>
              </div>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'color':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label htmlFor={element.id} className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="flex items-center space-x-3">
              <input
                id={element.id}
                name={element.id}
                type="color"
                disabled={element.disabled}
                defaultValue={element.defaultValue || '#000000'}
                onChange={(e) => setColorValues(prev => ({ ...prev, [element.id]: e.target.value }))}
                className={`h-12 w-20 border border-gray-300 rounded-md cursor-pointer ${element.customClass || ''}`}
              />
              <span className="text-sm text-gray-600">
                Selected: {colorValues[element.id] || element.defaultValue || '#000000'}
              </span>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'scale':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Poor</span>
                <span className="text-sm text-gray-600">Excellent</span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <label key={num} className="flex flex-col items-center">
                    <input 
                      type="radio" 
                      name={element.id} 
                      value={num}
                      disabled={element.disabled}
                      defaultChecked={element.defaultValue == num}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600 mt-1">{num}</span>
                  </label>
                ))}
              </div>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'country':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label htmlFor={element.id} className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <select 
              id={element.id}
              name={element.id}
              disabled={element.disabled}
              defaultValue={element.defaultValue}
              className={getFieldClasses()}
            >
              <option value="">{element.placeholder || 'Select a country'}</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="AU">Australia</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="BR">Brazil</option>
            </select>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'rating':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <StarRating 
              value={element.defaultValue ? parseFloat(element.defaultValue) : 0}
              disabled={element.disabled}
              size="w-8 h-8"
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'like':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <fieldset className="mb-2">
                <legend className="text-sm font-medium text-gray-700">
                  {element.label}
                  {element.required && <span className="text-red-500 ml-1">*</span>}
                </legend>
              </fieldset>
            )}
            <div className="space-y-2">
              {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, index) => (
                <label key={index} className="flex items-center">
                  <input 
                    id={`${element.id}_${index}`}
                    name={element.id}
                    type="radio" 
                    value={option}
                    disabled={element.disabled}
                    defaultChecked={element.defaultValue === option}
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'signature':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <p className="text-gray-500 text-sm">Click to sign digitally</p>
              <p className="text-xs text-gray-400 mt-1">Draw your signature in the box</p>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'captcha':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    disabled={element.disabled}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">I'm not a robot</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center mb-1">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500">reCAPTCHA</span>
                </div>
              </div>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'paragraph':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label 
                htmlFor={element.id} 
                className="block text-sm font-medium mb-2"
                style={{ color: formOptions.labelTextColor }}
              >
                {element.label}
                {element.required && formOptions.showRequiredAsterisk !== false && (
                  <span style={{ color: formOptions.requiredAsteriskColor }}>{formOptions.requiredAsterisk || '*'}</span>
                )}
              </label>
            )}
            <textarea
              id={element.id}
              name={element.id}
              placeholder={element.placeholder}
              rows={element.size === 'small' ? 2 : element.size === 'large' ? 6 : 4}
              disabled={element.disabled}
              defaultValue={element.defaultValue}
              className={getFieldClasses()}
              style={{
                ...getFieldStyles(),
                ...getPlaceholderStyles(),
                '--tw-ring-color': formOptions.inputFocusBorderColor || '#3B82F6',
              }}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label 
                htmlFor={element.id} 
                className="block text-sm font-medium mb-2"
                style={{ color: formOptions.labelTextColor }}
              >
                {element.label}
                {element.required && formOptions.showRequiredAsterisk !== false && (
                  <span style={{ color: formOptions.requiredAsteriskColor }}>{formOptions.requiredAsterisk || '*'}</span>
                )}
              </label>
            )}
            <input
              id={element.id}
              name={element.id}
              type="number"
              placeholder={element.placeholder}
              disabled={element.disabled}
              defaultValue={element.defaultValue}
              min={element.min}
              max={element.max}
              step={element.step}
              className={getFieldClasses()}
              style={{
                ...getFieldStyles(),
                ...getPlaceholderStyles(),
                '--tw-ring-color': formOptions.inputFocusBorderColor || '#3B82F6',
              }}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'date':
      case 'time':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label 
                htmlFor={element.id} 
                className="block text-sm font-medium mb-2"
                style={{ color: formOptions.labelTextColor }}
              >
                {element.label}
                {element.required && formOptions.showRequiredAsterisk !== false && (
                  <span style={{ color: formOptions.requiredAsteriskColor }}>{formOptions.requiredAsterisk || '*'}</span>
                )}
              </label>
            )}
            <input
              id={element.id}
              name={element.id}
              type={element.type}
              disabled={element.disabled}
              defaultValue={element.defaultValue}
              className={getFieldClasses()}
              style={getFieldStyles()}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label 
                htmlFor={element.id} 
                className="block text-sm font-medium mb-2"
                style={{ color: formOptions.labelTextColor }}
              >
                {element.label}
                {element.required && formOptions.showRequiredAsterisk !== false && (
                  <span style={{ color: formOptions.requiredAsteriskColor }}>{formOptions.requiredAsterisk || '*'}</span>
                )}
              </label>
            )}
            <input
              id={element.id}
              name={element.id}
              type="file"
              disabled={element.disabled}
              className={getFieldClasses()}
              style={getFieldStyles()}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'select':
        const selectOptions = getElementOptions();
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label 
                htmlFor={element.id} 
                className="block text-sm font-medium mb-2"
                style={{ color: formOptions.labelTextColor }}
              >
                {element.label}
                {element.required && formOptions.showRequiredAsterisk !== false && (
                  <span style={{ color: formOptions.requiredAsteriskColor }}>{formOptions.requiredAsterisk || '*'}</span>
                )}
              </label>
            )}
            <select 
              id={element.id}
              name={element.id}
              disabled={element.disabled}
              defaultValue={element.defaultValue}
              className={getFieldClasses()}
              style={getFieldStyles()}
            >
              <option value="">{element.placeholder || 'Select an option'}</option>
              {selectOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'multiselect':
        const multiselectOptions = getElementOptions();
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label 
                htmlFor={element.id} 
                className="block text-sm font-medium mb-2"
                style={{ color: formOptions.labelTextColor }}
              >
                {element.label}
                {element.required && formOptions.showRequiredAsterisk !== false && (
                  <span style={{ color: formOptions.requiredAsteriskColor }}>{formOptions.requiredAsterisk || '*'}</span>
                )}
              </label>
            )}
            <select 
              id={element.id}
              name={element.id}
              multiple 
              disabled={element.disabled}
              className={`${getFieldClasses()} min-h-[120px]`}
              style={getFieldStyles()}
            >
              {multiselectOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'checkbox':
        const checkboxOptions = getElementOptions();
        // Debug: log the options being rendered
        console.log('Checkbox options for', element.id, checkboxOptions);
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <fieldset className="mb-2">
                <legend className="text-sm font-medium text-gray-700">
                  {element.label}
                  {element.required && <span className="text-red-500 ml-1">*</span>}
                </legend>
              </fieldset>
            )}
            <div className="space-y-2">
              {checkboxOptions.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input 
                    id={`${element.id}_${index}`}
                    name={element.id}
                    type="checkbox" 
                    value={option.value}
                    disabled={element.disabled}
                    checked={Array.isArray(formValues[element.id]) ? formValues[element.id].includes(option.value) : false}
                    onChange={e => handleCheckboxChange(element.id, option.value, e.target.checked)}
                    className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${element.customClass || ''}`}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      case 'radio':
        const radioOptions = getElementOptions();
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <fieldset className="mb-2">
                <legend className="text-sm font-medium text-gray-700">
                  {element.label}
                  {element.required && <span className="text-red-500 ml-1">*</span>}
                </legend>
              </fieldset>
            )}
            <div className="space-y-2">
              {radioOptions.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input 
                    id={`${element.id}_${index}`}
                    name={element.id}
                    type="radio" 
                    value={option.value}
                    disabled={element.disabled}
                    checked={formValues[element.id] === option.value}
                    onChange={e => handleInputChange(element.id, option.value)}
                    className={`border-gray-300 text-blue-600 focus:ring-blue-500 ${element.customClass || ''}`}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Filter out invalid elements and ensure we have a clean array (keep only one declaration)
  // Note: validElements is already declared above using useMemo

  return (
    <div className={`${isExpanded ? 'w-full' : 'w-96 min-w-96'} transition-all duration-300 ease-in-out`}>
      <div className="p-6 h-full">
        <div className={`mb-4 ${isExpanded ? 'grid grid-cols-2 gap-4' : ''}`}>
          {/* Title and description */}
          <div className={isExpanded ? '' : 'mb-3'}>
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-600">See how your form will look to users</p>
          </div>
          
          {/* Buttons */}
          <div className={`flex items-center space-x-2 ${isExpanded ? 'justify-end' : ''}`}>
            <button
              onClick={() => setShowFormOptions(true)}
              className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2 shadow-sm"
              title="Configure form settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Form Options</span>
            </button>
            
            <button
              onClick={onToggleExpand}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
              title={isExpanded ? "Collapse preview" : "Expand preview"}
            >
              {isExpanded ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
                  </svg>
                  <span className="text-sm font-medium">Collapse</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15" />
                  </svg>
                  <span className="text-sm font-medium">Expand</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[700px] max-h-[700px] overflow-y-auto">
          {validElements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Form Preview</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Add fields to see how your form will look
              </p>
            </div>
          ) : (
            <div className={`p-6 ${isExpanded ? 'max-w-4xl mx-auto' : ''}`}>
              <form
                key={JSON.stringify(formElements)} // <--- Add this line
                style={{ backgroundColor: formOptions.containerBackgroundColor || '#F9FAFB' }}
              >
                {formOptions.formTitle && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{formOptions.formTitle}</h2>
                    {formOptions.formDescription && (
                      <p className="text-gray-600 mt-2">{formOptions.formDescription}</p>
                    )}
                  </div>
                )}
                {validElements.map(renderPreviewElement)}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    backgroundColor: formOptions.submitButtonColor || '#3B82F6',
                    color: formOptions.submitButtonTextColor || '#FFFFFF',
                    '--tw-ring-color': formOptions.submitButtonColor || '#3B82F6',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = formOptions.submitButtonHoverColor || '#2563EB';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = formOptions.submitButtonColor || '#3B82F6';
                  }}
                >
                  {(formOptions.submitButtonText && formOptions.submitButtonText.trim() !== '')
                    ? formOptions.submitButtonText
                    : 'Submit'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Keep modal always mounted to prevent hook order issues */}
        <FormOptionsModal
          isOpen={showFormOptions}
          onClose={() => setShowFormOptions(false)}
          onSave={onUpdateFormOptions}
          formOptions={formOptions}
        />
      </div>
    </div>
  );
});

LivePreview.displayName = 'LivePreview';

export default LivePreview;

