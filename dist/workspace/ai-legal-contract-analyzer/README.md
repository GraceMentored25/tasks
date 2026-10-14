# ⚖️ AI Legal Contract & Risk Analyzer MVP

## 📋 Commercial Job Offer Reference
- **Source Platform:** Malt (Freelance LegalTech Project)
- **Job Title:** Senior Fullstack & AI Engineer - Contract Audit & Risk Analysis WebApp
- **Client Industry:** LegalTech / Enterprise SaaS
- **Estimated Budget / TJM:** 700€ / day (Estimated Project Duration: 6-7 days ~ 4,500€ MVP Package)

## 🎯 Application Overview
An AI-powered legal contract analysis web application designed for legal teams, procurement specialists, and freelancers. It automatically scans contracts, identifies risky clauses (liability caps, automatic renewals, non-competes, jurisdiction risks), and provides instant risk scores with recommendations.

## ⚡ Bolt Performance Optimizations
- **Memoized Clause Parser:** Clause tokenization and regex matching are memoized to avoid redundant CPU work on unchanged document sections.
- **Client-Side Cache:** Previously scanned document hashes are cached in `localStorage` for sub-millisecond retrieval.
- **Debounced Analysis Engine:** User input is debounced (300ms) to maintain a buttery 60fps typing experience during live contract editing.
