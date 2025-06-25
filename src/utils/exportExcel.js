/**
 * Excel Export utility with XSS/injection prevention
 * Uses SheetJS/xlsx library for Excel file creation
 * Note: This requires 'xlsx' package to be installed: npm install xlsx
 */

import { sanitizeHtml } from './security.js';

/**
 * Sanitizes data for Excel export to prevent formula injection and XSS
 * @param {any} value - The value to sanitize
 * @returns {any} - Sanitized value safe for Excel export
 */
export const sanitizeForExcel = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  // Handle different data types
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  // Convert to string and sanitize
  let sanitized = String(value);

  // Prevent formula injection - Excel treats cells starting with =, +, -, @ as formulas
  if (sanitized.match(/^[=+\-@]/)) {
    // Prefix with apostrophe to force text interpretation
    sanitized = "'" + sanitized;
  }

  // Additional XSS prevention
  sanitized = sanitizeHtml(sanitized);

  // Remove potentially dangerous control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Limit string length to Excel's cell limit
  if (sanitized.length > 32767) {
    sanitized = sanitized.substring(0, 32767);
  }

  return sanitized;
};

/**
 * Creates a safe worksheet name for Excel
 * @param {string} name - The desired worksheet name
 * @returns {string} - Safe worksheet name
 */
export const createSafeWorksheetName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Sheet1';
  }

  // Excel worksheet name restrictions:
  // - Max 31 characters
  // - Cannot contain: / \ ? * : [ ]
  // - Cannot be blank
  // - Cannot start or end with apostrophe
  let safeName = name
    .replace(/[\/\\?*:\[\]]/g, '_') // Replace invalid characters
    .replace(/^'|'$/g, '') // Remove leading/trailing apostrophes
    .slice(0, 31) // Limit length
    .trim();

  // Ensure it's not empty
  if (!safeName) {
    safeName = 'Sheet1';
  }

  return safeName;
};

/**
 * Converts form elements to Excel workbook data structure
 * @param {Array} formElements - Array of form elements
 * @param {string} formName - Name of the form
 * @param {Object} formOptions - Form configuration options
 * @returns {Object} - Excel workbook data structure
 */
export const prepareFormDataForExcel = (formElements, formName = '', formOptions = {}) => {
  const worksheetName = createSafeWorksheetName(formName || 'Form Structure');

  // Create headers
  const headers = [
    'Field ID',
    'Field Type',
    'Label',
    'Required',
    'Placeholder',
    'Default Value',
    'Options',
    'Validation Rules',
    'Help Text',
    'Width',
    'Custom Class',
    'Conditional Logic'
  ];

  // Create data rows
  const rows = formElements.map(element => [
    sanitizeForExcel(element.id || ''),
    sanitizeForExcel(element.type || ''),
    sanitizeForExcel(element.label || ''),
    element.required ? 'Yes' : 'No',
    sanitizeForExcel(element.placeholder || ''),
    sanitizeForExcel(element.defaultValue || ''),
    sanitizeForExcel(element.options ? JSON.stringify(element.options, null, 2) : ''),
    sanitizeForExcel([
      element.minLength ? `Min Length: ${element.minLength}` : '',
      element.maxLength ? `Max Length: ${element.maxLength}` : '',
      element.pattern ? `Pattern: ${element.pattern}` : '',
      element.min !== undefined ? `Min: ${element.min}` : '',
      element.max !== undefined ? `Max: ${element.max}` : '',
      element.step !== undefined ? `Step: ${element.step}` : ''
    ].filter(Boolean).join('\n')),
    sanitizeForExcel(element.helpText || ''),
    sanitizeForExcel(element.width || 'full'),
    sanitizeForExcel(element.customClass || ''),
    sanitizeForExcel(element.conditionalLogic ? JSON.stringify(element.conditionalLogic, null, 2) : '')
  ]);

  // Create metadata rows
  const metadata = [
    ['Form Name', sanitizeForExcel(formName)],
    ['Export Date', new Date()],
    ['Total Fields', formElements.length],
    ['Required Fields', formElements.filter(el => el.required).length],
    ['Form Title', sanitizeForExcel(formOptions.formTitle || '')],
    ['Form Description', sanitizeForExcel(formOptions.formDescription || '')],
    [], // Empty row
  ];

  // Combine metadata, headers, and data
  const worksheetData = [
    ...metadata,
    headers,
    ...rows
  ];

  return {
    worksheetName,
    data: worksheetData,
    metadata: {
      formName: sanitizeForExcel(formName),
      exportDate: new Date(),
      totalFields: formElements.length,
      requiredFields: formElements.filter(el => el.required).length
    }
  };
};

