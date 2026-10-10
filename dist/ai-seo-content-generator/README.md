# AI SEO Content Generator & Keyword Density Analyzer

## Reference Mission (Malt)
- **Title:** Expert IA Generative & SEO - Générateur Automatique de Contenu Optimisé SEO
- **Platform:** Malt / Freelance
- **Estimated Price Range / TJM:** 550€ - 800€ / jour (Projet au forfait ~4,000€ - 6,000€)

## Features
- Real-time keyword density calculation and live SEO scoring
- Single-pass word tokenizer and memoized keyword frequency counter
- Instant AI snippet outline and meta description recommendation
- Debounced live analysis avoiding UI blocking and thread lag

## Performance Optimizations
- **Single-pass regex tokenizer:** Combines word extraction, length check, and lowercasing in one iteration.
- **Debounced analysis engine:** Prevents recalulating density matrix on every single keypress, scheduling computation with `requestIdleCallback` / microtasks.
