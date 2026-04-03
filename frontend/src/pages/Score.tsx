import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Badge } from "../components/ui/badge"
import axios from "axios"

export default function Score() {
  const location = useLocation()
  const navigate = useNavigate()
  const result: any = location.state
  const [animated, setAnimated] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const [jobDesc, setJobDesc] = useState("")
  const [matchLoading, setMatchLoading] = useState(false)
  const [matchResult, setMatchResult] = useState<any>(null)
  const [matchError, setMatchError] = useState("")

  const [bulletInput, setBulletInput] = useState("")
  const [rewriteLoading, setRewriteLoading] = useState(false)
  const [rewriteResult, setRewriteResult] = useState<any>(null)
  const [rewriteError, setRewriteError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  if (!result) {
    return (
      <div className="text-center mt-20 text-gray-400">
        No analysis found.{" "}
        <button className="underline" onClick={() => navigate("/analyze")}>Go back</button>
      </div>
    )
  }

  const {
    overallScore = 0, atsScore = 0, skillsScore = 0,
    experienceScore = 0, structureScore = 0, keywordScore = 0,
    inferredRole = "", strengths = [], weaknesses = [],
    improvements = [], keywordsDetected = [], missingKeywords = [],
    summary = "", resumeUrl = "", resumeName = "",
  } = result

  const SIDEBAR_BG = "#1a2332"
  const SIDEBAR_HOVER = "rgba(255,255,255,0.07)"
  const SIDEBAR_ACTIVE = "rgba(255,255,255,0.13)"
  const SIDEBAR_TEXT = "rgba(255,255,255,0.6)"
  const SIDEBAR_TEXT_ACTIVE = "#ffffff"
  const SIDEBAR_LABEL = "rgba(255,255,255,0.28)"

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#f97316"
    if (score >= 60) return "#f59e0b"
    return "#ef4444"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong Resume"
    if (score >= 60) return "Fair Resume"
    return "Weak Resume"
  }

  const ScoreRingSidebar = ({ score, size = 58 }: { score: number; size?: number }) => {
    const stroke = 5, r = (size - stroke * 2) / 2
    const circumference = r * 2 * Math.PI
    const offset = circumference - (animated ? score / 100 : 0) * circumference
    const color = getScoreColor(score)
    return (
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }} />
        </svg>
        <div className="absolute"><p className="font-bold text-white" style={{ fontSize: size * 0.24 }}>{Math.round(score)}</p></div>
      </div>
    )
  }

  const ScoreBar = ({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) => {
    const color = getScoreColor(score)
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-base text-gray-600">{label}</span>
          <span className="text-base font-bold" style={{ color }}>{score}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full"
            style={{ width: animated ? `${score}%` : "0%", backgroundColor: color, transition: `width 0.9s ease ${delay}ms` }} />
        </div>
      </div>
    )
  }

  const MatchScoreRing = ({ score }: { score: number }) => {
    const size = 110, stroke = 7, r = (size - stroke * 2) / 2
    const circumference = r * 2 * Math.PI
    const offset = circumference - (score / 100) * circumference
    const color = getScoreColor(score)
    return (
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div className="absolute text-center">
          <p className="font-bold text-2xl" style={{ color }}>{Math.round(score)}</p>
          <p className="text-xs text-gray-400">Match</p>
        </div>
      </div>
    )
  }

  const handleJobMatch = async () => {
    if (!jobDesc.trim()) return
    setMatchLoading(true); setMatchResult(null); setMatchError("")
    try {
      const blobRes = await fetch(resumeUrl)
      const blob = await blobRes.blob()
      const file = new File([blob], resumeName || "resume.pdf", { type: "application/pdf" })
      const formData = new FormData()
      formData.append("resume", file)
      formData.append("jobDescription", jobDesc)
      const res = await axios.post("http://localhost:8080/match", formData)
      setMatchResult(res.data)
    } catch { setMatchError("Match failed. Please try again.") }
    finally { setMatchLoading(false) }
  }

  const handleRewrite = async () => {
    if (!bulletInput.trim()) return
    setRewriteLoading(true); setRewriteResult(null); setRewriteError("")
    try {
      const res = await axios.post("http://localhost:8080/rewrite", { bullet: bulletInput })
      setRewriteResult(res.data)
    } catch { setRewriteError("Rewrite failed. Please try again.") }
    finally { setRewriteLoading(false) }
  }

  const handleCopy = () => {
    if (rewriteResult?.rewritten) {
      navigator.clipboard.writeText(rewriteResult.rewritten)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "strengths", label: "Strengths" },
    { id: "weaknesses", label: "Weaknesses" },
    { id: "improvements", label: "How to Improve" },
    { id: "keywords", label: "Keywords" },
  ]

  const tools = [
    { id: "jobmatcher", label: "Job Matcher", icon: "" },
    { id: "rewriter", label: "Resume Rewriter", icon: "" },
  ]

  const sidebarBtn = (id: string, label: string, icon?: string) => {
    const isActive = activeTab === id
    return (
      <button key={id} onClick={() => setActiveTab(id)}
        className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
        style={{ backgroundColor: isActive ? SIDEBAR_ACTIVE : "transparent", color: isActive ? SIDEBAR_TEXT_ACTIVE : SIDEBAR_TEXT }}
        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = SIDEBAR_HOVER }}
        onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}>
        {icon && <span>{icon}</span>}{label}
      </button>
    )
  }

  const actionBtn = (onClick: () => void, disabled: boolean, loading: boolean, label: string, loadingLabel: string) => (
    <button onClick={onClick} disabled={disabled}
      className="w-full h-11 rounded-xl text-sm font-semibold transition-all"
      style={{ backgroundColor: disabled ? "#e5e7eb" : SIDEBAR_BG, color: disabled ? "#9ca3af" : "#ffffff", cursor: disabled ? "not-allowed" : "pointer" }}>
      {loading ? loadingLabel : label}
    </button>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Hireability Score</h2>
              {inferredRole && <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Evaluated as: {inferredRole}</p>}
              <p className="text-base text-gray-500 leading-relaxed">{summary}</p>
            </div>
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="space-y-1">
                <p className="text-6xl font-bold text-gray-800">{Math.round(overallScore)}<span className="text-2xl text-gray-400 font-normal">/100</span></p>
                <p className="text-lg font-semibold" style={{ color: getScoreColor(overallScore) }}>{getScoreLabel(overallScore)}</p>
                <p className="text-sm text-gray-400">Overall hireability score</p>
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Category Breakdown</p>
              <ScoreBar label="ATS Compatibility" score={atsScore} delay={0} />
              <ScoreBar label="Skills Relevance" score={skillsScore} delay={80} />
              <ScoreBar label="Experience Quality" score={experienceScore} delay={160} />
              <ScoreBar label="Resume Structure" score={structureScore} delay={240} />
              <ScoreBar label="Keyword Relevance" score={keywordScore} delay={320} />
            </div>
          </div>
        )

      case "strengths":
        return (
          <div className="space-y-5">
            <div><h2 className="text-2xl font-bold text-gray-800">Strengths</h2><p className="text-base text-gray-400 mt-1">What your resume does well</p></div>
            <div className="space-y-3">
              {strengths.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <span className="text-green-500 mt-0.5 shrink-0 font-bold text-lg">↑</span>
                  <p className="text-base text-gray-700 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "weaknesses":
        return (
          <div className="space-y-5">
            <div><h2 className="text-2xl font-bold text-gray-800">Weaknesses</h2><p className="text-base text-gray-400 mt-1">Areas that need attention</p></div>
            <div className="space-y-3">
              {weaknesses.map((w: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-red-400 mt-0.5 shrink-0 font-bold text-lg">↓</span>
                  <p className="text-base text-gray-700 leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "improvements":
        return (
          <div className="space-y-5">
            <div><h2 className="text-2xl font-bold text-gray-800">How to Improve</h2><p className="text-base text-gray-400 mt-1">Actionable steps to boost your score</p></div>
            <div className="space-y-3">
              {improvements.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-300 mt-0.5 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-base text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "keywords":
        return (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-800">Keywords</h2><p className="text-base text-gray-400 mt-1">Keyword analysis from your resume</p></div>
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Detected in your resume</p>
              <div className="flex flex-wrap gap-2">
                {keywordsDetected.length > 0
                  ? keywordsDetected.map((k: string, i: number) => <Badge key={i} variant="secondary" className="text-sm font-medium">{k}</Badge>)
                  : <p className="text-base text-gray-400">None detected.</p>}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Missing keywords</p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.length > 0
                  ? missingKeywords.map((k: string, i: number) => <Badge key={i} variant="outline" className="text-sm font-medium text-red-500 border-red-200">+ {k}</Badge>)
                  : <p className="text-base text-gray-400">None identified.</p>}
              </div>
            </div>
          </div>
        )

      case "jobmatcher":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Job Matcher</h2>
              <p className="text-base text-gray-400 mt-1">Paste a job description to see how well your resume matches</p>
            </div>
            <div className="space-y-3">
              <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here..." rows={8}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:border-gray-400 transition-colors" />
              {actionBtn(handleJobMatch, matchLoading || !jobDesc.trim(), matchLoading, "Check Match", "Analyzing match...")}
              {matchError && <p className="text-sm text-red-500">{matchError}</p>}
            </div>
            {matchResult && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <MatchScoreRing score={matchResult.matchScore} />
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gray-800">{matchResult.matchScore}<span className="text-lg text-gray-400 font-normal">/100</span></p>
                    <p className="text-base font-semibold" style={{ color: getScoreColor(matchResult.matchScore) }}>
                      {matchResult.matchScore >= 80 ? "Strong Match" : matchResult.matchScore >= 60 ? "Partial Match" : "Weak Match"}
                    </p>
                    <p className="text-sm text-gray-400">{matchResult.verdict}</p>
                  </div>
                </div>
                {matchResult.summary && <p className="text-base text-gray-500 leading-relaxed">{matchResult.summary}</p>}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Matched Skills</p>
                    {matchResult.matchedSkills?.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="text-green-500 shrink-0 font-bold mt-0.5">✓</span>{s}</div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Missing Skills</p>
                    {matchResult.missingSkills?.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="text-red-400 shrink-0 font-bold mt-0.5">✗</span>{s}</div>
                    ))}
                  </div>
                </div>
                {matchResult.keywordsToAdd?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Keywords to Add</p>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.keywordsToAdd.map((k: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs text-red-500 border-red-200">+ {k}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {matchResult.tailoredImprovements?.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">How to Tailor Your Resume</p>
                    {matchResult.tailoredImprovements.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-300 mt-0.5 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => { setMatchResult(null); setJobDesc("") }} className="text-sm text-gray-400 hover:text-black transition-colors underline">
                  Try another job description
                </button>
              </div>
            )}
          </div>
        )

      case "rewriter":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Resume Rewriter</h2>
              <p className="text-base text-gray-400 mt-1">Paste a bullet point and get an AI-powered rewrite</p>
            </div>
            <div className="space-y-3">
              <textarea value={bulletInput} onChange={(e) => setBulletInput(e.target.value)}
                placeholder="e.g. Worked on backend APIs for the product team..." rows={5}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:border-gray-400 transition-colors" />
              {actionBtn(handleRewrite, rewriteLoading || !bulletInput.trim(), rewriteLoading, "Rewrite with AI", "Rewriting...")}
              {rewriteError && <p className="text-sm text-red-500">{rewriteError}</p>}
            </div>
            {rewriteResult && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Original</p>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-sm text-gray-600 leading-relaxed">{bulletInput}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Rewritten</p>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100 relative">
                    <p className="text-sm text-gray-800 leading-relaxed font-medium pr-16">{rewriteResult.rewritten}</p>
                    <button onClick={handleCopy}
                      className="absolute top-3 right-3 text-xs px-3 py-1.5 rounded-lg border transition-all"
                      style={{ borderColor: copied ? "#16a34a" : "#d1d5db", color: copied ? "#16a34a" : "#6b7280", backgroundColor: "white" }}>
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                {rewriteResult.explanation && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Why it's better</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{rewriteResult.explanation}</p>
                  </div>
                )}
                {rewriteResult.improvements?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Improvements made</p>
                    <div className="flex flex-wrap gap-2">
                      {rewriteResult.improvements.map((imp: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{imp}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-1">
                  <button onClick={handleRewrite}
                    className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black transition-all">
                    Regenerate
                  </button>
                  <button onClick={() => { setRewriteResult(null); setBulletInput("") }}
                    className="text-sm text-gray-400 hover:text-black transition-colors underline">
                    Try another bullet
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      default: return null
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Georgia', serif" }}>

    
      <div className="w-full border-b border-gray-200 bg-white flex items-center justify-between px-8" style={{ height: "56px", flexShrink: 0 }}>
        <span className="font-bold text-lg cursor-pointer tracking-tight" onClick={() => navigate("/")}>ResumeAI</span>
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-black transition-colors">Home</button>
          <button onClick={() => navigate("/analyze")} className="hover:text-black transition-colors font-semibold text-black">Analyze Resume</button>
          <button onClick={() => navigate("/match")} className="hover:text-black transition-colors">Job Matcher</button>
          <button onClick={() => navigate("/rewrite")} className="hover:text-black transition-colors">Rewriter</button>
          <button onClick={() => navigate("/dashboard")} className="hover:text-black transition-colors">Dashboard</button>
        </nav>
      </div>

      <div className="flex flex-1 overflow-hidden">

       
        <div className="flex flex-col overflow-y-auto" style={{ width: "225px", flexShrink: 0, backgroundColor: SIDEBAR_BG }}>
          <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3">
              <ScoreRingSidebar score={overallScore} size={58} />
              <div>
                <p className="text-2xl font-bold text-white">{Math.round(overallScore)}</p>
                <p className="text-xs" style={{ color: SIDEBAR_LABEL }}>Overall</p>
              </div>
            </div>
            {inferredRole && <p className="text-xs mt-3 truncate" style={{ color: SIDEBAR_LABEL }}>{inferredRole}</p>}
          </div>
          <div className="p-3 flex-1 space-y-0.5">
            <p className="text-xs font-semibold tracking-widest px-3 py-2 uppercase" style={{ color: SIDEBAR_LABEL }}>Analysis</p>
            {tabs.map((tab) => sidebarBtn(tab.id, tab.label))}
          </div>
          <div className="p-3 border-t space-y-0.5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold tracking-widest px-3 py-2 uppercase" style={{ color: SIDEBAR_LABEL }}>Tools</p>
            {tools.map((tool) => sidebarBtn(tool.id, tool.label, tool.icon))}
          </div>
        </div>

      
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="flex items-center justify-end px-10 pt-6 pb-2">
          
            <button onClick={() => navigate("/analyze")}
              className="text-sm font-medium text-white rounded-lg px-5 py-2 transition-all hover:opacity-90"
              style={{ backgroundColor: SIDEBAR_BG }}>
              ← Analyze another resume
            </button>
          </div>
          <div className="px-10 pb-10 max-w-2xl">
            {renderTabContent()}
          </div>
        </div>

       
        <div className="flex flex-col border-l border-gray-100 bg-white overflow-hidden" style={{ width: "560px", flexShrink: 0 }}>
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Resume Preview</p>
            {resumeName && <p className="text-xs text-gray-400 mt-1 truncate">{resumeName}</p>}
          </div>
          <div className="flex-1 overflow-hidden">
            {resumeUrl ? (
              <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`}
                className="w-full h-full border-0" title="Resume Preview" />
            ) : (
              <div className="flex items-center justify-center h-full text-center p-6">
                <div className="space-y-2">
                  <p className="text-4xl">📄</p>
                  <p className="text-sm text-gray-400">Resume preview unavailable</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}