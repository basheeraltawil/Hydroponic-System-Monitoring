# Hydroponic System Dashboard

A real-time monitoring dashboard for hydroponic systems, designed to work both on web browsers and Raspberry Pi displays.

## Features

- **Real-time Sensor Monitoring**: 8 different sensors with live updates every 3 seconds
- **Smart Status Indicators**: Color-coded status (optimal/warning/critical) based on ideal hydroponic ranges
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Raspberry Pi Ready**: Optimized for small screens and embedded displays

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

## Tech Stack

- **Frontend**: React with Babel (CDN-based)
- **Styling**: CSS3 with Grid and Flexbox
- **Fallback**: Vanilla JavaScript for maximum compatibility
- **Responsive**: Mobile-first design approach

## Deployment

This dashboard is designed to work on GitHub Pages and can be easily deployed to any web server or directly opened on a Raspberry Pi browser.