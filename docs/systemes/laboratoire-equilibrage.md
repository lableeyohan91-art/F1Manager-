# Laboratoire d'équilibrage — objectifs et méthode

> Statut : **VALIDÉ** (D-081, 22/11/2026). Les cibles sont **expérimentales** : elles guident les réglages et la conception, **jamais** des contraintes imposées aux résultats (D-040). Méthode : D-076 (rapport complet, conditions identiques, références conservées, indicateurs défavorables présentés).

## 1. Cibles du jeu final, et où nous en sommes

Valeurs actuelles : réglage **C2 provisoire** (pilote 0,15 / aléa 0,30), mécaniques de la phase 4 ; 100 graines × 10 saisons, ou 50 graines × 20 saisons pour les cibles sur 20 ans.

| Cible (jeu final) | Valeur actuelle | État |
| --- | --- | --- |
| 4 à 6 écuries différentes gagnent des Grands Prix chaque saison | 3,7 sur 10 saisons ; 4,5 sur 20 saisons | Proche |
| 2 à 4 écuries capables de jouer le championnat | À mesurer (indicateur à créer : écuries à moins de X points du titre à mi-saison) | — |
| 30 à 50 % des championnats ouverts au dernier Grand Prix | 36 % (10 s.) ; 28 % (20 s.) | Limite |
| Moins de 5 % de dominations écrasantes (≥ 120 pts) | 8 % (10 s.) ; **17 % (20 s.)** | **Non atteint** |
| Dynasties de 5 titres ou plus très rares | **64 % des séries de 10 saisons, 86 % des séries de 20** | **Très loin** |
| 5 à 8 champions constructeurs différents sur 20 saisons | **3,7** | **Non atteint** |
| La dernière écurie marque dans 60 à 90 % des saisons | 32 % (10 s.) ; 47 % (20 s.) | **Non atteint** |
| Batailles intéressantes à tous les niveaux | Écart de points dans le tiers de tête : 51 % ; une saison sur trois sans aucun changement de tiers | **Non atteint** |

**Lecture honnête** : sur 8 cibles, 1 est proche, 1 à la limite, 5 non atteintes, 1 pas encore mesurée. La campagne D-074 a montré que le modèle de course n'y peut presque rien. Ce sont les phases 5 (économie), 6a (vieillissement), 7 (transferts), 8 (règlement), 12 (développement) et 13 (course) qui doivent faire bouger ces chiffres. Elles seront évaluées sur ces cibles.

## 2. Indicateurs complémentaires proposés (à valider)

Ils traduisent « des batailles à tous les niveaux » et « une hiérarchie dynamique » en mesures :

| Indicateur | Proposition de cible |
| --- | --- |
| **Lutte serrée dans chaque tiers** (tiers de 4 / 4 / 3 écuries) : écart de performance moyen entre la meilleure et la moins bonne voiture du tiers | ≤ 0,3 % du temps au tour |
| **Mobilité entre tiers** : écuries qui changent de tiers d'une saison à l'autre | En moyenne ≥ 1 par saison ; moins de 20 % de saisons sans aucun changement (actuel : 1,6 et 33 %) |
| **Trajectoires** : séries où une écurie du dernier tiers en 2027 atteint le top 3, puis le titre | Possible mais rare. Objectif à fixer après la phase 5 |
| **Concentration des talents** : part des 5 meilleurs pilotes et ingénieurs dans les 3 meilleures écuries | À suivre, sans cible pour l'instant |
| **Valeur des décisions** : écart de résultats entre une écurie bien gérée et la même écurie mal gérée (managers artificiels, §4) | Doit rester **nettement positif**. C'est le garde-fou contre des rééquilibrages qui effaceraient le mérite |

## 3. Ce que le laboratoire doit pouvoir faire

| Capacité | État |
| --- | --- |
| Campagnes multi-réglages, mêmes graines, revalidation sur de nouvelles graines | **Fait** (`npm run campagne`) |
| Comparaison à une référence conservée | **Fait** (`npm run equilibrage -- --reference`) |
| Tests contrefactuels de décisions | Fait, améliorations prévues (`tests-contrefactuels.md`) |
| Centaines de carrières sur 20 à 50 saisons | Possible (50 saisons ≈ 10 s par graine) ; parallélisé sur 4 cœurs |
| Influence individuelle de chaque statistique (audit de sensibilité) | À faire (phase 5) |
| Trajectoires des grandes et petites écuries | À faire (phase 5) |
| Philosophies de management, stratégies économiques, niveaux de compétence des dirigeants | Après la phase 5 |
| **Managers artificiels** débutant, intermédiaire, expert, qui jouent une écurie avec les commandes du joueur, pour vérifier que l'IA résiste | À concevoir (phases 5 à 7) |
| Conséquences des changements de règlement | Phase 8 |

