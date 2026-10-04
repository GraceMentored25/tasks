# Bolt's Performance Journal - Critical Learnings

## 2026-10-04 - O(1) Map Caching and Batch DOM Rendering for High-Throughput AI Tools
**Learning:** Frequent recalculations during real-time typing/filtering in client-side AI tools create high main-thread layout thrashing when updating individual DOM nodes sequentially or using O(N²) array searches. Utilizing O(1) Map data structures for term frequency counts and assembling dynamic output via DocumentFragment batching maintains 60fps interaction speed.
**Action:** Always pre-calculate and cache frequency tables using JavaScript `Map` objects, debounce input listeners by 150-300ms, and append list elements to a `DocumentFragment` before updating the live DOM container in a single layout pass.
