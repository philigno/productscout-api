import { scrapeWebsite } from "./scraper.js";
import { runProductScout } from "./openai.js";

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
        error: "Missing input_url",
      });
    }

    // 1️⃣ Scrape website
    const websiteContent = await scrapeWebsite(input_url);

    if (!websiteContent || websiteContent.length < 200) {
      return res.status(400).json({
        error: "Unable to extract enough content from website",
      });
    }

    // 2️⃣ Run ProductScout brain
    const report = await runProductScout({
      websiteContent,
      inputUrl: input_url,
      language,
    });

    if (!report || report.length < 50) {
      return res.status(500).json({
        error: "Failed to generate ProductScout report",
      });
    }

    // 3️⃣ Return report
    return res.json({
      report,
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
