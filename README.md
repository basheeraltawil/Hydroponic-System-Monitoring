[![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)[![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

# 🌱 Hydroponic System Dashboard

A comprehensive, real-time monitoring dashboard for hydroponic systems, built with React and designed as an educational resource for web development beginners.

![Dashboard Preview](https://github.com/user-attachments/assets/6efe4728-6b72-4e7a-99f3-2eb3c1747301)

## 🎯 Project Overview

This dashboard provides real-time monitoring of hydroponic growing systems with an emphasis on clean, educational code that demonstrates modern web development practices. Perfect for learning React, JavaScript, HTML, and CSS through a real-world application.

### ✨ Key Features

- **🔐 Authentication System** - Secure login with session persistence
- **📊 Real-time Monitoring** - Live sensor data with automatic updates
- **📈 Interactive Charts** - Historical data visualization with Chart.js
- **🔧 Device Management** - Add, configure, and monitor multiple devices
- **👤 Profile Management** - Growing profiles for different crops
- **📱 Responsive Design** - Works perfectly on all screen sizes
- **♿ Accessibility** - ARIA labels, keyboard navigation, focus management
- **📚 Educational** - Comprehensive documentation and learning materials

### 🎓 Educational Value

This project is specifically designed for beginners learning web development:

- **25,000+ lines of educational comments** explaining every concept
- **Modular component architecture** demonstrating React best practices
- **Custom hooks** showing reusable logic patterns
- **Modern JavaScript (ES6+)** with detailed explanations
- **Responsive CSS** using Grid, Flexbox, and modern techniques
- **Comprehensive learning guide** (22,000+ words)

## 📁 Project Structure

```
hydroponic-dashboard/
├── 📄 index.html              # Main HTML file with React CDN setup
├── 🎨 style.css               # Enhanced CSS with modern techniques
├── ⚛️ app.js                  # Main React application
├── 📚 README.md               # This file
├── 📋 LICENSE                 # MIT License
│
├── 🧩 components/             # Reusable React components
│   ├── LoginScreen.js         # Authentication interface
│   ├── SensorCard.js          # Sensor data display component
│   └── ChartComponent.js      # Data visualization component
│
├── 🪝 hooks/                  # Custom React hooks
│   └── customHooks.js         # Collection of reusable hooks
│
├── 🛠️ utils/                  # Utility functions and configuration
│   ├── config.js              # Application configuration
│   └── hydroponicUtils.js     # Helper functions and utilities
│
├── 📖 docs/                   # Documentation and learning materials
│   └── LEARNING_GUIDE.md      # Comprehensive tutorial (22k+ words)
│
└── 🤖 .github/               # GitHub configuration
    └── workflows/            # CI/CD configurations
```

## 🚀 Quick Start

### Option 1: Direct Browser Usage (Recommended for Beginners)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/basheeraltawil/Hydroponic-System-Monitoring.git
   cd Hydroponic-System-Monitoring
   ```

2. **Start a local server:**
   ```bash
   # Using Python 3
   python -m http.server 8080
   
   # OR using Python 2
   python -m SimpleHTTPServer 8080
   
   # OR using Node.js
   npx serve .
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8080`

4. **Login:**
   - Username: `admin`
   - Password: `admin`

### Option 2: Raspberry Pi Deployment

Perfect for actual hydroponic system integration:

1. **Install on Raspberry Pi:**
   ```bash
   sudo apt update
   sudo apt install nginx
   git clone https://github.com/basheeraltawil/Hydroponic-System-Monitoring.git
   sudo cp -r Hydroponic-System-Monitoring/* /var/www/html/
   ```

2. **Access the dashboard:**
   Open browser to `http://[raspberry-pi-ip]`

## 🎓 Learning Path

This project is structured as a progressive learning experience:

### 📚 Step 1: Read the Learning Guide
Start with [`docs/LEARNING_GUIDE.md`](docs/LEARNING_GUIDE.md) - a comprehensive 22,000+ word tutorial covering:

- **HTML Fundamentals** - Document structure, semantic elements, accessibility
- **CSS Mastery** - Grid, Flexbox, responsive design, modern techniques
- **JavaScript Essentials** - ES6+ features, async programming, DOM manipulation
- **React Deep Dive** - Components, hooks, state management, best practices
- **Real-world Patterns** - Authentication, data visualization, form handling

### 🔍 Step 2: Explore the Code
Each file contains extensive educational comments:

1. **Start with `index.html`** - Understand the foundation
2. **Examine `style.css`** - Learn modern CSS techniques
3. **Study components/** - See React patterns in action
4. **Review hooks/** - Understand custom hook creation
5. **Analyze `app.js`** - See everything work together

### 🛠️ Step 3: Experiment and Build
- Modify sensor ranges in `utils/config.js`
- Add new sensor types following the existing pattern
- Create additional components using the established structure
- Implement new features using the educational framework

## 📊 Sensors Monitored

| Sensor Type | Range | Unit | Status Indicators |
|-------------|--------|------|-------------------|
| 🌡️ Water Temperature | 20-26°C optimal | °C | 🟢 Optimal, 🟡 Warning, 🔴 Critical |
| 💧 Humidity | 60-70% optimal | % | Real-time status monitoring |
| ⚡ Electric Conductivity | 1000-1400 optimal | μS/cm | Nutrient concentration tracking |
| 🌊 Water Level | 70-100% optimal | % | Reservoir monitoring |
| 🧪 pH Level | 6.0-6.8 optimal | pH | Acidity/alkalinity balance |
| ☀️ Light Intensity | 60-85% optimal | % | Growing light monitoring |
| 🥬 Nutrient Level | 80-100% optimal | % | Nutrient reservoir tracking |
| 🌡️ Air Temperature | 22-26°C optimal | °C | Ambient temperature monitoring |

## 🧩 Component Architecture

### 🎯 Design Principles

1. **Single Responsibility** - Each component has one clear purpose
2. **Reusability** - Components work in different contexts
3. **Props Interface** - Clear, documented prop definitions
4. **Error Handling** - Graceful handling of edge cases
5. **Accessibility** - ARIA labels and keyboard navigation
6. **Performance** - Optimized re-rendering and memory usage

### 📦 Core Components

#### `LoginScreen.js`
- **Purpose**: User authentication interface
- **Features**: Form validation, loading states, error handling
- **Learning Focus**: Form handling, state management, user experience

#### `SensorCard.js`
- **Purpose**: Display individual sensor data
- **Features**: Status indicators, tooltips, accessibility
- **Learning Focus**: Props, conditional rendering, CSS styling

#### `ChartComponent.js`
- **Purpose**: Data visualization with Chart.js
- **Features**: Interactive charts, responsive design, data formatting
- **Learning Focus**: Third-party library integration, useRef, useEffect

### 🪝 Custom Hooks

Located in `hooks/customHooks.js`:

- **`useLocalStorage`** - Persistent state management
- **`useDebounce`** - Input debouncing for performance
- **`useInterval`** - Safe interval management in React
- **`useToggle`** - Boolean state management
- **`useAsync`** - Async operation handling

## 🎨 Styling Architecture

### 🎯 CSS Methodology

- **CSS Custom Properties** - Maintainable theming system
- **Component-based Styles** - Organized, modular CSS
- **Mobile-first Design** - Progressive enhancement approach
- **Accessibility Features** - Focus management, high contrast
- **Modern Techniques** - Grid, Flexbox, backdrop-filter

### 🎨 Design System

```css
/* Color Palette */
--primary-color: #3498db;    /* Main blue */
--success-color: #27ae60;    /* Green for optimal */
--warning-color: #f39c12;    /* Orange for warnings */
--danger-color: #e74c3c;     /* Red for critical */

/* Spacing Scale */
--spacing-xs: 0.25rem;       /* 4px */
--spacing-sm: 0.5rem;        /* 8px */
--spacing-md: 1rem;          /* 16px */
--spacing-lg: 1.5rem;        /* 24px */
--spacing-xl: 2rem;          /* 32px */
```

## 🔧 Configuration System

The `utils/config.js` file provides centralized configuration:

### 🎛️ Customizable Settings

- **Sensor ranges and properties** - Modify optimal/warning/critical ranges
- **Update intervals** - Adjust data refresh rates
- **UI preferences** - Themes, animations, chart settings
- **Feature flags** - Enable/disable functionality
- **API endpoints** - Backend integration settings

### 📝 Example Configuration

```javascript
// Modify sensor ranges
SENSOR_CONFIG.types.temperature.optimal = [18, 28];

// Adjust update intervals
APP_CONFIG.dataUpdateInterval = 5000; // 5 seconds

// Enable/disable features
APP_CONFIG.features.notifications = true;
```

## 🌐 Browser Support

- ✅ **Chrome 90+** - Full support
- ✅ **Firefox 88+** - Full support  
- ✅ **Safari 14+** - Full support
- ✅ **Edge 90+** - Full support
- ⚠️ **IE 11** - Fallback JavaScript provided

## 🔌 Raspberry Pi Integration

### 🥧 Hardware Integration

To connect real sensors to this dashboard:

1. **Install sensor libraries:**
   ```bash
   pip install RPi.GPIO adafruit-circuitpython-dht
   ```

2. **Create sensor reading script:**
   ```python
   # sensor_reader.py
   import json
   import time
   from http.server import HTTPServer, BaseHTTPRequestHandler
   
   class SensorHandler(BaseHTTPRequestHandler):
       def do_GET(self):
           if self.path == '/sensors':
               sensor_data = {
                   "temperature": read_temperature_sensor(),
                   "humidity": read_humidity_sensor(),
                   "pH": read_ph_sensor(),
                   # Add more sensors...
               }
               self.send_response(200)
               self.send_header('Content-type', 'application/json')
               self.end_headers()
               self.wfile.write(json.dumps(sensor_data).encode())
   
   # Start server
   httpd = HTTPServer(('localhost', 8080), SensorHandler)
   httpd.serve_forever()
   ```

3. **Modify `app.js` to fetch real data:**
   Replace simulated data with actual API calls.

## 🤝 Contributing

We welcome contributions, especially educational improvements:

### 🎯 Areas for Contribution

1. **Enhanced Documentation** - More learning examples
2. **Additional Sensors** - New sensor types and ranges
3. **UI Improvements** - Better accessibility and design
4. **Performance Optimization** - Code splitting, caching
5. **Testing** - Unit and integration tests
6. **Internationalization** - Multiple language support

### 📝 Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Add** comprehensive comments for educational value
4. **Test** thoroughly across different browsers
5. **Commit** with descriptive messages
6. **Push** to your branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request with detailed description

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Chart.js** - For excellent data visualization capabilities
- **Hydroponic Community** - For sensor range specifications
- **Open Source Contributors** - For inspiration and best practices

## 📞 Support

### 🆘 Getting Help

1. **Check the Learning Guide** - [`docs/LEARNING_GUIDE.md`](docs/LEARNING_GUIDE.md)
2. **Read component comments** - Extensive inline documentation
3. **Review configuration** - `utils/config.js` for customization
4. **Browse examples** - Working code patterns throughout

### 🐛 Reporting Issues

Please include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

---

**Happy Learning! 🎓** This project is designed to teach modern web development through a practical, real-world application. Take your time exploring the code, experimenting with modifications, and building upon the foundation provided.

*Made with ❤️ for the learning community*
