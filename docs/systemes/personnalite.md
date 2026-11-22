# Structure des personnages — première proposition

> Statut : la structure en 5 couches est **VALIDÉE** (D-020). Les listes de traits et de valeurs sont **PROPOSÉES** (D-025, D-026), à définir avec le porteur et ChatGPT avant la phase 2.
> Échelle proposée : entiers de 1 à 20 (D-027).

## Les 5 couches

| Couche | Question | Stabilité | Visible par le joueur |
| --- | --- | --- | --- |
| 1. Personnalité | Comment est-il ? | Très stable (évolue sur des années, après des événements forts) | Non. Indices dans les rapports de recrutement et les comportements |
| 2. Valeurs et convictions | Qu'est-ce qui compte pour lui ? | Stable, peut évoluer avec l'âge et les épreuves | Non. Se devinent avec le temps et les entretiens |
| 3. Compétences | Que sait-il faire ? | Évolue chaque mois (progression, déclin) | En fourchette, plus précise avec le recrutement |
| 4. Aspirations | Que veut-il devenir ? | Change selon la carrière | En partie : il peut les exprimer |
| 5. État émotionnel | Comment va-t-il ? | Change chaque semaine | Oui, en indicateurs simples |

**Pourquoi séparer :** un pilote peut être ambitieux (personnalité) mais attaché à son écurie formatrice (valeur), excellent sous la pluie (compétence), vouloir devenir champion avant 30 ans (aspiration) et être démotivé en ce moment (état). Ces cinq informations produisent des décisions différentes. Les mélanger en une seule liste de 20 attributs rendrait les décisions incompréhensibles.

## Couche 1 — Personnalité : 9 traits proposés

Chaque trait est utilisé par au moins deux systèmes. Un trait sans usage sera retiré.

| Trait | 1 = … / 20 = … | Systèmes qui le lisent |
| --- | --- | --- |
| **Ambition** | Se contente de sa situation / veut toujours monter plus haut | marché (envie de partir), aspirations, réaction aux échecs |
| **Loyauté** | Suit son intérêt du moment / fidèle aux personnes et aux institutions | marché (attachement), poids des relations dans les décisions, groupes sociaux |
| **Rancune** | Pardonne vite / n'oublie jamais | vitesse d'oubli des souvenirs négatifs, réconciliation |
| **Besoin de reconnaissance** | Indifférent aux égards / a besoin d'être valorisé | grille de lecture (promotion refusée, éloges publics), état émotionnel |
| **Tempérament** | Calme / volatil | intensité des réactions, conflits, déclarations publiques |
| **Discrétion** | Parle beaucoup / garde tout pour lui | diffusion des informations privées, fuites aux médias |
| **Professionnalisme** | Dilettante / rigoureux | travail, progression, fiabilité, effet du moral sur le travail |
| **Sang-froid** | Craque sous la pression / imperturbable | performance sous pression (fin de saison, titre en jeu), stress |
| **Sociabilité** | Solitaire / crée des liens partout | création de relations, groupes sociaux, influence |

Traits étudiés mais **non retenus** (à discuter) :
- **Adaptabilité** : plutôt une compétence transversale (adaptation à un nouvel environnement), en couche 3.
- **Leadership et communication** : ce sont des savoir-faire, donc des compétences transversales en couche 3. Leur effet passe par l'influence.
- **Ego** : en partie couvert par ambition + besoin de reconnaissance. À ajouter seulement s'il produit des comportements qu'aucun autre trait ne couvre.

## Couche 2 — Valeurs et convictions : 7 valeurs proposées

Chaque personne a un **poids** pour chaque valeur (1–20). Une valeur à 17 ou plus devient une **conviction** : une ligne rouge qui peut lui faire refuser une option pourtant plus avantageuse.

