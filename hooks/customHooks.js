/**
 * Custom React Hooks - Reusable state logic for the hydroponic dashboard
 * 
 * LEARNING NOTES FOR BEGINNERS:
 * - Custom hooks are functions that start with "use" and can call other hooks
 * - They allow you to extract and reuse stateful logic between components
 * - Hooks follow the "Rules of Hooks" - only call them at the top level
 * - Custom hooks make code more modular and easier to test
 */

/**
 * useLocalStorage - Custom hook for persistent state management
 * Automatically saves and loads state from browser's localStorage
 * 
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if nothing in storage
 * @returns {[value, setValue]} - same interface as useState
 */
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      if (item) {
        // Parse stored json or return initialValue if parsing fails
        const parsed = JSON.parse(item, (key, value) => {
          // Restore Date objects from storage
          if (value && typeof value === 'object' && value.__dateType) {
            return new Date(value.value);
          }
          return value;
        });
        return parsed;
      }
      return initialValue;
    } catch (error) {
      // If error, return initial value
      console.warn(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage with Date object handling
      window.localStorage.setItem(key, JSON.stringify(valueToStore, (key, value) => {
        // Handle Date objects by converting to special format
        if (value instanceof Date) {
          return { __dateType: true, value: value.toISOString() };
        }
        return value;
      }));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.warn(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * useDebounce - Custom hook to debounce rapidly changing values
 * Useful for search inputs or API calls that shouldn't happen on every keystroke
 * 
 * @param {*} value - the value to debounce
 * @param {number} delay - delay in milliseconds
 * @returns {*} - the debounced value
 */
const useDebounce = (value, delay) => {
  // State to store debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    // Set up a timer that will update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function - cancel timer if value changes before delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
};

/**
 * useInterval - Custom hook for setting up intervals in React
 * Automatically cleans up the interval when component unmounts
 * 
 * @param {Function} callback - function to call on each interval
 * @param {number} delay - delay in milliseconds (null to pause)
 */
const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  // Remember the latest callback
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * useToggle - Custom hook for boolean toggle functionality
 * Common pattern for show/hide, open/close, etc.
 * 
 * @param {boolean} initialValue - starting boolean value
 * @returns {[value, toggle, setTrue, setFalse]} - value and toggle functions
 */
const useToggle = (initialValue = false) => {
  const [value, setValue] = React.useState(initialValue);
  
  // Memoize toggle functions to prevent unnecessary re-renders
  const toggle = React.useCallback(() => setValue(v => !v), []);
  const setTrue = React.useCallback(() => setValue(true), []);
  const setFalse = React.useCallback(() => setValue(false), []);
  
  return [value, toggle, setTrue, setFalse];
};

/**
 * useAsync - Custom hook for handling async operations
 * Manages loading, error, and success states automatically
 * 
 * @param {Function} asyncFunction - async function to execute
 * @param {Array} dependencies - when to re-run the async function
 */
const useAsync = (asyncFunction, dependencies = []) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;

    const execute = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await asyncFunction();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    execute();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
};

/**
 * usePrevious - Custom hook to get the previous value of a prop or state
 * Useful for comparing current and previous values
 * 
 * @param {*} value - the value to track
 * @returns {*} - the previous value
 */
const usePrevious = (value) => {
  const ref = React.useRef();
  
  React.useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

/**
 * LEARNING NOTES - Custom Hooks Best Practices:
 * 
 * 1. NAMING: Always start with "use" to indicate it's a hook
 * 2. REUSABILITY: Extract logic that could be useful in multiple components
 * 3. TESTING: Custom hooks can be tested independently
 * 4. COMPOSITION: Hooks can use other hooks (built-in or custom)
 * 5. CLEANUP: Always clean up side effects to prevent memory leaks
 * 6. DEPENDENCIES: Be careful with dependency arrays in useEffect
 */

// Make hooks available globally for CDN setup
window.useLocalStorage = useLocalStorage;
window.useDebounce = useDebounce;
window.useInterval = useInterval;
window.useToggle = useToggle;
window.useAsync = useAsync;
window.usePrevious = usePrevious;