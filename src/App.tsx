import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          type="button"
          className="btn-primary"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="btn-primary">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="btn-primary">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
