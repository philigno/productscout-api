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
========================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ProductScout API",
    timestamp: new Date().toISOString()
  });
});

/* =========================
   CORE ROUTE
========================= */

app.post("/api/analyze", analyzeHandler);

/* =========================
   404 FALLBACK
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

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 ProductScout API running on :${PORT}`);
});
