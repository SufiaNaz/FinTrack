import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ── CSS injection ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

  [data-theme="dark"] {
    --bg:#0a0f0d;--bg2:#0f1612;--surface:#1a2620;
    --border:rgba(52,211,153,.12);--border2:rgba(52,211,153,.24);
    --text:#f0faf5;--text2:#8fb5a0;
    --accent:#34d399;--accent2:#059669;
    --adim:rgba(52,211,153,.08);--aglow:rgba(52,211,153,.2);
    --card:#0d1710;--nav:rgba(10,15,13,.9);--ink:#0a0f0d;
    --shadow:0 8px 40px rgba(0,0,0,.5);
  }
  [data-theme="light"] {
    --bg:#f4faf7;--bg2:#edf6f1;--surface:#fff;
    --border:rgba(5,150,105,.15);--border2:rgba(5,150,105,.28);
    --text:#0d2118;--text2:#3a6b56;
    --accent:#059669;--accent2:#047857;
    --adim:rgba(5,150,105,.08);--aglow:rgba(5,150,105,.15);
    --card:#fff;--nav:rgba(244,250,247,.94);--ink:#0d2118;
    --shadow:0 8px 40px rgba(0,0,0,.1);
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;transition:background .3s,color .3s}

  /* NAV */
  .ft-nav{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.2rem,5vw,4rem);background:var(--nav);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);transition:background .3s}
  .ft-logo{display:flex;align-items:center;gap:9px;font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--text);cursor:pointer}
  .ft-logo-mark{width:30px;height:30px;border-radius:7px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:.9rem}
  .ft-nav-links{display:flex;gap:2rem;list-style:none}
  .ft-nav-links a{font-size:.86rem;font-weight:500;color:var(--text2);text-decoration:none;transition:color .2s}
  .ft-nav-links a:hover{color:var(--accent)}
  .ft-nav-right{display:flex;align-items:center;gap:.7rem}

  /* TOGGLE */
  .ft-toggle{width:50px;height:26px;background:var(--surface);border:1px solid var(--border2);border-radius:100px;cursor:pointer;position:relative;display:flex;align-items:center;padding:3px;transition:border-color .2s}
  .ft-toggle:hover{border-color:var(--accent)}
  .ft-thumb{width:19px;height:19px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:10px;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
  .ft-thumb.moved{transform:translateX(23px)}

  /* BUTTONS */
  .ft-btn-ghost{padding:7px 16px;border-radius:6px;border:1px solid var(--border2);background:transparent;color:var(--text);font-size:.83rem;font-weight:500;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .2s}
  .ft-btn-ghost:hover{background:var(--adim);border-color:var(--accent);color:var(--accent)}
  .ft-btn-cta{padding:8px 20px;border-radius:6px;background:var(--accent);color:var(--ink);font-size:.83rem;font-weight:700;font-family:'Outfit',sans-serif;border:none;cursor:pointer;transition:all .2s}
  .ft-btn-cta:hover{opacity:.88;transform:translateY(-1px)}
  .ft-btn-lg{padding:13px 32px;border-radius:8px;background:var(--accent);color:var(--ink);font-size:.93rem;font-weight:700;font-family:'Outfit',sans-serif;border:none;cursor:pointer;transition:all .25s}
  .ft-btn-lg:hover{opacity:.88;transform:translateY(-2px);box-shadow:0 14px 36px var(--aglow)}
  .ft-btn-out-lg{padding:13px 28px;border-radius:8px;background:transparent;color:var(--text);font-size:.93rem;font-weight:500;font-family:'Outfit',sans-serif;border:1px solid var(--border2);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:7px;transition:all .25s}
  .ft-btn-out-lg:hover{border-color:var(--accent);color:var(--accent)}

  /* HERO */
  .ft-hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:calc(64px + 3.5rem) clamp(1.2rem,6vw,5rem) 4rem;gap:4rem}
  @media(max-width:860px){.ft-hero{grid-template-columns:1fr}.ft-hero-vis{display:none}}
  .ft-eyebrow-sm{font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:1.2rem;display:flex;align-items:center;gap:8px}
  .ft-eyebrow-sm::before{content:'';display:block;width:20px;height:1px;background:var(--accent)}
  .ft-h1{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,5vw,4.4rem);font-weight:900;line-height:1.07;letter-spacing:-.02em;color:var(--text);margin-bottom:1.4rem}
  .ft-h1 em{font-style:italic;color:var(--accent)}
  .ft-hero-body{font-size:1rem;color:var(--text2);line-height:1.75;font-weight:300;max-width:460px;margin-bottom:2.2rem}
  .ft-hero-actions{display:flex;gap:.9rem;flex-wrap:wrap;align-items:center}

  /* DASH CARD */
  .ft-dash-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;max-width:400px;width:100%;box-shadow:var(--shadow);animation:ft-float 6s ease-in-out infinite}
  @keyframes ft-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  .ft-topbar{display:flex;align-items:center;gap:5px;margin-bottom:16px}
  .ft-dot{width:8px;height:8px;border-radius:50%}
  .ft-url{margin-left:8px;font-size:.65rem;color:var(--text2)}
  .ft-kpi-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:12px}
  .ft-kpi{background:var(--surface);border-radius:9px;padding:12px;border:1px solid var(--border)}
  .ft-kpi-label{font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text2);margin-bottom:5px}
  .ft-kpi-val{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:var(--text)}
  .ft-kpi-delta{font-size:.68rem;margin-top:2px}

  .ft-dash-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:.72rem}
  .ft-dash-row:last-child{border-bottom:none}
  .ft-tag{display:inline-block;padding:2px 7px;border-radius:4px;font-size:.62rem;font-weight:600}

  /* STATS */
  .ft-stats{background:var(--accent);padding:1.2rem clamp(1.2rem,6vw,5rem);display:flex;align-items:center;justify-content:space-around;flex-wrap:wrap;gap:1.2rem}
  .ft-stat-num{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:900;color:var(--ink);line-height:1;letter-spacing:-.03em}
  .ft-stat-label{font-size:.67rem;font-weight:600;color:rgba(0,0,0,.55);text-transform:uppercase;letter-spacing:.1em;margin-top:2px;text-align:center}

  /* SECTIONS */
  .ft-section{padding:72px clamp(1.2rem,6vw,5rem)}
  .ft-section-alt{background:var(--bg2)}
  .ft-eyebrow{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:.9rem;display:flex;align-items:center;gap:8px}
  .ft-eyebrow::after{content:'';flex:0 0 28px;height:1px;background:var(--accent)}
  .ft-h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:900;line-height:1.12;letter-spacing:-.02em;color:var(--text);margin-bottom:.8rem}
  .ft-h2 em{font-style:italic;color:var(--accent)}
  .ft-section-sub{color:var(--text2);font-size:.97rem;line-height:1.72;font-weight:300;max-width:500px;margin-bottom:3rem}

  /* USP GRID */
  .ft-usp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:14px;overflow:hidden}
  @media(max-width:860px){.ft-usp-grid{grid-template-columns:1fr 1fr}}
  @media(max-width:540px){.ft-usp-grid{grid-template-columns:1fr}}
  .ft-usp-cell{background:var(--bg);padding:28px 24px;transition:background .25s;cursor:default}
  .ft-usp-cell:hover{background:var(--bg2)}
  .ft-usp-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:var(--accent);opacity:.2;line-height:1;margin-bottom:10px;letter-spacing:-.04em}
  .ft-usp-icon{font-size:1.5rem;margin-bottom:10px;display:block}
  .ft-usp-title{font-size:.94rem;font-weight:600;color:var(--text);margin-bottom:6px}
  .ft-usp-desc{font-size:.8rem;color:var(--text2);line-height:1.65;font-weight:300}

  /* HOW */
  .ft-how-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
  @media(max-width:800px){.ft-how-grid{grid-template-columns:1fr}}
  .ft-step-list{display:flex;flex-direction:column;margin-top:1.5rem}
  .ft-step{display:flex;gap:18px;padding:18px 0;border-bottom:1px solid var(--border);transition:padding-left .2s;cursor:default}
  .ft-step:hover{padding-left:6px}
  .ft-step:last-child{border-bottom:none}
  .ft-step-num{width:33px;height:33px;border-radius:50%;flex-shrink:0;border:1px solid var(--border2);background:var(--adim);display:flex;align-items:center;justify-content:center;font-size:.76rem;font-weight:700;color:var(--accent)}
  .ft-step-title{font-size:.92rem;font-weight:600;color:var(--text);margin-bottom:4px}
  .ft-step-desc{font-size:.8rem;color:var(--text2);line-height:1.62;font-weight:300}

  /* BUDGET CARD */
  .ft-budget-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;box-shadow:var(--shadow)}
  .ft-budget-title{font-size:.64rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--text2);margin-bottom:18px}
  .ft-bbar{margin-bottom:12px}
  .ft-bbar-meta{display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:5px}
  .ft-bbar-label{color:var(--text);font-weight:500}
  .ft-bbar-amt{color:var(--text2)}
  .ft-bbar-track{height:5px;background:var(--surface);border-radius:3px;overflow:hidden}
  .ft-bbar-fill{height:100%;border-radius:3px;transition:width 1.4s cubic-bezier(.34,1.1,.64,1)}
  .ft-ai-chip{margin-top:16px;background:var(--adim);border:1px solid var(--border2);border-radius:9px;padding:12px 14px;display:flex;gap:9px;align-items:flex-start}
  .ft-ai-label{font-size:.65rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px}
  .ft-ai-text{font-size:.77rem;color:var(--text2);line-height:1.55}

  /* TESTIMONIALS */
  .ft-testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:3rem}
  @media(max-width:800px){.ft-testi-grid{grid-template-columns:1fr}}
  .ft-testi-card{background:var(--surface);border:1px solid var(--border);border-radius:13px;padding:24px;transition:border-color .25s,transform .25s}
  .ft-testi-card:hover{border-color:var(--accent);transform:translateY(-4px)}
  .ft-stars{color:#FFD700;font-size:.7rem;margin-bottom:12px;letter-spacing:2px}
  .ft-testi-q{font-family:'Playfair Display',serif;font-size:.94rem;font-style:italic;line-height:1.7;color:var(--text);margin-bottom:18px}
  .ft-testi-author{font-size:.75rem;font-weight:600;color:var(--accent)}
  .ft-testi-role{font-size:.72rem;color:var(--text2)}

  /* CTA */
  .ft-cta{padding:64px clamp(1.2rem,6vw,5rem);text-align:center}
  .ft-cta-h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:900;color:var(--accent);margin-bottom:.8rem}
  .ft-cta p{color:rgba(14, 134, 80, 0.63);font-size:.97rem;margin:0 0 1.8rem}
  .ft-cta-btns{display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap;}
  .ft-btn-dark{padding:13px 32px;border-radius:8px;background:var(--accent);color:#fff;font-size:.93rem;font-weight:600;font-family:'Outfit',sans-serif;border:none;cursor:pointer;transition:all .2s}
  .ft-btn-dark:hover{opacity:.85;transform:translateY(-2px)}
  .ft-btn-ink-out{padding:13px 28px;border-radius:8px;background:var(--accent);color:#fff;font-size:.93rem;font-weight:500;font-family:'Outfit',sans-serif;border:2px solid rgba(0,0,0,.3);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;transition:all .2s}
  .ft-btn-ink-out:hover{transform:translateY(-2px)}

  /* FOOTER */
  .ft-footer{background:var(--card);border-top:1px solid var(--border);padding:2.5rem clamp(1.2rem,6vw,5rem) 1.5rem}
  .ft-footer-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:2rem;margin-bottom:2rem}
  .ft-footer-brand p{font-size:.8rem;color:var(--text2);margin-top:8px;max-width:220px;line-height:1.6;font-weight:300}
  .ft-footer-col h4{font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:12px}
  .ft-footer-col a{display:block;font-size:.8rem;color:var(--text2);text-decoration:none;margin-bottom:7px;transition:color .2s}
  .ft-footer-col a:hover{color:var(--text)}
  .ft-footer-bottom{border-top:1px solid var(--border);padding-top:1.2rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:.8rem;font-size:.74rem;color:var(--text2)}

  /* MODAL */
  .ft-overlay{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:1.5rem;animation:ft-fi .2s ease}
  @keyframes ft-fi{from{opacity:0}to{opacity:1}}
  .ft-modal{background:var(--bg2);border:1px solid var(--border2);border-radius:16px;padding:36px;max-width:400px;width:100%;position:relative;box-shadow:0 40px 80px rgba(0,0,0,.5);animation:ft-su .3s cubic-bezier(.34,1.2,.64,1)}
  @keyframes ft-su{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  .ft-modal-x{position:absolute;top:12px;right:12px;width:28px;height:28px;border-radius:6px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2);font-size:.85rem;transition:all .2s}
  .ft-modal-x:hover{color:var(--text)}
  .ft-modal h3{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:var(--text);margin-bottom:5px}
  .ft-modal-sub{font-size:.83rem;color:var(--text2);margin-bottom:20px;line-height:1.6}
  .ft-input{width:100%;padding:11px 13px;border-radius:8px;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:'Outfit',sans-serif;font-size:.88rem;outline:none;margin-bottom:9px;transition:border-color .2s}
  .ft-input:focus{border-color:var(--accent)}
  .ft-input::placeholder{color:var(--text2)}
  .ft-modal-btn{width:100%;padding:12px;border-radius:8px;background:var(--accent);color:var(--ink);font-weight:700;font-size:.93rem;border:none;cursor:pointer;font-family:'Outfit',sans-serif;margin-top:4px;transition:all .2s}
  .ft-modal-btn:hover{opacity:.88}
  .ft-success{text-align:center;padding:10px 0}
  .ft-success-icon{font-size:2.8rem;margin-bottom:12px}
  .ft-success h3{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--text);margin-bottom:7px}
  .ft-success p{font-size:.83rem;color:var(--text2);line-height:1.6}

  /* REVEAL */
  .ft-reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
  .ft-visible{opacity:1;transform:translateY(0)}
  /* ── EXTRA PREMIUM ANIMATIONS ── */

