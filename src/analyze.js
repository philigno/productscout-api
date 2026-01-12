import { supabase } from "./supabase.js";
import { scrapeWebsite } from "./scraper.js";
import { runProductScout } from "./openai.js";

function requireSecret(req) {
  const secret = process.env.API_SECRET;
  if (!secret) return true;
  const header = req.headers["x-api-secret"];
  return header === secret;
}

export default async function analyzeHandler(req, res) {
  try {
    if (!requireSecret(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { user_id, input_url } = req.body || {};
    if (!user_id || !input_url) {
      return res.status(400).json({ error: "Missing user_id or input_url" });
    }

    const { data: creditsRow, error: creditsErr } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user_id)
      .single();

    if (creditsErr || !creditsRow) {
      return res.status(400).json({ error: "Credits not found for user" });
    }
    if ((creditsRow.balance ?? 0) <= 0) {
      return res.status(400).json({ error: "No credits" });
    }

    const md = await scrapeWebsite(input_url);
    if (!md || md.length < 200) {
      return res
        .status(400)
        .json({ error: "Could not extract enough content from website" });
    }

    const report = await runProductScout(md, input_url);

    const { error: insertErr } = await supabase.from("reports").insert({
      user_id,
      input_url,
      report_content: report,
      created_at: new Date().toISOString()
    });

    if (insertErr) {
      return res.status(500).json({ error: "Failed to save report" });
    }

    const { error: updateErr } = await supabase
      .from("credits")
      .update({ balance: creditsRow.balance - 1 })
      .eq("user_id", user_id);

    if (updateErr) {
      console.error("Failed to decrement credits:", updateErr);
    }

    return res.json({ report });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal error" });
  }
}
