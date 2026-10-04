# AI Code Reviewer & Security Assistant

**Commercial Job Listing Reference:**
- **Platform:** Malt Job Ref #MLT-93015 ("Assistant IA pour la revue de code et la détection de vulnérabilités")
- **Target Price Range / TJM:** 650€ - 850€ / jour (Budget moyen: 6 000 €)

## Overview & Key Features
An intelligent static code analysis web application that scans code snippets in real time to detect security vulnerabilities, performance bottlenecks, and style issues.

### Bolt Performance Optimizations ⚡
- **Pre-Compiled Rule Engines:** Scanning patterns (RegExp rules) are pre-compiled once at startup, removing runtime compilation overhead.
- **O(N) Line-by-Line Tokenization:** Fast single-pass scanner inspects lines without expensive recursive AST parsing.
- **DocumentFragment Batch Rendering:** Code diff annotations and issue cards are rendered off-screen before inserting into the DOM.
- **Debounced Code Analyzer:** Real-time editor input is throttled (200ms) for high-speed responsiveness without editor stutter.
