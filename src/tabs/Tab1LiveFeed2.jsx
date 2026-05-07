import { useState, useEffect, useRef, useCallback } from "react";

const KARNATAKA_CENTER = { lat: 13.5, lng: 76.5 };

const MODALITY_ICONS = {
  voice: "🎙️", image: "📷", video: "🎥", sensor: "📡", text: "📝", social: "📱"
};
const MODALITY_COLORS = {
  voice: "#f59e0b", image: "#3b82f6", video: "#8b5cf6", sensor: "#10b981", text: "#6b7280", social: "#ec4899"
};
const DOMAIN_COLORS = {
  health: "#ef4444", ecology: "#22c55e", agriculture: "#f59e0b", climate: "#3b82f6", disaster: "#a855f7", infrastructure: "#6b7280"
};

const RAW_PULSES = [
  { id: "RP-4471", modality: "voice", domain: "health", lat: 13.12, lng: 77.58, summary: "Farmer reports suspected cobra bite on left ankle near paddy field", observer: "Ramesh K.", locale: "Ramanagara District", confidence: 0.89, raw: "\"saab... haavu kachithu... cobra thara ide... paddy field nalli...\"", timestamp: 0 },
  { id: "RP-4472", modality: "image", domain: "ecology", lat: 13.13, lng: 77.57, summary: "Image capture: cobra species near irrigation canal, partially shed skin visible", observer: "Lakshmi N. (ASHA worker)", locale: "Channapatna Taluk", confidence: 0.92, raw: "IMG_2847.jpg — 4032×3024, GPS embedded, auto-classified Naja naja", timestamp: 3500 },
  { id: "RP-4473", modality: "voice", domain: "ecology", lat: 13.11, lng: 77.61, summary: "Truck driver reports large snake crossing NH-275 near construction zone", observer: "Manjunath D.", locale: "NH-275 km marker 42", confidence: 0.74, raw: "\"doḍḍa haavu road cross maadthu... truck mundhey...\"", timestamp: 7000 },
  { id: "RP-4474", modality: "sensor", domain: "agriculture", lat: 13.14, lng: 77.55, summary: "Soil moisture sensor anomaly — 40% drop in 72hrs, irrigation canal dry", observer: "IoT Sensor Grid SG-17", locale: "Ramanagara Agri Block", confidence: 0.97, raw: "SENSOR_SG17: moisture=0.12, delta_72h=-0.41, alert_threshold=TRUE", timestamp: 10500 },
  { id: "RP-4475", modality: "social", domain: "ecology", lat: 13.10, lng: 77.59, summary: "Social media post: 'Third snake in our village this week. Never seen this before.'", observer: "@farmlife_karnataka", locale: "Channapatna", confidence: 0.65, raw: "Twitter/X post, 47 engagements, geo-tagged, sentiment: concern", timestamp: 14000 },
  { id: "RP-4476", modality: "voice", domain: "health", lat: 13.15, lng: 77.56, summary: "PHC nurse: second snakebite case this week, anti-venom stock running low", observer: "Nurse Priya S.", locale: "Ramanagara PHC", confidence: 0.95, raw: "\"ivaga 2nd case ee weekalli... anti-venom 3 vials maathra ide...\"", timestamp: 17500 },
  { id: "RP-4477", modality: "video", domain: "infrastructure", lat: 13.13, lng: 77.60, summary: "Video: active blasting at highway expansion site, debris near wetland buffer", observer: "Construction crew (anon)", locale: "NH-275 Expansion Zone", confidence: 0.88, raw: "VID_0093.mp4 — 00:42 duration, GPS embedded, audio: blasting + machinery", timestamp: 21000 },
  { id: "RP-4478", modality: "image", domain: "ecology", lat: 13.09, lng: 77.58, summary: "Camera trap: unusual diurnal movement of rat snakes near dried pond bed", observer: "Forest Dept. Trap CT-14", locale: "Ramanagara Reserve Edge", confidence: 0.91, raw: "CT-14_FRAME_8821.jpg — 12:47 IST, species: Ptyas mucosa, behavior: atypical", timestamp: 24500 },
  { id: "RP-4479", modality: "text", domain: "agriculture", lat: 13.16, lng: 77.54, summary: "Crop damage report: rodent surge in grain storage — possible prey chain disruption", observer: "Agri Extension Officer Ravi", locale: "Ramanagara Block Office", confidence: 0.82, raw: "Form 7B filed: rodent damage est. 12% storage loss, 3 villages affected", timestamp: 28000 },
  { id: "RP-4480", modality: "sensor", domain: "climate", lat: 13.12, lng: 77.56, summary: "Weather station: 23 consecutive days without rainfall, temp anomaly +2.3°C", observer: "IMD Station RMG-04", locale: "Ramanagara AWS", confidence: 0.99, raw: "IMD_RMG04: rain_23d=0mm, temp_avg=34.2°C, anomaly=+2.3°C, humidity=31%", timestamp: 31500 },
];

