# Bolt's Journal - Critical Performance Learnings

## 2026-10-13 - Vanilla JS DOM & Memory Caching Bottlenecks in Single-Page MVPs
**Learning:** For client-side AI text processing MVPs, heavy regex parsing or repetitive DOM updates on user keypress/input cause main thread blocking and noticeable frame drops. Utilizing debouncing, memoization, and chunked non-blocking async execution (`requestIdleCallback` / micro-task slicing) dramatically increases response rates and smoothness without adding heavy dependencies.
**Action:** Always apply debouncing for search/filter inputs, memoize recurring prompt transformations, and slice large document parsing into non-blocking chunks in pure JavaScript MVPs.
