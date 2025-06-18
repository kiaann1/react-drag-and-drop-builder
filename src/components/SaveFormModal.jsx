import React, { useState, useRef, useEffect } from 'react';
import hexToRgb from '../utils/hexToRgb';
import { exportAsJson } from '../utils/exportJson';
import { exportAsHtml } from '../utils/exportHtml';
import { exportAsReactComponent } from '../utils/exportReactComponent';
import { exportAsTypescriptComponent } from '../utils/exportTypescriptComponent';
import { exportAsCf7 } from '../utils/exportCf7';

const exportFormats = [
  { value: 'json', label: 'JSON Data' },
  { value: 'react', label: 'React Component' },
  { value: 'typescript', label: 'TypeScript Component' },
  { value: 'wordpress', label: 'WordPress Shortcode' },
  { value: 'css-framework', label: 'HTML + Bootstrap' }
];

const getFileExtension = (selectedFormat) => {
  const extensions = {
    'css-framework': 'html',
    json: 'json',
    typescript: 'tsx',
    react: 'jsx',
    wordpress: 'txt'
  };
  return extensions[selectedFormat] || 'txt';
};

const SaveFormModal = ({ isOpen, onClose, formElements, formOptions = {} }) => {
  const [formName, setFormName] = useState(formOptions.formTitle || '');
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    setCopied(false);
  }, [isOpen, selectedFormat, formName, formElements]);

  // Generate export code based on selected format
  const generateCode = () => {
    switch (selectedFormat) {
      case 'json':
        return exportAsJson(formElements, formName, formOptions);
      case 'wordpress':
        return exportAsCf7(formElements, formOptions);
      case 'react':
        return exportAsReactComponent(formElements, formOptions);
      case 'typescript':
        return exportAsTypescriptComponent(formElements, formName, formOptions);
      case 'css-framework':
        return exportAsHtml(formElements, formName, formOptions, hexToRgb);
      default:
        return exportAsJson(formElements, formName, formOptions);
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    if (!formName.trim()) {
      alert('Please enter a form name before copying.');
      return;
    }
    const code = generateCode();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else if (codeRef.current) {
        codeRef.current.removeAttribute('readonly');
        codeRef.current.select();
        document.execCommand('copy');
        codeRef.current.setAttribute('readonly', '');
      } else {
        let textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
      alert('Failed to copy to clipboard.');
    }
  };

  // Save to localStorage
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
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-5/6 overflow-hidden flex flex-col shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Save & Export Form</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            aria-label="Close"
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
                  placeholder="You must enter a form name in order to copy export"
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format:</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <p>File extension: .{getFileExtension(selectedFormat)}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  disabled={!formName.trim()}
                >
                  Save Form
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code Preview:</label>
              <textarea
                key={selectedFormat + formName + formElements.length}
                ref={codeRef}
                value={generateCode()}
                readOnly
                className="w-full h-80 p-3 border border-gray-300 rounded-md font-mono text-xs bg-gray-50 resize-none"
                placeholder="Generated code will appear here..."
                tabIndex={-1}
              />
              <div className="flex justify-end mt-2">
                <div className="relative flex flex-col items-center">
                  <div
                    className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded shadow z-10 transition-opacity duration-500 ${copied ? 'opacity-100' : 'opacity-0'}`}
                    style={{ minWidth: 60, textAlign: 'center' }}
                    aria-live="polite"
                  >
                    Copied
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    disabled={!formName.trim()}
                    tabIndex={0}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveFormModal;