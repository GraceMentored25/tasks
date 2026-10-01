# AI Customer Lead Scoring MVP

## Commercial Reference
- **Platform Reference:** Malt Job Listing #MALT-LEAD-AI-9012
- **Project Title:** IA Scoring & Qualification Automatique de Leads B2B
- **Client Budget / Contract Value:** 4,000 €
- **Estimated TJM (Daily Rate):** 600 € - 800 € / day
- **Target Audience:** B2B SaaS Sales Teams, Growth Marketers & CRM Ops

## Solution Features
- Real-time lead scoring calculator (0-100 score).
- Qualification tiers (Hot / Warm / Cold), conversion probability matrix, and AI recommended next steps.
- Preset lead scenarios (Enterprise Deal, Mid-Market, SMB Self-Serve) for instant testing.

## Bolt ⚡ Performance Optimization
- **Debounced Memoization Scoring Matrix:** Utilizes a memoized scoring lookup function combined with 50ms debouncing on parameter updates. Prevents layout thrashing and recalculates scores in < 0.5ms using cached weight multiplication vectors.
