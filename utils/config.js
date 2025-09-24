/**
 * CONFIGURATION FILE FOR HYDROPONIC DASHBOARD
 * 
 * LEARNING NOTES FOR BEGINNERS:
 * Configuration files centralize settings and constants.
 * Benefits include:
 * - Easy maintenance and updates
 * - Consistent values across the application
 * - Environment-specific configurations
 * - Reduced hard-coded values in components
 */

// ===============================
// APPLICATION CONFIGURATION
// ===============================

const APP_CONFIG = {
  // Application metadata
  name: 'Hydroponic System Dashboard',
  version: '2.0.0',
  description: 'Real-time monitoring dashboard for hydroponic systems',
  author: 'Hydroponic Systems Team',
  
  // Update intervals (milliseconds)
  dataUpdateInterval: 10000,      // Update sensor data every 10 seconds
  chartRefreshInterval: 5000,     // Refresh charts every 5 seconds
  statusCheckInterval: 30000,     // Check device status every 30 seconds
  
  // UI Configuration
  ui: {
    defaultTab: 'dashboard',
    maxRecentAlerts: 10,
    autoLogoutMinutes: 60,        // Auto logout after 1 hour of inactivity
    theme: 'gradient',            // 'gradient', 'light', 'dark'
    
    // Animation settings
    animations: {
      enabled: true,
      duration: 300,              // Default animation duration in ms
      easing: 'ease-out'
    },
    
    // Chart settings
    charts: {
      defaultHeight: 400,
      animationDuration: 750,
      gridColor: 'rgba(0, 0, 0, 0.1)',
      defaultColors: [
        '#3498db', '#e74c3c', '#f39c12', '#27ae60',
        '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
      ]
    }
  },
  
  // Feature flags
  features: {
    exportData: true,
    realTimeCharts: true,
    notifications: true,
    deviceManagement: true,
    profileManagement: true,
    advancedFiltering: false      // Future feature
  }
};

// ===============================
// SENSOR CONFIGURATION
// ===============================

const SENSOR_CONFIG = {
  // Sensor types and their properties
  types: {
    temperature: {
      name: 'Water Temperature',
      unit: '°C',
      icon: '🌡️',
      optimal: [20, 26],
      warning: [18, 28],
      critical: [15, 35],
      decimals: 1,
      color: '#e74c3c',
      description: 'Temperature of the nutrient solution'
    },
    humidity: {
      name: 'Humidity',
      unit: '%',
      icon: '💧',
      optimal: [60, 70],
      warning: [50, 80],
      critical: [30, 90],
      decimals: 1,
      color: '#3498db',
      description: 'Relative humidity in the growing environment'
    },
    electricConductivity: {
      name: 'Electric Conductivity',
      unit: ' μS/cm',
      icon: '⚡',
      optimal: [1000, 1400],
      warning: [800, 1600],
      critical: [500, 2000],
      decimals: 0,
      color: '#f39c12',
      description: 'Measure of nutrient concentration in solution'
    },
    waterLevel: {
      name: 'Water Level',
      unit: '%',
      icon: '🌊',
      optimal: [70, 100],
      warning: [40, 100],
      critical: [20, 100],
      decimals: 1,
      color: '#1abc9c',
      description: 'Water level in the reservoir'
    },
    pH: {
      name: 'pH Level',
      unit: ' pH',
      icon: '🧪',
      optimal: [6.0, 6.8],
      warning: [5.5, 7.5],
      critical: [4.0, 8.0],
      decimals: 1,
      color: '#9b59b6',
      description: 'Acidity/alkalinity of the nutrient solution'
    },
    lightIntensity: {
      name: 'Light Intensity',
      unit: '%',
      icon: '☀️',
      optimal: [60, 85],
      warning: [40, 100],
      critical: [20, 100],
      decimals: 1,
      color: '#f1c40f',
      description: 'Intensity of growing lights'
    },
    nutrientLevel: {
      name: 'Nutrient Level',
      unit: '%',
      icon: '🥬',
      optimal: [80, 100],
      warning: [60, 100],
      critical: [40, 100],
      decimals: 1,
      color: '#27ae60',
      description: 'Level of nutrients in the reservoir'
    },
    airTemperature: {
      name: 'Air Temperature',
      unit: '°C',
      icon: '🌡️',
      optimal: [22, 26],
      warning: [20, 30],
      critical: [15, 35],
      decimals: 1,
      color: '#e67e22',
      description: 'Ambient air temperature in growing area'
    }
  },
  
  // Default sensor update patterns for simulation
  updatePatterns: {
    temperature: { variation: 2, trend: 0, dailyCycle: true },
    humidity: { variation: 8, trend: 0, dailyCycle: false },
    electricConductivity: { variation: 100, trend: 0, dailyCycle: false },
    waterLevel: { variation: 15, trend: -0.5, dailyCycle: false },
    pH: { variation: 0.3, trend: 0, dailyCycle: false },
    lightIntensity: { variation: 20, trend: 0, dailyCycle: true },
    nutrientLevel: { variation: 10, trend: -0.3, dailyCycle: false },
    airTemperature: { variation: 3, trend: 0, dailyCycle: true }
  }
};

