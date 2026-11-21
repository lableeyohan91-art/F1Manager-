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
| D-024 | 22/11/2026 | Ordre des phases de ROADMAP.md (0 → 14, jalon A après la phase 9) | Chaque système arrive après ceux dont il dépend ; mémoire v1 avancée en phase 4. |
| D-027 | 22/11/2026 | Attributs notés en entiers de 1 à 20 ; calculs internes en décimal | Lisible (comme Football Manager) et assez fin. |
| D-028 | 22/11/2026 | 1 pas de simulation = 1 semaine (52 par saison) | Assez fin pour les négociations, assez léger pour le téléphone. |
| D-029 | 22/11/2026 | 9 postes individualisés : team principal, directeurs technique, sportif et financier, responsables aérodynamique et conception, 2 pilotes titulaires, 1 pilote de réserve | Couvre direction, technique et sportif. |
| D-030 | 22/11/2026 | 20 Grands Prix par saison, circuits fictifs de 5 types | Ordre de grandeur réaliste. |
| D-031 | 22/11/2026 | Points aux 10 premiers ; barème = paramètre du règlement, modifiable par vote | Permet la politique du règlement. |
| D-032 | 22/11/2026 | Monnaie : euros, en millions (M€) | Simple et parlant. |
| D-033 | 22/11/2026 | Simulation historique : 20 ans par défaut (2007 → 2026), configurable de 0 à 50 | Assez pour des légendes et des rivalités. |
| D-034 | 22/11/2026 | ChatGPT lit tout le dépôt ; il n'écrit que dans `docs/echanges/` (par le porteur ou par pull request relue par Claude Code), jamais dans `src/` | Un seul auteur du code. |
| D-035 | 22/11/2026 | Le dépôt reste public pour l'instant | Nécessaire pour GitHub Pages gratuit ; rien de sensible. À revoir si besoin. |
| D-037 | 22/11/2026 | Jeu en français d'abord ; textes rangés dans des fichiers séparés pour une traduction future | |
| D-038 | 22/11/2026 | Mode « sauvegarde unique » (ironman) proposé en option | Donne du poids aux décisions, sans l'imposer. |
| D-041 | 22/11/2026 | **Remplace D-008.** Le nombre d'écuries est celui du jeu de données initial (11 avec la grille 2026). Il n'est figé nulle part dans le code et peut changer en cours de partie | Demande du porteur : partir de la grille réelle 2026. |
| D-042 | 22/11/2026 | **Modifie D-017.** Départ en 2027 avec une grille inspirée de la F1 2026 (11 écuries, 22 pilotes), noms altérés d'une lettre. Données réalistes : nationalités, âges, niveaux, potentiels, hiérarchie, moyens, motoristes, identité, palmarès. Personnalités et relations privées fictives. Évolution libre ensuite, nouvelles générations procédurales | Décision du porteur. Mise en garde juridique de Claude Code consignée dans [donnees-initiales.md](systemes/donnees-initiales.md) §2. |
| D-047 | 22/11/2026 | Base de données initiale entièrement modifiable (CSV, un fichier par table, aucun nom dans le code) | Demande du porteur. |
| D-048 | 22/11/2026 | La préparation historique ne doit pas modifier la grille voulue au lancement de la carrière en 2027 | Demande du porteur. Mise en œuvre proposée : D-046 (histoire ancrée). |
| D-043 | 22/11/2026 | Le jeu de données « grille 2026 » est un fichier séparé, **non publié** dans ce dépôt public. Le jeu publié contient un jeu de données fictif | Risque juridique (marques, droit à l'image). Emplacement du fichier réel : à définir (dépôt privé conseillé). |
| D-044 | 22/11/2026 | Postes non pilotes (team principal, directeurs dont le directeur sportif, responsables techniques) : **personnes réelles, noms altérés** quand elles sont publiquement connues ; personnages fictifs pour les postes sans titulaire public connu | Choix du porteur, contre l'avis de Claude Code (personnes moins publiques, risque d'image plus fort ; atténué par D-043). |
| D-045 | 22/11/2026 | Circuits réels, noms altérés | Cohérence avec la grille. |
| D-046 | 22/11/2026 | Histoire ancrée pour le départ « grille 2026 » : faits passés lus dans les données depuis 2010, couche humaine simulée par-dessus, marché désactivé. Simulation libre conservée pour les mondes fictifs | Seule façon de garantir la grille de 2027 (D-048). Remplace D-033 pour ce départ. |

---

## Décisions à discuter

Urgence : **AVANT P2** = avant la phase 2 · **AVANT P3** = avant la phase 3 · **PLUS TARD**.

| ID | Urgence | Question | Proposition de Claude Code |
| --- | --- | --- | --- |
| D-025 | AVANT P2 | Liste définitive des traits de personnalité | 9 traits, voir [personnalite.md](systemes/personnalite.md). Accord de principe du porteur le 22/11/2026 ; à finaliser avec ChatGPT, comme prévu |
| D-026 | AVANT P2 | Liste définitive des valeurs et convictions | 7 valeurs, voir [personnalite.md](systemes/personnalite.md). Même statut que D-025 |
| D-036 | AVANT P2 | Nom du championnat fictif et de l'instance dirigeante | ChatGPT propose 10 noms, le porteur choisit |
| D-040 | AVANT P3 | Fourchettes cibles de la phase 3 | Voir [phase-3-saison.md](systemes/phase-3-saison.md), à relire par ChatGPT |
| D-039 | PLUS TARD | Option Carrera : importer les résultats réels de Paddock comme résultats de Grand Prix | Idée à garder, non prioritaire |

---

## Décisions abandonnées ou remplacées

| ID | Date | Décision d'origine | Raison |
| --- | --- | --- | --- |
| D-008 | 22/11/2026 | 10 écuries au départ (21/11/2026) | Remplacée par D-041 : grille réelle 2026 à 11 écuries. |
