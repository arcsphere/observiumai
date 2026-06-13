import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "../icons.jsx";

// ═══════════════════════════════════════════════
// CONFIGURE STATS BAR LABELS & MAP HERE
// ═══════════════════════════════════════════════
const MAP_CENTER = [13.12, 77.57];
const MAP_ZOOM = 13;
const MAP_TILE = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
// Alternative tiles:
// "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
// "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  (light theme)
// ═══════════════════════════════════════════════

const MODALITY_ICONS = {
  voice: "voice", image: "image", video: "video", sensor: "sensor", text: "text", social: "social"
};
const MODALITY_COLORS = {
  voice: "#f59e0b", image: "#3b82f6", video: "#8b5cf6", sensor: "#10b981", text: "#6b7280", social: "#ec4899"
};
const DOMAIN_COLORS = {
  health: "#ef4444", ecology: "#22c55e", agriculture: "#f59e0b", climate: "#3b82f6", infrastructure: "#6b7280"
};

const RAW_PULSES = [
  { id: "RP-4471", modality: "voice", domain: "health", lat: 13.12, lng: 77.58, summary: "Farmer reports suspected cobra bite on left ankle near paddy field", observer: "Ramesh K.", locale: "Ramanagara District", confidence: 0.89, raw: "\"saab... haavu kachithu... cobra thara ide... paddy field nalli...\"" },
  { id: "RP-4472", modality: "image", domain: "ecology", lat: 13.13, lng: 77.57, summary: "Image capture: cobra species near irrigation canal, partially shed skin visible", observer: "Lakshmi N. (ASHA worker)", locale: "Channapatna Taluk", confidence: 0.92, raw: "IMG_2847.jpg — 4032×3024, GPS embedded, auto-classified Naja naja" },
  { id: "RP-4473", modality: "voice", domain: "ecology", lat: 13.11, lng: 77.61, summary: "Truck driver reports large snake crossing NH-275 near construction zone", observer: "Manjunath D.", locale: "NH-275 km marker 42", confidence: 0.74, raw: "\"doḍḍa haavu road cross maadthu... truck mundhey...\"" },
  { id: "RP-4474", modality: "sensor", domain: "agriculture", lat: 13.14, lng: 77.55, summary: "Soil moisture sensor anomaly — 40% drop in 72hrs, irrigation canal dry", observer: "IoT Sensor Grid SG-17", locale: "Ramanagara Agri Block", confidence: 0.97, raw: "SENSOR_SG17: moisture=0.12, delta_72h=-0.41, alert_threshold=TRUE" },
  { id: "RP-4475", modality: "social", domain: "ecology", lat: 13.10, lng: 77.59, summary: "Social media post: 'Third snake in our village this week. Never seen this before.'", observer: "@farmlife_karnataka", locale: "Channapatna", confidence: 0.65, raw: "Twitter/X post, 47 engagements, geo-tagged, sentiment: concern" },
  { id: "RP-4476", modality: "voice", domain: "health", lat: 13.15, lng: 77.56, summary: "PHC nurse: second snakebite case this week, anti-venom stock running low", observer: "Nurse Priya S.", locale: "Ramanagara PHC", confidence: 0.95, raw: "\"ivaga 2nd case ee weekalli... anti-venom 3 vials maathra ide...\"" },
  { id: "RP-4477", modality: "video", domain: "infrastructure", lat: 13.13, lng: 77.60, summary: "Video: active blasting at highway expansion site, debris near wetland buffer", observer: "Construction crew (anon)", locale: "NH-275 Expansion Zone", confidence: 0.88, raw: "VID_0093.mp4 — 00:42 duration, GPS embedded, audio: blasting + machinery" },
  { id: "RP-4478", modality: "image", domain: "ecology", lat: 13.09, lng: 77.58, summary: "Camera trap: unusual diurnal movement of rat snakes near dried pond bed", observer: "Forest Dept. Trap CT-14", locale: "Ramanagara Reserve Edge", confidence: 0.91, raw: "CT-14_FRAME_8821.jpg — 12:47 IST, species: Ptyas mucosa, behavior: atypical" },
  { id: "RP-4479", modality: "text", domain: "agriculture", lat: 13.16, lng: 77.54, summary: "Crop damage report: rodent surge in grain storage — possible prey chain disruption", observer: "Agri Extension Officer Ravi", locale: "Ramanagara Block Office", confidence: 0.82, raw: "Form 7B filed: rodent damage est. 12% storage loss, 3 villages affected" },
  { id: "RP-4480", modality: "sensor", domain: "climate", lat: 13.12, lng: 77.56, summary: "Weather station: 23 consecutive days without rainfall, temp anomaly +2.3°C", observer: "IMD Station RMG-04", locale: "Ramanagara AWS", confidence: 0.99, raw: "IMD_RMG04: rain_23d=0mm, temp_avg=34.2°C, anomaly=+2.3°C, humidity=31%" },
];

