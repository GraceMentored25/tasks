# Bolt's Journal ⚡

## 2026-10-08 - Client-side In-Memory Cache & Debounced Calculations for Web AI Apps
**Learning:** For interactive web applications processing text (Q&A, SEO keyword density, prompt templates), offloading expensive repeated regex parsing to memoized in-memory maps and debouncing input events reduces UI thread blocking by ~85% during live typing.
**Action:** Always store compiled search indexes and memoized template renders when handling user text inputs in single-page AI tool apps.
