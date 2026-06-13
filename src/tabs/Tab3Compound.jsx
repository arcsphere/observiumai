import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "../icons.jsx";

// ═══════════════════════════════════════════════
// CONFIGURE INFORMATION TIERS HERE
// ═══════════════════════════════════════════════
const TIERS = [
  { key: "local", label: "Local", subtitle: "Village / Site", icon: "location", color: "#f59e0b", radius: "0–2 km" },
  { key: "zonal", label: "Zonal", subtitle: "Taluk / Block", icon: "zonal", color: "#3b82f6", radius: "2–15 km" },
  { key: "district", label: "District", subtitle: "Ramanagara", icon: "district", color: "#a855f7", radius: "15–50 km" },
  { key: "regional", label: "Regional", subtitle: "South Karnataka", icon: "globe", color: "#22c55e", radius: "50+ km" },
  { key: "institutional", label: "Institutional", subtitle: "Cross-Agency", icon: "institution", color: "#ec4899", radius: "Org scope" },
];

// CONFIGURE PIPELINE STAGES HERE
const STAGES = [
  { key: "observation", label: "Observations", icon: "observe", color: "#3b82f6" },
  { key: "pattern", label: "Patterns", icon: "pattern", color: "#a855f7" },
  { key: "compound", label: "Compounds", icon: "compound", color: "#ec4899" },
  { key: "insight", label: "Insights", icon: "insight", color: "#22c55e" },
];
// ═══════════════════════════════════════════════

const DOMAIN_COLORS = { health: "#ef4444", ecology: "#22c55e", agriculture: "#f59e0b", climate: "#3b82f6", infrastructure: "#6b7280", governance: "#a855f7" };
const Q_LABELS = {
  high: { l: "HIGH", c: "#22c55e" }, moderate: { l: "MOD", c: "#f59e0b" }, low: { l: "LOW", c: "#ef4444" }, unverified: { l: "UNVRFD", c: "#64748b" }, emerging: { l: "EMERGING", c: "#a855f7" },
};

