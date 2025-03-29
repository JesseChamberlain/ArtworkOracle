import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex gap-8 justify-center">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold my-6">ArtworkOracle</h1>
      <div className="card">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="mb-4 hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          countz is {count}
        </button>
        <button
          onClick={() => setCount((count) => count + 2)}
          className="mb-4 hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          count is {count}
        </button>
        <p className="mt-4 text-lg">
          Edit <code className="bg-gray-700 px-1 rounded">src/App.tsx</code> and
          save to test HMR
        </p>
      </div>
      <p className="read-the-docs mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
