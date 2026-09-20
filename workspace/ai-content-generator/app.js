/**
 * Multi-Platform AI Content Generator
 * Bolt Optimizations: Pre-compiled templates, Memoized generation cache, Fast String Substitution
 */

// In-Memory Generation Cache
const contentCache = new Map();

const selectChannel = document.getElementById('select-channel');
const selectTone = document.getElementById('select-tone');
const inputTopic = document.getElementById('input-topic');
const btnGenerate = document.getElementById('btn-generate');
const btnCopy = document.getElementById('btn-copy');
const outputContent = document.getElementById('output-content');
const outputBadge = document.getElementById('output-badge');
const outputStats = document.getElementById('output-stats');
const genTime = document.getElementById('gen-time');

const TEMPLATES = {
  linkedin: {
    label: 'LinkedIn Post',
    professional: (topic) => `🚀 **Pourquoi l'innovation sur "${topic}" est devenue incontournable**\n\nAu cours des derniers mois, la transformation numérique a redéfini nos priorités. En travaillant sur ${topic}, nous avons constaté 3 leviers clés :\n\n1. Gain de temps significatif pour les équipes\n2. Réduction des erreurs manuelles\n3. Amélioration directe de la satisfaction client\n\n💡 Et vous, comment intégrez-vous ${topic} dans vos processus ? Discutons-en en commentaire.\n\n#Innovation #Tech #Business #Productivite`,
    enthusiastic: (topic) => `🔥 **Incroyable avancée autour de : ${topic} !**\n\nJe suis super enthousiaste de partager ces résultats ! Nous venons de tester une approche novatrice concernant ${topic}.\n\nLes premiers retours dépassent nos attentes ! 🎉\n\nQuel est votre avis sur cette tendance ? Dites-moi tout ci-dessous ! 👇\n\n#IA #FuturDuTravail #Growth`,
  },
  twitter: {
    label: 'Thread Twitter',
    professional: (topic) => `1/5 🧵 Tout ce qu'il faut savoir sur ${topic} en 2026.\n\n2/5 Premier constat : les organisations qui adoptent ${topic} multiplient par 2 leur efficacité opérationnelle.\n\n3/5 Le secret réside dans l'automatisation intelligente des tâches répétitives.\n\n4/5 3 étapes simples pour débuter :\n- Analyser les besoins\n- Tester un MVP\n- Mesurer le ROI\n\n5/5 Vous avez aimé ce thread ? Retweetez le 1er tweet ! 🔄`,
    enthusiastic: (topic) => `1/3 ⚡ Flash Info : ${topic} révolutionne le secteur !\n\n2/3 Si vous voulez gagner un temps précieux aujourd'hui, concentrez-vous sur ${topic}.\n\n3/3 Abonnez-vous pour plus de tips quotidiens ! 🚀`,
  },
  email: {
    label: 'Email de Prospection',
    professional: (topic) => `Objet : Question concernant ${topic} chez votre entreprise\n\nBonjour,\n\nJ'ai remarqué votre travail récent et je me demandais comment vous traitiez la problématique de ${topic}.\n\nNotre solution permet de simplifier ce processus et d'économiser jusqu'à 10h par semaine.\n\nAuriez-vous 5 minutes ce jeudi pour un rapide échange téléphonique ?\n\nBien cordialement,`,
    enthusiastic: (topic) => `Objet : Boostez vos résultats avec ${topic} ! 🚀\n\nHello,\n\nMarre d'accorder trop de temps à ${topic} ? Nous avons développé une méthode clé en main pour vous libérer l'esprit.\n\nOn s'organise un café virtuel cette semaine ?\n\nÀ très vite !`,
  },
  blog: {
    label: 'Plan d\'Article de Blog',
    professional: (topic) => `📌 **Titre d'article suggéré : Guide Complet 2026 : Maîtriser ${topic}**\n\n**Introduction**\n- Contexte et enjeux autour de ${topic}.\n\n**Partie 1 : Pourquoi ${topic} est un enjeu stratégique**\n- Analyse du marché et chiffres clés.\n\n**Partie 2 : Guide pas-à-pas d'implémentation**\n- Les meilleures pratiques à adopter.\n\n**Conclusion & Call To Action**\n- Résumé des étapes et invitation à l'essai.`,
    enthusiastic: (topic) => `📌 **Titre : Comment ${topic} va métamorphoser votre quotidien**\n\n**1. La révolution ${topic} est en marche**\n**2. 5 cas d'usage concrets**\n**3. Passez à l'action dès aujourd'hui**`,
  }
};

/**
 * Generate content with caching
 * Bolt Optimization: In-memory Map lookup
 */
function generateContent(channel, tone, topic) {
  const cacheKey = `${channel}_${tone}_${topic}`;
  if (contentCache.has(cacheKey)) {
    return { text: contentCache.get(cacheKey), cached: true };
  }

  const channelObj = TEMPLATES[channel] || TEMPLATES.linkedin;
  const generatorFn = channelObj[tone] || channelObj.professional || channelObj.enthusiastic;

  const text = generatorFn(topic || 'votre projet');
  contentCache.set(cacheKey, text);
  return { text, cached: false };
}

function updateOutput() {
  const channel = selectChannel.value;
  const tone = selectTone.value;
  const topic = inputTopic.value.trim() || 'l\'automatisation IA';

  const t0 = performance.now();
  const { text, cached } = generateContent(channel, tone, topic);
  const t1 = performance.now();

  outputBadge.textContent = TEMPLATES[channel]?.label || 'Contenu';
  outputContent.textContent = text;

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  outputStats.textContent = `${wordCount} mots | ${charCount} caractères`;

  genTime.textContent = `${(t1 - t0).toFixed(1)}ms ${cached ? '(Cache ⚡)' : ''}`;
}

btnGenerate.addEventListener('click', updateOutput);

selectChannel.addEventListener('change', () => {
  if (inputTopic.value.trim()) updateOutput();
});

selectTone.addEventListener('change', () => {
  if (inputTopic.value.trim()) updateOutput();
});

btnCopy.addEventListener('click', () => {
  const text = outputContent.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    btnCopy.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> Copié !';
    setTimeout(() => {
      btnCopy.innerHTML = '<i class="fa-regular fa-copy"></i> Copier';
    }, 2000);
  });
});
