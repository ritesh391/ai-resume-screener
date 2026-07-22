import { useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import ResultView from "./components/ResultView.jsx";
import { screenResume } from "./api.js";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(file, jobDescription) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await screenResume(file, jobDescription);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <p className="report-eyebrow">Automated Screening Report</p>
        <h1>Resume Match Assessment</h1>
        <p className="muted">
          Submit a resume and a role's requirements. Every report includes a match score,
          a breakdown of strengths and gaps, and a prioritized plan for closing them.
        </p>
      </header>

      <hr className="rule" />

      <UploadForm onSubmit={handleSubmit} loading={loading} />

      {error && <p className="error">{error}</p>}
      {loading && <p className="status-line">Reading resume — comparing against role requirements…</p>}

      <ResultView result={result} />
    </div>
  );
}