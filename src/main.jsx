import { StrictMode, Suspense, lazy, startTransition, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DragStart from "./components/DragStart.jsx";
import loadSfx from "./assets/sfx/load.mp3";
import { playUnlockedAudio, primeAudioPlayback } from "./lib/audioUnlock";

const App = lazy(() => import("./App.jsx"));
const APP_TRANSITION_MS = 320;

function Root() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const transitionTimeoutRef = useRef(null);

  const handleStart = () => {
    if (hasStarted || isExiting) {
      return;
    }

    void playUnlockedAudio(loadSfx, 0.6);
    setIsExiting(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        setHasStarted(true);
      });
    }, APP_TRANSITION_MS);
  };

  useEffect(() => {
    const removeAudioListeners = primeAudioPlayback();

    return () => {
      removeAudioListeners();
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  if (!hasStarted) {
    return (
      <div className={`dragStartRoute${isExiting ? " is-exiting" : ""}`}>
        <DragStart onStart={handleStart} />
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
