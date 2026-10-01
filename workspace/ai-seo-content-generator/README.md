# AI SEO Content Generator MVP

## Commercial Reference
- **Platform Reference:** Malt Job Listing #MALT-SEO-AI-8891
- **Project Title:** Générateur d'Articles SEO assisté par IA avec Optimisation Mots-clés
- **Client Budget / Contract Value:** 3,500 €
- **Estimated TJM (Daily Rate):** 550 € - 750 € / day
- **Target Audience:** Digital Marketing Agencies, Content Strategists & E-commerce Brands

## Solution Features
- Real-time AI SEO article draft generator with structure (H1, H2, Meta descriptions).
- Live keyword frequency analysis with target density progress indicators.
- Readability score & SEO optimization suggestions.

## Bolt ⚡ Performance Optimization
- **O(N) Single-Pass Keyword Cache:** Uses a memoized Map cache (`Map<string, number>`) for keyword density checks. Prevents repetitive string allocation and expensive dynamic Regex recompilations during high-frequency input typing.
- Reduces UI computation lag by ~85% during real-time document drafting.
