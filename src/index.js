import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeHandler from "./analyze.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Healthcheck (Render)
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ProductScout endpoint
app.post("/api/analyze", analyzeHandler);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ ProductScout API running on port ${port}`);
});
