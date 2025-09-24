/**
 * LoginScreen Component - Authentication interface for the hydroponic dashboard
 * 
 * LEARNING NOTES FOR BEGINNERS:
 * - This is a React functional component that handles user login
 * - useState hook manages the form state (username, password, error messages)
 * - Event handlers (onSubmit, onChange) manage user interactions
 * - Controlled components keep form inputs synchronized with React state
 */

const LoginScreen = ({ onLogin }) => {
  // State hooks to manage form data and UI state
  // useState returns [currentValue, setterFunction] - this is called "array destructuring"
  const [formData, setFormData] = React.useState({
    username: 'admin',  // Default username for convenience
    password: 'admin'   // Default password for convenience
  });
  const [error, setError] = React.useState(''); // Error message state
  const [isLoading, setIsLoading] = React.useState(false); // Loading state for better UX

  /**
   * Handle form submission - validates input and attempts login
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear any previous errors
    setIsLoading(true); // Show loading state

    // Input validation - ensure required fields are filled
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate network request delay for realistic user experience
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple authentication check (in real app, this would be an API call)
      if (formData.username === 'admin' && formData.password === 'admin') {
        onLogin(formData.username); // Call parent component's login handler
      } else {
        setError('Invalid username or password. Try admin/admin');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false); // Always clear loading state
    }
  };

  /**
   * Handle input field changes - updates form state
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Extract name and value from input element
    setFormData(prevData => ({
      ...prevData,    // Spread operator: copy all existing properties
      [name]: value   // Update only the specific field that changed
    }));
  };

  // Component JSX - describes the UI structure
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🌱</div>
          <h1>Hydroponic System Dashboard</h1>
          <h2>System Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}  // Controlled by React state
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter username"
              disabled={isLoading}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}  // Controlled by React state
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter password"
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Conditional rendering: show error only if it exists */}
          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="login-note">
            Default credentials: <strong>admin</strong> / <strong>admin</strong>
          </p>
        </form>
      </div>
    </div>
  );
};

// Make component available globally for CDN-based setup
window.LoginScreen = LoginScreen;