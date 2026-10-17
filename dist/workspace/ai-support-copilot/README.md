# AI Customer Support Copilot (MVP)

> **Malt Reference:** *"Développement Copilot Support Client IA & Suggestion de Réponses RAG"*
> **Average TJM:** 550€ - 750€/jour
> **Estimated Budget Range:** 4,500€ - 7,000€
> **Target Audience:** Customer Support teams requiring automated intent classification, fast context-aware auto-replies, and sentiment analysis.

---

## ⚡ Performance Features Built by Bolt
- **Debounced Input Classifier:** Intent classification is triggered with a 300ms debounce buffer to eliminate redundant CPU re-computations on every keystroke.
- **LRU Response Cache:** Pre-calculated embeddings & responses are stored in an in-memory LRU map for sub-5ms instant retrieval on recurring user queries.
- **Batched DOM Rendering:** Uses DocumentFragments for streaming suggestion updates without triggering excessive layout reflows.

---

## 🚀 How to Run Locally
Open `index.html` directly in any modern browser, or launch through the workspace root build script (`pnpm run build`).
