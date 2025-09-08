# Backend Integration Guide

This document outlines how to integrate the current frontend with a FastAPI backend and implement the full enterprise architecture.

## Backend API Endpoints

### Authentication Endpoints

```python
# /api/auth/login
POST /api/auth/login
{
    "email": "user@example.com",
    "password": "password"
}
Response: {
    "access_token": "jwt_token_here",
    "token_type": "bearer",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "User Name",
        "role": "admin"
    }
}

# /api/auth/register
POST /api/auth/register
{
    "email": "user@example.com",
    "password": "password",
    "name": "User Name",
    "role": "operator"
}

# /api/auth/logout
POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

### Device Management Endpoints

```python
# Get all devices
GET /api/devices
Headers: Authorization: Bearer <token>
Response: [
    {
        "id": "device_1",
        "serial_number": "HY-RPI-001",
        "name": "Greenhouse Alpha",
        "status": "online",
        "location": "Sector A",
        "firmware_version": "1.2.3",
        "last_seen": "2024-01-15T14:30:22Z",
        "profile_id": "profile_1"
    }
]

# Register new device
POST /api/devices
{
    "serial_number": "HY-RPI-003",
    "name": "Greenhouse Gamma",
    "location": "Sector C"
}

# Update device
PUT /api/devices/{device_id}
{
    "name": "Updated Name",
    "location": "New Location",
    "profile_id": "profile_2"
}

# Get device status
GET /api/devices/{device_id}/status
Response: {
    "device_id": "device_1",
    "sensors": {
        "temperature": 22.5,
        "humidity": 65.0,
        "pH": 6.2,
        ...
    },
    "timestamp": "2024-01-15T14:30:22Z"
}
```

### Profile Management Endpoints

```python
# Get all profiles
GET /api/profiles
Response: [
    {
        "id": "profile_1",
        "name": "Lettuce Optimal",
        "description": "Optimized settings for lettuce cultivation",
        "parameters": {
            "temperature": {"min": 20, "max": 24},
            "humidity": {"min": 65, "max": 70},
            "pH": {"min": 6.0, "max": 6.5},
            "light_intensity": {"min": 70, "max": 80}
        },
        "created_by": "user_1",
        "created_at": "2024-01-15T14:30:22Z"
    }
]

# Create profile
POST /api/profiles
{
    "name": "Custom Profile",
    "description": "Custom hydroponic settings",
    "parameters": {
        "temperature": {"min": 22, "max": 26},
        "humidity": {"min": 60, "max": 70},
        "pH": {"min": 6.0, "max": 6.8},
        "light_intensity": {"min": 75, "max": 85}
    }
}

# Apply profile to device
POST /api/devices/{device_id}/apply-profile
{
    "profile_id": "profile_1"
}
```

### Sensor Data Endpoints

```python
# Get real-time sensor data
GET /api/devices/{device_id}/sensors
Response: {
    "device_id": "device_1",
    "sensors": {
        "temperature": 22.5,
        "humidity": 65.0,
        "electric_conductivity": 1200,
        "water_level": 85.0,
        "pH": 6.2,
        "light_intensity": 75.0,
        "nutrient_level": 90.0,
        "air_temperature": 24.1
    },
    "timestamp": "2024-01-15T14:30:22Z"
}

# Get historical sensor data
GET /api/devices/{device_id}/sensors/history?start_date=2024-01-01&end_date=2024-01-15
Response: [
    {
        "timestamp": "2024-01-15T14:00:00Z",
        "sensors": {...}
    }
]
```

### Logging and Monitoring Endpoints

```python
# Get system logs
GET /api/logs?level=error&device_id=device_1&limit=50
Response: [
    {
        "id": 1,
        "timestamp": "2024-01-15T14:30:22Z",
        "device_id": "device_1",
        "level": "error",
        "message": "Device disconnected - network timeout",
        "metadata": {}
    }
]

# Get system statistics
GET /api/stats
Response: {
    "devices_online": 2,
    "devices_total": 3,
    "active_profiles": 4,
    "total_logs": 156,
    "error_count": 3,
    "warning_count": 8,
    "uptime_percentage": 98.5
}
```

### Firmware Management Endpoints

```python
# Get firmware versions
GET /api/firmware
Response: [
    {
        "version": "1.2.3",
        "release_date": "2024-01-15",
        "changelog": "Bug fixes and performance improvements",
        "download_url": "/api/firmware/1.2.3/download"
    }
]

# Deploy firmware update
POST /api/devices/{device_id}/firmware-update
{
    "firmware_version": "1.2.3",
    "schedule_at": "2024-01-16T02:00:00Z"  # Optional
}

# Get firmware update status
GET /api/devices/{device_id}/firmware-status
Response: {
    "current_version": "1.2.2",
    "target_version": "1.2.3",
    "status": "updating",  # pending, updating, success, failed
    "progress": 75,
    "estimated_completion": "2024-01-16T02:15:00Z"
}
```

## WebSocket Events

### Client to Server Events

```javascript
// Connect to WebSocket
const socket = io('ws://localhost:8001', {
    auth: {
        token: localStorage.getItem('access_token')
    }
});

// Subscribe to device updates
socket.emit('subscribe_device', {
    device_id: 'device_1'
});

