import {
  PRODUCTSCOUT_SKELETON_PROMPT_FR,
  PRODUCTSCOUT_SKELETON_PROMPT_EN,
} from "../prompts/productscout.skeleton.prompt.js";

import { buildProductScoutSectionPrompt } from "../prompts/productscout.section.prompt.js";
import { buildProductScoutIllustrationsPrompt } from "../prompts/productscout.illustrations.prompt.js";

// Helper minimal: replace this with YOUR existing LLM call
async function callLLM({ system, user, temperature = 0.2 }) {
  // TODO: wire to your current OpenAI call
  // Must return a string
  throw new Error("callLLM not implemented yet. Wire it to your LLM client.");
}

function getLangFromUserInterfaceHint(userLang) {
  return userLang && userLang.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export async function generateProductScoutReport({
  websiteUrl,
  userLangHint = "fr",
  contextText = "",
  extractedFacts = "",
}) {
  const lang = getLangFromUserInterfaceHint(userLangHint);

  // 1) Skeleton
  const skeletonSystem = lang === "fr" ? PRODUCTSCOUT_SKELETON_PROMPT_FR : PRODUCTSCOUT_SKELETON_PROMPT_EN;
  const skeleton = await callLLM({
    system: skeletonSystem,
    user: "Generate the skeleton now.",
    temperature: 0,
  });

  // 2) Fill sections one by one
  const sections = lang === "fr"
    ? [
        { key: "tldr", title: "## 0. TL;DR (lecture 2 minutes)" },
        { key: "value", title: "## 2. Proposition de valeur (reformulée PM)" },
        { key: "ux", title: "## 3. Parcours & UX (lecture produit)" },
        { key: "features", title: "## 4. Fonctionnalités clés" },
        { key: "pricing", title: "## 5. Pricing & modèle économique" },
        { key: "bench", title: "## 6. Benchmark concurrentiel" },
        { key: "opps", title: "## 7. Opportunités produit priorisées" },
        { key: "limits", title: "## 8. Limites & hypothèses de l’analyse" },
        { key: "learnings", title: "## 10. Les 3 enseignements produit clés à retenir" },
      ]
    : [
        { key: "tldr", title: "## 0. TL;DR (2-minute read)" },
        { key: "value", title: "## 2. Value proposition (PM rewrite)" },
        { key: "ux", title: "## 3. UX & flows (product lens)" },
        { key: "features", title: "## 4. Key features" },
        { key: "pricing", title: "## 5. Pricing & business model" },
        { key: "bench", title: "## 6. Quick benchmark" },
        { key: "opps", title: "## 7. Prioritized product opportunities" },
        { key: "limits", title: "## 8. Limits & assumptions" },
        { key: "learnings", title: "## 10. 3 key product learnings" },
      ];

  const filled = {};
  for (const s of sections) {
    const sectionPrompt = buildProductScoutSectionPrompt({
      lang,
      sectionTitle: s.title,
      websiteUrl,
      contextText,
      extractedFacts,
    });

    filled[s.key] = await callLLM({
      system: "You are a strict formatter. Follow the user's instructions exactly.",
      user: sectionPrompt,
      temperature: 0.2,
    });
  }

  // 3) Illustrations
  const illustrationsPrompt = buildProductScoutIllustrationsPrompt({ lang, websiteUrl });
  const illustrations = await callLLM({
    system: "You are a strict formatter. Follow the user's instructions exactly.",
    user: illustrationsPrompt,
    temperature: 0.2,
  });

  // 4) Assemble (simple concatenation)
  // We assume skeleton already contains all headings; we append filled blocks in a consistent order.
  // In V2 we can inject inside skeleton precisely; V1 = append blocks under their headings.
  const finalReport = [
    skeleton.trim(),
    "",
    filled.tldr?.trim() || "",
    "",
    filled.value?.trim() || "",
    "",
    filled.ux?.trim() || "",
    "",
    filled.features?.trim() || "",
    "",
    filled.pricing?.trim() || "",
    "",
    filled.bench?.trim() || "",
    "",
    filled.opps?.trim() || "",
    "",
    filled.limits?.trim() || "",
    "",
    illustrations.trim(),
    "",
    filled.learnings?.trim() || "",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return { lang, report: finalReport };
}
