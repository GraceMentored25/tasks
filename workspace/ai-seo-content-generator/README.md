# AI SEO Content Generator & Optimizer

**Commercial Job Listing Reference:**
- **Platform:** Malt Job Ref #MLT-89241 ("Création d'un générateur de contenu SEO et d'optimisation sémantique par IA")
- **Target Price Range / TJM:** 550€ - 750€ / jour (Budget moyen: 4 500 €)

## Overview & Key Features
This MVP allows content marketers and SEO specialists to instantly draft, analyze, and optimize articles for search engines.

### Bolt Performance Optimizations ⚡
- **O(1) Map Term Frequency Analysis:** Word and n-gram occurrences are indexed into a JavaScript `Map` cache, yielding instant lookups.
- **Debounced Live Analysis:** Content input listener is debounced (150ms) to prevent main-thread freeze on long articles.
- **Batch DOM Rendering:** Recommendations and density chips are generated in memory using `DocumentFragment` before painting.
- **Flesch-Kincaid Readability Engine:** Instant calculation of syllable and word metrics without heavy external dependencies.
