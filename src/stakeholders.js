// ═══════════════════════════════════════════════
// SHARED STAKEHOLDER DATA
// Single source of truth for the Routing tab (Tab 4)
// and the Stakeholder Map tab (Tab 7). Edit stakeholders here.
// ═══════════════════════════════════════════════

// ── TIERS OF PARTICIPATION (authority layers) ──
export const LAYERS = [
  { key: "hardcoded", label: "Hardcoded", subtitle: "Mandatory statutory routes — always fire", icon: "lock", color: "#ef4444", description: "Non-negotiable routing. These are legal/statutory obligations that trigger automatically regardless of configuration. Cannot be disabled." },
  { key: "regulatory", label: "Regulatory", subtitle: "Compliance & reporting obligations", icon: "regulatory", color: "#f59e0b", description: "Routes driven by regulatory frameworks, reporting mandates, and compliance requirements. Configurable thresholds, but the obligation to report is fixed." },
  { key: "configurable", label: "Configurable", subtitle: "Org-defined escalation paths", icon: "configurable", color: "#3b82f6", description: "Organization-designed routing rules. Which teams, what thresholds, what channels. Fully customizable per deployment context." },
  { key: "informal", label: "Informal / Flexible", subtitle: "Trust networks & local knowledge", icon: "informal", color: "#a855f7", description: "Community networks, local experts, trusted intermediaries. These routes exist because someone knows someone — and that knowledge is often faster and more effective than formal channels." },
  { key: "broadcast", label: "Broadcast", subtitle: "Public awareness & open alerts", icon: "broadcast", color: "#22c55e", description: "Open dissemination. Media, public dashboards, community alerts. Information becomes publicly available — with appropriate anonymization and sensitivity controls." },
];

// ── INSIGHT this stakeholder context is organized around (from Tab 3) ──
export const SOURCE_INSIGHT = {
  id: "INS-601",
  label: "Ramanagara: Compound Ecological-Health Risk Emerging",
  confidence: 0.68,
  domains: ["health", "ecology", "agriculture", "climate", "infrastructure", "governance"],
};

// ── ORIGIN: how this stakeholder entered the map ──
export const ORIGIN_TYPES = {
  defined:    { key: "defined",    label: "Defined",    short: "DEF", icon: "defined", color: "#3b82f6", description: "Known up front. A statutory, regulatory, or org-defined role identified at design time." },
  discovered: { key: "discovered", label: "Discovered", short: "DSC", icon: "discovered", color: "#22c55e", description: "Surfaced from incoming signals during the scenario — an actor the data revealed, not one we listed in advance." },
  gap:        { key: "gap",        label: "Gap / Inferred", short: "GAP", icon: "gap", color: "#ef4444", description: "A role the system reasons should exist for this problem, but which no one is currently filling or no channel reaches. Identified through inference." },
};

// ── RACI: each stakeholder's role on the current scenario response ──
export const RACI_TYPES = {
  R: { key: "R", label: "Responsible", color: "#22c55e", description: "Does the work — executes the response action on the ground." },
  A: { key: "A", label: "Accountable", color: "#ef4444", description: "Ultimately answerable for the outcome. Owns the decision. (One per effort.)" },
  C: { key: "C", label: "Consulted",   color: "#3b82f6", description: "Two-way input. Provides expertise or must be engaged before action." },
  I: { key: "I", label: "Informed",    color: "#64748b", description: "One-way. Kept in the loop on progress and outcomes." },
};

export const RACI_ORDER = ["A", "R", "C", "I"];

// ── ROUTING STATUS (who's actually engaged vs. blind spots) ──
export const STATUS_STYLES = {
  active: { label: "ACTIVE", color: "#22c55e", bg: "#22c55e15" },
  pending: { label: "PENDING", color: "#f59e0b", bg: "#f59e0b15" },
  partial: { label: "PARTIAL", color: "#f59e0b", bg: "#f59e0b15" },
  partially_active: { label: "PARTIAL", color: "#f59e0b", bg: "#f59e0b15" },
  blocked: { label: "BLOCKED", color: "#ef4444", bg: "#ef444415" },
  unaware: { label: "UNAWARE", color: "#ef4444", bg: "#ef444415" },
  untapped: { label: "UNTAPPED", color: "#a855f7", bg: "#a855f715" },
  nonexistent: { label: "NO CHANNEL", color: "#ef4444", bg: "#ef444415" },
};