## 4. Managers artificiels (principe)

Trois profils jouent une écurie **à la place du joueur**, avec exactement les mêmes commandes :
- **débutant** : décisions peu informées, réactions aux résultats immédiats ;
- **intermédiaire** : règles simples et raisonnables ;
- **expert** : optimise budget, recrutement, développement et anticipation, et exploite les faiblesses des rivaux.

Mesures : avec quelle écurie de départ, et en combien de saisons, chaque profil devient champion ? Combien de temps conserve-t-il son titre ? Les écuries de l'IA ralentissent-elles l'expert ? Le pilote d'un même profil progresse-t-il plus vite dans une écurie bien dotée ?

**Lecture attendue** :
- l'expert gagne, mais pas trop vite ni trop longtemps (« conserver son titre est un nouveau défi ») ;
- le débutant progresse lentement sans être écrasé.

## 5. Règles de fonctionnement

- Chaque phase se termine par une évaluation de ces cibles, comparée aux références précédentes. Ces références sont conservées dans `docs/rapports/reference/` et `archives/`.
- Aucune cible n'est poursuivie seule : un réglage qui en améliore une en dégradant les autres est présenté comme tel.
- Le réglage du modèle de course (C2) reste **provisoire** et sera réévalué après les phases 5, 6a et 13.

## 6. Calendrier des campagnes (D-095)

- **Après chaque phase** : vérification des mécaniques, correction des bugs, mesure et documentation des déséquilibres (rapport D-076, références conservées), liste des mécaniques futures susceptibles de les résoudre. **Pas de recalibrage prématuré.**
- **Grandes campagnes d'équilibrage** : après la **phase 8** (générations, marché, règlements en place), après la **phase 12** (conception des pièces), après la **phase 13** (moteur de course).
- Déséquilibres documentés à ce jour, avec leur remède attendu :

| Déséquilibre mesuré | Rapport | Mécaniques futures susceptibles de le résoudre |
| --- | --- | --- |
| Dynasties fréquentes (88 % des séries de 20 saisons) et dominations (17 %) | P5a, P5b | 6a (déclin et générations), 7 (débauchage des ingénieurs), 8 (changements de règlement, D-090), 12 (incertitude de conception) |
| La forme du pilote ne pèse rien (0 %) | campagne D-074 | 13 (moteur de course ; affinités, forme du jour, forme à moyen terme, budget de variance, D-103) |
| Aucune crise financière en 600 saisons | P5b | 7 (inflation salariale, transferts, indemnités), 12 (coûts de conception) |
| Concentration du sponsoring (160 M€ pour le premier, 52 M€ pour le dernier) | P5b | 7 (diversification des motivations des sponsors, valeur commerciale), 11 (popularité) |
| Effet quasi nul d'une augmentation de DT dans les dilemmes | P4 | 7 (débauchage) |
| Dominations (9 % → 23 % sur 10 saisons après la 6a) : **la meilleure voiture** écrase la saison (80 % des cas), le plateau des pilotes étant plus resserré | P6a §8 | 7 (débauchage des ingénieurs), 8 (règlements, D-090), 12 (conception), 13 (moteur de course, D-103) |
| Âge moyen de la grille ≈ 30 ans | P6a | 6b (filières juniors) |
| Hiérarchie plus figée après la 6a complémentaire (persistance 0,635 → 0,687, champions constructeurs 4,6 → 3,9 sur 20 saisons) : hypothèse, l'expérience favorise les pilotes établis | P6a+ | 6b (expérience acquise chez les juniors) ; facteur d'expérience des débutants à revoir lors de la grande campagne |
| **Convergence des voitures vers le plafond** (moyenne 13,4 → ≈ 22,5 en 30 saisons ; ≈ 65 caractéristiques sur 66 à 19 ou plus après 20 saisons) | constat du 22/11/2026 | 8 (règlements : convergence partielle à chaque nouveau règlement), 12 (compromis, architectures, coûts marginaux, D-109) |
| Champions trop âgés (31 ans en moyenne) | P6a+ | 6b, puis nouvelle mesure (D-111) |

