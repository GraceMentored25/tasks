# AI Code Auditor & Security Scanner ⚡

Commercial AI MVP application built for freelance client projects.

## Commercial Job Reference
- **Platform Reference:** Malt - "Auditeur Sécurité & Optimization Code IA / Static Analysis Web App"
- **Estimated Average TJM:** 700 €/day
- **MVP Project Value:** 4 000 €

## Key Features
- High-speed client-side static code analysis & AI vulnerability scanner
- Real-time syntax scanning for XSS, SQLi, and performance bottlenecks
- Fast static analysis engine running in micro-tasks to prevent UI blocking

## Performance Optimizations
- **Memoized Rule Evaluator:** Reuses previous AST rule check calculations for duplicate code snippets.
- **Non-blocking Micro-chunk Execution:** Runs code scanning in non-blocking event loop chunks using `setTimeout(..., 0)` / microtasks.
- **Pre-compiled Regex Matchers:** Static regex patterns allocated outside execution loops.
