// Hydroponic System Dashboard React Component
function App() {
  const [sensorData, setSensorData] = React.useState({
    temperature: 22.5,
    humidity: 65,
    electricConductivity: 1200,
    waterLevel: 85,
    pH: 6.2,
    lightIntensity: 75,
    nutrientLevel: 90,
    airTemperature: 24.1
  });

  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  // Simulate real-time sensor data updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      // TODO: Replace this simulation with real sensor data from Raspberry Pi
      // Example: fetch('/api/sensors').then(response => response.json()).then(setSensorData);
      
      setSensorData(prev => ({
        temperature: Math.max(18, Math.min(28, prev.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(50, Math.min(80, prev.humidity + (Math.random() - 0.5) * 2)),
        electricConductivity: Math.max(800, Math.min(1600, prev.electricConductivity + (Math.random() - 0.5) * 50)),
        waterLevel: Math.max(20, Math.min(100, prev.waterLevel + (Math.random() - 0.5) * 3)),
        pH: Math.max(5.5, Math.min(7.5, prev.pH + (Math.random() - 0.5) * 0.1)),
        lightIntensity: Math.max(40, Math.min(100, prev.lightIntensity + (Math.random() - 0.5) * 5)),
        nutrientLevel: Math.max(50, Math.min(100, prev.nutrientLevel + (Math.random() - 0.5) * 2)),
        airTemperature: Math.max(20, Math.min(30, prev.airTemperature + (Math.random() - 0.5) * 0.3))
      }));
      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to get status color based on sensor value and optimal ranges
  const getStatusColor = (sensorType, value) => {
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
    if (value >= range.optimal[0] && value <= range.optimal[1]) return 'optimal';
    if (value >= range.warning[0] && value <= range.warning[1]) return 'warning';
    return 'critical';
  };

  const SensorCard = ({ title, value, unit, icon, sensorType }) => {
    const status = getStatusColor(sensorType, value);
    const displayValue = typeof value === 'number' ? value.toFixed(1) : value;
    
    return (
      <div className={`sensor-card ${status}`}>
        <div className="sensor-icon">{icon}</div>
        <div className="sensor-info">
          <h3>{title}</h3>
          <div className="sensor-value">
            {displayValue}<span className="unit">{unit}</span>
          </div>
          <div className={`status-indicator ${status}`}>
            {status === 'optimal' ? '✓ Good' : status === 'warning' ? '⚠ Warning' : '⚡ Critical'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌱 Hydroponic System Dashboard</h1>
        <div className="last-update">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="sensors-grid">
          <SensorCard 
            title="Water Temperature" 
            value={sensorData.temperature} 
            unit="°C" 
            icon="🌡️" 
            sensorType="temperature"
          />
          <SensorCard 
            title="Humidity" 
            value={sensorData.humidity} 
            unit="%" 
            icon="💧" 
            sensorType="humidity"
          />
          <SensorCard 
            title="Electric Conductivity" 
            value={sensorData.electricConductivity} 
            unit="μS/cm" 
            icon="⚡" 
            sensorType="electricConductivity"
          />
          <SensorCard 
            title="Water Level" 
            value={sensorData.waterLevel} 
            unit="%" 
            icon="🌊" 
            sensorType="waterLevel"
          />
          <SensorCard 
            title="pH Level" 
            value={sensorData.pH} 
            unit="" 
            icon="🧪" 
            sensorType="pH"
          />
          <SensorCard 
            title="Light Intensity" 
            value={sensorData.lightIntensity} 
            unit="%" 
            icon="☀️" 
            sensorType="lightIntensity"
          />
          <SensorCard 
            title="Nutrient Level" 
            value={sensorData.nutrientLevel} 
            unit="%" 
            icon="🥬" 
            sensorType="nutrientLevel"
          />
          <SensorCard 
            title="Air Temperature" 
            value={sensorData.airTemperature} 
            unit="°C" 
            icon="🌡️" 
            sensorType="airTemperature"
          />
        </div>
      </main>
      
      <footer className="dashboard-footer">
        <p>Raspberry Pi Hydroponic Monitoring System</p>
      </footer>
    </div>
  );
}

// Render to the page
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
