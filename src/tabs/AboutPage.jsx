import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════
// ✏️ CONFIGURE YOUR INFO HERE
// ═══════════════════════════════════════════════
const FRAMEWORK_NAME = "OBSERVIUM·AI";
const FRAMEWORK_FULL = "AI-Enabled Transdisciplinary Observability for Biodiversity & Human-Environment Systems";

const ARJUN = {
  name: "Arjun Shrivatsan",
  role: "Graduate Researcher & AI Solutions Architect",
  university: "Northeastern University",
  email: "gurumurthy.ar@northeastern.edu",
  linkedin: "https://linkedin.com/in/arjunshrivatsan", // ✏️ Replace
  photo:  "/arjun-photo.jpg",
  bio: `Arjun Shrivatsan is a technologist, AI solutions architect, and unapologetic multi-hyphenate who has worked across domains ranging from NASA and defense systems to sports and digital innovation. He is currently graduating from the College of Professional Studies in Applied Machine Intelligence and is gearing up to launch Arcsphere, a technology venture focused on cognition, innovation, and thoughtful applied AI.

Alongside his work in technology, Arjun is also a musician and performs with the Boston-based band Box Of Records. He is the founder and co-host of Innocence Theory, a podcast built on curiosity, deep questions, and conversations that connect ideas across disciplines. Over multiple seasons, the show has explored themes spanning ethics, systems, society, design, and human responsibility — including conversations around the Million Death Study.

At heart, Arjun is interested in what happens when intelligence, creativity, and responsibility are all invited into the same room.`,
};

const DINESH = {
  name: "C. Dinesh Kumar",
  role: "Associate Professor & Co-Author",
  university: "RV University",
  bio: `C. Dinesh Kumar is an Associate Professor at RV University with a background in architecture, product design, and systems thinking. His work sits at the intersection of design, education, and human-centered inquiry, with a strong ability to connect abstract ideas to practical action.

As co-host of Innocence Theory, Dinesh brings grounding, depth, and a thoughtful design lens to conversations that range from ethics and technology to learning and society. He has a natural instinct for turning complex subjects into reflective, accessible dialogue without draining them of their richness.

Whether in the classroom, in design, or in conversation, he is deeply interested in how people learn, build, and make meaning. Together, his academic rigor and creative perspective make him a steady and distinctive voice in the podcast.`,
};

const INNOCENCE_THEORY = {
  name: "Innocence Theory",
  url: "https://innocencetheory.com",
  tagline: "Exploring the questions that matter before the answers arrive",
};

const LINKS = {
  arjunLinkedin: "https://linkedin.com/in/arjunshrivatsan",
  innocenceTheory: "https://innocencetheory.com",
  paper: "https://wbf2026.org",
};
// ═══════════════════════════════════════════════

function PlaceholderQR({ label, url, size = 130 }) {
  const hash = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0; return Math.abs(h); };
  const seed = hash(url || label);
  const grid = 21, cellSize = size / grid, cells = [];
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const inTL = r < 7 && c < 7, inTR = r < 7 && c >= grid - 7, inBL = r >= grid - 7 && c < 7;
      if (inTL || inTR || inBL) {
        const lr = inTL ? r : inTR ? r : r - (grid - 7), lc = inTL ? c : inTR ? c - (grid - 7) : c;
        if (lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4)) cells.push({ r, c });
      } else if (hash(`${seed}-${r}-${c}`) % 3 === 0) cells.push({ r, c });
    }
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ background: "#fff", borderRadius: 6, padding: 6, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect width={size} height={size} fill="#fff" />
          {cells.map((cell, i) => <rect key={i} x={cell.c * cellSize} y={cell.r * cellSize} width={cellSize} height={cellSize} fill="#0a0e1a" rx={0.5} />)}
        </svg>
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function Avatar({ name, photo, size = 150 }) {
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase();
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "3px solid #22c55e44", boxShadow: "0 0 30px rgba(34,197,94,0.15)" }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e22, #3b82f622, #a855f722)", border: "3px solid #22c55e33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 800, color: "#94a3b8", boxShadow: "0 0 30px rgba(34,197,94,0.1)" }}>
      {initials}
    </div>
  );
}

function WBFBadge({ size = "normal" }) {
  const isLg = size === "large";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: isLg ? 12 : 8,
      padding: isLg ? "12px 20px" : "8px 14px",
      borderRadius: 8,
      background: "linear-gradient(135deg, #f59e0b12, #22c55e12)",
      border: "1px solid #f59e0b33",
    }}>
      <span style={{ fontSize: isLg ? 24 : 16 }}>🌍</span>
      <div>
        <div style={{ fontSize: isLg ? 14 : 11, fontWeight: 700, color: "#f59e0b" }}>
          World Biodiversity Forum 2026
        </div>
        <div style={{ fontSize: isLg ? 12 : 10, color: "#94a3b8" }}>
          Davos, Switzerland — Oral Presentation
        </div>
      </div>
    </div>
  );
}

