"use client";

import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

interface AnalysisResult {
  match_score?: number;
  missing_keywords?: string[];
  strengths?: string[];
  suggestions?: string[];
  error?: string;
}

interface StudyPlanDay {
  day: number;
  title: string;
  tasks: string[];
}

interface StudyPlanResult {
  topic: string;
  study_plan: StudyPlanDay[];
}

export default function Home() {
  // =========================
  // PROJECT 1 - RESUME SCREENER
  // =========================

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!resumeFile) {
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
      formData.append("file", resumeFile);

      const uploadResponse = await fetch(
        `${API_BASE_URL}/upload-resume`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || uploadData.error) {
        throw new Error(
          uploadData.error || "Resume upload failed."
        );
      }

      // Step 2: Analyze resume
      const analyzeResponse = await fetch(
        `${API_BASE_URL}/analyze`,
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

  // =========================
  // WEEK 3 - STUDY PLANNER
  // =========================

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [documentInfo, setDocumentInfo] = useState<{
    filename: string;
    total_chunks: number;
    embedding_dimension: number;
  } | null>(null);

  const [studyPlan, setStudyPlan] =
    useState<StudyPlanResult | null>(null);

  // Upload syllabus / notes to Qdrant
  const uploadDocument = async () => {
    if (!documentFile) {
      alert("Please select a PDF, DOCX, or TXT document.");
      return;
    }

    setUploadingDocument(true);
    setStudyPlan(null);

    try {
      const formData = new FormData();
      formData.append("file", documentFile);

      const response = await fetch(
        `${API_BASE_URL}/upload-document`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Document upload failed."
        );
      }

      setDocumentUploaded(true);

      setDocumentInfo({
        filename: data.filename,
        total_chunks: data.total_chunks,
        embedding_dimension: data.embedding_dimension,
      });

      alert(
        `Document uploaded successfully!\n${data.total_chunks} chunks stored in Qdrant.`
      );
    } catch (error: any) {
      alert(
        error.message || "Something went wrong while uploading."
      );
      setDocumentUploaded(false);
    } finally {
      setUploadingDocument(false);
    }
  };

  // Generate study plan using retrieved chunks
  const generateStudyPlan = async () => {
    if (!documentUploaded) {
      alert("Please upload your notes/syllabus first.");
      return;
    }

    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    setGeneratingPlan(true);
    setStudyPlan(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/study-plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Study plan generation failed."
        );
      }

      setStudyPlan(data);
    } catch (error: any) {
      alert(
        error.message ||
          "Something went wrong while generating the study plan."
      );
    } finally {
      setGeneratingPlan(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Resume Screener & Study Planner
          </h1>

          <p className="mt-3 text-gray-600">
            Resume analysis and AI-powered study planning
          </p>
        </div>

        {/* ========================= */}
        {/* PROJECT 1 */}
        {/* ========================= */}

        <section className="bg-white rounded-xl shadow-md p-8 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            📄 AI Resume Screener
          </h2>

          {/* Resume Upload */}
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
                  setResumeFile(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Job Description
            </label>

            <textarea
              rows={8}
              className="border rounded p-3 w-full"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
            />
          </div>

          <button
            onClick={analyzeResume}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Resume"}
          </button>

          {/* Analysis Result */}
          {result && (
            <div className="mt-8 border rounded-lg p-6 bg-gray-50">

              <h2 className="text-2xl font-bold mb-4">
                Analysis Result
              </h2>

              {result.error ? (
                <p className="text-red-600">
                  {result.error}
                </p>
              ) : (
                <>
                  <p className="text-xl mb-4">
                    <strong>Match Score:</strong>{" "}
                    {result.match_score}%
                  </p>

                  <div className="mb-4">
                    <h3 className="font-bold">
                      Missing Keywords
                    </h3>

                    <ul className="list-disc ml-6">
                      {result.missing_keywords?.map(
                        (keyword, index) => (
                          <li key={index}>
                            {keyword}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-bold">
                      Strengths
                    </h3>

                    <ul className="list-disc ml-6">
                      {result.strengths?.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Suggestions
                    </h3>

                    <ul className="list-disc ml-6">
                      {result.suggestions?.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* ========================= */}
        {/* WEEK 3 STUDY PLANNER */}
        {/* ========================= */}

        <section className="bg-white rounded-xl shadow-md p-8">

          <h2 className="text-2xl font-bold mb-2">
            📚 AI Study Planner
          </h2>

          <p className="text-gray-600 mb-6">
            Upload your syllabus or notes and generate
            a study plan using relevant retrieved content.
          </p>

          {/* Document Upload */}
          <div className="mb-6">

            <label className="block font-semibold mb-2">
              Upload Syllabus / Notes
            </label>

            <input
              type="file"
              accept=".pdf,.docx,.txt"
              className="border rounded p-2 w-full"
              onChange={(e) => {
                if (e.target.files) {
                  setDocumentFile(e.target.files[0]);
                  setDocumentUploaded(false);
                  setDocumentInfo(null);
                  setStudyPlan(null);
                }
              }}
            />

            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PDF, DOCX, TXT
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadDocument}
            disabled={uploadingDocument}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {uploadingDocument
              ? "Processing Document..."
              : "Upload & Store in Qdrant"}
          </button>

          {/* Upload Success */}
          {documentInfo && (
            <div className="mt-5 p-4 rounded-lg bg-green-50 border border-green-200">

              <p className="font-semibold text-green-800">
                ✅ Document processed successfully!
              </p>

              <p className="text-sm mt-2">
                <strong>File:</strong>{" "}
                {documentInfo.filename}
              </p>

              <p className="text-sm">
                <strong>Chunks:</strong>{" "}
                {documentInfo.total_chunks}
              </p>

              <p className="text-sm">
                <strong>Embedding Dimension:</strong>{" "}
                {documentInfo.embedding_dimension}
              </p>

              <p className="text-sm mt-2 text-green-700">
                Embeddings have been stored in Qdrant.
              </p>
            </div>
          )}

          {/* Topic */}
          <div className="mt-8 mb-6">

            <label className="block font-semibold mb-2">
              Study Topic
            </label>

            <input
              type="text"
              className="border rounded p-3 w-full"
              placeholder="e.g. Process Management"
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
            />

            <p className="text-sm text-gray-500 mt-2">
              Enter a topic that exists in your uploaded
              notes or syllabus.
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateStudyPlan}
            disabled={
              generatingPlan || !documentUploaded
            }
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            {generatingPlan
              ? "Generating Study Plan..."
              : "Generate Study Plan"}
          </button>

          {/* Study Plan */}
          {studyPlan && (
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-2">
                📖 Study Plan
              </h2>

              <p className="text-gray-600 mb-6">
                Topic:{" "}
                <strong>{studyPlan.topic}</strong>
              </p>

              <div className="space-y-5">

                {studyPlan.study_plan.map(
                  (day) => (
                    <div
                      key={day.day}
                      className="border rounded-xl p-6 bg-gray-50"
                    >

                      <div className="flex items-center gap-3 mb-4">

                        <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          {day.day}
                        </div>

                        <h3 className="text-xl font-bold">
                          {day.title}
                        </h3>

                      </div>

                      <ul className="list-disc ml-12 space-y-2">

                        {day.tasks.map(
                          (task, index) => (
                            <li key={index}>
                              {task}
                            </li>
                          )
                        )}

                      </ul>

                    </div>
                  )
                )}

              </div>
            </div>
          )}

        </section>

        {/* ========================= */}
        {/* FOOTER */}
        {/* ========================= */}

        <p className="text-center text-gray-500 text-sm mt-8">
          AI & Generative AI Fellowship — Week 3
        </p>

      </div>
    </main>
  );
}