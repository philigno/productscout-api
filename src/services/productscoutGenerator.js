import {
  PRODUCTSCOUT_SKELETON_PROMPT_FR,
  PRODUCTSCOUT_SKELETON_PROMPT_EN,
} from "../prompts/productscout.skeleton.prompt.js";

import { buildProductScoutSectionPrompt } from "../prompts/productscout.section.prompt.js";
import { buildProductScoutIllustrationsPrompt } from "../prompts/productscout.illustrations.prompt.js";

import { callLLM } from "../openai.js";

/**
 * --------------------------------------------------
 * Helpers
 * --------------------------------------------------
 */

function normalizeLang(lang) {
  return lang && lang.toLowerCase().startsWith("fr") ? "fr" : "en";
}

/**
 * --------------------------------------------------
 * STEP 1 — Generate skeleton only
 * --------------------------------------------------
 * This function MUST work perfectly before anything else.
 */
export async function generateProductScoutSkeleton({ lang = "fr" }) {
  const normalizedLang = normalizeLang(lang);

  const systemPrompt =
    normalizedLang === "fr"
      ? PRODUCTSCOUT_SKELETON_PROMPT_FR
      : PRODUCTSCOUT_SKELETON_PROMPT_EN;

  const skeleton = await callLLM({
    system: systemPrompt,
    user: "Generate the skeleton now.",
    temperature: 0,
  });

  return skeleton;
}

/**
 * --------------------------------------------------
 * STEP 2 — Fill ONE section
 * --------------------------------------------------
 */
export async function fillProductScoutSection({
  lang = "fr",
  sectionTitle,
  websiteUrl,
  contextText = "",
  extractedFacts = "",
}) {
  if (!sectionTitle) {
    throw new Error("fillProductScoutSection requires a sectionTitle");
  }

  const normalizedLang = normalizeLang(lang);

  const sectionPrompt = buildProductScoutSectionPrompt({
    lang: normalizedLang,
    sectionTitle,
    websiteUrl,
    contextText,
    extractedFacts,
  });

  const content = await callLLM({
    system: "You are a strict formatter. Follow the user's instructions exactly.",
    user: sectionPrompt,
    temperature: 0.2,
  });

  return content;
}

/**
 * --------------------------------------------------
 * STEP 3 — Generate illustrations section
 * --------------------------------------------------
 */
export async function generateProductScoutIllustrations({
  lang = "fr",
  websiteUrl,
}) {
  const normalizedLang = normalizeLang(lang);

  const illustrationsPrompt = buildProductScoutIllustrationsPrompt({
    lang: normalizedLang,
    websiteUrl,
  });

  const illustrations = await callLLM({
    system: "You are a strict formatter. Follow the user's instructions exactly.",
    user: illustrationsPrompt,
    temperature: 0.2,
  });

  return illustrations;
}

/**
 * --------------------------------------------------
 * STEP 4 — Full ProductScout report (V1)
 * --------------------------------------------------
 * Uses:
 * - Skeleton
 * - Section-by-section filling
 * - Illustrations
 * - Simple assembly (no AI)
 */
export async function generateProductScoutReport({
  websiteUrl,
  lang = "fr",
  contextText = "",
  extractedFacts = "",
}) {
  const normalizedLang = normalizeLang(lang);

  // 1) Skeleton
  const skeleton = await generateProductScoutSkeleton({
    lang: normalizedLang,
  });

  // 2) Sections to fill (ORDER MATTERS)
  const sections =
    normalizedLang === "fr"
      ? [
          "## 0. TL;DR (lecture 2 minutes)",
          "## 2. Proposition de valeur (reformulée PM)",
          "## 3. Parcours & UX (lecture produit)",
          "## 4. Fonctionnalités clés",
          "## 5. Pricing & modèle économique",
          "## 6. Benchmark concurrentiel",
          "## 7. Opportunités produit priorisées",
          "## 8. Limites & hypothèses de l’analyse",
          "## 10. Les 3 enseignements produit clés à retenir",
        ]
      : [
          "## 0. TL;DR (2-minute read)",
          "## 2. Value proposition (PM rewrite)",
          "## 3. UX & flows (product lens)",
          "## 4. Key features",
          "## 5. Pricing & business model",
          "## 6. Quick benchmark",
          "## 7. Prioritized product opportunities",
          "## 8. Limits & assumptions",
          "## 10. 3 key product learnings",
        ];

  const filledSections = [];

  for (const sectionTitle of sections) {
    const sectionContent = await fillProductScoutSection({
      lang: normalizedLang,
      sectionTitle,
      websiteUrl,
      contextText,
      extractedFacts,
    });

    if (sectionContent && sectionContent.trim()) {
      filledSections.push(sectionContent.trim());
    }
  }

  // 3) Illustrations
  const illustrations = await generateProductScoutIllustrations({
    lang: normalizedLang,
    websiteUrl,
  });

  // 4) Assembly (pure string concatenation)
  const finalReport = [
    skeleton.trim(),
    "",
    ...filledSections,
    "",
    illustrations.trim(),
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    lang: normalizedLang,
    report: finalReport,
  };
}

/**
 * --------------------------------------------------
 * TEST ONLY — Skeleton quick test
 * --------------------------------------------------
 */
export async function testProductScoutSkeleton({ lang = "fr" }) {
  return generateProductScoutSkeleton({ lang });
}
