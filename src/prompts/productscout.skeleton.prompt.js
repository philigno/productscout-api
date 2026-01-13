export const PRODUCTSCOUT_SKELETON_PROMPT_FR = `
You are generating a STRICT Markdown skeleton for a product analysis report in French.

Rules (NON-NEGOTIABLE):
- OUTPUT MARKDOWN ONLY
- DO NOT add any content
- DO NOT add explanations
- DO NOT add bullet points
- DO NOT add bold text
- DO NOT modify section titles
- DO NOT add or remove sections
- Use ONLY Markdown headings (##, ###)
- Insert a horizontal divider (---) AFTER EACH major section

Your job is ONLY to output the structure exactly as specified below.

# 🧠 ProductScout — Rapport produit concurrentiel

## 0. TL;DR (lecture 2 minutes)

---

## 1. Fiche d’identité produit

| Champ | Valeur |
|------|--------|
| Nom du produit | |
| URL | |
| Type de produit | |
| Cible principale | |
| Modèle économique | |
| Niveau de maturité estimé | |

---

## 2. Proposition de valeur (reformulée PM)

---

## 3. Parcours & UX (lecture produit)

### 3.1 Découverte / Landing

### 3.2 Activation

### 3.3 Monétisation

### 3.4 Rétention

---

## 4. Fonctionnalités clés

| Domaine | Fonctionnalité | Pour qui | Valeur utilisateur | Observabilité |
|--------|----------------|----------|--------------------|---------------|

---

## 5. Pricing & modèle économique

| Offre | Prix | Engagement | Mécanique | Lisibilité |
|------|------|------------|-----------|------------|

---

## 6. Benchmark concurrentiel

| Concurrent | Positionnement | Différence produit clé |
|------------|----------------|------------------------|

---

## 7. Opportunités produit priorisées

| Opportunité | Impact | Effort | Pourquoi |
|-------------|--------|--------|----------|

---

## 8. Limites & hypothèses de l’analyse

---

## 9. Illustrations & preuves visuelles

---

## 10. Les 3 enseignements produit clés à retenir
`;

export const PRODUCTSCOUT_SKELETON_PROMPT_EN = `
You are generating a STRICT Markdown skeleton for a product analysis report in English.

Rules (NON-NEGOTIABLE):
- OUTPUT MARKDOWN ONLY
- DO NOT add any content
- DO NOT add explanations
- DO NOT add bullet points
- DO NOT add bold text
- DO NOT modify section titles
- DO NOT add or remove sections
- Use ONLY Markdown headings (##, ###)
- Insert a horizontal divider (---) AFTER EACH major section

Your job is ONLY to output the structure exactly as specified below.

# 🧠 ProductScout — Competitive product report

## 0. TL;DR (2-minute read)

---

## 1. Product identity

| Field | Value |
|------|-------|
| Product name | |
| URL | |
| Product type | |
| Primary audience | |
| Business model | |
| Estimated maturity | |

---

## 2. Value proposition (PM rewrite)

---

## 3. UX & flows (product lens)

### 3.1 Discovery / Landing

### 3.2 Activation

### 3.3 Monetization

### 3.4 Retention

---

## 4. Key features

| Area | Feature | For who | User value | Observability |
|------|---------|---------|------------|---------------|

---

## 5. Pricing & business model

| Plan | Price | Commitment | Mechanic | Clarity |
|------|-------|------------|----------|---------|

---

## 6. Quick benchmark

| Competitor | Positioning | Key product difference |
|------------|-------------|------------------------|

---

## 7. Prioritized product opportunities

| Opportunity | Impact | Effort | Why |
|-------------|--------|--------|-----|

---

## 8. Limits & assumptions

---

## 9. Visual evidence (screenshots / videos)

---

## 10. 3 key product learnings
`;
