# Assistant IA d'Analyse de Contrats & Documents Juridiques

## Référence de l'offre
* **Source:** Malt - *"Développement Assistant IA Analyse de Contrats Juridiques & Devis"*
* **Fourchette de prix moyenne:** 1 500 € - 3 500 €

## Description de l'application
Cette application Web MVP permet d'analyser instantanément des contrats, devis et documents légaux.
Elle extrait automatiquement :
1. Les risques majeurs (clauses pénales, résiliation, responsabilité)
2. Les résumés synthétiques par section
3. Les obligations contractuelles et échéances
4. Les recommandations juridiques personnalisées

## Fonctionnalités & Optimisations
- **Performance Client (Bolt ⚡):** Moteur d'analyse avec mise en cache memoized des sous-chaînes de texte et algorithme d'extraction de risques O(N) sans blocage du thread principal.
- **Exportation rapide:** Génération de rapport aux formats TXT / JSON instantanée.
