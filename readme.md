# ObserviumAI

**A model, a reference architecture, and a protocol for integrated transdisciplinary observability** — detecting compound risks that emerge *between* institutional and disciplinary boundaries, not within any single one.

> Presented at the **World Biodiversity Forum 2026** (Davos, Switzerland) and **AESS 2026**.

---

## Background — the crisis lives in the gaps

A farmer is bitten by a cobra near a paddy field just before harvest. The health centre, if it reports at all, records a snakebite admission. The species — a cobra, near a field, at monsoon onset, 200 metres from a forest edge cleared six months ago for construction — is never recorded. The ecological signal is lost. The agricultural signal is lost. The pattern connecting this bite to seven others in the same zone over three weeks is invisible to every agency individually.

The forest department doesn't know. The agricultural officer doesn't know. The panchayat lead doesn't know. The researcher whose species-distribution model predicted exactly this risk zone doesn't know.

**This is not a data-collection failure — it is an architectural one.** The systems that exist were designed to answer single questions within single mandates. None was designed to ask what one incident means across every domain it touches at once.

### What this costs

India loses an estimated **58,000 people to snakebite every year** — 94% rural, 77% outside health facilities. Official surveillance captures roughly **10%** of expected hospital deaths, before counting the majority that never reach a facility. The ecological and agricultural signals that predict this risk with ~76% accuracy already exist. What's missing is a protocol that connects them at the moment a bite occurs.

### A model, not a product

ObserviumAI v1.0 is a **reference architecture and protocol specification** — not a platform, application, dashboard, or product. The closest analogy is UML: a language for describing how systems should be built, independent of any codebase. Snakebite in Karnataka is the **grounding scenario**, not the subject — the same framework applies to human–wildlife conflict, water contamination, and other crises that span four institutional mandates none of which owns the whole picture.

---

## Architecture — a nine-node signal ontology across three pillars

Every input begins as a raw **Signal** and, through defined transformation steps, becomes **Intelligence** that reaches the right decision-maker at the right time. Nothing is discarded; everything is preserved — which is what lets the system answer, later, questions no one thought to ask at capture.

```
Signal → Incident → Typed Incident → Event → Compound → Reaction → Intelligence → Outcome
  1         2             3            4         5           6            7             8
  │                                                                                     │
  └──────────────── feedback: outcomes recalibrate detection ◀──────────────────────────┘
        Exception Branch (9) — escape route for signals that don't fit, attachable at any node
```

- **Signal → Incident → Typed Incident** — raw input is preserved, given a permanent trace ID, then classified across *every* domain it belongs to simultaneously (a snakebite is a health *and* an ecology incident in one pass).
- **Event** — multiple typed incidents from the same scene bind into one richer, redundant record.
- **Compound** — a cross-domain pattern no single agency sees, bound by spatial, temporal, and **systemic-factor** dimensions.
- **Reaction → Intelligence → Outcome** — a threshold breach fires a new signal, an alarm, and a consequence cascade; the Intelligence layer presents ranked options (AI presents, humans decide); outcomes feed back and recalibrate.

**Three pillars:** 🟢 *Frontline Capture* (Nodes 1–4, any input/modality/observer, offline-first) · 🟠 *Midline Synthesis* (Nodes 5–6, compound formation + systemic factor registry) · 🔴 *Backline Decision-Making* (Nodes 7–8, five-layer stakeholder routing, governance, outcome tracking).

---

## Protocol — what a compliant instantiation must do

ObserviumAI defines the *what*; the implementation is the *how*. A compliant v1.0 instantiation must:

1. Implement all **nine nodes** of the Signal Ontology with the defined transformation rules.
2. Preserve **raw inputs** at Node 1 alongside every structured field added later.
3. Assign and propagate `trace_id` / `span_id` for end-to-end causal reconstruction.
4. Apply **multi-domain simultaneous classification** at Node 3.
5. Implement **three-dimensional binding** at Node 5 with a configurable Systemic Factor Registry.
6. Implement the **five-layer stakeholder routing topology** at Node 7.
7. Enforce **span-level governance** via SHACL over JSON-LD.
8. Implement the **feedback loop** from Node 8 back to Node 1.

