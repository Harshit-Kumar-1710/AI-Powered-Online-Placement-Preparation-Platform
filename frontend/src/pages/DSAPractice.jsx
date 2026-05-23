// frontend/src/pages/DSAPractice.jsx
// Matches Dashboard shell exactly — same sidebar, topbar, dark theme

import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

function useGoogleFonts() {
  useEffect(() => {
    const id = "placeprep-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id   = id;
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ── Match your Dashboard's NAV_ITEMS exactly ──────────────────────────────────
const NAV_ITEMS = [
  { icon: "⊙",  label: "Dashboard",    path: "/dashboard" },
  { icon: "🧩", label: "DSA Practice", path: "/dsa",      active: true },
  { icon: "📐", label: "Aptitude",     path: "/aptitude"  },
  { icon: "🤖", label: "AI Interview", path: "/interview" },
  { icon: "⚡", label: "Compiler",     path: "/compiler"  },
  { icon: "📚", label: "Subjects",     path: "/subjects"  },
  { icon: "📄", label: "Resume AI",    path: "/resume"    },
];

const COMPANIES = [
  "Google","Amazon","Microsoft","Meta","Apple","Adobe",
  "Flipkart","Infosys","TCS","Accenture","Goldman Sacs",
  "JP Morgan","DE Shaw","Morgan Stanley","Atlassian","Cisco",
  "Samsung","Visa","Barclays","Capgemini","Cognizant",
  "Deloitte","Myntra","Swiggy","Zepto","Cars24","American Express",
];

const DIFF = {
  Easy:   { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)"  },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)"  },
  Hard:   { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)"   },
};

export default function DSAPractice() {
  useGoogleFonts();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed,   setCollapsed]   = useState(false);
  const [avatarOpen,  setAvatarOpen]  = useState(false);
  const [company,     setCompany]     = useState("");
  const [difficulty,  setDifficulty]  = useState("");
  const [topic,       setTopic]       = useState("");
  const [page,        setPage]        = useState(1);
  const [showAllCo,   setShowAllCo]   = useState(false);
  const [problems,    setProblems]    = useState([]);
  const [pagination,  setPagination]  = useState({});
  const [topics,      setTopics]      = useState([]);
  const [solved,      setSolved]      = useState(new Set());
  const [loading,     setLoading]     = useState(true);

  const name     = user?.name || user?.email?.split("@")[0] || "User";
  const initials = name.slice(0, 2).toUpperCase();

  // fetch topic list
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/dsa/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setTopics(d.available_topics || []); })
      .catch(console.error);
  }, [token]);

  // fetch problems
  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    const p = new URLSearchParams();
    if (company)    p.set("company",    company);
    if (difficulty) p.set("difficulty", difficulty);
    if (topic)      p.set("topic",      topic);
    p.set("page", page); p.set("limit", 15);
    fetch(`${API}/api/dsa/problems?${p}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) { setProblems(d.problems||[]); setPagination(d.pagination||{}); }})
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, company, difficulty, topic, page]);

  useEffect(() => { load(); }, [load]);

  const markSolved = async (slug) => {
    if (solved.has(slug)) return;
    const r = await fetch(`${API}/api/dsa/problems/submit`, {
      method: "POST",
      headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
      body: JSON.stringify({ slug }),
    });
    const d = await r.json();
    if (d.success) setSolved(prev => new Set([...prev, slug]));
  };

  const clearAll = () => { setCompany(""); setDifficulty(""); setTopic(""); setPage(1); };
  const activeCt = [company, difficulty, topic].filter(Boolean).length;
  const visCo    = showAllCo ? COMPANIES : COMPANIES.slice(0, 11);

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:"#070b14", minHeight:"100vh", display:"flex", color:"#e2e8f0" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        a{text-decoration:none}
        *::-webkit-scrollbar{width:4px} *::-webkit-scrollbar-track{background:transparent} *::-webkit-scrollbar-thumb{background:#1e2535;border-radius:4px}
        .pill:hover{opacity:.85} .prow:hover{background:rgba(99,102,241,0.05)!important} .pbtn:hover{opacity:.8}
      `}</style>

      {/* ════════════════ SIDEBAR ════════════════ */}
      <aside style={{
        width: collapsed ? 64 : 220, minHeight:"100vh", flexShrink:0,
        background:"#0d1117", borderRight:"1px solid rgba(255,255,255,0.06)",
        display:"flex", flexDirection:"column",
        transition:"width 0.25s ease", position:"sticky", top:0, height:"100vh", overflowY:"auto",
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "18px 0" : "18px 16px",
          display:"flex", alignItems:"center", gap:10,
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            width:32, height:32, borderRadius:8, flexShrink:0,
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:700, color:"#fff",
          }}>P</div>
          {!collapsed && (
            <span style={{ fontSize:15, fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>
              PlacePrep<span style={{color:"#818cf8"}}>AI</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:2 }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} style={{
              display:"flex", alignItems:"center", gap:10,
              padding: collapsed ? "10px 0" : "10px 12px",
              borderRadius:8, textDecoration:"none",
              justifyContent: collapsed ? "center" : "flex-start",
              background: item.active ? "rgba(99,102,241,0.15)" : "transparent",
              color:  item.active ? "#818cf8" : "#94a3b8",
              border: item.active ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
              fontSize:13, fontWeight: item.active ? 600 : 400,
              transition:"all 0.15s",
            }}>
              <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
              {!collapsed && <span style={{whiteSpace:"nowrap",overflow:"hidden"}}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse btn */}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            margin:"8px", padding:"8px", background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)", borderRadius:8,
            cursor:"pointer", color:"#64748b", fontSize:11, textAlign:"center",
          }}
        >{collapsed ? "→" : "← Collapse"}</button>

        {/* User */}
        <div style={{
          padding: collapsed ? "12px 0" : "12px 16px",
          borderTop:"1px solid rgba(255,255,255,0.06)",
          display:"flex", alignItems:"center", gap:10,
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <div style={{
            width:32, height:32, borderRadius:8, flexShrink:0,
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:700, color:"#fff",
          }}>{initials}</div>
          {!collapsed && (
            <div style={{overflow:"hidden"}}>
              <div style={{fontSize:13,fontWeight:500,color:"#e2e8f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div>
              <div style={{fontSize:11,color:"#475569"}}>Free Plan</div>
            </div>
          )}
        </div>
      </aside>

      {/* ════════════════ MAIN ════════════════ */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* Topbar */}
        <header style={{
          height:56, padding:"0 24px", background:"#0d1117",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:20,
        }}>
          <div style={{fontSize:13, color:"#64748b"}}>
            <Link to="/dashboard" style={{color:"#64748b"}}>Dashboard</Link>
            <span style={{margin:"0 6px", color:"#2d3748"}}>/</span>
            <span style={{color:"#e2e8f0", fontWeight:500}}>DSA Practice</span>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            {/* total pill */}
            <div style={{
              padding:"4px 14px", borderRadius:20, fontSize:12.5,
              background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)",
              color:"#818cf8", fontWeight:500,
            }}>{pagination.total || "—"} problems</div>

            {/* Avatar */}
            <div style={{position:"relative"}}>
              <div
                onClick={() => setAvatarOpen(v => !v)}
                style={{
                  width:32, height:32, borderRadius:8,
                  background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer",
                }}
              >{initials}</div>
              {avatarOpen && (
                <div style={{
                  position:"absolute", top:40, right:0, zIndex:50, minWidth:150,
                  background:"#13171f", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, padding:8,
                }}>
                  <div style={{padding:"8px 12px",fontSize:13,color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.06)",marginBottom:4}}>{name}</div>
                  <button
                    onClick={() => { logout(); navigate("/login"); }}
                    style={{width:"100%",padding:"8px 12px",fontSize:13,color:"#ef4444",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",borderRadius:6}}
                  >Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <div style={{padding:"28px", overflowY:"auto"}}>

          {/* Page title */}
          <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24}}>
            <div>
              <h1 style={{fontSize:22, fontWeight:700, color:"#f1f5f9", margin:0, letterSpacing:"-0.3px"}}>
                DSA Practice
              </h1>
              <p style={{fontSize:13, color:"#64748b", marginTop:4, margin:"4px 0 0"}}>
                Filter by company, topic, or difficulty · Problems shuffle every visit
              </p>
            </div>
            {/* Progress */}
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"#64748b",marginBottom:4,letterSpacing:"0.06em",textTransform:"uppercase"}}>Your Progress</div>
              <div style={{fontSize:13,fontWeight:600,color:"#10b981"}}>
                {solved.size} <span style={{color:"#475569",fontWeight:400}}>/ {pagination.total || "—"}</span>
              </div>
              <div style={{width:120,height:4,background:"rgba(255,255,255,0.06)",borderRadius:4,marginTop:6,overflow:"hidden"}}>
                <div style={{
                  height:"100%", borderRadius:4,
                  background:"linear-gradient(90deg,#6366f1,#10b981)",
                  width: pagination.total ? `${(solved.size/pagination.total)*100}%` : "0%",
                  transition:"width 0.4s ease",
                }}/>
              </div>
            </div>
          </div>

          {/* ── COMPANY filter ── */}
          <div style={{
            background:"#0d1117", border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:14, padding:"18px 20px", marginBottom:12,
          }}>
            <div style={{fontSize:11,fontWeight:600,color:"#475569",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>
              COMPANY
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              <button className="pill" onClick={() => {setCompany("");setPage(1);}} style={pillSt(!company)}>All</button>
              {visCo.map(c => (
                <button key={c} className="pill"
                  onClick={() => {setCompany(c===company?"":c);setPage(1);}}
                  style={pillSt(company===c)}
                >{c}</button>
              ))}
              <button className="pill" onClick={() => setShowAllCo(v=>!v)} style={{
                padding:"6px 14px", borderRadius:20, fontSize:12.5,
                background:"transparent", color:"#6366f1",
                border:"1px dashed rgba(99,102,241,0.3)", cursor:"pointer",
              }}>
                {showAllCo ? "Show less ↑" : `+${COMPANIES.length-11} more ↓`}
              </button>
            </div>
          </div>

          {/* ── DIFFICULTY + TOPIC ── */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 2fr", gap:12, marginBottom:12}}>
            {/* Difficulty */}
            <div style={{background:"#0d1117",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px 20px"}}>
              <div style={{fontSize:11,fontWeight:600,color:"#475569",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>DIFFICULTY</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <button className="pill" onClick={() => {setDifficulty("");setPage(1);}} style={pillSt(!difficulty)}>All</button>
                {["Easy","Medium","Hard"].map(d => (
                  <button key={d} className="pill"
                    onClick={() => {setDifficulty(d===difficulty?"":d);setPage(1);}}
                    style={pillSt(difficulty===d, DIFF[d]?.color)}
                  >
                    <span style={{width:6,height:6,borderRadius:"50%",background:DIFF[d]?.color,display:"inline-block",marginRight:5}}/>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div style={{background:"#0d1117",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px 20px"}}>
              <div style={{fontSize:11,fontWeight:600,color:"#475569",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>TOPIC</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",maxHeight:80,overflowY:"auto"}}>
                <button className="pill" onClick={() => {setTopic("");setPage(1);}} style={pillSt(!topic)}>All</button>
                {topics.map(t => (
                  <button key={t} className="pill"
                    onClick={() => {setTopic(t===topic?"":t);setPage(1);}}
                    style={pillSt(topic===t)}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter bar */}
          {activeCt > 0 && (
            <div style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"9px 16px", borderRadius:10, marginBottom:12,
              background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)",
            }}>
              <span style={{fontSize:12,color:"#64748b"}}>Active filters:</span>
              {company    && <Tag>{company}</Tag>}
              {difficulty && <Tag color={DIFF[difficulty]?.color}>{difficulty}</Tag>}
              {topic      && <Tag>{topic}</Tag>}
              <button onClick={clearAll} style={{
                marginLeft:"auto",fontSize:12,color:"#ef4444",
                background:"transparent",border:"none",cursor:"pointer",
              }}>✕ Clear all</button>
            </div>
          )}

          {/* ── PROBLEMS TABLE ── */}
          <div style={{background:"#0d1117",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,overflow:"hidden"}}>
            {/* Table header */}
            <div style={{
              display:"grid", gridTemplateColumns:"44px 1fr 100px 130px 80px",
              padding:"11px 20px",
              background:"rgba(255,255,255,0.02)",
              borderBottom:"1px solid rgba(255,255,255,0.06)",
              fontSize:11, fontWeight:600, color:"#475569",
              letterSpacing:"0.07em", textTransform:"uppercase",
            }}>
              <span/>
              <span>Problem</span>
              <span>Difficulty</span>
              <span>Topic</span>
              <span>Accept</span>
            </div>

            {/* Skeletons */}
            {loading && Array.from({length:10}).map((_,i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"44px 1fr 100px 130px 80px",
                padding:"15px 20px", alignItems:"center",
                borderBottom:"1px solid rgba(255,255,255,0.04)",
              }}>
                <Sk w={22} h={22} round />
                <Sk w="65%" />
                <Sk w={60} />
                <Sk w={80} />
                <Sk w={40} />
              </div>
            ))}

            {/* Empty */}
            {!loading && problems.length === 0 && (
              <div style={{textAlign:"center",padding:"56px 20px",color:"#475569"}}>
                <div style={{fontSize:36,marginBottom:12}}>🔍</div>
                <div style={{fontSize:15,fontWeight:500,color:"#94a3b8",marginBottom:4}}>No problems found</div>
                <div style={{fontSize:13,marginBottom:16}}>Try different filters</div>
                <button onClick={clearAll} style={{
                  padding:"8px 20px",borderRadius:8,fontSize:13,cursor:"pointer",
                  background:"rgba(99,102,241,0.15)",color:"#818cf8",
                  border:"1px solid rgba(99,102,241,0.3)",
                }}>Clear filters</button>
              </div>
            )}

            {/* Rows */}
            {!loading && problems.map((p, i) => {
              const isSolved = solved.has(p.slug);
              const diff     = p.difficulty || "Easy";
              const dc       = DIFF[diff] || DIFF.Easy;
              const tpc      = p.primary_topic || (p.topics||[])[0] || "—";
              const acc      = p.acceptance_rate != null ? `${Math.round(p.acceptance_rate*100)}%` : "—";

              return (
                <div key={p.slug} className="prow" style={{
                  display:"grid", gridTemplateColumns:"44px 1fr 100px 130px 80px",
                  padding:"13px 20px", alignItems:"center",
                  borderBottom:"1px solid rgba(255,255,255,0.04)",
                  background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)",
                  transition:"background 0.12s",
                }}>
                  {/* Check */}
                  <div>
                    <button onClick={() => markSolved(p.slug)} style={{
                      width:22, height:22, borderRadius:"50%", cursor: isSolved?"default":"pointer",
                      border: isSolved ? "none" : "2px solid rgba(255,255,255,0.18)",
                      background: isSolved ? "#10b981" : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all 0.2s",
                    }}>
                      {isSolved && <span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                    </button>
                  </div>

                  {/* Title */}
                  <div style={{overflow:"hidden",paddingRight:12}}>
                    {p.link
                      ? <Link to={`/dsa/problem/${p.slug}`} style={{
  fontSize:13.5, fontWeight:500,
  color: isSolved ? "#475569" : "#e2e8f0",
  textDecoration: isSolved ? "line-through" : "none",
  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
  display:"block", transition:"color 0.15s",
}}
onMouseEnter={e=>e.target.style.color="#818cf8"}
onMouseLeave={e=>e.target.style.color=isSolved?"#475569":"#e2e8f0"}
>{p.title}</Link>
                      : <span style={{fontSize:13.5,fontWeight:500,color:isSolved?"#475569":"#e2e8f0",textDecoration:isSolved?"line-through":"none"}}>{p.title}</span>
                    }
                    {/* company tags — subtle */}
                    {(p.companies||[]).length > 0 && (
                      <div style={{fontSize:11,color:"#2d3748",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                        {(p.companies||[]).slice(0,4).join(" · ")}
                        {(p.companies||[]).length>4 && <span style={{color:"#374151"}}> +{(p.companies||[]).length-4}</span>}
                      </div>
                    )}
                  </div>

                  {/* Difficulty badge */}
                  <div>
                    <span style={{
                      padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                      color:dc.color, background:dc.bg, border:`1px solid ${dc.border}`,
                    }}>{diff}</span>
                  </div>

                  {/* Topic */}
                  <div>
                    <span style={{
                      padding:"3px 10px", borderRadius:6, fontSize:11,
                      background:"rgba(99,102,241,0.1)", color:"#818cf8",
                      border:"1px solid rgba(99,102,241,0.15)",
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                      display:"inline-block", maxWidth:120,
                    }}>{tpc}</span>
                  </div>

                  {/* Accept rate */}
                  <div style={{fontSize:12,color:"#475569",fontFamily:"'Fira Code',monospace"}}>{acc}</div>
                </div>
              );
            })}
          </div>

          {/* ── PAGINATION ── */}
          {!loading && pagination.total_pages > 1 && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"20px 0 8px"}}>
              <PBtn disabled={!pagination.has_prev} onClick={() => setPage(p=>p-1)}>←</PBtn>
              {Array.from({length: Math.min(pagination.total_pages,7)},(_,i)=>i+1).map(n => (
                <PBtn key={n} active={page===n} onClick={() => setPage(n)}>{n}</PBtn>
              ))}
              {pagination.total_pages > 7 && page < pagination.total_pages-2 && (
                <><span style={{color:"#2d3748",fontSize:13}}>…</span>
                <PBtn active={page===pagination.total_pages} onClick={()=>setPage(pagination.total_pages)}>{pagination.total_pages}</PBtn></>
              )}
              <PBtn disabled={!pagination.has_next} onClick={() => setPage(p=>p+1)}>→</PBtn>
            </div>
          )}

          {/* Results info */}
          {!loading && problems.length > 0 && (
            <div style={{textAlign:"center",fontSize:12,color:"#374151",marginTop:4}}>
              Showing {(page-1)*15+1}–{Math.min(page*15, pagination.total||0)} of {pagination.total||0} problems
              {activeCt===0 && <span style={{color:"#4b5563"}}> · Randomized each visit 🎲</span>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Small helper components ───────────────────────────────────────────────────
function pillSt(active, color) {
  return {
    padding:"6px 13px", borderRadius:20, fontSize:12.5, cursor:"pointer",
    fontWeight: active ? 600 : 400, transition:"all 0.15s", whiteSpace:"nowrap",
    display:"inline-flex", alignItems:"center",
    background: active ? (color ? `${color}20` : "rgba(99,102,241,0.18)") : "rgba(255,255,255,0.04)",
    color:  active ? (color || "#818cf8") : "#94a3b8",
    border: active ? `1px solid ${color ? `${color}50`:"rgba(99,102,241,0.35)"}` : "1px solid rgba(255,255,255,0.08)",
  };
}

function Tag({ children, color }) {
  return (
    <span style={{
      padding:"2px 10px", borderRadius:20, fontSize:12,
      background: color ? `${color}18` : "rgba(99,102,241,0.12)",
      color: color || "#818cf8",
      border:`1px solid ${color ? `${color}35`:"rgba(99,102,241,0.2)"}`,
    }}>{children}</span>
  );
}

function Sk({ w, h=13, round }) {
  return <div style={{
    width:w, height:h, borderRadius: round ? "50%" : 6,
    background:"linear-gradient(90deg,#1a2035 25%,#212b40 50%,#1a2035 75%)",
    backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite",
  }}/>;
}

function PBtn({ children, active, disabled, onClick }) {
  return (
    <button className="pbtn" onClick={disabled ? undefined : onClick} style={{
      minWidth:34, height:34, borderRadius:8, fontSize:13,
      display:"flex", alignItems:"center", justifyContent:"center",
      cursor: disabled ? "default" : "pointer", fontWeight: active ? 600 : 400,
      background: active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
      color: disabled ? "#2d3748" : active ? "#818cf8" : "#94a3b8",
      border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.08)",
      transition:"all 0.15s",
    }}>{children}</button>
  );
}
