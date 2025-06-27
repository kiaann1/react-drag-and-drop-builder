import React, { useState, useEffect } from 'react';

const FormOptionsModal = ({ isOpen, onClose, onSave, formOptions }) => {
  const [activeTab, setActiveTab] = useState('styling');
  const [options, setOptions] = useState({
    submitButtonColor: '#3B82F6',
    submitButtonHoverColor: '#2563EB',
    submitButtonTextColor: '#FFFFFF',
    labelTextColor: '#374151',
    placeholderTextColor: '#9CA3AF',
    inputTextColor: '#111827',
    inputBorderColor: '#D1D5DB',
    inputFocusBorderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    containerBackgroundColor: '#F9FAFB',
    formTitle: '',
    formDescription: '',
    submitButtonText: 'Submit Form',
    successMessage: 'Thank you for your submission!',
    errorMessage: 'Please correct the errors below.',
    redirectUrl: '',
    showProgressBar: false,
    allowSaveDraft: false,
    enableAutoSave: false,
    showRequiredAsterisk: true,
    showValidationOnBlur: true,
    showValidationOnSubmit: true,
    highlightErrorFields: true,
    exportFormat: 'html',
    includeValidation: true,
    includeStyling: true,
    generateUniqueIds: true,
  });

  useEffect(() => {
    if (formOptions) {
      setOptions(prev => ({ ...prev, ...formOptions }));
    }
  }, [formOptions]);

  const handleSave = () => {
    onSave(options);
    onClose();
  };

  const updateOption = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'styling', label: 'Styling', icon: '🎨' },
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'behavior', label: 'Behavior', icon: '🔧' },
    { id: 'validation', label: 'Validation', icon: '✅' },
  ];

  if (!isOpen) {
    return null;
  }

  const renderStylingTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Submit Button</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.submitButtonColor}
                onChange={(e) => updateOption('submitButtonColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.submitButtonColor}
                onChange={(e) => updateOption('submitButtonColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hover Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.submitButtonHoverColor}
                onChange={(e) => updateOption('submitButtonHoverColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.submitButtonHoverColor}
                onChange={(e) => updateOption('submitButtonHoverColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.submitButtonTextColor}
                onChange={(e) => updateOption('submitButtonTextColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.submitButtonTextColor}
                onChange={(e) => updateOption('submitButtonTextColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
            <input
              type="text"
              value={options.submitButtonText}
              onChange={(e) => updateOption('submitButtonText', e.target.value)}
              placeholder="Submit"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Form Fields</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Label Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.labelTextColor}
                onChange={(e) => updateOption('labelTextColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.labelTextColor}
                onChange={(e) => updateOption('labelTextColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.placeholderTextColor}
                onChange={(e) => updateOption('placeholderTextColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.placeholderTextColor}
                onChange={(e) => updateOption('placeholderTextColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Input Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.inputTextColor}
                onChange={(e) => updateOption('inputTextColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.inputTextColor}
                onChange={(e) => updateOption('inputTextColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.inputBorderColor}
                onChange={(e) => updateOption('inputBorderColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.inputBorderColor}
                onChange={(e) => updateOption('inputBorderColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Focus Border Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.inputFocusBorderColor}
                onChange={(e) => updateOption('inputFocusBorderColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.inputFocusBorderColor}
                onChange={(e) => updateOption('inputFocusBorderColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Background Colors</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Background</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => updateOption('backgroundColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.backgroundColor}
                onChange={(e) => updateOption('backgroundColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Container Background</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.containerBackgroundColor}
                onChange={(e) => updateOption('containerBackgroundColor', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.containerBackgroundColor}
                onChange={(e) => updateOption('containerBackgroundColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
        <input
          type="text"
          value={options.formTitle}
          onChange={(e) => updateOption('formTitle', e.target.value)}
          placeholder="Enter form title"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Description</label>
        <textarea
          value={options.formDescription}
          onChange={(e) => updateOption('formDescription', e.target.value)}
          placeholder="Enter form description"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
        <input
          type="text"
          value={options.submitButtonText}
          onChange={(e) => updateOption('submitButtonText', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Success Message</label>
        <input
          type="text"
          value={options.successMessage}
          onChange={(e) => updateOption('successMessage', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Error Message</label>
        <input
          type="text"
          value={options.errorMessage}
          onChange={(e) => updateOption('errorMessage', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );

  const renderBehaviorTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URL (after submission)</label>
        <input
          type="url"
          value={options.redirectUrl}
          onChange={(e) => updateOption('redirectUrl', e.target.value)}
          placeholder="https://example.com/thank-you"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.showProgressBar}
            onChange={(e) => updateOption('showProgressBar', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Show progress bar for multi-step forms</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.allowSaveDraft}
            onChange={(e) => updateOption('allowSaveDraft', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Allow users to save draft</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.enableAutoSave}
            onChange={(e) => updateOption('enableAutoSave', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable auto-save</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.showRequiredAsterisk}
            onChange={(e) => updateOption('showRequiredAsterisk', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Show asterisk (*) for required fields</span>
        </label>
      </div>
    </div>
  );

  const renderValidationTab = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.showValidationOnBlur}
            onChange={(e) => updateOption('showValidationOnBlur', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Show validation errors when field loses focus</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.showValidationOnSubmit}
            onChange={(e) => updateOption('showValidationOnSubmit', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Show validation errors on form submission</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.highlightErrorFields}
            onChange={(e) => updateOption('highlightErrorFields', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Highlight fields with errors</span>
        </label>
      </div>
    </div>
  );


  const renderTabContent = () => {
    switch (activeTab) {
      case 'styling': return renderStylingTab();
      case 'general': return renderGeneralTab();
      case 'behavior': return renderBehaviorTab();
      case 'validation': return renderValidationTab();
      default: return renderStylingTab();
    }
  };

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Form Options</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(80vh-120px)]">
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-3">
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
            Save Options
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormOptionsModal;