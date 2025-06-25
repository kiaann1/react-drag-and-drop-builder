/**
 * CSV Export utility with XSS/injection prevention
 * Handles form data and submission data exports
 */

import { sanitizeHtml } from './security.js';

// Helper function to split form elements into wizard steps
function splitIntoSteps(formElements) {
  if (!formElements || formElements.length === 0) {
    return { steps: [], isWizard: false };
  }

  const steps = [];
  let currentStep = {
    id: 'step-0',
    title: 'Step 1',
    description: '',
    fields: []
  };

  formElements.forEach((element) => {
    if (element.type === 'pageBreak') {
      // Complete current step if it has fields
      if (currentStep.fields.length > 0) {
        steps.push(currentStep);
      }
      
      // Start new step
      currentStep = {
        id: `step-${steps.length}`,
        title: element.label || `Step ${steps.length + 2}`,
        description: element.helpText || '',
        fields: []
      };
    } else {
      currentStep.fields.push(element);
    }
  });

  // Add the last step if it has fields
  if (currentStep.fields.length > 0) {
    steps.push(currentStep);
  }

  // If no page breaks found, treat entire form as single step
  if (steps.length === 0 && formElements.length > 0) {
    steps.push({
      id: 'step-0',
      title: 'Form',
      description: '',
      fields: formElements.filter(el => el.type !== 'pageBreak')
    });
  }

  return { 
    steps, 
    isWizard: steps.length > 1
  };
}

/**
 * Sanitizes data for CSV export to prevent formula injection and XSS
 * @param {string} value - The value to sanitize
 * @returns {string} - Sanitized value safe for CSV export
 */
export const sanitizeForCsv = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  // Convert to string
  let sanitized = String(value);

  // Remove or escape dangerous characters that could lead to formula injection
  // Excel/Google Sheets treat cells starting with =, +, -, @ as formulas
  if (sanitized.match(/^[=+\-@]/)) {
    // Prefix with single quote to treat as text, or use alternative approach
    sanitized = "'" + sanitized;
  }

  // Additional XSS prevention - sanitize HTML entities
  sanitized = sanitizeHtml(sanitized);

  // Remove potentially dangerous control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // Escape double quotes by doubling them (CSV standard)
  sanitized = sanitized.replace(/"/g, '""');

  // If the value contains commas, newlines, or quotes, wrap in quotes
  if (sanitized.includes(',') || sanitized.includes('\n') || sanitized.includes('\r') || sanitized.includes('"')) {
    sanitized = `"${sanitized}"`;
  }

  return sanitized;
};

/**
 * Converts form elements to CSV format with wizard support
 * @param {Array} formElements - Array of form elements
 * @param {string} formName - Name of the form
 * @param {Object} formOptions - Form configuration options
 * @returns {string} - CSV formatted string
 */
