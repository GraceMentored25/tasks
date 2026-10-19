# AI Intelligent Document & Invoice Extractor MVP

> **Référence de l'offre Commerciale (Malt)**: [Malt - Architecte Solution IA / OCR & Extraction de Documents](https://www.malt.fr/)
> **TJM Moyen**: 600 € / jour
> **Budget Estimé du Projet MVP**: 4 800 € (8 jours de développement)

## 📌 Présentation
Plateforme d'extraction intelligente de documents et factures alimentée par l'IA. Elle numérise les pièces comptables (PDF, Scans, Images), en extrait les entités structurées (Montant HT/TTC, TVA, Fournisseur, Date, IBAN) et génère un flux JSON/CSV certifié.

## ⚡ Optimisations de Performance (Bolt)
- **Calcul Asynchrone Non-Bloquant**: Traitement de l'OCR et du parsing d'entités découplé de la boucle de rendu principale via `requestAnimationFrame` et des Promesses différées.
- **Cache de Hash de Document**: Memoization immédiate des résultats de numérisation via empreinte mémoire du fichier pour éviter les analyses répétées.
- **Rendu DOM par Fragment**: Mises à jour par lots des tableaux de données financières pour maximiser la réactivité de l'interface.
