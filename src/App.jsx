import React from "react";
import "./App.css";
import { sections, projects, skillGroups, contacts } from "./data.js";
import FourierFigure from "./components/FourierFigure.jsx";
import Loader from "./components/Loader.jsx";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const subscripts = ["₁", "₂", "₃", "₄", "₅", "₆"];

function Scribble() {
  return (
    <svg className="scribble" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M3 11 C 48 3, 96 15, 150 8 S 252 4, 297 10" />
    </svg>
  );
}

function ProjectVisual({ kind }) {
  if (kind === "insight") {
    const domains = ["E-COMMERCE", "ROAD SAFETY", "GOVT FINANCE", "MARKETING A/B", "BI DASHBOARD"];
    return (
      <div className="viz viz-insight">
        <div className="viz-top"><span>INSIGHTINDIA / 5 DOMAINS</span><span className="pulse">LIVE VIEW</span></div>
        <div className="viz-insight-list">
          {domains.map((name, i) => (
            <div key={name} style={{ "--w": `${[88, 64, 76, 52, 94][i]}%`, "--d": `${i * 90}ms` }}>
              <small>{name}</small><i />
            </div>
          ))}
        </div>
        <div className="viz-foot">DATA → INSIGHT → DECISION</div>
      </div>
    );
  }
  if (kind === "supply") {
    const bars = [35, 57, 42, 78, 61, 94, 72, 100, 68, 84, 54, 89];
    return (
      <div className="viz viz-supply">
        <div className="viz-top"><span>SUPPLY / SIGNALS</span><span className="pulse">LIVE VIEW</span></div>
        <div className="viz-stats">
          <div><small>ORDERS</small><b>1,284</b></div>
          <div><small>ON TIME</small><b>92.4<i>%</i></b></div>
        </div>
        <div className="viz-bars">
          {bars.map((n, i) => <i key={i} style={{ "--h": `${n}%`, "--d": `${i * 55}ms` }} title={`Month ${i + 1}`} />)}
        </div>
        <div className="viz-foot">SUPPLIER PERFORMANCE / OVERVIEW</div>
      </div>
    );
  }
  if (kind === "finance") {
    return (
      <div className="viz viz-finance">
        <div className="viz-top"><span>FINLYTIC / MONTHLY</span><span>↗</span></div>
        <div className="viz-money">₹24,860<small>SPENDING THIS MONTH</small></div>
        <div className="ring"><div><b>68%</b><small>OF BUDGET</small></div></div>
        <div className="viz-lines"><i /><i /><i /></div>
        <div className="viz-foot">MAKE EVERY RUPEE VISIBLE.</div>
      </div>
    );
  }
  return (
    <div className="viz viz-consult">
      <span className="viz-top"><span>CONSULTIQ / THINKING SPACE</span></span>
      <div className="viz-question">What changed?<br /><em>What should we do next?</em></div>
      <div className="viz-flow">
        <i>Signal</i><b /><i>Insight</i><b /><i>Action</i>
      </div>
      <div className="viz-foot">A CONCEPT FOR BETTER DECISIONS</div>
    </div>
  );
}

function ContactIcon({ name }) {
  if (name === "mail") return <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === "github") return <svg viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.2-.4-3.8 1.4a13.2 13.2 0 0 0-6.9 0C5.4 1.1 4.2 1.5 4.2 1.5a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 2.7 8.7c0 5.2 3.1 6.4 6.1 6.7a3.4 3.4 0 0 0-.9 2.7V22" /></svg>;
  if (name === "instagram") return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" /></svg>;
  return <span className="in-mark">in</span>;
}

