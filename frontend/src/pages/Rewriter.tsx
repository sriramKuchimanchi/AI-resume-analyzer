import { useState } from "react"
import axios from "axios"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import Toast from "../components/Toast"
import AnalyzingLoader from "../components/AnalyzingLoader"

export default function Rewriter() {

  const [bullet, setBullet] = useState("")
  const [role, setRole] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const handleRewrite = async () => {
    if (!bullet.trim()) {
      setError("Please enter a bullet point to rewrite.")
      return
    }

    try {
      setError("")
      setResult(null)
      setLoading(true)

      const res = await axios.post("http://localhost:8080/rewrite", {
        bullet: bullet.trim(),
        role: role.trim(),
      })

      setResult(res.data)

    } catch (err: any) {
      setError(err.response?.data?.error || "Rewrite failed. Please try again.")
      setToast({ message: "Rewrite failed. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result?.rewritten) return
    navigator.clipboard.writeText(result.rewritten)
    setCopied(true)
    setToast({ message: "Copied to clipboard!", type: "success" })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    setResult(null)
    handleRewrite()
  }

  return (
    <div className="min-h-screen bg-white">
      {loading && <AnalyzingLoader />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-2xl mx-auto py-20 px-6 space-y-8">

        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Resume Rewriter</h1>
          <p className="text-muted-foreground text-sm">
            Paste a weak bullet point and get an AI-improved version instantly
          </p>
        </div>

    
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-8 space-y-5">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Your bullet point</p>

            <Textarea
              placeholder='e.g. "Worked on the company website" or "Helped with customer support"'
              className="min-h-28 resize-none text-sm leading-relaxed"
              value={bullet}
              onChange={(e) => {
                setBullet(e.target.value)
                setError("")
                setResult(null)
              }}
              maxLength={300}
            />

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{bullet.length}/300 characters</span>
            </div>

        
            <div className="space-y-1.5">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Your role <span className="font-normal normal-case">(optional but improves results)</span>
              </p>
              <input
                type="text"
                placeholder='e.g. "Frontend Engineer", "Data Analyst", "Product Manager"'
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              className="w-full h-11 bg-black text-white hover:bg-black"
              onClick={handleRewrite}
              disabled={loading || !bullet.trim()}
            >
              {loading ? "Rewriting..." : "Rewrite bullet point"}
            </Button>
          </CardContent>
        </Card>

        
        {result && (
          <div className="space-y-4">

            
            <div className="grid grid-cols-2 gap-4">
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Before</p>
                  <p className="text-sm text-gray-500 leading-relaxed italic">"{bullet}"</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">After</p>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">"{result.rewritten}"</p>
                </CardContent>
              </Card>
            </div>

            
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">What was improved</p>
                <p className="text-sm text-gray-600 leading-relaxed">{result.explanation}</p>
                <ul className="space-y-2">
                  {result.improvements.map((imp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5 shrink-0">↑</span>
                      <span className="text-gray-700">{imp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

        
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-black text-white hover:bg-black"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy result"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRegenerate}
                disabled={loading}
              >
                Regenerate
              </Button>
            </div>

          </div>
        )}

        
        {!result && (
          <div className="grid grid-cols-3 text-center pt-4 text-sm gap-8">
            <div>
              <p className="font-semibold tracking-wide">ACTION VERBS</p>
              <p className="text-muted-foreground mt-1">Every bullet starts with a strong past-tense verb</p>
            </div>
            <div>
              <p className="font-semibold tracking-wide">METRICS</p>
              <p className="text-muted-foreground mt-1">Adds realistic numbers and impact where possible</p>
            </div>
            <div>
              <p className="font-semibold tracking-wide">ATS READY</p>
              <p className="text-muted-foreground mt-1">Optimized for applicant tracking systems</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}