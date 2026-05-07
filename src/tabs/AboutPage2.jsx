import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════
// ✏️ CONFIGURE YOUR INFO HERE
// ═══════════════════════════════════════════════
const ARJUN = {
  name: "Arjun Shrivatsan",
  role: "Graduate Researcher",
  university: "Northeastern University",
  email: "gurumurthy.ar@northeastern.edu",
  linkedin: "https://linkedin.com/in/arjunshrivatsan", // ✏️ Replace with actual
  // ✏️ Replace with your actual photo — put image in public/ folder
  // e.g. photo: "/arjun-photo.jpg"
  photo: null,
  bio: [
    "Arjun is a transdisciplinary thinker working at the intersection of systems thinking, AI, and ecological governance. His research develops observability protocols — inspired by software engineering and enterprise architecture — that make invisible environmental signals visible, actionable, and accountable.",
    "His approach is distinctive: he begins with uncrystallized field narratives — a farmer's phone call about a snakebite, an ASHA worker's photograph, a truck driver's fleeting sighting — and builds upward through expert elicitation and compositional signal hierarchies toward frameworks with real architectural rigor.",
    "He cares deeply about the gap between data that exists and decisions that get made — and the people who fall into that gap.",
  ],
};

const DINESH = {
  name: "C. Dinesh Kumar",
  role: "Co-Author & Field Domain Expert",
  university: "RV University",
  bio: "Dinesh contributes critical field narration and domain grounding to the framework. His direct experience with frontline ecological incidents — the five snakebite field narrations that anchor the framework's problem statement — shaped the architecture from the ground up. His work ensures the framework stays rooted in the reality of how field data is actually generated: messy, multilingual, under duress, and often invisible to formal systems.",
};

const INNOCENCE_THEORY = {
  name: "Innocence Theory",
  url: "https://innocencetheory.com",
  tagline: "Exploring the questions that matter before the answers arrive",
};

const LINKS = {
  arjunLinkedin: "https://linkedin.com/in/arjunshrivatsan", // ✏️ Replace
  innocenceTheory: "https://innocencetheory.com",
  paper: "https://wbf2026.org", // ✏️ Replace with actual paper/conf link
};
// ═══════════════════════════════════════════════

// Simple QR Code generator using SVG
// Generates a placeholder QR-style pattern — replace with real QR images
function PlaceholderQR({ label, url, size = 140 }) {
  // Generate a deterministic pattern from the URL string
  const hash = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };

  const seed = hash(url || label);
  const grid = 21;
  const cellSize = size / grid;
  const cells = [];

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      // Corner squares (finder patterns)
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= grid - 7;
      const inBottomLeft = r >= grid - 7 && c < 7;

      if (inTopLeft || inTopRight || inBottomLeft) {
        const lr = inTopLeft ? r : inTopRight ? r : r - (grid - 7);
        const lc = inTopLeft ? c : inTopRight ? c - (grid - 7) : c;
        const isOuter = lr === 0 || lr === 6 || lc === 0 || lc === 6;
        const isInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
        if (isOuter || isInner) {
          cells.push({ r, c, fill: true });
        }
      } else {
        // Pseudo-random data pattern
        const val = hash(`${seed}-${r}-${c}`) % 3;
        if (val === 0) cells.push({ r, c, fill: true });
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        background: "#fff", borderRadius: 8, padding: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect width={size} height={size} fill="#fff" />
          {cells.map((cell, i) => (
            <rect
              key={i}
              x={cell.c * cellSize}
              y={cell.r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0a0e1a"
              rx={0.5}
            />
          ))}
        </svg>
      </div>
      <div style={{ fontSize: 10, color: "#64748b", textAlign: "center" }}>
        {label}
      </div>
      {url && (
        <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", maxWidth: size, textAlign: "center", wordBreak: "break-all" }}>
          {url}
        </div>
      )}
    </div>
  );
}

// Photo placeholder with initials
function AvatarPlaceholder({ name, photo, size = 160 }) {
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase();

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #22c55e44",
          boxShadow: "0 0 30px rgba(34,197,94,0.15)",
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #22c55e22, #3b82f622, #a855f722)",
      border: "3px solid #22c55e33",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 800, color: "#94a3b8",
      boxShadow: "0 0 30px rgba(34,197,94,0.1)",
    }}>
      {initials}
    </div>
  );
}

