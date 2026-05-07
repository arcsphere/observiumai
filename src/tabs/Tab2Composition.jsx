import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
// ✏️ CONFIGURE PIPELINE LABELS HERE
// ═══════════════════════════════════════════════
const PIPELINE = [
  { key: "incidents", label: "Incidents", icon: "⚡", color: "#f59e0b" },
  { key: "observations", label: "Observations", icon: "👁️", color: "#3b82f6" },
  { key: "patterns", label: "Patterns", icon: "🔗", color: "#a855f7" },
  { key: "insights", label: "Insights", icon: "💡", color: "#22c55e" },
];

// ✏️ CONFIGURE REGIONS / ZONES HERE
const REGIONS = [
  { key: "all", label: "All Zones" },
  { key: "ramanagara-east", label: "Ramanagara East" },
  { key: "channapatna", label: "Channapatna Taluk" },
  { key: "nh275-corridor", label: "NH-275 Corridor" },
  { key: "reserve-edge", label: "Reserve Buffer Zone" },
];
// ═══════════════════════════════════════════════

const DOMAIN_COLORS = { health: "#ef4444", ecology: "#22c55e", agriculture: "#f59e0b", climate: "#3b82f6", infrastructure: "#6b7280" };
const MODALITY_ICONS = { voice: "🎙️", image: "📷", video: "🎥", sensor: "📡", text: "📝", social: "📱" };

const QUALITY_LABELS = {
  high: { label: "HIGH", color: "#22c55e", bg: "#22c55e18" },
  moderate: { label: "MOD", color: "#f59e0b", bg: "#f59e0b18" },
  low: { label: "LOW", color: "#ef4444", bg: "#ef444418" },
  unverified: { label: "UNVRFD", color: "#64748b", bg: "#64748b18" },
  conflicting: { label: "CONFLICT", color: "#f97316", bg: "#f9731618" },
};