/**
 * Converts form submission data to Excel workbook data structure
 * @param {Array} submissions - Array of form submissions
 * @param {Array} formElements - Array of form elements for headers
 * @param {string} formName - Name of the form
 * @returns {Object} - Excel workbook data structure
 */
export const prepareSubmissionsDataForExcel = (submissions, formElements, formName = '') => {
  const worksheetName = createSafeWorksheetName(formName || 'Form Submissions');

  if (!submissions || submissions.length === 0) {
    return {
      worksheetName,
      data: [
        ['No submissions found'],
        ['Form Name', sanitizeForExcel(formName)],
        ['Export Date', new Date()]
      ],
      metadata: {
        formName: sanitizeForExcel(formName),
        exportDate: new Date(),
        totalSubmissions: 0
      }
    };
  }

  // Create headers from form elements
  const fieldHeaders = formElements.map(element => 
    sanitizeForExcel(element.label || element.id || 'Unknown Field')
  );
  const metaHeaders = ['Submission Date', 'Submission ID', 'IP Address', 'User Agent'];
  const headers = [...fieldHeaders, ...metaHeaders];

  // Create data rows from submissions
  const rows = submissions.map(submission => {
    const fieldValues = formElements.map(element => {
      const value = submission.data?.[element.id];
      if (Array.isArray(value)) {
        return sanitizeForExcel(value.join('; '));
      }
      return sanitizeForExcel(value || '');
    });

    const metaValues = [
      submission.submittedAt ? new Date(submission.submittedAt) : '',
      sanitizeForExcel(submission.id || ''),
      sanitizeForExcel(submission.ipAddress || ''),
      sanitizeForExcel(submission.userAgent || '')
    ];

    return [...fieldValues, ...metaValues];
  });

  // Create metadata rows
  const metadata = [
    ['Form Submissions Report'],
    ['Form Name', sanitizeForExcel(formName)],
    ['Export Date', new Date()],
    ['Total Submissions', submissions.length],
    ['Date Range', `${submissions[0]?.submittedAt || 'N/A'} to ${submissions[submissions.length - 1]?.submittedAt || 'N/A'}`],
    [], // Empty row
  ];

  // Combine metadata, headers, and data
  const worksheetData = [
    ...metadata,
    headers,
    ...rows
  ];

  return {
    worksheetName,
    data: worksheetData,
    metadata: {
      formName: sanitizeForExcel(formName),
      exportDate: new Date(),
      totalSubmissions: submissions.length
    }
  };
};

/**
 * Validates Excel data before export
 * @param {Object} workbookData - The workbook data to validate
 * @returns {Object} - Validation result with isValid flag and errors
 */