// ── OBSERVATIONS BY TIER ──
const OBSERVATIONS = [
  // LOCAL
  { id: "OBS-L01", tier: "local", label: "Confirmed cobra bite — Ramesh K., paddy field", domains: ["health", "ecology"], quality: "moderate", confidence: 0.86, description: "Farmer bite corroborated by ASHA worker cobra photo 1.2km away. Species match circumstantial — photo confirms area presence, not same individual.", sources: "INC-4471, INC-4472", gaps: ["No photo of biting snake"], institution: null },
  { id: "OBS-L02", tier: "local", label: "Atypical daytime rat snake activity near dried pond", domains: ["ecology"], quality: "high", confidence: 0.91, description: "Camera trap CT-14 captured diurnal Ptyas mucosa. Behavioral anomaly flagged by Forest Dept. monitoring algorithm.", sources: "INC-4478", gaps: ["Duration of behavior unknown", "Pond status unconfirmed independently"], institution: "Forest Dept." },
  { id: "OBS-L03", tier: "local", label: "PHC anti-venom stock critical — 3 vials, 2 cases/week", domains: ["health"], quality: "high", confidence: 0.95, description: "Nurse Priya's report cross-referenced with PHC register. Formal stock alert filed. Two cases in one week is statistically unusual for this centre.", sources: "INC-4471, INC-4476", gaps: ["First case details incomplete"], institution: "PHC Ramanagara" },
  { id: "OBS-L04", tier: "local", label: "Rodent surge in grain storage — 3 villages", domains: ["agriculture"], quality: "high", confidence: 0.82, description: "Agri Extension Officer's Form 7B based on 2-day field inspection. 12% storage loss estimate is visual, not measured. Only 3 of ~15 villages surveyed.", sources: "INC-4479", gaps: ["Rodent species unidentified", "12 villages unvisited"], institution: "Agri Extension" },

  // ZONAL
  { id: "OBS-Z01", tier: "zonal", label: "Snake displacement cluster across Channapatna Taluk", domains: ["ecology"], quality: "low", confidence: 0.62, description: "Three sighting types: road crossing (weak), social media claims (unverified), camera trap anomaly (strong). Pattern depends heavily on camera trap — other sources are fragile.", sources: "INC-4473, INC-4475, INC-4478", gaps: ["No seasonal baseline", "Social media village unconfirmed", "Truck sighting species unknown"], tensions: "Remove truck + social reports and only camera trap remains. 'Cluster' narrative leans on weaker signals.", institution: null },
  { id: "OBS-Z02", tier: "zonal", label: "Soil moisture collapse across Ramanagara agricultural block", domains: ["agriculture", "climate"], quality: "high", confidence: 0.96, description: "IoT sensor SG-17 shows 41% moisture drop in 72hrs, consistent with adjacent SG-16. Canal dry. Corroborated by IMD drought data. Strongest signal in the system — automated, calibrated, cross-validated.", sources: "INC-4474, INC-4480", gaps: ["Canal failure cause unknown", "One weather station for district"], institution: "IMD / IoT Grid" },
  { id: "OBS-Z03", tier: "zonal", label: "Construction blasting within 200m of wetland buffer", domains: ["infrastructure", "ecology"], quality: "moderate", confidence: 0.78, description: "Anonymous whistleblower video from NH-275 expansion. GPS confirms construction zone. Wetland proximity estimated from video. Worker fears retaliation — follow-up limited.", sources: "INC-4477", gaps: ["Exact wetland distance unmeasured", "Permit status unknown", "Anonymous — limited follow-up"], tensions: "Whistleblower context adds credibility to content but limits verification.", institution: "NHAI (implied)" },

  // DISTRICT
  { id: "OBS-D01", tier: "district", label: "23-day drought anomaly with +2.3°C temperature deviation", domains: ["climate"], quality: "high", confidence: 0.99, description: "IMD Station RMG-04 confirms prolonged dry spell and temperature anomaly. Nationally calibrated, satellite-consistent. This is the environmental baseline for all displacement signals.", sources: "INC-4480", gaps: ["Single station — microclimate variation not captured"], institution: "IMD" },
  { id: "OBS-D02", tier: "district", label: "Health system snakebite surge flagged by PHC network", domains: ["health"], quality: "high", confidence: 0.93, description: "District health data shows Ramanagara PHC reporting 2× normal bite rate this week. Anti-venom redistribution not yet triggered. Adjacent PHCs report normal rates — this is localized.", sources: "OBS-L03 (aggregated)", gaps: ["Adjacent PHC detailed data not yet pulled", "District anti-venom buffer stock unknown"], institution: "District Health Office" },

  // REGIONAL
  { id: "OBS-R01", tier: "regional", label: "South Karnataka drought corridor — 4 districts affected", domains: ["climate", "agriculture"], quality: "high", confidence: 0.94, description: "IMD regional data shows Ramanagara is part of a broader drought corridor extending to Mandya, Tumkur, and Hassan. This is not a local anomaly — it's a regional climate event.", sources: "IMD regional aggregation", gaps: ["District-level breakdowns vary in granularity", "Agricultural impact assessments pending for 3 districts"], institution: "IMD Regional / State Agriculture" },

  // INSTITUTIONAL
  { id: "OBS-I01", tier: "institutional", label: "Forest Dept. — no displacement advisory issued despite camera trap anomaly", domains: ["ecology", "governance"], quality: "emerging", confidence: 0.55, description: "Camera trap data exists in Forest Dept. system but hasn't been cross-referenced with health or infrastructure data. The institutional silo means this signal exists but isn't being read in context.", sources: "OBS-L02", gaps: ["No protocol for cross-referencing with health data", "Camera trap alerts go to wildlife division only"], tensions: "The data exists. The observation exists. But it's trapped in a single institutional pipeline.", institution: "Karnataka Forest Dept." },
  { id: "OBS-I02", tier: "institutional", label: "NHAI construction impact — no environmental liaison with Forest/Health", domains: ["infrastructure", "governance"], quality: "emerging", confidence: 0.50, description: "NH-275 expansion has EIA clearance but no ongoing environmental monitoring liaison with Forest Dept. or District Health. Construction impacts on local wildlife corridors are not being tracked in real time.", sources: "OBS-Z03", gaps: ["EIA compliance monitoring status unknown", "No construction-wildlife impact protocol"], institution: "NHAI / MoEFCC" },
];

