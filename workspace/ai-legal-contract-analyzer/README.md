# AI Legal Contract & Clause Analyzer MVP

## Commercial Job Reference (Malt)
- **Platform:** Malt France / International
- **Job Reference:** AI Legal Tech Developer - Automated Contract Risk Analysis & Clause Extraction MVP
- **Average TJM:** €700 - €900 / day
- **Estimated MVP Budget:** €5,000 - €8,000

## Overview
An AI Legal Tech assistant designed for legal teams and procurement specialists to quickly detect high-risk liability clauses, indemnity obligations, termination rules, and data compliance gaps.

## Key Bolt ⚡ Performance Optimizations
- **O(1) Risk Rules Hash Lookup:** Uses pre-indexed map lookups rather than repeated nested loops for clause parsing.
- **RAF Async Chunk Processing:** Parses lengthy legal text asynchronously with `requestAnimationFrame` chunking to prevent UI freezing.
- **DocumentFragment Rendering:** Batches identified clause flags into a single DOM update cycle.
