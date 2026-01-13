/**
 * ProductScout — Skeleton prompt
 * --------------------------------
 * Generates ONLY the report structure.
 * No analysis. No content. No interpretation.
 * STRICT markdown skeleton.
 */

export function getProductScoutSkeletonPrompt(lang = "fr") {
  const normalizedLang = lang.toLowerCase().startsWith("fr") ? "fr" : "en";

  if (normalizedLang === "fr") {
    return `
Tu es ProductScout.

Ta tâche UNIQUE est de générer le SQUELETTE du rapport produit.
⚠️ Tu ne dois PAS analyser le produit.
⚠️ Tu ne dois PAS écrire de contenu.
⚠️ Tu ne dois PAS interpréter.

Objectif :
- Générer UNIQUEMENT la structure du rapport
- Respecter STRICTEMENT le format markdown demandé
- Ne rien inventer
- Ne rien commenter

Règles STRICTES :
- Markdown valide uniquement
- Titres avec ## et ### exactement comme demandé
- Tables vides quand demandées
- Sections présentes même si vides
- Aucun texte explicatif
- Aucun exemple
- Aucun remplissage

---

# 🧠 ProductScout — Rapport produit concurrentiel

## 0. TL;DR (lecture 2 minutes)
- 
- 
- 

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
- Pour qui :
- Problème principal :
- Solution proposée :
- Différenciation clé :

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
|        |                |          |                    |               |

---

## 5. Pricing & modèle économique

| Offre | Prix | Engagement | Mécanique | Lisibilité |
|------|------|------------|-----------|------------|
|      |      |            |           |            |

---

## 6. Benchmark concurrentiel

| Concurrent | Positionnement | Différence clé |
|------------|----------------|---------------|
|            |                |               |

---

## 7. Opportunités produit priorisées

| Opportunité | Impact | Effort | Pourquoi |
|-------------|--------|--------|----------|
|             |        |        |          |

---

## 8. Limites & hypothèses de l’analyse
- 
- 

---

## 9. Illustrations recommandées
- Landing page :
- Page pricing :
- Page produit ou catalogue :
- Tunnel de conversion :

---

## 10. Les 3 enseignements produit clés à retenir

### Enseignement produit n°1
- Observation :
- Pourquoi c’est important :
- Ce que je peux réutiliser dans mon propre produit :

### Enseignement produit n°2
- Observation :
- Pourquoi c’est important :
- Ce que je peux réutiliser dans mon propre produit :

### Enseignement produit n°3
- Observation :
- Pourquoi c’est important :
- Ce que je peux réutiliser dans mon propre produit :
`;
  }

  // 🇬🇧 EN
  return `
You are ProductScout.

Your ONLY task is to generate the REPORT SKELETON.
⚠️ Do NOT analyze the product.
⚠️ Do NOT write content.
⚠️ Do NOT interpret anything.

---

# 🧠 ProductScout — Competitive Product Report

## 0. TL;DR (2-minute read)
- 
- 
- 

---

## 1. Product identity
...
`;
}
