# Bolt's Performance Journal

## 2026-10-05 - Asynchronous Non-blocking Processing for In-browser AI Text Pipelines
**Learning:** Running text processing or syntax parsing synchronously on large payloads blocks the browser's main thread and drops render frames, creating noticeable UI stuttering.
**Action:** Use `requestIdleCallback` / chunking microtasks and memoize calculation outputs to guarantee 60fps interaction during live AI previews.
