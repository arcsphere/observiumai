import { useState, useMemo } from "react";
import {
  LAYERS, SOURCE_INSIGHT, STAKEHOLDERS, STATUS_STYLES,
  ORIGIN_TYPES, RACI_TYPES, RACI_ORDER,
} from "../stakeholders.js";
import { DOMAIN_COLORS } from "../shared.jsx";
import { Icon } from "../icons.jsx";

const ALL_DOMAINS = ["health", "ecology", "agriculture", "climate", "infrastructure", "governance"];
const layerOf = (key) => LAYERS.find(l => l.key === key);

// ── small presentational bits ──
function RaciChip({ raci, size = 22 }) {
  const r = RACI_TYPES[raci] || RACI_TYPES.I;
  return (
    <span title={`${r.label} — ${r.description}`} style={{
      width: size, height: size, borderRadius: 5, flexShrink: 0,
      background: `${r.color}1f`, border: `1px solid ${r.color}55`, color: r.color,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.5, fontWeight: 800, fontFamily: "monospace",
    }}>{r.key}</span>
  );
}

function OriginTag({ origin }) {
  const o = ORIGIN_TYPES[origin] || ORIGIN_TYPES.defined;
  return (
    <span title={o.description} style={{
      fontSize: 9, padding: "2px 7px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.03em",
      background: `${o.color}18`, color: o.color, border: `1px solid ${o.color}33`,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}><Icon name={o.icon} size={10} color={o.color} /> {o.label.toUpperCase()}</span>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.unaware;
  return <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: s.bg, color: s.color, border: `1px solid ${s.color}33`, fontWeight: 600, letterSpacing: "0.03em" }}>{s.label}</span>;
}

function DomainDots({ domains }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {(domains || []).map(d => <span key={d} title={d} style={{ width: 7, height: 7, borderRadius: "50%", background: DOMAIN_COLORS[d] || "#666" }} />)}
    </div>
  );
}

