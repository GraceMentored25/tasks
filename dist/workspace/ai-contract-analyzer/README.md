# AI Contract Analyzer MVP

## Commercial Reference
- **Platform**: Malt (Commercial Freelance Offer)
- **Job Title**: Consultant LegalTech GenAI & Fullstack Developer
- **Estimated TJM (Daily Rate)**: 600€ - 850€ / jour
- **Market Context**: Legal departments & law firms needing automated risk scoring, key clause extraction, and compliance checking for commercial contracts.

## Architecture & Performance
- **Linear Clause Parsing**: O(N) regex evaluation strategy using single-pass tokenization.
- **Fast Dynamic UI**: DOM batching with zero reflow penalty during large document parsing.
- **Client Cache**: LRU strategy to keep recently analyzed contractual clauses instant in memory.
