export function buildProductScoutIllustrationsPrompt({ lang = "fr", websiteUrl }) {
  const isFr = lang === "fr";

  return (isFr
    ? `
Génère UNIQUEMENT la section "## 9. Illustrations & preuves visuelles".

Règles :
- Cette section est OBLIGATOIRE.
- Tu dois proposer des visuels qui aident à prouver un point PRODUIT (UX, funnel, pricing, features).
- Tu peux proposer :
  1) Captures d’écran à prendre sur le site
  2) Vidéos publiques utiles (YouTube, App Store previews, démos)
  3) Images publiques (screenshots déjà publiés) si elles montrent de l’UI
- Tu DOIS donner des URLs quand tu proposes des vidéos/images publiques.
- Tu ne dois PAS inventer des visuels.
- Tu ne dois PAS te focaliser sur des bannières marketing ou le branding.

Format obligatoire (répéter pour chaque illustration) :

### Illustration X — [Objectif]
- Page / URL:
- Quoi capturer:
- Pourquoi c’est important (produit):

Items requis :
- Landing page
- Pricing page (ou page d’acquisition si pas de pricing)
- Page produit / catalogue (ou dashboard si SaaS)
- Tunnel de conversion (signup / checkout)
- 1 élément benchmark visuel (si pertinent)

Site: ${websiteUrl}

Ne génère que cette section, rien d’autre.
`
    : `
Generate ONLY the section "## 9. Visual evidence (screenshots / videos)".

Rules:
- This section is REQUIRED.
- Visuals must support PRODUCT points (UX, funnel, pricing, features).
- You may suggest:
  1) Screenshots to take from the website
  2) Public videos (YouTube, App Store previews, demos)
  3) Public UI images if they show real UI
- Provide URLs for public videos/images whenever suggested.
- Do NOT invent visuals.
- Do NOT focus on marketing banners or branding.

Required format (repeat for each item):

### Illustration X — [Purpose]
- Page / URL:
- What to capture:
- Why it matters (product):

Required items:
- Landing page
- Pricing page (or acquisition page if no pricing)
- Product / catalogue page (or SaaS dashboard)
- Conversion funnel (signup / checkout)
- 1 benchmark visual item (if relevant)

Website: ${websiteUrl}

Output ONLY this section, nothing else.
`
  ).trim();
}
