import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Called once on server start. Keeps setup to a single command —
// no separate migration tool needed for a task of this scope.
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS screenings (
      id SERIAL PRIMARY KEY,
      candidate_name TEXT,
      job_title TEXT,
      resume_text TEXT NOT NULL,
      job_description TEXT NOT NULL,
      match_score INTEGER NOT NULL,
      strengths JSONB NOT NULL,
      gaps JSONB NOT NULL,
      summary TEXT NOT NULL,
      improvement_plan JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  // Safe to run every startup: adds the column only if an earlier
  // version of this table already exists without it.
  await pool.query(`
    ALTER TABLE screenings
    ADD COLUMN IF NOT EXISTS improvement_plan JSONB NOT NULL DEFAULT '[]';
  `);
  console.log("Database ready: screenings table ensured.");
}