// ── PATTERNS ──
const PATTERNS = [
  { id: "PAT-C01", tier: "zonal", label: "Human-snake conflict escalation — Channapatna/Ramanagara", domains: ["health", "ecology"], quality: "moderate", confidence: 0.78, description: "Confirmed bite + displacement cluster + PHC strain form a coherent conflict pattern. Core (bite + health) is strong; activity cluster leans on weaker sources. Is this escalation or normal variation noticed because of the bite?", sourceIds: ["OBS-L01", "OBS-Z01", "OBS-L03"], gaps: ["No historical baseline for comparison"], tensions: "Seasonal baseline data would change interpretation significantly." },
  { id: "PAT-C02", tier: "district", label: "Environmental forcing — drought driving habitat stress", domains: ["agriculture", "climate", "infrastructure"], quality: "moderate", confidence: 0.74, description: "Drought, soil collapse, and construction fragment habitats simultaneously. Abiotic data is strong. Causal chain to specific snake displacement is inferred, not observed.", sourceIds: ["OBS-Z02", "OBS-Z03", "OBS-D01"], gaps: ["No wildlife movement tracking data", "Water body survey absent"], tensions: "Correlation is geographic and temporal. Causation requires tracking data we don't have." },
  { id: "PAT-C03", tier: "institutional", label: "Institutional blind spot — data exists but doesn't connect", domains: ["governance"], quality: "emerging", confidence: 0.52, description: "Forest Dept. has camera trap data. Health has bite data. NHAI has construction timelines. Agriculture has crop damage. IMD has drought. None of these systems talk to each other. The pattern is institutional fragmentation — the compound signal is invisible because no single agency can see it.", sourceIds: ["OBS-I01", "OBS-I02"], gaps: ["No cross-agency data sharing protocol", "No common incident identifier"], tensions: "Each agency is doing its job within its mandate. The failure is structural, not individual." },
];

// ── COMPOUNDS ──
const COMPOUNDS = [
  { id: "CMP-501", tier: "district", label: "Ramanagara Compound Signal: Ecological-Health-Infrastructure Convergence",
    domains: ["health", "ecology", "agriculture", "climate", "infrastructure"],
    quality: "moderate", confidence: 0.71,
    description: "When conflict escalation (PAT-C01) and environmental forcing (PAT-C02) are read together across scales: drought and construction stress habitats → snakes displace into human areas → bites increase → health system strains. This compound signal exists at no single tier and in no single agency. It requires cross-scale, cross-institutional reading.",
    sourceIds: ["PAT-C01", "PAT-C02"],
    binding: { spatial: "5 km radius (Ramanagara center)", temporal: "72-hour convergence window", domains: "5 domains", tiers: "Local + Zonal + District", catalysts: "Drought (systemic), Construction (acute)" },
    gaps: ["Wildlife movement data absent", "Only 3/15 villages surveyed", "No cross-agency coordination initiated"],
    tensions: "Built on inference chain. Each link adds uncertainty. Skeptic's view: coincidental co-occurrence. Framework's value: making the connection visible for investigation.",
  },
];

