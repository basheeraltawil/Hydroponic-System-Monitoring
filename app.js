// React Component using ES6 + JSX
function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>Hello from GitHub.io 🚀</h1>
      <p>This site is built with <b>React + ES6</b></p>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}

// Render to the page
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
