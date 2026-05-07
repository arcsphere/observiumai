// ═══════════════════════════════════════════════
// SHARED CONSTANTS
// ═══════════════════════════════════════════════

export const DOMAIN_COLORS = {
  health: "#ef4444",
  ecology: "#22c55e",
  agriculture: "#f59e0b",
  climate: "#3b82f6",
  infrastructure: "#6b7280",
  governance: "#a855f7",
};

export const MODALITY_ICONS = {
  voice: "🎙️",
  image: "📷",
  video: "🎥",
  sensor: "📡",
  text: "📝",
  social: "📱",
};

export const MODALITY_COLORS = {
  voice: "#f59e0b",
  image: "#3b82f6",
  video: "#8b5cf6",
  sensor: "#10b981",
  text: "#6b7280",
  social: "#ec4899",
};

export const QUALITY_MAP = {
  high: { label: "HIGH", color: "#22c55e" },
  moderate: { label: "MOD", color: "#f59e0b" },
  low: { label: "LOW", color: "#ef4444" },
  unverified: { label: "UNVRFD", color: "#64748b" },
  emerging: { label: "EMRGNG", color: "#a855f7" },
};

export const URGENCY_COLORS = {
  IMMEDIATE: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#f59e0b",
  LOW: "#64748b",
};

// ═══════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════

export function QualityBadge({ quality }) {
  const q = QUALITY_MAP[quality] || QUALITY_MAP.unverified;
  return (
    <span style={{
      fontSize: 9,
      padding: "1px 6px",
      borderRadius: 3,
      background: `${q.color}18`,
      color: q.color,
      border: `1px solid ${q.color}33`,
      fontWeight: 600,
    }}>
      {q.label}
    </span>
  );
}

export function ConfidenceGauge({ value, color, size = 36 }) {
  const r = size / 2 - 3;
  const cx = size / 2;
  const cy = size / 2;
  const angle = value * 270 - 135;
  const xy = (a) => ({
    x: cx + r * Math.cos((a - 90) * Math.PI / 180),
    y: cy + r * Math.sin((a - 90) * Math.PI / 180),
  });
  const start = xy(-135);
  const end = xy(angle);
  const large = (angle + 135) > 180 ? 1 : 0;
  const label = value >= 0.85 ? "Strong" : value >= 0.65 ? "Mod" : value >= 0.45 ? "Weak" : "V.Weak";
  const labelColor = value >= 0.85 ? "#22c55e" : value >= 0.65 ? "#f59e0b" : value >= 0.45 ? "#f97316" : "#ef4444";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path
          d={`M ${xy(-135).x} ${xy(-135).y} A ${r} ${r} 0 1 1 ${xy(135).x} ${xy(135).y}`}
          fill="none" stroke="#1e293b" strokeWidth={2} strokeLinecap="round"
        />
        {value > 0.01 && (
          <path
            d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
            fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
          />
        )}
        <text
          x={cx} y={cy + 1}
          textAnchor="middle" dominantBaseline="middle"
          fill="#e2e8f0" fontSize={size * 0.28} fontWeight="700" fontFamily="monospace"
        >
          {(value * 100).toFixed(0)}%
        </text>
      </svg>
      <span style={{ fontSize: 8, color: labelColor, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

export function DomainDots({ domains }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {(domains || []).map(d => (
        <span
          key={d}
          title={d}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: DOMAIN_COLORS[d] || "#666",
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

export function DomainTags({ domains }) {
  return (
    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {(domains || []).map(d => (
        <span key={d} style={{
          fontSize: 9,
          padding: "1px 6px",
          borderRadius: 3,
          background: `${DOMAIN_COLORS[d]}18`,
          color: DOMAIN_COLORS[d],
        }}>
          {d}
        </span>
      ))}
    </div>
  );
}

export function SectionBox({ title, titleColor, borderColor, children }) {
  return (
    <div style={{
      marginBottom: 10,
      padding: 10,
      background: "#111827",
      borderRadius: 6,
      borderLeft: `3px solid ${borderColor || "#64748b"}`,
    }}>
      {title && (
        <div style={{
          fontSize: 9,
          color: titleColor || "#64748b",
          letterSpacing: "0.05em",
          marginBottom: 4,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════
// SHARED DATA — INCIDENTS (used by Tab 1, 2, 3)
// ═══════════════════════════════════════════════

export const RAW_PULSES = [
  { id: "RP-4471", modality: "voice", domain: "health", lat: 13.12, lng: 77.58, summary: "Farmer reports suspected cobra bite near paddy field", observer: "Ramesh K.", locale: "Ramanagara", confidence: 0.89, raw: "\"saab... haavu kachithu... cobra thara ide...\"" },
  { id: "RP-4472", modality: "image", domain: "ecology", lat: 13.13, lng: 77.57, summary: "Cobra photographed near irrigation canal", observer: "Lakshmi N. (ASHA)", locale: "Channapatna", confidence: 0.92, raw: "IMG_2847.jpg — GPS embedded, Naja naja" },
  { id: "RP-4473", modality: "voice", domain: "ecology", lat: 13.11, lng: 77.61, summary: "Truck driver: snake crossing NH-275", observer: "Manjunath D.", locale: "NH-275 km42", confidence: 0.74, raw: "\"doḍḍa haavu road cross maadthu...\"" },
  { id: "RP-4474", modality: "sensor", domain: "agriculture", lat: 13.14, lng: 77.55, summary: "Soil moisture 40% drop, canal dry", observer: "IoT SG-17", locale: "Agri Block", confidence: 0.97, raw: "SG17: moisture=0.12, delta=-0.41" },
  { id: "RP-4475", modality: "social", domain: "ecology", lat: 13.10, lng: 77.59, summary: "'Third snake this week. Never seen this.'", observer: "@farmlife_karnataka", locale: "Channapatna", confidence: 0.65, raw: "Twitter/X, 47 engagements" },
  { id: "RP-4476", modality: "voice", domain: "health", lat: 13.15, lng: 77.56, summary: "PHC nurse: 2nd bite, anti-venom critical", observer: "Nurse Priya S.", locale: "Ramanagara PHC", confidence: 0.95, raw: "\"anti-venom 3 vials maathra ide...\"" },
  { id: "RP-4477", modality: "video", domain: "infrastructure", lat: 13.13, lng: 77.60, summary: "Blasting at highway near wetland buffer", observer: "Crew (anon)", locale: "NH-275", confidence: 0.88, raw: "VID_0093.mp4 — GPS embedded" },
  { id: "RP-4478", modality: "image", domain: "ecology", lat: 13.09, lng: 77.58, summary: "Camera trap: daytime rat snake, dried pond", observer: "Forest CT-14", locale: "Reserve Edge", confidence: 0.91, raw: "CT-14 — Ptyas mucosa, diurnal" },
  { id: "RP-4479", modality: "text", domain: "agriculture", lat: 13.16, lng: 77.54, summary: "Crop damage: rodent surge, 3 villages", observer: "Officer Ravi", locale: "Block Office", confidence: 0.82, raw: "Form 7B: 12% loss" },
  { id: "RP-4480", modality: "sensor", domain: "climate", lat: 13.12, lng: 77.56, summary: "23 days no rain, +2.3°C anomaly", observer: "IMD RMG-04", locale: "Ramanagara AWS", confidence: 0.99, raw: "IMD: rain_23d=0mm, +2.3°C" },
];