// ===============================
// DEVICE CONFIGURATION
// ===============================

const DEVICE_CONFIG = {
  // Default device settings
  defaults: {
    type: 'Hydroponic System',
    firmware: '1.2.3',
    status: 'offline',
    profile: 'default',
    serialPrefix: 'HY-RPI-'
  },
  
  // Device status definitions
  statusTypes: {
    online: {
      color: '#27ae60',
      icon: '🟢',
      description: 'Device is connected and operating normally'
    },
    offline: {
      color: '#e74c3c', 
      icon: '🔴',
      description: 'Device is not responding or disconnected'
    },
    warning: {
      color: '#f39c12',
      icon: '🟡',
      description: 'Device has warnings or minor issues'
    },
    maintenance: {
      color: '#9b59b6',
      icon: '🔧',
      description: 'Device is under maintenance'
    },
    unknown: {
      color: '#95a5a6',
      icon: '⚪',
      description: 'Device status is unknown'
    }
  },
  
  // Supported device types
  supportedTypes: [
    'Hydroponic System',
    'NFT System',
    'DWC System', 
    'Aeroponics System',
    'Media Bed System',
    'Wick System'
  ]
};

// ===============================
// CHART CONFIGURATION
// ===============================

const CHART_CONFIG = {
  // Time period options for charts
  timePeriods: {
    '1h': {
      label: 'Last Hour',
      minutes: 60,
      intervalMinutes: 10,
      format: 'time'
    },
    '6h': {
      label: 'Last 6 Hours',
      minutes: 360,
      intervalMinutes: 30,
      format: 'time'
    },
    '24h': {
      label: 'Last 24 Hours',
      minutes: 1440,
      intervalMinutes: 60,
      format: 'datetime'
    },
    '7d': {
      label: 'Last 7 Days',
      minutes: 10080,
      intervalMinutes: 240,
      format: 'date'
    }
  },
  
  // Chart.js default options
  defaultOptions: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          maxTicksLimit: 10
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6
      },
      line: {
        tension: 0.4
      }
    }
  }
};

// ===============================
// STORAGE CONFIGURATION
// ===============================