// ── Leaflet Map Component ──
function LiveMap({ pulses, selectedId, onSelect }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const L = useRef(null);

  // Initialize map
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Dynamically import leaflet
      const leaflet = await import("leaflet");
      if (cancelled) return;
      L.current = leaflet.default || leaflet;

      // Inject Leaflet CSS if not already present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!mapRef.current || mapInstance.current) return;

      const map = L.current.map(mapRef.current, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: false,
        attributionControl: false,
      });

      L.current.tileLayer(MAP_TILE, {
        maxZoom: 18,
        subdomains: "abcd",
      }).addTo(map);

      // Add zoom control to bottom-right
      L.current.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstance.current = map;

      // Force a resize after mount
      setTimeout(() => map.invalidateSize(), 200);
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // Add/update markers when pulses change
  useEffect(() => {
    if (!L.current || !mapInstance.current) return;

    pulses.forEach((p) => {
      if (markersRef.current[p.id]) return; // already added

      const color = MODALITY_COLORS[p.modality];
      const isNew = Date.now() - p.arrivedAt < 5000;
      const size = isNew ? 14 : 10;

      // Create pulsing circle marker
      const icon = L.current.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:${size * 3}px;height:${size * 3}px;display:flex;align-items:center;justify-content:center">
            ${isNew ? `<div style="position:absolute;width:${size * 3}px;height:${size * 3}px;border-radius:50%;background:${color};opacity:0.25;animation:mapPulse 1.5s ease-out 3"></div>` : ""}
            <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 ${isNew ? 12 : 4}px ${color}88;position:relative;z-index:2"></div>
          </div>
        `,
        iconSize: [size * 3, size * 3],
        iconAnchor: [size * 1.5, size * 1.5],
      });

      const marker = L.current.marker([p.lat, p.lng], { icon }).addTo(mapInstance.current);

      // Popup content
      marker.bindPopup(
        `<div style="font-family:Inter,system-ui;font-size:12px;min-width:200px;color:#1e293b">
          <div style="font-weight:700;margin-bottom:4px">${p.id} — ${p.modality}</div>
          <div style="margin-bottom:6px;line-height:1.4">${p.summary}</div>
          <div style="font-size:10px;color:#64748b">
            <div>Observer: ${p.observer}</div>
            <div>Domain: <span style="color:${DOMAIN_COLORS[p.domain]};font-weight:600">${p.domain}</span></div>
            <div>Confidence: ${(p.confidence * 100).toFixed(0)}%</div>
          </div>
        </div>`,
        { maxWidth: 280 }
      );

      marker.on("click", () => onSelect(p));
      markersRef.current[p.id] = marker;
    });
  }, [pulses, onSelect]);

  // Highlight selected
  useEffect(() => {
    if (!mapInstance.current || !selectedId) return;
    const marker = markersRef.current[selectedId];
    if (marker) {
      marker.openPopup();
      mapInstance.current.panTo(marker.getLatLng(), { animate: true, duration: 0.5 });
    }
  }, [selectedId]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0e1a",
        borderRadius: 0,
      }}
    />
  );
}

// ── Main Component ──
export default function LiveFieldFeed() {
  const [pulses, setPulses] = useState([]);
  const [selectedPulse, setSelectedPulse] = useState(null);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

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

  // CONFIGURE STATS BAR
  const STATS_BAR = [
    { label: "PULSES CAPTURED", color: "#60a5fa", value: pulses.length },
    { label: "INPUT MODALITIES", color: "#f59e0b", value: `${[...new Set(pulses.map(p => p.modality))].length}/6` },
    { label: "CROSS-DOMAIN SIGNALS", color: "#a78bfa", value: `${[...new Set(pulses.map(p => p.domain))].length}/6` },
    { label: "AVG CONFIDENCE", color: "#34d399", value: pulses.length ? (pulses.reduce((a, b) => a + b.confidence, 0) / pulses.length).toFixed(2) : "—" },
    { label: "ACTIVE REGION", color: "#94a3b8", value: "RAMANAGARA" },
  ];

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", flex: 1, fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "12px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: isRunning ? "#22c55e" : "#ef4444", boxShadow: isRunning ? "0 0 8px #22c55e" : "0 0 8px #ef4444" }} />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>LIVE FIELD FEED</span>
          <span style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}>FRONTLINE CAPTURE — RAW PULSE INGESTION</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>SPEED</span>
          {[1, 2, 4].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid", borderColor: speed === s ? "#3b82f6" : "#334155", background: speed === s ? "#1e3a5f" : "transparent", color: speed === s ? "#60a5fa" : "#94a3b8", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{s}×</button>
          ))}
          <button onClick={() => setIsRunning(!isRunning)} style={{ padding: "4px 14px", borderRadius: 4, border: "1px solid #334155", background: isRunning ? "#1c1917" : "#14532d", color: isRunning ? "#fbbf24" : "#4ade80", fontSize: 11, cursor: "pointer", marginLeft: 8, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
            {isRunning ? <><Icon name="pause" size={12} /> PAUSE</> : <><Icon name="play" size={12} /> RESUME</>}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "flex", gap: 1, background: "#1e293b" }}>
        {STATS_BAR.map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "8px 16px", background: "#0f172a", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Map */}
        <div style={{ flex: 1, position: "relative", borderRight: "1px solid #1e293b" }}>
          <LiveMap
            pulses={pulses}
            selectedId={selectedPulse?.id}
            onSelect={setSelectedPulse}
          />
          {/* Map overlay label */}
          <div style={{
            position: "absolute", top: 12, left: 12, zIndex: 1000,
            fontSize: 10, color: "#94a3b8", fontFamily: "monospace",
            background: "#0a0e1aCC", padding: "4px 8px", borderRadius: 4,
          }}>
            RAMANAGARA DISTRICT — KARNATAKA
          </div>
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
                <div><span style={{ color: "#64748b" }}>Modality: </span><span style={{ color: MODALITY_COLORS[selectedPulse.modality], display: "inline-flex", alignItems: "center", gap: 4, verticalAlign: "middle" }}><Icon name={MODALITY_ICONS[selectedPulse.modality]} size={12} /> {selectedPulse.modality}</span></div>
                <div><span style={{ color: "#64748b" }}>Confidence: </span><span style={{ color: selectedPulse.confidence > 0.85 ? "#4ade80" : selectedPulse.confidence > 0.7 ? "#fbbf24" : "#f87171" }}>{(selectedPulse.confidence * 100).toFixed(0)}%</span></div>
                <div><span style={{ color: "#64748b" }}>GPS: </span><span style={{ color: "#cbd5e1", fontFamily: "monospace" }}>{selectedPulse.lat}°N, {selectedPulse.lng}°E</span></div>
              </div>
            </div>
          )}

          {/* Scrolling Feed */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px 0" }}>
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
                    <Icon name={MODALITY_ICONS[p.modality]} size={16} color={MODALITY_COLORS[p.modality]} />
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
                <div style={{ marginBottom: 8 }}><Icon name="feed" size={32} color="#334155" /></div>
                <div style={{ fontSize: 12 }}>Awaiting field transmissions...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inject pulse animation for map markers */}
      <style>{`
        @keyframes mapPulse {
          0% { transform: scale(0.3); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        }
        .leaflet-popup-tip {
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
