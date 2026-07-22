import { Router } from "express";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Groq from "groq-sdk";
import { pool } from "../db.js";
import { buildScreeningPrompt } from "../utils/prompt.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are accepted"));
    }
    cb(null, true);
  },
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Strips accidental markdown code fences some models add despite
// instructions, before JSON.parse.
function extractJson(raw) {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
  return JSON.parse(cleaned);
}

router.post("/screen", upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Resume PDF is required." });
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: "Job description is too short." });
    }

    const parsed = await pdfParse(req.file.buffer);
    const resumeText = parsed.text.trim();
    if (!resumeText) {
      return res.status(422).json({ error: "Could not extract text from this PDF." });
    }

    const prompt = buildScreeningPrompt(resumeText, jobDescription);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = extractJson(completion.choices[0].message.content);

    const { rows } = await pool.query(
      `INSERT INTO screenings
        (candidate_name, job_title, resume_text, job_description, match_score, strengths, gaps, summary, improvement_plan)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, candidate_name, job_title, match_score, strengths, gaps, summary, improvement_plan, created_at`,
      [
        result.candidate_name ?? null,
        result.job_title ?? null,
        resumeText,
        jobDescription,
        result.match_score,
        JSON.stringify(result.strengths ?? []),
        JSON.stringify(result.gaps ?? []),
        result.summary ?? "",
        JSON.stringify(result.improvement_plan ?? []),
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Screening error:", err);
    res.status(500).json({ error: "Failed to process the resume. Please try again." });
  }
});

// History list — used by the frontend results page to show past screenings.
router.get("/screenings", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, candidate_name, job_title, match_score, strengths, gaps, summary, improvement_plan, created_at
       FROM screenings ORDER BY created_at DESC LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch screening history." });
  }
});

export default router;