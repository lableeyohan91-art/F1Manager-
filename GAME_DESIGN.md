# Game design — principes fondamentaux

> Statut : **VALIDÉ** dans ses grandes lignes (21/11/2026). Les points marqués *[À DISCUTER]* restent ouverts. Leur suivi se fait dans [docs/decisions.md](docs/decisions.md).

## 1. Vision

Une simulation de management d'écurie de course, jouable sur téléphone, assez profonde pour tenir des carrières de 20 à 50 saisons.

Le joueur incarne un directeur d'écurie, comme l'entraîneur dans Football Manager. Il arrive dans un paddock qui existe déjà, avec son histoire, ses légendes et ses rancunes. Il y écrit sa propre histoire par ses décisions.

**Inspirations :**

| Jeu | Ce qu'on en retient | Ce qu'on n'en retient pas |
| --- | --- | --- |
| F1 Manager 2024 | Développement technique (recherche → conception → fabrication), installations, finances, plafond budgétaire, personnel spécialisé | Graphismes 3D, licence officielle |
| Motorsport Manager / MM3 | Courses en 2D lisibles, ergonomie mobile, politique et votes du règlement, compromis performance/fiabilité, affinité mécanicien–pilote | Système de réglage par cartes |
| Football Manager | Profondeur humaine, personnalités cachées, recrutement à connaissance incertaine, carrière du manager, monde autonome | Microgestion de l'entraînement au quotidien |

> On reprend des **mécaniques** de jeu. On ne copie ni noms, ni écrans, ni textes, ni contenus.

## 2. Principes fondamentaux

1. **La profondeur prime sur la quantité.** Un système simple qui marche vaut mieux qu'un système complet à moitié fini.
2. **Le monde vit sans le joueur.** Écuries, personnes et organisations agissent pour leurs propres raisons. Le mode observateur doit produire une histoire crédible sans aucune intervention.
3. **Les mêmes règles pour tous.** L'IA n'a aucun bonus caché. Elle utilise les mêmes commandes que le joueur.
4. **L'émergence plutôt que le scénario.** Aucune chaîne d'événements n'est écrite à l'avance. Les histoires naissent de l'enchaînement de systèmes génériques.
5. **Un hasard causé.** Le hasard existe, mais ses probabilités viennent de causes identifiables (fatigue, compétence, pression). Il ne rend jamais les décisions inutiles.
6. **Le monde a une mémoire** (§3).
7. **Pas de réponse toujours optimale.** La bonne décision dépend du contexte, des personnes et de leur histoire.
8. **Comprendre sans tout voir.** Le joueur ne voit pas les valeurs cachées, mais il peut toujours comprendre les principales raisons d'une réaction (bouton « Pourquoi ? »).
9. **Pas de pay-to-win.** Aucun avantage ne s'achète.
10. **Durable.** Le jeu reste fluide et ses sauvegardes restent de taille raisonnable après 50 saisons.
11. **Compétitif.** Plusieurs écuries se battent pour le titre, la hiérarchie bouge, l'IA reste un adversaire redoutable sur des décennies, sans tricher (§7).

## 3. La mémoire du monde

C'est l'identité du jeu.

- **Mémoire individuelle.** Chaque personnage retient les événements qui l'ont marqué : promesse tenue ou rompue, soutien dans une période difficile, licenciement, négociation conflictuelle, consigne d'équipe… Il les garde quand il change d'écurie.
- **Mémoire résiduelle.** Quand un souvenir précis s'efface, il laisse une empreinte durable dans la relation : une méfiance ou une gratitude diffuse.
- **Perception individuelle.** Un même événement est vécu différemment selon la personnalité, les valeurs et la relation existante. Certains pardonnent vite, d'autres jamais.
- **Personne n'est omniscient.** On ne réagit qu'à ce que l'on sait. L'information circule selon sa visibilité (publique, privée, confidentielle) et selon les réseaux de relations.
- **Promesses et engagements.** Une promesse est un objet du jeu, vérifié automatiquement à son échéance.
- **Réputation construite par les actes.** Le joueur devient « formateur de jeunes », « impitoyable » ou « parole non tenue » à cause de ce qu'il a réellement fait, jamais par un choix de profil.
- **Mémoire collective.** Les écuries ont leurs légendes, leurs rivalités historiques et leurs périodes noires. Après 20 saisons, on peut consulter ce qui a façonné le paddock.
- **Conséquences en cascade.** Une décision peut déclencher une suite d'événements cohérents (exemple de référence : le refus d'augmentation au directeur technique, qui part avec une partie de son équipe). Cette suite n'est jamais écrite à l'avance.

Conception détaillée : [docs/systemes/memoire.md](docs/systemes/memoire.md).

## 4. Les personnages

Chaque personnage important est décrit par **cinq couches distinctes** (voir [docs/systemes/personnalite.md](docs/systemes/personnalite.md)) :

1. **Personnalité** : la manière d'être. Stable, cachée.
2. **Valeurs et convictions** : ce qui compte pour lui. Elles peuvent le pousser à agir **contre son intérêt immédiat** (rester fidèle, refuser une écurie dominante, préférer un projet à un salaire).
3. **Compétences** : ce qu'il sait faire, par métier.
4. **Aspirations** : ce qu'il veut devenir ou accomplir.
5. **État émotionnel** : comment il va en ce moment (moral, stress, motivation). Calculé, jamais saisi.

