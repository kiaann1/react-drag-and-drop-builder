import React, { useState, useEffect, useCallback } from 'react';

const EditFieldModal = ({ isOpen, onClose, onSave, element, onSwitchToOptions }) => {
  const [formData, setFormData] = useState({
    label: '',
    placeholder: '',
    required: false,
    defaultValue: '',
    minLength: '',
    maxLength: '',
    pattern: '',
    helpText: '',
    min: '',
    max: '',
    step: '',
  });
  const [error, setError] = useState('');

  // Input sanitization function
  const sanitizeInput = useCallback((value, type = 'text') => {
    if (typeof value !== 'string') return value;
    
    let sanitized = value.trim();
    
    switch (type) {
      case 'text':
        // Remove HTML tags and limit length
        sanitized = sanitized.replace(/<[^>]*>/g, '').slice(0, 1000);
        break;
      case 'number':
        // Ensure it's a valid number
        const num = parseFloat(sanitized);
        return isNaN(num) ? '' : num.toString();
      case 'pattern':
        // Validate regex pattern
        try {
          new RegExp(sanitized);
          return sanitized.slice(0, 200);
        } catch (e) {
          setError('Invalid regex pattern');
          return '';
        }
      case 'className':
        // Only allow valid CSS class characters
        return sanitized.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 100);
      default:
        return sanitized.slice(0, 500);
    }
    
    return sanitized;
  }, []);

  const validateInput = useCallback((name, value) => {
    switch (name) {
      case 'minLength':
      case 'maxLength':
        const length = parseInt(value, 10);
        if (value !== '' && (isNaN(length) || length < 0 || length > 10000)) {
          return 'Length must be between 0 and 10000';
        }
        break;
      case 'min':
      case 'max':
        const num = parseFloat(value);
        if (value !== '' && (isNaN(num) || num < -1000000 || num > 1000000)) {
          return 'Number must be between -1,000,000 and 1,000,000';
        }
        break;
      case 'step':
        const step = parseFloat(value);
        if (value !== '' && (isNaN(step) || step <= 0)) {
          return 'Step must be a positive number';
        }
        break;
    }
    return '';
  }, []);

  const handleInputChange = useCallback((name, value) => {
    const validationError = validateInput(name, value);
    if (validationError) {
      setError(validationError);
      return;
    }

    const sanitizedValue = sanitizeInput(value, name === 'pattern' ? 'pattern' : name.includes('Length') || name === 'min' || name === 'max' || name === 'step' ? 'number' : 'text');
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    setError('');
  }, [sanitizeInput, validateInput]);

  useEffect(() => {
    if (element) {
      setFormData({
        label: element.label || '',
        placeholder: element.placeholder || '',
        required: element.required || false,
        defaultValue: element.defaultValue || '',
        minLength: element.minLength || '',
        maxLength: element.maxLength || '',
        pattern: element.pattern || '',
        helpText: element.helpText || '',
        min: element.min || '',
        max: element.max || '',
        step: element.step || '',
      });
    }
  }, [element]);

  const handleSave = useCallback(() => {
    try {
      // Final validation before saving
      const requiredFields = ['label'];
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
          setError(`${field} is required`);
          return;
        }
      }

      // Validate min/max length relationship
      if (formData.minLength && formData.maxLength) {
        const min = parseInt(formData.minLength, 10);
        const max = parseInt(formData.maxLength, 10);
        if (min > max) {
          setError('Minimum length cannot be greater than maximum length');
          return;
        }
      }

      // Validate min/max value relationship
      if (formData.min && formData.max) {
        const min = parseFloat(formData.min);
        const max = parseFloat(formData.max);
        if (min > max) {
          setError('Minimum value cannot be greater than maximum value');
          return;
        }
      }

      onSave(element.id, formData);
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save field data');
    }
  }, [formData, element?.id, onSave, onClose]);

  if (!isOpen || !element) return null;

  const renderFieldSpecificOptions = () => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'name':
      case 'company':
      case 'address':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Length</label>
                <input
                  type="number"
                  value={formData.minLength}
                  onChange={(e) => handleInputChange('minLength', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Length</label>
                <input
                  type="number"
                  value={formData.maxLength}
                  onChange={(e) => handleInputChange('maxLength', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        );
      case 'number':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
              <input
                type="number"
                value={formData.min}
                onChange={(e) => handleInputChange('min', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
              <input
                type="number"
                value={formData.max}
                onChange={(e) => handleInputChange('max', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Step</label>
              <input
                type="number"
                value={formData.step}
                onChange={(e) => handleInputChange('step', e.target.value)}
                placeholder="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      case 'paragraph':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Length</label>
              <input
                type="number"
                value={formData.minLength}
                onChange={(e) => handleInputChange('minLength', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Length</label>
              <input
                type="number"
                value={formData.maxLength}
                onChange={(e) => handleInputChange('maxLength', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Edit Field</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
            <input
              type="text"
              value={formData.placeholder}
              onChange={(e) => handleInputChange('placeholder', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Value</label>
            <input
              type="text"
              value={formData.defaultValue}
              onChange={(e) => handleInputChange('defaultValue', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Help Text</label>
            <input
              type="text"
              value={formData.helpText}
              onChange={(e) => handleInputChange('helpText', e.target.value)}
              placeholder="Additional instructions for users"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) => setFormData({...formData, required: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="required" className="ml-2 text-sm font-medium text-gray-700">
              Required field
            </label>
          </div>

          {renderFieldSpecificOptions()}

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onSwitchToOptions}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Field Options →
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFieldModal;
