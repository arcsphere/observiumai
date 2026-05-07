import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════
// ✏️ CONFIGURE TRIGGER TEMPLATES HERE
// ═══════════════════════════════════════════════
const TRIGGER_TEMPLATES = [
  { id: "TRG-01", name: "Snakebite Cluster", category: "health-ecology", icon: "🐍",
    description: "Activates when snakebite incidents exceed baseline within a defined geographic window, combined with ecological displacement indicators.",
    conditions: [
      { field: "Bite cases / 7 days", operator: "≥", value: "2", source: "PHC intake register", editable: true },
      { field: "Displacement indicators", operator: "≥", value: "1", source: "Camera traps, sighting reports", editable: true },
      { field: "Geographic scope", operator: "within", value: "10 km radius", source: "GPS / cell tower", editable: true },
    ],
    defaults: { duration: "7 days", geoScope: "10 km", escalation: "auto", ilk: true },
  },
  { id: "TRG-02", name: "Drought-Displacement Cascade", category: "climate-ecology", icon: "🌡️",
    description: "Fires when prolonged drought indicators correlate with wildlife behavioral anomalies and human-wildlife encounter increases.",
    conditions: [
      { field: "Consecutive dry days", operator: "≥", value: "14", source: "IMD weather station", editable: true },
      { field: "Soil moisture delta (72h)", operator: "≥", value: "30%", source: "IoT sensor grid", editable: true },
      { field: "Wildlife behavior anomaly", operator: "≥", value: "1 flagged event", source: "Camera trap network", editable: true },
    ],
    defaults: { duration: "14 days", geoScope: "25 km", escalation: "auto", ilk: true },
  },
  { id: "TRG-03", name: "Construction-Habitat Impact", category: "infrastructure-ecology", icon: "🏗️",
    description: "Monitors active construction within buffer zones of sensitive habitats. Triggers when displacement indicators emerge near construction activity.",
    conditions: [
      { field: "Active construction", operator: "within", value: "500m of habitat buffer", source: "Project GIS / reports", editable: true },
      { field: "Species sightings in residential areas", operator: "≥", value: "2 / week", source: "Community reports, traps", editable: true },
      { field: "Trophic cascade indicator", operator: "any", value: "rodent surge, prey shift", source: "Agri extension reports", editable: true },
    ],
    defaults: { duration: "30 days", geoScope: "5 km", escalation: "manual", ilk: false },
  },
  { id: "TRG-04", name: "Anti-Venom Supply Critical", category: "health", icon: "💉",
    description: "Health system capacity trigger. Fires when anti-venom stock falls below treatment threshold relative to active case rate.",
    conditions: [
      { field: "Anti-venom vials", operator: "≤", value: "5", source: "PHC inventory", editable: true },
      { field: "Active bite cases / week", operator: "≥", value: "1", source: "PHC intake", editable: true },
      { field: "Nearest resupply distance", operator: "≥", value: "30 km", source: "Supply chain system", editable: true },
    ],
    defaults: { duration: "3 days", geoScope: "District", escalation: "auto", ilk: false },
  },
  { id: "TRG-05", name: "Community Alert Surge", category: "social-ecology", icon: "📱",
    description: "Social signal trigger. Activates when community-sourced reports exceed noise threshold, indicating genuine concern rather than isolated posts.",
    conditions: [
      { field: "Community reports / 48h", operator: "≥", value: "5", source: "Social media, helplines, ASHA", editable: true },
      { field: "Geographic clustering", operator: "within", value: "5 km", source: "Geo-tagged reports", editable: true },
      { field: "Sentiment", operator: "=", value: "concern / fear", source: "NLP analysis", editable: true },
    ],
    defaults: { duration: "5 days", geoScope: "Zonal", escalation: "manual", ilk: true },
  },
];

