import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Editor from "@monaco-editor/react";

const API        = "http://localhost:5000";
const PISTON_URL = "https://emkc.org/api/v2/piston";

function useGoogleFonts() {
  useEffect(() => {
    const id = "placeprep-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id; link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

const styles = `
  .pd-root { font-family: 'Outfit', sans-serif; }
  .pd-root ::-webkit-scrollbar { width: 4px; height: 4px; }
  .pd-root ::-webkit-scrollbar-track { background: transparent; }
  .pd-root ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp 0.35s ease forwards; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.12); border-top-color:#818cf8; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; flex-shrink:0; }
  @keyframes typingDots { 0%,80%,100%{opacity:0;transform:scale(0.6);} 40%{opacity:1;transform:scale(1);} }
  .dot1{animation:typingDots 1.2s infinite 0s;} .dot2{animation:typingDots 1.2s infinite 0.2s;} .dot3{animation:typingDots 1.2s infinite 0.4s;}
  .tab-btn{transition:all 0.15s ease;border:none;cursor:pointer;background:transparent;}
  .tab-btn:hover{color:#94a3b8 !important;}
  .nav-btn{transition:all 0.15s ease;}
  .nav-btn:hover{background:rgba(255,255,255,0.06) !important;border-color:rgba(255,255,255,0.12) !important;}
  .run-btn{transition:all 0.2s ease;}
  .run-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 20px rgba(99,102,241,0.35);}
  .run-btn:disabled{opacity:0.55;cursor:not-allowed;}
  .solve-btn{transition:all 0.2s ease;cursor:pointer;}
  .solve-btn:hover:not(:disabled){transform:translateY(-1px);}
  .hint-btn{transition:all 0.2s ease;cursor:pointer;}
  .hint-btn:hover:not(:disabled){background:rgba(167,139,250,0.18) !important;border-color:rgba(167,139,250,0.5) !important;transform:translateY(-1px);}
  .hint-btn:disabled{opacity:0.45;cursor:not-allowed;}
  .lang-select{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#94a3b8;border-radius:8px;padding:5px 10px;font-size:12px;font-family:'Fira Code',monospace;outline:none;cursor:pointer;}
  .lang-select:focus{border-color:rgba(99,102,241,0.4);}
  .lang-select option{background:#0d1117;}
  .output-area{font-family:'Fira Code',monospace;font-size:12.5px;white-space:pre-wrap;word-break:break-all;line-height:1.65;margin:0;}
  .hint-text{font-size:13.5px;line-height:1.75;color:#c4b5fd;}
  .hint-text strong{color:#e0d7ff;}
  .hint-text code{background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.2);padding:1px 6px;border-radius:4px;font-family:'Fira Code',monospace;font-size:12px;color:#a78bfa;}
  .tag-chip{font-size:11px;padding:3px 10px;border-radius:20px;font-weight:500;white-space:nowrap;}
  .section-label{font-size:10px;font-weight:700;letter-spacing:0.1em;color:#334155;font-family:'Fira Code',monospace;margin-bottom:8px;text-transform:uppercase;}
`;

const LANGUAGES = [
  { id:"python",     label:"Python 3",    monacoLang:"python",     pistonLang:"python",     pistonVersion:"3.10.0",  defaultCode:"# Write your solution here\ndef solution():\n    pass\n\nprint(solution())\n" },
  { id:"cpp",        label:"C++",         monacoLang:"cpp",        pistonLang:"c++",        pistonVersion:"10.2.0", defaultCode:"#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n" },
  { id:"java",       label:"Java",        monacoLang:"java",       pistonLang:"java",       pistonVersion:"15.0.2", defaultCode:"import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n" },
  { id:"javascript", label:"JavaScript",  monacoLang:"javascript", pistonLang:"javascript", pistonVersion:"18.15.0",defaultCode:"// Write your solution here\nfunction solution() {\n    \n}\n\nconsole.log(solution());\n" },
];

const DIFF_STYLE = {
  Easy:   { color:"#10b981", bg:"rgba(16,185,129,0.1)",  border:"rgba(16,185,129,0.25)"  },
  Medium: { color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.25)"  },
  Hard:   { color:"#ef4444", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.25)"   },
};

function getOutputStyle(status) {
  if (!status) return { color:"#94a3b8" };
  const s = status.toLowerCase();
  if (s.includes("success")||s.includes("accepted")) return { color:"#10b981" };
  if (s.includes("error")||s.includes("runtime"))    return { color:"#ef4444" };
  if (s.includes("time"))                             return { color:"#f59e0b" };
  return { color:"#94a3b8" };
}

// ── AI Hint Panel ─────────────────────────────────────────────────────────────
function AIHintPanel({ problem, token }) {
  const [hint,      setHint]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [hintLevel, setHintLevel] = useState(1);
  const [revealed,  setRevealed]  = useState(false);

  const HINT_LABELS = {
    1: { label:"Gentle Nudge",  icon:"💡", desc:"Just a small push in the right direction" },
    2: { label:"Approach Hint", icon:"🗺️", desc:"The general strategy to solve this"       },
    3: { label:"Detailed Hint", icon:"🔍", desc:"Step-by-step breakdown of the approach"   },
  };

  async function fetchHint() {
    setLoading(true); setError(null); setRevealed(false);
    const hintPrompts = {
      1: `Give a very brief one-sentence nudge (no code) for "${problem.title}" (${problem.difficulty}, topic: ${problem.primary_topic || problem.topics?.[0] || "DSA"}).`,
      2: `Explain the general approach to solve "${problem.title}" (${problem.difficulty} - ${problem.primary_topic || "DSA"}). 2-3 sentences. No code. Mention the algorithm/DS to use.`,
      3: `Give a detailed step-by-step hint for "${problem.title}" (${problem.difficulty}). Cover: what to observe, algorithm/DS to use, key steps. Pseudocode ok. No full solution.`,
    };
    try {
      const res = await fetch(`${API}/api/ai/hint`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({
          problem_title: problem.title,
          difficulty:    problem.difficulty,
          topic:         problem.primary_topic || problem.topics?.[0] || "General",
          hint_level:    hintLevel,
          prompt:        hintPrompts[hintLevel],
        }),
      });
      const data = await res.json();
      if (data.success) { setHint(data.hint); setRevealed(true); }
      else setError(data.error || "Failed to get hint");
    } catch { setError("Could not connect to AI service"); }
    finally { setLoading(false); }
  }

  function formatHint(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.*?)`/g, "<code>$1</code>");
  }

  const current = HINT_LABELS[hintLevel];

  return (
    <div style={{ background:"rgba(139,92,246,0.04)", border:"1px solid rgba(139,92,246,0.15)", borderRadius:14, overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(139,92,246,0.1)", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:"rgba(167,139,250,0.12)", border:"1px solid rgba(167,139,250,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🧠</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#a78bfa" }}>AI Hint</div>
          {/* ✅ Fixed: Groq instead of Gemini */}
          <div style={{ fontSize:11, color:"#475569" }}>Powered by Groq · Llama 3.3</div>
        </div>
        {hint && !loading && (
          <button onClick={() => { setHint(null); setRevealed(false); }}
            style={{ fontSize:11, color:"#475569", background:"none", border:"none", cursor:"pointer" }}>
            Clear
          </button>
        )}
      </div>

      {/* Hint level selector */}
      <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(139,92,246,0.08)" }}>
        <div className="section-label">Hint Level</div>
        <div style={{ display:"flex", gap:6 }}>
          {Object.entries(HINT_LABELS).map(([lvl, info]) => (
            <button key={lvl} onClick={() => { setHintLevel(Number(lvl)); setHint(null); setRevealed(false); }}
              style={{ flex:1, padding:"7px 4px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer",
                border:`1px solid ${hintLevel===Number(lvl)?"rgba(167,139,250,0.4)":"rgba(255,255,255,0.06)"}`,
                background: hintLevel===Number(lvl)?"rgba(167,139,250,0.12)":"rgba(255,255,255,0.02)",
                color: hintLevel===Number(lvl)?"#a78bfa":"#475569", transition:"all 0.15s" }}>
              {info.icon} {info.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize:11, color:"#334155", marginTop:6 }}>{current.desc}</div>
      </div>

      {/* Content */}
      <div style={{ padding:"14px 16px" }}>
        {!hint && !loading && !error && (
          <div style={{ marginBottom:12 }}>
            <p style={{ fontSize:12.5, color:"#475569", lineHeight:1.6, margin:"0 0 12px" }}>
              Stuck? Get a {current.label.toLowerCase()} without spoiling the solution.
            </p>
            <button className="hint-btn" onClick={fetchHint} style={{
              width:"100%", padding:"10px", background:"rgba(167,139,250,0.1)",
              border:"1px solid rgba(167,139,250,0.25)", color:"#a78bfa", fontSize:13, fontWeight:700,
              borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}>
              {current.icon} Get {current.label}
            </button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ display:"flex", justifyContent:"center", gap:5, marginBottom:10 }}>
              {["dot1","dot2","dot3"].map(d => (
                <div key={d} className={d} style={{ width:7, height:7, borderRadius:"50%", background:"#a78bfa", display:"inline-block" }} />
              ))}
            </div>
            {/* ✅ Fixed: Groq instead of Gemini */}
            <div style={{ fontSize:12, color:"#475569" }}>Groq is thinking...</div>
          </div>
        )}

        {error && (
          <div style={{ padding:"12px", borderRadius:10, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", marginBottom:10 }}>
            <div style={{ fontSize:12, color:"#f87171", marginBottom:8 }}>⚠️ {error}</div>
            <button onClick={fetchHint} className="hint-btn" style={{ fontSize:11, color:"#a78bfa", background:"none", border:"1px solid rgba(167,139,250,0.2)", padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>
              Try again
            </button>
          </div>
        )}

        {hint && revealed && !loading && (
          <div className="fade-up">
            <div style={{ background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.15)", borderRadius:10, padding:"14px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                <span>{current.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color:"#7c3aed" }}>{current.label}</span>
              </div>
              <div className="hint-text" dangerouslySetInnerHTML={{ __html: formatHint(hint) }} />
            </div>
            {hintLevel < 3 && (
              <button onClick={() => { setHintLevel(l => l+1); setHint(null); setRevealed(false); }}
                style={{ width:"100%", padding:"8px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", color:"#475569", fontSize:12, borderRadius:8, cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color="#94a3b8"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.color="#475569"; e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; }}>
                Still stuck? Get a deeper hint →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProblemDetail() {
  const { slug }  = useParams();
  const { token } = useAuth();
  useGoogleFonts();

  const [problem,     setProblem]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [solved,      setSolved]      = useState(false);
  const [activeLang,  setActiveLang]  = useState(LANGUAGES[0]);
  const [code,        setCode]        = useState({});
  const [running,     setRunning]     = useState(false);
  const [output,      setOutput]      = useState(null);
  const [activeTab,   setActiveTab]   = useState("problem");
  const [markingDone, setMarkingDone] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API}/api/dsa/problem/${slug}`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) { setProblem(d.problem); setSolved(d.problem.is_solved||false); } })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, token]);

  function getCurrentCode() { return code[activeLang.id] || activeLang.defaultCode; }
  function setCurrentCode(val) { setCode(prev => ({ ...prev, [activeLang.id]: val })); }

  async function handleRun() {
    const currentCode = getCurrentCode();
    if (!currentCode.trim()) return;
    setRunning(true);
    setOutput({ status:"Running...", stdout:"", stderr:"", time:null });
    try {
      const res = await fetch(`${PISTON_URL}/execute`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ language:activeLang.pistonLang, version:activeLang.pistonVersion, files:[{ name:"main", content:currentCode }], stdin:"", args:[], compile_timeout:10000, run_timeout:5000 }),
      });
      const data = await res.json();
      const run = data.run||{}, comp = data.compile||{};
      let status="Success", err=run.stderr||comp.stderr||"";
      if (comp.stderr) status="Compile Error";
      else if (run.stderr) status="Runtime Error";
      else if (run.code!==0) status="Runtime Error";
      setOutput({ status, stdout:run.stdout||"", stderr:err, time:run.cpu_time?`${(run.cpu_time*1000).toFixed(0)}ms`:null, memory:run.memory?`${(run.memory/1024).toFixed(1)}KB`:null });
    } catch {
      setOutput({ status:"Network Error", stdout:"", stderr:"Could not connect to execution server.", time:null });
    } finally { setRunning(false); }
  }

  async function handleMarkSolved() {
    if (!problem||solved) return;
    setMarkingDone(true);
    try {
      const res = await fetch(`${API}/api/dsa/solve`, {
        method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ slug:problem.slug }),
      });
      const data = await res.json();
      if (data.success) setSolved(true);
    } catch(err) { console.error(err); }
    finally { setMarkingDone(false); }
  }

  if (loading) return (
    <div className="pd-root" style={{ background:"#04070f", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{styles}</style>
      <div style={{ textAlign:"center" }}>
        <div className="spinner" style={{ width:24, height:24, margin:"0 auto 14px", border:"2px solid rgba(255,255,255,0.08)", borderTopColor:"#818cf8" }} />
        <div style={{ color:"#334155", fontSize:13 }}>Loading problem...</div>
      </div>
    </div>
  );

  if (!problem) return (
    <div className="pd-root" style={{ background:"#04070f", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{styles}</style>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
        <div style={{ color:"#94a3b8", fontSize:16, marginBottom:16 }}>Problem not found</div>
        <Link to="/dsa" style={{ color:"#818cf8", fontSize:13, textDecoration:"none", padding:"8px 18px", borderRadius:8, border:"1px solid rgba(129,140,248,0.3)", background:"rgba(129,140,248,0.05)" }}>← Back to DSA Practice</Link>
      </div>
    </div>
  );

  const dc = DIFF_STYLE[problem.difficulty]||DIFF_STYLE.Medium;

  return (
    <>
      <style>{styles}</style>
      <div className="pd-root" style={{ background:"#04070f", minHeight:"100vh", color:"#e2e8f0", display:"flex", flexDirection:"column" }}>

        {/* Top Bar */}
        <div style={{ position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(4,7,15,0.97)", backdropFilter:"blur(12px)", padding:"0 16px", height:50, display:"flex", alignItems:"center", gap:10 }}>
          <Link to="/dsa" className="nav-btn" style={{ display:"flex", alignItems:"center", gap:5, color:"#475569", fontSize:12, textDecoration:"none", padding:"5px 10px", borderRadius:7, border:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
            ← DSA
          </Link>
          <div style={{ flex:1, minWidth:0 }}>
            <span style={{ fontSize:13, fontWeight:600, color:solved?"#334155":"#e2e8f0", textDecoration:solved?"line-through":"none", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", display:"block" }}>
              {problem.title}
            </span>
          </div>
          <span className="tag-chip" style={{ color:dc.color, background:dc.bg, border:`1px solid ${dc.border}`, fontWeight:700, flexShrink:0 }}>{problem.difficulty}</span>
          {!solved ? (
            <button className="solve-btn" onClick={handleMarkSolved} disabled={markingDone} style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.25)", color:"#10b981", fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:8, flexShrink:0, display:"flex", alignItems:"center", gap:6 }}>
              {markingDone ? <><span className="spinner"/>Saving...</> : "✓ Mark Solved"}
            </button>
          ) : (
            <span style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", color:"#10b981", fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:8, flexShrink:0 }}>✅ Solved</span>
          )}
          {problem.link && (
            <a href={problem.link} target="_blank" rel="noreferrer" className="nav-btn" style={{ color:"#2d3748", fontSize:11, textDecoration:"none", padding:"5px 9px", borderRadius:7, border:"1px solid rgba(255,255,255,0.04)", flexShrink:0 }}
              onMouseEnter={e=>e.currentTarget.style.color="#475569"} onMouseLeave={e=>e.currentTarget.style.color="#2d3748"}>
              LC ↗
            </a>
          )}
        </div>

        {/* Split Layout */}
        <div style={{ flex:1, display:"flex", height:"calc(100vh - 50px)", overflow:"hidden" }}>

          {/* Left Panel */}
          <div style={{ width:"38%", minWidth:300, maxWidth:480, borderRight:"1px solid rgba(255,255,255,0.05)", display:"flex", flexDirection:"column", overflow:"hidden", background:"#04070f" }}>
            <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"0 16px", flexShrink:0 }}>
              {["problem","solution"].map(tab => (
                <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{ color:activeTab===tab?"#818cf8":"#334155", fontSize:13, fontWeight:500, padding:"11px 14px", borderBottom:activeTab===tab?"2px solid #6366f1":"2px solid transparent", textTransform:"capitalize" }}>
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>
              {activeTab==="problem" && (
                <div className="fade-up">
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:18 }}>
                    <span className="tag-chip" style={{ color:dc.color, background:dc.bg, border:`1px solid ${dc.border}`, fontWeight:700 }}>{problem.difficulty}</span>
                    {problem.primary_topic && <span className="tag-chip" style={{ color:"#818cf8", background:"rgba(129,140,248,0.1)", border:"1px solid rgba(129,140,248,0.2)" }}>{problem.primary_topic}</span>}
                    {problem.acceptance_rate>0 && <span className="tag-chip" style={{ color:"#475569", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", marginLeft:"auto" }}>{(problem.acceptance_rate*100).toFixed(1)}% accepted</span>}
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px", marginBottom:18 }}>
                    <p style={{ color:"#94a3b8", fontSize:13.5, lineHeight:1.75, margin:0 }}>
                      {problem.description || `Solve the "${problem.title}" problem — a classic ${problem.primary_topic||"DSA"} challenge frequently asked in placement interviews at top tech companies.`}
                    </p>
                  </div>
                  {problem.topics?.length>0 && (
                    <div style={{ marginBottom:16 }}>
                      <div className="section-label">Topics</div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                        {problem.topics.map(t => <span key={t} className="tag-chip" style={{ color:"#475569", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>{t}</span>)}
                      </div>
                    </div>
                  )}
                  {problem.companies?.length>0 && (
                    <div style={{ marginBottom:20 }}>
                      <div className="section-label">Asked At</div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                        {problem.companies.slice(0,12).map(c => <span key={c} className="tag-chip" style={{ color:"#334155", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>{c}</span>)}
                        {problem.companies.length>12 && <span style={{ fontSize:11, color:"#1e293b" }}>+{problem.companies.length-12} more</span>}
                      </div>
                    </div>
                  )}
                  <AIHintPanel problem={problem} token={token} />
                </div>
              )}
              {activeTab==="solution" && (
                <div className="fade-up" style={{ textAlign:"center", paddingTop:50 }}>
                  <div style={{ fontSize:44, marginBottom:14 }}>🔒</div>
                  <div style={{ color:"#475569", fontSize:15, fontWeight:600, marginBottom:8 }}>Try it yourself first!</div>
                  <div style={{ color:"#2d3748", fontSize:12, lineHeight:1.7 }}>Use the AI Hint to get nudges<br/>without spoiling the solution.</div>
                  <button onClick={() => setActiveTab("problem")} style={{ marginTop:20, padding:"8px 18px", borderRadius:9, background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)", color:"#a78bfa", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                    🧠 Get AI Hint
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#060b14" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"#060b14", flexShrink:0 }}>
              <div style={{ display:"flex", gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#ef4444", opacity:0.55 }} />
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#f59e0b", opacity:0.55 }} />
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#10b981", opacity:0.55 }} />
              </div>
              <select className="lang-select" value={activeLang.id} onChange={e => { const l=LANGUAGES.find(l=>l.id===e.target.value); if(l) setActiveLang(l); }}>
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
              <div style={{ flex:1 }} />
              <button className="run-btn" onClick={handleRun} disabled={running} style={{ background:running?"rgba(99,102,241,0.25)":"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"7px 18px", borderRadius:8, display:"flex", alignItems:"center", gap:7, cursor:running?"not-allowed":"pointer" }}>
                {running ? <><span className="spinner"/>Running...</> : <>▶ Run Code</>}
              </button>
            </div>

            <div style={{ flex:1, overflow:"hidden", minHeight:0 }}>
              <Editor height="100%" language={activeLang.monacoLang} value={getCurrentCode()} onChange={val=>setCurrentCode(val||"")} onMount={editor=>{editorRef.current=editor;}} theme="vs-dark"
                options={{ fontSize:13.5, fontFamily:"'Fira Code','Cascadia Code',monospace", fontLigatures:true, minimap:{enabled:false}, scrollBeyondLastLine:false, lineNumbers:"on", wordWrap:"on", padding:{top:16,bottom:16}, smoothScrolling:true, cursorBlinking:"smooth", cursorSmoothCaretAnimation:"on", bracketPairColorization:{enabled:true}, autoIndent:"full", tabSize:4, automaticLayout:true }} />
            </div>

            <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", background:"#060b14", height:output?200:80, transition:"height 0.2s ease", flexShrink:0, overflowY:"auto" }}>
              <div style={{ padding:"7px 14px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <span style={{ fontSize:10, fontWeight:700, color:"#1e293b", letterSpacing:"0.1em", fontFamily:"'Fira Code',monospace" }}>OUTPUT</span>
                {output?.status && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10, ...getOutputStyle(output.status), background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>{output.status}</span>}
                {output?.time && <span style={{ fontSize:10, color:"#1e293b", marginLeft:"auto", fontFamily:"'Fira Code',monospace" }}>⏱ {output.time} {output.memory&&`· ${output.memory}`}</span>}
                {output && <button onClick={()=>setOutput(null)} style={{ fontSize:10, color:"#1e293b", background:"none", border:"none", cursor:"pointer", marginLeft:output?.time?0:"auto" }}>Clear</button>}
              </div>
              {!output ? (
                <div style={{ padding:"14px 16px", color:"#1e293b", fontSize:12, fontFamily:"'Fira Code',monospace" }}>Click "Run Code" to execute your solution...</div>
              ) : (
                <div style={{ padding:"10px 14px" }}>
                  {output.stdout && <pre className="output-area" style={{ color:"#94a3b8", marginBottom:output.stderr?8:0 }}>{output.stdout}</pre>}
                  {output.stderr && <pre className="output-area" style={{ color:"#f87171" }}>{output.stderr}</pre>}
                  {!output.stdout&&!output.stderr&&output.status==="Success" && <pre className="output-area" style={{ color:"#10b981" }}>✓ Program ran successfully (no output)</pre>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
