import { useState, useEffect, useRef, useCallback } from "react";
import { LAYERS, SOURCE_INSIGHT, STAKEHOLDERS, STATUS_STYLES } from "../stakeholders.js";

const DOMAIN_COLORS = { health: "#ef4444", ecology: "#22c55e", agriculture: "#f59e0b", climate: "#3b82f6", infrastructure: "#6b7280", governance: "#a855f7" };

const URGENCY_COLORS = { IMMEDIATE: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#64748b" };

const Gauge = ({ value, color, size = 36 }) => {
  const r = size / 2 - 3, cx = size / 2, cy = size / 2;
  const angle = value * 270 - 135;
  const xy = (a) => ({ x: cx + r * Math.cos((a - 90) * Math.PI / 180), y: cy + r * Math.sin((a - 90) * Math.PI / 180) });
  const s = xy(-135), e = xy(angle);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={`M ${xy(-135).x} ${xy(-135).y} A ${r} ${r} 0 1 1 ${xy(135).x} ${xy(135).y}`} fill="none" stroke="#1e293b" strokeWidth={2} strokeLinecap="round" />
      {value > 0.01 && <path d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${(angle+135)>180?1:0} 1 ${e.x} ${e.y}`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />}
      <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize={size*0.28} fontWeight="700" fontFamily="monospace">{(value*100).toFixed(0)}%</text>
    </svg>
  );
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.unaware;
  return <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: s.bg, color: s.color, border: `1px solid ${s.color}33`, fontWeight: 600, letterSpacing: "0.03em" }}>{s.label}</span>;
};

export default function StakeholderRouting() {
  const [activeLayer, setActiveLayer] = useState("all");
  const [selected, setSelected] = useState(null);
  const [routeAnim, setRouteAnim] = useState(new Set());
  const [autoPlaying, setAutoPlaying] = useState(false);
  const timer = useRef(null);

  const filtered = activeLayer === "all" ? STAKEHOLDERS : STAKEHOLDERS.filter(s => s.layer === activeLayer);

  const fireRoute = (sh) => {
    setRouteAnim(prev => new Set([...prev, sh.id]));
    setSelected(sh);
    setTimeout(() => setRouteAnim(prev => { const n = new Set(prev); n.delete(sh.id); return n; }), 2000);
  };

  const autoPlay = () => {
    setAutoPlaying(true); setActiveLayer("all");
    let i = 0;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (i < STAKEHOLDERS.length) {
        fireRoute(STAKEHOLDERS[i]);
        i++;
      } else { clearInterval(timer.current); setAutoPlaying(false); }
    }, 1200);
  };

  useEffect(() => () => clearInterval(timer.current), []);

  // Stats
  const byStatus = {};
  STAKEHOLDERS.forEach(s => { const k = STATUS_STYLES[s.status]?.label || "?"; byStatus[k] = (byStatus[k] || 0) + 1; });
  const layerCounts = {};
  LAYERS.forEach(l => { layerCounts[l.key] = STAKEHOLDERS.filter(s => s.layer === l.key).length; });

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>STAKEHOLDER ROUTING</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>FIVE-LAYER TOPOLOGY — WHO NEEDS TO KNOW, AND DO THEY?</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={autoPlay} disabled={autoPlaying} style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid #ec4899", background: autoPlaying ? "#1a1020" : "transparent",
            color: "#ec4899", fontSize: 11, cursor: autoPlaying ? "default" : "pointer", opacity: autoPlaying ? 0.5 : 1,
          }}>{autoPlaying ? "⏳ ROUTING..." : "▶ FIRE ALL ROUTES"}</button>
        </div>
      </div>

      {/* Source Signal */}
      <div style={{ padding: "10px 24px", borderBottom: "1px solid #1e293b", background: "#0f172a", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 10, color: "#64748b" }}>ROUTING FROM</span>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#22c55e", fontWeight: 700 }}>{SOURCE_INSIGHT.id}</span>
        <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{SOURCE_INSIGHT.label}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
          {SOURCE_INSIGHT.domains.map(d => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: DOMAIN_COLORS[d] }} />)}
        </div>
        <Gauge value={SOURCE_INSIGHT.confidence} color="#22c55e" size={30} />
      </div>

      {/* Layer Selector */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 24px", borderBottom: "1px solid #1e293b", gap: 6, overflowX: "auto" }}>
        <button onClick={() => setActiveLayer("all")} style={{
          padding: "4px 12px", borderRadius: 4, border: `1px solid ${activeLayer === "all" ? "#94a3b8" : "#1e293b"}`,
          background: activeLayer === "all" ? "#94a3b815" : "transparent", color: activeLayer === "all" ? "#e2e8f0" : "#64748b",
          fontSize: 11, cursor: "pointer",
        }}>All Layers ({STAKEHOLDERS.length})</button>
        {LAYERS.map(l => (
          <button key={l.key} onClick={() => setActiveLayer(l.key)} style={{
            padding: "4px 12px", borderRadius: 4, border: `1px solid ${activeLayer === l.key ? l.color : "#1e293b"}`,
            background: activeLayer === l.key ? `${l.color}15` : "transparent", color: activeLayer === l.key ? l.color : "#64748b",
            fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
          }}>
            <span>{l.icon}</span>{l.label}<span style={{ fontSize: 9, opacity: 0.6 }}>({layerCounts[l.key]})</span>
          </button>
        ))}
      </div>

      {/* Status Summary */}
      <div style={{ display: "flex", gap: 1, background: "#1e293b" }}>
        {Object.entries(STATUS_STYLES).filter(([k]) => byStatus[STATUS_STYLES[k]?.label]).map(([k, v]) => {
          const count = byStatus[v.label];
          if (!count) return null;
          return (
            <div key={k} style={{ flex: 1, padding: "8px 12px", background: "#0f172a", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.05em" }}>{v.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: v.color, fontFamily: "monospace" }}>{count}</div>
            </div>
          );
        }).filter(Boolean)}
      </div>

      {/* Main */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left: Stakeholder List */}
        <div style={{ width: 420, borderRight: "1px solid #1e293b", overflow: "auto", padding: "8px 0" }}>
          {(activeLayer === "all" ? LAYERS : LAYERS.filter(l => l.key === activeLayer)).map(layer => {
            const layerStakeholders = filtered.filter(s => s.layer === layer.key);
            if (layerStakeholders.length === 0) return null;
            return (
              <div key={layer.key}>
                <div style={{ padding: "10px 14px 4px", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{layer.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: layer.color, letterSpacing: "0.02em" }}>{layer.label.toUpperCase()}</span>
                  <span style={{ fontSize: 9, color: "#475569" }}>— {layer.subtitle}</span>
                </div>
                {layerStakeholders.map(sh => (
                  <div key={sh.id} onClick={() => { setSelected(sh); fireRoute(sh); }}
                    style={{
                      padding: "9px 14px", cursor: "pointer",
                      borderLeft: `3px solid ${selected?.id === sh.id ? layer.color : "transparent"}`,
                      background: selected?.id === sh.id ? `${layer.color}08` : routeAnim.has(sh.id) ? `${layer.color}06` : "transparent",
                      transition: "all 0.3s", borderBottom: "1px solid #1e293b08",
                      animation: routeAnim.has(sh.id) ? "routePulse 0.6s ease-out" : "none",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{sh.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <StatusBadge status={sh.status} />
                        <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${URGENCY_COLORS[sh.urgency]}18`, color: URGENCY_COLORS[sh.urgency] }}>{sh.urgency}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{sh.role}</div>
                    <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                      {sh.domains.map(d => <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: DOMAIN_COLORS[d] }} />)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Right: Detail */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          {selected ? (() => {
            const layer = LAYERS.find(l => l.key === selected.layer);
            const sts = STATUS_STYLES[selected.status];
            return (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14 }}>{layer.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: layer.color }}>{layer.label.toUpperCase()}</span>
                  <StatusBadge status={selected.status} />
                  <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${URGENCY_COLORS[selected.urgency]}18`, color: URGENCY_COLORS[selected.urgency] }}>{selected.urgency}</span>
                  {selected.domains.map(d => <span key={d} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${DOMAIN_COLORS[d]}18`, color: DOMAIN_COLORS[d] }}>{d}</span>)}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 2px", lineHeight: 1.3 }}>{selected.name}</h2>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>{selected.role}</div>

                {/* Status Block */}
                <div style={{
                  padding: 14, borderRadius: 7, marginBottom: 14,
                  background: sts.bg, borderLeft: `3px solid ${sts.color}`,
                }}>
                  <div style={{ fontSize: 10, color: sts.color, letterSpacing: "0.05em", marginBottom: 4, fontWeight: 600 }}>
                    CURRENT STATUS: {sts.label}
                  </div>
                  <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.55 }}>{selected.statusNote}</div>
                </div>

                {/* Human Context */}
                <div style={{ padding: 14, background: "#111827", borderRadius: 7, borderLeft: "3px solid #64748b", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em", marginBottom: 4 }}>👤 THE PERSON BEHIND THE ROLE</div>
                  <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, fontStyle: "italic" }}>{selected.humanContext}</div>
                </div>

                {/* Trigger */}
                <div style={{ padding: 12, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: "0.05em", marginBottom: 4 }}>⚡ TRIGGER CONDITION</div>
                  <div style={{ fontSize: 12, color: "#fbbf24", fontFamily: "monospace", lineHeight: 1.5 }}>{selected.trigger}</div>
                </div>

                {/* Obligation */}
                <div style={{ padding: 12, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: layer.color, letterSpacing: "0.05em", marginBottom: 4 }}>📜 OBLIGATION / MANDATE</div>
                  <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{selected.obligation}</div>
                </div>

                {/* What they receive */}
                <div style={{ padding: 12, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#3b82f6", letterSpacing: "0.05em", marginBottom: 4 }}>📦 INFORMATION PACKAGE</div>
                  <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{selected.receives}</div>
                </div>

                {/* Timeframe */}
                <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <div style={{ flex: 1, padding: "10px 12px", background: "#111827", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em" }}>RESPONSE WINDOW</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: URGENCY_COLORS[selected.urgency], fontFamily: "monospace", marginTop: 3 }}>{selected.timeframe}</div>
                  </div>
                  <div style={{ flex: 1, padding: "10px 12px", background: "#111827", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em" }}>ROUTING LAYER</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: layer.color, marginTop: 3 }}>{layer.label}</div>
                  </div>
                  <div style={{ flex: 1, padding: "10px 12px", background: "#111827", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em" }}>URGENCY</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: URGENCY_COLORS[selected.urgency], marginTop: 3 }}>{selected.urgency}</div>
                  </div>
                </div>

                {/* Layer explanation */}
                <div style={{ padding: 12, background: "#111827", borderRadius: 7, border: `1px solid ${layer.color}22` }}>
                  <div style={{ fontSize: 10, color: layer.color, letterSpacing: "0.05em", marginBottom: 4 }}>{layer.icon} ABOUT THIS ROUTING LAYER</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{layer.description}</div>
                </div>
              </div>
            );
          })() : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#334155" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🏛️</div>
                <div style={{ fontSize: 13 }}>Select a stakeholder to see routing details</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>or hit "Fire All Routes" to animate the full topology</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes routePulse { 0% { background: rgba(236,72,153,0.12); } 100% { background: transparent; } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>
    </div>
  );
}
