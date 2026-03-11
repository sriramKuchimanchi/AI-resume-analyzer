import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";

import AnalyzingLoader from "../components/AnalyzingLoader";
import Toast from "../components/Toast";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post("http://localhost:8080/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/score", { state: res.data });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setToast({
        message: "Resume analysis failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-12">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {loading && <AnalyzingLoader />}

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Analyze your resume</h1>

        <p className="text-muted-foreground">
          Upload your resume and get an instant hireability score with
          actionable feedback
        </p>
      </div>

      <div className="space-y-6">
        <label
          htmlFor="resumeUpload"
          className="border-2 border-dashed rounded-xl p-20 text-center cursor-pointer block hover:bg-gray-50 transition"
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
            id="resumeUpload"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
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
              onClick={() => setFile(null)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        )}

        <Button
          className="w-full h-12 bg-black text-white hover:bg-black"
          onClick={handleUpload}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </Button>

        <div className="grid grid-cols-3 text-center pt-6 text-sm gap-8">
          <div>
            <p className="font-semibold tracking-wide">ATS CHECK</p>

            <p className="text-muted-foreground mt-1">
              Compatibility with applicant tracking systems
            </p>
          </div>

          <div>
            <p className="font-semibold tracking-wide">KEYWORD SCAN</p>

            <p className="text-muted-foreground mt-1">
              Detect relevant industry keywords
            </p>
          </div>

          <div>
            <p className="font-semibold tracking-wide">IMPACT SCORE</p>

            <p className="text-muted-foreground mt-1">
              Measure achievement-driven language
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
