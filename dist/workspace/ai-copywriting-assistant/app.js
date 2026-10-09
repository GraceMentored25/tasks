/**
 * Bolt ⚡ Performance Optimization Strategy:
 * 1. Template memoization cache (`templateCache`) eliminates redundant text synthesis logic.
 * 2. High-performance non-blocking text streaming using RequestAnimationFrame.
 * 3. O(1) live token estimator for instantaneous feedback without heavy calculations.
 */

// Memoized template cache
const templateCache = new Map();

// Elements
const topicInput = document.getElementById('topic-input');
const channelSelect = document.getElementById('channel-select');
const toneSelect = document.getElementById('tone-select');
const tokenCountEl = document.getElementById('token-count');
const wordCountEl = document.getElementById('word-count');
const btnGenerate = document.getElementById('btn-generate');
const outputBox = document.getElementById('output-box');
const btnCopy = document.getElementById('btn-copy');

// Token & Word Estimation
function updateEstimates() {
  const topic = topicInput.value.trim();
  const wordEst = topic ? topic.split(/\s+/).length * 15 + 120 : 0;
  const tokenEst = Math.round(wordEst * 1.35);

  tokenCountEl.textContent = tokenEst;
  wordCountEl.textContent = wordEst;
}

topicInput.addEventListener('input', updateEstimates);

// High-performance streaming simulator
function generateContentStream() {
  const topic = topicInput.value.trim() || 'AI Innovations in 2026';
  const channel = channelSelect.value;
  const tone = toneSelect.value;
  const cacheKey = `${channel}:${tone}:${topic.toLowerCase()}`;

  let fullText = '';

  if (templateCache.has(cacheKey)) {
    fullText = templateCache.get(cacheKey);
  } else {
    // Construct rich marketing copy template based on channel
    if (channel === 'blog') {
      fullText = `Title: Harnessing ${topic} for Maximum Impact\n\n` +
        `Introduction:\n` +
        `In today's fast-moving landscape, ${topic} has emerged as a key driver of growth and productivity. Organizations leveraging these strategies see up to 3x higher efficiency.\n\n` +
        `Key Takeaways:\n` +
        `• 1. Streamlined Operations: Reduce turnaround time significantly.\n` +
        `• 2. Scalable Workflows: Maintain quality as demand increases.\n` +
        `• 3. Future-Proofing: Stay ahead of industry benchmarks with continuous optimization.\n\n` +
        `Conclusion:\n` +
        `Adopting ${topic} is no longer optional—it is essential for long-term success. Start integrating these best practices today!`;
    } else if (channel === 'linkedin') {
      fullText = `🚀 Unlocking the Power of ${topic}\n\n` +
        `Are you taking full advantage of ${topic}? Here is why industry leaders are making the shift:\n\n` +
        `1️⃣ Faster execution cycles\n` +
        `2️⃣ Smarter automation without sacrificing quality\n` +
        `3️⃣ Measurable ROI within weeks\n\n` +
        `What is your experience with ${topic}? Share your thoughts below! 👇\n\n` +
        `#AI #Innovation #Productivity #TechTrends`;
    } else {
      fullText = `🔥 Transform Your Workflow with ${topic}!\n\n` +
        `Stop wasting hours on manual tasks. Our AI-driven solution helps you master ${topic} in record time.\n\n` +
        `✨ 10x Speed\n` +
        `✨ Zero Setup Friction\n` +
        `✨ 100% Data Security\n\n` +
        `👉 Click below to claim your free trial today!`;
    }

    templateCache.set(cacheKey, fullText);
  }

  // Fast text streaming animation using standard requestAnimationFrame
  outputBox.innerHTML = '';
  let index = 0;
  const chunkSize = 4; // Render multiple characters per tick for smooth 60fps streaming

  function streamChunk() {
    if (index < fullText.length) {
      outputBox.textContent += fullText.slice(index, index + chunkSize);
      index += chunkSize;
      requestAnimationFrame(streamChunk);
    }
  }

  requestAnimationFrame(streamChunk);
}

btnGenerate.addEventListener('click', generateContentStream);

btnCopy.addEventListener('click', () => {
  const text = outputBox.textContent;
  if (!text || text.includes('Enter a topic')) return;

  navigator.clipboard.writeText(text).then(() => {
    const original = btnCopy.textContent;
    btnCopy.textContent = 'Copied!';
    setTimeout(() => btnCopy.textContent = original, 1500);
  });
});
