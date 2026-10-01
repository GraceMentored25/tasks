# Bolt's Journal

## 2026-10-01 - O(1) Cache & Memoization in Client-Side AI Applications
**Learning:** Client-side AI web applications can suffer responsiveness issues during real-time typing/scoring when complex string processing or calculations run synchronously on the main thread.
**Action:** Use LRU/Map-based memoization caches and debouncing for prompt processing and scoring updates to keep UI interactions under 16ms frame budgets.
