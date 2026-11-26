# Arka Mondal — Portfolio ("The Proof")

🌐 **Live Portfolio:** [Visit My Website](https://arkamondal.vercel.app)


A React + Vite portfolio styled as a mathematician's notebook.

- **Light / Dark themes** (light and dark), remembered in localStorage and following the system setting on first visit
- **Fig. 1** — an interactive Fourier-series square wave drawn with rotating circles (hero)
- Sections framed as a proof: Definition, Lemmas (projects), Axioms (skills), Q.E.D. (contact)
- Stacking project cards, graph-paper background, sine-wave intro (plays on every load/refresh, click to skip)
- Fonts are self-hosted via `@fontsource` (no external requests)
- Respects `prefers-reduced-motion`

## Run locally

```bash
npm install
npm run dev
```

## Build for deployment

```bash
npm run build
```

## Structure

- `src/data.js` — projects, skills, contact links (edit content here)
- `src/App.jsx` — page layout
- `src/components/` — `FourierFigure`, `Loader`
- `src/App.css` — all styling and theme tokens

## Notes

- Resume: keep the current PDF at `public/resume.pdf`.
- Project previews are illustrative concepts with sample numbers; swap in real screenshots when available.
