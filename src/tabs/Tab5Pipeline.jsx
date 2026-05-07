import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
// ✏️ CONFIGURE PIPELINE STAGES HERE
// ═══════════════════════════════════════════════
const PIPELINE_STAGES = [
  { key: "capture", label: "Capture", subtitle: "Frontline Adapters", icon: "📡", color: "#f59e0b",
    description: "Multimodal field intake: voice, image, video, sensor, text, social media. Raw signals from farmers, ASHA workers, truck drivers, IoT grids, camera traps, social posts.",
    techNote: "On-device inference, language understanding, lightweight image models. No rigid forms — spoken and visual reports transformed into structured fields.",
  },
  { key: "cleanse", label: "Cleanse", subtitle: "Quality & De-duplication", icon: "🧹", color: "#6b7280",
    description: "Raw signals assessed for quality, duplicates identified, conflicting reports flagged. Not cleaned silently — quality tags travel with the data forever.",
    techNote: "De-duplication ladder operates at every level: capture, transmission, processing, routing, intelligence. Each has its own logic.",
  },
  { key: "observe", label: "Observe", subtitle: "Multi-Scale Observation", icon: "👁️", color: "#3b82f6",
    description: "Cleansed signals contextualized at appropriate geographic and institutional scales: local, zonal, district, regional. Same data, different meaning at each tier.",
    techNote: "Observations carry tier tags, institutional provenance, and quality inheritance from source incidents.",
  },
  { key: "pattern", label: "Pattern", subtitle: "Cross-Domain Detection", icon: "🔗", color: "#a855f7",
    description: "Observations from multiple domains and scales tested against binding rules. Temporal windows, spatial radii, domain diversity thresholds. Patterns emerge — or don't.",
    techNote: "Pattern formation is rule-bound, not arbitrary. Each pattern carries its binding criteria, tensions, and explicit gaps.",
  },
  { key: "compound", label: "Compound", subtitle: "Cross-Scale Convergence", icon: "⚗️", color: "#ec4899",
    description: "Patterns from different scales and institutions converge. The compound signal exists at no single tier and in no single agency. Requires cross-scale, cross-institutional reading.",
    techNote: "5km radius, 72-hour window, 2+ domain types, systemic factor catalysts. Binding rules are configurable per deployment.",
  },
  { key: "insight", label: "Insight", subtitle: "Actionable Intelligence", icon: "💡", color: "#22c55e",
    description: "Compound signals interpreted against four authority requirements: actionable intelligence, bureaucratic circumvention pathways, early warning velocity, outcome accountability.",
    techNote: "Insights carry recommendations with timelines, urgency, confidence basis, and explicit uncertainty statements.",
  },
  { key: "route", label: "Route", subtitle: "Stakeholder Topology", icon: "🏛️", color: "#f43f5e",
    description: "Five-layer routing: Hardcoded (statutory), Regulatory (compliance), Configurable (org-designed), Informal (trust networks), Broadcast (public). Each stakeholder gets role-appropriate information packages.",
    techNote: "Routing tracks delivery status, response windows, and accountability. The gap between 'should know' and 'does know' is the framework's core diagnostic.",
  },
  { key: "decision", label: "Decision", subtitle: "Outcome & Accountability", icon: "⚖️", color: "#facc15",
    description: "Actions taken (or not taken) are recorded. Accountability loops close — or remain open. The framework doesn't compel response, but it makes non-response visible.",
    techNote: "Outcome tracking enables retrospective analysis: which signals were acted on, which were ignored, and what happened as a result.",
  },
];

