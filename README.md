# ⚡ Commercial AI Web Application MVPs Studio

Ce dépôt héberge une suite d'applications web d'intelligence artificielle commercialisables issues d'offres réelles de plateformes de freelancing (Malt, Upwork).

---

## 🚀 Projets dans le Workspace

### 1. ⚡ [AI Copywriter Pro](./workspace/ai-copywriter-pro/)
- **Référence Offre**: Générateur de Contenus Marketing & Copywriting IA avec optimisation de tokens
- **Tarif Commercial**: 600 € / jour (TJM) | Budget: 4 500 € - 6 000 €
- **Optimisations Bolt**: Prévisualisation débouncée ($100\text{ ms}$), mémoïsation de templates, comptage $O(N)$ de tokens.

### 2. ⚡ [AI Document Summarizer](./workspace/ai-document-summarizer/)
- **Référence Offre**: Outil Web de Synthèse et d'Analyse Documentaire IA pour PME
- **Tarif Commercial**: 650 € / jour (TJM) | Budget: 5 000 € - 7 500 €
- **Optimisations Bolt**: Traitement async non-bloquant (`requestIdleCallback`), mémoïsation TF-IDF, évitant les pertes de FPS.

### 3. ⚡ [AI Code & Performance Auditor](./workspace/ai-code-auditor/)
- **Référence Offre**: Dashboard Web d'Audit Automatique de Code & Détection de Flous/Sécurité IA
- **Tarif Commercial**: 700 € / jour (TJM) | Budget: 6 000 € - 9 000 €
- **Optimisations Bolt**: Regex d'AST pré-compilées, injection DOM par `DocumentFragment`, refactoring instantané.

---

## 🛠️ Validation & Tests
Chaque projet contient une configuration CSP valide et une structure conforme. Pour vérifier la conformité du workspace :

```bash
pnpm test
```

---

## 🔄 Workflow Multi-Agents
1. **Bolt ⚡** : Construction des MVPs & Optimisations de performance.
2. **Palette 🎨** : Polissage UI/UX, accessibilité ARIA et finitions visuelles.
3. **Sentinel 🛡️** : Hardening de la sécurité, headers CSP et assainissement.
