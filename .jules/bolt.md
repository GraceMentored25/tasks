# Bolt's Journal - Performance Insights & Learnings

## 2026-09-28 - Client-side AI Inference Simulation & Caching
**Learning:** Heavy string operations and repeated simulated LLM generation in browser apps can cause main-thread blocking and UI lag if rendered synchronously without memory caching or chunking.
**Action:** Use memoized lookup tables (O(1) retrieval) for known prompt patterns and use `requestAnimationFrame` / `setTimeout` debouncing for continuous UI updates to maintain 60 FPS.
