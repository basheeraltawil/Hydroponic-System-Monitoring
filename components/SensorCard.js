/**
 * SensorCard Component - Displays individual sensor data with visual status indicators
 * 
 * LEARNING NOTES FOR BEGINNERS:
 * - This is a reusable component that accepts props (properties) from parent
 * - Props are like function parameters but for React components
 * - Conditional rendering changes appearance based on sensor values
 * - CSS classes are applied dynamically using template literals and ternary operators
 */

const SensorCard = ({ title, value, unit, icon, sensorType, onClick }) => {
  /**
   * Determine sensor status based on value ranges
   * Each sensor type has different optimal, warning, and critical ranges
   * 
   * LEARNING NOTES:
   * - Switch statements are efficient for multiple conditions
   * - Object destructuring extracts values from nested objects
   * - This function demonstrates business logic separation from UI
   */
  const getSensorStatus = (sensorType, value) => {
    // Define optimal ranges for each sensor type
    const ranges = {
      temperature: { optimal: [20, 26], warning: [18, 28] },
      humidity: { optimal: [60, 70], warning: [50, 80] },
      electricConductivity: { optimal: [1000, 1400], warning: [800, 1600] },
      waterLevel: { optimal: [70, 100], warning: [40, 100] },
      pH: { optimal: [6.0, 6.8], warning: [5.5, 7.5] },
      lightIntensity: { optimal: [60, 85], warning: [40, 100] },
      nutrientLevel: { optimal: [80, 100], warning: [60, 100] },
      airTemperature: { optimal: [22, 26], warning: [20, 30] }
    };

    const range = ranges[sensorType];
    if (!range) return 'unknown'; // Default for unknown sensor types

    // Check value against ranges and return appropriate status
    const [optimalMin, optimalMax] = range.optimal;
    const [warningMin, warningMax] = range.warning;

    if (value >= optimalMin && value <= optimalMax) return 'optimal';
    if (value >= warningMin && value <= warningMax) return 'warning';
    return 'critical';
  };

  /**
   * Format sensor value for display
   * Some values need different decimal places for readability
   */
  const formatValue = (value, sensorType) => {
    if (typeof value !== 'number') return 'N/A';
    
    // pH values typically show one decimal place
    if (sensorType === 'pH') {
      return value.toFixed(1);
    }
    
    // Most other sensors show one decimal, but integers for some
    if (sensorType === 'electricConductivity') {
      return Math.round(value).toString();
    }
    
    return value.toFixed(1);
  };

  /**
   * Get status icon and text based on sensor condition
   */
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'optimal':
        return { icon: '✓', text: 'Good', class: 'optimal' };
      case 'warning':
        return { icon: '⚠', text: 'Warning', class: 'warning' };
      case 'critical':
        return { icon: '⚡', text: 'Critical', class: 'critical' };
      default:
        return { icon: '?', text: 'Unknown', class: 'unknown' };
    }
  };

  // Calculate current sensor status
  const status = getSensorStatus(sensorType, value);
  const statusDisplay = getStatusDisplay(status);
  const formattedValue = formatValue(value, sensorType);

  /**
   * Handle card click events
   * Passes sensor information back to parent component
   */
  const handleClick = () => {
    if (onClick) {
      onClick({
        sensorType,
        title,
        value,
        unit,
        status
      });
    }
  };

  // Component JSX with dynamic classes and conditional rendering
  return (
    <div 
      className={`sensor-card ${status} ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      {/* Sensor icon display */}
      <div className="sensor-icon" aria-hidden="true">
        {icon}
      </div>
      
      {/* Sensor information */}
      <div className="sensor-info">
        <h3>{title}</h3>
        <div className="sensor-value">
          <span className="value-number">{formattedValue}</span>
          {unit && <span className="unit">{unit}</span>}
        </div>
        
        {/* Status indicator with dynamic styling */}
        <div className={`status-indicator ${statusDisplay.class}`}>
          <span className="status-icon" aria-hidden="true">{statusDisplay.icon}</span>
          <span className="status-text">{statusDisplay.text}</span>
        </div>
      </div>

      {/* Hover tooltip for additional information */}
      <div className="sensor-tooltip" aria-hidden="true">
        <div className="tooltip-content">
          <strong>{title}</strong>
          <div>Current: {formattedValue}{unit}</div>
          <div>Status: {statusDisplay.text}</div>
          <div>Click for details</div>
        </div>
      </div>
    </div>
  );
};

/**
 * LEARNING NOTES - Component Best Practices Demonstrated:
 * 
 * 1. PROPS VALIDATION: In a real app, you'd use PropTypes or TypeScript
 * 2. ACCESSIBILITY: Added ARIA attributes, keyboard navigation
 * 3. REUSABILITY: Component works for any sensor type with proper props
 * 4. SEPARATION OF CONCERNS: Logic separated from presentation
 * 5. ERROR HANDLING: Graceful handling of missing/invalid data
 * 6. PERFORMANCE: Pure functional component re-renders only when props change
 */

// Make component available globally
window.SensorCard = SensorCard;