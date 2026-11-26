import React from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fig. 1 — a square wave assembled from rotating circles (Fourier series).
 * The signature piece of the page: a mathematician's way to say hello.
 */
export default function FourierFigure() {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [terms, setTerms] = React.useState(reducedMotion() ? 5 : 1);
  const termsRef = React.useRef(terms);
  const touched = React.useRef(false);
  const redraw = React.useRef(() => {});

  React.useEffect(() => {
    termsRef.current = terms;
    redraw.current();
  }, [terms]);

  // Gentle auto-sweep from 1 term to 7 until the visitor takes over.
  React.useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => {
      if (touched.current) return window.clearInterval(id);
      setTerms((n) => {
        if (n >= 7) { window.clearInterval(id); return n; }
        return n + 1;
      });
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = reducedMotion();
    let w = 0, h = 0, raf = 0, last = 0, acc = 0, t = 0.6;
    let visible = true;
    let trace = [];
    let colors = {};

    const readColors = () => {
      const cs = getComputedStyle(wrap);
      const get = (n) => cs.getPropertyValue(n).trim();
      colors = { ink: get("--ink"), muted: get("--muted"), accent: get("--accent"), blue: get("--accent-2"), line: get("--line") };
    };

    const geometry = () => {
      const R = h * 0.27;
      const r1 = (4 * R) / Math.PI;
      const cx = Math.max(w * 0.23, r1 + 10);
      const waveX = cx + r1 + 26;
      return { R, r1, cx, cy: h / 2, waveX, waveW: Math.max(40, w - waveX - 8) };
    };

    const tip = (time, g, n) => {
      let x = g.cx, y = g.cy;
      for (let i = 0; i < n; i++) {
        const k = 2 * i + 1;
        const r = (4 * g.R) / (Math.PI * k);
        x += r * Math.cos(k * time);
        y -= r * Math.sin(k * time);
      }
      return { x, y };
    };

    const prefill = () => {
      const g = geometry();
      trace = [];
      const count = Math.floor(g.waveW / 2);
      for (let i = 0; i < count; i++) trace.push(tip(t - i * 0.035, g, termsRef.current).y);
    };

    const draw = () => {
      const g = geometry();
      const n = termsRef.current;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      // axes + ±R guides
      ctx.strokeStyle = colors.line;
      ctx.beginPath();
      ctx.moveTo(g.waveX, 6); ctx.lineTo(g.waveX, h - 6);
      ctx.moveTo(g.waveX, g.cy); ctx.lineTo(w - 4, g.cy);
      ctx.stroke();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = colors.muted;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(g.waveX, g.cy - g.R); ctx.lineTo(w - 4, g.cy - g.R);
      ctx.moveTo(g.waveX, g.cy + g.R); ctx.lineTo(w - 4, g.cy + g.R);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // epicycles
      let x = g.cx, y = g.cy;
      for (let i = 0; i < n; i++) {
        const k = 2 * i + 1;
        const r = (4 * g.R) / (Math.PI * k);
        const nx = x + r * Math.cos(k * t);
        const ny = y - r * Math.sin(k * t);
        ctx.strokeStyle = colors.ink;
        ctx.globalAlpha = i === 0 ? 0.4 : 0.28;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
        x = nx; y = ny;
      }
      ctx.globalAlpha = 1;

      // connector to the plotted wave
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = colors.blue;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(g.waveX, y); ctx.stroke();
      ctx.setLineDash([]);

      // the wave itself
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(g.waveX, y);
      for (let i = 0; i < trace.length; i++) ctx.lineTo(g.waveX + i * 2, trace[i]);
      ctx.stroke();
      ctx.lineWidth = 1;

      // tip dot
      ctx.fillStyle = colors.accent;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = colors.ink;
      ctx.beginPath(); ctx.arc(g.cx, g.cy, 2.5, 0, Math.PI * 2); ctx.fill();
    };

    const step = (now) => {
      raf = 0;
      if (!visible || document.hidden) { last = 0; return; }
      if (!last) last = now;
      acc += Math.min(0.1, (now - last) / 1000);
      last = now;
      const g = geometry();
      const max = Math.floor(g.waveW / 2);
      while (acc >= 1 / 60) {
        t += 0.035;
        trace.unshift(tip(t, g, termsRef.current).y);
        acc -= 1 / 60;
      }
      if (trace.length > max) trace.length = max;
      draw();
      raf = requestAnimationFrame(step);
    };

    const kick = () => { if (!reduce && !raf) { last = 0; raf = requestAnimationFrame(step); } };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width; h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      prefill(); draw();
    };

    redraw.current = () => { if (w) { if (reduce) prefill(); draw(); } };

    readColors();
    resize();
    kick();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
    io.observe(wrap);
    const mo = new MutationObserver(() => { readColors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const onChange = (e) => { touched.current = true; setTerms(Number(e.target.value)); };

  return (
    <figure className="fig">
      <div className="fig-top">
        <span>FIG. 1</span>
        <span className="fig-formula">f(x) = 4/π · Σ sin(kx)/k <i>k = 1, 3 … {2 * terms - 1}</i></span>
      </div>
      <div className="fig-canvas" ref={wrapRef}>
        <canvas ref={canvasRef} role="img" aria-label={`A square wave drawn by ${terms} rotating circles`} />
      </div>
      <label className="fig-control">
        <span>n = <b>{String(terms).padStart(2, "0")}</b> circles</span>
        <input type="range" min="1" max="15" value={terms} onChange={onChange} aria-label="Number of circles in the Fourier series" />
      </label>
      <figcaption>A square wave, built only from circles. More circles, sharper edges.</figcaption>
    </figure>
  );
}