export default function AboutPage({ onExit }) {
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnim(true), 100);
    const handler = (e) => { if (e.key === "Escape" && onExit) onExit(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  return (
    <div style={{ background: "#0a0e1a", color: "#e2e8f0", width: "100vw", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", overflow: "auto" }}>
      {onExit && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}>
          <button onClick={onExit} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #334155", background: "#111827", color: "#94a3b8", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✕ Exit to Demo</button>
        </div>
      )}

      {/* Hero */}
      <div style={{ padding: "50px 40px 32px", textAlign: "center", background: "linear-gradient(180deg, #0f1729, #0a0e1a)", borderBottom: "1px solid #1e293b", opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}>
        {/* Innocence Theory Logo */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px", borderRadius: 8, background: "#111827", border: "1px solid #1e293b", marginBottom: 20 }}>
          {/* ✏️ Replace with <img src="/innocence-theory-logo.png" height={36} /> */}
          <div style={{ width: 36, height: 36, borderRadius: 6, background: "linear-gradient(135deg, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>IT</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{INNOCENCE_THEORY.name}</div>
            <div style={{ fontSize: 9, color: "#64748b" }}>{INNOCENCE_THEORY.tagline}</div>
          </div>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, background: "linear-gradient(135deg, #22c55e, #3b82f6, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>
          {FRAMEWORK_NAME} — {FRAMEWORK_FULL}
        </h1>
        <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 16 }}>
          AI-Enabled Transdisciplinary Observability for Biodiversity & Human-Environment Systems
        </div>

        {/* WBF Badge — Prominent */}
        <WBFBadge size="large" />
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 32px" }}>

        {/* ── ARJUN SECTION ── */}
        <div style={{ marginBottom: 36, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }}>
          <div style={{ display: "flex", gap: 28 }}>
            {/* Left: Photo + QR + Contact */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, minWidth: 200, flexShrink: 0 }}>
              <Avatar name={ARJUN.name} photo={ARJUN.photo} size={150} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{ARJUN.name}</div>
                <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginTop: 2 }}>{ARJUN.role}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{ARJUN.university}</div>
              </div>
              <WBFBadge />

              {/* QR Code — right next to bio */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
  <img src="/qr-linkedin.png" width={120} style={{ borderRadius: 8 }} />
  <div style={{ fontSize: 10, color: "#94a3b8" }}>Connect with Arjun</div>
</div>
              {/* Contact links */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
                <a href={`mailto:${ARJUN.email}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 5, background: "#111827", border: "1px solid #1e293b", color: "#94a3b8", fontSize: 10, textDecoration: "none" }}>
                  📧 {ARJUN.email}
                </a>
                <a href={ARJUN.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 5, background: "#111827", border: "1px solid #1e293b", color: "#3b82f6", fontSize: 10, textDecoration: "none" }}>
                  💼 LinkedIn Profile
                </a>
              </div>
            </div>

            {/* Right: Bio */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.05em", marginBottom: 10 }}>ABOUT ARJUN</div>
              {ARJUN.bio.split("\n\n").map((p, i) => (
                <p key={i} style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, marginBottom: 12, margin: "0 0 12px" }}>{p}</p>
              ))}
              {/* University badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 6, background: "#111827", border: "1px solid #1e293b", marginTop: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 5, background: "#ef444422", border: "1px solid #ef444444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#ef4444" }}>N</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Northeastern University</div>
                  <div style={{ fontSize: 9, color: "#64748b" }}>College of Professional Studies • Applied Machine Intelligence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#1e293b", margin: "0 0 28px" }} />

        {/* ── DINESH SECTION ── */}
        <div style={{ padding: 20, background: "#111827", borderRadius: 10, border: "1px solid #1e293b", marginBottom: 36, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 0.8s" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <Avatar name={DINESH.name} photo={null} size={90} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{DINESH.name}</div>
              <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, marginTop: 2 }}>{DINESH.role}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, marginBottom: 6 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 4, background: "#3b82f615", border: "1px solid #3b82f633" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 3, background: "#3b82f622", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#3b82f6" }}>RV</div>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{DINESH.university}</span>
                </div>
                <WBFBadge />
              </div>
              {DINESH.bio.split("\n\n").map((p, i) => (
                <p key={i} style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 10px" }}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ── QR CODES ROW ── */}
        <div style={{ opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.1s", marginBottom: 36 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.05em", marginBottom: 14, textAlign: "center" }}>SCAN TO CONNECT & EXPLORE</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap" }}>
           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
  <img src="/qr-innocence-theory.png" width={130} style={{ borderRadius: 8 }} />
  <div style={{ fontSize: 10, color: "#94a3b8" }}>Innocence Theory</div>
</div>
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
  <img src="/qr-wbf-paper.png" width={130} style={{ borderRadius: 8 }} />
  <div style={{ fontSize: 10, color: "#94a3b8" }}>WBF 2026 Paper</div>
</div>        </div>
        </div>

        {/* ── INNOCENCE THEORY SECTION ── */}
        <div style={{ padding: 20, background: "linear-gradient(135deg, #a855f708, #ec489908)", borderRadius: 10, border: "1px solid #a855f722", textAlign: "center", marginBottom: 32, opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.3s" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 5, background: "linear-gradient(135deg, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>IT</div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>{INNOCENCE_THEORY.name}</span>
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, maxWidth: 550, margin: "0 auto 12px" }}>{INNOCENCE_THEORY.tagline}</div>
          <a href={INNOCENCE_THEORY.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 18px", borderRadius: 6, background: "#a855f718", border: "1px solid #a855f744", color: "#a855f7", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            🌐 {INNOCENCE_THEORY.url}
          </a>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: 16, borderTop: "1px solid #1e293b", textAlign: "center", fontSize: 10, color: "#334155", opacity: anim ? 1 : 0, transition: "opacity 0.8s ease 1.5s" }}>
          Northeastern University Sustainability Week 2026 &nbsp;•&nbsp; World Biodiversity Forum 2026, Davos
          <br />Built with purpose. Grounded in field reality. Designed for the people who need it most.
        </div>
      </div>
    </div>
  );
}
