# AI Customer Support Copilot MVP

> **Référence de l'offre Commerciale (Malt)**: [Malt - Développeur IA - Copilote Support Client NLP](https://www.malt.fr/)
> **TJM Moyen**: 500 € / jour
> **Budget Estimé du Projet MVP**: 3 500 € (7 jours de développement)

## 📌 Présentation
Assistant IA interactif dédié aux équipes support client. Il résume automatiquement les tickets clients complexes, analyse le sentiment, suggère une catégorie et génère instantanément des réponses contextualisées.

## ⚡ Optimisations de Performance (Bolt)
- **LRU Cache Client**: Mise en cache memoizée des résumés IA et réponses générées pour éviter les traitements redondants sur les tickets réincrémentés.
- **Recherche Debouncée**: Atténuation des re-rendus sur le filtre de recherche (300ms) pour maintenir un taux d'affichage de 60 FPS sans blocage du thread principal.
- **Mises à jour du DOM ciblées**: Manipulation minimale du DOM via `DocumentFragment` lors de la sélection des tickets.
