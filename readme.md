# Observability Framework — Interactive Demo

## Quick Start

```bash
mkdir observability-demo && cd observability-demo
npm install
npm run dev
```

Then open `http://localhost:5173`

## Project Structure

```
observability-demo/
├── index.html                          ← Copy from artifact "index.html"
├── package.json                        ← Copy from artifact "package.json"  
├── vite.config.js                      ← Copy from artifact "vite.config.js"
└── src/
    ├── main.jsx                        ← Copy from artifact "src/main.jsx"
    ├── App.jsx                         ← Copy from artifact "src/App.jsx"
    ├── shared.jsx                      ← Copy from artifact "src/shared.jsx"
    └── tabs/
        ├── Tab1LiveFeed.jsx            ← Copy from artifact "tab1-live-feed"
        ├── Tab2Composition.jsx         ← Copy from artifact "tab2-signal-assembly"
        ├── Tab3Compound.jsx            ← Copy from artifact "tab3-compound-formation"
        ├── Tab4Routing.jsx             ← Copy from artifact "tab4-stakeholder-routing"
        ├── Tab5Pipeline.jsx            ← Copy from artifact "tab5-pipeline-overview"
        └── Tab6Triggers.jsx            ← Copy from artifact "tab6-trigger-config"
```

## How to Assemble

### Step 1: Create folder structure
```bash
mkdir -p src/tabs
```

### Step 2: Copy root files
- `package.json` — from artifact "package.json"
- `vite.config.js` — from artifact "vite.config.js"  
- `index.html` — from artifact "index.html"

### Step 3: Copy src files
- `src/main.jsx` — from artifact "src/main.jsx"
- `src/App.jsx` — from artifact "src/App.jsx"
- `src/shared.jsx` — from artifact "src/shared.jsx"

### Step 4: Copy tab files
Each tab artifact was built as a standalone `export default` component.
When copying them into the `tabs/` folder, you need ONE small edit per file:

**For each Tab file (Tab1 through Tab6):**

1. Copy the full artifact content into the corresponding file
2. The `export default function` stays as-is — it already exports correctly
3. If the tab uses shared utilities, add this import at the top:

```jsx
import { 
  DOMAIN_COLORS, MODALITY_ICONS, MODALITY_COLORS,
  QUALITY_MAP, QualityBadge, ConfidenceGauge, 
  RAW_PULSES 
} from "../shared.jsx";
```

**However**, each tab was designed to be self-contained with its own data and components inline. So you can also just copy them as-is and they'll work — they have their own local copies of constants. The shared.jsx is there if you want to refactor later.

### Step 5: Install and run
```bash
npm install
npm run dev
```

## Tab-by-Artifact Mapping

| Local File | Claude Artifact Name | Content |
|---|---|---|
| `src/tabs/Tab1LiveFeed.jsx` | `tab1-live-feed` | Animated map, streaming pulses |
| `src/tabs/Tab2Composition.jsx` | `tab2-signal-assembly` | Incident → Insight pipeline |
| `src/tabs/Tab3Compound.jsx` | `tab3-compound-formation` | Cross-scale tier convergence |
| `src/tabs/Tab4Routing.jsx` | `tab4-stakeholder-routing` | Five-layer stakeholder topology |
| `src/tabs/Tab5Pipeline.jsx` | `tab5-pipeline-overview` | Flow animation, redundancy, dedup |
| `src/tabs/Tab6Triggers.jsx` | `tab6-trigger-config` | Risk windows, trigger simulator |

## Demo Walkthrough Order

1. **Live Feed** — The hook. Pulses arrive in real-time on the map.
2. **Composition** — The story. Show how messy data composes with visible quality.
3. **Compound** — The insight. Cross-scale, cross-institutional convergence.
4. **Routing** — The gap. Who should know, and do they?
5. **Pipeline** — The architecture. Full flow, redundancy, dedup.
6. **Triggers** — The configurability. Edit thresholds live, simulate fires.