export default function StakeholderMap() {
  const [list, setList] = useState(STAKEHOLDERS);
  const [view, setView] = useState("categorized");     // categorized | directory
  const [groupBy, setGroupBy] = useState("domain");     // domain | tier  (categorized only)
  const [originFilter, setOriginFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(
    () => originFilter === "all" ? list : list.filter(s => s.origin === originFilter),
    [list, originFilter]
  );

  // ── summaries ──
  const raciCounts = useMemo(() => {
    const c = { A: 0, R: 0, C: 0, I: 0 };
    list.forEach(s => { c[s.raci] = (c[s.raci] || 0) + 1; });
    return c;
  }, [list]);
  const originCounts = useMemo(() => {
    const c = { defined: 0, discovered: 0, gap: 0 };
    list.forEach(s => { c[s.origin] = (c[s.origin] || 0) + 1; });
    return c;
  }, [list]);

  const setRaci = (id, raci) => setList(prev => prev.map(s => s.id === id ? { ...s, raci } : s));

  const addStakeholder = (sh) => {
    setList(prev => [...prev, sh]);
    setShowAdd(false);
  };

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>STAKEHOLDER MAP</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>LIVING ORG MAP FOR THIS PROBLEM CONTEXT — DEFINED, DISCOVERED & INFERRED-GAP ACTORS</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* View toggle */}
          <div style={{ display: "flex", border: "1px solid #1e293b", borderRadius: 6, overflow: "hidden" }}>
            {[["categorized", "categorized", "Categorized"], ["directory", "directory", "Directory"]].map(([k, ic, label]) => (
              <button key={k} onClick={() => setView(k)} style={{
                padding: "6px 14px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit",
                background: view === k ? "#1e293b" : "transparent", color: view === k ? "#e2e8f0" : "#64748b",
                display: "inline-flex", alignItems: "center", gap: 5,
              }}><Icon name={ic} size={12} /> {label}</button>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)} style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid #22c55e", background: "#22c55e15",
            color: "#22c55e", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>＋ Add Stakeholder</button>
        </div>
      </div>

      {/* Scenario strip */}
      <div style={{ padding: "9px 24px", borderBottom: "1px solid #1e293b", background: "#0f172a", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: "#64748b" }}>PROBLEM CONTEXT</span>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#22c55e", fontWeight: 700 }}>{SOURCE_INSIGHT.id}</span>
        <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{SOURCE_INSIGHT.label}</span>
        <span style={{ fontSize: 10, color: "#475569", marginLeft: "auto" }}>RACI simulated for this scenario</span>
      </div>

      {/* Summary bars */}
      <div style={{ display: "flex", gap: 16, padding: "10px 24px", borderBottom: "1px solid #1e293b", flexWrap: "wrap", alignItems: "center" }}>
        {/* RACI summary */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "#475569", letterSpacing: "0.05em" }}>OVERALL RACI</span>
          {RACI_ORDER.map(k => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <RaciChip raci={k} size={20} />
              <span style={{ fontSize: 12, fontWeight: 700, color: RACI_TYPES[k].color, fontFamily: "monospace" }}>{raciCounts[k]}</span>
              <span style={{ fontSize: 9, color: "#64748b" }}>{RACI_TYPES[k].label}</span>
            </div>
          ))}
        </div>
        <div style={{ width: 1, height: 22, background: "#1e293b" }} />
        {/* Origin summary */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "#475569", letterSpacing: "0.05em" }}>ORIGIN</span>
          {Object.values(ORIGIN_TYPES).map(o => (
            <div key={o.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name={o.icon} size={12} color={o.color} />
              <span style={{ fontSize: 12, fontWeight: 700, color: o.color, fontFamily: "monospace" }}>{originCounts[o.key]}</span>
              <span style={{ fontSize: 9, color: "#64748b" }}>{o.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls row: origin filter (+ groupBy when categorized) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 24px", borderBottom: "1px solid #1e293b", flexWrap: "wrap" }}>
        <span style={{ fontSize: 9, color: "#475569", letterSpacing: "0.05em" }}>FILTER</span>
        {["all", "defined", "discovered", "gap"].map(k => {
          const o = ORIGIN_TYPES[k];
          const active = originFilter === k;
          const color = o ? o.color : "#94a3b8";
          return (
            <button key={k} onClick={() => setOriginFilter(k)} style={{
              padding: "4px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
              border: `1px solid ${active ? color : "#1e293b"}`, background: active ? `${color}15` : "transparent",
              color: active ? color : "#64748b",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}>{o ? <><Icon name={o.icon} size={11} color={active ? color : "#64748b"} /> {o.label}</> : "All"} ({k === "all" ? list.length : originCounts[k]})</button>
          );
        })}
        {view === "categorized" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: 9, color: "#475569", letterSpacing: "0.05em" }}>GROUP BY</span>
            {[["domain", "Domain"], ["tier", "Tier of participation"]].map(([k, label]) => (
              <button key={k} onClick={() => setGroupBy(k)} style={{
                padding: "4px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                border: `1px solid ${groupBy === k ? "#94a3b8" : "#1e293b"}`, background: groupBy === k ? "#94a3b815" : "transparent",
                color: groupBy === k ? "#e2e8f0" : "#64748b",
              }}>{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        {view === "directory"
          ? <DirectoryView items={filtered} onSelect={setSelected} onSetRaci={setRaci} />
          : <CategorizedView items={filtered} groupBy={groupBy} onSelect={setSelected} />}
      </div>

      {/* Detail modal */}
      {selected && <DetailModal sh={selected} onClose={() => setSelected(null)} onSetRaci={(r) => { setRaci(selected.id, r); setSelected({ ...selected, raci: r }); }} />}

      {/* Add modal */}
      {showAdd && <AddModal existingCount={list.length} onAdd={addStakeholder} onClose={() => setShowAdd(false)} />}

      <style>{`::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════
// DIRECTORY VIEW — contact-directory cards
// ═══════════════════════════════════════════════
function DirectoryView({ items, onSelect, onSetRaci }) {
  if (items.length === 0) return <Empty />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
      {items.map(sh => (
        <div key={sh.id} onClick={() => onSelect(sh)} style={{
          background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: 14, cursor: "pointer",
          borderLeft: `3px solid ${ORIGIN_TYPES[sh.origin].color}`, transition: "border-color 0.2s",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{sh.name}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{sh.role}</div>
            </div>
            <div onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0 }}>
              <RaciSelect value={sh.raci} onChange={(r) => onSetRaci(sh.id, r)} />
            </div>
          </div>

          {/* contact lines */}
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 11, color: "#cbd5e1", display: "flex", gap: 6, alignItems: "center" }}><Icon name="user" size={12} color="#475569" />{sh.person}</div>
            <div style={{ fontSize: 11, color: "#cbd5e1", display: "flex", gap: 6, alignItems: "center" }}><Icon name="phone" size={12} color="#475569" />{sh.channel}</div>
          </div>

          {/* meta row */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <OriginTag origin={sh.origin} />
            <DomainDots domains={sh.domains} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// CATEGORIZED VIEW — grouped columns
// ═══════════════════════════════════════════════
function CategorizedView({ items, groupBy, onSelect }) {
  if (items.length === 0) return <Empty />;

  const groups = groupBy === "domain"
    ? ALL_DOMAINS.map(d => ({
        key: d, label: d.toUpperCase(), color: DOMAIN_COLORS[d], icon: d,
        members: items.filter(s => s.domains.includes(d)),
      }))
    : LAYERS.map(l => ({
        key: l.key, label: l.label, color: l.color, icon: l.icon, subtitle: l.subtitle,
        members: items.filter(s => s.layer === l.key),
      }));

  const visible = groups.filter(g => g.members.length > 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(visible.length, 5)}, minmax(220px, 1fr))`, gap: 12, alignItems: "start", overflowX: "auto" }}>
      {visible.map(g => (
        <div key={g.key} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ padding: "9px 12px", borderBottom: `2px solid ${g.color}`, background: `${g.color}10`, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name={g.icon} size={13} color={g.color} />
            <span style={{ fontSize: 12, fontWeight: 700, color: g.color, letterSpacing: "0.02em" }}>{g.label}</span>
            <span style={{ fontSize: 10, color: "#475569", marginLeft: "auto", fontFamily: "monospace" }}>{g.members.length}</span>
          </div>
          {g.subtitle && <div style={{ padding: "4px 12px 0", fontSize: 9, color: "#475569" }}>{g.subtitle}</div>}
          <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {g.members.map(sh => (
              <div key={sh.id} onClick={() => onSelect(sh)} style={{
                padding: 9, background: "#0a0e1a", border: "1px solid #1e293b", borderRadius: 6, cursor: "pointer",
                borderLeft: `3px solid ${ORIGIN_TYPES[sh.origin].color}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.25 }}>{sh.name}</span>
                  <RaciChip raci={sh.raci} size={20} />
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{sh.person}</div>
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                  <OriginTag origin={sh.origin} />
                  <DomainDots domains={sh.domains} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// DETAIL MODAL
// ═══════════════════════════════════════════════
function DetailModal({ sh, onClose, onSetRaci }) {
  const layer = layerOf(sh.layer);
  const sts = STATUS_STYLES[sh.status] || STATUS_STYLES.unaware;
  const o = ORIGIN_TYPES[sh.origin];
  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <OriginTag origin={sh.origin} />
        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: `${layer.color}15`, color: layer.color, border: `1px solid ${layer.color}33`, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name={layer.icon} size={10} color={layer.color} /> {layer.label}</span>
        <StatusBadge status={sh.status} />
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25 }}>{sh.name}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>{sh.role}</div>

      {/* RACI editor */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 7, marginBottom: 12 }}>
        <RaciChip raci={sh.raci} size={34} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: RACI_TYPES[sh.raci].color }}>{RACI_TYPES[sh.raci].label}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{RACI_TYPES[sh.raci].description}</div>
        </div>
        <RaciSelect value={sh.raci} onChange={onSetRaci} />
      </div>

      {/* Contact */}
      <Box title={<span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="directory" size={11} /> CONTACT</span>} color="#3b82f6">
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <div><span style={{ color: "#475569" }}>Person: </span>{sh.person}</div>
          <div><span style={{ color: "#475569" }}>Channel: </span>{sh.channel}</div>
          <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {sh.domains.map(d => <span key={d} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${DOMAIN_COLORS[d]}18`, color: DOMAIN_COLORS[d] }}>{d}</span>)}
          </div>
        </div>
      </Box>

      {/* Origin reasoning */}
      <Box title={<span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name={o.icon} size={11} color={o.color} /> WHY THIS STAKEHOLDER — {o.label.toUpperCase()}</span>} color={o.color}>
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6, fontStyle: sh.origin === "gap" ? "italic" : "normal" }}>{sh.originReason}</div>
      </Box>

      {/* Status */}
      <div style={{ padding: 12, borderRadius: 7, marginBottom: 10, background: sts.bg, borderLeft: `3px solid ${sts.color}` }}>
        <div style={{ fontSize: 9, color: sts.color, letterSpacing: "0.05em", marginBottom: 4, fontWeight: 600 }}>CURRENT STATUS: {sts.label}</div>
        <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.55 }}>{sh.statusNote}</div>
      </div>

      {/* Human context */}
      <Box title={<span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="user" size={11} /> THE PERSON BEHIND THE ROLE</span>} color="#64748b">
        <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6, fontStyle: "italic" }}>{sh.humanContext}</div>
      </Box>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════
// ADD MODAL
// ═══════════════════════════════════════════════
function AddModal({ existingCount, onAdd, onClose }) {
  const [f, setF] = useState({
    name: "", role: "", person: "", channel: "",
    layer: "configurable", origin: "discovered", raci: "I",
    domains: [], trigger: "", obligation: "", originReason: "",
  });
  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleDomain = (d) => setF(p => ({ ...p, domains: p.domains.includes(d) ? p.domains.filter(x => x !== d) : [...p.domains, d] }));

  const submit = () => {
    if (!f.name.trim()) return;
    onAdd({
      id: `SH-${String(existingCount + 1).padStart(2, "0")}-NEW`,
      name: f.name.trim(), role: f.role.trim() || "—",
      layer: f.layer, domains: f.domains.length ? f.domains : ["governance"],
      origin: f.origin, raci: f.raci,
      person: f.person.trim() || "—", channel: f.channel.trim() || "—",
      originReason: f.originReason.trim() || ORIGIN_TYPES[f.origin].description,
      trigger: f.trigger.trim() || "—",
      obligation: f.obligation.trim() || "—",
      receives: "—",
      urgency: "MEDIUM", timeframe: "—",
      status: f.origin === "gap" ? "unaware" : "pending",
      statusNote: "Added to the living stakeholder map for this scenario.",
      humanContext: "Newly mapped stakeholder — context to be enriched.",
    });
  };

  const inputStyle = { width: "100%", padding: "7px 9px", background: "#0a0e1a", border: "1px solid #1e293b", borderRadius: 5, color: "#e2e8f0", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" };
  const labelStyle = { fontSize: 9, color: "#64748b", letterSpacing: "0.05em", marginBottom: 4, display: "block" };

  return (
    <Overlay onClose={onClose} title="ADD STAKEHOLDER">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>NAME *</label>
          <input style={inputStyle} value={f.name} onChange={e => upd("name", e.target.value)} placeholder="e.g. Block Education Officer" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>ROLE</label>
          <input style={inputStyle} value={f.role} onChange={e => upd("role", e.target.value)} placeholder="e.g. BEO, Channapatna block" />
        </div>
        <div>
          <label style={labelStyle}>PERSON</label>
          <input style={inputStyle} value={f.person} onChange={e => upd("person", e.target.value)} placeholder="Named contact" />
        </div>
        <div>
          <label style={labelStyle}>CHANNEL</label>
          <input style={inputStyle} value={f.channel} onChange={e => upd("channel", e.target.value)} placeholder="Phone / portal / WhatsApp" />
        </div>
        <div>
          <label style={labelStyle}>TIER OF PARTICIPATION</label>
          <select style={inputStyle} value={f.layer} onChange={e => upd("layer", e.target.value)}>
            {LAYERS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>ORIGIN</label>
          <select style={inputStyle} value={f.origin} onChange={e => upd("origin", e.target.value)}>
            {Object.values(ORIGIN_TYPES).map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>RACI</label>
          <select style={inputStyle} value={f.raci} onChange={e => upd("raci", e.target.value)}>
            {RACI_ORDER.map(k => <option key={k} value={k}>{k} — {RACI_TYPES[k].label}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>DOMAINS</label>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {ALL_DOMAINS.map(d => {
              const on = f.domains.includes(d);
              return <button key={d} onClick={() => toggleDomain(d)} style={{
                padding: "4px 10px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                border: `1px solid ${on ? DOMAIN_COLORS[d] : "#1e293b"}`, background: on ? `${DOMAIN_COLORS[d]}20` : "transparent",
                color: on ? DOMAIN_COLORS[d] : "#64748b",
              }}>{d}</button>;
            })}
          </div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>WHY THIS STAKEHOLDER (REASONING)</label>
          <textarea style={{ ...inputStyle, minHeight: 56, resize: "vertical" }} value={f.originReason} onChange={e => upd("originReason", e.target.value)} placeholder="For gaps: the inference. For discovered: what signal surfaced them." />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
        <button onClick={onClose} style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={submit} disabled={!f.name.trim()} style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid #22c55e", background: f.name.trim() ? "#22c55e20" : "#1e293b", color: f.name.trim() ? "#22c55e" : "#475569", fontSize: 12, fontWeight: 600, cursor: f.name.trim() ? "pointer" : "default", fontFamily: "inherit" }}>＋ Add to Map</button>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════
// shared modal primitives
// ═══════════════════════════════════════════════
function Overlay({ children, onClose, title }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(2,6,16,0.7)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5vh 16px", overflow: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#0a0e1a", border: "1px solid #1e293b", borderRadius: 12, width: "100%", maxWidth: 560, padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: title ? 14 : 4 }}>
          {title ? <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", color: "#e2e8f0" }}>{title}</div> : <span />}
          <button onClick={onClose} style={{ border: "1px solid #334155", background: "#111827", color: "#94a3b8", borderRadius: 5, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center" }}><Icon name="close" size={13} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Box({ title, color, children }) {
  return (
    <div style={{ padding: 12, background: "#0f172a", borderRadius: 7, border: "1px solid #1e293b", borderLeft: `3px solid ${color}`, marginBottom: 10 }}>
      <div style={{ fontSize: 9, color, letterSpacing: "0.05em", marginBottom: 5, fontWeight: 600 }}>{title}</div>
      {children}
    </div>
  );
}

function RaciSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} title="Set RACI role"
      style={{ padding: "4px 6px", background: "#0a0e1a", border: `1px solid ${RACI_TYPES[value].color}55`, borderRadius: 5, color: RACI_TYPES[value].color, fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}>
      {RACI_ORDER.map(k => <option key={k} value={k} style={{ color: "#e2e8f0" }}>{k} · {RACI_TYPES[k].label}</option>)}
    </select>
  );
}

function Empty() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240, color: "#334155" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 8 }}><Icon name="map" size={36} color="#334155" /></div>
        <div style={{ fontSize: 13 }}>No stakeholders match this filter</div>
      </div>
    </div>
  );
}