| Valeur | Ce qu'elle valorise | Exemple de conviction |
| --- | --- | --- |
| **Argent** | Salaire, sécurité financière | Ne signe jamais sous sa valeur de marché |
| **Victoire** | Titres, résultats, écurie compétitive | Refuse une écurie sans ambition sportive, même mieux payée |
| **Fidélité** | Rester avec ceux qui lui ont fait confiance | Refuse une écurie dominante par attachement à son employeur |
| **Stabilité** | Environnement serein, pas de bouleversements | Privilégie la stabilité humaine aux performances immédiates |
| **Défi** | Construire, relever une écurie, innover | Préfère un projet ambitieux dans une petite écurie |
| **Équité** | Justice, règles respectées, parole tenue | Démissionne après un licenciement injuste d'un collègue |
| **Racines** | Attachement à un pays, une région, une équipe d'origine | Veut finir sa carrière dans son écurie formatrice |

**Comment les valeurs entrent dans une décision** (principe, formules en phase 4) :

```
utilité(option) = Σ  poids_valeur × satisfaction_de_la_valeur(option)
                + effet des relations (confiance, affinité envers les personnes concernées)
                + effet des souvenirs marquants liés à l'option
                + bruit (selon le tempérament)

si l'option viole une conviction → option écartée, ou fortement pénalisée
```

C'est ce qui permet au propriétaire de garder un pilote qui ne gagne pas (fidélité), ou au pilote de choisir le projet plutôt que le salaire (défi > argent).

## Couche 3 — Compétences

Propres à chaque métier, plus quelques compétences **transversales** communes à tous : leadership, communication, adaptabilité, gestion humaine.

| Métier | Compétences (proposition, à affiner avec ChatGPT) |
| --- | --- |
| Pilote | Vitesse pure, régularité, dépassement, défense, pluie, gestion des pneus, départs, retour technique, condition physique |
| Directeur technique | Vision technique, gestion de projet, aérodynamique, conception, innovation |
| Responsable aéro / conception | Spécialité métier, rigueur, innovation, corrélation simulation/réalité |
| Directeur sportif | Organisation des stands, stratégie, règlement, gestion des pilotes |
| Directeur financier | Gestion budgétaire, négociation, maîtrise du plafond |
| Team principal | Gestion humaine, négociation, relation avec le conseil, politique, communication |
| Agent | Négociation, réseau, ténacité |

Chaque personne a un **potentiel** caché, unique (interprétation de la phase 2, à valider) : le niveau moyen maximal qu'elle peut atteindre sur les compétences de son métier. Chaque compétence et suit une **courbe d'âge** propre au métier (un pilote culmine vers 27–32 ans, un directeur technique vers 45–55 ans). Ces courbes sont des paramètres d'équilibrage.

## Couche 4 — Aspirations

0 à 3 aspirations actives par personne, tirées selon la personnalité, les valeurs et la carrière. Exemples : *devenir pilote titulaire*, *être champion*, *diriger une écurie*, *travailler pour une écurie prestigieuse*, *finir sa carrière dans son écurie formatrice*, *transmettre (former des jeunes)*.

Une aspiration satisfaite ou contrariée produit un événement, donc un souvenir. Une aspiration longtemps contrariée pousse au départ.

## Couche 5 — État émotionnel

Recalculé chaque semaine. **Jamais modifié directement par une décision** : seulement à travers les souvenirs, le contrat, les résultats, la charge de travail et l'ambiance.

| Indicateur | Principales sources | Effets |
| --- | --- | --- |
| Moral | Souvenirs récents, relations avec la direction et les collègues, résultats | Travail, envie de rester |
| Stress | Pression médiatique, enjeux, charge de travail, sang-froid | Erreurs, santé *(plus tard)* |
| Motivation | Aspirations, reconnaissance, projet de l'écurie | Productivité, progression |
| Confiance en soi | Résultats personnels, soutien reçu | Performance, prise de risque |

## Connaissance incertaine

