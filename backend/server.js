import express from "express";
import cors from "cors";
import "dotenv/config";
import { initDb } from "./db.js";
import screenRouter from "./routes/screen.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", screenRouter);

// Central error handler — catches multer errors (e.g. non-PDF upload,
// file too large) and anything else that slips past route-level try/catch.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Something went wrong." });
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
