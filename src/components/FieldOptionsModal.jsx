import React, { useState, useEffect } from 'react';

const FieldOptionsModal = ({ isOpen, onClose, onSave, element, onSwitchToEdit }) => {
  const [optionsData, setOptionsData] = useState({
    width: 'full',
    size: 'medium',
    hideLabel: false,
    disabled: false,
    customClass: '',
    conditionalLogic: false,
    conditionalField: '',
    conditionalValue: '',
    options: [],
  });

  const getDefaultOptions = (type) => {
    switch (type) {
      case 'select':
      case 'radio':
      case 'checkbox':
      case 'multiselect':
        return [
          { label: '', value: 'checked' }
        ];
      default:
        return [];
    }
  };

  // Fix: Avoid accessing element.options if element is null
  useEffect(() => {
    if (!element) return; // Prevent null access

    // Always use the latest options from element
    let options = Array.isArray(element.options) ? [...element.options] : getDefaultOptions(element?.type);
    // If the first option label is empty, use the field label as a placeholder
    if (
      ['select', 'radio', 'checkbox', 'multiselect'].includes(element.type) &&
      element.label &&
      options.length > 0 &&
      (!options[0].label || options[0].label.trim() === '')
    ) {
      options[0] = { ...options[0], label: element.label };
    }
    setOptionsData({
      width: element.width || 'full',
      size: element.size || 'medium',
      hideLabel: element.hideLabel || false,
      disabled: element.disabled || false,
      customClass: element.customClass || '',
      conditionalLogic: element.conditionalLogic || false,
      conditionalField: element.conditionalField || '',
      conditionalValue: element.conditionalValue || '',
      options,
    });
  }, [element, element?.options, element?.label]);

  if (!isOpen || !element) return null;

  const handleSave = () => {
    // Ensure the id is included in the saved data
    // Always pass a new array for options to trigger React updates
    if (onSave) {
      onSave(element.id, { ...optionsData, id: element.id, type: element.type, options: [...optionsData.options] });
    }
    onClose();
  };

  const addOption = () => {
    setOptionsData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { label: '', value: `option${prev.options.length + 1}` }
      ]
    }));
  };

  const removeOption = (index) => {
    setOptionsData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const updateOption = (index, field, value) => {
    setOptionsData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...prev, options: newOptions };
    });
  };

  const hasOptions = ['select', 'radio', 'checkbox', 'multiselect'].includes(element.type);

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Field Options</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Width</label>
              <select
                value={optionsData.width}
                onChange={(e) => setOptionsData({...optionsData, width: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full">Full Width</option>
                <option value="half">Half Width</option>
                <option value="third">One Third</option>
                <option value="quarter">Quarter Width</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Size</label>
              <select
                value={optionsData.size}
                onChange={(e) => setOptionsData({...optionsData, size: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Custom CSS Class</label>
              <div className="ml-2 group relative">
                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Don't include the dot (.) - just the class name
                </div>
              </div>
            </div>
            <input
              type="text"
              value={optionsData.customClass}
              onChange={(e) => setOptionsData({...optionsData, customClass: e.target.value})}
              placeholder="custom-field-class"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hideLabel"
                checked={optionsData.hideLabel}
                onChange={(e) => setOptionsData({...optionsData, hideLabel: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="hideLabel" className="ml-2 text-sm font-medium text-gray-700">
                Hide field label
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="disabled"
                checked={optionsData.disabled}
                onChange={(e) => setOptionsData({...optionsData, disabled: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="disabled" className="ml-2 text-sm font-medium text-gray-700">
                Disabled field
              </label>
            </div>
          </div>

          {hasOptions && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Field Options</label>
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Option
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {optionsData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    {/* Only show label input if label is not empty, otherwise just show value */}
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => updateOption(index, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => updateOption(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onSwitchToEdit}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ← Field Settings
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

export default FieldOptionsModal;