const INCIDENTS = [
  { id: "INC-4471", modality: "voice", domain: "health", summary: "Farmer bitten by suspected cobra near paddy field", observer: { name: "Ramesh K.", role: "Farmer", context: "In visible pain, speech hurried. Called from neighbor's phone. Spoke in Kannada dialect, partial translation." }, quality: "moderate", confidence: 0.72, qualityNotes: ["Single source — no corroboration yet", "Species ID from caller description only", "GPS approximate — cell tower derived", "Caller in distress — details may be incomplete"], raw: "\"saab... haavu kachithu... cobra thara ide...\"", lat: 13.12, lng: 77.58, ts: "08:14 IST", gaps: ["No photo of snake", "Time since bite unknown"], zone: "ramanagara-east" },
  { id: "INC-4472", modality: "image", domain: "ecology", summary: "Cobra photographed near irrigation canal with shed skin", observer: { name: "Lakshmi N.", role: "ASHA health worker", context: "Took photo on routine village visit. Calm, deliberate capture. Familiar with local wildlife." }, quality: "high", confidence: 0.92, qualityNotes: ["GPS embedded in image metadata", "ML species: Naja naja (92%)", "Trained community health worker"], raw: "IMG_2847.jpg — 4032×3024, GPS embedded", lat: 13.13, lng: 77.57, ts: "08:22 IST", gaps: ["Shed skin not separately photographed"], zone: "channapatna" },
  { id: "INC-4473", modality: "voice", domain: "ecology", summary: "Truck driver: large snake crossing highway near construction", observer: { name: "Manjunath D.", role: "Truck driver", context: "Called while driving. Background noise. Brief 40-second call — did not stop." }, quality: "low", confidence: 0.48, qualityNotes: ["Fleeting visual from moving vehicle", "No photo or video", "Species unidentifiable", "Location approximate"], raw: "\"doḍḍa haavu road cross maadthu...\"", lat: 13.11, lng: 77.61, ts: "09:05 IST", gaps: ["Species unknown", "Direction of movement unknown"], zone: "nh275-corridor" },
  { id: "INC-4474", modality: "sensor", domain: "agriculture", summary: "Soil moisture sensor: 40% drop in 72hrs, canal dry", observer: { name: "IoT Grid SG-17", role: "Automated sensor", context: "Unattended node. Last maintenance: 12 days ago. Battery: 67%." }, quality: "high", confidence: 0.94, qualityNotes: ["Automated — no observer bias", "Calibrated ±3% error margin", "Consistent with adjacent sensor SG-16", "⚠️ Maintenance 12 days ago — drift possible"], raw: "SG17: moisture=0.12, delta_72h=-0.41", lat: 13.14, lng: 77.55, ts: "09:30 IST", gaps: ["Canal dry cause unconfirmed"], zone: "ramanagara-east" },
  { id: "INC-4475", modality: "social", domain: "ecology", summary: "'Third snake in our village this week. Never seen this before.'", observer: { name: "@farmlife_karnataka", role: "Social media user", context: "Anonymous account. 47 engagements. Geo-tag present but could be manually set." }, quality: "unverified", confidence: 0.38, qualityNotes: ["Anonymous source", "Geo-tag not validated", "Frequency claim unverifiable", "Sentiment: genuine concern"], raw: "Twitter/X post, 47 engagements, geo-tagged", lat: 13.10, lng: 77.59, ts: "10:12 IST", gaps: ["Species unknown", "No visual evidence", "Village not specified"], zone: "channapatna" },
  { id: "INC-4476", modality: "voice", domain: "health", summary: "PHC nurse: 2nd snakebite this week, anti-venom stock critical", observer: { name: "Nurse Priya S.", role: "PHC staff", context: "Called during shift. Professional, structured. Filed formal stock alert separately." }, quality: "high", confidence: 0.95, qualityNotes: ["Trained medical professional", "Cross-referenced with PHC register", "Stock count verified", "Formal channel also activated"], raw: "\"2nd case ee weekalli... anti-venom 3 vials maathra ide...\"", lat: 13.15, lng: 77.56, ts: "11:45 IST", gaps: ["First bite case details not captured"], zone: "ramanagara-east" },
  { id: "INC-4477", modality: "video", domain: "infrastructure", summary: "Video: blasting at highway expansion, debris near wetland buffer", observer: { name: "Construction crew (anon)", role: "Site worker", context: "WhatsApp video. Worker fears retaliation. Face not visible." }, quality: "moderate", confidence: 0.78, qualityNotes: ["Anonymous whistleblower", "GPS matches construction zone", "Wetland distance estimated from video", "Audio confirms blasting"], raw: "VID_0093.mp4 — 00:42, GPS embedded", lat: 13.13, lng: 77.60, ts: "12:20 IST", gaps: ["Distance to wetland unmeasured", "Blasting permit status unknown"], zone: "nh275-corridor" },
  { id: "INC-4478", modality: "image", domain: "ecology", summary: "Camera trap: rat snakes active during daytime near dried pond", observer: { name: "Forest Dept. CT-14", role: "Camera trap", context: "Karnataka Forest Dept. grid. Maintained monthly. Reserve boundary." }, quality: "high", confidence: 0.91, qualityNotes: ["Automated capture", "Species: Ptyas mucosa (91%)", "Behavior flagged atypical: diurnal"], raw: "CT-14_FRAME_8821.jpg — 12:47 IST", lat: 13.09, lng: 77.58, ts: "12:47 IST", gaps: ["Behavior duration unknown", "Pond status not independently confirmed"], zone: "reserve-edge" },
  { id: "INC-4479", modality: "text", domain: "agriculture", summary: "Crop damage: rodent surge in grain storage, 3 villages", observer: { name: "Officer Ravi", role: "Agri Extension Officer", context: "Filed Form 7B. Based on field visits to 3 villages over 2 days." }, quality: "high", confidence: 0.82, qualityNotes: ["Official government channel", "Physical field inspection", "Damage est. 12% is visual, not measured", "3 of ~15 villages surveyed"], raw: "Form 7B: rodent damage 12%, 3 villages", lat: 13.16, lng: 77.54, ts: "14:00 IST", gaps: ["Rodent species not identified", "Only 3 villages surveyed"], zone: "ramanagara-east" },
  { id: "INC-4480", modality: "sensor", domain: "climate", summary: "Weather station: 23 days no rain, temp +2.3°C anomaly", observer: { name: "IMD RMG-04", role: "IMD Automated Station", context: "Calibrated quarterly. National network." }, quality: "high", confidence: 0.99, qualityNotes: ["National infrastructure", "Calibrated instrument", "Consistent with IMD satellite data"], raw: "IMD_RMG04: rain_23d=0mm, temp=34.2°C, +2.3°C", lat: 13.12, lng: 77.56, ts: "14:30 IST", gaps: ["Single station for entire district"], zone: "ramanagara-east" },
];

