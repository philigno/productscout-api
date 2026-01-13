import { scrapeWebsite } from "./scraper.js";
import { runProductScout } from "./openai.js";

export default async function analyzeHandler(req, res) {
  try {
    const { input_url, language = "fr" } = req.body || {};

    if (!input_url) {
      return res.status(400).json({
        error: "Missing input_url",
      });
    }

    const markdown = await scrapeWebsite(input_url);

    if (!markdown || markdown.length < 200) {
      return res.status(400).json({
        error: "Could not extract enough content from website",
      });
    }

    const report = await runProductScout({
      websiteContent: markdown,
      inputUrl: input_url,
      language,
    });

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
