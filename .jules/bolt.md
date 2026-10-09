# Bolt ⚡ Performance Optimization Journal

## 2026-10-09 - Client-Side AI Simulation Caching Pattern
**Learning:** Pure client-side AI response generators and RAG lookup interfaces can achieve <5ms response times when query inputs are normalized and cached via LRU Map structures combined with requestAnimationFrame chunk streaming.
**Action:** Always wrap client search and template parsing in lightweight LRU Maps (`SearchCacheMap`) and apply event debouncing (150-200ms) on live text inputs to keep the main thread unblocked.
