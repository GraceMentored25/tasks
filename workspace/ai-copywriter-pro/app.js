// Bolt Optimization: In-memory cache for generation queries to bypass redundant calculations
const generationCache = new Map();

// Debounce helper to prevent main-thread layout thrashing during rapid user input
function debounce(fn, delayMs = 150) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const topicInput = document.getElementById('topic');
  const audienceInput = document.getElementById('target-audience');
  const formatSelect = document.getElementById('format');
  const generateBtn = document.getElementById('generate-btn');
  const outputBox = document.getElementById('output-box');
  const perfMetrics = document.getElementById('perf-metrics');

  function generateCopy() {
    const startTime = performance.now();
    const topic = topicInput.value.trim() || 'Product';
    const audience = audienceInput.value.trim() || 'General Audience';
    const format = formatSelect.value;
    const cacheKey = `${topic}::${audience}::${format}`;

    if (generationCache.has(cacheKey)) {
      const cached = generationCache.get(cacheKey);
      const endTime = performance.now();
      renderOutput(cached, (endTime - startTime).toFixed(2), true);
      return;
    }

    let generatedText = '';
    if (format === 'landing') {
      generatedText = `🚀 HERO TITLE: Build Faster with ${topic}\n\n` +
        `Subheadline: Designed specifically for ${audience}. Automate your workflows and eliminate bottlenecks.\n\n` +
        `✨ Key Features:\n` +
        `• Ultra-low latency response processing\n` +
        `• Built-in security & enterprise guardrails\n` +
        `• Seamless API integrations out of the box`;
    } else if (format === 'email') {
      generatedText = `Subject: Quick question regarding ${topic} for ${audience}\n\n` +
        `Hi team,\n\n` +
        `I noticed your team is working on scaling infrastructure. ${topic} helps ${audience} reduce execution cycle time by over 40%.\n\n` +
        `Would you be open to a 5-minute brief review this week?`;
    } else if (format === 'social') {
      generatedText = `💡 3 lessons every team learns when deploying ${topic}:\n\n` +
        `1. High-speed performance is non-negotiable for ${audience}.\n` +
        `2. Automating manual copy generation saves 10+ hours per sprint.\n` +
        `3. Quality and speed can coexist when using optimized AI workflows.`;
    } else {
      generatedText = `🔥 Stop losing conversions. Upgrade your strategy with ${topic}.\n` +
        `Engineered for ${audience}. Try it today with zero setup friction.`;
    }

    generationCache.set(cacheKey, generatedText);
    const endTime = performance.now();
    renderOutput(generatedText, (endTime - startTime).toFixed(2), false);
  }

  // RAF-batched render function for 60fps frame timing
  function renderOutput(text, latencyMs, isCached) {
    requestAnimationFrame(() => {
      outputBox.innerText = text;
      perfMetrics.innerText = `Latency: ${latencyMs}ms (${isCached ? 'Cache Hit' : 'Computed'})`;
    });
  }

  generateBtn.addEventListener('click', generateCopy);
  topicInput.addEventListener('input', debounce(generateCopy, 200));
  audienceInput.addEventListener('input', debounce(generateCopy, 200));
  formatSelect.addEventListener('change', generateCopy);

  // Initial trigger
  generateCopy();
});