const MapDot = ({ pulse, isNew, mapW, mapH }) => {
  const x = ((pulse.lng - 77.50) / 0.20) * mapW;
  const y = ((13.20 - pulse.lat) / 0.15) * mapH;
  const color = MODALITY_COLORS[pulse.modality];
  return (
    <g>
      {isNew && (
        <>
          <circle cx={x} cy={y} r={20} fill={color} opacity={0.15}>
            <animate attributeName="r" from="8" to="35" dur="1.5s" repeatCount="3" />
            <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="3" />
          </circle>
        </>
      )}
      <circle cx={x} cy={y} r={5} fill={color} stroke="#fff" strokeWidth={1.5} style={{ filter: isNew ? `drop-shadow(0 0 6px ${color})` : "none" }}>
        {isNew && <animate attributeName="r" from="3" to="6" dur="0.4s" fill="freeze" />}
      </circle>
      <text x={x + 8} y={y + 3} fill="#cbd5e1" fontSize="8" fontFamily="monospace">{pulse.id}</text>
    </g>
  );
};

export default function LiveFieldFeed() {
  const [pulses, setPulses] = useState([]);
  const [selectedPulse, setSelectedPulse] = useState(null);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const feedRef = useRef(null);

  const addNextPulse = useCallback(() => {
    if (indexRef.current < RAW_PULSES.length) {
      const p = { ...RAW_PULSES[indexRef.current], arrivedAt: Date.now() };
      setPulses(prev => [p, ...prev]);
      setSelectedPulse(p);
      indexRef.current++;
    } else {
      indexRef.current = 0;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(addNextPulse, 3500 / speed);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, speed, addNextPulse]);

  const isNew = (p) => Date.now() - p.arrivedAt < 4000;
  // ═══════════════════════════════════════════════
  // ✏️ CONFIGURE STATS BAR LABELS & VALUES HERE
  // ═══════════════════════════════════════════════
  const STATS_BAR = [
    { label: "PULSES CAPTURED",     color: "#60a5fa", value: pulses.length },
    { label: "INPUT MODALITIES",    color: "#f59e0b", value: `${[...new Set(pulses.map(p => p.modality))].length}/6` },
    { label: "CROSS-DOMAIN SIGNALS",color: "#a78bfa", value: `${[...new Set(pulses.map(p => p.domain))].length}/6` },
    { label: "AVG CONFIDENCE",      color: "#34d399", value: pulses.length ? (pulses.reduce((a, b) => a + b.confidence, 0) / pulses.length).toFixed(2) : "—" },
    { label: "ACTIVE REGION",       color: "#94a3b8", value: "RAMANAGARA" },
  ];
  // ═══════════════════════════════════════════════

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: isRunning ? "#22c55e" : "#ef4444", boxShadow: isRunning ? "0 0 8px #22c55e" : "0 0 8px #ef4444" }} />
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>LIVE FIELD FEED</span>
          <span style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}>FRONTLINE CAPTURE — RAW PULSE INGESTION</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>SPEED</span>
          {[1, 2, 4].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid", borderColor: speed === s ? "#3b82f6" : "#334155", background: speed === s ? "#1e3a5f" : "transparent", color: speed === s ? "#60a5fa" : "#94a3b8", fontSize: 11, cursor: "pointer" }}>{s}×</button>
          ))}
          <button onClick={() => setIsRunning(!isRunning)} style={{ padding: "4px 14px", borderRadius: 4, border: "1px solid #334155", background: isRunning ? "#1c1917" : "#14532d", color: isRunning ? "#fbbf24" : "#4ade80", fontSize: 11, cursor: "pointer", marginLeft: 8 }}>
            {isRunning ? "⏸ PAUSE" : "▶ RESUME"}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "flex", gap: 1, padding: "0", background: "#1e293b" }}>
        {STATS_BAR.map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "10px 16px", background: "#0f172a", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Map */}
        <div style={{ flex: 1, position: "relative", borderRight: "1px solid #1e293b" }}>
          <div style={{ position: "absolute", top: 12, left: 12, fontSize: 10, color: "#475569", zIndex: 2, fontFamily: "monospace" }}>
            RAMANAGARA DISTRICT — 13.09°N–13.16°N / 77.54°E–77.61°E
          </div>
          <svg width="100%" height="100%" viewBox="0 0 500 350" style={{ background: "radial-gradient(ellipse at center, #0f1729 0%, #0a0e1a 100%)" }}>
            {/* Grid */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`gx${i}`} x1={i * 25} y1={0} x2={i * 25} y2={350} stroke="#1e293b" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`gy${i}`} x1={0} y1={i * 25} x2={500} y2={i * 25} stroke="#1e293b" strokeWidth={0.5} />
            ))}
            {/* NH-275 road line */}
            <line x1={50} y1={280} x2={450} y2={80} stroke="#334155" strokeWidth={2} strokeDasharray="8,4" />
            <text x={420} y={70} fill="#475569" fontSize="9" fontFamily="monospace">NH-275</text>
            {/* Pulses */}
            {pulses.map(p => (
              <g key={p.id} onClick={() => setSelectedPulse(p)} style={{ cursor: "pointer" }}>
                <MapDot pulse={p} isNew={isNew(p)} mapW={500} mapH={350} />
              </g>
            ))}
          </svg>
        </div>

        {/* Feed Panel */}
        <div style={{ width: 440, display: "flex", flexDirection: "column", background: "#0c1222" }}>
          {/* Detail Card */}
          {selectedPulse && (
            <div style={{ padding: 16, borderBottom: "1px solid #1e293b", background: "#111827" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "monospace", color: "#60a5fa", fontWeight: 700 }}>{selectedPulse.id}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: DOMAIN_COLORS[selectedPulse.domain] + "22", color: DOMAIN_COLORS[selectedPulse.domain], border: `1px solid ${DOMAIN_COLORS[selectedPulse.domain]}44` }}>
                  {selectedPulse.domain.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 10, color: "#e2e8f0" }}>{selectedPulse.summary}</div>
              <div style={{ background: "#0a0e1a", borderRadius: 6, padding: 10, fontFamily: "monospace", fontSize: 11, color: "#94a3b8", lineHeight: 1.5, marginBottom: 10, borderLeft: `3px solid ${MODALITY_COLORS[selectedPulse.modality]}` }}>
                {selectedPulse.raw}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
                <div><span style={{ color: "#64748b" }}>Observer: </span><span style={{ color: "#cbd5e1" }}>{selectedPulse.observer}</span></div>
                <div><span style={{ color: "#64748b" }}>Locale: </span><span style={{ color: "#cbd5e1" }}>{selectedPulse.locale}</span></div>
                <div><span style={{ color: "#64748b" }}>Modality: </span><span style={{ color: MODALITY_COLORS[selectedPulse.modality] }}>{MODALITY_ICONS[selectedPulse.modality]} {selectedPulse.modality}</span></div>
                <div><span style={{ color: "#64748b" }}>Confidence: </span><span style={{ color: selectedPulse.confidence > 0.85 ? "#4ade80" : selectedPulse.confidence > 0.7 ? "#fbbf24" : "#f87171" }}>{(selectedPulse.confidence * 100).toFixed(0)}%</span></div>
                <div><span style={{ color: "#64748b" }}>GPS: </span><span style={{ color: "#cbd5e1", fontFamily: "monospace" }}>{selectedPulse.lat}°N, {selectedPulse.lng}°E</span></div>
              </div>
            </div>
          )}

          {/* Scrolling Feed */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px 0" }} ref={feedRef}>
            <div style={{ padding: "4px 16px 8px", fontSize: 10, color: "#475569", letterSpacing: "0.05em" }}>INCOMING STREAM</div>
            {pulses.map((p, i) => (
              <div key={p.id + i} onClick={() => setSelectedPulse(p)}
                style={{
                  padding: "10px 16px", cursor: "pointer", borderLeft: `3px solid ${MODALITY_COLORS[p.modality]}`,
                  background: selectedPulse?.id === p.id ? "#1e293b" : isNew(p) ? "#0f172a" : "transparent",
                  transition: "all 0.3s", marginBottom: 1,
                  animation: isNew(p) ? "fadeSlide 0.5s ease-out" : "none"
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 16 }}>{MODALITY_ICONS[p.modality]}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "#60a5fa" }}>{p.id}</span>
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: DOMAIN_COLORS[p.domain] + "22", color: DOMAIN_COLORS[p.domain] }}>{p.domain}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{(p.confidence * 100).toFixed(0)}%</span>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.summary}</div>
              </div>
            ))}
            {pulses.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "#334155" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📡</div>
                <div style={{ fontSize: 12 }}>Awaiting field transmissions...</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>
    </div>
  );
}