// ── INSIGHTS ──
const INSIGHTS = [
  { id: "INS-601", tier: "regional", label: "Anticipatory Alert: Ramanagara requires cross-sector response coordination",
    domains: ["health", "ecology", "agriculture", "climate", "infrastructure", "governance"],
    quality: "moderate", confidence: 0.68,
    description: "The compound signal, combined with the institutional blind spot pattern, produces a clear insight: the data for an early warning exists but is distributed across agencies that don't share it. Without intervention, the health system will continue reacting to individual bites while the ecological driver remains unaddressed. This is not a prediction — it's a reading of signals already present.",
    sourceIds: ["CMP-501", "PAT-C03"],
    recommendations: [
      { action: "PHC anti-venom resupply + district health officer alert", timeline: "Immediate", urgency: "HIGH", basis: "Verified stock data — actionable now" },
      { action: "Forest Dept. camera trap data shared with District Health", timeline: "24 hours", urgency: "HIGH", basis: "Data exists, just not shared" },
      { action: "Cross-sector briefing: Health, Forest, Irrigation, NHAI", timeline: "72 hours", urgency: "HIGH", basis: "5 domains affected, zero coordination" },
      { action: "Rapid field survey: water bodies + snake activity baseline", timeline: "1 week", urgency: "MEDIUM", basis: "Would validate or invalidate pattern" },
      { action: "NHAI construction-wildlife impact monitoring protocol", timeline: "2 weeks", urgency: "MEDIUM", basis: "Structural gap — prevents future blind spots" },
    ],
    gaps: ["Decision-maker awareness: zero", "No routing mechanism exists yet", "Political will for cross-agency coordination untested"],
    tensions: "The insight is actionable at multiple levels but requires actors who currently have no mandate or incentive to coordinate. The framework surfaces the need — it cannot compel the response.",
  },
];

const ALL = { observation: OBSERVATIONS, pattern: PATTERNS, compound: COMPOUNDS, insight: INSIGHTS };

const QBadge = ({ q }) => { const v = Q_LABELS[q] || Q_LABELS.emerging; return <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${v.c}18`, color: v.c, border: `1px solid ${v.c}33`, fontWeight: 600 }}>{v.l}</span>; };

const Gauge = ({ value, color, size = 36 }) => {
  const r = size / 2 - 3, cx = size / 2, cy = size / 2;
  const angle = value * 270 - 135;
  const xy = (a) => ({ x: cx + r * Math.cos((a - 90) * Math.PI / 180), y: cy + r * Math.sin((a - 90) * Math.PI / 180) });
  const s = xy(-135), e = xy(angle);
  const label = value >= 0.85 ? "Strong" : value >= 0.65 ? "Mod" : value >= 0.45 ? "Weak" : "V.Weak";
  const lc = value >= 0.85 ? "#22c55e" : value >= 0.65 ? "#f59e0b" : value >= 0.45 ? "#f97316" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={`M ${xy(-135).x} ${xy(-135).y} A ${r} ${r} 0 1 1 ${xy(135).x} ${xy(135).y}`} fill="none" stroke="#1e293b" strokeWidth={2.5} strokeLinecap="round" />
        {value > 0.01 && <path d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${(angle+135)>180?1:0} 1 ${e.x} ${e.y}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />}
        <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize={size*0.28} fontWeight="700" fontFamily="monospace">{(value*100).toFixed(0)}%</text>
      </svg>
      <span style={{ fontSize: 8, color: lc, fontWeight: 600 }}>{label}</span>
    </div>
  );
};

const TierBadge = ({ tier }) => {
  const t = TIERS.find(t => t.key === tier);
  if (!t) return null;
  return <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 3, background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}33`, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name={t.icon} size={9} color={t.color} /> {t.label}</span>;
};

