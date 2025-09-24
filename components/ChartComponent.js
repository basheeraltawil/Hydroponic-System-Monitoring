/**
 * ChartComponent - Interactive data visualization for sensor readings
 * 
 * LEARNING NOTES FOR BEGINNERS:
 * - This component uses Chart.js library for creating interactive charts
 * - useRef hook creates persistent references that don't trigger re-renders
 * - useEffect hook handles side effects (DOM manipulation, API calls)
 * - Cleanup functions in useEffect prevent memory leaks
 */

const ChartComponent = ({ 
  data, 
  sensorType, 
  title, 
  selectedPeriod, 
  height = 400 
}) => {
  // Refs to access DOM elements and Chart.js instance
  const chartRef = React.useRef(null);           // Canvas element reference
  const chartInstance = React.useRef(null);     // Chart.js instance reference

  /**
   * Get appropriate color scheme based on sensor type
   * Different sensors get different colors for better visual distinction
   */
  const getSensorColors = (sensorType) => {
    const colorSchemes = {
      temperature: { border: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)' },
      humidity: { border: '#3498db', background: 'rgba(52, 152, 219, 0.1)' },
      electricConductivity: { border: '#f39c12', background: 'rgba(243, 156, 18, 0.1)' },
      waterLevel: { border: '#1abc9c', background: 'rgba(26, 188, 156, 0.1)' },
      pH: { border: '#9b59b6', background: 'rgba(155, 89, 182, 0.1)' },
      lightIntensity: { border: '#f1c40f', background: 'rgba(241, 196, 15, 0.1)' },
      nutrientLevel: { border: '#27ae60', background: 'rgba(39, 174, 96, 0.1)' },
      airTemperature: { border: '#e67e22', background: 'rgba(230, 126, 34, 0.1)' }
    };
    
    // Return default colors if sensor type not found
    return colorSchemes[sensorType] || { border: '#95a5a6', background: 'rgba(149, 165, 166, 0.1)' };
  };

  /**
   * Format chart data for Chart.js consumption
   * Transforms raw sensor data into Chart.js compatible format
   */
  const formatChartData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return { labels: [], values: [] };

    return {
      labels: rawData.map(point => {
        if (!point.timestamp) return 'Invalid';
        const date = new Date(point.timestamp);
        // Format timestamp based on selected period
        if (selectedPeriod === '1h') {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (selectedPeriod === '6h') {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
                 date.toLocaleTimeString([], { hour: '2-digit' });
        }
      }),
      values: rawData.map(point => point.value || 0)
    };
  };

  /**
   * Get chart configuration options based on sensor type
   * Different sensors may need different Y-axis scales and formatting
   */
  const getChartOptions = (sensorType) => {
    const baseOptions = {
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
          displayColors: false,
          callbacks: {
            title: function(context) {
              return `Time: ${context[0].label}`;
            },
            label: function(context) {
              const unit = getSensorUnit(sensorType);
              return `${title}: ${context.parsed.y}${unit}`;
            }
          }
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
          },
          ticks: {
            callback: function(value) {
              const unit = getSensorUnit(sensorType);
              return `${value}${unit}`;
            }
          }
        }
      },
      elements: {
        point: {
          radius: 3,
          hoverRadius: 6
        },
        line: {
          tension: 0.4  // Smooth curve
        }
      }
    };

    // Customize Y-axis based on sensor type
    if (sensorType === 'pH') {
      baseOptions.scales.y.min = 4.0;
      baseOptions.scales.y.max = 8.0;
    } else if (sensorType === 'humidity' || sensorType === 'waterLevel' || 
               sensorType === 'lightIntensity' || sensorType === 'nutrientLevel') {
      baseOptions.scales.y.min = 0;
      baseOptions.scales.y.max = 100;
    }

    return baseOptions;
  };

  /**
   * Get appropriate unit for sensor type
   */
  const getSensorUnit = (sensorType) => {
    const units = {
      temperature: '°C',
      humidity: '%',
      electricConductivity: ' μS/cm',
      waterLevel: '%',
      pH: ' pH',
      lightIntensity: '%',
      nutrientLevel: '%',
      airTemperature: '°C'
    };
    return units[sensorType] || '';
  };

  /**
   * Create or update the chart
   * This effect runs when dependencies change
   */
  React.useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext('2d');
    const colors = getSensorColors(sensorType);
    const formattedData = formatChartData(data);
    
    // Destroy existing chart to prevent memory leaks
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formattedData.labels,
        datasets: [{
          label: title || `Sensor Data`,
          data: formattedData.values,
          borderColor: colors.border,
          backgroundColor: colors.background,
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: getChartOptions(sensorType)
    });

    // Cleanup function - destroys chart when component unmounts or dependencies change
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, sensorType, title, selectedPeriod]); // Dependencies array

  /**
   * Handle empty data state
   */
  if (!data || data.length === 0) {
    return (
      <div className="chart-container" style={{ height }}>
        <div className="chart-empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Data Available</h3>
          <p>Sensor data will appear here once readings are available.</p>
        </div>
      </div>
    );
  }

  // Render the chart canvas
  return (
    <div className="chart-container" style={{ height }}>
      <canvas 
        ref={chartRef}
        role="img"
        aria-label={`${title} sensor data chart showing readings over ${selectedPeriod}`}
      />
    </div>
  );
};

/**
 * LEARNING NOTES - Advanced React Concepts Demonstrated:
 * 
 * 1. REFS: useRef for DOM access and persistent object references
 * 2. EFFECTS: useEffect for side effects and cleanup
 * 3. DEPENDENCIES: Effect dependency arrays control when effects run
 * 4. MEMORY MANAGEMENT: Proper cleanup prevents memory leaks
 * 5. THIRD-PARTY INTEGRATION: How to integrate external libraries
 * 6. CONDITIONAL RENDERING: Different UI for different states
 * 7. ACCESSIBILITY: ARIA labels for screen readers
 */

// Make component available globally
window.ChartComponent = ChartComponent;