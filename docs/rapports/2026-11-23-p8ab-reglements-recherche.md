# Rapport court — Phases 8a et 8b : règlements et recherche

> Date : 23/11/2026. Mesures **indicatives** (D-120), sans recalibrage (D-095).
> Mêmes graines avant et après :
> - 100 graines × 10 saisons, comparées à la référence `d131` ;
> - 50 graines × 20 saisons, comparées à la référence `p7a-20saisons`, la seule disponible sur 20 saisons ;
> - diagnostic propre à la phase 8 sur 20 graines × 20 saisons.
>
> Nouvelles références conservées :
> - `docs/rapports/reference/p8ab-reference.*` ;
> - `docs/rapports/reference/p8ab-reference-20saisons.*` ;
> - `docs/rapports/reference/p8ab-diagnostic-reglements.md`.

## 1. Ce qui a été fait (conception validée : D-128, D-132)

**8a — Règlements** (`systems/technique/index.ts`, coefficients dans `balance/technique.ts`) :

- **Règlement de départ.** Il est créé automatiquement, avec une durée prévue de 4 à 6 saisons.
- **Propositions de réforme.** Deux saisons avant la fin prévue du règlement (semaine 12), la fédération propose :
  - 2 ou 3 réformes, chacune avec une orientation : aéro, motorisation et énergie, châssis et mécanique, ou refonte majeure ;
  - chaque réforme décrit l'intensité du changement dans chacun des 12 domaines ;
  - les pneumatiques changent avec une réforme une fois sur deux ;
  - la prolongation du règlement actuel (1 ou 2 saisons) est toujours une option.
- **Vote** en semaine 30, une voix par écurie, égalités tranchées par la fédération. L'annonce suit le vote, et la réforme entre en vigueur au moins deux saisons complètes plus tard.
- **Évolutions mineures** (6 années sur 10, sauf l'année d'une réforme) : 1 ou 2 domaines, intensité 8 à 20 %, décidées par la fédération seule.
- **Entrée en vigueur d'une réforme** :
  - le savoir propre à l'ancien règlement n'est gardé qu'à hauteur de (1 − intensité) ;
  - le savoir fondamental reste entier ;
  - les voitures sont **reconçues**.

**8b — Recherche** :

- **Savoir par écurie et par domaine.** Il a une part fondamentale et une part propre à chaque règlement. Il vieillit de 1 % par an.
- **Deux programmes de recherche** par écurie :
  - chacun choisit un domaine, un horizon (voiture actuelle, saison suivante, règlement annoncé ou seulement proposé) et une part des moyens (5 à 35 %, 50 % au total) ;
  - rendements décroissants ; 15 % du gain profite aux domaines voisins ;
  - gain modulé par la capacité de développement, les compétences du personnel et les installations utiles au domaine.
