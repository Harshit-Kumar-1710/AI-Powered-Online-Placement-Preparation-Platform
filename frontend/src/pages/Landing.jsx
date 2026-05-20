import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

// ── Inject Google Fonts into <head> automatically ─────────────────────────────
// WHY: This means you don't need to touch index.html at all.
// The fonts load as soon as Landing mounts.
function useGoogleFonts() {
  useEffect(() => {
    const id = "placeprep-fonts";
    if (document.getElementById(id)) return; // already loaded

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ── Data ──────────────────────────────────────────────────────────────────────

const companies = [
  {
    name: "Google",
    icon: "G",
    iconColor: "#4285F4",
    style: "Hard",
    focus: "Graphs · DP · Optimization",
    border: "hover:border-blue-500/50",
    glow: "hover:shadow-blue-500/10",
  },
  {
    name: "Amazon",
    icon: "A",
    iconColor: "#FF9900",
    style: "Medium-Hard",
    focus: "Trees · Arrays · STAR HR",
    border: "hover:border-orange-500/50",
    glow: "hover:shadow-orange-500/10",
  },
  {
    name: "Microsoft",
    icon: "M",
    iconColor: "#00A4EF",
    style: "Medium",
    focus: "Arrays · OOP · Team Fit",
    border: "hover:border-cyan-500/50",
    glow: "hover:shadow-cyan-500/10",
  },
  {
    name: "JP Morgan",
    icon: "JP",
    iconColor: "#B8A47A",
    style: "Medium",
    focus: "SQL · Quant · CS Basics",
    border: "hover:border-yellow-500/50",
    glow: "hover:shadow-yellow-500/10",
  },
  {
    name: "General",
    icon: "∞",
    iconColor: "#9CA3AF",
    style: "Adaptive",
    focus: "All Topics · Mixed HR",
    border: "hover:border-gray-400/50",
    glow: "hover:shadow-gray-400/10",
  },
];

const rounds = [
  {
    num: "01",
    name: "Aptitude",
    desc: "30 questions · Timed · Quant + Logical + Verbal",
    icon: "🧮",
    accent: "#FBBF24",
  },
  {
    num: "02",
    name: "Coding",
    desc: "DSA problems · Monaco Editor · Judge0 Compiler",
    icon: "💻",
    accent: "#60A5FA",
  },
  {
    num: "03",
    name: "Technical",
    desc: "AI Interview · Adaptive Difficulty · Resume-Linked",
    icon: "🤖",
    accent: "#C084FC",
  },
  {
    num: "04",
    name: "HR Round",
    desc: "Behavioral Questions · Confidence Analysis · STAR",
    icon: "🎯",
    accent: "#34D399",
  },
];

const aiFeatures = [
  {
    icon: "🔗",
    title: "Resume ↔ Interview Linking",
    desc: "Upload your resume — get questions on your exact projects and tech stack.",
    tag: "Smart",
  },
  {
    icon: "📈",
    title: "Adaptive Difficulty",
    desc: "Strong answer → harder follow-up. Weak answer → simpler question. Real-time.",
    tag: "Live",
  },
  {
    icon: "🧠",
    title: "Follow-up Questions",
    desc: "Mention React, get asked about hooks. Mention SQL, get asked about JOINs.",
    tag: "AI",
  },
  {
    icon: "💬",
    title: "Confidence Analysis",
    desc: "Flags hesitation words like 'maybe', 'I think', 'not sure' in your answers.",
    tag: "NLP",
  },
  {
    icon: "📊",
    title: "Weak Topic Detection",
    desc: "Tracks mistakes across DSA, aptitude, and interviews to find blind spots.",
    tag: "ML",
  },
  {
    icon: "📅",
    title: "7-Day Study Plan",
    desc: "AI generates a personalized daily plan based on your weak areas.",
    tag: "Auto",
  },
  {
    icon: "📄",
    title: "Resume Analyzer",
    desc: "ATS score, missing keywords, skill gaps, and actionable improvements.",
    tag: "ATS",
  },
  {
    icon: "🏆",
    title: "Performance Reports",
    desc: "Round-wise scores, strengths, weaknesses, and improvement roadmap.",
    tag: "PDF",
  },
];

const modules = [
  { icon: "🧩", name: "DSA Practice", desc: "Topic-wise with AI hints" },
  { icon: "📐", name: "Aptitude Quiz", desc: "Timed MCQs · instant scoring" },
  { icon: "📚", name: "Core Subjects", desc: "DBMS · OS · OOPs · CN" },
  { icon: "⚡", name: "Compiler", desc: "C++ · Java · Python IDE" },
  { icon: "🎤", name: "Mock Interview", desc: "Standalone AI interview" },
];

const stats = [
  { value: "15+", label: "Core Features" },
  { value: "9", label: "AI Touchpoints" },
  { value: "4", label: "Placement Rounds" },
  { value: "₹0", label: "Cost to Use" },
];

// ── Styles injected as a <style> tag ──────────────────────────────────────────
// WHY: Tailwind can't express every CSS property (like background-clip on
// animated gradients, custom scrollbars, keyframes). We put those here.
const globalStyles = `
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body, .placeprep-root {
    font-family: 'Outfit', sans-serif;
    background: #04070f;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0a0f1e; }
  ::-webkit-scrollbar-thumb { background: #1d3461; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #2563eb; }

  /* Shimmer headline */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .shimmer-text {
    background: linear-gradient(90deg,
      #60a5fa 0%, #a78bfa 20%, #22d3ee 40%,
      #a78bfa 60%, #60a5fa 80%, #a78bfa 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  /* Fade-in-up for hero */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-in     { animation: fadeInUp 0.7s ease forwards; }
  .fade-in-1   { animation: fadeInUp 0.7s ease 0.15s forwards; opacity: 0; }
  .fade-in-2   { animation: fadeInUp 0.7s ease 0.30s forwards; opacity: 0; }
  .fade-in-3   { animation: fadeInUp 0.7s ease 0.45s forwards; opacity: 0; }
  .fade-in-4   { animation: fadeInUp 0.7s ease 0.60s forwards; opacity: 0; }

  /* Card glow on hover */
  .glow-card { transition: all 0.25s ease; }
  .glow-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 0 1px rgba(59,130,246,0.25),
                0 12px 40px rgba(59,130,246,0.08);
  }

  /* Gradient border (no extra wrapper needed) */
  .grad-border {
    position: relative;
  }
  .grad-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg,
      rgba(59,130,246,0.4),
      rgba(139,92,246,0.4),
      rgba(6,182,212,0.4)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* Subtle noise overlay — gives depth like Vercel/Linear */
  .noise::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
  }

  /* Mono font for code/terminal snippets */
  .font-mono-custom {
    font-family: 'Fira Code', monospace;
  }

  /* Number outline style for big stats */
  .stat-number {
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    letter-spacing: -0.03em;
  }
`;

// ── Sub-components ────────────────────────────────────────────────────────────

function Pill({ children, color = "blue" }) {
  const colors = {
    blue:   "bg-blue-500/10 border-blue-500/25 text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/25 text-purple-400",
    green:  "bg-green-500/10 border-green-500/25 text-green-400",
    orange: "bg-orange-500/10 border-orange-500/25 text-orange-400",
    cyan:   "bg-cyan-500/10 border-cyan-500/25 text-cyan-400",
  };
  return (
    <span className={`inline-flex items-center gap-2 border text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide ${colors[color]}`}>
      {children}
    </span>
  );
}

function SectionHeading({ pill, pillColor, title, highlight, subtitle }) {
  return (
    <div className="text-center mb-16 space-y-4">
      {pill && <Pill color={pillColor}>{pill}</Pill>}
      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
        {title}{" "}
        {highlight && <span className="shimmer-text">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ isLoggedIn }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#04070f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">P</span>
          </div>
          <span className="font-black text-lg text-white tracking-tight">
            PlacePrep <span className="text-blue-400">AI</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          {["Features", "Simulation", "Companies", "Practice"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-500 hover:text-white text-sm transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative pt-36 pb-28 px-6 text-center overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, #2563eb 0%, transparent 70%)" }} />
        <div className="absolute top-32 left-1/4 w-[350px] h-[350px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
        <div className="absolute top-32 right-1/4 w-[350px] h-[350px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #0891b2 0%, transparent 70%)" }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Badge */}
        <div className="fade-in flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-blue-500/8 border border-blue-500/20 text-blue-400 text-sm px-5 py-2 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            AI-Powered · Free Forever · Gemini Inside
          </span>
        </div>

        {/* Headline */}
        <h1 className="fade-in-1 text-5xl md:text-[5.5rem] font-black text-white leading-[1.0] tracking-[-0.02em] mb-7">
          Prepare Smarter.<br />
          <span className="shimmer-text">Get Placed Faster.</span>
        </h1>

        <p className="fade-in-2 text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The only platform that simulates a complete{" "}
          <span className="text-white font-semibold">4-round placement process</span> —
          Aptitude → Coding → Technical → HR — with AI that adapts to your answers in real-time.
        </p>

        {/* CTA */}
        <div className="fade-in-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-9 py-4 rounded-xl text-lg transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/30"
          >
            🚀 Start Full Simulation
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/6 text-white font-semibold px-9 py-4 rounded-xl text-lg transition-all"
          >
            📊 Practice DSA
          </Link>
        </div>

        {/* Stats */}
        <div className="fade-in-4 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="stat-number text-3xl text-white mb-1">{s.value}</div>
              <div className="text-gray-600 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Simulation ────────────────────────────────────────────────────────────────

function Simulation() {
  return (
    <section id="simulation" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          pill="⚡ Hero Feature"
          pillColor="purple"
          title="Full Placement"
          highlight="Simulation"
          subtitle="Not just practice — a complete end-to-end placement experience in one sitting. Same round structure. Same pressure. Same AI evaluation."
        />

        {/* Rounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {rounds.map((round, i) => (
            <div
              key={round.name}
              className="glow-card relative bg-[#0a0f1e] border border-white/6 rounded-2xl p-6"
            >
              {/* Connector */}
              {i < rounds.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-gray-700 text-lg font-light">
                  →
                </div>
              )}
              {/* Accent top bar */}
              <div
                className="w-8 h-1 rounded-full mb-5"
                style={{ backgroundColor: round.accent }}
              />
              <div className="text-2xl mb-3">{round.icon}</div>
              <div className="font-mono-custom text-xs text-gray-700 mb-1 tracking-widest">
                ROUND {round.num}
              </div>
              <div className="text-base font-bold text-white mb-2">{round.name}</div>
              <div className="text-gray-500 text-sm leading-relaxed">{round.desc}</div>
            </div>
          ))}
        </div>

        {/* Report Card */}
        <div className="grad-border bg-[#0a0f1e] rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-xl font-bold text-white mb-2">AI Performance Report</div>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Overall placement score · Round-wise breakdown · Confidence rating ·
            Personalized 2-week study plan · Resume suggestions · Downloadable PDF
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Companies ─────────────────────────────────────────────────────────────────

function Companies() {
  return (
    <section id="companies" className="py-28 px-6 bg-white/[0.015]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          pill="🎯 Company-Specific Modes"
          pillColor="orange"
          title="Practice for Your"
          highlight="Dream Company"
          subtitle="Each company mode shapes the aptitude style, DSA focus, HR format, and difficulty level."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {companies.map((c) => (
            <div
              key={c.name}
              className={`glow-card bg-[#0a0f1e] border border-white/6 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-xl ${c.border} ${c.glow}`}
            >
              {/* Icon circle */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mb-4 border"
                style={{
                  color: c.iconColor,
                  borderColor: c.iconColor + "33",
                  backgroundColor: c.iconColor + "15",
                }}
              >
                {c.icon}
              </div>
              <div className="font-bold text-white text-base mb-1">{c.name}</div>
              <div className="text-xs text-gray-600 mb-3 font-medium">{c.style}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{c.focus}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── AI Features ───────────────────────────────────────────────────────────────

function AIFeatures() {
  return (
    <section id="features" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          pill="🧠 9 AI Touchpoints"
          pillColor="green"
          title="AI That Actually"
          highlight="Helps"
          subtitle="Not a chatbot. A complete AI ecosystem built into every part of your preparation."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiFeatures.map((f) => (
            <div
              key={f.title}
              className="glow-card group bg-[#0a0f1e] border border-white/6 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-[10px] font-bold tracking-widest text-blue-500/60 bg-blue-500/8 border border-blue-500/15 px-2 py-0.5 rounded-full">
                  {f.tag}
                </span>
              </div>
              <div className="font-bold text-white text-sm mb-2 group-hover:text-blue-300 transition-colors">
                {f.title}
              </div>
              <div className="text-gray-500 text-xs leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Practice Modules ──────────────────────────────────────────────────────────

function PracticeModules() {
  return (
    <section id="practice" className="py-28 px-6 bg-white/[0.015]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Everything in"
          highlight="One Place"
          subtitle="No switching between 5 different websites. Every tool you need is right here."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {modules.map((m) => (
            <Link
              to="/register"
              key={m.name}
              className="glow-card group bg-[#0a0f1e] border border-white/6 rounded-2xl p-6 text-center block"
            >
              <div className="text-4xl mb-4">{m.icon}</div>
              <div className="font-bold text-white text-sm mb-2 group-hover:text-blue-300 transition-colors">
                {m.name}
              </div>
              <div className="text-gray-500 text-xs">{m.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Daily Challenge ───────────────────────────────────────────────────────────

function DailyChallenge() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grad-border bg-[#0a0f1e] rounded-3xl p-10 text-center relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(37,99,235,0.12) 0%, transparent 60%)" }} />

          <div className="relative">
            <div className="text-5xl mb-5">🔥</div>
            <h2 className="text-3xl font-black text-white mb-3">Daily Challenge</h2>
            <p className="text-gray-400 mb-8 text-base leading-relaxed max-w-lg mx-auto">
              One DSA problem + One aptitude question every day.
              Build your streak. Track your consistency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="bg-white/4 border border-white/8 rounded-xl px-6 py-4 text-left">
                <div className="font-mono-custom text-[10px] text-gray-600 mb-1 tracking-widest">TODAY'S DSA</div>
                <div className="text-white font-semibold text-sm">Two Sum — Array · Easy</div>
              </div>
              <div className="bg-white/4 border border-white/8 rounded-xl px-6 py-4 text-left">
                <div className="font-mono-custom text-[10px] text-gray-600 mb-1 tracking-widest">TODAY'S APTITUDE</div>
                <div className="text-white font-semibold text-sm">Time & Work — Medium</div>
              </div>
            </div>

            <Link
              to="/register"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
            >
              Solve Today's Challenge →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-28 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-5xl mb-6">🚀</div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tight">
          Ready to Ace Your<br />
          <span className="shimmer-text">Placements?</span>
        </h2>
        <p className="text-gray-400 text-xl mb-10 leading-relaxed">
          Join thousands of students preparing smarter with AI.
          Zero cost. Zero setup. Start in 30 seconds.
        </p>
        <Link
          to="/register"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-2xl text-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 mb-10"
        >
          Get Started Free →
        </Link>
        <div className="flex items-center justify-center gap-8 text-gray-600 text-sm">
          <span>✓ No credit card</span>
          <span>✓ No downloads</span>
          <span>✓ Free forever</span>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">P</span>
          </div>
          <span className="font-bold text-gray-500 text-sm">PlacePrep AI</span>
        </div>
        <p className="text-gray-700 text-xs">
          Built with React · Flask · MongoDB · Gemini API · Zero Cost
        </p>
        <div className="flex gap-6 text-gray-700 text-xs">
          <Link to="/login" className="hover:text-gray-400 transition-colors">Login</Link>
          <Link to="/register" className="hover:text-gray-400 transition-colors">Register</Link>
        </div>
      </div>
    </footer>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

const Landing = () => {
  const { isLoggedIn } = useAuth();

  // Load Google Fonts (Outfit + Fira Code) without touching index.html
  useGoogleFonts();

  return (
    <>
      {/* Inject all custom CSS into the page */}
      <style>{globalStyles}</style>

      <div className="noise min-h-screen bg-[#04070f] text-white overflow-x-hidden">
        <Navbar isLoggedIn={isLoggedIn} />
        <Hero />
        <Simulation />
        <Companies />
        <AIFeatures />
        <PracticeModules />
        <DailyChallenge />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
};

export default Landing;