// ✏️ RISK WINDOW SCENARIOS (pre-built demo)
const ACTIVE_WINDOWS = [
  {
    id: "RW-001", trigger: "TRG-01", name: "Ramanagara Snakebite Cluster",
    status: "active", activatedAt: "2025-03-08 08:14 IST", activatedBy: "Auto-trigger: INC-4476 (2nd bite case)",
    expiresAt: "2025-03-15 08:14 IST",
    geo: { center: "Ramanagara East", radius: "10 km", zones: ["Ramanagara East", "Channapatna Taluk"] },
    escalationLevel: 2,
    monitoringFreq: "Continuous — all new incidents in zone auto-tagged",
    ilkEnabled: true,
    guestAuthorities: [
      { name: "Snake Rescue Network", role: "Voluntary rescuers", access: "Sighting data + PHC locations", expiry: "Window duration" },
      { name: "ASHA Workers — Channapatna", role: "Community health", access: "Risk advisory + bite first-aid protocol", expiry: "Window duration" },
    ],
    incidentsFed: 7,
    escalationHistory: [
      { time: "08:14 IST, Mar 8", event: "Window opened — 2nd bite case at PHC", level: 1 },
      { time: "09:30 IST, Mar 8", event: "Soil moisture anomaly correlated — escalated", level: 2 },
      { time: "12:47 IST, Mar 8", event: "Camera trap anomaly linked — monitoring expanded", level: 2 },
    ],
    resolutionCriteria: [
      { criterion: "Zero new bite cases for 72 hours", met: false },
      { criterion: "Anti-venom stock restored to ≥10 vials", met: false },
      { criterion: "Displacement indicators return to baseline", met: false },
      { criterion: "Cross-sector briefing completed", met: false },
    ],
  },
  {
    id: "RW-002", trigger: "TRG-02", name: "South Karnataka Drought Watch",
    status: "active", activatedAt: "2025-02-28 00:00 IST", activatedBy: "Auto-trigger: IMD 14-day dry spell threshold",
    expiresAt: "2025-03-14 00:00 IST",
    geo: { center: "Ramanagara District", radius: "25 km", zones: ["Ramanagara East", "Channapatna Taluk", "NH-275 Corridor", "Reserve Buffer Zone"] },
    escalationLevel: 1,
    monitoringFreq: "6-hourly sensor polling + daily manual check",
    ilkEnabled: true,
    guestAuthorities: [
      { name: "Irrigation Dept.", role: "Water management", access: "Sensor data + canal status", expiry: "Window duration" },
    ],
    incidentsFed: 3,
    escalationHistory: [
      { time: "00:00 IST, Feb 28", event: "14-day dry spell threshold breached", level: 1 },
      { time: "09:30 IST, Mar 8", event: "Soil moisture collapse correlated — monitoring tightened", level: 1 },
    ],
    resolutionCriteria: [
      { criterion: "Rainfall ≥10mm recorded", met: false },
      { criterion: "Soil moisture returns to >0.30", met: false },
      { criterion: "Canal water flow restored", met: false },
    ],
  },
];

const CATEGORY_COLORS = {
  "health-ecology": "#ef4444", "climate-ecology": "#3b82f6", "infrastructure-ecology": "#6b7280",
  "health": "#ef4444", "social-ecology": "#a855f7",
};
const STATUS_COLORS = { active: "#22c55e", pending: "#f59e0b", expired: "#64748b", resolved: "#3b82f6" };

