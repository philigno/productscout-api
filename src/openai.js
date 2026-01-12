import OpenAI from "openai";
import { PRODUCTSCOUT_CORE_PROMPT } from "./productscout_prompt.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function truncate(text, maxChars = 45000) {
  if (!text) return "";
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

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
      { role: "user", content: userMessage }
    ]
  });

  return res.choices?.[0]?.message?.content?.trim() || "";
}
