import { supabase } from "./supabase.js";
import { scrapeWebsite } from "./scraper.js";
import { runProductScout } from "./openai.js";

/**
 * Optional API secret protection (for internal usage / Lovable)
 */
function isAuthorized(req) {
  const secret = process.env.API_SECRET;
  if (!secret) return true; // no secret required
  return req.headers["x-api-secret"] === secret;
}

export default async function analyzeHandler(req, res) {
  try {
    // -------------------------
    // 0. Security check
    // -------------------------
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // -------------------------
    // 1. Input validation
    // -------------------------
    const { user_id, input_url, language = "fr" } = req.body || {};

    if (!user_id || !input_url) {
      return res.status(400).json({
        error: "Missing user_id or input_url"
      });
    }

    const IS_DEV = process.env.NODE_ENV !== "production";

    // -------------------------
    // 2. Credits check (PROD ONLY)
    // -------------------------
    let creditsBalance = null;

    if (!IS_DEV) {
      const { data: creditsRow, error: creditsErr } = await supabase
        .from("credits")
        .select("balance")
        .eq("user_id", user_id)
        .single();

      if (creditsErr || !creditsRow) {
        return res.status(400).json({ error: "Credits not found for user" });
      }

      if ((creditsRow.balance ?? 0) <= 0) {
        return res.status(400).json({ error: "No credits left" });
      }

      creditsBalance = creditsRow.balance;
    }

    // -------------------------
    // 3. Scrape website
    // -------------------------
    const markdownContent = await scrapeWebsite(input_url);

    if (!markdownContent || markdownContent.length < 200) {
      return res.status(400).json({
        error: "Could not extract enough content from website"
      });
    }

    // -------------------------
    // 4. Run ProductScout brain 🧠
    // -------------------------
    const report = await runProductScout(
      markdownContent,
      input_url,
      language
    );

    if (!report) {
      return res.status(500).json({
        error: "Failed to generate product report"
      });
    }

    // -------------------------
    // 5. Save report
    // -------------------------
    const { error: insertErr } = await supabase.from("reports").insert({
      user_id,
      input_url,
      report_content: report,
      language,
      created_at: new Date().toISOString()
    });

    if (insertErr) {
      console.error("Failed to save report:", insertErr);
      return res.status(500).json({ error: "Failed to save report" });
    }

    // -------------------------
    // 6. Decrement credits (PROD ONLY)
    // -------------------------
    if (!IS_DEV && creditsBalance !== null) {
      const { error: updateErr } = await supabase
        .from("credits")
        .update({ balance: creditsBalance - 1 })
        .eq("user_id", user_id);

      if (updateErr) {
        console.error("Failed to decrement credits:", updateErr);
        // non-blocking on purpose
      }
    }

    // -------------------------
    // 7. Success
    // -------------------------
    return res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}
