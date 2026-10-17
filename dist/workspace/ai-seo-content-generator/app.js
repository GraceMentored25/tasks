(function() {
  const topicInput = document.getElementById('topicInput');
  const keywordsInput = document.getElementById('keywordsInput');
  const formatSelect = document.getElementById('formatSelect');
  const generateBtn = document.getElementById('generateBtn');
  const outputBox = document.getElementById('outputBox');
  const copyBtn = document.getElementById('copyBtn');
  const wordCountEl = document.getElementById('wordCount');
  const kwDensityEl = document.getElementById('kwDensity');
  const genSpeedEl = document.getElementById('genSpeed');

  // Pre-configured high-performing template generators
  const CONTENT_GENERATORS = {
    blog: (topic, keywords) => `# Ultimate Guide: ${topic}\n\n## Introduction\nIn today's fast-paced digital landscape, mastering ${keywords[0] || 'modern tech'} is critical for success. This guide explores key strategies to leverage ${keywords.join(', ')} effectively.\n\n## 1. Key Principles of ${topic}\nWhen optimizing for ${keywords[1] || 'performance'}, engineers must prioritize latency reduction and efficient rendering. Key focus areas include:\n- Single-pass data structures\n- Proper state memoization\n- Resource preloading\n\n## 2. Advanced ${keywords[0] || 'Architecture'} Insights\nBy combining ${keywords.slice(0,2).join(' and ')}, developers achieve measurable core web vitals improvements.\n\n## Conclusion\nIntegrating ${keywords[0] || 'best practices'} into your workflow ensures maximum performance and user satisfaction.`,

    meta: (topic, keywords) => `[Meta Title]\n${topic} | Top Best Practices & Guide 2026\n\n[Meta Description]\nLearn how to master ${topic} using ${keywords.join(', ')}. Boost your performance and rankings with our actionable guide.\n\n[Primary Keywords Target]\n${keywords.join(', ')}`,

    linkedin: (topic, keywords) => `🚀 How to master ${topic} in 2026!\n\nIf you're working with ${keywords.join(', ')}, performance and developer experience should be top of mind.\n\nHere are 3 key takeaways:\n1️⃣ Prioritize low-overhead algorithms.\n2️⃣ Eliminate redundant re-renders.\n3️⃣ Leverage ${keywords[0] || 'modern patterns'} for speed.\n\nWhat are your thoughts on ${keywords[0] || 'this tech'}? Let's discuss in the comments! 👇\n\n#SEO #Tech #${keywords[0] ? keywords[0].replace(/\s+/g, '') : 'WebDev'}`
  };

  function calculateKwDensity(text, keywords) {
    if (!text || !keywords.length) return 0;
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    if (words.length === 0) return 0;

    let kwHits = 0;
    keywords.forEach(kw => {
      const kwLower = kw.toLowerCase().trim();
      if (!kwLower) return;
      const count = (text.toLowerCase().match(new RegExp(`\\b${kwLower}\\b`, 'g')) || []).length;
      kwHits += count;
    });

    return ((kwHits / words.length) * 100).toFixed(1);
  }

  function generateContent() {
    const topic = topicInput.value.trim() || 'Modern AI Web Applications';
    const keywords = keywordsInput.value.split(',').map(k => k.trim()).filter(Boolean);
    const format = formatSelect.value;

    const startTime = performance.now();
    const fullText = CONTENT_GENERATORS[format](topic, keywords);

    // Stream generation with fast requestAnimationFrame loop to prevent main thread blocking
    outputBox.textContent = '';
    let index = 0;
    generateBtn.disabled = true;
    copyBtn.style.display = 'none';

    function streamToken() {
      const chunk = fullText.slice(index, index + 8);
      outputBox.textContent += chunk;
      index += 8;

      if (index < fullText.length) {
        requestAnimationFrame(streamToken);
      } else {
        const totalTime = performance.now() - startTime;
        const words = fullText.trim().split(/\s+/).length;
        const density = calculateKwDensity(fullText, keywords);

        wordCountEl.textContent = words.toString();
        kwDensityEl.textContent = `${density}%`;
        genSpeedEl.textContent = `${totalTime.toFixed(0)}ms`;

        generateBtn.disabled = false;
        copyBtn.style.display = 'inline-block';
      }
    }

    requestAnimationFrame(streamToken);
  }

  generateBtn.addEventListener('click', generateContent);
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputBox.textContent);
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => { copyBtn.textContent = '📋 Copy Content'; }, 2000);
  });
})();
