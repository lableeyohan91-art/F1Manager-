# Journal des décisions

Chaque décision a un identifiant permanent (D-xxx), une date, une raison et un statut :

- **VALIDÉE** : tranchée par le porteur du projet. Ne se rouvre qu'explicitement.
- **À DISCUTER** : proposition en attente. Le niveau d'urgence indique si elle bloque la phase suivante.
- **ABANDONNÉE** : écartée, la raison reste notée.

Une décision qui en remplace une autre le dit (« remplace D-xxx »).

---

## Décisions validées

| ID | Date | Décision | Raison |
| --- | --- | --- | --- |
| D-001 | 21/11/2026 | TypeScript + Preact + Vite | Les types documentent le code pour toute l'équipe. Preact est léger sur mobile et bien connu des deux IA. |
| D-002 | 21/11/2026 | Application web installable (PWA), mobile d'abord | Rien à installer, Android immédiat. Emballage Capacitor possible plus tard pour les magasins d'applications. |
| D-003 | 21/11/2026 | Hébergement sur GitHub Pages | Gratuit, HTTPS, construction automatique par GitHub Actions. |
| D-004 | 21/11/2026 | Moteur de simulation indépendant de l'interface | Tests sans écran, simulations longues, interface remplaçable. |
| D-005 | 21/11/2026 | Simulation déterministe, hasard à graine, un flux par système | Reproductibilité, débogage, tests contrefactuels. |
| D-006 | 21/11/2026 | Sauvegardes locales versionnées, avec migrations | Les vieilles parties restent lisibles quand le jeu évolue. |
| D-007 | 21/11/2026 | Modèle de résultat de course abstrait avant le vrai moteur de course | Sans résultats, le paddock ne peut pas vivre (primes, sponsors, moral). |
| D-008 | 21/11/2026 | 10 écuries au départ, grille extensible plus tard | Équilibrage plus simple. Le nombre d'écuries n'est figé nulle part dans le code. |
| D-009 | 21/11/2026 | 9 postes individualisés par écurie au départ, puis enrichissement progressif | Les autres employés sont regroupés en départements, dégroupés plus tard. Liste exacte : D-029. |
| D-010 | 21/11/2026 | Simulation autonome sur plusieurs décennies, mode observateur | Le monde ne dépend pas du joueur. Le mode observateur sert aussi d'outil de test. |
| D-011 | 21/11/2026 | Agents de pilotes individualisés | Négociations plus riches, relations durables. |
| D-012 | 21/11/2026 | Vote des réglementations et relations politiques entre écuries | Repris de Motorsport Manager, source d'alliances et de rivalités. |
| D-013 | 21/11/2026 | Caractéristiques partiellement cachées (connaissance incertaine) | Recrutement à la Football Manager. La difficulté peut jouer sur ce brouillard, sans triche. |
| D-014 | 21/11/2026 | Tests contrefactuels pour prouver que les choix comptent | Mesure objective des conséquences. |
| D-015 | 21/11/2026 | Explication « Pourquoi ? » sur les réactions importantes | Comprendre sans voir les valeurs cachées. |
| D-016 | 21/11/2026 | Aucune API d'IA externe obligatoire | Le jeu fonctionne hors ligne, sans coût ni dépendance. |
| D-017 | 21/11/2026 | Première saison jouable : 2027. Univers fictif, facilement modifiable. Nom du jeu choisi plus tard | Le nom de travail « F1Manager- » n'est utilisé que pour le dépôt. |
| D-018 | 21/11/2026 | Mémoire v1 disponible dès les premiers contrats (phase 4), mémoire résiduelle retenue | La mémoire est l'identité du jeu : elle doit être testée tôt. |
| D-019 | 21/11/2026 | Groupes sociaux émergents (jamais prédéfinis), avec effets d'influence | Profondeur humaine à la Football Manager. Conception en phase 8. |
| D-020 | 21/11/2026 | Personnage en 5 couches : personnalité, valeurs, compétences, aspirations, état émotionnel | Permet des décisions guidées par des convictions, contraires à l'intérêt immédiat. Traits définitifs : D-025 et D-026. |
| D-021 | 21/11/2026 | Le joueur démarre dans un monde déjà historique (simulation préalable, durée configurable) | Des personnages qui se connaissent et partagent un passé dès la première partie. |
| D-022 | 21/11/2026 | Interface de diagnostic tôt (phase 2) et bac à sable d'interactions (phase 4) | Un monde statistiquement crédible n'est pas forcément intéressant : il faut l'éprouver vite. |
| D-023 | 21/11/2026 | Claude Code est le développeur principal. ChatGPT intervient en conception, contenu, équilibrage, direction artistique et relecture. Le porteur arbitre | Un seul auteur du code, pour éviter les contradictions. Modalités d'accès de ChatGPT : D-034. |

