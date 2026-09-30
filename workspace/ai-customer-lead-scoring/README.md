# Commercial AI MVP: AI Customer Lead Scoring & Triage System

## Commercial Context & Reference
- **Platform Reference**: Malt / Freelancer Job Listing
- **Job Title**: Consultant IA & Fullstack - Système IA de Qualification et Scoring de Leads B2B
- **Job Reference / Link**: Malt Freelance Request #AI-LEAD-2026-3042
- **Estimated Price Range / TJM**: 550€ - 750€ / jour (Budget total projet MVP: ~5,000€)

## Description
An enterprise AI lead scoring engine that evaluates deal conversion likelihood, calculates lead scores (0-100), detects deal risk factors, and recommends immediate sales actions.

## Key Features
- Predictive B2B lead scoring with instant qualification tiers (Hot, Warm, Cold).
- Deal conversion probability estimation and risk factor identification.
- Automated AI recommended actions for sales teams.
- Real-time lead analysis with zero latency.

## Performance Optimizations
- **Pre-compiled Rule Matchers**: Pre-compiles scoring rules and regex vectors for instant O(1) evaluation per criteria.
- **Memoized Score Calculation**: Results for company metrics & input configurations are memoized to eliminate repeated score computation.
- **Batch Processing Support**: Process multiple lead evaluations in a single optimized synchronous tick.
