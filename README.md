# AI MVP Web Applications Workspace ⚡

Ce dépôt contient un ensemble d'applications web MVP (Minimum Viable Product) basées sur l'Intelligence Artificielle, conçues et optimisées pour être commercialisées sur des plateformes de freelancing telles que **Malt**.

---

## 🚀 Applications IA dans `workspace/`

### 1. **AI Customer Support & FAQ Bot** (`workspace/ai-customer-support-bot`)
* **Offre Malt Référence:** *Développement Chatbot Support Client IA & Automation FAQ*
* **Fourchette de prix moyen:** **1 500€ - 3 500€**
* **Fonctionnalités:** Assistant virtuel avec classification d'intention, streaming textuel fluide et module d'escalade support.
* **Déploiement GitHub Pages:** `workspace/ai-customer-support-bot/index.html`

### 2. **AI Resume & CV ATS Optimizer** (`workspace/ai-resume-optimizer`)
* **Offre Malt Référence:** *Optimiseur de CV IA & Matcher d'Offres d'Emploi ATS*
* **Fourchette de prix moyen:** **1 200€ - 2 800€**
* **Fonctionnalités:** Scoring de compatibilité ATS temps réel, détection de mots-clés manquants et conseils de réécriture ciblés.
* **Déploiement GitHub Pages:** `workspace/ai-resume-optimizer/index.html`

### 3. **Multi-Platform AI Content Generator** (`workspace/ai-content-generator`)
* **Offre Malt Référence:** *Générateur de Contenu IA Multi-Plateforme (Social Media, Blog, Email)*
* **Fourchette de prix moyen:** **1 000€ - 2 500€**
* **Fonctionnalités:** Génération multi-canal (LinkedIn, Twitter, Email, Blog) avec ajustement du ton et prévisualisation instantanée.
* **Déploiement GitHub Pages:** `workspace/ai-content-generator/index.html`

---

## ⚡ Optimisations de Performance (Agent Bolt)

Toutes les applications incluent des optimisations côté client pour garantir un rendu fluide et rapide :
- **In-Memory Caching (Map):** Évite les re-calculs superflus sur les requêtes ou phrases identiques.
- **Rendu asynchrone par `requestAnimationFrame`:** Animation de streaming sans blocage du thread principal.
- **Délégation d'événements:** Optimisation de l'utilisation mémoire sur les boutons d'action.

---

## 🛠️ Commandes & Verification

```bash
# Exécuter les tests de vérification de la structure workspace
pnpm test

# Linter le code
pnpm lint
```

---

## 🌐 Déploiement GitHub Pages

Chaque MVP est prêt à être servi en tant qu'application web statique hébergée directement via GitHub Pages dans le dossier `/workspace/<app-name>`.
