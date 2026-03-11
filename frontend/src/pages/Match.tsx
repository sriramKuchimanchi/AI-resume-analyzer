import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export default function Match() {
  const location = useLocation();
  const navigate = useNavigate();
  const result: any = location.state;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!result) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        No match data found.{" "}
        <button className="underline" onClick={() => navigate("/match")}>
          Go back
        </button>
      </div>
    );
  }

  const {
    matchScore = 0,
    verdict = "",
    summary = "",
    matchedSkills = [],
    missingSkills = [],
    tailoredImprovements = [],
    keywordsToAdd = [],
    standoutQualities = [],
  } = result;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#d97706";
    return "#dc2626";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong Match";
    if (score >= 60) return "Partial Match";
    return "Weak Match";
  };

  const ScoreCircle = ({ score }: { score: number }) => {
    const radius = 80;
    const stroke = 8;
    const r = radius - stroke * 2;
    const circumference = r * 2 * Math.PI;
    const offset = circumference - (animated ? score / 100 : 0) * circumference;
    const color = getScoreColor(score);

    return (
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            stroke="#f3f4f6"
            fill="transparent"
            strokeWidth={stroke}
            r={r}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)",
            }}
            r={r}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-4xl font-bold" style={{ color }}>
            {Math.round(score)}
          </p>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
            Match
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto py-20 px-6 space-y-6">
        <div className="text-center space-y-2 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Job Match Analysis
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            {summary}
          </p>
        </div>

        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <ScoreCircle score={matchScore} />
            <div className="text-center">
              <p className="font-semibold text-lg">
                {getScoreLabel(matchScore)}
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {verdict}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Matched Skills
              </p>
              <ul className="space-y-2">
                {matchedSkills.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    <span className="text-gray-700">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Missing Skills
              </p>
              <ul className="space-y-2">
                {missingSkills.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                    <span className="text-gray-700">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {standoutQualities.length > 0 && (
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Standout Qualities
              </p>
              <ul className="space-y-2">
                {standoutQualities.map((q: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-500 mt-0.5 shrink-0">★</span>
                    <span className="text-gray-700">{q}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-8 space-y-4">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              How to tailor your resume for this job
            </p>
            <div className="space-y-3">
              {tailoredImprovements.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-xs font-bold text-muted-foreground mt-0.5 w-4 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-8 space-y-4">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Keywords to add
            </p>
            <div className="flex flex-wrap gap-2">
              {keywordsToAdd.length > 0 ? (
                keywordsToAdd.map((k: string, i: number) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs font-medium text-red-500 border-red-200"
                  >
                    + {k}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No missing keywords identified.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/match", { state: { file: null } })}
          >
            Try another job
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Analyze resume instead
          </Button>
        </div>
      </div>
    </div>
  );
}