// ✏️ CONFIGURE REDUNDANCY LAYERS
const REDUNDANCY = [
  { key: "capture", label: "Capture Redundancy", color: "#f59e0b", description: "Multiple modalities for same event. If voice fails, image persists. If sensor offline, human report fills gap.", examples: ["Voice + Image for cobra sighting", "Sensor + Manual report for soil moisture", "Camera trap + Social media for displacement"] },
  { key: "transmission", label: "Transmission Redundancy", color: "#6b7280", description: "Offline-first capture, store-and-forward, multiple relay paths. Low-connectivity environments don't lose data.", examples: ["On-device storage when offline", "SMS fallback for voice reports", "WhatsApp relay for video"] },
  { key: "processing", label: "Processing Redundancy", color: "#3b82f6", description: "Edge inference + cloud processing. If cloud unreachable, edge models provide initial classification.", examples: ["On-device species classification", "Local language processing", "Offline confidence scoring"] },
  { key: "routing", label: "Routing Redundancy", color: "#a855f7", description: "Formal + informal channels. If institutional route is blocked, informal network activates. Hardcoded routes cannot be disabled.", examples: ["PHC stock alert + district health escalation", "Forest Dept. formal + snake rescue WhatsApp", "Government channel + media as fallback"] },
  { key: "intelligence", label: "Intelligence Redundancy", color: "#22c55e", description: "Multiple analytical pathways to same insight. If one pattern pathway fails, alternative composition routes exist.", examples: ["Health-first pathway: bite → stock → system stress", "Ecology-first pathway: displacement → habitat → forcing", "Climate-first pathway: drought → soil → cascade"] },
];

// ✏️ CONFIGURE DE-DUPLICATION LADDER
const DEDUP_LADDER = [
  { level: "Capture", rule: "Same observer, same event, <5 min → merge", color: "#f59e0b", example: "Ramesh calls twice about same bite → single incident" },
  { level: "Transmission", rule: "Same payload hash, different relay paths → deduplicate", color: "#6b7280", example: "WhatsApp + SMS relay of same video → one transmission" },
  { level: "Processing", rule: "Same entity extracted from different modalities → link, don't duplicate", color: "#3b82f6", example: "Voice mention of cobra + image of cobra → linked, not doubled" },
  { level: "Routing", rule: "Same stakeholder, same signal, different trigger paths → single notification with combined context", color: "#a855f7", example: "DFO receives camera trap alert + displacement pattern → one briefing" },
  { level: "Intelligence", rule: "Same insight reached via different analytical paths → strengthen confidence, don't duplicate insight", color: "#22c55e", example: "Health-first and ecology-first both reach displacement hypothesis → confidence boost" },
];

// ── LIVE FLOW DATA ──
const FLOW_EVENTS = [
  { id: "F01", label: "Farmer voice: cobra bite", icon: "🎙️", domain: "health", startStage: 0, quality: "moderate" },
  { id: "F02", label: "ASHA worker: cobra image", icon: "📷", domain: "ecology", startStage: 0, quality: "high" },
  { id: "F03", label: "Truck driver: snake on road", icon: "🎙️", domain: "ecology", startStage: 0, quality: "low" },
  { id: "F04", label: "IoT sensor: soil moisture crash", icon: "📡", domain: "agriculture", startStage: 0, quality: "high" },
  { id: "F05", label: "Social: 3rd snake this week", icon: "📱", domain: "ecology", startStage: 0, quality: "unverified" },
  { id: "F06", label: "PHC nurse: anti-venom critical", icon: "🎙️", domain: "health", startStage: 0, quality: "high" },
  { id: "F07", label: "Construction blast video", icon: "🎥", domain: "infrastructure", startStage: 0, quality: "moderate" },
  { id: "F08", label: "Camera trap: daytime rat snake", icon: "📷", domain: "ecology", startStage: 0, quality: "high" },
  { id: "F09", label: "Crop damage: rodent surge", icon: "📝", domain: "agriculture", startStage: 0, quality: "high" },
  { id: "F10", label: "IMD: 23-day drought", icon: "📡", domain: "climate", startStage: 0, quality: "high" },
];

const DOMAIN_COLORS = { health: "#ef4444", ecology: "#22c55e", agriculture: "#f59e0b", climate: "#3b82f6", infrastructure: "#6b7280" };
const Q_COLORS = { high: "#22c55e", moderate: "#f59e0b", low: "#ef4444", unverified: "#64748b" };

