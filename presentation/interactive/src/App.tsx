import { useEffect, useCallback, useState, useRef } from "react";
import { useScene } from "./hooks/useScene";
import { Scene } from "./components/Scene";
import { config } from "./data/presentation";

export default function App() {
  const { currentIndex, currentScene, total, isFirst, isLast, next, prev, goTo } =
    useScene(config.scenes);

  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, []);

  useEffect(() => {
    showControls();
  }, [currentIndex, showControls]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
      }
    },
    [next, prev],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", showControls);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", showControls);
    };
  }, [handleKeyDown, showControls]);

  const chromeClass = controlsVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 pointer-events-none";

  return (
    <div className="relative w-full h-full flex flex-col cursor-none" style={{ cursor: controlsVisible ? "auto" : "none" }}>
      {/* Scene area — full viewport */}
      <main className="absolute inset-0 overflow-hidden">
        <div key={currentScene.id} className="scene-enter w-full h-full">
          <Scene scene={currentScene} />
        </div>
      </main>

      {/* Header — floating overlay */}
      <header className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 bg-scene-bg/60 backdrop-blur-sm border-b border-scene-border/20 transition-all duration-500 ${chromeClass} ${!controlsVisible ? "-translate-y-full" : ""}`}>
        <span className="text-sm font-medium text-scene-muted">{config.title}</span>
        <span className="text-xs text-scene-muted font-mono">
          {currentIndex + 1} / {total}
        </span>
      </header>

      {/* Navigation bar — floating overlay */}
      <nav className={`absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-4 px-6 py-4 bg-scene-bg/60 backdrop-blur-sm border-t border-scene-border/20 transition-all duration-500 ${chromeClass} ${!controlsVisible ? "translate-y-full" : ""}`}>
        <button
          onClick={prev}
          disabled={isFirst}
          className="p-2 rounded-lg text-scene-muted hover:text-scene-text hover:bg-scene-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Escena anterior"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {config.scenes.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`nav-dot ${i === currentIndex ? "active" : ""}`}
              aria-label={`Ir a escena ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={isLast}
          className="p-2 rounded-lg text-scene-muted hover:text-scene-text hover:bg-scene-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Siguiente escena"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
