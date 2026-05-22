import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function useGoogleFonts() {
  useEffect(() => {
    const id = "placeprep-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

const styles = `
  .dash-root { font-family: 'Outfit', sans-serif; }
  .dash-root ::-webkit-scrollbar { width: 4px; }
  .dash-root ::-webkit-scrollbar-track { background: transparent; }
  .dash-root ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up   { animation: fadeUp 0.5s ease forwards; }
  .fade-up-1 { animation: fadeUp 0.5s ease 0.05s forwards; opacity: 0; }
  .fade-up-2 { animation: fadeUp 0.5s ease 0.10s forwards; opacity: 0; }
  .fade-up-3 { animation: fadeUp 0.5s ease 0.15s forwards; opacity: 0; }
  .fade-up-4 { animation: fadeUp 0.5s ease 0.20s forwards; opacity: 0; }
  .fade-up-5 { animation: fadeUp 0.5s ease 0.25s forwards; opacity: 0; }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .shimmer-text {
    background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 30%, #22d3ee 60%, #60a5fa 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  .stat-card { transition: all 0.2s ease; }
  .stat-card:hover { transform: translateY(-2px); }
  .nav-item { transition: all 0.15s ease; }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .nav-item.active { background: rgba(59,130,246,0.12); color: #60a5fa; border-right: 2px solid #3b82f6; }
  @keyframes fillBar {
    from { width: 0%; }
    to   { width: var(--fill); }
  }
  .progress-fill { animation: fillBar 1.2s ease forwards 0.5s; width: 0%; }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.85); }
  }
  .pulse-dot { animation: pulseDot 2s ease infinite; }
  .module-card { transition: all 0.2s ease; }
  .module-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(59,130,246,0.12);
    border-color: rgba(59,130,246,0.3) !important;
  }
  .sidebar { transition: width 0.25s ease; }
  .grad-border { position: relative; }
  .grad-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.4), rgba(6,182,212,0.4));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const NAV_ITEMS = [
  { icon: "⬡",  label: "Dashboard",    path: "/dashboard", active: true  },
  { icon: "🧩", label: "DSA Practice", path: "/dsa",       active: false },
  { icon: "📐", label: "Aptitude",     path: "/aptitude",  active: false },
  { icon: "🤖", label: "AI Interview", path: "/interview", active: false },
  { icon: "⚡", label: "Compiler",     path: "/compiler",  active: false },
  { icon: "📚", label: "Subjects",     path: "/subjects",  active: false },
  { icon: "📄", label: "Resume AI",    path: "/resume",    active: false },
];

const STATS = [
  { label: "Problems Solved", value: "0", total: "500+", icon: "🧩", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", progress: 0, hint: "Start solving DSA problems" },
  { label: "Aptitude Score",  value: "—", total: "100%", icon: "📐", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", progress: 0, hint: "Take your first quiz" },
  { label: "Interview Rounds",value: "0", total: "∞",    icon: "🎤", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)", progress: 0, hint: "Try a mock interview" },
  { label: "Day Streak",      value: "0", total: "days", icon: "🔥", color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)", progress: 0, hint: "Solve daily to build streak" },
];

const MODULES = [
  { icon: "🧩", name: "DSA Practice",     desc: "Arrays · Trees · Graphs · DP · 500+ problems", tag: "Most Popular",      tagColor: "#3b82f6", path: "/dsa",        accent: "#3b82f6" },
  { icon: "📐", name: "Aptitude Quiz",    desc: "Quant · Logical · Verbal · Timed mode",         tag: "Placement Critical",tagColor: "#f59e0b", path: "/aptitude",   accent: "#f59e0b" },
  { icon: "🤖", name: "AI Mock Interview",desc: "Technical + HR · Adaptive · Resume-linked",     tag: "AI Powered",        tagColor: "#a78bfa", path: "/interview",  accent: "#a78bfa" },
  { icon: "🚀", name: "Full Simulation",  desc: "All 4 rounds in one session · Placement mode",  tag: "Hero Feature",      tagColor: "#34d399", path: "/simulation", accent: "#34d399" },
  { icon: "⚡", name: "Online Compiler",  desc: "C++ · Java · Python · Real-time output",        tag: "Dev Tool",          tagColor: "#22d3ee", path: "/compiler",   accent: "#22d3ee" },
  { icon: "📄", name: "Resume Analyzer",  desc: "ATS score · Keyword gaps · AI suggestions",     tag: "New",               tagColor: "#f43f5e", path: "/resume",     accent: "#f43f5e" },
];

const TOPICS = [
  { name: "Arrays",           total: 45 },
  { name: "Linked Lists",     total: 30 },
  { name: "Trees & Graphs",   total: 50 },
  { name: "Dynamic Prog.",    total: 40 },
  { name: "Sorting & Search", total: 25 },
];

const ACTIVITY = [
  { text: "Account created successfully", time: "Just now", icon: "🎉", color: "#34d399" },
  { text: "Welcome to PlacePrep AI",      time: "Just now", icon: "👋", color: "#60a5fa" },
  { text: "Complete your profile",        time: "Pending",  icon: "📝", color: "#f59e0b" },
  { text: "Solve your first DSA problem", time: "Pending",  icon: "🧩", color: "#a78bfa" },
];

const COMPANIES = [
  { name: "Google",    icon: "G", color: "#4285F4" },
  { name: "Amazon",    icon: "A", color: "#FF9900" },
  { name: "Microsoft", icon: "M", color: "#00A4EF" },
  { name: "Infosys",   icon: "I", color: "#007CC3" },
  { name: "TCS",       icon: "T", color: "#CC0000" },
];

function Avatar({ name, size = "md" }) {
  const initials = name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "U";
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Badge({ children, color = "#3b82f6" }) {
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color, backgroundColor: color + "18", border: `1px solid ${color}30` }}>
      {children}
    </span>
  );
}

function Sidebar({ collapsed, onToggle, userName }) {
  return (
    <aside className="sidebar fixed left-0 top-0 h-full z-40 flex flex-col border-r border-white/5 bg-[#060b14]"
      style={{ width: collapsed ? "64px" : "220px" }}>
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/5 overflow-hidden">
        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <span className="text-white font-black text-sm">P</span>
        </div>
        {!collapsed && (
          <span className="font-black text-white text-base tracking-tight whitespace-nowrap">
            PlacePrep <span className="text-blue-400">AI</span>
          </span>
        )}
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link key={item.label} to={item.path} title={collapsed ? item.label : ""}
            className={`nav-item ${item.active ? "active" : "text-gray-500"} flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg mb-0.5 text-sm font-medium`}>
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/5 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-1 py-1">
            <Avatar name={userName} size="sm" />
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">{userName}</div>
              <div className="text-gray-600 text-[10px]">Free Plan</div>
            </div>
          </div>
        )}
        <button onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all text-xs">
          <span>{collapsed ? "→" : "←"}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

function Topbar({ userName, sidebarWidth }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#04070f]/90 backdrop-blur-xl transition-all duration-300"
      style={{ left: sidebarWidth }}>
      <div>
        <span className="text-gray-500 text-sm">{greeting}, </span>
        <span className="text-white text-sm font-semibold">{userName?.split(" ")[0] || "there"} 👋</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
          <span className="text-orange-400 text-xs font-bold">0 day streak 🔥</span>
        </div>
        <button className="relative w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition-all">
          <span className="text-sm">🔔</span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#04070f]" />
        </button>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar name={userName} />
            <span className="hidden sm:block text-gray-500 text-xs">▾</span>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-12 w-48 bg-[#0a1020] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/5">
                  <div className="text-white text-sm font-semibold truncate">{userName}</div>
                  <div className="text-gray-600 text-xs">Free Plan</div>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-colors">
                  ⚙️ Settings
                </button>
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 text-sm transition-colors">
                  🚪 Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up-1">
      {STATS.map((s) => (
        <div key={s.label} className="stat-card rounded-2xl p-5 border" style={{ background: s.bg, borderColor: s.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</span>
            <span className="text-lg">{s.icon}</span>
          </div>
          <div className="flex items-end gap-1 mb-3">
            <span className="text-3xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>{s.value}</span>
            <span className="text-gray-600 text-sm mb-1">/ {s.total}</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2">
            <div className="progress-fill h-full rounded-full" style={{ "--fill": `${s.progress}%`, backgroundColor: s.color }} />
          </div>
          <p className="text-gray-600 text-[11px]">{s.hint}</p>
        </div>
      ))}
    </div>
  );
}

function QuickModules() {
  return (
    <div className="fade-up-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-base">Quick Access</h2>
        <span className="text-gray-600 text-xs">6 modules</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {MODULES.map((m) => (
          <Link key={m.name} to={m.path} className="module-card bg-[#0a0f1e] border border-white/6 rounded-2xl p-4 block">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{m.icon}</span>
              <Badge color={m.tagColor}>{m.tag}</Badge>
            </div>
            <div className="text-white font-bold text-sm mb-1">{m.name}</div>
            <div className="text-gray-500 text-xs leading-relaxed">{m.desc}</div>
            <div className="mt-3 h-0.5 rounded-full w-8" style={{ backgroundColor: m.accent + "60" }} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="bg-[#0a0f1e] border border-white/6 rounded-2xl p-5 fade-up-4">
      <h2 className="text-white font-bold text-base mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
              style={{ backgroundColor: a.color + "15", border: `1px solid ${a.color}25` }}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-300 text-sm truncate">{a.text}</div>
            </div>
            <div className="text-gray-600 text-[11px] flex-shrink-0">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyTargets() {
  return (
    <div className="bg-[#0a0f1e] border border-white/6 rounded-2xl p-5 fade-up-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-base">Company Modes</h2>
        <span className="text-gray-600 text-xs">Pick a target</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {COMPANIES.map((c) => (
          <button key={c.name}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/6 bg-white/3 hover:border-white/15 hover:bg-white/6 transition-all">
            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black"
              style={{ color: c.color, backgroundColor: c.color + "20" }}>
              {c.icon}
            </span>
            <span className="text-gray-400 text-xs font-medium">{c.name}</span>
          </button>
        ))}
      </div>
      <p className="text-gray-700 text-xs mt-3">Company-specific simulation coming in Phase 7</p>
    </div>
  );
}

function DailyChallenge() {
  return (
    <div className="grad-border bg-[#0a0f1e] rounded-2xl p-5 fade-up-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔥</span>
        <h2 className="text-white font-bold text-base">Daily Challenge</h2>
        <span className="ml-auto text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">LIVE</span>
      </div>
      <div className="space-y-3 mb-4">
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <div className="text-[10px] text-gray-600 font-bold tracking-widest mb-1" style={{ fontFamily: "'Fira Code', monospace" }}>DSA</div>
          <div className="text-white text-sm font-semibold">Two Sum</div>
          <div className="text-gray-500 text-xs mt-0.5">Array · Easy</div>
        </div>
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <div className="text-[10px] text-gray-600 font-bold tracking-widest mb-1" style={{ fontFamily: "'Fira Code', monospace" }}>APTITUDE</div>
          <div className="text-white text-sm font-semibold">Time & Work</div>
          <div className="text-gray-500 text-xs mt-0.5">Quantitative · Medium</div>
        </div>
      </div>
      <Link to="/dsa" className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-blue-500/20">
        Solve Now →
      </Link>
    </div>
  );
}

function TopicProgress() {
  return (
    <div className="bg-[#0a0f1e] border border-white/6 rounded-2xl p-5 fade-up-3">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold text-base">DSA Topics</h2>
        <Link to="/dsa" className="text-blue-400 text-xs hover:text-blue-300 transition-colors">Start →</Link>
      </div>
      <div className="space-y-4">
        {TOPICS.map((t) => (
          <div key={t.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-400 text-sm">{t.name}</span>
              <span className="text-gray-600 text-xs" style={{ fontFamily: "'Fira Code', monospace" }}>0 / {t.total}</span>
            </div>
            <div className="w-full h-1.5 bg-white/4 rounded-full overflow-hidden">
              <div className="progress-fill h-full rounded-full bg-blue-500" style={{ "--fill": "0%" }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-700 text-xs mt-4 text-center">Solve problems to see progress fill up ↑</p>
    </div>
  );
}

function PlacementReadiness() {
  const areas = [
    { label: "DSA",       score: 0, color: "#3b82f6" },
    { label: "Aptitude",  score: 0, color: "#f59e0b" },
    { label: "Technical", score: 0, color: "#a78bfa" },
    { label: "HR/Soft",   score: 0, color: "#34d399" },
  ];
  return (
    <div className="grad-border bg-[#0a0f1e] rounded-2xl p-5 fade-up-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white font-bold text-base">Placement Readiness</h2>
        <span className="shimmer-text text-lg font-black">0%</span>
      </div>
      <p className="text-gray-600 text-xs mb-5">Complete modules to increase your score</p>
      <div className="space-y-3">
        {areas.map((a) => (
          <div key={a.label} className="flex items-center gap-3">
            <span className="text-gray-500 text-xs w-16 flex-shrink-0">{a.label}</span>
            <div className="flex-1 h-1.5 bg-white/4 rounded-full overflow-hidden">
              <div className="progress-fill h-full rounded-full" style={{ "--fill": `${a.score}%`, backgroundColor: a.color }} />
            </div>
            <span className="text-gray-600 text-xs w-6 text-right">{a.score}%</span>
          </div>
        ))}
      </div>
      <div className="mt-5 p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl">
        <p className="text-blue-400 text-xs text-center">🎯 Start with DSA Practice to boost your score</p>
      </div>
    </div>
  );
}

function GettingStarted() {
  const steps = [
    { done: true,  text: "Create your account",            icon: "✅" },
    { done: false, text: "Solve 1 DSA problem",             icon: "🧩" },
    { done: false, text: "Complete 1 aptitude quiz",        icon: "📐" },
    { done: false, text: "Try an AI mock interview",        icon: "🤖" },
    { done: false, text: "Run a full placement simulation", icon: "🚀" },
  ];
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);
  return (
    <div className="bg-[#0a0f1e] border border-white/6 rounded-2xl p-5 fade-up-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white font-bold text-base">Getting Started</h2>
        <span className="text-gray-500 text-xs">{done}/{steps.length} done</span>
      </div>
      <div className="w-full h-1.5 bg-white/4 rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-2.5">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${s.done ? "opacity-50" : "bg-white/2 border border-white/5"}`}>
            <span className="text-base flex-shrink-0">{s.icon}</span>
            <span className={`text-sm flex-1 ${s.done ? "line-through text-gray-600" : "text-gray-300"}`}>{s.text}</span>
            {!s.done && <span className="w-4 h-4 rounded-full border border-white/15 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  useGoogleFonts();
  const sidebarWidth = collapsed ? 64 : 220;
  const userName = user?.name || user?.username || user?.email?.split("@")[0] || "User";

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root min-h-screen bg-[#04070f] text-white">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} userName={userName} />
        <div className="min-h-screen flex flex-col transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
          <Topbar userName={userName} sidebarWidth={sidebarWidth} />
          <main className="flex-1 pt-16 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
              <div className="fade-up">
                <h1 className="text-2xl font-black text-white mb-1">Dashboard</h1>
                <p className="text-gray-500 text-sm">Track your progress and jump into practice sessions</p>
              </div>
              <StatCards />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <QuickModules />
                  <RecentActivity />
                  <CompanyTargets />
                </div>
                <div className="space-y-5">
                  <DailyChallenge />
                  <TopicProgress />
                  <PlacementReadiness />
                  <GettingStarted />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
