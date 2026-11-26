# Levier A (capacités achetables) : rapport (26/11/2026)

> D-181, version 2 du levier A, « go » du porteur. Rapport court (D-120). Tous les indicateurs sont dans `donnees/`. Comparaison faite aux
> mêmes graines que la référence D-179 (`docs/rapports/phase-12e/donnees/campagne-20x30-leviers-A-C.md` et `rotation-leviers-A-C.md`).

## Ce qui a été fait

- **Ingénieurs par projet** :
  - au plus 3 projets par pôle, pour toutes les écuries ;
  - la vitesse d'un projet dépend des ingénieurs affectés : (affectés ÷ 45)^0,6, bornée entre 0,5 et 1,8 ;
  - projet prioritaire : il reçoit deux parts des ingénieurs (commande `conception.priorite`).
- **Essais renforcés** : coût de conception × 1,5 ; aléa d'exécution et erreur d'estimation divisés par deux.
- **Fatigue** : elle dépend du rythme des projets, pas de l'effectif.
- **Recrutement et réduction** des départements aéro, conception, production et fiabilité :
  - commande commune au joueur et à l'IA (`departement.effectif`) ;
  - délai de 8 semaines pour une arrivée, préavis de 4 semaines pour un départ ;
  - frais et indemnités sous le plafond ;
  - cohésion d'intégration, qui agit sur la productivité ;
  - pas de licenciement moins d'un an après un recrutement, sauf crise.
- **Départements** : la production accélère la fabrication ; la fiabilité réduit les abandons mécaniques et améliore la détection des
  erreurs de conception.
