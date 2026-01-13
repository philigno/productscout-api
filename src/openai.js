import OpenAI from "openai";
import { PRODUCTSCOUT_CORE_PROMPT } from "./productscout_prompt.js";

/**
 * OpenAI client (shared)
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Utility: truncate long text to avoid token overflow
 */
function truncate(text, maxChars = 45000) {
  if (!text) return "";
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

/**
 * --------------------------------------------------
 * LEGACY — ProductScout V0 (one-shot prompt)
 * --------------------------------------------------
 * ⚠️ Kept for backward compatibility
 * ⚠️ NOT used by the new multi-step ProductScout pipeline
 */
export async function runProductScout(markdownContent, inputUrl) {
  const websiteContent = truncate(markdownContent);

  const userMessage = `
TARGET URL:
${inputUrl}

WEBSITE CONTENT (markdown, public pages):
${websiteContent}
`;

  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: PRODUCTSCOUT_CORE_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  return res.choices?.[0]?.message?.content?.trim() || "";
}

/**
 * --------------------------------------------------
 * GENERIC LLM CALL — ProductScout V1+
 * --------------------------------------------------
 * This is the ONLY function that should be used
 * by the new ProductScout generator pipeline.
 */
export async function callLLM({ system, user, temperature = 0.2 }) {
  if (!system || !user) {
    throw new Error("callLLM requires both system and user messages");
  }

  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices?.[0]?.message?.content?.trim() || "";
}
