import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeHandler from "./analyze.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/analyze", analyzeHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`ProductScout API running on :${port}`));
