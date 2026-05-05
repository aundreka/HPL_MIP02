import { StrictMode, Suspense, lazy, startTransition, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Start from "./components/start.jsx";

const App = lazy(() => import("./App.jsx"));

function Root() {
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    startTransition(() => {
      setHasStarted(true);
    });
  };

  if (!hasStarted) {
    return <Start onStart={handleStart} />;
  }

  return (
    <Suspense fallback={<Start onStart={handleStart} />}>
      <App />
    </Suspense>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