export default function PipelineOverview() {
  const [activeStage, setActiveStage] = useState(null);
  const [flowPositions, setFlowPositions] = useState({});
  const [isFlowing, setIsFlowing] = useState(false);
  const [viewMode, setViewMode] = useState("pipeline");
  const [mergeEvents, setMergeEvents] = useState([]);
  const timer = useRef(null);
  const mergeTimer = useRef(null);

  const startFlow = useCallback(() => {
    setIsFlowing(true);
    setFlowPositions({});
    setMergeEvents([]);
    const positions = {};
    FLOW_EVENTS.forEach(e => { positions[e.id] = -1; });
    let tick = 0;

    clearInterval(timer.current);
    timer.current = setInterval(() => {
      tick++;
      const newPositions = { ...positions };
      let anyActive = false;

      FLOW_EVENTS.forEach((e, i) => {
        const delay = i * 3;
        const currentTick = tick - delay;
        if (currentTick >= 0 && currentTick <= PIPELINE_STAGES.length) {
          newPositions[e.id] = Math.min(currentTick, PIPELINE_STAGES.length - 1);
          anyActive = true;
        }
        positions[e.id] = newPositions[e.id];
      });

      setFlowPositions({ ...newPositions });
      setActiveStage(PIPELINE_STAGES[Math.min(Math.floor(tick / 3), PIPELINE_STAGES.length - 1)]?.key || null);

      // Merge events at pattern stage
      if (tick === 18) setMergeEvents(["F01+F02 → Confirmed Cobra Encounter"]);
      if (tick === 21) setMergeEvents(prev => [...prev, "F03+F05+F08 → Displacement Cluster"]);
      if (tick === 24) setMergeEvents(prev => [...prev, "F04+F10 → Drought Stress Field"]);
      if (tick === 27) setMergeEvents(prev => [...prev, "COMPOUND: 5-domain convergence"]);

      if (!anyActive && tick > FLOW_EVENTS.length * 3 + PIPELINE_STAGES.length + 5) {
        clearInterval(timer.current);
        setIsFlowing(false);
      }
    }, 400);
  }, []);

  useEffect(() => () => { clearInterval(timer.current); clearInterval(mergeTimer.current); }, []);

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>PIPELINE OVERVIEW</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>END-TO-END SIGNAL FLOW — REDUNDANCY — DE-DUPLICATION</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["pipeline", "redundancy", "dedup"].map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{
              padding: "5px 12px", borderRadius: 5, border: `1px solid ${viewMode === m ? "#60a5fa" : "#1e293b"}`,
              background: viewMode === m ? "#60a5fa15" : "transparent", color: viewMode === m ? "#60a5fa" : "#64748b",
              fontSize: 11, cursor: "pointer", textTransform: "uppercase",
            }}>{m === "dedup" ? "De-Duplication" : m}</button>
          ))}
          <button onClick={startFlow} disabled={isFlowing} style={{
            padding: "5px 14px", borderRadius: 5, border: "1px solid #22c55e", background: isFlowing ? "#14532d22" : "transparent",
            color: "#22c55e", fontSize: 11, cursor: isFlowing ? "default" : "pointer", opacity: isFlowing ? 0.6 : 1, marginLeft: 8,
          }}>{isFlowing ? "⏳ FLOWING..." : "▶ ANIMATE FLOW"}</button>
        </div>
      </div>

      {/* ── PIPELINE VIEW ── */}
      {viewMode === "pipeline" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {/* Stage Headers */}
          <div style={{ display: "flex", padding: "12px 16px", gap: 4, borderBottom: "1px solid #1e293b", position: "sticky", top: 0, background: "#0a0e1a", zIndex: 2 }}>
            {PIPELINE_STAGES.map((s, i) => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div onClick={() => setActiveStage(activeStage === s.key ? null : s.key)}
                  style={{
                    flex: 1, padding: "8px 6px", borderRadius: 6, cursor: "pointer", textAlign: "center",
                    background: activeStage === s.key ? `${s.color}15` : "#0f172a",
                    border: `1px solid ${activeStage === s.key ? s.color : "#1e293b"}`,
                    transition: "all 0.3s",
                  }}>
                  <div style={{ fontSize: 16 }}>{s.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 8, color: "#475569" }}>{s.subtitle}</div>
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <svg width="16" height="12" style={{ flexShrink: 0 }}>
                    <path d="M2 6 L12 6 M9 3 L12 6 L9 9" stroke="#334155" strokeWidth={1} fill="none" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Flow Visualization */}
          <div style={{ padding: "16px", flex: 1 }}>
            {/* Animated signal rows */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.05em", marginBottom: 10 }}>SIGNAL FLOW — {isFlowing ? "ACTIVE" : "READY"}</div>
              {FLOW_EVENTS.map(e => {
                const pos = flowPositions[e.id] ?? -1;
                return (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", marginBottom: 4, height: 28 }}>
                    <div style={{ width: 180, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 12 }}>{e.icon}</span>
                      <span style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.label}</span>
                    </div>
                    <div style={{ flex: 1, display: "flex", gap: 2, alignItems: "center" }}>
                      {PIPELINE_STAGES.map((s, i) => (
                        <div key={s.key} style={{
                          flex: 1, height: 6, borderRadius: 3, position: "relative",
                          background: pos >= i ? `${s.color}` : "#1e293b",
                          transition: "background 0.4s ease",
                          boxShadow: pos === i ? `0 0 8px ${s.color}66` : "none",
                        }}>
                          {pos === i && (
                            <div style={{
                              position: "absolute", right: -3, top: -3, width: 12, height: 12,
                              borderRadius: "50%", background: s.color, border: "2px solid #0a0e1a",
                              boxShadow: `0 0 8px ${s.color}`,
                              animation: "dotPulse 0.8s ease-in-out infinite alternate",
                            }} />
                          )}
                        </div>
                      ))}
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: Q_COLORS[e.quality], flexShrink: 0, marginLeft: 4 }} title={e.quality} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Merge events */}
            {mergeEvents.length > 0 && (
              <div style={{ marginBottom: 20, padding: 14, background: "#111827", borderRadius: 8, border: "1px solid #a855f733" }}>
                <div style={{ fontSize: 10, color: "#a855f7", letterSpacing: "0.05em", marginBottom: 8 }}>🔗 COMPOSITION EVENTS</div>
                {mergeEvents.map((m, i) => (
                  <div key={i} style={{
                    fontSize: 12, color: "#e2e8f0", padding: "6px 12px", marginBottom: 4,
                    background: "#0f172a", borderRadius: 5, borderLeft: `3px solid ${i < 3 ? "#a855f7" : "#ec4899"}`,
                    animation: "mergeIn 0.5s ease-out",
                  }}>
                    {m}
                  </div>
                ))}
              </div>
            )}

            {/* Stage Detail */}
            {activeStage && (() => {
              const s = PIPELINE_STAGES.find(p => p.key === activeStage);
              return (
                <div style={{ padding: 16, background: "#111827", borderRadius: 8, border: `1px solid ${s.color}33` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>— {s.subtitle}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 10 }}>{s.description}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, padding: "8px 12px", background: "#0a0e1a", borderRadius: 5, borderLeft: `3px solid ${s.color}44`, fontFamily: "monospace" }}>
                    {s.techNote}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── REDUNDANCY VIEW ── */}
      {viewMode === "redundancy" && (
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.05em", marginBottom: 16 }}>
            FIVE-LEVEL REDUNDANCY ARCHITECTURE — IF ONE PATH FAILS, ANOTHER EXISTS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {REDUNDANCY.map((r, i) => (
              <div key={r.key} style={{ background: "#111827", borderRadius: 8, border: `1px solid ${r.color}22`, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  {/* Level indicator */}
                  <div style={{ width: 6, background: r.color, flexShrink: 0 }} />
                  <div style={{ padding: 16, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: r.color, letterSpacing: "0.02em" }}>LEVEL {i + 1}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{r.label}</span>
                      </div>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${r.color}15`, border: `2px solid ${r.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14">
                          <path d="M2 7 L6 7 L6 2 L8 2 L8 7 L12 7 L7 12 Z" fill={r.color} opacity={0.8} />
                          <path d="M2 7 L6 7 L6 2 L8 2 L8 7 L12 7 L7 12 Z" fill="none" stroke={r.color} strokeWidth={0.5} />
                        </svg>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 12 }}>{r.description}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {r.examples.map((ex, j) => (
                        <div key={j} style={{ fontSize: 11, color: "#94a3b8", padding: "5px 10px", background: "#0a0e1a", borderRadius: 4, borderLeft: `2px solid ${r.color}44` }}>
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Connection line to next */}
                {i < REDUNDANCY.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "0" }}>
                    <div style={{ width: 2, height: 8, background: "#1e293b" }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Redundancy philosophy */}
          <div style={{ marginTop: 20, padding: 16, background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em", marginBottom: 6 }}>DESIGN PRINCIPLE</div>
            <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.6 }}>
              Every level has at least one backup pathway. The framework assumes failure at every stage — network drops, sensors die, institutions don't respond, formal channels are blocked. Redundancy isn't an add-on; it's the architecture's response to the reality that field conditions are harsh, connectivity is unreliable, and institutional response is uncertain.
            </div>
          </div>
        </div>
      )}

      {/* ── DE-DUPLICATION VIEW ── */}
      {viewMode === "dedup" && (
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.05em", marginBottom: 16 }}>
            DE-DUPLICATION LADDER — DIFFERENT LOGIC AT EVERY LEVEL
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {DEDUP_LADDER.map((d, i) => (
              <div key={d.level}>
                <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
                  {/* Left: Level */}
                  <div style={{ width: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%", background: `${d.color}15`, border: `2px solid ${d.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: d.color,
                    }}>L{i + 1}</div>
                    <div style={{ fontSize: 10, color: d.color, fontWeight: 600, marginTop: 4 }}>{d.level}</div>
                  </div>

                  {/* Right: Rule + Example */}
                  <div style={{ flex: 1, padding: 16, background: "#111827", borderRadius: 8, border: `1px solid ${d.color}22` }}>
                    <div style={{ fontSize: 10, color: d.color, letterSpacing: "0.04em", marginBottom: 4, fontWeight: 600 }}>RULE</div>
                    <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.5, marginBottom: 10, fontFamily: "monospace" }}>{d.rule}</div>
                    <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.04em", marginBottom: 4 }}>EXAMPLE</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, padding: "6px 10px", background: "#0a0e1a", borderRadius: 4, borderLeft: `2px solid ${d.color}44` }}>{d.example}</div>
                  </div>
                </div>
                {/* Connector */}
                {i < DEDUP_LADDER.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", marginLeft: 58 }}>
                    <div style={{ width: 2, height: 20, background: "#1e293b", marginLeft: 1 }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Philosophy */}
          <div style={{ marginTop: 20, padding: 16, background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em", marginBottom: 6 }}>DESIGN PRINCIPLE</div>
            <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.6 }}>
              De-duplication is not deletion. When two signals refer to the same event, they are linked, not discarded. The second report strengthens confidence and adds modality diversity. At higher levels, duplicate analytical pathways reaching the same insight increase confidence rather than creating noise. The ladder ensures that at every stage, the system knows the difference between "two reports about one thing" and "two separate things."
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dotPulse { from { transform: scale(1); opacity: 1; } to { transform: scale(1.4); opacity: 0.6; } }
        @keyframes mergeIn { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>
    </div>
  );
}