const OBSERVATIONS = [
  { id: "OBS-201", label: "Confirmed Cobra Encounter — Bite + Visual", sourceIds: ["INC-4471", "INC-4472"], domains: ["health", "ecology"], confidence: 0.86, quality: "moderate", description: "Farmer's bite report gains weight from ASHA worker's cobra photo 1.2km away and 8 minutes later. But the farmer's species ID is unconfirmed — he said 'looks like cobra.' The photo confirms cobra presence in the area, not necessarily the same individual.", qualityNotes: ["Two independent sources strengthen signal", "Species match is circumstantial", "Spatial proximity suggestive but not conclusive"], tensions: "The photo corroborates cobra presence but doesn't prove same snake. Farmer's description under pain may be unreliable.", gaps: ["No photo of the biting snake", "Same-individual link uncertain"], zones: ["ramanagara-east", "channapatna"] },
  { id: "OBS-202", label: "Unusual Snake Activity Cluster", sourceIds: ["INC-4473", "INC-4475", "INC-4478"], domains: ["ecology"], confidence: 0.62, quality: "low", description: "Three signals suggest increased activity: road crossing, social media sightings, atypical daytime movement on camera trap. But reliability varies wildly — one is a 40-second call from a moving truck.", qualityNotes: ["Camera trap data strong", "Truck sighting weak (fleeting, no photo)", "Social media unverified", "Pattern mainly driven by camera trap"], tensions: "Without truck and social reports, only camera trap remains. 'Cluster' narrative depends on weaker signals.", gaps: ["Seasonal baseline unknown", "Social media village unconfirmed"], zones: ["nh275-corridor", "channapatna", "reserve-edge"] },
  { id: "OBS-203", label: "Health System Under Emerging Pressure", sourceIds: ["INC-4471", "INC-4476"], domains: ["health"], confidence: 0.93, quality: "high", description: "Two snakebite cases in one week at same PHC, anti-venom critically low (3 vials). Nurse's report is professional and cross-referenced. This is a healthcare capacity signal, not just a wildlife observation.", qualityNotes: ["PHC nurse trained, report structured", "Stock count verified", "Two cases/week statistically unusual for this PHC"], tensions: "Both sources strong. External tension: does the health system know this connects to an ecological event?", gaps: ["First bite case details missing", "Regional supply chain status unknown"], zones: ["ramanagara-east"] },
  { id: "OBS-204", label: "Abiotic Stress — Drought + Soil Collapse", sourceIds: ["INC-4474", "INC-4480"], domains: ["agriculture", "climate"], confidence: 0.96, quality: "high", description: "Two automated, calibrated instruments confirm: 23-day drought and rapid soil moisture loss. Strongest observation — minimal human bias, high precision, cross-validated.", qualityNotes: ["Both automated instruments", "IMD nationally calibrated", "⚠️ Soil sensor last maintained 12d ago"], tensions: "Sensors measure point locations. District-wide extrapolation carries uncertainty.", gaps: ["Canal failure cause unknown", "One weather station for entire district"], zones: ["ramanagara-east"] },
  { id: "OBS-205", label: "Habitat Disruption — Construction + Trophic Signal", sourceIds: ["INC-4477", "INC-4479"], domains: ["infrastructure", "agriculture"], confidence: 0.68, quality: "moderate", description: "Highway blasting near wetland + rodent surge in villages. Link is suggestive — habitat disruption can trigger prey-chain cascades — but inferred, not directly observed. Construction video from anonymous whistleblower.", qualityNotes: ["Video GPS matches construction zone", "Crop report via official channel", "Causal link is hypothesis", "Anonymous source limits follow-up"], tensions: "Rodent surge could have other causes. Construction link plausible but unproven.", gaps: ["No direct wildlife displacement observation", "Only 3 villages surveyed"], zones: ["nh275-corridor", "ramanagara-east"] },
];

