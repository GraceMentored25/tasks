# 🎯 AI Customer Lead Scoring & Intent Detection Platform

> **Référence Mission Commerciale Malt**: #MLT-74102 — *Plateforme IA de Qualification et Scoring Automatisé des Leads CRM*
> **TJM / Estimation Prix**: 600€ - 800€ / jour | Budget Total Projet : 4 500€ – 7 000€
> **Client**: Équipe Revenue Operations (RevOps) & SaaS B2B Enterprise

---

## 🎯 Description du Projet MVP
Plateforme B2B d'évaluation continue et de scoring prédictif des opportunités commerciales (leads). L'application classe les prospects en catégories (Hot, Warm, Cold), calcule la probabilité de conversion et extrait les signaux d'intention clés (Intent Signals) à partir des comportements CRM.

## ✨ Fonctionnalités Clés
- **Evaluation prédictive multi-critères** : Pondération en temps réel du comportement Web, taille d'entreprise et budget.
- **Détection automatique de signaux d'intention** : Extraction rapide des déclencheurs d'achat.
- **Analyse par lots (Batch Lead Scoring)** : Traitement simultané de dizaines de prospects sans blocage.
- **Filtres & tri haute performance** : Filtrage instantané par segment de score.

## ⚡ Optimisations de Performance (Bolt)
1. **Traitement par lots Asynchrone (Chunked Async Batch Processing)** : Traitement distribué des listes de leads via `setTimeout` / non-blocking Event Loop pour maintenir 60 images/seconde pendant le scoring massif.
2. **Scoring Mémorisé avec Clé de Hachage O(1)** : Mémorisation des règles de scoring par profil d'entreprise pour éviter les re-calculs redondants.
3. **Mise à jour DOM par DocumentFragment** : Injection en une seule passe DOM pour le rendu des cartes de leads.
