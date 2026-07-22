// Builds the prompt sent to the LLM. Kept separate from the route
// handler so the prompt can be iterated on / unit-tested without
// touching request-handling logic.
export function buildScreeningPrompt(resumeText, jobDescription) {
  return `You are an experienced technical recruiter. Compare the RESUME against the JOB DESCRIPTION and evaluate the fit objectively.

Return ONLY valid JSON (no markdown fences, no commentary) with this exact shape:
{
  "candidate_name": string | null,
  "job_title": string | null,
  "match_score": integer between 0 and 100,
  "strengths": [string, string, ...],   // 3-6 concrete matches between resume and JD
  "gaps": [string, string, ...],        // 3-6 concrete missing/weak skills relative to the JD
  "summary": string,                    // 2-4 sentence overall reasoning for the score
  "improvement_plan": [
    { "action": string, "why": string, "priority": "high" | "medium" | "low" },
    ...
  ]                                     // 3-5 concrete, specific steps the candidate could take
                                         // to become a stronger fit for THIS job. Each "action"
                                         // must be something the candidate can actually do
                                         // (a project to build, a skill to learn, a way to
                                         // rephrase/quantify existing experience, a certification).
                                         // Never generic ("improve your resume") — tie every item
                                         // to a specific gap against this job description.
                                         // Order by priority: high-impact items first.
}

Scoring guidance:
- 80-100: strong match on core required skills and experience level
- 50-79: partial match, some meaningful gaps
- 0-49: weak match, missing multiple core requirements
Be specific — cite actual skills/technologies/experience from the resume and JD rather than generic statements. The improvement_plan should be genuinely useful even for a strong match (e.g. "quantify the impact" style refinements), and genuinely actionable for a weak match (e.g. specific projects or skills to build).

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""`;
}