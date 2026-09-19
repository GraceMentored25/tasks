// Bolt ⚡ Optimization: RAF Streaming Content Generator
// Uses requestAnimationFrame for zero-jank frame-budgeted streaming output rendering.

const TEMPLATES = {
  linkedin: (topic) => `🚀 Révolutionnez votre quotidien avec l'IA !

Aujourd'hui, nous sommes fiers d'annoncer une étape majeure : ${topic}.

Pourquoi c'est un game-changer ?
1️⃣ Gain de temps massif (jusqu'à 10h par semaine)
2️⃣ Précision et qualité constante
3️⃣ Intégration en moins de 5 minutes

💡 Que pensez-vous de cette avancée ? Dites-le moi en commentaire !

#Innovation #IA #Productivite #Tech`,

  email: (topic) => `Objet: Automatisez votre croissance dès aujourd'hui !

Bonjour,

Et si vous pouviez diviser par 2 le temps passé sur vos tâches répétitives ?

C'est exactement l'objectif de notre solution : ${topic}.

Découvrez comment nos clients améliorent leurs performances de +40% dès le premier mois.

👉 Obtenir mon accès prioritaire : https://example.com/demo

À très vite,
L'équipe Innovation`,

  ad: (topic) => `🔥 NE PERDEZ PLUS DE TEMPS !

Découvrez la nouvelle référence : ${topic}.
Simple, rapide, ultra-performant.

[ Essayer gratuitement pendant 14 jours ]`
};

document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-btn');
  const contentTypeEl = document.getElementById('content-type');
  const topicEl = document.getElementById('topic');
  const outputBox = document.getElementById('output-box');
  const perfMetrics = document.getElementById('perf-metrics');

  let animationFrameId = null;

  generateBtn.addEventListener('click', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    const type = contentTypeEl.value;
    const topic = topicEl.value || 'votre produit';

    const fullText = TEMPLATES[type] ? TEMPLATES[type](topic) : TEMPLATES.linkedin(topic);

    outputBox.textContent = '';
    let index = 0;
    const t0 = performance.now();

    function streamChar() {
      // Stream 3 characters per frame for natural typing feel at 60fps
      if (index < fullText.length) {
        outputBox.textContent += fullText.slice(index, index + 3);
        index += 3;
        animationFrameId = requestAnimationFrame(streamChar);
      } else {
        const totalDuration = (performance.now() - t0).toFixed(2);
        perfMetrics.textContent = `Génération terminée en ${totalDuration}ms (Streaming 60 FPS requestAnimationFrame ⚡)`;
      }
    }

    animationFrameId = requestAnimationFrame(streamChar);
  });
});
