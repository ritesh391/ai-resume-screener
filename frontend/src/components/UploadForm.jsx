import { useState } from "react";

export default function UploadForm({ onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [formError, setFormError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!file) return setFormError("Attach a resume PDF to continue.");
    if (jobDescription.trim().length < 20)
      return setFormError("Add a fuller job description — a sentence or two isn't enough to score against.");
    setFormError("");
    onSubmit(file, jobDescription);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <span className="section-label">Exhibit A — Inputs</span>

      <label className="field">
        <span className="label">Resume (PDF)</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0] ?? null)}
        />
      </label>

      <label className="field">
        <span className="label">Job Description</span>
        <textarea
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the role's requirements here…"
        />
      </label>

      {formError && <p className="error">{formError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Reviewing…" : "Generate Report"}
      </button>
    </form>
  );
}