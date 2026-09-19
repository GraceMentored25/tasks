# Optimiseur de CV & Lettre de Motivation IA (AI Resume Optimizer)

> **Malt Reference:** "Création outil IA d'optimisation de CV pour ATS / Scoring CV"
> **Prix moyen sur le marché (Freelance Malt):** 1 500 € - 4 000 €
> **Déploiement:** GitHub Pages Ready (Fichiers statiques index.html / app.js / CSS)

## Description
Application web permettant d'analyser le contenu d'un CV par rapport à une offre d'emploi cible. Fournit un score de compatibilité ATS, identifie les mots-clés manquants et suggère des rédactions optimisées.

## Performance Optimization (Bolt ⚡)
- **Async Chunked Score Computation:** Évite le blocage du thread principal (UI freeze) lors du parsing de gros volumes de texte.
- **Set & Map Keyword Indexing:** Recherche rapide O(N) au lieu de boucles imbriquées O(N²).
- **Fast DOM Updates:** Fragment DOM pour minimiser le reflow.

## Déploiement GitHub Pages
1. Pousser le dossier sur la branche principale (`main`).
2. Choisir la racine ou `/workspace/ai-resume-optimizer` sur GitHub Pages Settings.
