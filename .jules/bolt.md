## 2026-09-25 - DOM Batching & Debounced Event Parsing
**Learning:** Performing synchronous layout re-calculations on every keypress during real-time text analysis degrades frame rates to below 30 FPS for large inputs.
**Action:** Use debouncing for real-time text parsing inputs combined with `DocumentFragment` or batch rendering via `requestAnimationFrame` to maintain 60 FPS UI performance.