const PATTERNS = [
  { id: "PAT-301", label: "Human-Snake Conflict Escalation", sourceIds: ["OBS-201", "OBS-202", "OBS-203"], domains: ["health", "ecology"], confidence: 0.78, quality: "moderate", description: "A confirmed bite, an activity cluster, and health system pressure form a pattern of escalating human-snake interaction. Core signal (bite + health) is strong; activity cluster leans on weaker signals.", qualityNotes: ["Core signal strong", "Activity cluster includes unverified social media", "Geographically coherent", "All within 4 hours"], tensions: "Is this an escalation or normal variation noticed because of the bite? Baseline seasonal data would change interpretation significantly.", gaps: ["No historical baseline", "Limited community voice"], zones: ["ramanagara-east", "channapatna", "nh275-corridor", "reserve-edge"] },
  { id: "PAT-302", label: "Environmental Forcing — Drought Driving Displacement", sourceIds: ["OBS-204", "OBS-205"], domains: ["agriculture", "climate", "infrastructure"], confidence: 0.74, quality: "moderate", description: "Drought stress and construction fragmentation could explain increased snake movement into human areas. Abiotic data is strong; causal chain to displacement is inferred.", qualityNotes: ["Environmental measurements high quality", "Causal chain well-established in literature", "Two patterns co-located geographically/temporally"], tensions: "Link to specific snake incidents is correlational, not causal. Multiple forcing factors may interact.", gaps: ["No wildlife movement tracking", "Water body status across district unknown"], zones: ["ramanagara-east", "nh275-corridor"] },
];

const INSIGHTS = [
  { id: "INS-401", label: "Ramanagara: Compound Ecological-Health Risk Emerging", sourceIds: ["PAT-301", "PAT-302"], domains: ["health", "ecology", "agriculture", "climate", "infrastructure"], confidence: 0.71, quality: "moderate", description: "When conflict and forcing patterns are read together: drought and construction are likely stressing habitats, driving encounters, and the health system is already strained. This isn't a snakebite problem — it's an environmental-health system failure unfolding across sectors that don't normally talk to each other.", qualityNotes: ["10 incidents, 5 domains, 6 modalities", "Strongest: health data, sensors, camera trap", "Weakest: anonymous social post, truck sighting", "Would be invisible to any single-domain system"], tensions: "Compelling but built on inference chain. Each link adds uncertainty. A skeptic could call these coincidental co-occurring events. The framework makes the connection visible — it doesn't assert causation.", gaps: ["No epidemiological baseline", "No wildlife corridor mapping", "Limited community voice", "No routing to decision-makers yet"], recommendations: [
    { action: "PHC anti-venom resupply + alert district health officer", urgency: "HIGH", confidence: "Strong — verified stock data", timeline: "Immediate" },
    { action: "Deploy camera traps along construction buffer zone", urgency: "MEDIUM", confidence: "Moderate — single trap + hypothesis", timeline: "48 hours" },
    { action: "Cross-sector briefing: health, forest, irrigation, NHAI", urgency: "HIGH", confidence: "Strong — multiple domains, no coordination", timeline: "72 hours" },
    { action: "Rapid baseline survey: snake activity + water body status", urgency: "MEDIUM", confidence: "Would validate or invalidate the pattern", timeline: "1 week" },
  ], zones: ["ramanagara-east", "channapatna", "nh275-corridor", "reserve-edge"] },
];