/* USP Hover Lift + Glow */
.ft-usp-cell {
  transition: all 0.3s ease;
}

.ft-usp-cell:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

/* Icon Glow */
.ft-usp-cell:hover .ft-usp-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px rgba(52, 211, 153, 0.6));
}

/* Smooth Icon Transition */
.ft-usp-icon {
  transition: transform 0.3s ease, filter 0.3s ease;
}

/* Section Slight Lift */
.ft-section {
  transition: transform 0.4s ease;
}

.ft-section:hover {
  transform: translateY(-2px);
}
  @media(max-width:580px){.ft-nav-links{display:none}}
`;

// ── Hooks ────────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("ft-visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useCounter(target) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = null;
      const tick = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return [v, ref];
}

// ── Sub-components ───────────────────────────────────────────────────────────
function BBar({ label, amt, budget, pct, color }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setW(pct); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);
  return (
    <div ref={ref} className="ft-bbar">
      <div className="ft-bbar-meta">
        <span className="ft-bbar-label">{label}</span>
        <span className="ft-bbar-amt">{amt} / {budget}</span>
      </div>
      <div className="ft-bbar-track">
        <div className="ft-bbar-fill" style={{ width: `${w}%`, background: color }} />
      </div>
    </div>
  );
}

function Counter({ target, suffix = "" }) {
  const [v, ref] = useCounter(target);
  return <span ref={ref}>{v}{suffix}</span>;
}

function Sparkline() {
  const pathRef = useRef(null);
  const areaRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();

    // Start hidden
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.transition = "none";

    // Force reflow, then animate
    path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)";
    path.style.strokeDashoffset = "0";

    // Fade in the area fill after a short delay
    const area = areaRef.current;
    if (area) {
      area.style.opacity = "0";
      area.style.transition = "opacity 0.8s ease 0.8s";
      setTimeout(() => { area.style.opacity = "1"; }, 50);
    }
  }, []); 

  return (
    <svg
      style={{ width: "100%", height: 70, marginBottom: 12 }}
      viewBox="0 0 380 70"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity=".25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill — fades in after line draws */ } 
      <path
        ref={areaRef}
        d="M0,60 C40,52 80,56 120,42 C160,28 200,14 240,16 C280,18 320,32 360,22 L380,18 L380,70 L0,70Z"
        fill="url(#sg)"
      />
      {/* Line — draws itself on load */ }
      <path
        ref={pathRef}
        d="M0,60 C40,52 80,56 120,42 C160,28 200,14 240,16 C280,18 320,32 360,22 L380,18"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
} 

function Modal({ onClose }) {
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  
}

// ── Data ─────────────────────────────────────────────────────────────────────
const usps = [
  { n: "01", icon: "📊", title: "Real-time Analytics", desc: "Live charts that update the moment you log a transaction.", },
  { n: "02", icon: "🤖", title: "AI-Powered Insights", desc: "Flags unusual spend and suggests budget shifts automatically." },
  { n: "03", icon: "🔐", title: "Secure by Design", desc: "JWT auth, role-based access, and encrypted data at rest." },
  { n: "04", icon: "📁", title: "Export Everything", desc: "One-click PDF and Excel exports for all your data." },
  { n: "05", icon: "🔔", title: "Smart Alerts", desc: "Budget warnings, unusual-spend flags, and savings milestones." },
  { n: "06", icon: "🗂️", title: "Multi-Account View", desc: "Savings, checking, and investments unified in one dashboard." },
];

const steps = [
  { n: "01", title: "Create your free account", desc: "Sign up in 30 seconds. Choose your currency, timezone, and goals." },
  { n: "02", title: "Log your transactions", desc: "Add income and expenses by category in seconds." },
  { n: "03", title: "Set budgets & milestones", desc: "Define category limits — FinTrack tracks and alerts you." },
  { n: "04", title: "Get AI recommendations", desc: "Personalised opportunities to save more, spend smarter." },
];

const budgets = [
  { label: "🍔 Food & Dining", amt: "₹4,200", budget: "₹6,000", pct: 70, color: "#34d399" },
  { label: "🚗 Transport", amt: "₹2,800", budget: "₹3,000", pct: 93, color: "#e67e22" },
  { label: "🎬 Entertainment", amt: "₹1,100", budget: "₹2,000", pct: 55, color: "#60a5fa" },
  { label: "🛒 Shopping", amt: "₹5,800", budget: "₹4,000", pct: 100, color: "#c0392b" },
];

const testimonials = [
  { q: "FinTrack changed how I see my money. The AI insight about my food spend literally saved me ₹3,000 last month.", author: "Priya S.", role: "Product Designer, Bengaluru" },
  { q: "Finally a finance app that doesn't look like it was built in 2009. The analytics are incredible — and it's free.", author: "Arjun M.", role: "Software Engineer, Pune" },
  { q: "I track three accounts in one place. The export feature is perfect for sending to my accountant.", author: "Sneha R.", role: "Freelance Consultant, Mumbai" },
];

const footerCols = [
  { h: "Product", links: ["Features", "How it Works", "User Stories", "Changelog"] },
  { h: "Company", links: ["About", "Contact", "GitHub", "Privacy Policy"] },
  { h: "Support", links: ["Documentation", "FAQs", "Community", "Report a Bug"] },
];

// ── Main Component ───────────────────────────────────────────────────────────
export default function FinTrack() {
  const [modal, setModal] = useState(false);
  const [dark, setDark] = useState(true);

  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(),
        r4 = useReveal(), r5 = useReveal(), r6 = useReveal();

  // Inject styles + set theme on body
  useEffect(() => {
    if (!document.getElementById("ft-styles")) {
      const s = document.createElement("style");
      s.id = "ft-styles";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const open = () => setModal(true);
  const close = () => setModal(false);

  return (
    <>
      {modal && <Modal onClose={close} />}

      {/* NAV */}
      <nav className="ft-nav">
        <span className="ft-logo">
          <div className="ft-logo-mark">📈</div>
          FinTrack
        </span>
        <ul className="ft-nav-links">
          {["features", "how", "stories", "contact"].map((id) => (
            <li key={id}><a href={`#${id}`}>{id.charAt(0).toUpperCase() + id.slice(1)}</a></li>
          ))}
        </ul>
        <div className="ft-nav-right">
          <button className="ft-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            <div className={`ft-thumb${dark ? "" : " moved"}`}>{dark ? "🌙" : "☀️"}</div>
          </button>
          <button className="ft-btn-ghost" > <Link to="/login">Login</Link></button>
          <button className="ft-btn-cta" ><Link to="/signup">  Get Started Free</Link></button>
        </div>
      </nav>

      {/* HERO */}
      <section className="ft-hero">
        <div>
          <div className="ft-eyebrow-sm">100% Free — Always</div>
          <h1 className="ft-h1">Take control of your<br /><em>finances.</em></h1>
          <p className="ft-hero-body">
            FinTrack gives you a 360° view of your money — budgets, transactions, AI-powered analytics,
            and intelligent predictions — in one beautifully simple dashboard.
          </p>
          <div className="ft-hero-actions">
            <button className="ft-btn-lg"><Link to="/signup"> Start Free Today →</Link></button>
            <a href="#features" className="ft-btn-out-lg">See Features</a>
          </div>
        </div>
        <div className="ft-hero-vis" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="ft-dash-card">
            <div className="ft-topbar">
              <div className="ft-dot" style={{ background: "#c0392b" }} />
              <div className="ft-dot" style={{ background: "#f39c12" }} />
              <div className="ft-dot" style={{ background: "#27ae60" }} />
              <span className="ft-url">fintrack.app / dashboard</span>
            </div>
            <div className="ft-kpi-row">
              <div className="ft-kpi">
                <div className="ft-kpi-label">Net Worth</div>
                <div className="ft-kpi-val">₹4.3L</div>
                <div className="ft-kpi-delta" style={{ color: "#27ae60" }}>▲ 8.2% this month</div>
              </div>
              <div className="ft-kpi">
                <div className="ft-kpi-label">Savings Rate</div>
                <div className="ft-kpi-val">36.4%</div>
                <div className="ft-kpi-delta" style={{ color: "var(--accent)" }}>▲ Target: 35%</div>
              </div>
            </div>
            <Sparkline />
            {[
              { cat: "Food", amt: "₹4,200", tag: "On Track", tc: "#27ae60", bc: "rgba(39,174,96,.12)" },
              { cat: "Shopping", amt: "₹5,800", tag: "Over Budget", tc: "#c0392b", bc: "rgba(192,57,43,.12)" },
              { cat: "Transport", amt: "₹2,800", tag: "Near Limit", tc: "#e67e22", bc: "rgba(230,126,34,.12)" },
            ].map((r) => (
              <div key={r.cat} className="ft-dash-row">
                <span style={{ color: "var(--text2)" }}>{r.cat}</span>
                <span style={{ fontWeight: 500 }}>{r.amt}</span>
                <span className="ft-tag" style={{ color: r.tc, background: r.bc }}>{r.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="ft-stats">
        {[
          { target: 22, suffix: "+", label: "API Endpoints" },
          { target: 8, suffix: "", label: "Core Modules" },
          { target: 100, suffix: "%", label: "Data Encrypted" },
        ].map((s) => (
          <div key={s.label}>
            <div className="ft-stat-num"><Counter target={s.target} suffix={s.suffix} /></div>
            <div className="ft-stat-label">{s.label}</div>
          </div>
        ))}
        <div>
          <div className="ft-stat-num">₹0</div>
          <div className="ft-stat-label">Cost to You</div>
        </div>
      </div>

      {/* FEATURES / USP */}
      <section id="features" className="ft-section">
        <div ref={r1} className="ft-reveal">
          <div className="ft-eyebrow">Why FinTrack</div>
          <h2 className="ft-h2">Built to make <em>money simple.</em></h2>
          <p className="ft-section-sub">Purpose-built tools for individuals who want clarity, not complexity.</p>
        </div>
        <div className="ft-usp-grid">
          {usps.map((u, i) => {
            const ref = useReveal();
            return (
              <div key={u.n} ref={ref} className="ft-usp-cell ft-reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="ft-usp-num">{u.n}</div>
                <span className="ft-usp-icon">{u.icon}</span>
                <div className="ft-usp-title">{u.title}</div>
                <div className="ft-usp-desc">{u.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="ft-section ft-section-alt">
        <div className="ft-how-grid">
          <div ref={r2} className="ft-reveal">
            <div className="ft-eyebrow">How it works</div>
            <h2 className="ft-h2">From chaos to <em>clarity.</em></h2>
            <p className="ft-section-sub">Four steps from signup to full financial picture.</p>
            <div className="ft-step-list">
              {steps.map((s) => (
                <div key={s.n} className="ft-step">
                  <div className="ft-step-num">{s.n}</div>
                  <div>
                    <div className="ft-step-title">{s.title}</div>
                    <div className="ft-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={r3} className="ft-reveal">
            <div className="ft-budget-card">
              <div className="ft-budget-title">Budget Overview — April 2026</div>
              {budgets.map((b) => <BBar key={b.label} {...b} />)}
              <div className="ft-ai-chip">
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>💡</span>
                <div>
                  <div className="ft-ai-label">AI Insight</div>
                  <div className="ft-ai-text">Shopping exceeded budget by ₹1,800. Shift ₹500 from Entertainment next month to stay on track.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="stories" className="ft-section">
        <div ref={r4} className="ft-reveal">
          <div className="ft-eyebrow">User Stories</div>
          <h2 className="ft-h2">What our users <em>say.</em></h2>
          <p className="ft-section-sub">Real people. Real results. No incentives for saying nice things.</p>
        </div>
        <div className="ft-testi-grid">
          {testimonials.map((t, i) => {
            const ref = useReveal();
            return (
              <div key={i} ref={ref} className="ft-testi-card ft-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="ft-stars">★★★★★</div>
                <div className="ft-testi-q">{t.q}</div>
                <div className="ft-testi-author">{t.author}</div>
                <div className="ft-testi-role">{t.role}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BANNER */}
      <div id="contact" className="ft-cta">
        <h2 className="ft-cta-h2">Your finances deserve clarity.</h2>
        <p>Join thousands who track smarter with FinTrack — free, forever.</p>
        <div className="ft-cta-btns">
          <button className="ft-btn-dark"> <Link to="/signup"> Start Free — No Card Needed</Link></button>
          <a href="#features" className="ft-btn-ink-out">Explore Features</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="ft-footer">
        <div className="ft-footer-top">
          <div className="ft-footer-brand">
            <span className="ft-logo" style={{ fontSize: "1.1rem" }}>
              <div className="ft-logo-mark" style={{ width: 26, height: 26, borderRadius: 6, fontSize: ".8rem" }}>📈</div>
              FinTrack
            </span>
            <p>Intelligent personal finance tracking. Built with the MERN stack. Always free.</p>
          </div>
          {footerCols.map((col) => (
            <div key={col.h} className="ft-footer-col">
              <h4>{col.h}</h4>
              {col.links.map((l) => <a key={l} href="#">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="ft-footer-bottom">
          <span>© 2026 FinTrack. Built with ♥ and the MERN stack.</span>
          <span>Privacy · Terms · Security</span>
        </div>
      </footer>
    </>
  );
}