export default function TriggerConfiguration() {
  const [view, setView] = useState("windows");
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState(ACTIVE_WINDOWS[0]);
  const [editingConditions, setEditingConditions] = useState({});
  const [ilkToggle, setIlkToggle] = useState({});
  const [simulating, setSimulating] = useState(false);
  const [simSteps, setSimSteps] = useState([]);

  const simulate = useCallback(() => {
    if (!selectedTrigger) return;
    setSimulating(true);
    setSimSteps([]);
    const steps = [
      { time: "T+0s", event: `Evaluating trigger: ${selectedTrigger.name}`, status: "checking" },
      ...selectedTrigger.conditions.map((c, i) => ({
        time: `T+${(i + 1) * 2}s`,
        event: `Checking: ${c.field} ${c.operator} ${editingConditions[`${selectedTrigger.id}-${i}`] || c.value}`,
        status: "checking",
        source: c.source,
      })),
      { time: `T+${(selectedTrigger.conditions.length + 1) * 2}s`, event: "All conditions met — TRIGGER FIRES", status: "fired" },
      { time: `T+${(selectedTrigger.conditions.length + 2) * 2}s`, event: `Risk Window opened: ${selectedTrigger.defaults.geoScope} radius, ${selectedTrigger.defaults.duration} duration`, status: "window" },
      { time: `T+${(selectedTrigger.conditions.length + 3) * 2}s`, event: selectedTrigger.defaults.ilk ? "ILK modality: ENABLED — local knowledge flagged and toggle-able" : "ILK modality: disabled for this trigger", status: "config" },
      { time: `T+${(selectedTrigger.conditions.length + 4) * 2}s`, event: `Escalation mode: ${selectedTrigger.defaults.escalation === "auto" ? "Automatic — will escalate on corroboration" : "Manual — requires human review"}`, status: "config" },
    ];
    let i = 0;
    const t = setInterval(() => {
      if (i < steps.length) {
        setSimSteps(prev => [...prev, steps[i]]);
        i++;
      } else { clearInterval(t); setSimulating(false); }
    }, 600);
    return () => clearInterval(t);
  }, [selectedTrigger, editingConditions]);

  const stepColor = { checking: "#f59e0b", fired: "#22c55e", window: "#ec4899", config: "#3b82f6" };

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>TRIGGER CONFIGURATION</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>RISK WINDOW MODE — CONFIGURABLE TRIGGERS, MONITORING, RESOLUTION</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { key: "windows", label: "Active Windows" },
            { key: "triggers", label: "Trigger Library" },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)} style={{
              padding: "5px 14px", borderRadius: 5, border: `1px solid ${view === v.key ? "#ec4899" : "#1e293b"}`,
              background: view === v.key ? "#ec489915" : "transparent", color: view === v.key ? "#ec4899" : "#64748b",
              fontSize: 11, cursor: "pointer",
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* ── ACTIVE WINDOWS VIEW ── */}
      {view === "windows" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left: Window list */}
          <div style={{ width: 380, borderRight: "1px solid #1e293b", overflow: "auto", padding: "8px 10px" }}>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.06em", padding: "8px 4px 6px" }}>ACTIVE RISK WINDOWS — {ACTIVE_WINDOWS.length}</div>
            {ACTIVE_WINDOWS.map(w => (
              <div key={w.id} onClick={() => setSelectedWindow(w)}
                style={{
                  padding: "12px", borderRadius: 7, cursor: "pointer", marginBottom: 6,
                  background: selectedWindow?.id === w.id ? "#22c55e10" : "#111827",
                  border: `1px solid ${selectedWindow?.id === w.id ? "#22c55e" : "#1e293b"}`,
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: "#22c55e", fontWeight: 700 }}>{w.id}</span>
                  <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 3, background: "#22c55e18", color: "#22c55e", fontWeight: 600 }}>● ACTIVE</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3, marginBottom: 4 }}>{w.name}</div>
                <div style={{ display: "flex", gap: 8, fontSize: 10, color: "#64748b" }}>
                  <span>📍 {w.geo.radius}</span>
                  <span>⏱️ Expires {w.expiresAt.split(" ")[0]}</span>
                  <span>🔺 Level {w.escalationLevel}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Window Detail */}
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            {selectedWindow ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 13, color: "#22c55e", fontWeight: 700 }}>{selectedWindow.id}</span>
                  <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, background: "#22c55e18", color: "#22c55e", fontWeight: 600 }}>● ACTIVE</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{selectedWindow.name}</h2>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>Triggered by: {selectedWindow.activatedBy}</div>

                {/* Key Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "GEOGRAPHIC SCOPE", value: selectedWindow.geo.radius, sub: selectedWindow.geo.center, color: "#3b82f6" },
                    { label: "ACTIVE SINCE", value: selectedWindow.activatedAt.split(" ")[0], sub: selectedWindow.activatedAt.split(" ").slice(1).join(" "), color: "#f59e0b" },
                    { label: "ESCALATION LEVEL", value: `Level ${selectedWindow.escalationLevel}`, sub: `of 3`, color: "#ef4444" },
                    { label: "INCIDENTS FED", value: selectedWindow.incidentsFed, sub: "into this window", color: "#a855f7" },
                  ].map((m, i) => (
                    <div key={i} style={{ padding: "10px 12px", background: "#111827", borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#475569", letterSpacing: "0.05em" }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: "monospace", marginTop: 3 }}>{m.value}</div>
                      <div style={{ fontSize: 9, color: "#475569" }}>{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Zones */}
                <div style={{ marginBottom: 14, padding: 12, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b" }}>
                  <div style={{ fontSize: 9, color: "#3b82f6", letterSpacing: "0.05em", marginBottom: 6 }}>📍 MONITORING ZONES</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {selectedWindow.geo.zones.map(z => (
                      <span key={z} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 4, background: "#3b82f618", color: "#60a5fa", border: "1px solid #3b82f633" }}>{z}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Monitoring: {selectedWindow.monitoringFreq}</div>
                </div>

                {/* ILK Toggle */}
                <div style={{ marginBottom: 14, padding: 12, background: "#111827", borderRadius: 7, border: `1px solid ${selectedWindow.ilkEnabled ? "#a855f733" : "#1e293b"}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "#a855f7", letterSpacing: "0.05em", marginBottom: 2 }}>🌿 INDIGENOUS & LOCAL KNOWLEDGE (ILK)</div>
                      <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>
                        {selectedWindow.ilkEnabled
                          ? "Enabled — local and indigenous knowledge signals are flagged, tagged, and incorporated. Retrospective reclassification available."
                          : "Disabled — ILK signals captured but not weighted in pattern formation."}
                      </div>
                    </div>
                    <div onClick={() => {}} style={{
                      width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                      background: selectedWindow.ilkEnabled ? "#a855f7" : "#334155",
                      position: "relative", transition: "background 0.3s",
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "#fff",
                        position: "absolute", top: 3, left: selectedWindow.ilkEnabled ? 23 : 3,
                        transition: "left 0.3s",
                      }} />
                    </div>
                  </div>
                </div>

                {/* Guest Authorities */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, color: "#ec4899", letterSpacing: "0.05em", marginBottom: 8 }}>👥 GUEST AUTHORITY ACCESS</div>
                  {selectedWindow.guestAuthorities.map((g, i) => (
                    <div key={i} style={{ padding: "10px 12px", background: "#111827", borderRadius: 6, marginBottom: 5, borderLeft: "3px solid #ec4899" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{g.name}</span>
                        <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: "#1e293b", color: "#94a3b8" }}>{g.expiry}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{g.role}</div>
                      <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 3 }}>Access: {g.access}</div>
                    </div>
                  ))}
                </div>

                {/* Escalation History */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, color: "#f59e0b", letterSpacing: "0.05em", marginBottom: 8 }}>📈 ESCALATION HISTORY</div>
                  {selectedWindow.escalationHistory.map((e, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === selectedWindow.escalationHistory.length - 1 ? "#f59e0b" : "#334155", border: "2px solid #0a0e1a" }} />
                        {i < selectedWindow.escalationHistory.length - 1 && <div style={{ width: 1, flex: 1, background: "#1e293b" }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 8 }}>
                        <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{e.time}</div>
                        <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.4 }}>{e.event}</div>
                        <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 2, background: "#f59e0b18", color: "#f59e0b" }}>Level {e.level}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resolution Criteria */}
                <div style={{ padding: 14, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b" }}>
                  <div style={{ fontSize: 9, color: "#22c55e", letterSpacing: "0.05em", marginBottom: 8 }}>✅ RESOLUTION CRITERIA — Window closes when ALL are met</div>
                  {selectedWindow.resolutionCriteria.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, border: `2px solid ${r.met ? "#22c55e" : "#334155"}`,
                        background: r.met ? "#22c55e22" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {r.met && <span style={{ color: "#22c55e", fontSize: 11 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, color: r.met ? "#22c55e" : "#94a3b8" }}>{r.criterion}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 8, fontStyle: "italic" }}>
                    0 of {selectedWindow.resolutionCriteria.length} criteria met — window remains active
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#334155" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
                  <div style={{ fontSize: 13 }}>Select a risk window</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TRIGGER LIBRARY VIEW ── */}
      {view === "triggers" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left: Trigger list */}
          <div style={{ width: 380, borderRight: "1px solid #1e293b", overflow: "auto", padding: "8px 10px" }}>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.06em", padding: "8px 4px 6px" }}>TRIGGER LIBRARY — {TRIGGER_TEMPLATES.length} CONFIGURED</div>
            {TRIGGER_TEMPLATES.map(t => (
              <div key={t.id} onClick={() => { setSelectedTrigger(t); setSimSteps([]); }}
                style={{
                  padding: "10px 12px", borderRadius: 7, cursor: "pointer", marginBottom: 6,
                  background: selectedTrigger?.id === t.id ? `${CATEGORY_COLORS[t.category]}10` : "#111827",
                  border: `1px solid ${selectedTrigger?.id === t.id ? CATEGORY_COLORS[t.category] : "#1e293b"}`,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{t.icon}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: CATEGORY_COLORS[t.category], fontWeight: 700 }}>{t.id}</span>
                  <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${CATEGORY_COLORS[t.category]}18`, color: CATEGORY_COLORS[t.category] }}>{t.category}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3 }}>{t.name}</div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>{t.conditions.length} conditions • {t.defaults.duration} window</div>
              </div>
            ))}
          </div>

          {/* Right: Trigger detail + simulator */}
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            {selectedTrigger ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>{selectedTrigger.icon}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 13, color: CATEGORY_COLORS[selectedTrigger.category], fontWeight: 700 }}>{selectedTrigger.id}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{selectedTrigger.name}</h2>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 16 }}>{selectedTrigger.description}</div>

                {/* Editable Conditions */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 9, color: "#f59e0b", letterSpacing: "0.05em", marginBottom: 8 }}>⚡ TRIGGER CONDITIONS — click values to configure</div>
                  {selectedTrigger.conditions.map((c, i) => (
                    <div key={i} style={{ padding: "10px 12px", background: "#111827", borderRadius: 6, marginBottom: 5, borderLeft: `3px solid ${CATEGORY_COLORS[selectedTrigger.category]}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{c.field}</span>
                        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{c.operator}</span>
                        <input
                          value={editingConditions[`${selectedTrigger.id}-${i}`] || c.value}
                          onChange={e => setEditingConditions(prev => ({ ...prev, [`${selectedTrigger.id}-${i}`]: e.target.value }))}
                          style={{
                            padding: "3px 8px", borderRadius: 4, border: "1px solid #334155", background: "#0a0e1a",
                            color: "#fbbf24", fontSize: 12, fontFamily: "monospace", width: 140, outline: "none",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>Source: {c.source}</div>
                    </div>
                  ))}
                </div>

                {/* Defaults */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "WINDOW DURATION", value: selectedTrigger.defaults.duration, color: "#3b82f6" },
                    { label: "GEO SCOPE", value: selectedTrigger.defaults.geoScope, color: "#22c55e" },
                    { label: "ESCALATION", value: selectedTrigger.defaults.escalation, color: "#f59e0b" },
                    { label: "ILK", value: selectedTrigger.defaults.ilk ? "Enabled" : "Disabled", color: "#a855f7" },
                  ].map((d, i) => (
                    <div key={i} style={{ padding: "10px", background: "#111827", borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#475569", letterSpacing: "0.05em" }}>{d.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: d.color, fontFamily: "monospace", marginTop: 3 }}>{d.value}</div>
                    </div>
                  ))}
                </div>

                {/* Simulate Button */}
                <button onClick={simulate} disabled={simulating} style={{
                  width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #22c55e",
                  background: simulating ? "#14532d22" : "#22c55e15", color: "#22c55e",
                  fontSize: 13, fontWeight: 600, cursor: simulating ? "default" : "pointer",
                  marginBottom: 16,
                }}>
                  {simulating ? "⏳ Simulating..." : "▶ SIMULATE TRIGGER FIRE"}
                </button>

                {/* Simulation Output */}
                {simSteps.length > 0 && (
                  <div style={{ padding: 14, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em", marginBottom: 8 }}>SIMULATION LOG</div>
                    {simSteps.map((s, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start",
                        animation: "simIn 0.4s ease-out",
                      }}>
                        <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", minWidth: 40, flexShrink: 0 }}>{s.time}</span>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: stepColor[s.status], marginTop: 4, flexShrink: 0, boxShadow: `0 0 6px ${stepColor[s.status]}66` }} />
                        <div>
                          <div style={{ fontSize: 12, color: s.status === "fired" ? "#22c55e" : "#e2e8f0", fontWeight: s.status === "fired" ? 700 : 400, lineHeight: 1.4 }}>{s.event}</div>
                          {s.source && <div style={{ fontSize: 10, color: "#475569" }}>via {s.source}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#334155" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
                  <div style={{ fontSize: 13 }}>Select a trigger to configure and simulate</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes simIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        input:focus { border-color: #f59e0b !important; }
      `}</style>
    </div>
  );
}
