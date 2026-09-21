# Bolt ⚡ Performance Journal

## 2026-09-21 - Client-side Generation Response Caching & UI Frame Batching
**Learning:** Instant response simulation using linear setTimeout loops locks the UI thread and forces redundant string manipulation. Using requestAnimationFrame coupled with Map-based query caching reduces CPU overhead during text streaming and delivers immediate non-blocking responses for repeated queries.
**Action:** Always wrap streaming text render updates inside requestAnimationFrame ticks and check an in-memory Map before executing simulated LLM calls.
