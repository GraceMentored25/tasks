# Bolt's Journal - Critical Performance Learnings

## 2026-10-12 - [O(1) Caching & Single-Pass Algorithms for Client-Side AI MVPs]
**Learning:** Client-side AI Web MVPs often perform repeated regex scanning and template searches during real-time typing. Replacing array scans with O(1) Map lookups and single-pass regex matching eliminates input latency and main thread locking.
**Action:** Always pre-compile lookup dictionaries and regex patterns at module load, and debounce text field inputs by 150ms-250ms before triggering real-time client transformations.