function App() {
  // The intro plays on every page load / refresh (skipped only for reduced-motion users).
  const [showLoader, setShowLoader] = React.useState(() => !reduced());
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [active, setActive] = React.useState("intro");
  const [copied, setCopied] = React.useState(false);
  const [now, setNow] = React.useState(() => new Date());
  const [theme, setTheme] = React.useState(() => document.documentElement.dataset.theme || "light");
  const navRef = React.useRef(null);
  const progressRef = React.useRef(null);
  const [proj, setProjRaw] = React.useState(0);
  const [projShown, setProjShown] = React.useState(false);
  const [projDir, setProjDir] = React.useState(1);
  const tabsRef = React.useRef(null);
  const touchX = React.useRef(null);
  const [tabPill, setTabPill] = React.useState({ left: 0, width: 0, ready: false });
  // Change project; `dir` decides which way the card slides.
  const projRef = React.useRef(0);
  const goProj = React.useCallback((next, dir) => {
    const n = projects.length;
    const target = ((next % n) + n) % n;
    setProjDir(dir ?? (target >= projRef.current ? 1 : -1));
    projRef.current = target;
    setProjRaw(target);
  }, []);
  const navLock = React.useRef({ locked: false, timer: 0 });
  const [pill, setPill] = React.useState({ left: 0, top: 0, width: 0, height: 0, ready: false });

  const finishLoader = React.useCallback(() => {
    setShowLoader(false);
  }, []);

  // Lock scrolling while the intro plays.
  React.useEffect(() => {
    document.documentElement.classList.toggle("is-loading", showLoader);
    return () => document.documentElement.classList.remove("is-loading");
  }, [showLoader]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("arka-portfolio-theme", theme); } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0d1411" : "#f4efe2");
  }, [theme]);

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Scroll spy + reading progress bar.
  React.useEffect(() => {
    const ids = sections.map(([id]) => id);
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      // While a nav click is scrolling, keep the pill pointed at the clicked target
      // (no hopping through the sections in between); resume once scrolling settles.
      const lock = navLock.current;
      if (lock.locked) {
        window.clearTimeout(lock.timer);
        lock.timer = window.setTimeout(() => { lock.locked = false; update(); }, 140);
        return;
      }
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 8) return setActive("contact");
      let current = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 130) current = id;
      });
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  // Sliding pill behind the active nav link.
  React.useLayoutEffect(() => {
    const move = () => {
      const link = navRef.current?.querySelector(`a[href="#${active}"]`);
      if (link) setPill({ left: link.offsetLeft, top: link.offsetTop, width: link.offsetWidth, height: link.offsetHeight, ready: true });
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [active, menuOpen]);

  // Project viewer: restart the preview animations whenever the selected project changes.
  React.useEffect(() => {
    setProjShown(false);
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setProjShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [proj]);

  const onProjKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goProj(proj + 1, 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goProj(proj - 1, -1); }
  };

  // Sliding highlight behind the active project tab (and keep it scrolled into view on phones).
  React.useLayoutEffect(() => {
    const move = () => {
      const tab = tabsRef.current?.querySelector(".proj-tab.active");
      if (!tab) return;
      setTabPill({ left: tab.offsetLeft, width: tab.offsetWidth, ready: true });
      const box = tabsRef.current;
      if (box.scrollWidth > box.clientWidth) box.scrollTo({ left: tab.offsetLeft - (box.clientWidth - tab.offsetWidth) / 2, behavior: reduced() ? "auto" : "smooth" });
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [proj]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) goProj(proj + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };
  // Preview card follows the pointer in 3D.
  const tilt = (e) => {
    if (reduced()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
  };
  const untilt = (e) => { e.currentTarget.style.setProperty("--ry", "0deg"); e.currentTarget.style.setProperty("--rx", "0deg"); };

  // Reveal-on-scroll.
  React.useEffect(() => {
    const els = [...document.querySelectorAll("[data-reveal]")];
    if (reduced() || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    document.documentElement.classList.add("reveal-on");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (event, id) => {
    event.preventDefault();
    const lock = navLock.current;
    lock.locked = true;
    window.clearTimeout(lock.timer);
    lock.timer = window.setTimeout(() => { lock.locked = false; }, 600); // fallback if no scroll happens
    setActive(id);
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    const header = document.querySelector(".site-header");
    const offset = (header?.getBoundingClientRect().height || 60) + 34;
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: reduced() ? "auto" : "smooth" });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("arka829636@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = "mailto:arka829636@gmail.com";
    }
  };

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const date = now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }).toUpperCase();

  return (
    <>
      {showLoader && <Loader onDone={finishLoader} />}
      <div className="paper-grid" aria-hidden="true" />
      <div className="progress" aria-hidden="true"><span ref={progressRef} /></div>

      <div className={`portfolio${showLoader ? "" : " is-ready"}`}>
        <header className="site-header">
          <a className="wordmark" href="#intro" onClick={(e) => go(e, "intro")} aria-label="Arka Mondal, home">
            <span className="wordmark-mark">AM</span>
            <span className="wordmark-name">Arka Mondal</span>
          </a>

          <nav ref={navRef} className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
            <span className={`nav-pill${pill.ready ? " is-ready" : ""}`} aria-hidden="true" style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }} />
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={active === id ? "current" : ""} aria-current={active === id ? "true" : undefined} onClick={(e) => go(e, id)}>{label}</a>
            ))}
          </nav>

          <div className="header-tools">
            <div className="clock" aria-label={`Local time ${time}`}>
              <i aria-hidden="true" />
              <b>{time}</b>
              <small>{date}</small>
            </div>
            <div className="theme-switch" data-theme-active={theme} role="group" aria-label="Color theme">
              <span className="theme-thumb" aria-hidden="true" />
              <button type="button" className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")} aria-pressed={theme === "light"}>
                <span aria-hidden="true">☼</span><em>Light</em>
              </button>
              <button type="button" className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")} aria-pressed={theme === "dark"}>
                <span aria-hidden="true">☾</span><em>Dark</em>
              </button>
            </div>
          </div>

          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button>
        </header>

        <main>
          {/* ───────── HERO ───────── */}
          <section className="hero wrap" id="intro">
            <div className="eyebrow hero-in" style={{ "--d": "0ms" }}>
              <span className="tag">THEOREM 1</span>
              <span>MCA STUDENT · DATA &amp; TECHNOLOGY</span>
            </div>

            <h1 className="hero-title">
              <span className="line hero-in" style={{ "--d": "80ms" }}>Curious mind.</span>
              <span className="line hero-in" style={{ "--d": "200ms" }}>
                <em>Practical <span className="underlined">maker.<Scribble /></span></em>
              </span>
            </h1>

            <div className="hero-grid">
              <div className="hero-copy hero-in" style={{ "--d": "340ms" }}>
                <p className="lede">
                  I’m Arka Mondal—a mathematics graduate and MCA student building useful things with data, code, and thoughtful design.
                </p>
                <div className="hero-links">
                  <a className="btn-solid" href="#work" onClick={(e) => go(e, "work")}>Explore selected work <span>↓</span></a>
                  <a className="btn-line" href="https://github.com/arka-builds" target="_blank" rel="noreferrer">GitHub Profile <span>↗</span></a>
                </div>
                <dl className="facts">
                  <div><dt>NOW</dt><dd>MCA · KIIT University</dd></div>
                  <div><dt>BEFORE</dt><dd>B.Sc. Mathematics Hons.</dd></div>
                  <div><dt>FOCUS</dt><dd>Data · Software · AI</dd></div>
                </dl>
              </div>

              <div className="hero-fig hero-in" style={{ "--d": "460ms" }}>
                <FourierFigure />
                <span className="note note-fig" aria-hidden="true">drag n, watch the square appear ↘</span>
              </div>
            </div>
          </section>

          <div className="tape-wrap" aria-hidden="true">
            <div className="tape">
              <div className="tape-track">
                {Array.from({ length: 4 }, (_, i) => (
                  <span key={i}>DATA WITH PURPOSE <b>∑</b> CODE WITH CURIOSITY <b>∫</b> LEARN BY BUILDING <b>∂</b></span>
                ))}
              </div>
            </div>
          </div>

          {/* ───────── ABOUT ───────── */}
          <section className="about wrap" id="about">
            <header className="sec-head" data-reveal>
              <span className="sec-no"><b>§ 1</b> DEFINITION · A LITTLE CONTEXT</span>
              <h2>Numbers first.<br /><em>Questions always.</em></h2>
            </header>

            <div className="about-grid">
              <div className="about-story" data-reveal style={{ "--d": "80ms" }}>
                <p className="about-large">
                  My journey started with <mark>mathematics</mark>. Now I’m using that way of thinking to explore <mark>data</mark>, <mark>software</mark>, and <mark>intelligent applications</mark>.
                </p>
                <p>I’m pursuing an MCA at KIIT University after completing B.Sc. Mathematics Honours at Burdwan Raj College. I like breaking down complex questions, working with structured data, and learning by building projects.</p>
                <p>I’m growing my practical foundation in analytics and software while exploring how AI can support real-world decisions—without losing sight of the fundamentals.</p>
                <span className="note note-about" aria-hidden="true">← where it all started</span>
              </div>

              <aside className="given" data-reveal style={{ "--d": "160ms" }}>
                <div className="given-title">GIVEN <i>/ THE FOUNDATION</i></div>
                <ol>
                  <li>
                    <span className="when">2025 — NOW</span>
                    <div><b>Master of Computer Applications</b><small>KIIT University · Bhubaneswar</small></div>
                  </li>
                  <li>
                    <span className="when">2021 — 2024</span>
                    <div><b>B.Sc. Mathematics Honours</b><small>Burdwan Raj College</small></div>
                  </li>
                </ol>
                <p className="show">
                  <i>To show:</i> that structured thinking turns into useful software.
                </p>
              </aside>
            </div>
          </section>

          {/* ───────── WORK ───────── */}
          <section className="work wrap" id="work">
            <header className="sec-head split" data-reveal>
              <div>
                <span className="sec-no"><b>§ 2</b> LEMMAS · A FEW THINGS I’VE BEEN WORKING ON</span>
                <h2>Selected <em>work.</em></h2>
              </div>
              <p>Projects are where I connect the dots between what I learn and problems worth solving.</p>
            </header>

            <div className="lemmas" data-reveal onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="proj-bar">
                <div className="proj-tabs" ref={tabsRef} role="tablist" aria-label="Projects" onKeyDown={onProjKey}>
                  <span className={`proj-pill${tabPill.ready ? " is-ready" : ""}`} aria-hidden="true" style={{ left: tabPill.left, width: tabPill.width }} />
                  {projects.map((p, i) => (
                    <button key={p.id} type="button" role="tab" id={`proj-tab-${i}`} aria-selected={proj === i} aria-controls="proj-panel" tabIndex={proj === i ? 0 : -1} className={proj === i ? "proj-tab active" : "proj-tab"} onClick={() => goProj(i)}>
                      <b>{p.id}</b><span>{p.title}</span>
                    </button>
                  ))}
                </div>
                <div className="proj-nav">
                  <button type="button" onClick={() => goProj(proj - 1, -1)} aria-label="Previous project">←</button>
                  <span>{String(proj + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                  <button type="button" onClick={() => goProj(proj + 1, 1)} aria-label="Next project">→</button>
                </div>
              </div>

              {(() => {
                const p = projects[proj];
                return (
                  <article className={`lemma tone-${p.kind}${projShown ? " in" : ""}`} key={p.id} id="proj-panel" role="tabpanel" style={{ "--dir": projDir }} aria-labelledby={`proj-tab-${proj}`}>
                    <div className="lemma-copy">
                      <div className="lemma-label"><span>LEMMA {proj + 1}</span><span>{p.status}</span></div>
                      <h3>{p.title}</h3>
                      <p className="lemma-type">{p.type}</p>
                      <p className="lemma-summary">{p.summary}</p>
                      <p className="lemma-desc">{p.description}</p>
                      <ul className="tags">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
                      <a className="btn-line" href={p.href} target="_blank" rel="noreferrer">Explore repository <span>↗</span></a>
                    </div>
                    <a className="lemma-art" onMouseMove={tilt} onMouseLeave={untilt} href={p.href} target="_blank" rel="noreferrer" aria-label={`View ${p.title} on GitHub`}>
                      <div className="art-meta"><span>{p.id} / {String(projects.length).padStart(2, "0")}</span><span>ILLUSTRATIVE PREVIEW</span></div>
                      <ProjectVisual kind={p.kind} />
                      <span className="art-open">OPEN PROJECT ↗</span>
                    </a>
                  </article>
                );
              })()}
            </div>
            <p className="fine">Previews are illustrative concepts, not screenshots. Numbers shown are sample values.</p>
          </section>

          {/* ───────── SKILLS ───────── */}
          <section className="toolkit" id="toolkit">
            <div className="wrap">
              <header className="sec-head split" data-reveal>
                <div>
                  <span className="sec-no"><b>§ 3</b> AXIOMS · TOOLS I REACH FOR</span>
                  <h2>My growing <em>toolkit.</em></h2>
                </div>
                <p>Not a list of buzzwords—a snapshot of the tools and foundations I’m actively using and developing.</p>
              </header>

              <div className="axioms">
                {skillGroups.map((g, i) => (
                  <div className="axiom" key={g[0]} data-reveal style={{ "--d": `${i * 70}ms` }}>
                    <span className="axiom-no">A{subscripts[i]}</span>
                    <h3>{g[0]} <i>= {"{"}</i></h3>
                    <ul>{g.slice(1).map((s) => <li key={s}>{s}</li>)}</ul>
                    <span className="close">{"}"}</span>
                  </div>
                ))}
              </div>

              <div className="learning" data-reveal>
                <span className="exists">∃</span>
                <div><b>On my learning list</b><p>Advanced SQL · Data engineering · RAG pipelines · LLM evaluation</p></div>
                <span className="status">IN PROGRESS</span>
              </div>
            </div>
          </section>

          {/* ───────── CONTACT ───────── */}
          <section className="contact wrap" id="contact">
            <header className="contact-head" data-reveal>
              <span className="sec-no"><b>§ 4</b> Q.E.D. · THE NEXT CHAPTER</span>
              <h2>Let’s make<br /><em>something useful.</em><span className="qed" aria-hidden="true">∎</span></h2>
              <div className="contact-actions">
                <button type="button" className="btn-solid" onClick={copyEmail}>{copied ? "Copied ✓" : "Copy email"}</button>
                <a className="btn-line" href="mailto:arka829636@gmail.com">Write to me <span>↗</span></a>
                <span className="note note-contact" aria-hidden="true">say hi ↓</span>
              </div>
              <span className="sr-only" role="status">{copied ? "Email address copied" : ""}</span>
            </header>

            <div className="contact-links">
              {contacts.map((c, i) => (
                <a key={c.label} className="contact-card" href={c.href} {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})} data-reveal style={{ "--d": `${i * 60}ms` }}>
                  <span className="contact-icon" aria-hidden="true"><ContactIcon name={c.icon} /></span>
                  <span className="contact-copy"><small>{c.label}</small><b>{c.text}</b></span>
                  <span className="contact-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>

            <div className="contact-bottom"><span>ARKA MONDAL · MCA</span><span>BASED IN INDIA</span></div>
          </section>
        </main>

        <footer className="site-footer wrap">
          <a href="#intro" className="wordmark" onClick={(e) => go(e, "intro")}>Arka<span>∎</span></a>
          <span>Built with curiosity, by Arka Mondal.</span>
          <a href="#intro" onClick={(e) => go(e, "intro")}>BACK TO TOP ↑</a>
        </footer>
      </div>
    </>
  );
}

export default App;
