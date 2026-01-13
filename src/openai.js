import OpenAI from "openai";

import { PRODUCTSCOUT_CORE_PROMPT } from "./prompts/productscout_core.prompt.js";
import { getProductScoutSkeletonPrompt } from "./prompts/productscout_skeleton.prompt.js";
import { PRODUCTSCOUT_SUMMARY_PROMPT } from "./prompts/productscout_summary.prompt.js";
import { PRODUCTSCOUT_VISUAL_PROMPT } from "./prompts/productscout_visual.prompt.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Run ProductScout analysis
 * Combines:
 * - Core rules
 * - Skeleton (language-aware)
 * - Summary constraints
 * - Visual / illustration instructions
 */
export async function runProductScout({
  websiteContent,
  inputUrl,
  language = "fr",
}) {
  if (!websiteContent || !inputUrl) {
    throw new Error("Missing websiteContent or inputUrl");
  }

  const skeletonPrompt = getProductScoutSkeletonPrompt(language);

  const systemPrompt = `
${PRODUCTSCOUT_CORE_PROMPT}

${skeletonPrompt}

${PRODUCTSCOUT_SUMMARY_PROMPT}

${PRODUCTSCOUT_VISUAL_PROMPT}
`.trim();

  const userPrompt = `
URL analysée :
${inputUrl}

Langue attendue : ${language}

Contenu du site (markdown) :
${websiteContent}
`.trim();

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices?.[0]?.message?.content ?? "";
}
