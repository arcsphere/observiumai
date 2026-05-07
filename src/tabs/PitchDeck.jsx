import { useState, useEffect, useRef, useCallback } from "react";

const AUTO_PLAY_INTERVAL = 8000;

const Counter = ({ end, duration = 2000 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => { let s = 0; const step = end / (duration / 16); const id = setInterval(() => { s += step; if (s >= end) { setVal(end); clearInterval(id); } else setVal(Math.floor(s)); }, 16); return () => clearInterval(id); }, [end, duration]);
  return <span>{val.toLocaleString()}</span>;
};

const WBF = ({ size = "sm" }) => {
  const lg = size === "lg";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: lg ? 10 : 8, padding: lg ? "10px 18px" : "6px 14px", borderRadius: 8, background: "linear-gradient(135deg, #f59e0b12, #22c55e12)", border: "1px solid #f59e0b33" }}>
      <span style={{ fontSize: lg ? 22 : 15 }}>🌍</span>
      <div>
        <div style={{ fontSize: lg ? 13 : 11, fontWeight: 700, color: "#f59e0b" }}>World Biodiversity Forum 2026</div>
        <div style={{ fontSize: lg ? 11 : 9, color: "#94a3b8" }}>Davos, Switzerland — Oral Presentation</div>
      </div>
    </div>
  );
};