// Send device command
socket.emit('device_command', {
    device_id: 'device_1',
    command: 'set_temperature',
    value: 23.0
});
```

### Server to Client Events

```javascript
// Real-time sensor data
socket.on('sensor_data', (data) => {
    console.log('Sensor update:', data);
    // {
    //     device_id: 'device_1',
    //     sensors: { temperature: 22.5, ... },
    //     timestamp: '2024-01-15T14:30:22Z'
    // }
});

// Device status changes
socket.on('device_status', (data) => {
    console.log('Device status:', data);
    // {
    //     device_id: 'device_1',
    //     status: 'online',
    //     timestamp: '2024-01-15T14:30:22Z'
    // }
});

// System alerts
socket.on('system_alert', (data) => {
    console.log('Alert:', data);
    // {
    //     level: 'warning',
    //     message: 'pH level approaching threshold',
    //     device_id: 'device_1',
    //     timestamp: '2024-01-15T14:30:22Z'
    // }
});
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'operator',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Devices Table

```sql
CREATE TABLE devices (
    id VARCHAR(255) PRIMARY KEY,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'offline',
    firmware_version VARCHAR(50),
    profile_id VARCHAR(255),
    owner_id INTEGER REFERENCES users(id),
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Profiles Table

```sql
CREATE TABLE profiles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parameters JSONB NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sensor Data Table

```sql
CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) REFERENCES devices(id),
    sensor_type VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_device_timestamp (device_id, timestamp),
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_timestamp (timestamp)
);
```

### Logs Table

```sql
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) REFERENCES devices(id),
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_device_level (device_id, level),
    INDEX idx_timestamp (timestamp),
    INDEX idx_level (level)
);
```

## Frontend Integration

### Update API Calls

Replace the current localStorage-based mock data with real API calls:

```javascript
// Replace in app.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Authentication
const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
    throw new Error('Login failed');
};

// Fetch devices
const fetchDevices = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/devices`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (response.ok) {
        return await response.json();
    }
    throw new Error('Failed to fetch devices');
};

// Fetch sensor data
const fetchSensorData = async (deviceId) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/sensors`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (response.ok) {
        return await response.json();
    }
    throw new Error('Failed to fetch sensor data');
};
```

### WebSocket Integration

```javascript
// Add to app.js
useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    const socket = io(process.env.REACT_APP_WS_URL, {
        auth: { token }
    });
    
    socket.on('sensor_data', (data) => {
        setSensorData(data.sensors);
        setLastUpdate(new Date(data.timestamp));
    });
    
    socket.on('device_status', (data) => {
        setDevices(prev => prev.map(device => 
            device.id === data.device_id 
                ? { ...device, status: data.status }
                : device
        ));
    });
    
    return () => socket.disconnect();
}, [isAuthenticated]);
```

## Raspberry Pi Integration

### Device Agent Script

```python
# raspberry_pi_agent.py
import asyncio
import websockets
import json
import time
import jwt
from sensors import read_all_sensors  # Your sensor reading implementation

class HydroponicAgent:
    def __init__(self, device_id, server_url, auth_token):
        self.device_id = device_id
        self.server_url = server_url
        self.auth_token = auth_token
        self.websocket = None
        
    async def connect(self):
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        self.websocket = await websockets.connect(
            self.server_url, 
            extra_headers=headers
        )
        
        # Register device
        await self.websocket.send(json.dumps({
            "type": "device_register",
            "device_id": self.device_id
        }))
        
    async def send_sensor_data(self):
        while True:
            try:
                sensor_data = read_all_sensors()
                message = {
                    "type": "sensor_data",
                    "device_id": self.device_id,
                    "data": sensor_data,
                    "timestamp": time.time()
                }
                
                await self.websocket.send(json.dumps(message))
                await asyncio.sleep(3)  # Send every 3 seconds
                
            except Exception as e:
                print(f"Error sending sensor data: {e}")
                await asyncio.sleep(5)
                
    async def listen_for_commands(self):
        async for message in self.websocket:
            try:
                data = json.loads(message)
                if data["type"] == "command":
                    await self.handle_command(data)
            except Exception as e:
                print(f"Error handling command: {e}")
                
    async def handle_command(self, command):
        # Implement device control logic
        if command["action"] == "set_temperature":
            # Control heating/cooling system
            pass
        elif command["action"] == "update_profile":
            # Apply new parameter profile
            pass

if __name__ == "__main__":
    agent = HydroponicAgent(
        device_id="HY-RPI-001",
        server_url="ws://your-server.com:8001",
        auth_token="your-device-token"
    )
    
    async def main():
        await agent.connect()
        await asyncio.gather(
            agent.send_sensor_data(),
            agent.listen_for_commands()
        )
    
    asyncio.run(main())
```

## Security Considerations

### JWT Token Management

```python
# backend/auth.py
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

### API Rate Limiting

```python
# backend/middleware.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

@app.middleware("http")
async def add_rate_limiting(request: Request, call_next):
    # Apply rate limiting based on user role
    response = await call_next(request)
    return response
```

This integration guide provides a complete blueprint for implementing the full enterprise architecture while maintaining compatibility with the current frontend implementation.