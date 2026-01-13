import OpenAI from "openai";

import { PRODUCTSCOUT_CORE_PROMPT } from "./prompts/productscout_core.prompt.js";
import { PRODUCTSCOUT_SKELETON_PROMPT } from "./prompts/productscout_skeleton.prompt.js";
import { PRODUCTSCOUT_SUMMARY_PROMPT } from "./prompts/productscout_summary.prompt.js";
import { PRODUCTSCOUT_VISUAL_PROMPT } from "./prompts/productscout_visual.prompt.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Run ProductScout analysis
 */
export async function runProductScout({
  websiteContent,
  inputUrl,
  language = "fr",
}) {
  const systemPrompt = `
${PRODUCTSCOUT_CORE_PROMPT}

${PRODUCTSCOUT_SKELETON_PROMPT}

${PRODUCTSCOUT_SUMMARY_PROMPT}

${PRODUCTSCOUT_VISUAL_PROMPT}
`;

  const userPrompt = `
URL analysée :
${inputUrl}

Langue attendue : ${language}

Contenu du site (markdown) :
${websiteContent}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userPrompt.trim() },
    ],
  });

  return response.choices[0].message.content;
}
