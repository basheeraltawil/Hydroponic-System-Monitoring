/**
 * UTILITY FUNCTIONS FOR HYDROPONIC DASHBOARD
 * 
 * LEARNING NOTES FOR BEGINNERS:
 * Utility functions are reusable pieces of code that perform common tasks.
 * They help keep components clean and promote code reuse.
 * These functions demonstrate:
 * - Pure functions (same input always produces same output)
 * - Error handling and validation
 * - Data transformation and formatting
 * - JavaScript best practices
 */

// ===============================
// DATA VALIDATION UTILITIES
// ===============================

/**
 * Validate if a value is a valid number within a given range
 * @param {*} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidNumber = (value, min = -Infinity, max = Infinity) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }
  return value >= min && value <= max;
};

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

/**
 * Validate required form fields
 * @param {Object} data - Form data object
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
const validateFormData = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    const value = data[field];
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[field] = `${field} is required`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ===============================
// DATA FORMATTING UTILITIES
// ===============================

/**
 * Format numbers for display with proper decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @param {string} fallback - Value to return if input is invalid
 * @returns {string} - Formatted number string
 */
const formatNumber = (value, decimals = 1, fallback = 'N/A') => {
  if (!isValidNumber(value)) {
    return fallback;
  }
  return Number(value).toFixed(decimals);
};

/**
 * Format dates for consistent display
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
const formatDate = (date, options = {}) => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return dateObj.toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Format time duration (milliseconds to human readable)
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} - Human readable duration
 */
const formatDuration = (milliseconds) => {
  if (!isValidNumber(milliseconds, 0)) {
    return '0 seconds';
  }
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
};

/**
 * Format file sizes (bytes to human readable)
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Human readable file size
 */
const formatFileSize = (bytes, decimals = 2) => {
  if (!isValidNumber(bytes, 0)) {
    return '0 Bytes';
  }
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

// ===============================
// SENSOR-SPECIFIC UTILITIES
// ===============================

/**
 * Get sensor status based on value and type
 * @param {string} sensorType - Type of sensor
 * @param {number} value - Current sensor value
 * @returns {Object} - { status: string, color: string, message: string }
 */
const getSensorStatus = (sensorType, value) => {
  // Define optimal ranges for each sensor type
  const ranges = {
    temperature: { 
      optimal: [20, 26], 
      warning: [18, 28],
      unit: '°C',
      name: 'Water Temperature'
    },
    humidity: { 
      optimal: [60, 70], 
      warning: [50, 80],
      unit: '%',
      name: 'Humidity'
    },
    electricConductivity: { 
      optimal: [1000, 1400], 
      warning: [800, 1600],
      unit: ' μS/cm',
      name: 'Electric Conductivity'
    },
    waterLevel: { 
      optimal: [70, 100], 
      warning: [40, 100],
      unit: '%',
      name: 'Water Level'
    },
    pH: { 
      optimal: [6.0, 6.8], 
      warning: [5.5, 7.5],
      unit: ' pH',
      name: 'pH Level'
    },
    lightIntensity: { 
      optimal: [60, 85], 
      warning: [40, 100],
      unit: '%',
      name: 'Light Intensity'
    },
    nutrientLevel: { 
      optimal: [80, 100], 
      warning: [60, 100],
      unit: '%',
      name: 'Nutrient Level'
    },
    airTemperature: { 
      optimal: [22, 26], 
      warning: [20, 30],
      unit: '°C',
      name: 'Air Temperature'
    }
  };

  const range = ranges[sensorType];
  if (!range || !isValidNumber(value)) {
    return {
      status: 'unknown',
      color: '#95a5a6',
      message: 'Unknown status'
    };
  }

  const [optimalMin, optimalMax] = range.optimal;
  const [warningMin, warningMax] = range.warning;

  if (value >= optimalMin && value <= optimalMax) {
    return {
      status: 'optimal',
      color: '#27ae60',
      message: `${range.name} is in optimal range`
    };
  }
  
  if (value >= warningMin && value <= warningMax) {
    return {
      status: 'warning',
      color: '#f39c12',
      message: `${range.name} needs attention`
    };
  }
  
  return {
    status: 'critical',
    color: '#e74c3c',
    message: `${range.name} is in critical range`
  };
};

/**
 * Generate realistic sensor data variations
 * @param {number} baseValue - Base sensor value
 * @param {string} sensorType - Type of sensor
 * @param {number} variationPercent - Variation percentage (0-100)
 * @returns {number} - New sensor value with realistic variation
 */
const generateSensorVariation = (baseValue, sensorType, variationPercent = 5) => {
  if (!isValidNumber(baseValue)) return baseValue;
  
  const variation = (Math.random() - 0.5) * 2 * (variationPercent / 100);
  let newValue = baseValue * (1 + variation);
  
  // Apply sensor-specific constraints
  switch (sensorType) {
    case 'temperature':
    case 'airTemperature':
      newValue = Math.max(15, Math.min(35, newValue));
      break;
    case 'humidity':
    case 'waterLevel':
    case 'lightIntensity':
    case 'nutrientLevel':
      newValue = Math.max(0, Math.min(100, newValue));
      break;
    case 'electricConductivity':
      newValue = Math.max(500, Math.min(2000, newValue));
      break;
    case 'pH':
      newValue = Math.max(4.0, Math.min(8.0, newValue));
      break;
    default:
      // No constraints for unknown sensor types
      break;
  }
  
  return Math.round(newValue * 10) / 10; // Round to 1 decimal place
};

// ===============================
// DATA EXPORT UTILITIES
// ===============================

/**
 * Convert data to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {string[]} headers - Column headers (optional)
 * @returns {string} - CSV string
 */
const convertToCSV = (data, headers = null) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = csvHeaders.join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      }
      
      if (value instanceof Date) {
        return `"${formatDate(value)}"`;
      }
      
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download data as CSV file
 * @param {string} csvData - CSV formatted string
 * @param {string} filename - Name for the downloaded file
 */
