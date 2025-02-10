/**
 * Safely convert a value to a string representation
 * @param {*} value - The value to convert
 * @param {Object} [options] - Optional configuration
 * @param {string[]} [options.preferredKeys] - Keys to prefer when converting objects
 * @param {string} [options.fallback] - Fallback value if conversion fails
 * @returns {string} - A safe string representation
 */
export const safeRender = (value, options = {}) => {
  const {
    preferredKeys = ['name', 'title', 'id', 'label'],
    fallback = ''
  } = options;

  // Handle null or undefined
  if (value === null || value === undefined) {
    return fallback;
  }

  // If it's already a primitive, return its string representation
  if (['string', 'number', 'boolean'].includes(typeof value)) {
    return String(value);
  }

  // If it's an object
  if (typeof value === 'object') {
    // Try preferred keys
    for (const key of preferredKeys) {
      if (value[key] !== undefined) {
        return String(value[key]);
      }
    }

    // If no preferred keys, try JSON stringification
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }

  // Fallback for any other type
  return fallback;
};

/**
 * Safely render an array of items
 * @param {Array} items - Array to render
 * @param {Object} [options] - Rendering options
 * @returns {string[]} - Array of safely rendered strings
 */
export const safeRenderArray = (items, options = {}) => {
  if (!Array.isArray(items)) return [];
  return items.map(item => safeRender(item, options));
};

/**
 * Type-safe object property accessor
 * @param {Object} obj - Source object
 * @param {string} path - Dot-separated path to property
 * @param {*} [defaultValue] - Default value if property not found
 * @returns {*} - Safely accessed property value
 */
export const safeGet = (obj, path, defaultValue = undefined) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }
  
  return result ?? defaultValue;
};

/**
 * Validate and sanitize form inputs
 * @param {Object} formData - Form data object
 * @param {Object} schema - Validation schema
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (formData, schema = {}) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    const validator = schema[key];
    
    if (validator) {
      // Apply custom validation/transformation
      sanitized[key] = validator(value);
    } else {
      // Default: convert to string or keep as-is
      sanitized[key] = safeRender(value);
    }
  }
  
  return sanitized;
};

// Example validation schemas
export const validationSchemas = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? value : '';
  },
  number: (value) => {
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? 0 : numericValue;
  }
};
