import React, { useState, useRef, useEffect } from 'react';
import hexToRgb from '../utils/hexToRgb';

// Import export utilities
import { exportAsJson } from '../utils/exportJson';
import { exportAsHtml } from '../utils/exportHtml';
import { exportAsReactComponent } from '../utils/exportReactComponent';
import { exportAsTypescriptComponent } from '../utils/exportTypescriptComponent';
import { exportAsCf7 } from '../utils/exportCf7';

const SaveFormModal = ({ isOpen, onClose, formElements, formOptions = {} }) => {
  const [formName, setFormName] = useState(formOptions.formTitle || '');
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    setCopied(false);
  }, [isOpen, selectedFormat, formName, formElements]);

  // --- CODE GENERATION FUNCTIONS (now use utils) ---
  const generateJSON = () => exportAsJson(formElements, formName, formOptions);
  const generateBootstrapHTML = () => exportAsHtml(formElements, formName, formOptions, hexToRgb);
  const generateReactComponent = () => exportAsReactComponent(formElements, formOptions);
  const generateTypeScriptComponent = () => exportAsTypescriptComponent(formElements, formName, formOptions);
  const generateWordPressShortcode = () => exportAsCf7(formElements, formOptions);

  // Only include export formats for which we have utils
  const exportFormats = [
    { value: 'json', label: 'JSON Data' },
    { value: 'react', label: 'React Component' },
    { value: 'typescript', label: 'TypeScript Component' },
    { value: 'wordpress', label: 'WordPress Shortcode' },
    { value: 'css-framework', label: 'HTML + Bootstrap' }
  ];

  const generateCode = () => {
    switch (selectedFormat) {
      case 'json': return generateJSON();
      case 'wordpress': return generateWordPressShortcode();
      case 'react': return generateReactComponent();
      case 'typescript': return generateTypeScriptComponent();
      case 'css-framework': return generateBootstrapHTML();
      default: return generateJSON();
    }
  };

  const getFileExtension = () => {
    const extensions = {
      'css-framework': 'html',
      json: 'json',
      typescript: 'tsx',
      react: 'jsx',
      wordpress: 'txt'
    };
    return extensions[selectedFormat] || 'txt';
  };

  // Copy to clipboard logic
  const handleCopyToClipboard = async () => {
    if (!formName.trim()) {
      alert('Please enter a form name before copying.');
      return;
    }
    const code = generateCode();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else if (codeRef.current) {
        codeRef.current.removeAttribute('readonly');
        codeRef.current.select();
        document.execCommand('copy');
        codeRef.current.setAttribute('readonly', '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      setCopied(false);
      alert('Failed to copy to clipboard.');
    }
  };

  // Save to localStorage logic
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
                  placeholder="You must enter a form name in order to copy export"
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
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
  );
};

export default SaveFormModal;

// Ensure the file extension is .jsx (which it is), and that all JSX is valid.
// No code changes are needed for this error if the file is named .jsx and contains valid JSX.
// If you still see this error, ensure your build tool (like Vite) is configured to handle .jsx files.