const downloadCSV = (csvData, filename = 'data.csv') => {
  try {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      // Create download link
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL object
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      console.warn('CSV download not supported in this browser');
    }
  } catch (error) {
    console.error('Error downloading CSV:', error);
  }
};

// ===============================
// DOM AND EVENT UTILITIES
// ===============================

/**
 * Debounce function calls to prevent excessive execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function calls to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate unique IDs for components
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - Unique ID string
 */
const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone objects (for state management)
 * @param {*} obj - Object to clone
 * @returns {*} - Deep cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

// ===============================
// EXPORT UTILITIES FOR GLOBAL ACCESS
// ===============================

// Make all utilities available globally for CDN setup
const HydroponicUtils = {
  // Validation
  isValidNumber,
  isValidEmail,
  validateFormData,
  
  // Formatting
  formatNumber,
  formatDate,
  formatDuration,
  formatFileSize,
  
  // Sensor utilities
  getSensorStatus,
  generateSensorVariation,
  
  // Data export
  convertToCSV,
  downloadCSV,
  
  // DOM and events
  debounce,
  throttle,
  generateId,
  deepClone
};

// Global assignment for CDN usage
window.HydroponicUtils = HydroponicUtils;

/**
 * LEARNING NOTES - Utility Functions Best Practices:
 * 
 * 1. PURE FUNCTIONS: Most utilities are pure functions (same input = same output)
 * 2. ERROR HANDLING: Always validate inputs and handle edge cases gracefully
 * 3. DOCUMENTATION: Each function has clear JSDoc comments
 * 4. REUSABILITY: Functions are generic and can be used in multiple contexts
 * 5. PERFORMANCE: Debounce/throttle prevent excessive function calls
 * 6. TYPE SAFETY: Input validation ensures functions work with expected data types
 * 7. MODULARITY: Functions are focused on single responsibilities
 */