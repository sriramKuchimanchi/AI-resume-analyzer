import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token")
    if (!token) {
      navigate("/admin/login")
      return
    }
    axios.get("http://localhost:8080/analytics", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          sessionStorage.removeItem("admin_token")
          navigate("/admin/login")
        } else {
          setError("Failed to load analytics.")
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token")
    navigate("/admin/login")
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#16a34a"
    if (score >= 60) return "#d97706"
    return "#dc2626"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return <div className="text-center mt-20 text-muted-foreground">{error || "No data found."}</div>
  }

  const { total, averages, distribution, topKeywords, topMissingKeywords, topRoles, recent } = data

  if (total === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <p className="text-5xl">📋</p>
          <h2 className="text-xl font-bold tracking-tight">No analyses yet</h2>
          <p className="text-muted-foreground text-sm max-w-xs">Analyze a resume to start seeing insights here.</p>
          <Button className="bg-black text-white hover:bg-black" onClick={() => navigate("/analyze")}>Analyze a resume</Button>
        </div>
      </div>
    )
  }

  const categoryAverages = [
    { label: "ATS Compatibility", score: Number(averages.avg_ats) || 0 },
    { label: "Skills Relevance", score: Number(averages.avg_skills) || 0 },
    { label: "Experience Quality", score: Number(averages.avg_experience) || 0 },
    { label: "Resume Structure", score: Number(averages.avg_structure) || 0 },
    { label: "Keyword Relevance", score: Number(averages.avg_keyword) || 0 },
  ]

  const distributionBars = [
    { label: "Poor (0–39)", count: Number(distribution.poor), color: "#dc2626" },
    { label: "Fair (40–59)", count: Number(distribution.fair), color: "#d97706" },
    { label: "Good (60–79)", count: Number(distribution.good), color: "#2563eb" },
    { label: "Strong (80–100)", count: Number(distribution.strong), color: "#16a34a" },
  ]

  const maxDistribution = Math.max(...distributionBars.map((d) => d.count), 1)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-20 px-6 space-y-8">

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground text-sm">Insights across all resume analyses</p>
          </div>
          <button onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-black border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-400 transition-all">
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Total Analyses</p>
              <p className="text-4xl font-bold">{total}</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Avg Overall Score</p>
              <p className="text-4xl font-bold" style={{ color: getScoreColor(Number(averages.avg_overall)) }}>
                {averages.avg_overall || "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Strong Resumes</p>
              <p className="text-4xl font-bold text-green-600">{distribution.strong}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-8 space-y-5">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Average Scores by Category</p>
            {categoryAverages.map(({ label, score }, i) => {
              const color = getScoreColor(score)
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm font-bold" style={{ color }}>{score || "—"}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color, transition: "width 0.9s ease" }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-8 space-y-5">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Score Distribution</p>
            {distributionBars.map(({ label, count, color }, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm font-bold">{count} resumes</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ width: `${(count / maxDistribution) * 100}%`, backgroundColor: color, transition: "width 0.9s ease" }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {topRoles.length > 0 && (
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-8 space-y-4">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Top Roles Analyzed</p>
              <div className="space-y-2">
                {topRoles.map((r: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{r.inferred_role}</span>
                    <span className="font-bold text-muted-foreground">{r.count}x</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Top Detected Keywords</p>
              <div className="flex flex-wrap gap-2">
                {topKeywords.length > 0
                  ? topKeywords.map((k: any, i: number) => <Badge key={i} variant="secondary" className="text-xs">{k.keyword} · {k.count}</Badge>)
                  : <p className="text-sm text-muted-foreground">No data yet.</p>}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Top Missing Keywords</p>
              <div className="flex flex-wrap gap-2">
                {topMissingKeywords.length > 0
                  ? topMissingKeywords.map((k: any, i: number) => <Badge key={i} variant="outline" className="text-xs text-red-500 border-red-200">{k.keyword} · {k.count}</Badge>)
                  : <p className="text-sm text-muted-foreground">No data yet.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {recent.length > 0 && (
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-8 space-y-4">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Recent Analyses</p>
              <div className="space-y-3">
                {recent.map((r: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{r.inferred_role || "Unknown role"}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold" style={{ color: getScoreColor(r.overall_score) }}>{r.overall_score}/100</span>
                      <span className="text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}