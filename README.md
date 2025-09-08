# Hydroponic System Dashboard

An enterprise-grade, real-time monitoring and control dashboard for hydroponic systems, designed to work both on web browsers and Raspberry Pi displays with comprehensive device management and cloud integration capabilities.

## Scope of Work

The following features are included in this project:

- **User Authentication**: Secure login and signup system with JWT-based sessions
- **Device Management**: Registration of devices by unique serial numbers, accessible through a central dashboard
- **Real-Time Control**: Live synchronization between the device touchscreen and the cloud dashboard using WebSockets
- **OTA Firmware Updates**: Deployment of firmware remotely with rollback and version control
- **Parameter Profiles**: Creation, storage, and application of configuration profiles across devices
- **Monitoring & Logging**: Device status tracking, error reporting, and historical activity logs

## Features

- **Real-time Sensor Monitoring**: 8 different sensors with live updates every 3 seconds
- **Smart Status Indicators**: Color-coded status (optimal/warning/critical) based on ideal hydroponic ranges
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Raspberry Pi Ready**: Optimized for small screens and embedded displays
- **Enterprise Authentication**: Secure user management with role-based access control
- **Device Fleet Management**: Centralized control of multiple hydroponic systems
- **Configuration Profiles**: Reusable parameter sets for different growing scenarios
- **Historical Analytics**: Long-term data tracking and trend analysis
- **Remote Firmware Management**: Over-the-air updates with version control

## Sensors Monitored

| Sensor | Optimal Range | Warning Range | Units |
|--------|---------------|---------------|-------|
| Water Temperature | 20-26°C | 18-28°C | °C |
| Humidity | 60-70% | 50-80% | % |
| Electric Conductivity | 1000-1400 | 800-1600 | μS/cm |
| Water Level | 70-100% | 40-100% | % |
| pH Level | 6.0-6.8 | 5.5-7.5 | pH |
| Light Intensity | 60-85% | 40-100% | % |
| Nutrient Level | 80-100% | 60-100% | % |
| Air Temperature | 22-26°C | 20-30°C | °C |

## Raspberry Pi Integration

To connect real sensors to this dashboard:

1. Install the required sensor libraries on your Raspberry Pi
2. Create a simple Python script to read sensor values
3. Use a local HTTP server or WebSocket to send data to the dashboard
4. Replace the simulated data in `app.js` with real sensor readings

Example Python integration:
```python
# Example sensor reading script
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

class SensorHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/sensors':
            # Replace with actual sensor readings
            sensor_data = {
                "temperature": read_temperature_sensor(),
                "humidity": read_humidity_sensor(),
                "pH": read_ph_sensor(),
                # ... other sensors
            }
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(sensor_data).encode())

# Run on Raspberry Pi
httpd = HTTPServer(('localhost', 8080), SensorHandler)
httpd.serve_forever()
```

## Technical Architecture

The architecture consists of three major layers: Frontend, Backend, and Device Integration with Raspberry Pi.

**Assumption**: All input data will be provided to the system in a consistent and predefined format, and data will flow smoothly from the designated sources.

### Frontend
- **Technology**: React.js (CDN-based for GitHub Pages compatibility)
- **Purpose**: Provides a user-friendly interface for administrators and operators
- **Features**:
  - Secure login and authentication
  - Device list and management dashboard
  - Real-time control panel mirroring device touchscreen UI
  - Parameter profile creation and assignment
  - Access to logs and monitoring reports
  - Additional features will be added based on needs

### Backend (Planned Implementation)
- **Technology**: Python (FastAPI preferred for asynchronous performance)
- **Database**: PostgreSQL for relational data storage and scaling
- **Core Functions**:
  - User authentication and role-based access control (JWT)
  - Device registration and association with user accounts
  - API endpoints for device commands, status updates, and logs
  - OTA firmware update service
  - Profile management system (create, save, assign profiles)
  - Additional features will be added based on needs

### Real-Time Communication
- **Protocol**: WebSockets (via Socket.IO)
- **Function**: Enables instant, bi-directional communication between cloud and devices
- **Key Features**:
  - Live control panel synchronization
  - Reliable message delivery with automatic reconnection handling
  - Scalable for multiple concurrent devices

### Device Integration (Edge Layer)
- **Hardware**: Raspberry Pi (touchscreen-based)

### Hosting & Deployment
- **Environment**: Cloud-based infrastructure (AWS, Azure, Google Cloud Platform, or another provider chosen by the client)
- **Deployment Model**: Containerized (Docker) for portability and scalability
- **Security Measures**: SSL encryption, secure API gateways, and role-based permissions

## Current Tech Stack

- **Frontend**: React with Babel (CDN-based)
- **Styling**: CSS3 with Grid and Flexbox
- **Fallback**: Vanilla JavaScript for maximum compatibility
- **Responsive**: Mobile-first design approach
- **Storage**: LocalStorage for demo authentication and settings
- **Communication**: Prepared for WebSocket integration

## Deployment

### GitHub Pages (Current)
This dashboard is designed to work on GitHub Pages and can be easily deployed to any web server or directly opened on a Raspberry Pi browser.

### Cloud Deployment (Recommended)
For production environments with full backend integration:

1. **Containerization**: Use Docker for consistent deployment across environments
2. **Cloud Platform**: Deploy on AWS, Azure, or Google Cloud Platform
3. **Database**: PostgreSQL for production data storage
4. **API**: FastAPI backend for device communication and user management
5. **WebSockets**: Socket.IO for real-time communication
6. **Security**: SSL encryption, JWT authentication, role-based access control