À cela s'ajoutent ses **souvenirs**, ses **relations** et son **historique de carrière**.

## 5. Groupes sociaux et influence

Des groupes **émergent** des relations, des expériences communes et des personnalités : anciens collaborateurs, protégés d'un directeur, partisans d'une même philosophie, clan autour d'un pilote, opposants à la direction. **Aucun groupe n'est prédéfini.**

Le départ d'une personne influente peut entraîner plusieurs collaborateurs. Un groupe opposé à la direction pèse sur le moral et la productivité.

## 6. Un paddock qui a déjà une histoire

**Départ par défaut : grille inspirée de la F1 2026** (11 écuries, noms altérés d'une lettre, données réalistes). Les faits passés (palmarès, carrières) viennent des données. La couche humaine (souvenirs, relations, groupes) est simulée par-dessus ce passé, sans modifier la grille de 2027 : c'est l'**histoire ancrée** ([donnees-initiales.md](docs/systemes/donnees-initiales.md)). Pour un monde entièrement fictif : 

Le joueur ne débarque pas dans un monde vierge. Une **simulation historique préalable**, de durée configurable, génère les anciens champions, palmarès, transferts, rivalités, collaborations passées, souvenirs et réputations. Au départ de la partie, des personnages se connaissent déjà et partagent une histoire.

## 7. Compétitivité du championnat (orientation fondamentale, D-081)

**Réalisme des mécaniques, compétitivité des championnats, importance des décisions, difficulté durable.** Le but : un jeu auquel on a encore envie de jouer après 30 saisons.

- On s'inspire du réalisme de la F1, mais **sans reproduire systématiquement ses longues dominations**. Le championnat visé est un peu plus équilibré que la vraie F1.
- **Hiérarchie dynamique** : chaque saison peut raconter une histoire différente. Une grande écurie peut décliner par ses erreurs ; une petite peut monter, **y compris contrôlée par l'IA**. Remontées, reconstructions, concepts ratés, transferts qui changent l'équilibre, pilotes qui transcendent leur voiture, rivalités sur plusieurs saisons.
- **L'équilibre vient de systèmes cohérents** : plafond budgétaire, restrictions aérodynamiques selon le classement, rendements décroissants, incertitude des projets, règlement, vieillissement, transferts, perte d'expertise, stratégies, circuits, pneus, intelligence des adversaires, anticipation de la saison suivante.
- **Refusés** : bonus cachés pour l'IA et pénalités artificielles pour les équipes dominantes. Les règles qui freinent les meilleurs (plafond, restrictions selon le classement) sont **connues, visibles et identiques pour tous**, comme dans un vrai règlement.
- **L'aléa reste présent, mais n'est pas le principal facteur d'équilibre.**
- **Une IA qui rivalise durablement** : même après 20 saisons, un joueur expérimenté rencontre des difficultés. Les adversaires identifient leurs faiblesses, optimisent, anticipent, recrutent, développent, forment, s'adaptent, apprennent et **exploitent les erreurs du joueur**. Devenir champion est un accomplissement ; le rester est un nouveau défi.
- **Garde-fou** : les mécanismes de rééquilibrage ne doivent jamais effacer les bonnes décisions du joueur. Bien gérer doit rester nettement payant (voir le laboratoire, indicateur « valeur des décisions »).

Cibles du jeu final : [docs/systemes/laboratoire-equilibrage.md](docs/systemes/laboratoire-equilibrage.md). Ce sont des cibles expérimentales, jamais des contraintes imposées aux résultats.

## 8. Philosophie d'équilibrage

- Chaque caractéristique a une utilité identifiable. Chaque mécanique importante a des conséquences observables.
- **Toutes les décisions n'ont pas de grandes conséquences.** Beaucoup sont mineures, et c'est normal.
- **Les erreurs sont parfois réparables** : une relation peut se reconstruire après un conflit.
- **Le hasard reste présent** sans rendre les choix inutiles.
- **Aucune réponse optimale identifiable systématiquement.**
- **Statistiquement crédible ne suffit pas : il faut que ce soit intéressant à vivre.** On vérifie les deux, par des indicateurs chiffrés et par la lecture humaine des chroniques.
- **L'attachement** : le joueur doit pouvoir s'attacher à ses pilotes, à ses ingénieurs et à son écurie. Cela passe par la continuité (histoires longues), la singularité (personnages reconnaissables) et la réciprocité (ils se souviennent de ce que le joueur a fait pour eux).
- Les coefficients sont choisis, c'est inévitable. Ils sont nommés, documentés, rangés en un seul endroit, et calés sur des **résultats cibles** mesurables.

## 9. Ce qui est hors du périmètre actuel

Le moteur de course 2D, le développement détaillé des monoplaces, les médias complets et la carrière du manager sont prévus. L'architecture leur réserve leur place, mais ils viennent après le jalon A (voir [ROADMAP.md](ROADMAP.md)).
