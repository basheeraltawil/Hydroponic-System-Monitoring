// Hydroponic System Dashboard React Component

// Session persistence utility functions
const SessionStorage = {
  save: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  },
  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
      return defaultValue;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Could not remove from localStorage:', e);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  }
};

function App() {
  // Load initial state from localStorage
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => SessionStorage.load('isLoggedIn', false));
  const [username, setUsername] = React.useState(() => SessionStorage.load('username', ''));
  // Device-specific sensor data
  const [deviceSensorData, setDeviceSensorData] = React.useState({
    1: { // Greenhouse Alpha
      temperature: 22.5,
      humidity: 65,
      electricConductivity: 1200,
      waterLevel: 85,
      pH: 6.2,
      lightIntensity: 75,
      nutrientLevel: 90,
      airTemperature: 24.1
    },
    2: { // Greenhouse Beta
      temperature: 20.8,
      humidity: 58,
      electricConductivity: 1350,
      waterLevel: 72,
      pH: 6.5,
      lightIntensity: 68,
      nutrientLevel: 85,
      airTemperature: 22.9
    }
  });

  // Get current device sensor data
  const getCurrentSensorData = () => {
    return deviceSensorData[selectedDevice] || deviceSensorData[1];
  };

  const [lastUpdate, setLastUpdate] = React.useState(new Date());
  const [historicalData, setHistoricalData] = React.useState({});
  const [devices, setDevices] = React.useState([
    {
      id: 1,
      name: 'Greenhouse Alpha',
      type: 'Hydroponic Controller',
      location: 'Sector A',
      serial: 'HY-RPI-001',
      firmware: '1.2.3',
      profile: 'lettuce-optimal',
      status: 'online',
      lastSeen: new Date('2025-08-09T09:56:05'),
      createdAt: new Date('2025-08-01T10:00:00')
    },
    {
      id: 2,
      name: 'Greenhouse Beta',
      type: 'Hydroponic Controller',
      location: 'Sector B',
      serial: 'HY-RPI-002',
      firmware: '1.2.1',
      profile: 'tomato-growth',
      status: 'offline',
      lastSeen: new Date('2025-08-09T08:56:05'),
      createdAt: new Date('2025-08-01T11:00:00')
    }
  ]);
  const [profiles, setProfiles] = React.useState(() => SessionStorage.load('profiles', []));
  const [activeTab, setActiveTab] = React.useState(() => SessionStorage.load('activeTab', 'dashboard'));
  const [selectedSensor, setSelectedSensor] = React.useState(() => SessionStorage.load('selectedSensor', 'temperature'));
  const [selectedPeriod, setSelectedPeriod] = React.useState(() => SessionStorage.load('selectedPeriod', '1h'));
  const [selectedDevice, setSelectedDevice] = React.useState(() => SessionStorage.load('selectedDevice', 1)); // Default to first device
  
  // Form states - separate from sensor data to prevent clearing
  const [deviceForm, setDeviceForm] = React.useState({
    name: '',
    type: '',
    location: ''
  });
  
  const [profileForm, setProfileForm] = React.useState({
    name: '',
    description: '',
    settings: ''
  });

  // Persist login state to localStorage
  React.useEffect(() => {
    SessionStorage.save('isLoggedIn', isLoggedIn);
    SessionStorage.save('username', username);
  }, [isLoggedIn, username]);

  // Persist UI state to localStorage
  React.useEffect(() => {
    SessionStorage.save('activeTab', activeTab);
  }, [activeTab]);

  React.useEffect(() => {
    SessionStorage.save('selectedDevice', selectedDevice);
  }, [selectedDevice]);

  React.useEffect(() => {
    SessionStorage.save('selectedSensor', selectedSensor);
  }, [selectedSensor]);

  React.useEffect(() => {
    SessionStorage.save('selectedPeriod', selectedPeriod);
  }, [selectedPeriod]);

  React.useEffect(() => {
    SessionStorage.save('profiles', profiles);
  }, [profiles]);

  // Initialize historical data storage per device
  React.useEffect(() => {
    const initialData = {};
    devices.forEach(device => {
      initialData[device.id] = {};
      Object.keys(deviceSensorData[device.id] || {}).forEach(sensor => {
        initialData[device.id][sensor] = [];
      });
    });
    setHistoricalData(initialData);
  }, [devices]);

  // Store historical data when device sensor data updates
  React.useEffect(() => {
    const timestamp = new Date();
    setHistoricalData(prev => {
      const newData = { ...prev };
      
      Object.keys(deviceSensorData).forEach(deviceId => {
        if (!newData[deviceId]) newData[deviceId] = {};
        const currentData = deviceSensorData[deviceId];
        
        Object.keys(currentData).forEach(sensor => {
          if (!newData[deviceId][sensor]) newData[deviceId][sensor] = [];
          newData[deviceId][sensor].push({
            timestamp,
            value: currentData[sensor]
          });
          // Keep only last 24 hours of data
          const oneDayAgo = new Date(timestamp.getTime() - 24 * 60 * 60 * 1000);
          newData[deviceId][sensor] = newData[deviceId][sensor].filter(point => point.timestamp > oneDayAgo);
        });
      });
      
      return newData;
    });
  }, [deviceSensorData]);

  // Simulate real-time sensor data updates for each device (reduced frequency)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDeviceSensorData(prev => {
        const newData = { ...prev };
        
        Object.keys(newData).forEach(deviceId => {
          const isFirstDevice = deviceId == 1;
          const variationMultiplier = isFirstDevice ? 1 : 1.2; // Second device has more variation
          const data = newData[deviceId];
          
          newData[deviceId] = {
            temperature: Math.max(18, Math.min(28, data.temperature + (Math.random() - 0.5) * 0.5 * variationMultiplier)),
            humidity: Math.max(50, Math.min(80, data.humidity + (Math.random() - 0.5) * 2 * variationMultiplier)),
            electricConductivity: Math.max(800, Math.min(1600, data.electricConductivity + (Math.random() - 0.5) * 50 * variationMultiplier)),
            waterLevel: Math.max(20, Math.min(100, data.waterLevel + (Math.random() - 0.5) * 3 * variationMultiplier)),
            pH: Math.max(5.5, Math.min(7.5, data.pH + (Math.random() - 0.5) * 0.1 * variationMultiplier)),
            lightIntensity: Math.max(40, Math.min(100, data.lightIntensity + (Math.random() - 0.5) * 5 * variationMultiplier)),
            nutrientLevel: Math.max(50, Math.min(100, data.nutrientLevel + (Math.random() - 0.5) * 2 * variationMultiplier)),
            airTemperature: Math.max(20, Math.min(30, data.airTemperature + (Math.random() - 0.5) * 0.3 * variationMultiplier))
          };
        });
        
        return newData;
      });
      setLastUpdate(new Date());
    }, 10000); // Changed from 3000 to 10000 (10 seconds)

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

  // Handle device form submission
  const handleAddDevice = (e) => {
    e.preventDefault();
    if (deviceForm.name && deviceForm.type && deviceForm.location) {
      setDevices(prev => [...prev, {
        id: Date.now(),
        ...deviceForm,
        createdAt: new Date()
      }]);
      setDeviceForm({ name: '', type: '', location: '' });
    }
  };

  // Handle profile form submission
  const handleAddProfile = (e) => {
    e.preventDefault();
    if (profileForm.name && profileForm.description) {
      setProfiles(prev => [...prev, {
        id: Date.now(),
        ...profileForm,
        createdAt: new Date()
      }]);
      setProfileForm({ name: '', description: '', settings: '' });
    }
  };

  // CSV Export functionality
  const exportToCSV = () => {
    const csvData = [];
    const currentData = getCurrentSensorData();
    const headers = ['Timestamp', ...Object.keys(currentData)];
    csvData.push(headers.join(','));

    // Get the maximum length of historical data for current device
    const deviceHistoricalData = historicalData[selectedDevice] || {};
    const maxLength = Math.max(...Object.values(deviceHistoricalData).map(data => data?.length || 0));
    
    for (let i = 0; i < maxLength; i++) {
      const row = [];
      const timestamp = deviceHistoricalData.temperature?.[i]?.timestamp;
      row.push(timestamp ? timestamp.toISOString() : '');
      
      Object.keys(currentData).forEach(sensor => {
        const value = deviceHistoricalData[sensor]?.[i]?.value;
        row.push(value !== undefined ? value : '');
      });
      
      csvData.push(row.join(','));
    }

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydroponic-data-${getSelectedDevice()?.name}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get filtered historical data based on selected period and device
  const getFilteredData = (sensorType, period) => {
    const deviceHistoricalData = historicalData[selectedDevice] || {};
    const data = deviceHistoricalData[sensorType] || [];
    const now = new Date();
    let cutoff;
    
    switch (period) {
      case '1h':
        cutoff = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        cutoff = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '24h':
        cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        cutoff = new Date(now.getTime() - 60 * 60 * 1000);
    }
    
    return data.filter(point => point.timestamp > cutoff);
  };

  const SensorCard = ({ title, value, unit, icon, sensorType }) => {
    const status = getStatusColor(sensorType, value);
    const displayValue = typeof value === 'number' ? value.toFixed(1) : value;
    
    return (
      <div className={`sensor-card ${status}`} onClick={() => {
        setSelectedSensor(sensorType);
        setActiveTab('charts');
      }}>
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

  const ChartComponent = () => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const filteredData = getFilteredData(selectedSensor, selectedPeriod);
        const labels = filteredData.map(point => point.timestamp.toLocaleTimeString());
        const values = filteredData.map(point => point.value);

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: getSensorTitle(selectedSensor),
              data: values,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false
              }
            },
            plugins: {
              legend: {
                display: true
              }
            }
          }
        });
      }

      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [selectedSensor, selectedPeriod, selectedDevice, historicalData]);

    return <canvas ref={chartRef} style={{ maxHeight: '400px' }}></canvas>;
  };

  const getSensorTitle = (sensorType) => {
    const sensorTitles = {
      temperature: 'Water Temperature',
      humidity: 'Humidity',
      electricConductivity: 'Electric Conductivity',
      waterLevel: 'Water Level',
      pH: 'pH Level',
      lightIntensity: 'Light Intensity',
      nutrientLevel: 'Nutrient Level',
      airTemperature: 'Air Temperature'
    };
    return sensorTitles[sensorType] || sensorType;
  };

  // Get selected device info
  const getSelectedDevice = () => {
    return devices.find(device => device.id === selectedDevice) || devices[0];
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    const usernameInput = e.target.querySelector('input[type="text"]');
    setUsername(usernameInput.value || 'admin');
    setIsLoggedIn(true);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setActiveTab('dashboard');
    // Clear all session data from localStorage
    SessionStorage.clear();
  };

  // Login screen component
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-form">
          <h1>🌱 Hydroponic System Dashboard</h1>
          <h2>System Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username:</label>
              <input type="text" defaultValue="admin" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" defaultValue="admin" className="form-input" required />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="login-note">Default: admin / admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌱 Hydroponic System Dashboard</h1>
        <div className="header-controls">
          <nav className="tab-navigation">
            <button 
              className={activeTab === 'dashboard' ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={activeTab === 'charts' ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab('charts')}
            >
              📈 Charts
            </button>
            <button 
              className={activeTab === 'devices' ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab('devices')}
            >
              🔧 Devices
            </button>
            <button 
              className={activeTab === 'profiles' ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab('profiles')}
            >
              👤 Profiles
            </button>
          </nav>
          <div className="header-right-info">
            <div className="username-display">
              {username}
            </div>
            <button className="logout-button" onClick={handleLogout}>
              🚪 Logout
            </button>
            <div className="last-update">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="dashboard-actions">
              <div className="device-selector">
                <label>Device:</label>
                <select 
                  value={selectedDevice} 
                  onChange={(e) => setSelectedDevice(parseInt(e.target.value))}
                  className="control-select"
                >
                  {devices.map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name} ({device.status})
                    </option>
                  ))}
                </select>
              </div>
              <button className="action-button export-btn" onClick={exportToCSV}>
                💾 Export CSV
              </button>
            </div>
            <div className="selected-device-info">
              <h3>📍 {getSelectedDevice()?.name || 'No Device Selected'}</h3>
              <p>Location: {getSelectedDevice()?.location} | Status: <span className={`status-text ${getSelectedDevice()?.status}`}>{getSelectedDevice()?.status}</span></p>
            </div>
            <div className="sensors-grid">
              <SensorCard 
                title="Water Temperature" 
                value={getCurrentSensorData().temperature} 
                unit="°C" 
                icon="🌡️" 
                sensorType="temperature"
              />
              <SensorCard 
                title="Humidity" 
                value={getCurrentSensorData().humidity} 
                unit="%" 
                icon="💧" 
                sensorType="humidity"
              />
              <SensorCard 
                title="Electric Conductivity" 
                value={getCurrentSensorData().electricConductivity} 
                unit="μS/cm" 
                icon="⚡" 
                sensorType="electricConductivity"
              />
              <SensorCard 
                title="Water Level" 
                value={getCurrentSensorData().waterLevel} 
                unit="%" 
                icon="🌊" 
                sensorType="waterLevel"
              />
              <SensorCard 
                title="pH Level" 
                value={getCurrentSensorData().pH} 
                unit="" 
                icon="🧪" 
                sensorType="pH"
              />
              <SensorCard 
                title="Light Intensity" 
                value={getCurrentSensorData().lightIntensity} 
                unit="%" 
                icon="☀️" 
                sensorType="lightIntensity"
              />
              <SensorCard 
                title="Nutrient Level" 
                value={getCurrentSensorData().nutrientLevel} 
                unit="%" 
                icon="🥬" 
                sensorType="nutrientLevel"
              />
              <SensorCard 
                title="Air Temperature" 
                value={getCurrentSensorData().airTemperature} 
                unit="°C" 
                icon="🌡️" 
                sensorType="airTemperature"
              />
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="charts-content">
            <div className="chart-controls">
              <div className="control-group">
                <label>Device:</label>
                <select 
                  value={selectedDevice} 
                  onChange={(e) => setSelectedDevice(parseInt(e.target.value))}
                  className="control-select"
                >
                  {devices.map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name} ({device.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>Sensor:</label>
                <select 
                  value={selectedSensor} 
                  onChange={(e) => setSelectedSensor(e.target.value)}
                  className="control-select"
                >
                  <option value="temperature">Water Temperature</option>
                  <option value="humidity">Humidity</option>
                  <option value="electricConductivity">Electric Conductivity</option>
                  <option value="waterLevel">Water Level</option>
                  <option value="pH">pH Level</option>
                  <option value="lightIntensity">Light Intensity</option>
                  <option value="nutrientLevel">Nutrient Level</option>
                  <option value="airTemperature">Air Temperature</option>
                </select>
              </div>
              <div className="control-group">
                <label>Period:</label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="control-select"
                >
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                </select>
              </div>
              <button className="action-button export-btn" onClick={exportToCSV}>
                💾 Export CSV
              </button>
            </div>
            <div className="chart-container">
              <h3>{getSelectedDevice()?.name} - {getSensorTitle(selectedSensor)} - {selectedPeriod}</h3>
              <ChartComponent />
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="management-content">
            <div className="form-section">
              <h3>Device Management</h3>
              <h4>+ Add Device</h4>
              <form onSubmit={handleAddDevice} className="management-form">
                <input
                  type="text"
                  placeholder="Device Name"
                  value={deviceForm.name}
                  onChange={(e) => setDeviceForm(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Device Type"
                  value={deviceForm.type}
                  onChange={(e) => setDeviceForm(prev => ({ ...prev, type: e.target.value }))}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={deviceForm.location}
                  onChange={(e) => setDeviceForm(prev => ({ ...prev, location: e.target.value }))}
                  className="form-input"
                />
                <button type="submit" className="action-button">Add Device</button>
              </form>
            </div>
            <div className="list-section">
              <div className="devices-grid">
                {devices.map(device => (
                  <div key={device.id} className="device-card">
                    <div className="device-header">
                      <h4>{device.name}</h4>
                      <span className={`status-badge ${device.status}`}>
                        {device.status}
                      </span>
                    </div>
                    <div className="device-info">
                      <p><strong>Serial:</strong> {device.serial}</p>
                      <p><strong>Location:</strong> {device.location}</p>
                      <p><strong>Firmware:</strong> {device.firmware}</p>
                      <p><strong>Profile:</strong> {device.profile}</p>
                      <p><strong>Last Seen:</strong> {device.lastSeen.toLocaleDateString()}, {device.lastSeen.toLocaleTimeString()}</p>
                    </div>
                    <div className="device-actions">
                      <button className="action-button small">Configure</button>
                      <button className="action-button small">Update Firmware</button>
                    </div>
                  </div>
                ))}
                {devices.length === 0 && (
                  <p className="empty-state">No devices added yet. Add your first device above!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="management-content">
            <div className="form-section">
              <h3>Create New Profile</h3>
              <form onSubmit={handleAddProfile} className="management-form">
                <input
                  type="text"
                  placeholder="Profile Name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
                <textarea
                  placeholder="Profile Description"
                  value={profileForm.description}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                  className="form-textarea"
                  rows="3"
                />
                <textarea
                  placeholder="Settings (JSON format)"
                  value={profileForm.settings}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, settings: e.target.value }))}
                  className="form-textarea"
                  rows="4"
                />
                <button type="submit" className="action-button">Create Profile</button>
              </form>
            </div>
            <div className="list-section">
              <h3>Profiles ({profiles.length})</h3>
              <div className="items-grid">
                {profiles.map(profile => (
                  <div key={profile.id} className="item-card">
                    <h4>{profile.name}</h4>
                    <p>{profile.description}</p>
                    {profile.settings && (
                      <pre className="settings-preview">{profile.settings}</pre>
                    )}
                    <p><small>Created: {profile.createdAt.toLocaleDateString()}</small></p>
                  </div>
                ))}
                {profiles.length === 0 && (
                  <p className="empty-state">No profiles created yet. Create your first profile above!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="dashboard-footer">
        <p>Raspberry Pi Hydroponic Monitoring System - Enhanced with Charts & Management</p>
      </footer>
    </div>
  );
}

// Render to the page
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
