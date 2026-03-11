import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()

  const links = [
    { label: "Home", path: "/" },
    { label: "Analyze Resume", path: "/analyze" },
    { label: "Job Matcher", path: "/match" },
    { label: "Rewriter", path: "/rewrite" },
    { label: "Dashboard", path: "/dashboard" },
  ]

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">

        
        <Link to="/" className="font-bold text-lg tracking-tight">
          ResumeAI
        </Link>

        
        <div className="flex items-center gap-1">
          {links.map(({ label, path }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-muted-foreground hover:text-black hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

      </div>
    </nav>
  )
}