Pour chaque personne, l'observateur (le joueur ou une IA) possède une **fourchette** par attribut visible, et des **indices** sur les traits cachés (« semble très ambitieux »). La fourchette se resserre avec le travail du département recrutement, la réputation publique et le temps passé ensemble. La difficulté du jeu peut jouer sur ce brouillard.

## Questions ouvertes pour le porteur et ChatGPT

1. Les 9 traits vous conviennent-ils ? En ajouter ou en retirer ?
2. Les 7 valeurs couvrent-elles les comportements que vous voulez voir ? Par exemple, faut-il une valeur « image publique / célébrité » ?
3. Seuil de conviction : un seul seuil (17) pour tout le monde, ou variable selon le trait « tempérament » ?
4. La personnalité doit-elle pouvoir changer après un événement très fort (une tragédie, un titre) ? Proposition : oui, de 1 ou 2 points au maximum, rarement.

## Retours du 22/11/2026 (porteur + ChatGPT) et réponses

### Loyauté (trait) et Fidélité (valeur) : deux effets distincts

Le risque, c'est de compter deux fois la même qualité. Règle proposée :

| | Loyauté (trait, couche 1) | Fidélité (valeur, couche 2) |
| --- | --- | --- |
| Nature | Une **manière de réagir** aux personnes | Un **critère de choix** de carrière |
| S'applique à | Des personnes précises (un mentor, un collègue, le team principal) | Une institution : l'écurie, le projet, ceux qui ont fait confiance |
| Mécanisme | Ralentit l'oubli des souvenirs **positifs** ; augmente l'envie de suivre une personne qui part (groupes sociaux) | Ajoute à l'utilité de **rester** dans l'organisation actuelle, en proportion des années passées et des souvenirs positifs liés à elle |
| Exemple | Suit son directeur technique chez un rival | Refuse une écurie dominante pour rester dans son écurie formatrice |

Dans une même décision, chaque mécanisme n'agit que sur son propre terme du calcul d'utilité. L'audit des attributs (phase 4) vérifiera qu'ils ont des effets mesurables et différents.

### Deux traits à l'étude (D-054)

1. **Propension au risque** : **à ajouter.** Elle produit des comportements qu'aucun trait actuel ne couvre : paris techniques (concept audacieux), stratégie de course (pneus, arrêts), recrutement de profils incertains, gestion financière (dette, investissements). L'ambition dit ce qu'on veut, le risque dit comment on y va.
2. **Capacité à se remettre en question** : **à ajouter, avec une précaution.** Elle règle la réaction aux critiques et l'apprentissage après un échec. Pour éviter le doublon avec la rancune : la rancune agit sur les **souvenirs envers les autres** (ce qu'on m'a fait), la remise en question agit sur les **souvenirs envers soi-même** (ce que j'ai fait, mes décisions).

Ces deux traits porteraient la liste à 11. Ils seront ajoutés en phase 4, avec les premières décisions humaines, quand ils pourront vraiment être lus par une formule.

### Apprendre de ses erreurs, ou persister

Mécanisme proposé (conception détaillée en phase 4 et suivantes) :
- Une décision qui échoue (concept technique raté, pilote recruté qui déçoit) produit un **souvenir envers soi-même**, avec une étiquette (« pari raté », « mauvais recrutement »).
- Ce souvenir modifie les choix suivants du même type : une personne qui se remet facilement en question en tire une **prudence** proportionnée. Une personne qui se remet peu en question et a une **conviction** sur le sujet garde le cap, voire s'obstine (« le concept était bon, l'exécution a manqué »).
- Les mêmes règles valent pour les dirigeants de l'IA : une écurie peut s'entêter dans une mauvaise direction technique pendant plusieurs saisons.

### Courbes d'âge par métier (D-051)

Mise en œuvre dès la phase 2 : voir `src/engine/balance/personnages.ts` (`COURBES_AGE`). Chaque métier a un âge jusqu'auquel il progresse, et un âge à partir duquel il décline. Elles servent au potentiel dès maintenant, et à l'évolution réelle des compétences en phase 6.