// ── STAKEHOLDERS ──
// origin: defined | discovered | gap   ·   raci: R | A | C | I
export const STAKEHOLDERS = [
  // ── HARDCODED ──
  { id: "SH-01", name: "District Health Officer", role: "Chief Medical & Health Officer, Ramanagara", layer: "hardcoded", domains: ["health"],
    origin: "defined", raci: "A",
    person: "Dr. Sunitha M.", channel: "IDSP portal · district office line",
    originReason: "Statutory health authority for the district — identified at design time as the accountable owner for any snakebite cluster.",
    trigger: "≥2 snakebite cases in 7 days at single PHC",
    obligation: "Mandatory notification under Integrated Disease Surveillance Programme (IDSP). Anti-venom redistribution protocol activation.",
    receives: "Case count, PHC stock levels, patient status, GPS cluster map",
    urgency: "IMMEDIATE", timeframe: "Within 1 hour of threshold breach",
    status: "pending", statusNote: "Trigger conditions met. Route not yet fired — no system exists to fire it.",
    humanContext: "Dr. Sunitha M. manages 14 PHCs. Currently unaware of the pattern — she's seen individual case reports but not the cluster or ecological context.",
  },
  { id: "SH-02", name: "District Forest Officer", role: "DFO, Ramanagara Division", layer: "hardcoded", domains: ["ecology"],
    origin: "defined", raci: "R",
    person: "Rajesh K.", channel: "Forest Dept. control room",
    originReason: "Statutory wildlife authority — a defined role under the Wildlife Protection Act whenever displacement evidence exists.",
    trigger: "Camera trap anomaly flagged + wildlife displacement indicators",
    obligation: "Wildlife Protection Act reporting. Habitat disturbance assessment mandate when displacement evidence exists.",
    receives: "Camera trap data, displacement pattern, construction proximity analysis",
    urgency: "IMMEDIATE", timeframe: "Within 4 hours",
    status: "blocked", statusNote: "Camera trap data exists in Forest Dept. system but anomaly flag has not been escalated. Routine processing queue — not prioritized.",
    humanContext: "Rajesh K. is aware of the camera trap network but reviews weekly, not daily. The atypical behavior flag is in a queue of 40+ alerts.",
  },

  // ── REGULATORY ──
  { id: "SH-03", name: "State Disaster Management Authority", role: "SDMA Karnataka — Early Warning Cell", layer: "regulatory", domains: ["climate", "health"],
    origin: "defined", raci: "C",
    person: "Early Warning Cell — duty officer", channel: "SDMA operations desk",
    originReason: "Regulatory early-warning body named at design time; consulted on cross-domain risk under the State Disaster Management Act.",
    trigger: "Compound signal crossing 3+ domains with health impact",
    obligation: "State Disaster Management Act requires early warning dissemination when multi-domain risk patterns are identified.",
    receives: "Compound signal summary, cross-domain impact assessment, recommended response actions",
    urgency: "HIGH", timeframe: "Within 24 hours",
    status: "unaware", statusNote: "No mechanism currently exists to surface cross-domain compound signals to SDMA. They monitor weather and seismic — not ecological-health convergence.",
    humanContext: "SDMA's early warning system is built for cyclones, floods, and earthquakes. Slow-onset ecological signals are outside their current operational model.",
  },
  { id: "SH-04", name: "National Highway Authority", role: "NHAI — NH-275 Project Director", layer: "regulatory", domains: ["infrastructure", "ecology"],
    origin: "discovered", raci: "C",
    person: "Anand V.", channel: "Project office · EIA consultant",
    originReason: "Discovered: a whistleblower construction video near the wetland buffer surfaced NHAI as a relevant actor — not on the original stakeholder list.",
    trigger: "Construction activity within 500m of protected/sensitive habitat with displacement indicators",
    obligation: "Environmental Impact Assessment compliance monitoring. EIA conditions may require construction pause or mitigation measures.",
    receives: "Whistleblower video analysis, wetland buffer assessment, wildlife displacement correlation",
    urgency: "HIGH", timeframe: "Within 48 hours",
    status: "unaware", statusNote: "NHAI has EIA clearance but no real-time environmental monitoring liaison. Compliance is checked on paper, not in the field.",
    humanContext: "Project Director Anand V. is under timeline pressure for NH-275 completion. Environmental compliance is managed by a separate consultant.",
  },

  // ── CONFIGURABLE ──
  { id: "SH-05", name: "District Agriculture Officer", role: "DAO, Ramanagara", layer: "configurable", domains: ["agriculture"],
    origin: "defined", raci: "R",
    person: "via Extension Officer Ravi", channel: "Block agriculture office",
    originReason: "Org-defined response role for crop-loss events — configured into the deployment for this district.",
    trigger: "Crop damage reports ≥3 villages + environmental stress indicators",
    obligation: "Crop loss assessment and farmer compensation process initiation.",
    receives: "Form 7B data, soil moisture trends, rodent surge analysis, drought correlation",
    urgency: "MEDIUM", timeframe: "Within 72 hours",
    status: "partial", statusNote: "Has received Form 7B from Extension Officer Ravi. But sees it as isolated rodent problem — no ecological context provided.",
    humanContext: "The DAO processes dozens of crop damage reports monthly. Without the ecological connection, this is routine paperwork.",
  },
  { id: "SH-06", name: "PHC Medical Officer", role: "MO, Ramanagara Primary Health Centre", layer: "configurable", domains: ["health"],
    origin: "defined", raci: "R",
    person: "Dr. Meena R.", channel: "PHC landline · WhatsApp",
    originReason: "Org-defined frontline clinical responder for snakebite cases — configured per PHC.",
    trigger: "Anti-venom stock ≤5 vials + active bite cases",
    obligation: "Stock replenishment request. Clinical protocol for snakebite management with limited supplies.",
    receives: "Current stock, incoming case projections, nearest anti-venom sources, ecological risk context",
    urgency: "HIGH", timeframe: "Within 4 hours",
    status: "active", statusNote: "Nurse Priya has already filed stock alert through formal channel. MO is aware but treating as supply issue, not ecological event.",
    humanContext: "Dr. Meena R. is the sole doctor at this PHC. She's managing the clinical response but has no visibility into why bites are increasing.",
  },
  { id: "SH-07", name: "Irrigation Department", role: "Executive Engineer, Ramanagara Division", layer: "configurable", domains: ["agriculture", "climate"],
    origin: "gap", raci: "C",
    person: "Executive Engineer (unassigned to this signal)", channel: "Division office — not currently looped in",
    originReason: "Inferred: drought + canal-dry sensor readings imply a water-management role, but that data lives in the agri IoT system. Irrigation has no visibility and was never looped in — a role the signal demands but no one fills.",
    trigger: "Canal dry status + soil moisture critical + drought confirmation",
    obligation: "Water release assessment. Canal maintenance inspection.",
    receives: "Sensor data, canal status, downstream impact on agricultural and ecological systems",
    urgency: "MEDIUM", timeframe: "Within 48 hours",
    status: "unaware", statusNote: "Canal status has not been reported through irrigation channels. Sensor data exists in agricultural IoT system, not irrigation system.",
    humanContext: "The canal drying may be upstream diversion, structural failure, or drought depletion. Each requires different response.",
  },

  // ── INFORMAL ──
  { id: "SH-08", name: "Snake Rescue Network", role: "Ramanagara District Voluntary Rescuers", layer: "informal", domains: ["ecology", "health"],
    origin: "discovered", raci: "R",
    person: "Volunteer coordinator", channel: "WhatsApp group · 12 trained volunteers",
    originReason: "Discovered: clustered social-media snake sightings surfaced an existing volunteer rescue network already responding informally.",
    trigger: "Elevated snake sighting frequency in residential areas",
    obligation: "No formal obligation — voluntary community response network.",
    receives: "Sighting locations, species context, safe handling guidance, PHC contact for bite referrals",
    urgency: "MEDIUM", timeframe: "Within hours (WhatsApp-speed)",
    status: "partially_active", statusNote: "Network members have seen individual social media posts but aren't receiving systematic sighting data. They're responding reactively, not proactively.",
    humanContext: "12 trained volunteers across the district. They already respond to calls — but they could be pre-positioned if they knew the displacement pattern.",
  },
  { id: "SH-09", name: "ASHA Worker Network", role: "Accredited Social Health Activists, Channapatna block", layer: "informal", domains: ["health", "ecology"],
    origin: "discovered", raci: "R",
    person: "Lakshmi N. + block ASHAs", channel: "ASHA WhatsApp · household visits",
    originReason: "Discovered: an ASHA worker captured the cobra photo on her own initiative — surfacing the network as both a sensor and a trusted last-mile channel.",
    trigger: "Health risk in community + ecological context relevant to household-level awareness",
    obligation: "No formal reporting obligation for ecological events. ASHA mandate is maternal/child health — but they are the most trusted frontline presence.",
    receives: "Simple risk advisory: snake activity elevated, precautions, bite first-aid, nearest PHC with anti-venom",
    urgency: "HIGH", timeframe: "Within 24 hours",
    status: "untapped", statusNote: "ASHA workers like Lakshmi N. are already capturing data (she took the cobra photo). But no one is feeding ecological intelligence back to them.",
    humanContext: "Lakshmi took the cobra photo on her own initiative. With context, ASHA workers become both sensors and communicators — a two-way channel.",
  },

  // ── BROADCAST ──
  { id: "SH-10", name: "District Public Dashboard", role: "Ramanagara District Information Portal", layer: "broadcast", domains: ["health", "ecology", "agriculture"],
    origin: "gap", raci: "I",
    person: "— (no owner / channel does not exist)", channel: "Does not exist yet",
    originReason: "Inferred: a confirmed public-safety compound signal implies a duty to inform the public, but no cross-domain district dashboard exists to carry it. The role is required; the channel is missing.",
    trigger: "Compound signal confirmed + public safety relevance",
    obligation: "Right to Information compliance. Public health advisory obligation when community risk is identified.",
    receives: "Anonymized compound signal summary, precautionary advisory, PHC locations with anti-venom status, helpline numbers",
    urgency: "MEDIUM", timeframe: "Within 48 hours of confirmation",
    status: "nonexistent", statusNote: "No district-level dashboard exists for cross-domain ecological-health alerts. Weather warnings exist. Snakebite-ecology convergence has no public information channel.",
    humanContext: "The public currently learns about snakebite risk from news reports after someone dies. There is no anticipatory public advisory mechanism.",
  },
  { id: "SH-11", name: "Local Media & Journalist Network", role: "Ramanagara district correspondents", layer: "broadcast", domains: ["health", "ecology", "infrastructure"],
    origin: "gap", raci: "I",
    person: "District correspondents", channel: "Press contacts — not engaged",
    originReason: "Inferred: an accountability and public-interest angle implies a media role, but no channel has surfaced it. The systemic story is currently untold — usually only after a fatality.",
    trigger: "Compound signal with public interest + accountability angle",
    obligation: "No obligation to route — editorial decision. But media attention can accelerate institutional response.",
    receives: "Press-ready summary: cross-domain convergence, institutional gaps, human impact, data sources (anonymized where needed)",
    urgency: "LOW", timeframe: "5–7 days (after institutional routes have been attempted)",
    status: "unaware", statusNote: "Journalists will find this story eventually — likely after a fatality. The framework could enable proactive, evidence-based reporting before that happens.",
    humanContext: "Local reporters currently cover snakebite as 'crime beat' items — individual tragedies. The systemic story hasn't been told because no one has connected the data.",
  },
];
