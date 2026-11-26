import React from "react";

/** A sine wave draws itself, then says welcome. Click or press any key to skip. */
export default function Loader({ onDone }) {
  const [phase, setPhase] = React.useState("draw");
  const [pct, setPct] = React.useState(0);
  const doneRef = React.useRef(false);

  React.useEffect(() => {
    const timers = [];
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(100, Math.round(((now - start) / 1500) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = (delay) => {
      if (doneRef.current) return;
      doneRef.current = true;
      timers.forEach(clearTimeout);
      setPhase("out");
      timers.push(setTimeout(onDone, delay));
    };

    timers.push(setTimeout(() => setPhase("welcome"), 1550));
    timers.push(setTimeout(() => finish(650), 2500));

    const skip = () => finish(450);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [onDone]);

  return (
    <div className={`loader is-${phase}`} role="status" aria-label="Loading portfolio">
      <svg className="loader-wave" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="60" x2="600" y2="60" className="loader-axis" />
        <path pathLength="1" d="M0 60 C 37 -10, 112 -10, 150 60 S 262 130, 300 60 S 412 -10, 450 60 S 562 130, 600 60" />
      </svg>
      <div className="loader-copy">
        <p className="loader-label">PLOTTING · {String(pct).padStart(3, "0")}%</p>
        <h1 className="loader-welcome">Welcome<span>.</span></h1>
      </div>
      <p className="loader-skip">click anywhere to skip</p>
    </div>
  );
}
