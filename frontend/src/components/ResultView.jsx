function verdictColor(score) {
  if (score >= 80) return "var(--teal)";
  if (score >= 50) return "var(--gold)";
  return "var(--rust)";
}

export default function ResultView({ result }) {
  if (!result) return null;

  const color = verdictColor(result.match_score);
  const plan = result.improvement_plan || [];

  return (
    <>
      <div className="card">
        <span className="section-label">Exhibit B — Verdict</span>

        <div className="verdict-row">
          <div className="seal" style={{ color }}>
            <span className="seal-score">{result.match_score}</span>
          </div>
          <div className="verdict-meta">
            <h3>{result.candidate_name || "Candidate"}</h3>
            <span className="role">{result.job_title || "ROLE NOT SPECIFIED"}</span>
          </div>
        </div>

        <p className="summary-text">{result.summary}</p>

        <div className="columns">
          <div>
            <h4 className="strengths">Strengths</h4>
            <ul>
              {plan.length === 0 && result.strengths?.length === 0 && <li>None identified.</li>}
              {(result.strengths || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="gaps">Gaps</h4>
            <ul>
              {(result.gaps || []).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {plan.length > 0 && (
        <div className="card">
          <span className="section-label">Exhibit C — Growth Plan</span>
          <ul className="plan-list">
            {plan.map((item, i) => (
              <li className="plan-item" key={i}>
                <span className={`plan-priority ${item.priority || "medium"}`}>
                  {item.priority || "medium"}
                </span>
                <div className="plan-body">
                  <p className="action">{item.action}</p>
                  <p className="why">{item.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}