const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function screenResume(file, jobDescription) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  const res = await fetch(`${API_BASE}/api/screen`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Screening failed.");
  }
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/api/screenings`);
  if (!res.ok) throw new Error("Failed to load history.");
  return res.json();
}
