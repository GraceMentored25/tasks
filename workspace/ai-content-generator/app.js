// Performance optimization by Bolt ⚡: Memoize template resolution and avoid layout reflows
const templateMemoCache = new Map();

const genForm = document.getElementById('gen-form');
const topicInput = document.getElementById('topic-input');
const formatSelect = document.getElementById('format-select');
const toneSelect = document.getElementById('tone-select');
const outputBox = document.getElementById('output-box');
const wordCountEl = document.getElementById('word-count');
const readTimeEl = document.getElementById('read-time');
const copyBtn = document.getElementById('copy-btn');

function generateTemplateContent(topic, format, tone) {
  const cacheKey = `${format}:${tone}:${topic.toLowerCase().trim()}`;
  if (templateMemoCache.has(cacheKey)) {
    return templateMemoCache.get(cacheKey);
  }

  let result = '';
  if (format === 'linkedin') {
    result = `🚀 ${topic.toUpperCase()} : Pourquoi c'est le moment d'agir !\n\nEn tant que professionnel, maîtriser ${topic} est désormais indispensable.\n\n3 points clés à retenir :\n1️⃣ Gain d'efficacité mesurable.\n2️⃣ Automatisation des tâches récurrentes.\n3️⃣ RHO maximal sur vos opérations.\n\n👇 Qu'en pensez-vous ? Réagissez en commentaire !`;
  } else if (format === 'blog') {
    result = `# Guide Complet : ${topic}\n\n## Introduction\nDans un monde en constante évolution, ${topic} transforme les pratiques industrielles et commerciales.\n\n## Les Avantages Majeurs\nAdopté par les leaders du marché, ce concept permet d'optimiser la productivité globale et d'accélérer les flux de travail.\n\n## Conclusion & Prochaines Étapes\nIntégrer ${topic} dès aujourd'hui vous donne une longueur d'avance concurrentielle.`;
  } else if (format === 'newsletter') {
    result = `Objet : Tout ce que vous devez savoir sur ${topic} 💡\n\nBonjour,\n\nCette semaine, nous décryptons un sujet essentiel : ${topic}.\n\nDécouvrez nos conseils exclusifs et cas d'usage concrets dans notre article complet.\n\nBonne lecture,\nL'équipe Innovation`;
  } else {
    result = `🔥 Boostez vos résultats avec ${topic} !\n- Solution IA N°1 du marché.\n- Essai gratuit 14 jours sans engagement.\n👉 Cliquez ici pour découvrir.`;
  }

  templateMemoCache.set(cacheKey, result);
  return result;
}

genForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const topic = topicInput.value.trim();
  const format = formatSelect.value;
  const tone = toneSelect.value;

  if (!topic) return;

  const content = generateTemplateContent(topic, format, tone);

  // Fast DOM mutation
  outputBox.textContent = content;

  // Compute stats in O(N) single pass
  const words = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  wordCountEl.textContent = words;
  readTimeEl.textContent = `${readTime} min`;
});

copyBtn.addEventListener('click', () => {
  const text = outputBox.textContent;
  if (!text || text.startsWith('Renseignez')) return;

  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = 'Copié !';
    setTimeout(() => { copyBtn.textContent = 'Copier'; }, 1500);
  });
});
