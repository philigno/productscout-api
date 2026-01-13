import { generateProductScoutReport } from "./services/productscoutGenerator.js";
/**
 * POST /api/analyze
 * Body:
 * {
 *   input_url: string,
 *   language?: "fr" | "en"
 * }
 */
export default async function analyzeHandler(req, res) {
  try {
    const { input_url, language = "fr" } = req.body || {};

    if (!input_url) {
      return res.status(400).json({
        error: "Missing input_url"
      });
    }

    const result = await generateReport({
      input_url,
      language
    });

    return res.json({
      success: true,
      report: result.report
    });
  } catch (error) {
    console.error("Analyze error:", error.message);

    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}