- **Installations** :
  - entretien en niveau² ;
  - rendement décroissant au-dessus du niveau 8 ;
  - le joueur lance ses chantiers (commande `infrastructure.lancer`, la même que pour l'IA) ;
  - l'IA lance les chantiers du joueur s'il a délégué la recherche.
- **IA** : elle recrute deux fois par an jusqu'à 45 ingénieurs par projet possible, mais seulement avec de l'**argent libre** : la plus
  petite des deux sommes entre la marge sous le plafond et la trésorerie qui partirait sinon en dividendes. Elle réduit ses effectifs en
  cas de crise.
- **Interface** : carte « Effectifs et installations » dans l'écran Technique ; vitesse, priorité et essais affichés sur chaque projet.
- **Format de sauvegarde 34** (migration et test). Tests : `tests/capacites.test.ts`. Le test D-166 est rendu contrefactuel : même monde,
  même mois, deux budgets.

Correction faite pendant l'essai : dans une première version, l'IA ne regardait que la place sous le plafond. Haas recrutait jusqu'à
135 ingénieurs sans en avoir les moyens, et son développement tombait à 18 M€ par an.

## Campagne complète (20 graines × 30 saisons ; tous les indicateurs : `donnees/campagne-20x30-capacites.md`)

| Indicateur (objectif) | Référence D-179 | Avec A | Lecture |
| --- | --- | --- | --- |
| Séries de 5 titres consécutifs ou plus (0–25 %) | 65 % | **60 %** | favorable, toujours hors objectif |
| Champions constructeurs différents sur 30 saisons | 7,3 | **8,0** | favorable |
| Plus longue série de titres | 5,2 | 5,4 | défavorable, léger |
| Titre ouvert avant la dernière manche | 33 % | 32 % | stable |
| Dominations (≥ 120 points d'écart) | 10 % | **12 %** | **défavorable** |
| Saisons très serrées (≤ 10 points) | 12 % | 16 % | favorable |
| Écart 1re–dernière voiture (1,5–4 %) | 1,02 % | 1,03 % | stable : **les écarts ne se creusent pas** |
| Remontées (+3 places) | 33,5 | 32,1 | défavorable, léger |
| Écuries changeant d'étage par saison | 3,7 | 3,5 | défavorable, léger |
| Dernière écurie qui marque (40–90 %) | 65 % | 66 % | stable |
| Écuries sans victoire sur 30 saisons | 0,2 | 0,1 | favorable |
| Victoires inattendues par saison | 1,3 | 1,6 | favorable |
| Vainqueurs différents par saison (3–8) | 7,9 | 7,7 | stable |

## Hiérarchies et argent (10 graines × 30 saisons : `donnees/rotation-10x30-capacites.md`)

| Indicateur | Référence | Avec A |
| --- | --- | --- |
| Corrélation argent dépensé ↔ classement | **−0,01** | **0,14** |
| Écurie la plus souvent dans les 3 dernières | 71 % | 67 % |
| Plus longue série dans les 3 dernières | 14,1 | 15,9 (**défavorable**) |
| Haas dans les 3 dernières | 50 % | 53 % (**défavorable**) |
| Mercédès / McLaren dans les 4 premiers | 57 % / 68 % | 40 % / 58 % |
| Écart de frontière 1re–11e, 2056 | 2,44 | 2,81 |

## Finances (4 graines × 10 saisons, M€ par an, avant → après)

| | McLaren | Ferrari | Mercédès | Williams | Alpine | Red Bull | Aston | Cadillac | Haas | Audi | Racing Bulls |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Place moyenne | 2,4 → 2,8 | 3,0 → 3,2 | 3,7 → 4,4 | 5,2 → 5,4 | 5,9 → 6,1 | 6,0 → 5,3 | 7,0 → 7,3 | 7,4 → 7,6 | 8,0 → 8,7 | 8,4 → 7,5 | 9,1 → 7,6 |
| Entretien | 23 → 38 | 23 → 40 | 26 → 49 | 16 → 19 | 15 → 17 | 23 → 40 | 16 → 19 | 12 → 11 | 17 → 20 | 16 → 19 | 17 → 22 |
| Personnel des départements | 77 → 77 | 80 → 80 | 84 → 84 | 44 → 57 | 43 → 56 | 76 → 76 | 65 → 66 | 48 → 56 | 36 → 47 | 57 → 60 | 41 → 55 |
| Développement payé | 68 → 56 | 66 → 51 | 62 → 42 | 88 → 76 | 88 → 79 | 68 → 56 | 85 → 81 | 90 → 87 | 58 → 53 | 87 → 83 | 74 → 72 |
| Dépenses plafonnées | 200 → 203 | 202 → 204 | 202 → 205 | 177 → 183 | 176 → 182 | 197 → 202 | 197 → 197 | 180 → 184 | 140 → 149 | 189 → 192 | 161 → 178 |
| Dividendes | 192 → 184 | 272 → 277 | 242 → 235 | 68 → 63 | 72 → 60 | 142 → 148 | 92 → 93 | 86 → 83 | 33 → 21 | 100 → 92 | 32 → 27 |

## Lecture, dite franchement

1. **Les écarts ne se creusent pas.** L'écart entre la 1re et la dernière voiture ne bouge pas. Le haut de grille tourne davantage :
   l'entretien progressif coûte 15 à 23 M€ par an aux trois grandes écuries, prélevés sur leur développement.
2. **L'argent compte un peu plus, mais toujours peu** : la corrélation passe de −0,01 à 0,14. Les écuries du milieu recrutent (+8 à 15 M€
   de personnel), mais elles versent encore 60 à 90 M€ de dividendes et restent 25 à 35 M€ sous le plafond.
3. **La vraie cause, trouvée pendant la mesure.** Une écurie ne peut pas dépenser plus parce qu'elle n'a pas de projet utile à lancer :
   - une pièce ne progresse que jusqu'à la frontière du **savoir** ;
   - or le savoir gagné par un programme de recherche dépend de la **part** du budget qui lui est donnée, **pas du montant**
     (`technique/index.ts`, `avancerRecherche`) ;
   - 30 % d'un budget de 70 M€ (Mercédès) ou de 120 M€ (Williams) donnent exactement la même recherche, alors que le second coûte bien
     plus cher.

   **Payer plus de recherche n'achète aujourd'hui aucun savoir.** C'est le verrou principal entre l'argent et la performance.
4. **Haas ne s'en sort pas mieux** (53 % des saisons dans les 3 dernières). Son frein, c'est l'argent : le levier A ne lui en donne pas.
5. **Défavorable** : dominations 10 → 12 % ; plus longue série dans le bas 14,1 → 15,9 saisons.

## Mesures futures susceptibles de corriger (D-095 : documentées, pas appliquées)

- **Recherche payée au montant** : le savoir gagné suivrait l'argent réellement mis dans le programme, avec un rendement décroissant, au
  lieu de la part du budget. C'est le levier le plus direct pour que « l'argent serve à quelque chose ». Il est borné par le plafond, donc
  il n'avantage pas les riches au-delà du plafond. Conception à valider.
- **Apport du propriétaire selon le besoin** (levier C, politique des propriétaires) : aujourd'hui, le propriétaire de Mercédès apporte
  environ 136 M€ par an et reprend environ 240 M€ de dividendes. Ce va-et-vient n'a pas de sens économique.
- **Moteurs payants** (levier D).
