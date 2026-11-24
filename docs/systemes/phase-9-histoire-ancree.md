# Phase 9 — Histoire ancrée : un passé partagé au départ de 2027

> Statut : **VALIDÉE** (D-143), avec deux modifications du porteur : les rivalités et histoires réelles connues sont reprises (fichier `histoires.csv`) en plus des souvenirs inventés ; les dirigeants ont une **date d'arrivée** saisie dans `carrieres.csv` (rien n'est inventé pour les personnages générés). Principes déjà validés : D-042, D-046, D-048.
> Objectif de la feuille de route : « démarrage en 2027 avec la grille voulue, et des personnages qui partagent déjà un passé ». Puis le **jalon A** : 10 saisons observées après un historique, chronique lisible, rapport de diagnostic.

## 1. Constat : ce qui existe, ce qui manque

| Existe déjà | Manque |
| --- | --- |
| Palmarès 2010–2026, carrières des pilotes depuis 2010 (données) | **Toute la couche humaine du passé** : en 2027, tout le monde se rencontre pour la première fois (familiarité nulle, aucun souvenir, aucune relation) |
| Expérience des pilotes (GP, titres, circuits) déduite des données (D-106) | Ancienneté et passé des dirigeants et ingénieurs (non renseignés dans les données, sauf quelques-uns) |
| Passé junior simulé (6b) | Chronique du passé : les titres 2010–2026 ne figurent pas dans la Chronique |
| Grille de 2027 garantie (rien ne bouge avant 2027) | Groupes sociaux, alliances, usure du succès : ils démarrent « à froid », alors qu'ils dépendent de l'histoire |

Conséquence actuelle : deux pilotes coéquipiers depuis quatre ans ne se connaissent pas, un directeur technique en poste depuis dix ans n'a aucune ancienneté, et **l'usure du succès (D-140) ne voit pas les titres passés de Mercédes**, puisque personne n'a d'ancienneté avant 2027.

## 2. Principe (rappel de D-046, et une précision de méthode)

- **Les faits passés viennent des données et ne changent jamais** : qui a couru où, qui a gagné quoi.
- **La couche humaine est générée par-dessus, sans rejouer les saisons.** Je propose de **ne pas faire tourner le moteur** sur 2010–2026, mais de construire directement, saison par saison, ce que ces années ont laissé dans les têtes. Avantages :
  - la grille de 2027 est garantie par construction ;
  - le départ est rapide (quelques secondes, contre plusieurs minutes pour 17 saisons simulées) ;
  - c'est entièrement déterministe.
- **Tout ce qui est généré est privé et cohérent avec les faits publics.** Une rivalité naît entre deux coéquipiers qui se sont réellement côtoyés. On ne fabrique jamais un fait public faux (aucun transfert ni titre inventé).

## 3. Ce que la phase 9 construirait

### 3.1 Ancienneté et carrières passées

- **Pilotes** : leur carrière vient des données (déjà le cas).
- **Dirigeants et ingénieurs sans passé connu** : une ancienneté dans leur écurie est tirée selon leur âge et leur poste. Par exemple, un directeur technique de 55 ans a un passé de 3 à 12 ans dans l'écurie, et parfois une écurie précédente.
  - Ce passé est marqué « estimé » (comme la colonne `verification` des données).
  - Il est entièrement modifiable dans les fichiers CSV : une colonne facultative de carrière pour les non-pilotes.
- **Effets** :
  - l'**usure du succès** voit enfin les titres vécus : le personnel de l'écurie championne en 2025–2026 arrive déjà « avancé » dans son usure ;
  - la lassitude ordinaire et l'attachement aux racines aussi.

### 3.2 Familiarité et relations

Pour chaque paire de personnes qui ont travaillé dans la même écurie la même année :

