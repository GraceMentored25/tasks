# AI Document & Contract Summarizer (Analyseur de Documents)

## Reference Mission (Malt)
- **Title:** Développeur / AI Engineer - Analyseur & Résumeur de Contrats et Documents Juridiques
- **Platform:** Malt / Freelance
- **Estimated Price Range / TJM:** 600€ - 850€ / jour (Projet au forfait ~4,500€ - 7,000€)

## Features
- Fast non-blocking chunked contract analysis and bullet-point extraction
- Automatic risk classification (high risk, notice period, payment clauses)
- Instant structural summary generation with key takeaways
- Responsive clean interface built for legal & business document review

## Performance Optimizations
- **Non-blocking Chunked Processing:** Splits large documents into manageable text paragraphs and yields control back to the event loop using `setTimeout(..., 0)` / microtasks during analysis.
- **Lazy DOM Rendering:** Dynamically constructs summary items in fragment batches to avoid layout thrashing.