const STORAGE_CONFIG = {
  // localStorage keys (centralized to prevent typos)
  keys: {
    LOGIN_STATE: 'hydroponicDashboard_loginState',
    DEVICE_SENSOR_DATA: 'hydroponicDashboard_deviceSensorData',
    DEVICES: 'hydroponicDashboard_devices',
    PROFILES: 'hydroponicDashboard_profiles',
    ACTIVE_TAB: 'hydroponicDashboard_activeTab',
    SELECTED_DEVICE: 'hydroponicDashboard_selectedDevice',
    DEVICE_FORM: 'hydroponicDashboard_deviceForm',
    PROFILE_FORM: 'hydroponicDashboard_profileForm',
    CHART_SETTINGS: 'hydroponicDashboard_chartSettings',
    USER_PREFERENCES: 'hydroponicDashboard_userPreferences'
  },
  
  // Data retention settings
  retention: {
    sensorData: 30,              // Days to keep sensor data
    alertHistory: 90,            // Days to keep alert history
    deviceLogs: 7                // Days to keep device logs
  }
};

// ===============================
// NOTIFICATION CONFIGURATION
// ===============================

const NOTIFICATION_CONFIG = {
  // Notification types and their settings
  types: {
    info: {
      color: '#3498db',
      icon: 'ℹ️',
      duration: 5000,
      sound: false
    },
    success: {
      color: '#27ae60',
      icon: '✅',
      duration: 3000,
      sound: false
    },
    warning: {
      color: '#f39c12',
      icon: '⚠️',
      duration: 7000,
      sound: true
    },
    error: {
      color: '#e74c3c',
      icon: '❌',
      duration: 10000,
      sound: true
    },
    critical: {
      color: '#8e44ad',
      icon: '🚨',
      duration: 0,               // Don't auto-dismiss
      sound: true
    }
  },
  
  // When to show notifications
  triggers: {
    sensorCritical: true,
    deviceOffline: true,
    lowWaterLevel: true,
    extremePH: true,
    systemErrors: true,
    maintenanceReminders: false
  }
};

// ===============================
// API CONFIGURATION (for future backend integration)
// ===============================

const API_CONFIG = {
  // Base URLs for different environments
  endpoints: {
    development: 'http://localhost:3000/api',
    staging: 'https://staging-api.hydroponic-dashboard.com/api',
    production: 'https://api.hydroponic-dashboard.com/api'
  },
  
  // Request timeout settings
  timeout: 10000,                // 10 seconds
  retries: 3,
  retryDelay: 1000,              // 1 second
  
  // API endpoints
  paths: {
    auth: '/auth',
    devices: '/devices',
    sensors: '/sensors',
    profiles: '/profiles',
    export: '/export'
  }
};

// ===============================
// EXPORT CONFIGURATION
// ===============================

// Combine all configurations into a single object
const HYDROPONIC_CONFIG = {
  app: APP_CONFIG,
  sensors: SENSOR_CONFIG,
  devices: DEVICE_CONFIG,
  charts: CHART_CONFIG,
  storage: STORAGE_CONFIG,
  notifications: NOTIFICATION_CONFIG,
  api: API_CONFIG
};

// Make configuration available globally
window.HYDROPONIC_CONFIG = HYDROPONIC_CONFIG;

// Export individual configs for easier access
window.APP_CONFIG = APP_CONFIG;
window.SENSOR_CONFIG = SENSOR_CONFIG;
window.DEVICE_CONFIG = DEVICE_CONFIG;
window.CHART_CONFIG = CHART_CONFIG;
window.STORAGE_CONFIG = STORAGE_CONFIG;
window.NOTIFICATION_CONFIG = NOTIFICATION_CONFIG;
window.API_CONFIG = API_CONFIG;

/**
 * LEARNING NOTES - Configuration Best Practices:
 * 
 * 1. CENTRALIZATION: All settings in one place for easy maintenance
 * 2. ENVIRONMENT SUPPORT: Different configurations for dev/staging/prod
 * 3. DOCUMENTATION: Each setting has clear purpose and valid values
 * 4. VALIDATION: Include valid ranges and options where applicable
 * 5. EXTENSIBILITY: Structure allows easy addition of new features
 * 6. TYPE SAFETY: Consistent data types and structures
 * 7. DEFAULTS: Sensible default values for all settings
 */