---

## Décisions à discuter

Urgence : **BLOQUANT P1** = à trancher avant la phase 1 · **AVANT P2** = avant la phase 2 · **PLUS TARD**.

| ID | Urgence | Question | Proposition de Claude Code |
| --- | --- | --- | --- |
| D-024 | BLOQUANT P1 | Ordre révisé des phases (voir ROADMAP.md) | Adopter l'ordre 0 → 14 avec le jalon A après la phase 9 |
| D-028 | BLOQUANT P1 | Pas de temps de la simulation | 1 pas = 1 semaine (52 par saison). Les négociations se règlent en quelques semaines de jeu. |
| D-035 | BLOQUANT P1 | Dépôt public ou privé ? Il est **actuellement public** : tout le monde peut lire la conception. | Rester public tant qu'il n'y a rien de sensible : GitHub Pages gratuit l'exige pour un compte gratuit. Sinon passer en privé et héberger ailleurs. |
| D-034 | BLOQUANT P1 | Comment ChatGPT intervient-il sur le dépôt ? | Lecture de tout le dépôt. Écriture uniquement dans `docs/echanges/`, par le porteur ou par demande de fusion (pull request) relue par Claude Code. Jamais dans `src/`. |
| D-025 | AVANT P2 | Liste définitive des traits de personnalité | 9 traits, voir [personnalite.md](systemes/personnalite.md) |
| D-026 | AVANT P2 | Liste définitive des valeurs et convictions | 7 valeurs, voir [personnalite.md](systemes/personnalite.md) |
| D-027 | AVANT P2 | Échelle des attributs | Entiers de 1 à 20, comme Football Manager. Lisible, et assez fin. Les calculs internes passent en décimal. |
| D-029 | AVANT P2 | Les 9 postes individualisés | Team principal, directeur technique, directeur sportif, directeur financier, responsable aérodynamique, responsable conception, pilote titulaire ×2, pilote de réserve. |
| D-036 | AVANT P2 | Nom du championnat fictif et de l'instance dirigeante | À proposer par ChatGPT (une liste de 10 noms), choix du porteur |
| D-032 | AVANT P2 | Monnaie | Euros, en millions (M€). Simple et parlant, aucune marque en jeu. |
| D-037 | AVANT P2 | Langue du jeu | Français d'abord. Tous les textes sont rangés dans des fichiers séparés, pour pouvoir traduire plus tard. |
| D-030 | AVANT P3 | Nombre de Grands Prix par saison | 20, avec des circuits fictifs de 5 types (rapide, lent et sinueux, mixte, urbain, altitude) |
| D-031 | AVANT P3 | Barème de points | Points aux 10 premiers. Le barème est un paramètre du règlement, qui pourra changer par vote. |
| D-033 | AVANT P9 | Durée par défaut de la simulation historique | 20 ans (de 2007 à 2026), configurable de 0 à 50 |
| D-038 | PLUS TARD | Faut-il un mode « sauvegarde unique » (ironman) ? | Oui, en option |
| D-039 | PLUS TARD | Option Carrera : importer les résultats réels de Paddock comme résultats de Grand Prix | Idée à garder, non prioritaire |