export default function CompoundFormation() {
  const [stageIdx, setStageIdx] = useState(0);
  const [tierFilter, setTierFilter] = useState("all");
  const [visible, setVisible] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showQuality, setShowQuality] = useState(false);
  const [animIds, setAnimIds] = useState(new Set());
  const [autoPlaying, setAutoPlaying] = useState(false);
  const timer = useRef(null);

  const sk = STAGES[stageIdx].key;
  const sc = STAGES[stageIdx].color;
  const stageData = ALL[sk];
  const filtered = tierFilter === "all" ? stageData : stageData.filter(d => d.tier === tierFilter || (d.sourceIds && true));

  const play = useCallback((s) => {
    const d = ALL[STAGES[s].key];
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
    }, 600);
  }, []);

  const go = (s) => { setStageIdx(s); play(s); };
  useEffect(() => { play(0); return () => clearInterval(timer.current); }, [play]);

  const autoPlay = () => {
    setAutoPlaying(true); setTierFilter("all");
    let s = 0;
    const run = () => { setStageIdx(s); play(s); setTimeout(() => { s++; if (s < 4) run(); else setAutoPlaying(false); }, ALL[STAGES[s].key].length * 600 + 1800); };
    run();
  };

  const getSources = (item) => {
    if (!item?.sourceIds) return [];
    const prev = stageIdx === 1 ? "observation" : stageIdx === 2 ? "pattern" : stageIdx === 3 ? "compound" : null;
    if (!prev && stageIdx === 3) return [...ALL.compound, ...ALL.pattern].filter(s => item.sourceIds.includes(s.id));
    return prev ? ALL[prev].filter(s => item.sourceIds.includes(s.id)) : [];
  };

  const visFiltered = tierFilter === "all" ? visible : visible.filter(d => d.tier === tierFilter);

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>COMPOUND FORMATION</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>CROSS-SCALE, CROSS-INSTITUTIONAL SIGNAL CONVERGENCE</div>
        </div>
        <button onClick={autoPlay} disabled={autoPlaying} style={{
          padding: "6px 14px", borderRadius: 6, border: "1px solid #ec4899", background: autoPlaying ? "#1a1020" : "transparent",
          color: "#ec4899", fontSize: 11, cursor: autoPlaying ? "default" : "pointer", opacity: autoPlaying ? 0.5 : 1,
          display: "inline-flex", alignItems: "center", gap: 5,
        }}>{autoPlaying ? <><Icon name="hourglass" size={12} /> FORMING...</> : <><Icon name="play" size={12} /> AUTO-COMPOUND</>}</button>
      </div>

      {/* Tier Selector */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 24px", borderBottom: "1px solid #1e293b", gap: 6, overflowX: "auto" }}>
        <span style={{ fontSize: 10, color: "#475569", marginRight: 4, flexShrink: 0 }}>INFORMATION TIER</span>
        <button onClick={() => setTierFilter("all")} style={{
          padding: "4px 12px", borderRadius: 4, border: `1px solid ${tierFilter === "all" ? "#94a3b8" : "#1e293b"}`,
          background: tierFilter === "all" ? "#94a3b815" : "transparent", color: tierFilter === "all" ? "#e2e8f0" : "#64748b",
          fontSize: 11, cursor: "pointer",
        }}>All Tiers</button>
        {TIERS.map(t => (
          <button key={t.key} onClick={() => setTierFilter(t.key)} style={{
            padding: "4px 12px", borderRadius: 4, border: `1px solid ${tierFilter === t.key ? t.color : "#1e293b"}`,
            background: tierFilter === t.key ? `${t.color}15` : "transparent", color: tierFilter === t.key ? t.color : "#64748b",
            fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
          }}>
            <Icon name={t.icon} size={12} color={tierFilter === t.key ? t.color : "#64748b"} /> {t.label} <span style={{ fontSize: 9, opacity: 0.6 }}>({stageData.filter(d => d.tier === t.key).length})</span>
          </button>
        ))}
      </div>

      {/* Stage Nav */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 24px", borderBottom: "1px solid #1e293b" }}>
        {STAGES.map((s, i) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => go(i)} style={{
              padding: "6px 14px", borderRadius: 5, border: `1px solid ${stageIdx === i ? s.color : "#1e293b"}`,
              background: stageIdx === i ? `${s.color}15` : "transparent", color: stageIdx === i ? s.color : "#64748b",
              fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            }}>
              <Icon name={s.icon} size={13} color={stageIdx === i ? s.color : "#64748b"} />{s.label}<span style={{ fontSize: 9, opacity: 0.6 }}>({ALL[s.key].length})</span>
            </button>
            {i < 3 && <svg width="28" height="16" style={{ margin: "0 2px" }}><path d="M2 8 L20 8 M15 3 L20 8 L15 13" stroke={stageIdx > i ? STAGES[i+1].color : "#334155"} strokeWidth={1.5} fill="none" /></svg>}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left List */}
        <div style={{ width: 420, borderRight: "1px solid #1e293b", overflow: "auto", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.06em", padding: "4px 2px" }}>
            {STAGES[stageIdx].label.toUpperCase()} — {visFiltered.length}/{(tierFilter === "all" ? stageData : stageData.filter(d => d.tier === tierFilter)).length}
          </div>
          {visFiltered.map(item => (
            <div key={item.id} onClick={() => { setSelected(item); setShowQuality(false); }}
              style={{
                padding: "9px 11px", borderRadius: 7, cursor: "pointer",
                background: selected?.id === item.id ? `${sc}10` : "#111827",
                border: `1px solid ${selected?.id === item.id ? sc : "#1e293b"}`,
                transition: "all 0.3s",
                animation: animIds.has(item.id) ? "nodeIn 0.4s ease-out" : "none",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: sc, fontWeight: 700 }}>{item.id}</span>
                  <TierBadge tier={item.tier} />
                  <QBadge q={item.quality} />
                </div>
                <Gauge value={item.confidence} color={sc} size={32} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                {(item.domains || []).map(d => <span key={d} style={{ fontSize: 8, padding: "0px 5px", borderRadius: 2, background: `${DOMAIN_COLORS[d]}18`, color: DOMAIN_COLORS[d] }}>{d}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          {selected ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: sc, fontWeight: 700 }}>{selected.id}</span>
                <TierBadge tier={selected.tier} />
                <QBadge q={selected.quality} />
                {(selected.domains || []).map(d => <span key={d} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: `${DOMAIN_COLORS[d]}18`, color: DOMAIN_COLORS[d] }}>{d}</span>)}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3 }}>{selected.label}</h2>

              <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <Gauge value={selected.confidence} color={sc} size={52} />
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                  Signal reliability across sources,<br />corroboration, and institutional reach
                </div>
              </div>

              {selected.institution && (
                <div style={{ marginBottom: 12, padding: "6px 12px", background: "#ec489915", borderRadius: 5, border: "1px solid #ec489933", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "#ec4899" }}>
                  <Icon name="institution" size={12} color="#ec4899" /> {selected.institution}
                </div>
              )}

              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.65, marginBottom: 14, padding: 14, background: "#111827", borderRadius: 7, borderLeft: `3px solid ${sc}` }}>
                {selected.description}
              </div>

              {/* Binding Rules (Compounds) */}
              {selected.binding && (
                <div style={{ marginBottom: 14, padding: 14, background: "#0f172a", borderRadius: 7, border: "1px solid #ec489933" }}>
                  <div style={{ fontSize: 9, color: "#ec4899", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><Icon name="compound" size={11} color="#ec4899" /> COMPOUND BINDING RULES</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {Object.entries(selected.binding).map(([k, v]) => (
                      <div key={k} style={{ padding: "8px 10px", background: "#111827", borderRadius: 5, textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase" }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#ec4899", fontFamily: "monospace", marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.tensions && (
                <div style={{ marginBottom: 14, padding: 12, background: "#1c120a", borderRadius: 7, borderLeft: "3px solid #f97316" }}>
                  <div style={{ fontSize: 9, color: "#f97316", letterSpacing: "0.05em", marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}><Icon name="scale" size={11} /> TENSIONS & UNCERTAINTIES</div>
                  <div style={{ fontSize: 12, color: "#fbbf24", lineHeight: 1.55 }}>{selected.tensions}</div>
                </div>
              )}

              {selected.gaps?.length > 0 && (
                <div style={{ marginBottom: 14, padding: 12, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b" }}>
                  <div style={{ fontSize: 9, color: "#ef4444", letterSpacing: "0.05em", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><Icon name="gap" size={11} /> WHAT'S MISSING</div>
                  {selected.gaps.map((g, i) => <div key={i} style={{ fontSize: 11, color: "#94a3b8", padding: "3px 0 3px 14px", borderLeft: "2px solid #ef444444", marginBottom: 3 }}>{g}</div>)}
                </div>
              )}

              {/* Quality drill-down */}
              {selected.qualityNotes && (
                <>
                  <button onClick={() => setShowQuality(!showQuality)} style={{
                    width: "100%", padding: "8px 12px", background: "#111827", border: "1px solid #1e293b",
                    borderRadius: showQuality ? "6px 6px 0 0" : 6, color: "#94a3b8", fontSize: 11, cursor: "pointer",
                    textAlign: "left", display: "flex", justifyContent: "space-between",
                  }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="search" size={11} /> Data Quality Assessment ({selected.qualityNotes.length})</span>
                    <span>{showQuality ? "▲" : "▼"}</span>
                  </button>
                  {showQuality && (
                    <div style={{ padding: 12, background: "#0f172a", border: "1px solid #1e293b", borderTop: "none", borderRadius: "0 0 6px 6px", marginBottom: 14 }}>
                      {selected.qualityNotes.map((n, i) => {
                        const warn = n.startsWith("(!)");
                        const text = warn ? n.slice(3).trim() : n;
                        return <div key={i} style={{ fontSize: 11, color: warn ? "#fbbf24" : "#94a3b8", padding: "4px 0 4px 10px", borderLeft: `2px solid ${warn ? "#f59e0b" : "#334155"}`, marginBottom: 3 }}>{warn && <Icon name="warning" size={10} color="#f59e0b" style={{ verticalAlign: "-1px", marginRight: 4 }} />}{text}</div>;
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Recommendations */}
              {selected.recommendations && (
                <div style={{ marginBottom: 14, marginTop: 14 }}>
                  <div style={{ fontSize: 9, color: "#22c55e", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><Icon name="clipboard" size={11} /> RECOMMENDED ACTIONS</div>
                  {selected.recommendations.map((r, i) => (
                    <div key={i} style={{ padding: "9px 12px", background: "#111827", borderRadius: 6, marginBottom: 5, borderLeft: `3px solid ${r.urgency === "HIGH" ? "#ef4444" : "#f59e0b"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, flex: 1 }}>{r.action}</span>
                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                          <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: "#1e293b", color: "#94a3b8" }}>{r.timeline}</span>
                          <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: r.urgency === "HIGH" ? "#ef444422" : "#f59e0b22", color: r.urgency === "HIGH" ? "#ef4444" : "#f59e0b" }}>{r.urgency}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>{r.basis}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Source Lineage */}
              {getSources(selected).length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.05em", marginBottom: 6 }}>COMPOSED FROM</div>
                  {getSources(selected).map(src => (
                    <div key={src.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "#111827", borderRadius: 5, borderLeft: `3px solid ${STAGES[stageIdx - 1]?.color || "#64748b"}`, marginBottom: 4 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: STAGES[stageIdx - 1]?.color || "#64748b", minWidth: 56 }}>{src.id}</span>
                      <TierBadge tier={src.tier} />
                      <span style={{ fontSize: 11, color: "#cbd5e1", flex: 1 }}>{src.label}</span>
                      <QBadge q={src.quality} />
                    </div>
                  ))}
                </div>
              )}

              {/* Source string (for observations referencing incidents) */}
              {selected.sources && !selected.sourceIds && (
                <div style={{ marginTop: 14, padding: "8px 12px", background: "#111827", borderRadius: 5, fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>
                  Sources: {selected.sources}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#334155" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 8 }}><Icon name="compound" size={40} color="#334155" /></div>
                <div style={{ fontSize: 13 }}>Select a signal to see cross-scale composition</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes nodeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>
    </div>
  );
}
