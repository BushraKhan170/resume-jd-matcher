"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload a resume.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Step 1: Upload resume
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        "http://127.0.0.1:8000/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || uploadData.error) {
        throw new Error(uploadData.error || "Resume upload failed.");
      }

      // Step 2: Analyze resume
      const analyzeResponse = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: uploadData.resume_text,
            job_description: jobDescription,
          }),
        }
      );

      const analyzeData = await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        throw new Error("Analysis failed.");
      }

      setResult(analyzeData);
    } catch (error: any) {
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Resume Screener
        </h1>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Upload Resume (PDF/DOCX)
          </label>

          <input
            type="file"
            accept=".pdf,.docx"
            className="border rounded p-2 w-full"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Job Description
          </label>

          <textarea
            rows={8}
            className="border rounded p-2 w-full"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <button
          onClick={analyzeResume}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {result && (
          <div className="mt-8 border rounded-lg p-6 bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>

            <p className="text-xl mb-4">
              <strong>Match Score:</strong> {result.match_score}%
            </p>

            <div className="mb-4">
              <h3 className="font-bold">Missing Keywords</h3>
              <ul className="list-disc ml-6">
                {result.missing_keywords.map(
                  (keyword: string, index: number) => (
                    <li key={index}>{keyword}</li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">Strengths</h3>
              <ul className="list-disc ml-6">
                {result.strengths.map(
                  (item: string, index: number) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-bold">Suggestions</h3>
              <ul className="list-disc ml-6">
                {result.suggestions.map(
                  (item: string, index: number) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}