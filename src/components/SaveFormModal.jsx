import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import hexToRgb from '../utils/hexToRgb';
import { exportAsJson } from '../utils/exportJson';
import { exportAsHtml } from '../utils/exportHtml';
import { exportAsReactComponent } from '../utils/exportReactComponent';
import { exportAsTypescriptComponent } from '../utils/exportTypescriptComponent';
import { exportAsCf7 } from '../utils/exportCf7';
import { exportFormAsCsv, downloadCsv, createSafeFilename } from '../utils/exportCsv';
import { exportFormAsExcel, exportFormAsExcelFallback } from '../utils/exportExcel';
import { validateExportData, createExportRateLimiter } from '../utils/security';

const exportFormats = [
  { value: 'json', label: 'JSON Data' },
  { value: 'react', label: 'React Component' },
  { value: 'typescript', label: 'TypeScript Component' },
  { value: 'wordpress', label: 'WordPress Shortcode' },
  { value: 'css-framework', label: 'HTML + Bootstrap' },
  { value: 'csv', label: 'CSV Spreadsheet' },
  { value: 'excel', label: 'Excel Workbook' }
];

const getFileExtension = (selectedFormat) => {
  const extensions = {
    'css-framework': 'html',
    json: 'json',
    typescript: 'tsx',
    react: 'jsx',
    wordpress: 'txt',
    csv: 'csv',
    excel: 'xlsx'
  };
  return extensions[selectedFormat] || 'txt';
};

const SaveFormModal = ({ isOpen, onClose, formElements, formOptions = {} }) => {
  const [formName, setFormName] = useState(formOptions.formTitle || '');
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const codeRef = useRef(null);
  const exportRateLimiter = useRef(createExportRateLimiter());

  useEffect(() => {
    setCopied(false);
    setExportError('');
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
      case 'csv':
        return exportFormAsCsv(formElements, formName, formOptions);
      case 'excel':
        return 'Excel files are downloaded directly. Click "Download Export" to generate the file.';
      default:
        return exportAsJson(formElements, formName, formOptions);
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    if (!formName.trim()) {
      Swal.fire({
        title: 'Form name required',
        text: 'Please enter a form name before copying.',
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Check rate limiting
    if (!exportRateLimiter.current.isAllowed()) {
      setExportError('Too many export attempts. Please wait a moment before trying again.');
      return;
    }

    // CSV and Excel files should be downloaded, not copied
    if (selectedFormat === 'csv' || selectedFormat === 'excel') {
      await handleDownloadExport();
      return;
    }

    const code = generateCode();
    
    // Validate export data for security
    const validation = validateExportData(code, selectedFormat);
    if (!validation.isValid) {
      setExportError(`Export validation failed: ${validation.errors.join(', ')}`);
      return;
    }

    if (validation.warnings.length > 0) {
      console.warn('Export warnings:', validation.warnings);
    }

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
      setExportError('');
      setTimeout(() => setCopied(false), 2000);
      
      // Show success toast
      Swal.fire({
        title: 'Copied!',
        text: 'Code copied to clipboard successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (err) {
      setCopied(false);
      setExportError('Failed to copy to clipboard.');
      Swal.fire({
        title: 'Copy Failed',
        text: 'Failed to copy to clipboard. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // Handle download export for CSV and Excel files
  const handleDownloadExport = async () => {
    if (!formName.trim()) {
      setExportError('Please enter a form name before exporting.');
      return;
    }

    // Check rate limiting
    if (!exportRateLimiter.current.isAllowed()) {
      setExportError('Too many export attempts. Please wait a moment before trying again.');
      return;
    }

    setIsExporting(true);
    setExportError('');

    try {
      if (selectedFormat === 'csv') {
        const csvContent = exportFormAsCsv(formElements, formName, formOptions);
        
        // Validate CSV data
        const validation = validateExportData(csvContent, 'csv');
        if (!validation.isValid) {
          throw new Error(`CSV export validation failed: ${validation.errors.join(', ')}`);
        }

        const filename = createSafeFilename(formName, 'form');
        downloadCsv(csvContent, filename);
        
      } else if (selectedFormat === 'excel') {
        try {
          await exportFormAsExcel(formElements, formName, formOptions);
        } catch (error) {
          console.warn('Excel export failed, using fallback:', error);
          exportFormAsExcelFallback(formElements, formName, formOptions);
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

    } catch (error) {
      console.error('Export failed:', error);
      setExportError(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Save to localStorage
  const handleSave = () => {
    if (!formName.trim()) {
      Swal.fire({
        title: 'Form name required',
        text: 'Please enter a form name before saving.',
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      });
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
    
    Swal.fire({
      title: 'Success!',
      text: 'Form saved successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
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
                {(selectedFormat === 'csv' || selectedFormat === 'excel') && (
                  <p className="text-blue-600 mt-2">📊 This format will download as a file</p>
                )}
              </div>
              {exportError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  <p className="font-medium">Export Error:</p>
                  <p>{exportError}</p>
                </div>
              )}
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
                    {selectedFormat === 'csv' || selectedFormat === 'excel' ? 'Downloaded' : 'Copied'}
                  </div>
                  <div className="flex gap-2 mt-4">
                    {selectedFormat === 'csv' || selectedFormat === 'excel' ? (
                      <button
                        type="button"
                        onClick={handleDownloadExport}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!formName.trim() || isExporting}
                        tabIndex={0}
                      >
                        {isExporting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Exporting...
                          </>
                        ) : (
                          'Download Export'
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCopyToClipboard}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        disabled={!formName.trim()}
                        tabIndex={0}
                      >
                        Copy to Clipboard
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
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