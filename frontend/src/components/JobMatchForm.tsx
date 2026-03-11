import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import AnalyzingLoader from "./AnalyzingLoader";

interface Props {
  savedFile: File | null;
  setSavedFile: (file: File | null) => void;
}

export default function JobMatchForm({ savedFile, setSavedFile }: Props) {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(savedFile);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!file) {
      setError("Please upload your resume.");
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError("Please paste a job description (at least 50 characters).");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await axios.post("http://localhost:8080/match", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/match/results", { state: res.data });
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "Match analysis failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // const matchSteps = [
  //   "Uploading resume...",
  //   "Parsing document...",
  //   "Reading job description...",
  //   "Comparing skills & keywords...",
  //   "Generating match report...",
  // ];

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-12">
      {loading && <AnalyzingLoader />}

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Job Match Analyzer</h1>
        <p className="text-muted-foreground">
          Paste a job description and see exactly how well your resume fits
        </p>
      </div>

      <div className="space-y-6">
        <label
          htmlFor="matchResumeUpload"
          className="border-2 border-dashed rounded-xl p-16 text-center cursor-pointer block hover:bg-gray-50 transition"
        >
          <div className="flex flex-col items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V3m0 0l-4 4m4-4l4 4"
              />
            </svg>
            <p className="font-medium">Drop your resume here</p>
            <p className="text-sm text-muted-foreground">
              PDF, DOC, DOCX — up to 10MB
            </p>
          </div>

          <input
            id="matchResumeUpload"
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              setSavedFile(f);
            }}
          />
        </label>

        {file && (
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {Math.round(file.size / 1024)} KB
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setSavedFile(null);
              }}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-2">
          <p className="font-medium text-sm">Job Description</p>
          <Textarea
            placeholder="Paste the full job description here — the more detail, the better the analysis..."
            className="min-h-48 resize-none text-sm leading-relaxed"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <p className="text-xs text-muted-foreground text-right">
            {jobDescription.length} characters
          </p>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button
          className="w-full h-12 bg-black text-white hover:bg-black"
          onClick={handleMatch}
          disabled={loading}
        >
          {loading ? "Analyzing match..." : "Check Job Match"}
        </Button>

        <div className="grid grid-cols-3 text-center pt-6 text-sm gap-8">
          <div>
            <p className="font-semibold tracking-wide">MATCH SCORE</p>
            <p className="text-muted-foreground mt-1">
              See how well you fit this specific role
            </p>
          </div>
          <div>
            <p className="font-semibold tracking-wide">SKILL GAPS</p>
            <p className="text-muted-foreground mt-1">
              Find exactly what's missing from your resume
            </p>
          </div>
          <div>
            <p className="font-semibold tracking-wide">TAILORED TIPS</p>
            <p className="text-muted-foreground mt-1">
              Get advice specific to this job posting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
