// ⚡ Bolt Performance Optimization: In-memory O(1) Cache map
const seoCache = new Map();

document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url-input');
  const keywordsInput = document.getElementById('keywords-input');
  const toneSelect = document.getElementById('tone-select');
  const generateBtn = document.getElementById('generate-btn');
  const speedBadge = document.getElementById('speed-badge');
  const perfMetrics = document.getElementById('perf-metrics');

  const serpUrl = document.getElementById('serp-url');
  const serpTitle = document.getElementById('serp-title');
  const serpDesc = document.getElementById('serp-desc');
  const titleLength = document.getElementById('title-length');
  const descLength = document.getElementById('desc-length');

  // Debounce utility to prevent high-frequency DOM triggers
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // ⚡ Non-blocking text streaming using requestAnimationFrame
  function streamText(element, fullText, callback) {
    let index = 0;
    element.textContent = '';

    function step() {
      if (index < fullText.length) {
        element.textContent += fullText[index];
        index++;
        requestAnimationFrame(step);
      } else if (callback) {
        callback();
      }
    }
    requestAnimationFrame(step);
  }

  function updateMetrics(title, desc) {
    titleLength.textContent = `${title.length} / 60 car.`;
    descLength.textContent = `${desc.length} / 160 car.`;
  }

  function generateSEO() {
    const url = urlInput.value.trim() || 'https://example.com/page';
    const keywords = keywordsInput.value.trim() || 'intelligence artificielle';
    const tone = toneSelect.value;

    const cacheKey = `${url}|${keywords}|${tone}`;
    const startTime = performance.now();

    serpUrl.textContent = url;

    // ⚡ Fast path: Check O(1)Cache
    if (seoCache.has(cacheKey)) {
      const cached = seoCache.get(cacheKey);
      serpTitle.textContent = cached.title;
      serpDesc.textContent = cached.description;
      updateMetrics(cached.title, cached.description);

      const duration = (performance.now() - startTime).toFixed(2);
      perfMetrics.textContent = `⚡ Servit du cache en ${duration}ms`;
      speedBadge.classList.remove('hidden');
      return;
    }

    speedBadge.classList.add('hidden');
    perfMetrics.textContent = `⚡ Traitement en cours...`;

    // Simulated LLM SEO Generation
    const primaryKeyword = keywords.split(',')[0].trim();
    const generatedTitle = `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} : Solution IA Performante & Rapide`;
    const generatedDesc = `Découvrez comment optimiser votre flux grâce à notre outil d'IA spécialiste en ${keywords}. Obtenez des résultats mesurables instantanément.`;

    // Store in cache
    seoCache.set(cacheKey, { title: generatedTitle, description: generatedDesc });

    // Stream Title then Description using rAF
    streamText(serpTitle, generatedTitle, () => {
      streamText(serpDesc, generatedDesc, () => {
        updateMetrics(generatedTitle, generatedDesc);
        const duration = (performance.now() - startTime).toFixed(2);
        perfMetrics.textContent = `⚡ Généré en ${duration}ms`;
      });
    });
  }

  generateBtn.addEventListener('click', generateSEO);

  // Real-time debounced URL sync
  urlInput.addEventListener('input', debounce(() => {
    if (urlInput.value.trim()) {
      serpUrl.textContent = urlInput.value.trim();
    }
  }, 150));
});
