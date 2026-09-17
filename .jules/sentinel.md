# Sentinel's Journal

## 2026-09-15 - Client-side AI Security Patterns
**Learning:** Web apps processing user inputs locally must enforce strict DOM sanitization (escaping HTML special characters) before dynamic innerHTML replacement to prevent DOM-based XSS, alongside max character boundaries to prevent regex Denial of Service (ReDoS).
**Action:** Sanitize all user-controlled input prior to DOM insertion and enforce maximum input length bounds.
