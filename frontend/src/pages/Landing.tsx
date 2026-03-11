import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-20">

      
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Land your next job
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          AI-powered resume tools that tell you exactly what recruiters and ATS systems see — and how to fix it.
        </p>
      </div>

      
      <div className="grid md:grid-cols-3 gap-6 items-stretch">

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col">
          <CardContent className="p-8 flex flex-col flex-1 space-y-6">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Analyze Resume</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get a full ATS compatibility report, hireability score, keyword analysis, and actionable feedback.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> ATS compatibility score</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Strengths & weaknesses</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Missing keywords</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Actionable improvements</div>
            </div>
            <div className="mt-auto pt-2">
              <Button className="w-full bg-black text-white hover:bg-black" onClick={() => navigate("/analyze")}>
                Analyze my resume
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col">
          <CardContent className="p-8 flex flex-col flex-1 space-y-6">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Job Matcher</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Paste any job description and instantly see how well your resume matches — with tailored tips to close the gap.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Match score for this role</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Matched & missing skills</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Keywords to add</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Job-specific improvements</div>
            </div>
            <div className="mt-auto pt-2">
              <Button className="w-full bg-black text-white hover:bg-black" onClick={() => navigate("/match")}>
                Match to a job
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col">
          <CardContent className="p-8 flex flex-col flex-1 space-y-6">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Resume Rewriter</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Paste any weak bullet point and get an AI-improved version with metrics, impact language, and strong action verbs.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Strong action verbs</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Quantified achievements</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> ATS optimized language</div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Copy & regenerate</div>
            </div>
            <div className="mt-auto pt-2">
              <Button className="w-full bg-black text-white hover:bg-black" onClick={() => navigate("/rewrite")}>
                Rewrite bullets
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <p className="text-muted-foreground text-sm">Three steps to a stronger resume</p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 relative">
          <div className="hidden md:block absolute top-6 left-[38%] w-[24%] h-px bg-gray-200 z-0" />
          <div className="hidden md:block absolute top-6 right-[38%] w-[24%] h-px bg-gray-200 z-0" />

          {[
            {
              step: "01",
              title: "Upload your resume",
              description: "Drop your PDF resume into any of our tools. We parse it instantly — no account needed.",
            },
            {
              step: "02",
              title: "Get AI analysis",
              description: "Our AI evaluates your resume like a senior recruiter — scoring ATS compatibility, keywords, structure, and impact.",
            },
            {
              step: "03",
              title: "Improve & apply",
              description: "Follow specific, actionable suggestions. Rewrite weak bullets. Match your resume to the exact job you want.",
            },
          ].map(({ step, title, description }, i) => (
            <div key={i} className="relative flex flex-col items-center text-center px-6 space-y-4 z-10">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
                {step}
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <p className="text-center text-xs text-muted-foreground">
        Powered by Llama 3.1 via Groq — analysis takes under 10 seconds
      </p>

    </div>
  )
}