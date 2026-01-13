import { scrapeWebsite } from "./scraper.js";
import { runProductScout } from "./openai.js";

/**
 * Generate ProductScout report from a URL.
 * - Scrape public pages into markdown
 * - Run ProductScout brain (OpenAI)
 * - Return structured markdown report
 */
export async function generateReport({ input_url, language = "fr" }) {
  if (!input_url) {
    throw new Error("Missing input_url");
  }

  const md = await scrapeWebsite(input_url);

  if (!md || md.length < 200) {
    throw new Error("Could not extract enough content from website");
  }

  const report = await runProductScout(md, input_url, language);

  if (!report || report.length < 50) {
    throw new Error("Failed to generate report");
  }

  return { report };
}
