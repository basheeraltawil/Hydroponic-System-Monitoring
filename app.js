// Hydroponic System Dashboard React Component with Enterprise Features
function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [currentView, setCurrentView] = React.useState('dashboard');

  // Dashboard state
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
  const [devices, setDevices] = React.useState([]);
  const [profiles, setProfiles] = React.useState([]);
  const [logs, setLogs] = React.useState([]);
  const [selectedDevice, setSelectedDevice] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState('');

  // Initialize data from localStorage
  React.useEffect(() => {
    const savedUser = localStorage.getItem('hydroponicUser');
    const savedDevices = localStorage.getItem('hydroponicDevices');
    const savedProfiles = localStorage.getItem('hydroponicProfiles');
    const savedLogs = localStorage.getItem('hydroponicLogs');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    if (savedDevices) {
      setDevices(JSON.parse(savedDevices));
    } else {
      // Initialize with demo devices
      const demoDevices = [
        {
          id: 'RPI001',
          serialNumber: 'HY-RPI-001',
          name: 'Greenhouse Alpha',
          status: 'online',
          location: 'Sector A',
          firmwareVersion: '1.2.3',
          lastSeen: new Date().toISOString(),
          profile: 'lettuce-optimal'
        },
        {
          id: 'RPI002',
          serialNumber: 'HY-RPI-002',
          name: 'Greenhouse Beta',
          status: 'offline',
          location: 'Sector B',
          firmwareVersion: '1.2.1',
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          profile: 'tomato-growth'
        }
      ];
      setDevices(demoDevices);
      localStorage.setItem('hydroponicDevices', JSON.stringify(demoDevices));
    }

    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    } else {
      // Initialize with demo profiles
      const demoProfiles = [
        {
          id: 'lettuce-optimal',
          name: 'Lettuce Optimal',
          description: 'Optimized settings for lettuce cultivation',
          parameters: {
            temperature: [20, 24],
            humidity: [65, 70],
            pH: [6.0, 6.5],
            lightIntensity: [70, 80]
          },
          createdBy: 'System',
          createdAt: new Date().toISOString()
        },
        {
          id: 'tomato-growth',
          name: 'Tomato Growth',
          description: 'Growth phase settings for tomatoes',
          parameters: {
            temperature: [22, 26],
            humidity: [60, 65],
            pH: [6.2, 6.8],
            lightIntensity: [80, 90]
          },
          createdBy: 'System',
          createdAt: new Date().toISOString()
        }
      ];
      setProfiles(demoProfiles);
      localStorage.setItem('hydroponicProfiles', JSON.stringify(demoProfiles));
    }

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      // Initialize with demo logs
      const demoLogs = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          device: 'HY-RPI-001',
          type: 'info',
          message: 'Device connected successfully'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          device: 'HY-RPI-001',
          type: 'warning',
          message: 'pH level approaching upper threshold'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          device: 'HY-RPI-002',
          type: 'error',
          message: 'Device disconnected - network timeout'
        }
      ];
      setLogs(demoLogs);
      localStorage.setItem('hydroponicLogs', JSON.stringify(demoLogs));
    }
  }, []);

  // Simulate real-time sensor data updates
  React.useEffect(() => {
    if (!isAuthenticated) return;

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

      // Simulate occasional log entries
      if (Math.random() < 0.1) {
        const newLog = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          device: devices[Math.floor(Math.random() * devices.length)]?.serialNumber || 'Unknown',
          type: Math.random() < 0.7 ? 'info' : Math.random() < 0.8 ? 'warning' : 'error',
          message: [
            'Sensor reading updated',
            'Profile applied successfully',
            'Warning: Temperature fluctuation detected',
            'Error: Communication timeout',
            'Device status check completed'
          ][Math.floor(Math.random() * 5)]
        };
        
        setLogs(prevLogs => {
          const updatedLogs = [newLog, ...prevLogs.slice(0, 99)]; // Keep last 100 logs
          localStorage.setItem('hydroponicLogs', JSON.stringify(updatedLogs));
          return updatedLogs;
        });
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, devices]);

  // Authentication functions
  const login = (email, password) => {
    // Mock authentication - in real implementation, this would call an API
    if (email && password) {
      const userData = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'operator',
        lastLogin: new Date().toISOString()
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('hydroponicUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hydroponicUser');
    setCurrentView('dashboard');
  };

  const addDevice = (deviceData) => {
    const newDevice = {
      ...deviceData,
      id: Date.now().toString(),
      status: 'offline',
      lastSeen: new Date().toISOString(),
      firmwareVersion: '1.2.3'
    };
    
    const updatedDevices = [...devices, newDevice];
    setDevices(updatedDevices);
    localStorage.setItem('hydroponicDevices', JSON.stringify(updatedDevices));
  };

  const addProfile = (profileData) => {
    const newProfile = {
      ...profileData,
      id: Date.now().toString(),
      createdBy: user?.name || 'Unknown',
      createdAt: new Date().toISOString()
    };
    
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('hydroponicProfiles', JSON.stringify(updatedProfiles));
  };

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

  // Components
  const LoginForm = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (login(email, password)) {
        setError('');
      } else {
        setError('Invalid credentials. Try any email and password.');
      }
    };

    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>🌱 Hydroponic System</h2>
            <p>Enterprise Dashboard Login</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hydroponic.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any password"
                required
              />
            </div>
            <button type="submit" className="btn" style={{width: '100%'}}>
              Login
            </button>
          </form>
          <div style={{marginTop: '1rem', fontSize: '0.9rem', color: '#666', textAlign: 'center'}}>
            Demo: Use any email and password to login
          </div>
        </div>
      </div>
    );
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

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌱 Hydroponic System Dashboard</h1>
        <div className="navigation">
          <a 
            href="#" 
            className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentView === 'devices' ? 'active' : ''}`}
            onClick={() => setCurrentView('devices')}
          >
            Devices
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentView === 'profiles' ? 'active' : ''}`}
            onClick={() => setCurrentView('profiles')}
          >
            Profiles
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentView === 'logs' ? 'active' : ''}`}
            onClick={() => setCurrentView('logs')}
          >
            Monitoring
          </a>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <span className="last-update">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <button className="btn btn-small" onClick={logout}>Logout</button>
        </div>
      </header>
      
      <main className="dashboard-main">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'devices' && <DevicesView />}
        {currentView === 'profiles' && <ProfilesView />}
        {currentView === 'logs' && <MonitoringView />}
      </main>
      
      <footer className="dashboard-footer">
        <p>Raspberry Pi Hydroponic Enterprise System | User: {user?.email} | Role: {user?.role}</p>
      </footer>

      {showModal && <Modal />}
    </div>
  );

  function DashboardView() {
    return (
      <>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{devices.filter(d => d.status === 'online').length}</div>
            <div className="stat-label">Devices Online</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{profiles.length}</div>
            <div className="stat-label">Active Profiles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{logs.filter(l => l.type === 'error').length}</div>
            <div className="stat-label">Active Alerts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">98.5%</div>
            <div className="stat-label">System Uptime</div>
          </div>
        </div>

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
      </>
    );
  }

  function DevicesView() {
    return (
      <>
        <div style={{marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>Device Management</h2>
          <button 
            className="btn" 
            onClick={() => {
              setModalContent('addDevice');
              setShowModal(true);
            }}
          >
            + Add Device
          </button>
        </div>

        <div className="device-grid">
          {devices.map(device => (
            <div key={device.id} className="device-card">
              <div className="device-header">
                <h3>{device.name}</h3>
                <span className={`device-status ${device.status}`}>
                  {device.status}
                </span>
              </div>
              <p><strong>Serial:</strong> {device.serialNumber}</p>
              <p><strong>Location:</strong> {device.location}</p>
              <p><strong>Firmware:</strong> {device.firmwareVersion}</p>
              <p><strong>Profile:</strong> {device.profile || 'None'}</p>
              <p><strong>Last Seen:</strong> {new Date(device.lastSeen).toLocaleString()}</p>
              <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
                <button className="btn btn-small btn-secondary">Configure</button>
                <button className="btn btn-small">Update Firmware</button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function ProfilesView() {
    return (
      <>
        <div style={{marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>Parameter Profiles</h2>
          <button 
            className="btn" 
            onClick={() => {
              setModalContent('addProfile');
              setShowModal(true);
            }}
          >
            + Create Profile
          </button>
        </div>

        <div className="device-grid">
          {profiles.map(profile => (
            <div key={profile.id} className="profile-card">
              <h3>{profile.name}</h3>
              <p>{profile.description}</p>
              <div style={{marginTop: '1rem'}}>
                <p><strong>Temperature:</strong> {profile.parameters.temperature.join(' - ')}°C</p>
                <p><strong>Humidity:</strong> {profile.parameters.humidity.join(' - ')}%</p>
                <p><strong>pH:</strong> {profile.parameters.pH.join(' - ')}</p>
                <p><strong>Light:</strong> {profile.parameters.lightIntensity.join(' - ')}%</p>
              </div>
              <div style={{marginTop: '1rem', fontSize: '0.9rem', color: '#666'}}>
                Created by {profile.createdBy} on {new Date(profile.createdAt).toLocaleDateString()}
              </div>
              <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
                <button className="btn btn-small">Apply to Device</button>
                <button className="btn btn-small btn-secondary">Edit</button>
                <button className="btn btn-small btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function MonitoringView() {
    return (
      <>
        <div style={{marginBottom: '2rem'}}>
          <h2>System Monitoring & Logs</h2>
        </div>

        <div className="stats-grid" style={{marginBottom: '2rem'}}>
          <div className="stat-card">
            <div className="stat-value">{logs.filter(l => l.type === 'info').length}</div>
            <div className="stat-label">Info Messages</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{logs.filter(l => l.type === 'warning').length}</div>
            <div className="stat-label">Warnings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{logs.filter(l => l.type === 'error').length}</div>
            <div className="stat-label">Errors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{logs.length}</div>
            <div className="stat-label">Total Logs</div>
          </div>
        </div>

        <div>
          <h3>Recent Activity</h3>
          {logs.slice(0, 20).map(log => (
            <div key={log.id} className="log-entry">
              <div className="log-timestamp">
                {new Date(log.timestamp).toLocaleString()} - {log.device}
              </div>
              <div className="log-message">
                <span style={{
                  color: log.type === 'error' ? '#e74c3c' : 
                        log.type === 'warning' ? '#f39c12' : '#27ae60'
                }}>
                  [{log.type.toUpperCase()}]
                </span> {log.message}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function Modal() {
    const closeModal = () => {
      setShowModal(false);
      setModalContent('');
    };

    return (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              {modalContent === 'addDevice' && 'Add New Device'}
              {modalContent === 'addProfile' && 'Create New Profile'}
            </h3>
            <button className="close-btn" onClick={closeModal}>×</button>
          </div>
          
          {modalContent === 'addDevice' && <AddDeviceForm onClose={closeModal} />}
          {modalContent === 'addProfile' && <AddProfileForm onClose={closeModal} />}
        </div>
      </div>
    );
  }

  function AddDeviceForm({ onClose }) {
    const [formData, setFormData] = React.useState({
      serialNumber: '',
      name: '',
      location: '',
      profile: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addDevice(formData);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Serial Number:</label>
          <input
            type="text"
            value={formData.serialNumber}
            onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
            placeholder="HY-RPI-003"
            required
          />
        </div>
        <div className="form-group">
          <label>Device Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Greenhouse Gamma"
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Sector C"
            required
          />
        </div>
        <div className="form-group">
          <label>Initial Profile:</label>
          <select
            value={formData.profile}
            onChange={(e) => setFormData({...formData, profile: e.target.value})}
          >
            <option value="">Select Profile</option>
            {profiles.map(profile => (
              <option key={profile.id} value={profile.id}>{profile.name}</option>
            ))}
          </select>
        </div>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Add Device</button>
        </div>
      </form>
    );
  }

  function AddProfileForm({ onClose }) {
    const [formData, setFormData] = React.useState({
      name: '',
      description: '',
      parameters: {
        temperature: [20, 26],
        humidity: [60, 70],
        pH: [6.0, 6.8],
        lightIntensity: [60, 85]
      }
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addProfile(formData);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profile Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Custom Profile"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Profile description"
            required
          />
        </div>
        <h4>Parameter Ranges:</h4>
        <div className="form-group">
          <label>Temperature (°C):</label>
          <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
            <input
              type="number"
              value={formData.parameters.temperature[0]}
              onChange={(e) => setFormData({
                ...formData,
                parameters: {
                  ...formData.parameters,
                  temperature: [Number(e.target.value), formData.parameters.temperature[1]]
                }
              })}
              style={{width: '80px'}}
            />
            <span>to</span>
            <input
              type="number"
              value={formData.parameters.temperature[1]}
              onChange={(e) => setFormData({
                ...formData,
                parameters: {
                  ...formData.parameters,
                  temperature: [formData.parameters.temperature[0], Number(e.target.value)]
                }
              })}
              style={{width: '80px'}}
            />
          </div>
        </div>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Create Profile</button>
        </div>
      </form>
    );
  }
}

// Render to the page
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
