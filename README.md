# AI Resume Screener

A full-stack app where a recruiter uploads a resume (PDF) and pastes a job description, and receives an AI-generated match score with reasoning, strengths, and skill gaps.

Built for the Megaminds IT Services Full-Stack AI Developer take-home task.

## Architecture

```
Frontend (React + Vite)
   |  multipart/form-data (resume PDF + job description)
   v
Backend (Node.js + Express)
   |-- pdf-parse: extracts text from the uploaded PDF
   |-- Groq API (llama-3.3-70b-versatile): scores resume vs JD, returns structured JSON
   |-- PostgreSQL: stores every screening result
   v
Response: { match_score, strengths[], gaps[], summary, ... }
```

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **AI:** Groq API (Llama 3.3 70B) — swap in OpenAI/Gemini by changing `backend/routes/screen.js`
- **Database:** PostgreSQL

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally or a hosted connection string
- A Groq API key (free at console.groq.com)

### Backend
```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL and GROQ_API_KEY
npm install
npm run dev             # starts on http://localhost:5000
```
The `screenings` table is created automatically on first run.

### Frontend
```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:5173
```
If your backend runs somewhere other than localhost:5000, set `VITE_API_URL` in a `frontend/.env` file.

## Key Decisions
- **Groq over OpenAI/Gemini:** free tier, fast inference, good enough reasoning quality for structured scoring tasks.
- **`response_format: json_object`** forces the model to return valid JSON directly, avoiding fragile regex/markdown-stripping for the primary path (a fallback stripper is still included for safety).
- **Multer memory storage:** the PDF is parsed and discarded, never written to disk — keeps the backend stateless and avoids cleanup logic.
- **Single `screenings` table:** simplest schema that still supports a history view; normalizing candidates/jobs into separate tables wasn't necessary at this scope.

## Challenges
- (Fill in what you actually ran into — e.g. PDF parsing edge cases, prompt tuning to get consistent JSON, deployment env var setup.)

## What I'd Improve With More Time
- Auth so recruiters only see their own screening history
- Support for DOCX resumes, not just PDF
- Streaming the AI response instead of waiting for the full completion
- Batch screening (multiple resumes against one JD)

## Time Spent
(Fill in your actual hours.)
