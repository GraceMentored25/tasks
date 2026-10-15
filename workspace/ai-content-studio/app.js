// Bolt ⚡ Optimization: Chunked rendering via requestAnimationFrame
document.addEventListener('DOMContentLoaded', () => {
  const topicInput = document.getElementById('topic');
  const toneSelect = document.getElementById('tone');
  const btnGenerate = document.getElementById('btn-generate');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Tab switching logic
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      document.getElementById(`content-${targetTab}`).classList.add('active');
    });
  });

  btnGenerate.addEventListener('click', () => {
    const rawTopic = topicInput.value.trim() || 'Optimisation de la performance web et conversion';
    const tone = toneSelect.value;

    const generated = {
      linkedin: `🚀 [LinkedIn - Ton ${tone.toUpperCase()}]\n\n${rawTopic}\n\n💡 3 enseignements clés :\n1. La vitesse impacte directement le ROI.\n2. L'expérience utilisateur prime toujours.\n3. Des itérations rapides amènent un produit d'exception.\n\n#Tech #IA #Innovation #Productivity`,
      twitter: `🧵 [Twitter Thread - 1/3]\n\n${rawTopic.slice(0, 120)}...\n\n👇 Explications dans la suite du thread.`,
      newsletter: `📧 [Newsletter Brief]\n\nTitre : ${rawTopic.slice(0, 60)}\n\nRésumé :\nDans cet article, nous analysons comment mettre en oeuvre cette stratégie étape par étape avec nos outils IA.`
    };

    // Bolt ⚡ Non-blocking DOM render queue using requestAnimationFrame batching
    const renderQueue = [
      { id: 'content-linkedin', text: generated.linkedin },
      { id: 'content-twitter', text: generated.twitter },
      { id: 'content-newsletter', text: generated.newsletter }
    ];

    function processQueue() {
      if (renderQueue.length === 0) return;
      const item = renderQueue.shift();
      const el = document.getElementById(item.id);
      if (el) el.textContent = item.text;
      requestAnimationFrame(processQueue);
    }

    requestAnimationFrame(processQueue);
  });
});
