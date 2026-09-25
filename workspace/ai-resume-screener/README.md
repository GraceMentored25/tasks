# AI Resume Screener & Candidate Matcher MVP

## Commercial Job Reference (Malt)
- **Platform:** Malt France / International
- **Job Reference:** AI Recruitment Specialist - Automated Candidate Scoring & Resume Parsing Web Application
- **Average TJM:** €600 - €750 / day
- **Estimated MVP Budget:** €4,000 - €6,000

## Overview
An AI-powered HR recruitment tool that parses candidate profiles, ranks experience against job descriptions, and extracts key skills with automated fit scoring.

## Key Bolt ⚡ Performance Optimizations
- **Pre-compiled Regex Patterns:** Pre-compiles regular expressions for skill matching, preventing re-compilation overhead during candidate batch processing.
- **Score Calculation Caching:** Caches individual candidate skill matching calculations to avoid redundant evaluations.
- **Batched DOM updates:** Uses `DocumentFragment` to append candidate cards in a single DOM reflow operation.
