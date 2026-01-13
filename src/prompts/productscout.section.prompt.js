export function buildProductScoutSectionPrompt({
  lang = "fr",
  sectionTitle,
  websiteUrl,
  contextText = "",
  extractedFacts = "",
}) {
  const isFr = lang === "fr";

  const base = isFr
    ? `
Tu remplis UNIQUEMENT la section suivante du rapport :
"${sectionTitle}"

Règles strictes (NON-NEGOCIABLES) :
- Tu ne dois PAS réécrire les titres.
- Tu ne dois PAS modifier l'ordre des sous-sections.
- Si la section contient un tableau, tu dois remplir UNIQUEMENT des lignes du tableau (et ne jamais remplacer par des bullets).
- Si une info manque : écris "Non observable".
- Ton style est product-first (UX, flows, pricing, trade-offs). Pas de storytelling marketing.
- Pas de titres en gras.
- Markdown uniquement.

Contexte:
- Site: ${websiteUrl}
${contextText ? `- Contexte produit: ${contextText}` : ""}

Faits extraits (si disponibles):
${extractedFacts ? extractedFacts : "Non observable"}

Maintenant, génère UNIQUEMENT le contenu de cette section, sans rien ajouter avant ou après.
`
    : `
You are filling ONLY the following report section:
"${sectionTitle}"

Strict rules (NON-NEGOTIABLE):
- Do NOT rewrite titles.
- Do NOT change subsection order.
- If the section contains a table: ONLY output table rows (never bullets instead).
- If info is missing: write "Non observable".
- Product-first lens (UX, flows, pricing, trade-offs). No marketing storytelling.
- No bold titles.
- Markdown only.

Context:
- Website: ${websiteUrl}
${contextText ? `- Product context: ${contextText}` : ""}

Extracted facts (if available):
${extractedFacts ? extractedFacts : "Non observable"}

Now output ONLY the content for this section, nothing before or after.
`;

  return base.trim();
}
