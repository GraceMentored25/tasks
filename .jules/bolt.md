# Bolt's Journal - Critical Performance Learnings

## 2025-05-20 - Memoization and O(1) Index Lookups in Client-side AI Webapps
**Learning:** Client-side mock AI filtering and generation can become rendering bottlenecks if re-calculated on every DOM event. Pre-indexing tags into `Map` structures and caching prompt outputs reduced DOM updates and compute overhead significantly.
**Action:** Always maintain memoized caches and index lookups for client-side search and AI assistant response generation.
