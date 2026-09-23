# AI Code Reviewer & Refactoring Assistant MVP

> **Malt Reference:** "Développement d'un outil IA de revue de code et refactoring automatisé"
> **Average Market Budget:** €4,000 – €10,000
> **Typical Daily Rate (TJM):** €600 – €950 / day

---

## ⚡ Overview & Performance Focus

This MVP performs automated static analysis, security vulnerability detection, and AI refactoring suggestions.

### Performance Highlights (Bolt ⚡ Optimizations)
- **Fast Pattern-Matching Scanner**: Uses tokenized regex patterns in micro-batches to detect code smells (O(N) single pass).
- **Client-Side Refactoring Cache**: Stores previous code snippet analysis hashes to return instant review diagnostics.
- **Lightweight Virtualized Diff Preview**: Minimal DOM creation for large refactored code blocks.

---

## 🛠️ Key Features
1. **Multi-Language Support**: Javascript/TypeScript, Python, Go.
2. **Security & Performance Diagnostics**: Identifies nested loops, unhandled promises, potential SQL/XSS exposures.
3. **Automated Refactored Diff**: Generates optimized clean code snippets with performance explanations.

---

## 🚀 How to Run
Open `index.html` directly in any browser or view on GitHub Pages.