const ALL_DATA = { incidents: INCIDENTS, observations: OBSERVATIONS, patterns: PATTERNS, insights: INSIGHTS };

const getZones = (item) => item.zone ? [item.zone] : item.zones || [];

// ── Confidence Gauge (radial, not progress bar) ──
const ConfidenceGauge = ({ value, color, size = 48 }) => {
  const angle = value * 270 - 135;
  const r = size / 2 - 4;
  const cx = size / 2, cy = size / 2;
  const toXY = (a) => ({
    x: cx + r * Math.cos((a - 90) * Math.PI / 180),
    y: cy + r * Math.sin((a - 90) * Math.PI / 180),
  });
  const start = toXY(-135);
  const end = toXY(angle);
  const largeArc = (angle + 135) > 180 ? 1 : 0;
  const pct = (value * 100).toFixed(0);
  const label = value >= 0.85 ? "Strong" : value >= 0.65 ? "Moderate" : value >= 0.45 ? "Weak" : "Very Weak";
  const labelColor = value >= 0.85 ? "#22c55e" : value >= 0.65 ? "#f59e0b" : value >= 0.45 ? "#f97316" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={`M ${toXY(-135).x} ${toXY(-135).y} A ${r} ${r} 0 1 1 ${toXY(135).x} ${toXY(135).y}`} fill="none" stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />
        {value > 0.01 && <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${color}44)` }} />}
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize={size * 0.26} fontWeight="700" fontFamily="monospace">{pct}%</text>
      </svg>
      <span style={{ fontSize: 10, color: labelColor, fontWeight: 600 }}>{label}</span>
    </div>
  );
};

const QBadge = ({ quality }) => {
  const q = QUALITY_LABELS[quality] || QUALITY_LABELS.unverified;
  return <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: q.bg, color: q.color, border: `1px solid ${q.color}33`, fontWeight: 600 }}>{q.label}</span>;
};

// ── Compact Incident Row ──
const IncidentRow = ({ item, isActive, onClick, isAnimating, stageColor }) => (
  <div onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
    background: isActive ? `${stageColor}10` : "transparent",
    borderLeft: `3px solid ${isActive ? stageColor : "transparent"}`,
    cursor: "pointer", transition: "all 0.2s",
    animation: isAnimating ? "rowSlide 0.4s ease-out" : "none",
    borderBottom: "1px solid #1e293b11",
  }}>
    <span style={{ fontSize: 14, width: 20, textAlign: "center", flexShrink: 0 }}>{MODALITY_ICONS[item.modality]}</span>
    <span style={{ fontFamily: "monospace", fontSize: 10, color: stageColor, minWidth: 56, flexShrink: 0 }}>{item.id}</span>
    <span style={{ fontSize: 12, color: isActive ? "#e2e8f0" : "#94a3b8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>{item.summary}</span>
    <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
      {[item.domain].map(d => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: DOMAIN_COLORS[d] }} title={d} />)}
    </div>
    <QBadge quality={item.quality} />
    <ConfidenceGauge value={item.confidence} color={stageColor} size={32} />
  </div>
);

// ── Larger Card for Obs/Pattern/Insight ──
const SignalCard = ({ item, stageColor, isActive, onClick, isAnimating }) => (
  <div onClick={onClick} style={{
    background: isActive ? `${stageColor}10` : "#111827",
    border: `1px solid ${isActive ? stageColor : "#1e293b"}`,
    borderRadius: 8, padding: "10px 12px", cursor: "pointer",
    transition: "all 0.3s",
    animation: isAnimating ? "rowSlide 0.4s ease-out" : "none",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: stageColor, fontWeight: 700 }}>{item.id}</span>
        <QBadge quality={item.quality} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {(item.domains || []).map(d => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: DOMAIN_COLORS[d] }} title={d} />)}
        <ConfidenceGauge value={item.confidence} color={stageColor} size={34} />
      </div>
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3 }}>{item.label}</div>
  </div>
);

export default function SignalComposition() {
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showQuality, setShowQuality] = useState(false);
  const [animIds, setAnimIds] = useState(new Set());
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [zone, setZone] = useState("all");
  const timer = useRef(null);

  const sk = PIPELINE[stage].key;
  const sc = PIPELINE[stage].color;
  const data = ALL_DATA[sk];
  const filtered = zone === "all" ? data : data.filter(d => getZones(d).includes(zone));

  const play = useCallback((s) => {
    const d = ALL_DATA[PIPELINE[s].key];
    setVisible([]); setSelected(null); setShowQuality(false); setAnimIds(new Set());
    let i = 0;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (i < d.length) {
        const item = d[i];
        setVisible(prev => [...prev, item]);
        setAnimIds(prev => new Set([...prev, item.id]));
        setSelected(item);
        setTimeout(() => setAnimIds(prev => { const n = new Set(prev); n.delete(item.id); return n; }), 800);
        i++;
      } else clearInterval(timer.current);
    }, 500);
  }, []);

  const go = (s) => { setStage(s); play(s); };
  useEffect(() => { play(0); return () => clearInterval(timer.current); }, [play]);

  const autoPlay = () => {
    setAutoPlaying(true); setZone("all");
    let s = 0;
    const run = () => {
      setStage(s); play(s);
      setTimeout(() => { s++; if (s < 4) run(); else setAutoPlaying(false); }, ALL_DATA[PIPELINE[s].key].length * 500 + 1500);
    };
    run();
  };

  const visFiltered = zone === "all" ? visible : visible.filter(d => getZones(d).includes(zone));

  const getSources = (item) => {
    if (!item?.sourceIds) return [];
    const prev = stage === 1 ? "incidents" : stage === 2 ? "observations" : stage === 3 ? "patterns" : null;
    return prev ? ALL_DATA[prev].filter(s => item.sourceIds.includes(s.id)) : [];
  };

  // Stats
  const zoneLabel = REGIONS.find(r => r.key === zone)?.label || "All";
  const totalInc = (zone === "all" ? INCIDENTS : INCIDENTS.filter(d => getZones(d).includes(zone))).length;
  const domainsActive = [...new Set((zone === "all" ? INCIDENTS : INCIDENTS.filter(d => getZones(d).includes(zone))).flatMap(d => d.domain ? [d.domain] : d.domains || []))].length;

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>SIGNAL COMPOSITION</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>HOW FIELD INCIDENTS BECOME ACTIONABLE UNDERSTANDING</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Zone Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#475569" }}>ZONE</span>
            <select value={zone} onChange={e => setZone(e.target.value)} style={{
              background: "#111827", border: "1px solid #334155", borderRadius: 5, padding: "5px 10px",
              color: "#e2e8f0", fontSize: 12, cursor: "pointer", outline: "none",
            }}>
              {REGIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
          <button onClick={autoPlay} disabled={autoPlaying} style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid #a855f7", background: autoPlaying ? "#1a1a2e" : "transparent",
            color: "#a855f7", fontSize: 11, cursor: autoPlaying ? "default" : "pointer", opacity: autoPlaying ? 0.5 : 1,
          }}>{autoPlaying ? "⏳ COMPOSING..." : "▶ AUTO-COMPOSE"}</button>
        </div>
      </div>

      {/* Pipeline Nav + Stats */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 24px", borderBottom: "1px solid #1e293b", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {PIPELINE.map((p, i) => (
            <div key={p.key} style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => go(i)} style={{
                padding: "6px 14px", borderRadius: 5,
                border: `1px solid ${stage === i ? p.color : "#1e293b"}`,
                background: stage === i ? `${p.color}15` : "transparent",
                color: stage === i ? p.color : "#64748b",
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <span>{p.icon}</span>{p.label}<span style={{ fontSize: 9, opacity: 0.6 }}>({(zone === "all" ? ALL_DATA[p.key] : ALL_DATA[p.key].filter(d => getZones(d).includes(zone))).length})</span>
              </button>
              {i < 3 && <svg width="28" height="16" style={{ margin: "0 2px" }}><path d="M2 8 L20 8 M15 3 L20 8 L15 13" stroke={stage > i ? PIPELINE[i+1].color : "#334155"} strokeWidth={1.5} fill="none" /></svg>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
          <span style={{ color: "#64748b" }}>Zone: <span style={{ color: "#94a3b8", fontWeight: 600 }}>{zoneLabel}</span></span>
          <span style={{ color: "#64748b" }}>Incidents: <span style={{ color: "#f59e0b", fontFamily: "monospace" }}>{totalInc}</span></span>
          <span style={{ color: "#64748b" }}>Domains: <span style={{ color: "#a855f7", fontFamily: "monospace" }}>{domainsActive}</span></span>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left List */}
        <div style={{ width: 420, borderRight: "1px solid #1e293b", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.06em", padding: "10px 12px 6px" }}>
            {PIPELINE[stage].label.toUpperCase()} — {visFiltered.length}/{filtered.length}
          </div>
          {stage === 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {visFiltered.map(item => (
                <IncidentRow key={item.id} item={item} stageColor={sc}
                  isActive={selected?.id === item.id} onClick={() => { setSelected(item); setShowQuality(false); }}
                  isAnimating={animIds.has(item.id)} />
              ))}
            </div>
          ) : (
            <div style={{ padding: "4px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
              {visFiltered.map(item => (
                <SignalCard key={item.id} item={item} stageColor={sc}
                  isActive={selected?.id === item.id} onClick={() => { setSelected(item); setShowQuality(false); }}
                  isAnimating={animIds.has(item.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Right Detail */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          {selected ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: sc, fontWeight: 700 }}>{selected.id}</span>
                <QBadge quality={selected.quality} />
                {(selected.domain ? [selected.domain] : selected.domains || []).map(d => (
                  <span key={d} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: `${DOMAIN_COLORS[d]}18`, color: DOMAIN_COLORS[d] }}>{d}</span>
                ))}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3 }}>{selected.label || selected.summary}</h2>

              {/* Confidence Gauge large */}
              <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <ConfidenceGauge value={selected.confidence} color={sc} size={56} />
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  Signal reliability based on source quality,<br />corroboration, and data completeness
                </div>
              </div>

              {selected.description && (
                <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.65, marginBottom: 14, padding: 14, background: "#111827", borderRadius: 7, borderLeft: `3px solid ${sc}` }}>
                  {selected.description}
                </div>
              )}

              {/* Observer (incidents) */}
              {selected.observer && (
                <div style={{ marginBottom: 14, padding: 12, background: "#111827", borderRadius: 7, borderLeft: "3px solid #64748b" }}>
                  <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em", marginBottom: 4 }}>WHO REPORTED THIS</div>
                  <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{selected.observer.name} <span style={{ fontWeight: 400, color: "#94a3b8" }}>— {selected.observer.role}</span></div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, lineHeight: 1.5, fontStyle: "italic" }}>{selected.observer.context}</div>
                </div>
              )}

              {selected.raw && (
                <div style={{ marginBottom: 14, padding: 10, background: "#0d1117", borderRadius: 5, fontFamily: "monospace", fontSize: 11, color: "#94a3b8", borderLeft: `3px solid ${sc}44` }}>
                  {selected.modality && <span style={{ marginRight: 6 }}>{MODALITY_ICONS[selected.modality]}</span>}{selected.raw}
                </div>
              )}

              {selected.tensions && (
                <div style={{ marginBottom: 14, padding: 12, background: "#1c120a", borderRadius: 7, borderLeft: "3px solid #f97316" }}>
                  <div style={{ fontSize: 9, color: "#f97316", letterSpacing: "0.05em", marginBottom: 3 }}>⚖️ TENSIONS & UNCERTAINTIES</div>
                  <div style={{ fontSize: 12, color: "#fbbf24", lineHeight: 1.55 }}>{selected.tensions}</div>
                </div>
              )}

              {selected.gaps?.length > 0 && (
                <div style={{ marginBottom: 14, padding: 12, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b" }}>
                  <div style={{ fontSize: 9, color: "#ef4444", letterSpacing: "0.05em", marginBottom: 6 }}>🕳️ WHAT'S MISSING</div>
                  {selected.gaps.map((g, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#94a3b8", padding: "3px 0 3px 14px", borderLeft: "2px solid #ef444444", marginBottom: 3, lineHeight: 1.4 }}>{g}</div>
                  ))}
                </div>
              )}

              {/* Quality drill-down */}
              {selected.qualityNotes && (
                <>
                  <button onClick={() => setShowQuality(!showQuality)} style={{
                    width: "100%", padding: "8px 12px", background: "#111827", border: "1px solid #1e293b", borderRadius: showQuality ? "6px 6px 0 0" : 6,
                    color: "#94a3b8", fontSize: 11, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between",
                  }}>
                    <span>🔍 Data Quality Assessment ({selected.qualityNotes.length})</span>
                    <span>{showQuality ? "▲" : "▼"}</span>
                  </button>
                  {showQuality && (
                    <div style={{ padding: 12, background: "#0f172a", border: "1px solid #1e293b", borderTop: "none", borderRadius: "0 0 6px 6px", marginBottom: 14 }}>
                      {selected.qualityNotes.map((n, i) => (
                        <div key={i} style={{ fontSize: 11, color: n.startsWith("⚠️") ? "#fbbf24" : "#94a3b8", padding: "4px 0 4px 10px", borderLeft: `2px solid ${n.startsWith("⚠️") ? "#f59e0b" : "#334155"}`, marginBottom: 3, lineHeight: 1.4 }}>{n}</div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Recommendations */}
              {selected.recommendations && (
                <div style={{ marginBottom: 14, marginTop: 14 }}>
                  <div style={{ fontSize: 9, color: "#22c55e", letterSpacing: "0.05em", marginBottom: 8 }}>📋 RECOMMENDED ACTIONS</div>
                  {selected.recommendations.map((r, i) => (
                    <div key={i} style={{ padding: "9px 12px", background: "#111827", borderRadius: 6, marginBottom: 5, borderLeft: `3px solid ${r.urgency === "HIGH" ? "#ef4444" : "#f59e0b"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{r.action}</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: "#1e293b", color: "#94a3b8" }}>{r.timeline}</span>
                          <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: r.urgency === "HIGH" ? "#ef444422" : "#f59e0b22", color: r.urgency === "HIGH" ? "#ef4444" : "#f59e0b" }}>{r.urgency}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>{r.confidence}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Lineage */}
              {getSources(selected).length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em", marginBottom: 6 }}>COMPOSED FROM — {PIPELINE[stage - 1]?.label.toUpperCase()}</div>
                  {getSources(selected).map(src => (
                    <div key={src.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "#111827", borderRadius: 5, borderLeft: `3px solid ${PIPELINE[stage-1]?.color}`, marginBottom: 4 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: PIPELINE[stage-1]?.color, minWidth: 56 }}>{src.id}</span>
                      <span style={{ fontSize: 11, color: "#cbd5e1", flex: 1 }}>{src.label || src.summary}</span>
                      <QBadge quality={src.quality} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#334155" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>👁️</div>
                <div style={{ fontSize: 13 }}>Select an item to see its story, sources, and quality</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes rowSlide { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        select option { background: #111827; color: #e2e8f0; }
      `}</style>
    </div>
  );
}
