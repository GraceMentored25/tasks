## 2025-05-20 - Memoization & Asynchronous DOM Chunking in Pure JS MVPs
**Learning:** Pure JS MVPs handling high-frequency user interactions or streaming text simulation can quickly trigger main-thread layout thrashing if DOM manipulation isn't debounced or batched using `requestAnimationFrame`. Additionally, expensive similarity and score calculation loops should be cached/memoized using an in-memory Map lookup.
**Action:** Use debouncing for inputs, event delegation on parent containers, and `requestAnimationFrame` chunking for text streaming in vanilla JS web applications.
