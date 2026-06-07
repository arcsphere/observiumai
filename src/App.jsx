import { useState } from "react";
import Tab1LiveFeed from "./tabs/Tab1LiveFeed.jsx";
import Tab2Composition from "./tabs/Tab2Composition.jsx";
import Tab3Compound from "./tabs/Tab3Compound.jsx";
import Tab4Routing from "./tabs/Tab4Routing.jsx";
import Tab7Stakeholders from "./tabs/Tab7Stakeholders.jsx";
import Tab5Pipeline from "./tabs/Tab5Pipeline.jsx";
import Tab6Triggers from "./tabs/Tab6Triggers.jsx";
import PitchDeck from "./tabs/PitchDeck.jsx";
import AboutPage from "./tabs/AboutPage.jsx";

// Docs live as a separate, shareable static page (public/docs.html) — not bundled
// into the app model. Deploys to its own URL, e.g. /docs.html.
const DOCS_URL = "/docs.html";

const TABS = [
  { key: "feed", label: "Live Feed", icon: "📡", color: "#f59e0b" },
  { key: "compose", label: "Composition", icon: "👁️", color: "#3b82f6" },
  { key: "compound", label: "Compound", icon: "⚗️", color: "#ec4899" },
  { key: "routing", label: "Routing", icon: "🏛️", color: "#f43f5e" },
  { key: "stakeholders", label: "Stakeholders", icon: "🗺️", color: "#14b8a6" },
  { key: "pipeline", label: "Pipeline", icon: "🔄", color: "#22c55e" },
  { key: "triggers", label: "Triggers", icon: "⚡", color: "#facc15" },
];

const TAB_COMPONENTS = {
  feed: Tab1LiveFeed,
  compose: Tab2Composition,
  compound: Tab3Compound,
  routing: Tab4Routing,
  stakeholders: Tab7Stakeholders,
  pipeline: Tab5Pipeline,
  triggers: Tab6Triggers,
};

export default function App() {
  const [tab, setTab] = useState("feed");
  const [pitchMode, setPitchMode] = useState(false);
  const [aboutMode, setAboutMode] = useState(false);

  // Full-screen pitch deck
  if (pitchMode) {
    return <PitchDeck onExit={() => setPitchMode(false)} />;
  }

  // Full-screen about page
  if (aboutMode) {
    return <AboutPage onExit={() => setAboutMode(false)} />;
  }

  const ActiveTab = TAB_COMPONENTS[tab];

  return (
    <div style={{
      background: "#0a0e1a",
      color: "#e2e8f0",
      minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top Navigation Bar */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        borderBottom: "1px solid #1e293b",
        background: "#060a14",
      }}>
        {/* Logo */}
        <div style={{
          padding: "10px 16px 10px 0",
          borderRight: "1px solid #1e293b",
          marginRight: 8,
        }}>
          <span style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #22c55e, #3b82f6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            OBSERVABILITY
          </span>
          <div style={{ fontSize: 8, color: "#475569", letterSpacing: "0.1em" }}>
            FRAMEWORK v0.1
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: 2, flex: 1, overflow: "auto" }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "10px 14px",
                border: "none",
                borderBottom: `2px solid ${tab === t.key ? t.color : "transparent"}`,
                background: tab === t.key ? `${t.color}08` : "transparent",
                color: tab === t.key ? t.color : "#64748b",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Docs Link — opens the separate, shareable docs page in a new tab */}
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "1px solid #38bdf8",
            background: "#38bdf815",
            color: "#38bdf8",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            marginLeft: 8,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          📚 Docs ↗
        </a>

        {/* Pitch Deck Button */}
        <button
          onClick={() => setPitchMode(true)}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "1px solid #a855f7",
            background: "#a855f715",
            color: "#a855f7",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            marginLeft: 8,
          }}
        >
          🎤 Pitch
        </button>

        {/* About Button */}
        <button
          onClick={() => setAboutMode(true)}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "1px solid #22c55e",
            background: "#22c55e15",
            color: "#22c55e",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            marginLeft: 4,
          }}
        >
          👤 About
        </button>

        {/* Region Label */}
        <div style={{
          fontSize: 9,
          color: "#334155",
          padding: "0 8px",
          whiteSpace: "nowrap",
        }}>
          RAMANAGARA • LIVE
        </div>
      </nav>

      {/* Active Tab Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ActiveTab />
      </div>
    </div>
  );
}
