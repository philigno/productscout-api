import { supabase } from "./supabase.js";
import { scrapeWebsite } from "./scraper.js";
import {
  generateProductScoutReport,
} from "./services/productscoutGenerator.js";

/**
 * Optional API protection via secret header
 */
function isAuthorized(req) {
  const secret = process.env.API_SECRET;
  if (!secret) return true; // no protection enabled
  return req.headers["x-api-secret"] === secret;
}

/**
 * POST /api/analyze
 * Body:
 * {
 *   user_id: string,
 *   input_url: string,
 *   language?: "fr" | "en"
 * }
 */
export default async function analyzeHandler(req, res) {
  try {
    // --------------------------------------------------
    // Auth
    // --------------------------------------------------
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // --------------------------------------------------
    // Input validation
    // --------------------------------------------------
    const { user_id, input_url, language = "fr" } = req.body || {};

    if (!user_id || !input_url) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["user_id", "input_url"],
      });
    }

    // --------------------------------------------------
    // Credits check
    // --------------------------------------------------
    const { data: creditsRow, error: creditsError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user_id)
      .single();

    if (creditsError || !creditsRow) {
      return res.status(400).json({
        error: "Credits not found for user",
      });
    }

    if ((creditsRow.balance ?? 0) <= 0) {
      return res.status(400).json({
        error: "No credits remaining",
      });
    }

    // --------------------------------------------------
    // Scraping
    // --------------------------------------------------
    const scrapedMarkdown = await scrapeWebsite(input_url);

    if (!scrapedMarkdown || scrapedMarkdown.length < 200) {
      return res.status(400).json({
        error: "Could not extract enough content from website",
      });
    }

    // --------------------------------------------------
    // ProductScout brain (NEW single source of truth)
    // --------------------------------------------------
    const { report } = await generateProductScoutReport({
      websiteUrl: input_url,
      lang: language,
      contextText: scrapedMarkdown,
    });

    if (!report || report.length < 100) {
      return res.status(500).json({
        error: "Report generation failed",
      });
    }

    // --------------------------------------------------
    // Persist report
    // --------------------------------------------------
    const { error: insertError } = await supabase.from("reports").insert({
      user_id,
      input_url,
      report_content: report,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Failed to save report:", insertError);
      return res.status(500).json({
        error: "Failed to save report",
      });
    }

    // --------------------------------------------------
    // Decrement credits (non-blocking)
    // --------------------------------------------------
    const { error: updateError } = await supabase
      .from("credits")
      .update({ balance: creditsRow.balance - 1 })
      .eq("user_id", user_id);

    if (updateError) {
      console.error("Failed to decrement credits:", updateError);
    }

    // --------------------------------------------------
    // Success
    // --------------------------------------------------
    return res.json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