export default function AboutPage({ onExit }) {
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnim(true), 100);
    const handler = (e) => {
      if (e.key === "Escape" && onExit) onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  return (
    <div style={{
      background: "#0a0e1a",
      color: "#e2e8f0",
      width: "100vw",
      minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: "auto",
    }}>
      {/* Exit Button */}
      {onExit && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 100,
        }}>
          <button
            onClick={onExit}
            style={{
              padding: "6px 14px", borderRadius: 6,
              border: "1px solid #334155", background: "#111827",
              color: "#94a3b8", fontSize: 11, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ✕ Exit to Demo
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div style={{
        padding: "60px 40px 40px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0f1729 0%, #0a0e1a 100%)",
        borderBottom: "1px solid #1e293b",
        opacity: anim ? 1 : 0,
        transition: "opacity 0.8s ease 0.2s",
      }}>
        {/* Innocence Theory Logo Area */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          padding: "10px 24px", borderRadius: 10,
          background: "#111827", border: "1px solid #1e293b",
          marginBottom: 24,
        }}>
          {/* ✏️ Replace this div with <img src="/innocence-theory-logo.png" height={40} /> */}
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: "#fff",
          }}>
            IT
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>
              {INNOCENCE_THEORY.name}
            </div>
            <div style={{ fontSize: 10, color: "#64748b" }}>
              {INNOCENCE_THEORY.tagline}
            </div>
          </div>
        </div>

        <h1 style={{
          fontSize: 36, fontWeight: 800, lineHeight: 1.2,
          background: "linear-gradient(135deg, #22c55e, #3b82f6, #a855f7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 8,
        }}>
          AI-Enabled Transdisciplinary Observability Framework
        </h1>
        <div style={{ fontSize: 15, color: "#94a3b8" }}>
          for Biodiversity and Human-Environment Systems
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 12 }}>
          Presented at WBF 2026 &nbsp;•&nbsp; Northeastern University Sustainability Week 2026
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: 1000, margin: "0 auto", padding: "40px 32px",
      }}>
        {/* Arjun Section */}
        <div style={{
          display: "flex", gap: 32, marginBottom: 40,
          opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.5s",
        }}>
          {/* Photo + Contact */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 16, minWidth: 200, flexShrink: 0,
          }}>
            <AvatarPlaceholder name={ARJUN.name} photo={ARJUN.photo} size={160} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>
                {ARJUN.name}
              </div>
              <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, marginTop: 2 }}>
                {ARJUN.role}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                {ARJUN.university}
              </div>
            </div>

            {/* Contact */}
            <div style={{
              display: "flex", flexDirection: "column", gap: 6, width: "100%",
            }}>
              <a href={`mailto:${ARJUN.email}`} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 12px", borderRadius: 6,
                background: "#111827", border: "1px solid #1e293b",
                color: "#94a3b8", fontSize: 11, textDecoration: "none",
              }}>
                <span>📧</span> {ARJUN.email}
              </a>
              <a href={ARJUN.linkedin} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 12px", borderRadius: 6,
                background: "#111827", border: "1px solid #1e293b",
                color: "#3b82f6", fontSize: 11, textDecoration: "none",
              }}>
                <span>💼</span> LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Bio */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.05em", marginBottom: 12 }}>
              ABOUT THE RESEARCHER
            </div>
            {ARJUN.bio.map((p, i) => (
              <p key={i} style={{
                fontSize: 14, color: "#cbd5e1", lineHeight: 1.75,
                marginBottom: 12,
              }}>
                {p}
              </p>
            ))}

            {/* University badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 16px", borderRadius: 8,
              background: "#111827", border: "1px solid #1e293b",
              marginTop: 8,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 6,
                background: "#ef444422", border: "1px solid #ef444444",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: "#ef4444",
              }}>
                N
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
                  Northeastern University
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>Boston, Massachusetts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1e293b", margin: "0 0 32px" }} />

        {/* Dinesh Section */}
        <div style={{
          padding: 24, background: "#111827", borderRadius: 12,
          border: "1px solid #1e293b", marginBottom: 40,
          opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.8s",
        }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <AvatarPlaceholder name={DINESH.name} photo={null} size={80} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>
                {DINESH.name}
              </div>
              <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600, marginTop: 2 }}>
                {DINESH.role}
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "4px 10px", borderRadius: 4,
                background: "#3b82f615", border: "1px solid #3b82f633",
                marginTop: 6, marginBottom: 10,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  background: "#3b82f622",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: "#3b82f6",
                }}>
                  RV
                </div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{DINESH.university}</span>
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
                {DINESH.bio}
              </p>
            </div>
          </div>
        </div>

        {/* QR Codes Section */}
        <div style={{
          opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.1s",
        }}>
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.05em", marginBottom: 16, textAlign: "center" }}>
            CONNECT & EXPLORE
          </div>
          <div style={{
            display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap",
          }}>
            {/* ✏️ Replace PlaceholderQR with <img src="/qr-linkedin.png" /> for real QR codes */}
            <PlaceholderQR
              label="Arjun's LinkedIn"
              url={LINKS.arjunLinkedin}
              size={140}
            />
            <PlaceholderQR
              label="Innocence Theory"
              url={LINKS.innocenceTheory}
              size={140}
            />
            <PlaceholderQR
              label="WBF 2026 Paper"
              url={LINKS.paper}
              size={140}
            />
          </div>
        </div>

        {/* Innocence Theory Section */}
        <div style={{
          marginTop: 40, padding: 24,
          background: "linear-gradient(135deg, #a855f708, #ec489908)",
          borderRadius: 12, border: "1px solid #a855f722",
          textAlign: "center",
          opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.4s",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 12,
          }}>
            {/* ✏️ Replace with <img src="/innocence-theory-logo.png" height={32} /> */}
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#fff",
            }}>
              IT
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>
              {INNOCENCE_THEORY.name}
            </span>
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, maxWidth: 600, margin: "0 auto 16px" }}>
            {INNOCENCE_THEORY.tagline}
          </div>
          <a
            href={INNOCENCE_THEORY.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 20px", borderRadius: 8,
              background: "#a855f718", border: "1px solid #a855f744",
              color: "#a855f7", fontSize: 13, fontWeight: 600,
              textDecoration: "none",
            }}
          >
            🌐 {INNOCENCE_THEORY.url}
          </a>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 40, paddingTop: 20,
          borderTop: "1px solid #1e293b",
          textAlign: "center",
          fontSize: 11, color: "#334155",
          opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.6s",
        }}>
          Northeastern University Sustainability Week 2026 &nbsp;•&nbsp; World Biodiversity Forum 2026
          <br />
          <span style={{ fontSize: 10 }}>
            Built with purpose. Grounded in field reality. Designed for the people who need it most.
          </span>
        </div>
      </div>
    </div>
  );
}
