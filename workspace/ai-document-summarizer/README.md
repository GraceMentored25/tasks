# ⚡ AI Document Summarizer - Synthèse & RAG Non-Bloquante

## 📋 Référence Offre Commerciale (Malt / Freelance)
- **Titre de la mission**: Création d'un outil Web de synthèse, extraction d'enseignements clés et RAG local sur documents d'entreprise.
- **Plateforme**: Malt France
- **Tarif Journalier Moyen (TJM)**: 650 € / jour
- **Fourchette de budget estimée**: 5 000 € - 7 500 € (Projet MVP livré en 10-12 jours)
- **Besoin client**: Un cabinet de conseil a besoin d'une application web fluide capable d'analyser de longs rapports financiers ou légaux sans bloquer le navigateur pendant le traitement NLP.

---

## ⚡ Optimisations de Performance (Bolt)
1. **Traitement Async Non-Bloquant**: Découpage du parsing texte et de l'extraction TF-IDF via `requestIdleCallback` et boucle de libération du fil principal.
2. **Mémoïsation TF-IDF**: Mémorisation des mots-clés extraits par signature de texte pour réaffichage instantané ($0\text{ ms}$).
3. **Mise à jour DOM par Chunks**: Mise à jour sélective et fluide du nuage de tags et des métriques sans déclencher de reflow massif.

---

## 🚀 Utilisation
Ouvrir `index.html` dans tout navigateur moderne ou consulter la version déployée sur GitHub Pages.
