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