export const exportFormAsCsv = (formElements, formName = '', formOptions = {}) => {
  const sanitizedFormName = sanitizeForCsv(formName);
  const { steps, isWizard } = splitIntoSteps(formElements);
  
  // CSV Headers
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
    'Conditional Logic',
    'Wizard Step',
    'Step Title'
  ];

  // Create CSV rows
  const rows = [];
  
  if (isWizard) {
    // Export with wizard structure
    steps.forEach((step, stepIndex) => {
      step.fields.forEach(element => {
        rows.push([
          sanitizeForCsv(element.id || ''),
          sanitizeForCsv(element.type || ''),
          sanitizeForCsv(element.label || ''),
          sanitizeForCsv(element.required ? 'Yes' : 'No'),
          sanitizeForCsv(element.placeholder || ''),
          sanitizeForCsv(element.defaultValue || ''),
          sanitizeForCsv(element.options ? JSON.stringify(element.options) : ''),
          sanitizeForCsv([
            element.minLength ? `Min Length: ${element.minLength}` : '',
            element.maxLength ? `Max Length: ${element.maxLength}` : '',
            element.pattern ? `Pattern: ${element.pattern}` : '',
            element.min ? `Min: ${element.min}` : '',
            element.max ? `Max: ${element.max}` : '',
            element.step ? `Step: ${element.step}` : ''
          ].filter(Boolean).join('; ')),
          sanitizeForCsv(element.helpText || ''),
          sanitizeForCsv(element.width || 'full'),
          sanitizeForCsv(element.customClass || ''),
          sanitizeForCsv(element.conditionalLogic ? JSON.stringify(element.conditionalLogic) : ''),
          sanitizeForCsv(`${stepIndex + 1}`),
          sanitizeForCsv(step.title)
        ]);
      });
    });
  } else {
    // Export single-step form (original behavior)
    formElements.forEach(element => {
      if (element.type !== 'pageBreak') {
        rows.push([
          sanitizeForCsv(element.id || ''),
          sanitizeForCsv(element.type || ''),
          sanitizeForCsv(element.label || ''),
          sanitizeForCsv(element.required ? 'Yes' : 'No'),
          sanitizeForCsv(element.placeholder || ''),
          sanitizeForCsv(element.defaultValue || ''),
          sanitizeForCsv(element.options ? JSON.stringify(element.options) : ''),
          sanitizeForCsv([
            element.minLength ? `Min Length: ${element.minLength}` : '',
            element.maxLength ? `Max Length: ${element.maxLength}` : '',
            element.pattern ? `Pattern: ${element.pattern}` : '',
            element.min ? `Min: ${element.min}` : '',
            element.max ? `Max: ${element.max}` : '',
            element.step ? `Step: ${element.step}` : ''
          ].filter(Boolean).join('; ')),
          sanitizeForCsv(element.helpText || ''),
          sanitizeForCsv(element.width || 'full'),
          sanitizeForCsv(element.customClass || ''),
          sanitizeForCsv(element.conditionalLogic ? JSON.stringify(element.conditionalLogic) : ''),
          sanitizeForCsv('1'),
          sanitizeForCsv('Single Step Form')
        ]);
      }
    });
  }

  // Combine headers and rows
  const csvContent = [
    `# Form Export: ${sanitizedFormName}`,
    `# Form Type: ${isWizard ? 'Multi-Step Wizard' : 'Single Step'}`,
    `# Total Steps: ${steps.length}`,
    `# Exported on: ${sanitizeForCsv(new Date().toISOString())}`,
    `# Total Fields: ${formElements.filter(el => el.type !== 'pageBreak').length}`,
    '', // Empty line
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Converts form submission data to CSV format
 * @param {Array} submissions - Array of form submissions
 * @param {Array} formElements - Array of form elements for headers
 * @param {string} formName - Name of the form
 * @returns {string} - CSV formatted string
 */
export const exportSubmissionsAsCsv = (submissions, formElements, formName = '') => {
  if (!submissions || submissions.length === 0) {
    return `# No submissions found for form: ${sanitizeForCsv(formName)}\n# Exported on: ${new Date().toISOString()}`;
  }

  const sanitizedFormName = sanitizeForCsv(formName);

  // Create headers from form elements
  const fieldHeaders = formElements.map(element => sanitizeForCsv(element.label || element.id || 'Unknown Field'));
  const metaHeaders = ['Submission Date', 'Submission ID', 'IP Address', 'User Agent'];
  const headers = [...fieldHeaders, ...metaHeaders];

  // Create rows from submissions
  const rows = submissions.map(submission => {
    const fieldValues = formElements.map(element => {
      const value = submission.data?.[element.id] || '';
      return sanitizeForCsv(Array.isArray(value) ? value.join('; ') : value);
    });

    const metaValues = [
      sanitizeForCsv(submission.submittedAt || ''),
      sanitizeForCsv(submission.id || ''),
      sanitizeForCsv(submission.ipAddress || ''),
      sanitizeForCsv(submission.userAgent || '')
    ];

    return [...fieldValues, ...metaValues];
  });

  // Combine headers and rows
  const csvContent = [
    `# Form Submissions: ${sanitizedFormName}`,
    `# Exported on: ${sanitizeForCsv(new Date().toISOString())}`,
    `# Total Submissions: ${submissions.length}`,
    '', // Empty line
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Validates CSV data before export to ensure it's safe
 * @param {string} csvContent - The CSV content to validate
 * @returns {Object} - Validation result with isValid flag and errors
 */
export const validateCsvExport = (csvContent) => {
  const errors = [];
  
  if (!csvContent || typeof csvContent !== 'string') {
    errors.push('Invalid CSV content');
    return { isValid: false, errors };
  }

  // Check for potentially dangerous patterns
  const lines = csvContent.split('\n');
  const suspiciousPatterns = [
    /^[=+\-@].*(?<!^#|\s)/m, // Formula injection (except comments)
    /<script/i,              // Script tags
    /javascript:/i,          // JavaScript URLs
    /data:.*base64/i,        // Data URLs
    /vbscript:/i,            // VBScript URLs
  ];

  suspiciousPatterns.forEach((pattern, index) => {
    if (pattern.test(csvContent)) {
      errors.push(`Potentially dangerous pattern detected (${index + 1})`);
    }
  });

  // Check for excessively long lines (potential DoS)
  const maxLineLength = 32767; // Excel's cell limit
  lines.forEach((line, index) => {
    if (line.length > maxLineLength) {
      errors.push(`Line ${index + 1} exceeds maximum length (${maxLineLength} characters)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Creates a safe filename for CSV export
 * @param {string} formName - The form name
 * @param {string} type - The export type ('form' or 'submissions')
 * @returns {string} - Safe filename
 */
export const createSafeFilename = (formName, type = 'form') => {
  const sanitizedName = formName
    .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .slice(0, 50); // Limit length

  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `${sanitizedName}_${type}_${timestamp}.csv`;
};

/**
 * Downloads CSV content as a file
 * @param {string} csvContent - The CSV content
 * @param {string} filename - The filename
 */
export const downloadCsv = (csvContent, filename) => {
  // Validate before download
  const validation = validateCsvExport(csvContent);
  if (!validation.isValid) {
    console.error('CSV validation failed:', validation.errors);
    throw new Error(`CSV export failed validation: ${validation.errors.join(', ')}`);
  }

  // Create blob with UTF-8 BOM for proper Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};
