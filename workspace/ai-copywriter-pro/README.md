# AI Copywriter Pro ⚡

Commercial AI MVP application built for freelance client projects.

## Commercial Job Reference
- **Platform Reference:** Malt - "Développeur Fullstack Lead AI / Générateur de Contenu Marketing Automated"
- **Estimated Average TJM:** 600 €/day
- **MVP Project Value:** 3 500 €

## Key Features
- High-speed automated marketing copy generation (Landing pages, Social Posts, Email campaigns)
- Real-time live copy preview with zero UI latency
- Template caching and debounced input processing to maintain smooth 60fps interaction

## Performance Optimizations
- **Input Debouncing:** 150ms input handler throttling to prevent CPU thrashing during live input.
- **RAF Batching:** Uses `requestAnimationFrame` for UI DOM updates to eliminate render jank.
- **Memoized Pattern Store:** In-memory generation cache for instantaneous output retrieval on identical prompts.