**Governance boundary** — regulatory obligations (IHR 2005, CBD Article 26, Sendai thresholds, wildlife-act notifications) are *hardcoded* and non-overridable; the domain taxonomy, systemic factors, binding windows, escalation thresholds, and routing paths are *configurable* per deployment.

**Interoperability principle** — agencies don't need a shared mandate to coordinate; they need a **shared identifier and a delivery contract**. Integration with existing systems (GBIF Darwin Core, WHO IDSR/IDSP, Camtrap DP, iNaturalist, ODK) is via endpoint-relay adaptors — no agency changes its infrastructure.

---

## Features

- 🎙️ **Multimodal capture** — voice, image, video, sensor, text, and Indigenous & Local Knowledge (ILK), any device, any language, online or offline.
- 📶 **Offline-first redundancy** — store-and-forward queues; no incident lost to network failure.
- 🏷️ **Multi-domain typing** — one pass tags an incident across every domain it belongs to.
- ⚗️ **Compound formation** — cross-domain patterns bound by spatial, temporal, and systemic-factor dimensions surface what silos miss.
- 🗺️ **Stakeholder topology** — five routing layers with *defined* and *discovered* stakeholders, plus RACI for the response.
- 🤝 **ILK as first-class data** — under CARE Principles and Local Contexts TK Labels.
- 🔐 **Span-level governance** — attached to processing spans, not flat records: deterministic, auditable, portable.
- 🕰️ **Retroactive queryability** — raw preservation lets old incidents be re-analysed against new models.
- 🔄 **Learning loop** — intervention outcomes recalibrate detection thresholds and binding rules over time.

AI acts as an **operational nervous regulator** — accelerating structuring, classification, pattern recognition, and intelligence synthesis — but it does not make hardcoded/regulatory routing decisions, activate discovered stakeholders without human confirmation, or decide interventions. The framework functions without AI; AI makes it precise, responsive, and scalable.

---

## This prototype

This repository hosts an interactive prototype that visualises the framework through the Ramanagara snakebite scenario:

| View | What it shows |
|---|---|
| **Live Feed** | Multimodal pulses arriving in real time on the map. |
| **Composition** | How messy field data composes into insight with visible quality. |
| **Compound** | Cross-scale, cross-institutional convergence into a compound signal. |
| **Routing** | The five-layer stakeholder topology — who should know, and do they? |
| **Stakeholders** | A living org map of stakeholders by domain and tier, with origin (defined / discovered / gap) and per-stakeholder RACI. |
| **Pipeline** | The full flow, redundancy, and de-duplication. |
| **Triggers** | Risk windows and a live trigger simulator. |
| **Docs** | Standalone documentation — background, architecture, protocol, features, connect. |

Built with React + Vite. Full reference: [`docs/OBSERVIUM_AI_Community_Wiki_v1.0.md`](../docs/OBSERVIUM_AI_Community_Wiki_v1.0.md).

---

## Authors & contact

- **Arjun Shrivatsan** — Graduate Researcher & AI Solutions Architect, Northeastern University (Applied Machine Intelligence) · gurumurthy.ar@northeastern.edu
- **Dinesh Kumar Chandrasekaran** — Associate Professor and Head of Centre of Design Values and Public Imagination, RV University

Developed in collaboration between Northeastern University, RV University, and **Innocence Theory**, grounded in field engagement at the human–wildlife interface in India. Intended for consortium-maintained deployment.

**Cite:** Gurumurthy, A. S. and Chandrasekaran, D. K.: AI-Enabled Transdisciplinary Observability Framework for Biodiversity and Human Environment Systems, World Biodiversity Forum 2026, Davos, Switzerland, 14–19 Jun 2026, WBF2026-527, https://doi.org/10.5194/wbf2026-527, 2026.

*Licensed under Creative Commons Attribution 4.0 International · © 2026 Arjun Shrivatsan & Dinesh Kumar Chandrasekaran.*
