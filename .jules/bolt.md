# Bolt's Journal - Performance & Speed Optimizations

## 2025-05-10 - Pure JS DOM Benchmarks & Static MVP Rendering
**Learning:** For static web apps and client-side AI MVP demos, avoiding large heavy runtime frameworks eliminates cold start lag and bundle overhead. Using requestAnimationFrame batching and debounced inputs prevents input lag during real-time preview generations.
**Action:** Always batch DOM updates and debounce user inputs in UI handlers to ensure 60fps performance across low-tier client devices.