export const validateExcelExport = (workbookData) => {
  const errors = [];

  if (!workbookData || typeof workbookData !== 'object') {
    errors.push('Invalid workbook data');
    return { isValid: false, errors };
  }

  if (!Array.isArray(workbookData.data)) {
    errors.push('Invalid worksheet data format');
    return { isValid: false, errors };
  }

  // Check row and column limits
  const maxRows = 1048576; // Excel 2007+ limit
  const maxCols = 16384;   // Excel 2007+ limit

  if (workbookData.data.length > maxRows) {
    errors.push(`Too many rows: ${workbookData.data.length} (max: ${maxRows})`);
  }

  // Check each row for column count and content
  workbookData.data.forEach((row, rowIndex) => {
    if (Array.isArray(row)) {
      if (row.length > maxCols) {
        errors.push(`Row ${rowIndex + 1} has too many columns: ${row.length} (max: ${maxCols})`);
      }

      // Check for potentially dangerous content
      row.forEach((cell, colIndex) => {
        if (typeof cell === 'string') {
          // Check for suspicious patterns
          if (cell.includes('<script') || cell.includes('javascript:') || cell.includes('vbscript:')) {
            errors.push(`Potentially dangerous content in row ${rowIndex + 1}, column ${colIndex + 1}`);
          }

          // Check cell length
          if (cell.length > 32767) {
            errors.push(`Cell content too long in row ${rowIndex + 1}, column ${colIndex + 1}`);
          }
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Creates a safe filename for Excel export
 * @param {string} formName - The form name
 * @param {string} type - The export type ('form' or 'submissions')
 * @returns {string} - Safe filename
 */
export const createSafeExcelFilename = (formName, type = 'form') => {
  const sanitizedName = formName
    .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .slice(0, 50); // Limit length

  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `${sanitizedName}_${type}_${timestamp}.xlsx`;
};

/**
 * Exports form data as Excel file using xlsx library
 * Note: This function requires the 'xlsx' library to be installed
 * @param {Array} formElements - Array of form elements
 * @param {string} formName - Name of the form
 * @param {Object} formOptions - Form configuration options
 */
export const exportFormAsExcel = async (formElements, formName = '', formOptions = {}) => {
  try {
    // Dynamic import of xlsx library
    const XLSX = await import('xlsx');

    // Prepare data
    const workbookData = prepareFormDataForExcel(formElements, formName, formOptions);

    // Validate data
    const validation = validateExcelExport(workbookData);
    if (!validation.isValid) {
      throw new Error(`Excel export validation failed: ${validation.errors.join(', ')}`);
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(workbookData.data);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 15 }, // Field ID
      { wch: 12 }, // Field Type
      { wch: 20 }, // Label
      { wch: 8 },  // Required
      { wch: 20 }, // Placeholder
      { wch: 15 }, // Default Value
      { wch: 30 }, // Options
      { wch: 25 }, // Validation Rules
      { wch: 30 }, // Help Text
      { wch: 10 }, // Width
      { wch: 15 }, // Custom Class
      { wch: 30 }  // Conditional Logic
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, workbookData.worksheetName);

    // Generate filename
    const filename = createSafeExcelFilename(formName, 'form');

    // Write and download file
    XLSX.writeFile(workbook, filename);

    return {
      success: true,
      filename: filename,
      metadata: workbookData.metadata
    };

  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error(`Failed to export Excel file: ${error.message}`);
  }
};

/**
 * Exports form submissions as Excel file using xlsx library
 * @param {Array} submissions - Array of form submissions
 * @param {Array} formElements - Array of form elements
 * @param {string} formName - Name of the form
 */
export const exportSubmissionsAsExcel = async (submissions, formElements, formName = '') => {
  try {
    // Dynamic import of xlsx library
    const XLSX = await import('xlsx');

    // Prepare data
    const workbookData = prepareSubmissionsDataForExcel(submissions, formElements, formName);

    // Validate data
    const validation = validateExcelExport(workbookData);
    if (!validation.isValid) {
      throw new Error(`Excel export validation failed: ${validation.errors.join(', ')}`);
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(workbookData.data);

    // Set column widths based on form elements
    const columnWidths = formElements.map(() => ({ wch: 20 }));
    // Add widths for metadata columns
    columnWidths.push(
      { wch: 18 }, // Submission Date
      { wch: 15 }, // Submission ID
      { wch: 15 }, // IP Address
      { wch: 30 }  // User Agent
    );
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, workbookData.worksheetName);

    // Generate filename
    const filename = createSafeExcelFilename(formName, 'submissions');

    // Write and download file
    XLSX.writeFile(workbook, filename);

    return {
      success: true,
      filename: filename,
      metadata: workbookData.metadata
    };

  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error(`Failed to export Excel file: ${error.message}`);
  }
};

/**
 * Fallback Excel export using CSV format with .xlsx extension
 * This is used when the xlsx library is not available
 * @param {Array} formElements - Array of form elements
 * @param {string} formName - Name of the form
 * @param {Object} formOptions - Form configuration options
 */
export const exportFormAsExcelFallback = (formElements, formName = '', formOptions = {}) => {
  // Import CSV utilities
  import('./exportCsv.js').then(({ exportFormAsCsv, downloadCsv, createSafeFilename }) => {
    const csvContent = exportFormAsCsv(formElements, formName, formOptions);
    const filename = createSafeFilename(formName, 'form').replace('.csv', '.xlsx');
    
    // Create a more Excel-friendly CSV with tabs instead of commas
    const excelCsv = csvContent.replace(/,/g, '\t');
    
    downloadCsv(excelCsv, filename);
  });
};
