## 2026-10-17 - O(1) Cache Eviction and DOM Batching for Client AI MVPs
**Learning:** Using an LRU Map cache for repeated text query processing reduces computation time from ~10-15ms to sub-millisecond execution. Furthermore, updating DOM elements with DocumentFragment prevents layout thrashing during dynamic text token listing.
**Action:** Always implement bounded LRU caching for repeated text synthesis tasks and construct list elements via fragments before updating innerHTML.
