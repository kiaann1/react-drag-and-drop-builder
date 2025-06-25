/**
 * Security utilities for form builder
 */

// XSS protection - sanitize HTML input
export const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// CSV/Excel injection prevention - sanitize data for export formats
export const sanitizeForExport = (value, format = 'csv') => {
  if (value === null || value === undefined) {
    return '';
  }

  let sanitized = String(value);

  // First apply HTML sanitization
  sanitized = sanitizeHtml(sanitized);

  // Prevent formula injection attacks in spreadsheet applications
  // Excel, Google Sheets, and other apps interpret cells starting with certain characters as formulas
  const formulaStarters = /^[=+\-@\t\r]/;
  if (formulaStarters.test(sanitized)) {
    // Prefix with single quote to force text interpretation
    sanitized = "'" + sanitized;
  }

  // Remove potentially dangerous control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Format-specific sanitization
  if (format === 'csv') {
    // Escape double quotes by doubling them (CSV standard)
    sanitized = sanitized.replace(/"/g, '""');
    
    // Wrap in quotes if contains CSV special characters
    if (sanitized.includes(',') || sanitized.includes('\n') || sanitized.includes('\r') || sanitized.includes('"')) {
      sanitized = `"${sanitized}"`;
    }
  } else if (format === 'excel') {
    // Excel has a 32,767 character limit per cell
    if (sanitized.length > 32767) {
      sanitized = sanitized.substring(0, 32767);
    }
  }

  return sanitized;
};

// Additional sanitization for user-generated content in exports
export const sanitizeUserContent = (content) => {
  if (typeof content !== 'string') return content;

  return content
    // Remove script tags and javascript: URLs
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, 'blocked:')
    .replace(/vbscript:/gi, 'blocked:')
    .replace(/data:text\/html/gi, 'blocked:')
    
    // Remove potentially dangerous attributes
    .replace(/on\w+\s*=/gi, 'blocked=')
    
    // Remove dangerous CSS
    .replace(/expression\s*\(/gi, 'blocked(')
    .replace(/behavior\s*:/gi, 'blocked:')
    
    // Limit length to prevent DoS
    .slice(0, 10000);
};

// Validate export data for suspicious content
export const validateExportData = (data, format = 'csv') => {
  const errors = [];
  const warnings = [];

  if (!data) {
    errors.push('No data provided for export');
    return { isValid: false, errors, warnings };
  }

  // Convert data to string for analysis
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);

  // Check for formula injection patterns
  const suspiciousPatterns = [
    { pattern: /^[=+\-@]/m, message: 'Potential formula injection detected' },
    { pattern: /<script/i, message: 'Script tag detected' },
    { pattern: /javascript:/i, message: 'JavaScript URL detected' },
    { pattern: /vbscript:/i, message: 'VBScript URL detected' },
    { pattern: /data:.*base64/i, message: 'Base64 data URL detected' },
    { pattern: /expression\s*\(/i, message: 'CSS expression detected' },
  ];

  suspiciousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(dataString)) {
      warnings.push(message);
    }
  });

  // Check for excessively long content (potential DoS)
  const maxLength = format === 'excel' ? 32767 : 1000000; // Excel cell limit vs general CSV limit
  if (dataString.length > maxLength) {
    errors.push(`Content exceeds maximum length for ${format} format`);
  }

  // Check for suspicious repeated patterns (potential DoS)
  const repeatedPattern = /(.{10,})\1{50,}/;
  if (repeatedPattern.test(dataString)) {
    warnings.push('Repeated content pattern detected (potential DoS)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Rate limiter specifically for export operations
export const createExportRateLimiter = () => {
  return createRateLimiter(5, 60000); // 5 exports per minute
};

// Generate secure export token to prevent unauthorized downloads
export const generateExportToken = () => {
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const randomString = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  
  return `${timestamp}-${randomString}`;
};

// Validate export token (basic implementation)
export const validateExportToken = (token, maxAge = 300000) => { // 5 minutes default
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('-');
  if (parts.length !== 2) {
    return false;
  }

  const timestamp = parseInt(parts[0], 10);
  if (isNaN(timestamp)) {
    return false;
  }

  const age = Date.now() - timestamp;
  return age <= maxAge;
};

// Validate CSS class names
export const validateCssClass = (className) => {
  if (typeof className !== 'string') return false;
  
  // CSS class name pattern (letters, numbers, hyphens, underscores only)
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(className) && className.length <= 100;
};

// Validate hex color codes
export const validateHexColor = (color) => {
  if (typeof color !== 'string') return false;
  
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
};

// Validate URL format
export const validateUrl = (url) => {
  if (typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Rate limiting for actions (simple client-side implementation)
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  isAllowed() {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  reset() {
    this.requests = [];
  }
}

export const createRateLimiter = (maxRequests, windowMs) => new RateLimiter(maxRequests, windowMs);

// Content Security Policy helpers
export const generateNonce = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Input validation schemas
export const validationSchemas = {
  formElement: {
    id: (value) => typeof value === 'string' && value.length > 0 && value.length <= 100,
    type: (value) => typeof value === 'string' && ['text', 'email', 'number', 'select', 'textarea', 'checkbox', 'radio', 'date', 'time', 'file', 'color', 'range'].includes(value),
    label: (value) => typeof value === 'string' && value.length > 0 && value.length <= 200,
    required: (value) => typeof value === 'boolean',
    placeholder: (value) => !value || (typeof value === 'string' && value.length <= 200),
    helpText: (value) => !value || (typeof value === 'string' && value.length <= 500),
    minLength: (value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 10000),
    maxLength: (value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 10000),
  },
  
  formOptions: {
    formTitle: (value) => !value || (typeof value === 'string' && value.length <= 200),
    formDescription: (value) => !value || (typeof value === 'string' && value.length <= 1000),
    submitButtonText: (value) => !value || (typeof value === 'string' && value.length <= 100),
    redirectUrl: (value) => !value || validateUrl(value),
  }
};

// Validate object against schema
export const validateAgainstSchema = (obj, schema) => {
  const errors = {};
  
  for (const [key, validator] of Object.entries(schema)) {
    if (obj.hasOwnProperty(key)) {
      try {
        if (!validator(obj[key])) {
          errors[key] = `Invalid value for ${key}`;
        }
      } catch (error) {
        errors[key] = `Validation error for ${key}: ${error.message}`;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Debounce function to prevent rapid successive calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
