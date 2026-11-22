# Orientations — Affinités avec les circuits, forme du jour, forme à moyen terme

> Statut : **ORIENTATIONS VALIDÉES** (D-103, 22/11/2026), demande du porteur et de ChatGPT. **Pas d'implémentation maintenant** : intégration principale en **phase 13** (moteur de course), sans ralentir la phase 6b. La conception détaillée sera faite au début de la phase 13, puis soumise à validation.

## 1. Les trois mécanismes

| Mécanisme | Horizon | Ce qu'il représente | Dépend de |
| --- | --- | --- | --- |
| **Affinité avec un circuit** | La carrière, mais évolutive | Un pilote aime, ou redoute, certains circuits. La majorité reste neutre | Style de pilotage (compétences dominantes contre le profil du circuit), expérience sur le circuit, souvenirs qui y sont attachés (victoire, accident) |
| **Forme du jour** | Un week-end | Le pilote est au-dessus ou en dessous de son niveau habituel, **de façon cohérente sur tout le week-end** (un seul état par week-end, pas de nouveau tirage à chaque tour) | Amplitude selon la régularité, le sang-froid (D-075), la fatigue, la personnalité (tempérament) |
| **Forme à moyen terme** | Plusieurs semaines | Une série de réussite ou de méforme | Confiance, motivation, résultats récents, environnement humain (relations, tensions dans l'écurie) |

**Règles communes** :
- les trois modifient la **performance effective** d'un week-end, **jamais les compétences permanentes** (celles-ci relèvent de la phase 6a) ;
- **pas de double comptage** : chaque cause n'agit que par un seul canal (§2) ;
- **pas d'accumulation excessive** : l'effet combiné est borné, et les trois effets ne s'additionnent pas sans limite (§3) ;
- objectifs : des surprises crédibles, une régularité qui compte, des décisions du manager qui pèsent. Gérer la confiance d'un pilote, éviter de le surcharger, l'aligner sur ses circuits favoris pour une course décisive.

## 2. Éviter le double comptage avec l'existant

| Existant | Ce qu'il fait déjà | Règle |
| --- | --- | --- |
| **Profils de circuit** (phase 3) | La **voiture** est plus ou moins adaptée à un type de circuit | L'affinité concerne le **pilote**, pas la voiture. Elle peut naître du style du pilote, mais ne doit pas recompter l'adéquation de la voiture |
| **État émotionnel** (phase 4 : moral, stress, motivation, confiance) | Il existe déjà, et la confiance donne aujourd'hui une petite « forme » provisoire dans le modèle abstrait (`EFFET_FORME_MAX`) dont l'effet mesuré est **quasi nul** (campagne D-074) | La **forme à moyen terme est lue dans l'état émotionnel existant** (confiance, motivation), pas dans une nouvelle réserve parallèle. Le provisoire actuel sera remplacé en phase 13 |
| **Compétence « régularité »** | Elle pèse déjà dans le niveau du pilote | En phase 13, la régularité agit **surtout par l'amplitude** de la forme du jour (un pilote régulier varie peu), plutôt que par un bonus de niveau. Le poids de « régularité » dans le niveau sera revu pour ne pas la compter deux fois |
| **Sang-froid** (D-075) | Performance sous pression (prévu) | Il réduit l'amplitude défavorable de la forme du jour **dans les moments à fort enjeu** ; il n'ajoute pas un second bonus |
| **Souvenirs** (phase 4) | Liés à des personnes | Les souvenirs **liés à un lieu** (un circuit) sont une extension de la mémoire, à concevoir avec la mémoire v2 (phase 8), qui servira ensuite aux affinités |

## 3. Remplacer une partie de l'aléa, ne pas s'y ajouter

Le modèle de course a aujourd'hui un **aléa générique** (D-074 : 0,30 % du temps au tour, provisoire). En phase 13, on raisonnera en **budget de variance** :

- l'écart total entre ce que « devrait » faire un pilote et ce qu'il fait est réparti entre plusieurs sources :
  - affinité ;
  - forme du jour ;
  - forme à moyen terme ;
  - stratégie et incidents de course (moteur de course) ;
  - un **aléa résiduel plus petit** ;
- la part de chaque source sera fixée en laboratoire, lors de la grande campagne d'après la phase 13 (D-095) ;
- résultat attendu : à variance totale comparable, une plus grande part des surprises devient **explicable**. On pourra dire « il adore ce circuit », « il est en confiance depuis trois courses », « il a craqué sous la pression ».

## 4. Calendrier

| Phase | Ce qu'elle apporte |
| --- | --- |
| **6b** | Rien (ne pas ralentir). Éventuellement, l'expérience par circuit des juniors **si** une formule la lit déjà, sinon non |
| **8** | Souvenirs liés aux lieux (mémoire v2), dont se nourriront les affinités |
| **11** | Médias : un pilote « en état de grâce » ou « en crise » devient un sujet d'actualité (lecture, pas un nouveau mécanisme) |
| **13** | Conception détaillée et implémentation des trois mécanismes ; remplacement de la forme provisoire ; budget de variance ; campagne de laboratoire |

## 5. Points à trancher plus tard (conception de la phase 13)

1. **Affinités** : sont-elles tirées à la naissance (préférences innées) puis modifiées par l'expérience, ou entièrement construites par le style et les souvenirs ? Je recommande un **mélange** : une petite part innée, surtout le style et les souvenirs.
2. **Visibilité** : le joueur connaît-il les affinités de ses pilotes ? Je recommande qu'elles se **révèlent** avec l'observation, comme le potentiel.
3. **Fatigue** : elle n'existe pas encore. Elle naîtra du calendrier (courses rapprochées, déplacements) et de la condition physique, en phase 13.
4. **Bornes** : effet combiné maximal des trois mécanismes, à fixer en laboratoire.