- **Ce que coûte la recherche** : la part des moyens qui lui est consacrée est retirée du développement de la voiture.
- **Ce qu'elle rapporte** :
  - le savoir rend le développement plus efficace (jusqu'à environ +30 %) ;
  - le savoir préparé « pour la saison suivante » s'applique à l'intersaison ;
  - le savoir préparé pour un futur règlement pèse dans la reconception.
- **Réorientation d'un programme** : 6 semaines à demi-efficacité. La suspension se fait sans perte.
- **Recherche sur une proposition rejetée** : 30 % de ce savoir devient fondamental.
- **Découvertes** : rares, seulement pour un règlement futur. Leur probabilité dépend du savoir fondamental et de la vision technique du directeur technique. Elles sont expliquées dans la chronique et copiées par les autres à 50 % par saison après l'entrée en vigueur. Aucun quota.
- **Quatre commandes, mêmes règles pour le joueur et l'IA** :
  - `recherche.programme` ;
  - `recherche.suspendre` ;
  - `recherche.deleguer`, qui confie la recherche au directeur technique ;
  - `reglement.vote`.
- **Décisions de l'IA.** Les mêmes commandes, appelées après le début de saison, les propositions et le vote. Elles tiennent compte de :
  - la force sportive : une écurie de tête soigne la voiture actuelle, une écurie distancée prépare l'avenir ;
  - le goût du risque du team principal et du directeur technique ;
  - la philosophie technique de l'écurie ;
  - le savoir déjà acquis ;
  - l'intensité du futur règlement.

**Conversion PROVISOIRE du savoir en performance** : isolée dans `systems/technique/conception.ts`, elle sera remplacée en phase 12.
- La reconception est **relative au plateau** : une réforme ne fait ni monter ni baisser l'ensemble des voitures.
- Chaque caractéristique se rapproche de la moyenne de la grille selon l'intensité du changement.
- Elle s'en écarte ensuite selon le savoir (écart à la moyenne, borné), la compétence du personnel et un aléa d'exécution, que le savoir réduit.

**Format de sauvegarde 20**, avec migration et test. **157 tests** (10 nouveaux dans `tests/technique.test.ts`).

## 2. Un choix de mise en œuvre à te signaler (D-133, à discuter)

Le premier essai donnait un résultat absurde : **13 saisons du même règlement**, prolongé à chaque vote.

La cause était dans **ma** mise en œuvre, pas dans la conception. Le vote se faisait en un seul tour : les partisans d'un changement se partageaient entre 2 ou 3 réformes, alors que la prolongation recevait toutes les voix des autres. Elle gagnait mécaniquement.

J'ai donc mis en place un **vote en deux tours**, qui respecte la règle validée (une voix par écurie, égalités tranchées par la fédération) :
1. réforme ou prolongation ;
2. choix entre les réformes.

L'intérêt des écuries de l'IA est aussi devenu symétrique :
- une écurie de tête préfère garder le règlement, une écurie du fond veut rebattre les cartes ;
- l'envie de changer grandit quand le règlement dépasse 4 saisons ;
- une écurie qui a pris de l'avance en recherche exploratoire vote pour « sa » réforme.

C'est réversible ; tu peux préférer une autre règle de vote.

## 3. Mesures

### Règlements et recherche (20 graines × 20 saisons)

| Indicateur | Valeur |
| --- | --- |
| Réformes adoptées pour 10 saisons | 2,1 (une tous les 4 à 5 ans, conforme à D-090) |
| Prolongations votées pour 10 saisons | 0,17 (**rares** : 8 % des votes) |
| Évolutions mineures par saison | 0,47 |
| Part moyenne des voix pour un changement | 64 % |
| Orientations adoptées | motorisation 22, châssis 21, aéro 20, refonte 20 (équilibrées, sans forçage) |
| Stabilité du classement d'une saison à l'autre (Spearman), année d'une réforme / autres années | 0,77 / 0,81 |
| Le champion constructeurs garde son titre, année d'une réforme / autres années | **51 % / 62 %** |
| Découvertes par saison (toutes écuries) | 0,07 (une tous les 14 ans environ) |
| Part moyenne d'un programme actif | 15 % |
| Horizons des programmes | actuelle 40 %, saison suivante 37 %, futur règlement 23 % |
| Domaines les plus étudiés / les moins étudiés | énergie 12 %, groupe propulseur 11 % / gestion thermique 6 %, suspensions 7 % |

### Équilibrage général (tous les indicateurs suivis sont dans les références jointes ; ici, ceux qui bougent ou qui comptent)

| Indicateur | Avant | Après |
| --- | --- | --- |
| **Dynasties** (5 titres constructeurs consécutifs ou plus), séries de 10 saisons | 59 % | **54 %** |
| **Dynasties**, séries de 20 saisons (référence p7a, plus ancienne) | 74 % | **68 %** |
| Plus longue série de titres, 20 saisons | 6,4 | 6,2 |
| Champions constructeurs différents, 10 / 20 saisons | 2,7 / 4,7 | 2,7 / 4,6 |
| Part des victoires de l'écurie dominante | 59 % | 60 % |
| Écart 1re–dernière voiture (% temps au tour), 10 saisons | 1,51 | 1,56 |
| Écart 1re–dernière voiture, 20 saisons (objectif 1,5 à 4) | 1,13 | 1,17 (**toujours hors objectif**) |
| La dernière écurie marque, 10 saisons | 61 % | 62 % |
| Écuries changeant d'étage par saison | 2,6 | 2,7 |
| Dominations (≥ 120 points d'écart) | 16 % | 17 % |
| Toutes les autres lignes (coéquipiers, luttes, mobilité, D-113) | — | inchangées à ± 1 point |

### Performances (50 saisons, graine 1, même machine)

| Version | Durée | Système de la phase 8 |
| --- | --- | --- |
| Avant (aujourd'hui, sur cette machine plus lente que lors de la mesure de 59 s) | 70,0 s | — |
| Après | 81,6 s (**+16 %**) | 4,9 s (6 %) |

Le reste du surcoût vient du marché : les saisons se déroulant autrement, le marché a plus de travail.

## 4. Lecture franche

- **Le système fonctionne** :
  - les réformes arrivent à un rythme réaliste et leurs orientations sont variées ;
  - une réforme fait réellement vaciller le champion (garde son titre 51 % contre 62 %) ;
  - la recherche exploratoire, les découvertes et l'obsolescence se produisent sans aucun forçage.
- **L'effet sur les dynasties est réel mais modeste** :
  - de 59 % à 54 % sur 10 saisons ;
  - de 74 % à 68 % sur 20 saisons, mais contre une référence plus ancienne, donc à confirmer.

  On reste **loin de l'objectif indicatif (0 à 25 %)**. C'est attendu : l'effet du savoir est volontairement **modéré et provisoire** (D-132, question 1), et la vraie conception des voitures arrive en phase 12. Je ne recalibre pas (D-095). Les leviers sont identifiés pour la grande campagne :
  - le poids du savoir dans la reconception (`parPointSavoir`) ;
  - le bonus de développement ;
  - l'aléa d'exécution.
- **Signaux défavorables ou à surveiller** :
  - les prolongations sont devenues **rares** (8 % des votes). Le vote en deux tours et l'« usure » du règlement poussent fort au changement. À surveiller : on voulait des prolongations possibles, pas exceptionnelles ;
  - l'écart entre la 1re et la dernière voiture reste trop faible sur 20 saisons. La phase 8 ne le corrige pas, et ce n'était pas son rôle ;
  - le calcul est 16 % plus lent. C'est acceptable, et optimisable plus tard sans changer les résultats ;
  - la gestion thermique et les suspensions sont peu étudiées, faute de lien fort avec la performance dans le modèle provisoire. C'est logique, mais la phase 12 devra leur donner du sens.
- **Effets indirects** : aucun effet notable sur les finances, les pilotes ou le marché dans les indicateurs suivis.
