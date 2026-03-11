import { useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import Score from "./pages/Score"
import JobMatchForm from "./components/JobMatchForm"
import Match from "./pages/Match"
import Rewriter from "./pages/Rewriter"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import AdminLogin from "./pages/AdminLogin"

function App() {
  const [savedFile, setSavedFile] = useState<File | null>(null)
  const location = useLocation()

  return (
    <>
      {location.pathname !== "/score" && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analyze" element={<Home />} />
        <Route path="/score" element={<Score />} />
        <Route path="/match" element={<JobMatchForm savedFile={savedFile} setSavedFile={setSavedFile} />} />
        <Route path="/match/results" element={<Match />} />
        <Route path="/rewrite" element={<Rewriter />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </>
  )
}

export default App