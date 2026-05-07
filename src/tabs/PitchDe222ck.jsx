import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
// ✏️ CONFIGURE AUTO-PLAY SPEED (ms per slide)
// ═══════════════════════════════════════════════
const AUTO_PLAY_INTERVAL = 8000;
// ═══════════════════════════════════════════════

// ✏️ REPLACE THESE WITH YOUR DOWNLOADED IMAGE PATHS
// For local build: put images in public/ folder and reference as "/image.jpg"
// For artifact demo: using placeholder gradients
const IMG_PLACEHOLDER_1 = null; // e.g. "/snakebite-field.jpg"
const IMG_PLACEHOLDER_2 = null; // e.g. "/rural-india.jpg"

const Counter = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    ref.current = id;
    return () => clearInterval(id);
  }, [end, duration]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
};

const SLIDES = [
  // SLIDE 0: Title
  {
    bg: "linear-gradient(135deg, #0a0e1a 0%, #1a0a2e 50%, #0a1a2e 100%)",
    render: (anim) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 14, letterSpacing: "0.2em", color: "#64748b", marginBottom: 20, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}>
          NORTHEASTERN UNIVERSITY • SUSTAINABILITY WEEK 2026
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.4s", background: "linear-gradient(135deg, #22c55e, #3b82f6, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          What If Every Ecosystem<br />Had an Early Warning System?
        </h1>
        <div style={{ fontSize: 18, color: "#94a3b8", maxWidth: 600, lineHeight: 1.6, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.8s" }}>
          An AI-enabled observability framework for biodiversity<br />and human-environment systems
        </div>
        <div style={{ marginTop: 32, fontSize: 13, color: "#475569", opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.2s" }}>
          Arjun Shrivatsan, Northeastern University &nbsp;•&nbsp; C. Dinesh Kumar, RV University
        </div>
      </div>
    ),
  },

  // SLIDE 1: The Number
  {
    bg: "#0a0e1a",
    render: (anim) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 120, fontWeight: 800, fontFamily: "monospace", color: "#ef4444", opacity: anim ? 1 : 0, transition: "opacity 0.6s ease 0.3s", textShadow: "0 0 60px rgba(239,68,68,0.3)" }}>
          {anim && <Counter end={58000} duration={2500} />}
        </div>
        <div style={{ fontSize: 24, color: "#e2e8f0", fontWeight: 600, marginTop: 8, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1s" }}>
          people die from snakebite in India every year
        </div>
        <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 24, maxWidth: 600, lineHeight: 1.7, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.5s" }}>
          1.2 million deaths in two decades. Over a quarter are children under 15.<br />
          Most die at home, in rural areas, during monsoon season.
        </div>
        <div style={{ marginTop: 32, fontSize: 12, color: "#475569", opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 2s", fontStyle: "italic" }}>
          Indian Million Death Study, 611,483 verbal autopsies, 2001–2014 &nbsp;•&nbsp; eLife, 2020
        </div>
      </div>
    ),
  },

  // SLIDE 2: The Underreporting Gap
  {
    bg: "#0a0e1a",
    render: (anim) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 16, letterSpacing: "0.1em", color: "#f59e0b", marginBottom: 24, opacity: anim ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
          THE REPORTING GAP
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 48, marginBottom: 32 }}>
          <div style={{ textAlign: "center", opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }}>
            <div style={{ width: 120, background: "linear-gradient(180deg, #ef4444, #dc2626)", borderRadius: "8px 8px 0 0", height: anim ? 280 : 0, transition: "height 1.5s ease 0.8s", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>58K</span>
            </div>
            <div style={{ fontSize: 13, color: "#e2e8f0", marginTop: 8, fontWeight: 600 }}>Actual Deaths</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>Million Death Study</div>
          </div>
          <div style={{ textAlign: "center", opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.8s" }}>
            <div style={{ width: 120, background: "linear-gradient(180deg, #334155, #1e293b)", borderRadius: "8px 8px 0 0", height: anim ? 40 : 0, transition: "height 1.5s ease 1.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#94a3b8", fontFamily: "monospace" }}>~6K</span>
            </div>
            <div style={{ fontSize: 13, color: "#e2e8f0", marginTop: 8, fontWeight: 600 }}>Officially Reported</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>Government hospitals</div>
          </div>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#f59e0b", opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 2s" }}>
          90% of deaths are invisible to the system
        </div>
        <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 12, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 2.5s" }}>
          Most victims never reach a hospital. Official data captures 1 in 10 deaths.
        </div>
      </div>
    ),
  },

  // SLIDE 3: It's Not Just Snakebite
  {
    bg: "linear-gradient(135deg, #0a0e1a, #0a1a1a)",
    render: (anim) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 16, letterSpacing: "0.1em", color: "#22c55e", marginBottom: 24, opacity: anim ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
          SNAKEBITE IS NOT A SNAKE PROBLEM
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, maxWidth: 700, marginBottom: 32, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }}>
          A single bite is a signal that crosses<br />5 domains simultaneously
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 700 }}>
          {[
            { domain: "Health", detail: "Bite treatment, anti-venom supply", color: "#ef4444", delay: 0.8 },
            { domain: "Ecology", detail: "Species displacement, habitat stress", color: "#22c55e", delay: 1.0 },
            { domain: "Agriculture", detail: "Crop cycles, irrigation, rodent surges", color: "#f59e0b", delay: 1.2 },
            { domain: "Climate", detail: "Drought, temperature anomalies", color: "#3b82f6", delay: 1.4 },
            { domain: "Infrastructure", detail: "Construction, habitat fragmentation", color: "#6b7280", delay: 1.6 },
          ].map(d => (
            <div key={d.domain} style={{
              padding: "14px 20px", borderRadius: 10, background: `${d.color}12`,
              border: `1px solid ${d.color}44`, minWidth: 180, textAlign: "left",
              opacity: anim ? 1 : 0, transition: `opacity 0.6s ease ${d.delay}s, transform 0.6s ease ${d.delay}s`,
              transform: anim ? "translateY(0)" : "translateY(20px)",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: d.color }}>{d.domain}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{d.detail}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 28, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 2.2s", maxWidth: 600, lineHeight: 1.6 }}>
          No single agency sees the full picture.<br />
          <span style={{ color: "#e2e8f0", fontWeight: 600 }}>The data exists. It just doesn't connect.</span>
        </div>
      </div>
    ),
  },

  // SLIDE 4: The Framework
  {
    bg: "linear-gradient(135deg, #0a0e1a, #1a0a2e)",
    render: (anim) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 16, letterSpacing: "0.1em", color: "#a855f7", marginBottom: 16, opacity: anim ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
          OUR SOLUTION
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#e2e8f0", marginBottom: 8, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.4s" }}>
          A Transdisciplinary Observability Framework
        </div>
        <div style={{ fontSize: 15, color: "#94a3b8", marginBottom: 32, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.7s" }}>
          Capture → Cleanse → Observe → Pattern → Compound → Insight → Route → Decision
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
          {[
            { icon: "📡", label: "Capture", color: "#f59e0b" },
            { icon: "🧹", label: "Cleanse", color: "#6b7280" },
            { icon: "👁️", label: "Observe", color: "#3b82f6" },
            { icon: "🔗", label: "Pattern", color: "#a855f7" },
            { icon: "⚗️", label: "Compound", color: "#ec4899" },
            { icon: "💡", label: "Insight", color: "#22c55e" },
            { icon: "🏛️", label: "Route", color: "#f43f5e" },
            { icon: "⚖️", label: "Decision", color: "#facc15" },
          ].map((s, i) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              opacity: anim ? 1 : 0, transition: `opacity 0.4s ease ${0.8 + i * 0.15}s`,
            }}>
              <div style={{ padding: "8px 14px", borderRadius: 8, background: `${s.color}15`, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
              </div>
              {i < 7 && <span style={{ color: "#334155", fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, maxWidth: 600 }}>
          {[
            { n: "6", l: "Input Modalities", s: "voice, image, video, sensor, text, social" },
            { n: "5", l: "Information Tiers", s: "local → zonal → district → regional → institutional" },
            { n: "5", l: "Routing Layers", s: "statutory → regulatory → configurable → informal → public" },
          ].map((m, i) => (
            <div key={m.l} style={{
              padding: 14, background: "#111827", borderRadius: 8, textAlign: "center",
              opacity: anim ? 1 : 0, transition: `opacity 0.6s ease ${2 + i * 0.2}s`,
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#e2e8f0", fontFamily: "monospace" }}>{m.n}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{m.l}</div>
              <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>{m.s}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // SLIDE 5: The Demo Scenario
  {
    bg: "#0a0e1a",
    render: (anim) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 16, letterSpacing: "0.1em", color: "#ec4899", marginBottom: 16, opacity: anim ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
          LIVE DEMO — RAMANAGARA, KARNATAKA
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#e2e8f0", marginBottom: 24, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.4s" }}>
          10 field incidents. 6 modalities. 5 domains.<br />
          <span style={{ color: "#ec4899" }}>One compound signal no agency can see alone.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 700, textAlign: "left" }}>
          {[
            { icon: "🎙️", text: "Farmer bitten by cobra — calls in Kannada from neighbor's phone", delay: 0.7 },
            { icon: "📷", text: "ASHA health worker photographs cobra near canal", delay: 0.9 },
            { icon: "📡", text: "IoT sensors detect soil moisture collapse, canal dry", delay: 1.1 },
            { icon: "🎙️", text: "PHC nurse reports 2nd bite this week, 3 anti-venom vials left", delay: 1.3 },
            { icon: "🎥", text: "Anonymous video: highway blasting near wetland buffer", delay: 1.5 },
            { icon: "📷", text: "Camera trap catches daytime rat snake — atypical behavior", delay: 1.7 },
            { icon: "📱", text: "Social media: 'Third snake in our village this week'", delay: 1.9 },
            { icon: "📡", text: "IMD weather station: 23 days no rain, +2.3°C anomaly", delay: 2.1 },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "center", padding: "8px 12px",
              background: "#111827", borderRadius: 6,
              opacity: anim ? 1 : 0, transition: `opacity 0.5s ease ${item.delay}s`,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.4 }}>{item.text}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, fontSize: 14, color: "#f59e0b", fontWeight: 600, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 2.8s" }}>
          Ask me to show you the live demo →
        </div>
      </div>
    ),
  },

  // SLIDE 6: The Gap / CTA
  {
    bg: "linear-gradient(135deg, #0a0e1a, #1a0a0a)",
    render: (anim) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 42, fontWeight: 800, color: "#e2e8f0", lineHeight: 1.2, maxWidth: 700, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}>
          The data to save lives<br />
          <span style={{ color: "#ef4444" }}>already exists.</span>
        </div>
        <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 16, maxWidth: 600, lineHeight: 1.6, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.8s" }}>
          It's trapped in silos — health, ecology, agriculture, climate, infrastructure — systems that were never designed to talk to each other.
        </div>
        <div style={{ fontSize: 24, color: "#22c55e", fontWeight: 700, marginTop: 32, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.3s" }}>
          We're building the protocol that connects them.
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 24, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.8s" }}>
          <div style={{ padding: "12px 24px", borderRadius: 8, background: "#22c55e22", border: "1px solid #22c55e44", color: "#22c55e", fontSize: 14, fontWeight: 600 }}>
            🖥️ See the Live Demo
          </div>
          <div style={{ padding: "12px 24px", borderRadius: 8, background: "#3b82f622", border: "1px solid #3b82f644", color: "#3b82f6", fontSize: 14, fontWeight: 600 }}>
            📄 Read the Paper (WBF 2026)
          </div>
        </div>
        <div style={{ marginTop: 32, fontSize: 12, color: "#475569", opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 2.2s" }}>
          Arjun Shrivatsan &nbsp;•&nbsp; arjun@northeastern.edu &nbsp;•&nbsp; WBF 2026
        </div>
      </div>
    ),
  },
];

export default function PitchDeck({ onExit }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef(null);

  const goTo = useCallback((n) => {
    setAnim(false);
    setTimeout(() => {
      setSlide(n);
      setTimeout(() => setAnim(true), 50);
    }, 100);
  }, []);

  const next = useCallback(() => goTo((slide + 1) % SLIDES.length), [slide, goTo]);
  const prev = useCallback(() => goTo((slide - 1 + SLIDES.length) % SLIDES.length), [slide, goTo]);

  // Auto-play
  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    }
    return () => clearInterval(timerRef.current);
  }, [autoPlay, next]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setAutoPlay(false); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setAutoPlay(false); prev(); }
      if (e.key === "a") setAutoPlay(p => !p);
      if (e.key === "Escape" && onExit) onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  return (
    <div style={{
      background: "#0a0e1a", width: "100vw", height: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif", color: "#e2e8f0",
      position: "relative", overflow: "hidden", cursor: "none",
    }}
      onClick={(e) => {
        // Click left 30% = prev, right 70% = next
        const x = e.clientX / window.innerWidth;
        setAutoPlay(false);
        if (x < 0.3) prev(); else next();
      }}
    >
      {/* Slide Content */}
      <div style={{
        position: "absolute", inset: 0,
        background: SLIDES[slide].bg,
        transition: "background 0.8s ease",
      }}>
        {SLIDES[slide].render(anim)}
      </div>

      {/* Bottom Bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
        cursor: "default",
      }}
        onClick={e => e.stopPropagation()}
      >
        {/* Slide dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => { setAutoPlay(false); goTo(i); }}
              style={{
                width: slide === i ? 24 : 8, height: 8,
                borderRadius: 4,
                background: slide === i ? "#e2e8f0" : "#334155",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
            {slide + 1}/{SLIDES.length}
          </span>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            style={{
              padding: "4px 12px", borderRadius: 4,
              border: `1px solid ${autoPlay ? "#22c55e" : "#334155"}`,
              background: autoPlay ? "#22c55e18" : "transparent",
              color: autoPlay ? "#22c55e" : "#64748b",
              fontSize: 10, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {autoPlay ? "● AUTO" : "○ MANUAL"}
          </button>

          <button
            onClick={prev}
            style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
          >
            ←
          </button>
          <button
            onClick={next}
            style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
          >
            →
          </button>
        </div>
      </div>

      {/* Skip indicator (top right) */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        display: "flex", alignItems: "center", gap: 12,
        fontSize: 10, color: "#334155",
        cursor: "default",
      }}
        onClick={e => e.stopPropagation()}
      >
        <span>← prev &nbsp;|&nbsp; next → &nbsp;|&nbsp; [A] auto</span>
        {onExit && (
          <button
            onClick={onExit}
            style={{
              padding: "4px 10px", borderRadius: 4,
              border: "1px solid #334155", background: "#111827",
              color: "#94a3b8", fontSize: 10, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ✕ Exit to Demo
          </button>
        )}
      </div>

      {/* Auto-play progress bar */}
      {autoPlay && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3 }}>
          <div style={{
            height: "100%", background: "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7)",
            animation: `progressBar ${AUTO_PLAY_INTERVAL}ms linear`,
            transformOrigin: "left",
          }} key={slide} />
        </div>
      )}

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
