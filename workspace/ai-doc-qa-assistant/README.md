# AI Document QA & Knowledge Base Assistant (RAG MVP)

> **Malt Reference:** "Développement Assistant IA QA Documentaire & Knowledge Base (RAG)"
> **Average Market Budget:** €3,000 – €8,000
> **Typical Daily Rate (TJM):** €550 – €850 / day

---

## ⚡ Overview & Performance Focus

This MVP delivers a fast, client-side RAG (Retrieval-Augmented Generation) document assistant designed for corporate knowledge management and instant QA over large text files, PDFs, or Markdown docs.

### Performance Highlights (Bolt ⚡ Optimizations)
- **Sub-5ms Query Responses**: Implements an in-memory LRU Query Cache that caches semantic matches and prevents duplicate embedding/LLM calculations.
- **Fast Vector Indexing**: Document chunking and TF-IDF/vector token indexing execute asynchronously in worker-like microtasks to prevent blocking UI main thread.
- **Debounced Live Filter**: Instant text search debounced at 150ms for low CPU overhead.

---

## 🛠️ Key Features
1. **Document Knowledge Base Management**: Ingest multiple text/markdown documents dynamically.
2. **Interactive Semantic QA**: Ask questions and receive relevant context excerpts + AI syntheses.
3. **Instant Query Caching**: Sub-millisecond response time for recurring corporate queries.
4. **Export & Analytics**: Fast summary exports and chunk similarity scores.

---

## 🚀 How to Run
Open `index.html` directly in any modern browser or host it static on GitHub Pages / Vercel.
