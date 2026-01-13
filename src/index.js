import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeHandler from "./analyze.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */

app.use(cors());
app.use(express.json({ limit: "2mb" }));

/* =========================
   HEALTH CHECK
   (Render / monitoring / debug)
========================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ProductScout API",
    timestamp: new Date().toISOString()
  });
});

/* =========================
   CORE API
========================= */

/**
 * POST /api/analyze
 * Body:
 * {
 *   url: string
 * }
 */
app.post("/api/analyze", analyzeHandler);

/* =========================
   FALLBACK (404)
========================= */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    availableRoutes: {
      health: "GET /health",
      analyze: "POST /api/analyze"
    }
  });
});

/* =========================
   SERVER
========================= */

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`🚀 ProductScout API running on :${port}`);
});
