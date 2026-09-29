# AI SEO Content Generator & Optimizer ⚡

## Commercial Reference & Client Scope
- **Platform Reference:** Malt Freelance Listing - *"Développeur IA / Prompt Engineer - Générateur de contenu SEO automatisé"*
- **Target Budget / TJM:** 500€ - 800€ / jour (~3,500€ - 6,000€ budget total)
- **Client Demand:** E-commerce and agency clients require high-speed generation of blog outlines, meta descriptions, and keyword density analyses without server latency or repeated API token costs.

## Key Features
- **Instant AI Article Generation:** High-performance mock LLM stream generator with real-time word rendering.
- **Keyword Density & Readability:** Live word frequency and Flesch readability evaluation.
- **SERP Preview:** Real-time Google search snippet preview.

## Performance Optimizations (Bolt ⚡)
- **O(1) Response Cache:** Uses a custom LRU (Least Recently Used) cache (`maxSize = 50`) for prompt results to eliminate duplicate generation calculations.
- **O(N) Single-Pass Keyword Tokenizer:** Single pass regex tokenization with hash map frequency count.
- **Debounced Live Inputs:** Input events for density analysis are debounced by 200ms to prevent main thread blocking on large text bodies.