const Logo = ({ size = 32 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: size, height: size, borderRadius: 6, background: "linear-gradient(135deg, #22c55e, #3b82f6, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 900, color: "#fff" }}>O</div>
    <div>
      <div style={{ fontSize: size * 0.5, fontWeight: 800, color: "#e2e8f0", letterSpacing: "-0.02em" }}>OBSERVIUM<span style={{ color: "#a855f7" }}>·AI</span></div>
    </div>
  </div>
);

const SLIDES = [
  // 0: Title
  { bg: "linear-gradient(135deg, #0a0e1a 0%, #1a0a2e 50%, #0a1a2e 100%)",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ opacity: a?1:0, transition: "opacity 0.8s ease 0.2s", marginBottom: 20 }}><Logo size={40} /></div>
        <div style={{ fontSize: 13, letterSpacing: "0.2em", color: "#64748b", marginBottom: 16, opacity: a?1:0, transition: "opacity 0.8s ease 0.3s" }}>NORTHEASTERN UNIVERSITY • SUSTAINABILITY WEEK 2026</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 14, opacity: a?1:0, transition: "opacity 0.8s ease 0.5s", background: "linear-gradient(135deg, #22c55e, #3b82f6, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          What If Every Ecosystem<br />Had an Early Warning System?
        </h1>
        <div style={{ fontSize: 16, color: "#94a3b8", maxWidth: 600, lineHeight: 1.6, opacity: a?1:0, transition: "opacity 0.8s ease 0.9s" }}>
          An AI-enabled transdisciplinary observability framework<br />for biodiversity and human-environment systems
        </div>
        <div style={{ marginTop: 24, opacity: a?1:0, transition: "opacity 0.8s ease 1.2s" }}><WBF size="lg" /></div>
        <div style={{ marginTop: 16, fontSize: 12, color: "#475569", opacity: a?1:0, transition: "opacity 0.8s ease 1.5s" }}>Arjun Shrivatsan, Northeastern University &nbsp;•&nbsp; C. Dinesh Kumar, RV University</div>
      </div>
    ),
  },

  // 1: Big Four Snakes
  { bg: "linear-gradient(135deg, #0a0e1a, #1a0a0a)",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "30px 40px" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.15em", color: "#ef4444", marginBottom: 8, opacity: a?1:0, transition: "opacity 0.6s ease 0.2s" }}>INDIA'S SILENT CRISIS</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#e2e8f0", marginBottom: 6, opacity: a?1:0, transition: "opacity 0.8s ease 0.4s" }}>The Big Four</div>
        <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 28, opacity: a?1:0, transition: "opacity 0.8s ease 0.7s" }}>
          Four species responsible for the vast majority of snakebite deaths in India
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, maxWidth: 800 }}>
          {[
            { name: "Indian Cobra", scientific: "Naja naja", img: "/snake-cobra.jpg", color: "#ef4444", stat: "Most recognizable", delay: 0.8 },
            { name: "Common Krait", scientific: "Bungarus caeruleus", img: "/snake-krait.jpg", color: "#3b82f6", stat: "Bites while sleeping", delay: 1.1 },
            { name: "Russell's Viper", scientific: "Daboia russelii", img: "/snake-russells-viper.jpg", color: "#f59e0b", stat: "Most bite deaths", delay: 1.4 },
            { name: "Saw-scaled Viper", scientific: "Echis carinatus", img: "/snake-saw-scaled-viper.jpg", color: "#a855f7", stat: "Most aggressive", delay: 1.7 },
          ].map(s => (
            <div key={s.name} style={{
              borderRadius: 12, overflow: "hidden", background: "#111827",
              border: `1px solid ${s.color}33`,
              opacity: a ? 1 : 0,
              transform: a ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
              transition: `all 0.7s ease ${s.delay}s`,
            }}>
              <div style={{
                width: "100%", height: 180, overflow: "hidden",
                background: `${s.color}11`,
                position: "relative",
              }}>
                <img
                  src={s.img}
                  alt={s.name}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    filter: "brightness(0.85) contrast(1.1)",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px">🐍</div>`;
                  }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                  background: `linear-gradient(transparent, #111827)`,
                }} />
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.name}</div>
                <div style={{ fontSize: 9, color: "#64748b", fontStyle: "italic", marginTop: 1 }}>{s.scientific}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4, fontWeight: 600 }}>{s.stat}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, fontSize: 15, color: "#94a3b8", opacity: a?1:0, transition: "opacity 0.8s ease 2.4s", lineHeight: 1.6, maxWidth: 650 }}>
          Together they cause over <span style={{ color: "#ef4444", fontWeight: 700 }}>90% of snakebite fatalities</span> in India.
          <br />Most victims are rural farmers and agricultural workers.
        </div>
      </div>
    ),
  },

  // 2: 58,000
  { bg: "#0a0e1a",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 110, fontWeight: 800, fontFamily: "monospace", color: "#ef4444", opacity: a?1:0, transition: "opacity 0.6s ease 0.3s", textShadow: "0 0 60px rgba(239,68,68,0.3)" }}>{a && <Counter end={58000} duration={2500} />}</div>
        <div style={{ fontSize: 22, color: "#e2e8f0", fontWeight: 600, marginTop: 8, opacity: a?1:0, transition: "opacity 0.8s ease 1s" }}>people die from snakebite in India every year</div>
        <div style={{ fontSize: 15, color: "#94a3b8", marginTop: 20, maxWidth: 600, lineHeight: 1.7, opacity: a?1:0, transition: "opacity 0.8s ease 1.5s" }}>1.2 million deaths in two decades. Over a quarter are children under 15.<br />Most die at home, in rural areas, never reaching a hospital.</div>
        <div style={{ marginTop: 28, fontSize: 11, color: "#475569", opacity: a?1:0, transition: "opacity 0.8s ease 2s", fontStyle: "italic" }}>Indian Million Death Study — 611,483 verbal autopsies, 2001–2014 • eLife, 2020</div>
      </div>
    ),
  },

  // 2: Reporting Gap
  { bg: "#0a0e1a",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 15, letterSpacing: "0.1em", color: "#f59e0b", marginBottom: 24, opacity: a?1:0, transition: "opacity 0.6s ease 0.2s" }}>THE REPORTING GAP</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 48, marginBottom: 28 }}>
          <div style={{ textAlign: "center", opacity: a?1:0, transition: "opacity 0.8s ease 0.5s" }}>
            <div style={{ width: 120, background: "linear-gradient(180deg, #ef4444, #dc2626)", borderRadius: "8px 8px 0 0", height: a?260:0, transition: "height 1.5s ease 0.8s", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 16 }}><span style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>58K</span></div>
            <div style={{ fontSize: 12, color: "#e2e8f0", marginTop: 8, fontWeight: 600 }}>Actual Deaths</div>
            <div style={{ fontSize: 9, color: "#64748b" }}>Million Death Study</div>
          </div>
          <div style={{ textAlign: "center", opacity: a?1:0, transition: "opacity 0.8s ease 0.8s" }}>
            <div style={{ width: 120, background: "linear-gradient(180deg, #334155, #1e293b)", borderRadius: "8px 8px 0 0", height: a?38:0, transition: "height 1.5s ease 1.2s", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 18, fontWeight: 800, color: "#94a3b8", fontFamily: "monospace" }}>~6K</span></div>
            <div style={{ fontSize: 12, color: "#e2e8f0", marginTop: 8, fontWeight: 600 }}>Officially Reported</div>
            <div style={{ fontSize: 9, color: "#64748b" }}>Government hospitals</div>
          </div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#f59e0b", opacity: a?1:0, transition: "opacity 0.8s ease 2s" }}>90% of deaths are invisible to the system</div>
      </div>
    ),
  },

  // 3: 5 Domains
  { bg: "linear-gradient(135deg, #0a0e1a, #0a1a1a)",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 15, letterSpacing: "0.1em", color: "#22c55e", marginBottom: 20, opacity: a?1:0, transition: "opacity 0.6s ease 0.2s" }}>SNAKEBITE IS NOT A SNAKE PROBLEM</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, maxWidth: 700, marginBottom: 28, opacity: a?1:0, transition: "opacity 0.8s ease 0.5s" }}>A single bite is a signal that crosses<br />5 domains simultaneously</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", maxWidth: 700 }}>
          {[{ d: "Health", s: "Bite treatment, anti-venom supply", c: "#ef4444", t: 0.8 }, { d: "Ecology", s: "Species displacement, habitat stress", c: "#22c55e", t: 1.0 }, { d: "Agriculture", s: "Crop cycles, irrigation, rodent surges", c: "#f59e0b", t: 1.2 }, { d: "Climate", s: "Drought, temperature anomalies", c: "#3b82f6", t: 1.4 }, { d: "Infrastructure", s: "Construction, habitat fragmentation", c: "#6b7280", t: 1.6 }].map(x => (
            <div key={x.d} style={{ padding: "12px 18px", borderRadius: 10, background: `${x.c}12`, border: `1px solid ${x.c}44`, minWidth: 170, textAlign: "left", opacity: a?1:0, transition: `all 0.6s ease ${x.t}s`, transform: a?"translateY(0)":"translateY(20px)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: x.c }}>{x.d}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{x.s}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 15, color: "#94a3b8", marginTop: 24, opacity: a?1:0, transition: "opacity 0.8s ease 2.2s", lineHeight: 1.6 }}>
          No single agency sees the full picture. <span style={{ color: "#e2e8f0", fontWeight: 600 }}>The data exists. It just doesn't connect.</span>
        </div>
      </div>
    ),
  },

  // 4: FRAMEWORK — What it is
  { bg: "linear-gradient(135deg, #0a0e1a, #1a0a2e)",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "30px 40px" }}>
        <div style={{ opacity: a?1:0, transition: "opacity 0.6s ease 0.2s", marginBottom: 8 }}><Logo size={28} /></div>
        <div style={{ fontSize: 13, letterSpacing: "0.15em", color: "#a855f7", marginBottom: 8, opacity: a?1:0, transition: "opacity 0.6s ease 0.3s" }}>THE FRAMEWORK</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#e2e8f0", marginBottom: 6, opacity: a?1:0, transition: "opacity 0.8s ease 0.5s" }}>What is OBSERVIUM·AI?</div>
        <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24, opacity: a?1:0, transition: "opacity 0.8s ease 0.8s", maxWidth: 650, lineHeight: 1.6 }}>
          A generic, configurable incident observability protocol grounded in systems thinking — treating frontline observations as part of broader ecological feedback loops.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 700, textAlign: "left" }}>
          {[
            { icon: "🔭", title: "Observability, not just monitoring", desc: "Inspired by software observability (OpenTelemetry) — adapted for ecosystems where data is messy, multimodal, and collected under duress.", c: "#3b82f6", t: 1.0 },
            { icon: "🧩", title: "Transdisciplinary by design", desc: "Crosses health, ecology, agriculture, climate, and infrastructure. No single domain owns the signal — the framework connects them.", c: "#22c55e", t: 1.2 },
            { icon: "📡", title: "Frontline-first capture", desc: "Voice, image, video, sensor, text, social media. No rigid forms. A farmer's distress call and an IoT sensor carry equal architectural weight.", c: "#f59e0b", t: 1.4 },
            { icon: "⚖️", title: "Honest about uncertainty", desc: "Every signal carries quality tags, confidence gauges, gap flags, and tension markers. The framework doesn't pretend data is clean — it shows what's missing.", c: "#ef4444", t: 1.6 },
          ].map(x => (
            <div key={x.title} style={{ padding: "14px 16px", background: "#111827", borderRadius: 8, borderLeft: `3px solid ${x.c}`, opacity: a?1:0, transition: `opacity 0.6s ease ${x.t}s` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{x.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: x.c }}>{x.title}</span>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{x.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 5: ARCHITECTURE — How it's built
  { bg: "#0a0e1a",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "30px 40px" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.15em", color: "#ec4899", marginBottom: 8, opacity: a?1:0, transition: "opacity 0.6s ease 0.2s" }}>THE ARCHITECTURE</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#e2e8f0", marginBottom: 20, opacity: a?1:0, transition: "opacity 0.8s ease 0.4s" }}>An 8-Stage Signal Pipeline</div>

        {/* Pipeline */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
          {[
            { icon: "📡", l: "Capture", c: "#f59e0b", s: "Multimodal intake" },
            { icon: "🧹", l: "Cleanse", c: "#6b7280", s: "Quality + dedup" },
            { icon: "👁️", l: "Observe", c: "#3b82f6", s: "Multi-scale context" },
            { icon: "🔗", l: "Pattern", c: "#a855f7", s: "Cross-domain binding" },
            { icon: "⚗️", l: "Compound", c: "#ec4899", s: "Cross-scale convergence" },
            { icon: "💡", l: "Insight", c: "#22c55e", s: "Actionable intelligence" },
            { icon: "🏛️", l: "Route", c: "#f43f5e", s: "5-layer stakeholder" },
            { icon: "⚖️", l: "Decision", c: "#facc15", s: "Outcome + accountability" },
          ].map((p, i) => (
            <div key={p.l} style={{ display: "flex", alignItems: "center", gap: 3, opacity: a?1:0, transition: `opacity 0.3s ease ${0.6+i*0.1}s` }}>
              <div style={{ padding: "6px 10px", borderRadius: 6, background: `${p.c}15`, border: `1px solid ${p.c}33`, textAlign: "center", minWidth: 80 }}>
                <div style={{ fontSize: 16 }}>{p.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: p.c }}>{p.l}</div>
                <div style={{ fontSize: 7, color: "#475569" }}>{p.s}</div>
              </div>
              {i < 7 && <span style={{ color: "#334155", fontSize: 12 }}>→</span>}
            </div>
          ))}
        </div>

        {/* Three architectural pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, maxWidth: 720 }}>
          {[
            { title: "5 Information Tiers", items: ["📍 Local (village/site)", "🏘️ Zonal (taluk/block)", "🗺️ District", "🌍 Regional / State", "🏛️ Institutional (cross-agency)"], c: "#3b82f6", t: 1.6 },
            { title: "5 Routing Layers", items: ["🔒 Hardcoded (statutory)", "📋 Regulatory (compliance)", "⚙️ Configurable (org-defined)", "🤝 Informal (trust networks)", "📡 Broadcast (public)"], c: "#f43f5e", t: 1.8 },
            { title: "5 Redundancy Levels", items: ["Capture redundancy", "Transmission redundancy", "Processing redundancy", "Routing redundancy", "Intelligence redundancy"], c: "#22c55e", t: 2.0 },
          ].map(x => (
            <div key={x.title} style={{ padding: "12px 14px", background: "#111827", borderRadius: 8, textAlign: "left", opacity: a?1:0, transition: `opacity 0.6s ease ${x.t}s` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: x.c, marginBottom: 8 }}>{x.title}</div>
              {x.items.map((it, i) => <div key={i} style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, lineHeight: 1.4 }}>{it}</div>)}
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 6: METHOD & PROTOCOL — How it works
  { bg: "linear-gradient(135deg, #0a0e1a, #0a1a1a)",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "30px 40px" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.15em", color: "#22c55e", marginBottom: 8, opacity: a?1:0, transition: "opacity 0.6s ease 0.2s" }}>METHOD & PROTOCOL</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#e2e8f0", marginBottom: 20, opacity: a?1:0, transition: "opacity 0.8s ease 0.4s" }}>How Signals Compose Into Intelligence</div>

        {/* Composition rules */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, maxWidth: 750 }}>
          {[
            { label: "Observation", rule: "Corroboration across sources", example: "Farmer's bite + ASHA worker's cobra photo → confirmed encounter", c: "#3b82f6", icon: "👁️", t: 0.7 },
            { label: "Pattern", rule: "Cross-domain binding", example: "Bite cluster + displacement + health system strain → conflict escalation", c: "#a855f7", icon: "🔗", t: 1.0 },
            { label: "Compound", rule: "Cross-scale convergence", example: "Conflict pattern + drought forcing → compound ecological-health signal", c: "#ec4899", icon: "⚗️", t: 1.3 },
          ].map(x => (
            <div key={x.label} style={{ flex: 1, padding: "14px", background: "#111827", borderRadius: 8, borderTop: `3px solid ${x.c}`, textAlign: "left", opacity: a?1:0, transition: `opacity 0.6s ease ${x.t}s` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{x.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: x.c }}>{x.label}</span>
              </div>
              <div style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 600, marginBottom: 6 }}>{x.rule}</div>
              <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5, fontStyle: "italic" }}>{x.example}</div>
            </div>
          ))}
        </div>

        {/* Key protocol features */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, maxWidth: 750 }}>
          {[
            { label: "Risk Window Mode", desc: "Dynamic monitoring activation with configurable triggers, duration, scope, and guest authority access", icon: "🔴", t: 1.6 },
            { label: "ILK Integration", desc: "Indigenous & Local Knowledge as flagged, toggle-able modality with retrospective reclassification", icon: "🌿", t: 1.8 },
            { label: "De-duplication Ladder", desc: "Different dedup logic at every pipeline level — linking, not deleting", icon: "🪜", t: 2.0 },
            { label: "Accountability Loop", desc: "Actions taken or not taken are recorded. Non-response becomes visible.", icon: "📋", t: 2.2 },
          ].map(x => (
            <div key={x.label} style={{ padding: "10px 12px", background: "#0f172a", borderRadius: 6, border: "1px solid #1e293b", textAlign: "left", opacity: a?1:0, transition: `opacity 0.5s ease ${x.t}s` }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{x.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", marginBottom: 3 }}>{x.label}</div>
              <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.4 }}>{x.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 7: Adapter Framework (histogram towers)
  { bg: "linear-gradient(135deg, #0a0e1a, #0a1a2e)",
    render: (a) => {
      const domains = [
        { label: "Human-Wildlife\nConflict", c: "#ef4444", h: 85, ex: ["Snakebite clusters", "Crop raids", "Predator spillovers"], icon: "🐍" },
        { label: "Water\nSecurity", c: "#3b82f6", h: 75, ex: ["Contamination signals", "Drought cascades", "Canal failures"], icon: "💧" },
        { label: "Agricultural\nResilience", c: "#f59e0b", h: 80, ex: ["Crop stress anomalies", "Pest surges", "Soil degradation"], icon: "🌾" },
        { label: "Urban\nEcology", c: "#a855f7", h: 70, ex: ["Species displacement", "Green cover loss", "Heat islands"], icon: "🏙️" },
        { label: "Disaster Early\nWarning", c: "#ec4899", h: 90, ex: ["Flood precursors", "Landslide signals", "Fire risk chains"], icon: "⚠️" },
        { label: "Public Health\nSurveillance", c: "#22c55e", h: 78, ex: ["Disease vectors", "Environmental health", "Zoonotic bridges"], icon: "🏥" },
      ];
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "30px 40px" }}>
          <div style={{ fontSize: 14, letterSpacing: "0.1em", color: "#ec4899", marginBottom: 10, opacity: a?1:0, transition: "opacity 0.6s ease 0.2s" }}>AN ADAPTER FRAMEWORK</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#e2e8f0", marginBottom: 4, opacity: a?1:0, transition: "opacity 0.8s ease 0.4s" }}>One protocol. Many domains.</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, opacity: a?1:0, transition: "opacity 0.8s ease 0.7s", maxWidth: 580 }}>
            Transdisciplinary isn't optional — it's the only way to see compound signals single-domain systems miss.
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 16, height: 240 }}>
            {domains.map((d, i) => (
              <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 105, opacity: a?1:0, transition: `opacity 0.5s ease ${0.8+i*0.2}s` }}>
                <div style={{ width: "100%", height: a?(d.h/100)*210:0, transition: `height 1.2s ease ${1+i*0.15}s`, background: `linear-gradient(180deg, ${d.c}, ${d.c}88)`, borderRadius: "8px 8px 0 0", padding: "8px 5px", overflow: "hidden" }}>
                  <span style={{ fontSize: 20 }}>{d.icon}</span>
                  {d.ex.map((e, j) => <div key={j} style={{ fontSize: 7, color: "#fff", opacity: 0.85, marginBottom: 1 }}>• {e}</div>)}
                </div>
                <div style={{ fontSize: 8, fontWeight: 600, color: d.c, marginTop: 5, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.2 }}>{d.label}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 20px", borderRadius: 8, background: "#111827", border: "1px solid #1e293b", opacity: a?1:0, transition: "opacity 0.8s ease 2.5s", maxWidth: 620 }}>
            <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.6 }}>The framework is <span style={{ color: "#ec4899", fontWeight: 700 }}>configurable</span> — same architecture, different adapters. Snakebite today. Water security tomorrow. <span style={{ color: "#22c55e", fontWeight: 700 }}>The domain plugs in.</span></div>
          </div>
        </div>
      );
    },
  },

  // 8: Demo Scenario
  { bg: "#0a0e1a",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 14, letterSpacing: "0.1em", color: "#ec4899", marginBottom: 10, opacity: a?1:0, transition: "opacity 0.6s ease 0.2s" }}>LIVE DEMO — RAMANAGARA, KARNATAKA</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#e2e8f0", marginBottom: 18, opacity: a?1:0, transition: "opacity 0.8s ease 0.4s" }}>10 incidents. 6 modalities. 5 domains.<br /><span style={{ color: "#ec4899" }}>One compound signal no agency can see alone.</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, maxWidth: 660, textAlign: "left" }}>
          {[
            { icon: "🎙️", text: "Farmer bitten by cobra — calls in Kannada", t: 0.7 },
            { icon: "📷", text: "ASHA health worker photographs cobra near canal", t: 0.9 },
            { icon: "📡", text: "IoT sensors detect soil moisture collapse", t: 1.1 },
            { icon: "🎙️", text: "PHC nurse: 2nd bite, 3 anti-venom vials left", t: 1.3 },
            { icon: "🎥", text: "Anonymous video: highway blasting near wetland", t: 1.5 },
            { icon: "📷", text: "Camera trap: daytime rat snake — atypical", t: 1.7 },
            { icon: "📱", text: "Social: 'Third snake in our village this week'", t: 1.9 },
            { icon: "📡", text: "IMD: 23 days no rain, +2.3°C anomaly", t: 2.1 },
          ].map((x, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", background: "#111827", borderRadius: 5, opacity: a?1:0, transition: `opacity 0.5s ease ${x.t}s` }}>
              <span style={{ fontSize: 15 }}>{x.icon}</span><span style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.3 }}>{x.text}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, fontSize: 13, color: "#f59e0b", fontWeight: 600, opacity: a?1:0, transition: "opacity 0.8s ease 2.8s" }}>Ask me to show you the live demo →</div>
      </div>
    ),
  },

  // 9: CTA
  { bg: "linear-gradient(135deg, #0a0e1a, #1a0a0a)",
    render: (a) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ opacity: a?1:0, transition: "opacity 0.6s ease 0.2s", marginBottom: 16 }}><Logo size={36} /></div>
        <div style={{ fontSize: 38, fontWeight: 800, color: "#e2e8f0", lineHeight: 1.2, maxWidth: 700, opacity: a?1:0, transition: "opacity 0.8s ease 0.4s" }}>The data to save lives<br /><span style={{ color: "#ef4444" }}>already exists.</span></div>
        <div style={{ fontSize: 17, color: "#94a3b8", marginTop: 14, maxWidth: 600, lineHeight: 1.6, opacity: a?1:0, transition: "opacity 0.8s ease 0.9s" }}>It's trapped in silos — health, ecology, agriculture, climate, infrastructure — systems never designed to talk to each other.</div>
        <div style={{ fontSize: 22, color: "#22c55e", fontWeight: 700, marginTop: 24, opacity: a?1:0, transition: "opacity 0.8s ease 1.3s" }}>OBSERVIUM·AI connects them.</div>
        <div style={{ marginTop: 24, opacity: a?1:0, transition: "opacity 0.8s ease 1.6s" }}><WBF size="lg" /></div>
        <div style={{ marginTop: 20, display: "flex", gap: 14, opacity: a?1:0, transition: "opacity 0.8s ease 1.9s" }}>
          <div style={{ padding: "10px 20px", borderRadius: 8, background: "#22c55e22", border: "1px solid #22c55e44", color: "#22c55e", fontSize: 13, fontWeight: 600 }}>🖥️ See the Live Demo</div>
          <div style={{ padding: "10px 20px", borderRadius: 8, background: "#3b82f622", border: "1px solid #3b82f644", color: "#3b82f6", fontSize: 13, fontWeight: 600 }}>📄 WBF 2026 Paper</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 12, color: "#475569", opacity: a?1:0, transition: "opacity 0.8s ease 2.2s" }}>
          Arjun Shrivatsan &nbsp;•&nbsp; gurumurthy.ar@northeastern.edu &nbsp;•&nbsp; C. Dinesh Kumar, RV University
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

  const goTo = useCallback((n) => { setAnim(false); setTimeout(() => { setSlide(n); setTimeout(() => setAnim(true), 50); }, 100); }, []);
  const next = useCallback(() => goTo((slide + 1) % SLIDES.length), [slide, goTo]);
  const prev = useCallback(() => goTo((slide - 1 + SLIDES.length) % SLIDES.length), [slide, goTo]);

  useEffect(() => { if (autoPlay) timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL); return () => clearInterval(timerRef.current); }, [autoPlay, next]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setAutoPlay(false); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setAutoPlay(false); prev(); }
      if (e.key === "a") setAutoPlay(p => !p);
      if (e.key === "Escape" && onExit) onExit();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev, onExit]);

  return (
    <div style={{ background: "#0a0e1a", width: "100vw", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: "#e2e8f0", position: "relative", overflow: "hidden", cursor: "none" }}
      onClick={(e) => { const x = e.clientX / window.innerWidth; setAutoPlay(false); if (x < 0.3) prev(); else next(); }}>
      <div style={{ position: "absolute", inset: 0, background: SLIDES[slide].bg, transition: "background 0.8s ease" }}>{SLIDES[slide].render(anim)}</div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(transparent, rgba(0,0,0,0.6))", cursor: "default" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", gap: 4 }}>{SLIDES.map((_, i) => <div key={i} onClick={() => { setAutoPlay(false); goTo(i); }} style={{ width: slide===i?20:7, height: 7, borderRadius: 4, background: slide===i?"#e2e8f0":"#334155", cursor: "pointer", transition: "all 0.3s" }} />)}</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#475569", fontFamily: "monospace" }}>{slide+1}/{SLIDES.length}</span>
          <button onClick={() => setAutoPlay(!autoPlay)} style={{ padding: "3px 9px", borderRadius: 4, border: `1px solid ${autoPlay?"#22c55e":"#334155"}`, background: autoPlay?"#22c55e18":"transparent", color: autoPlay?"#22c55e":"#64748b", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>{autoPlay?"● AUTO":"○ MANUAL"}</button>
          <button onClick={prev} style={{ padding: "3px 7px", borderRadius: 4, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>←</button>
          <button onClick={next} style={{ padding: "3px 7px", borderRadius: 4, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>→</button>
        </div>
      </div>

      <div style={{ position: "absolute", top: 12, right: 14, display: "flex", alignItems: "center", gap: 10, fontSize: 9, color: "#334155", cursor: "default" }} onClick={e => e.stopPropagation()}>
        <span>← prev | next → | [A] auto</span>
        {onExit && <button onClick={onExit} style={{ padding: "3px 9px", borderRadius: 4, border: "1px solid #334155", background: "#111827", color: "#94a3b8", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>✕ Exit to Demo</button>}
      </div>

      {autoPlay && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3 }}><div style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7)", animation: `prog ${AUTO_PLAY_INTERVAL}ms linear` }} key={slide} /></div>}
      <style>{`@keyframes prog { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}