- **Familiarité** : elle augmente avec le temps réellement passé ensemble (au mois près depuis l'audit du 24/11/2026 : un transfert en cours de saison ne compte que les mois partagés), au même rythme qu'en jeu. Le lien social (D-139) en découle : affinité naturelle et respect professionnel, en proportion de la familiarité.
  - **Écart constaté lors de l'audit** : cette fiche annonçait que « l'oubli s'applique pour les collaborations anciennes ». Ce n'est pas le cas : l'oubli atténue les souvenirs, jamais la familiarité. Elle représente donc une **connaissance durable** (« on se connaît »). Comme elle multiplie aussi le lien social, deux anciens collègues séparés depuis longtemps restent aussi « proches » qu'au premier jour. Mesure au départ (20 graines) : 24 paires familières séparées depuis 5 ans ou plus, dont 9 avec un lien fort. Décision du porteur en attente (D-151).
- **Souvenirs plausibles** : quelques faits privés par saison passée, tirés selon la situation connue et les personnalités (fictives, D-042) :

  | Situation connue (données) | Souvenirs possibles |
  | --- | --- |
  | Deux coéquipiers, l'un champion cette saison-là | Rivalité, jalousie ou admiration, selon l'ambition et le tempérament |
  | Un jeune pilote face à un aîné expérimenté | Soutien, mentorat, ou indifférence |
  | Un pilote qui quitte une écurie (fin de carrière dans l'écurie) | Gratitude ou rancœur envers l'écurie et son team principal, selon la durée et les titres |
  | Une écurie championne | Réussite commune (souvenir positif partagé), reconnaissance |
  | Plusieurs saisons sans succès | Frustration, critiques internes, parfois un conflit |

  Les souvenirs suivent la mémoire v1 : ils s'atténuent avec le temps, et ceux de 2012 auront presque disparu en 2027, laissant un **résidu**. Seule une partie (2 à 4 souvenirs par paire proche sur toute la période) reste marquante.
- **Promesses passées** : aucune, pour ne pas contraindre le départ.

### 3.3 Chronique et réputation du passé

- **Chronique** : les champions pilotes et constructeurs de 2010 à 2026 sont inscrits, ainsi que les grandes ères (« l'ère Red Bul 2010–2013 », « l'ère Mercédes 2014–2020 »). Elles sont déduites automatiquement des séries de titres.
- **Réputation publique de départ** :
  - les titres comptent pour les team principals en poste à l'époque (facette « bâtisseur ») ;
  - les longues fidélités comptent pour les pilotes.

  Seulement des faits publics réels.

### 3.4 Ce qui se recalcule ensuite tout seul

Groupes sociaux (8d), alliances (8d) et réputation perçue (8c) sont détectés dès la première saison, à partir de ce passé. Rien n'est créé à la main.

## 4. Simulation libre (mondes fictifs)

La simulation historique **libre** de D-021/D-046 suppose un **monde entièrement fictif**, généré à partir d'une graine. **Il n'existe pas encore** : le seul départ jouable est la grille 2026.

En faire un est un gros chantier :
- générer des écuries, des noms, des circuits et un passé cohérents ;
- puis faire tourner le moteur sur 15 à 20 saisons avant le départ.

Je recommande de le **reporter** (après le jalon A, ou avec la version publique de la phase 15), et de faire de la phase 9 la seule histoire ancrée.

## 5. Vérifications prévues (tests)

- La grille, les contrats et les voitures de 2027 sont **identiques** avec ou sans histoire : seule la couche humaine change.
- Aucun fait public n'est contredit ; tous les événements générés du passé sont privés.
- Les volumes restent bornés : 40 souvenirs au plus par personne, relations creuses.
- Déterminisme : même graine, même passé.
- Coût au démarrage mesuré.
- Contrefactuel : deux coéquipiers de longue date ont une familiarité nettement supérieure à deux inconnus, et l'usure du succès du personnel d'une écurie titrée en 2025–2026 n'est plus nulle.

## 6. Questions pour toi

1. **Méthode** : construire directement la couche humaine du passé, sans rejouer les saisons (je le recommande), ou faire tourner le moteur sur 2010–2026 avec le marché bloqué (plus lent, plus « vivant », mais plus difficile à garder cohérent avec les faits) ?
2. **Passé inventé des dirigeants et ingénieurs** (ancienneté, écurie précédente), marqué « estimé » et modifiable dans les fichiers : d'accord ?
3. **Personnes réelles** (noms altérés) : les souvenirs générés suivent les faits publics (coéquipiers, titres) mais leur contenu (rivalité, rancœur…) est **fictif**. Je recommande de ne jamais reproduire volontairement une querelle réelle connue, et de laisser le tirage décider selon les personnalités fictives. D'accord ?
4. **Usure du succès dès le départ** : le personnel de l'écurie championne en 2025–2026 commencera 2027 déjà en partie usé. C'est cohérent avec ta demande, mais cela changera le début de partie. D'accord ?
5. **Mondes fictifs** (simulation libre) : les reporter après le jalon A, comme je le recommande ?
6. **Jalon A** juste après : 10 saisons observées, chronique lisible et rapport de diagnostic. Veux-tu le jalon A tel quel, ou y ajouter quelque chose (par exemple un résumé de saison lisible en français dans la chronique) ?
