import OpenAI from "openai";
import { PRODUCTSCOUT_CORE_PROMPT } from "./prompts/productscout_core.prompt.js";
import { PRODUCTSCOUT_VISUAL_PROMPT } from "./prompts/productscout_visual.prompt.js";
import { PRODUCTSCOUT_SUMMARY_PROMPT } from "./prompts/productscout_summary.prompt.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Hard truncate to avoid token explosion
 */
function truncate(text, maxChars = 45000) {
  if (!text) return "";
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

/**
 * Main ProductScout brain
 */
export async function runProductScout(markdownContent, inputUrl, language = "fr") {
  const websiteContent = truncate(markdownContent);

  const systemPrompt = `
${PRODUCTSCOUT_CORE_PROMPT}

${PRODUCTSCOUT_VISUAL_PROMPT}

${PRODUCTSCOUT_SUMMARY_PROMPT}
`;

  const userPrompt = `
TARGET URL:
${inputUrl}

INTERFACE LANGUAGE:
${language}

WEBSITE CONTENT (public pages, markdown):
${websiteContent}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ]
  });

  return response?.choices?.[0]?.message?.content?.trim() || "";
}
