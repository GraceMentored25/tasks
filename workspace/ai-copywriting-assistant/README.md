# AI Copywriting Assistant ⚡

**Commercial Offer Reference:** Malt Job Ref #MALT-AI-2024-081 ("Assistant de rédaction SEO & fiches produits e-commerce par IA")
**Estimated Price Range:** 3 000 € – 5 000 €
**Target TJM:** 600 € / jour

## Overview
An optimized, high-speed web application for e-commerce teams and marketers to generate high-converting product descriptions, blog hooks, and SEO meta content using AI.

## Features
- **Instant Template Generator:** Select tone, language, target audience, and SEO keywords.
- **Real-Time Stream Simulation:** Fast UI responsiveness with streaming text chunk simulation.
- **Client-Side Cache:** Previously generated copies are memoized for zero latency retrieve.
- **Token & Character Counter:** Real-time token usage and length verification.

## Bolt Performance Highlights
- ⚡ **Memoized Template Engine:** Pure functions with LRU prompt cache prevent redundant processing.
- ⚡ **Debounced Inputs:** User inputs are debounced (300ms) to eliminate wasteful layout recalcs.
- ⚡ **DocumentFragment Batching:** Dynamic copy variations render in a single paint cycle.
