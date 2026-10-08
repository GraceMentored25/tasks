# AI Support Ticket & Email Response Copilot (`ai-support-copilot`)

## 📋 Commercial Job Reference
- **Platform Reference:** Malt - *Copilote IA de réponses client automatisées CRM / Support Client (HubSpot / Intercom / Zendesk)*
- **Average Daily Rate (TJM):** 500€ - 700€ / jour
- **Estimated Project Budget:** 2 800€ - 4 000€

## 🚀 MVP Description
An automated customer service draft generator for support teams.
Supports ticket category detection (Billing, Technical Bug, Refund Request, Onboarding), custom variable replacement (customer name, order ID, resolution timeline), and tone selection (Professional, Empathic, Concise).

## ⚡ Bolt Performance Optimizations
- **Template Memoization Map:** Compiled template regex strings and token extractors are stored in memory to prevent repeated evaluation.
- **Micro-batching UI Render Updates:** Response generation is rendered using lightweightDOM updates without layout re-thrashing.
