# Phase 12b — rapport : soufflerie, rythmes, fatigue, alertes, événements (25/11/2026)

> Conception validée : D-170 (fiches `phase-12-conception-detaillee.md`, `phase-12-fatigue-evenements.md`). Mise en œuvre : **D-172**.
> Mesures **indicatives** (D-120). Données : `donnees/`.

## 1. Ce qui est fait

| Élément | État |
| --- | --- |
| Barème réel 2026 de soufflerie et de CFD | Fait : 70 % au champion, +5 % par place, 115 % au plus ; 80 h et 2 000 simulations par période à 100 % ; recalcul à mi-saison ; heures perdues si inutilisées ; sanction de dépassement du plafond déduite des heures |
| Trois usages des heures | Fait : expertise (savoir propre au règlement), variantes en CFD (la meilleure en apparence), validation en soufflerie (estimation plus juste, défauts détectés) |
| Recherche de la phase 8 dopée par ses heures (domaines aéro) | Fait |
| Part de soufflerie pour la recherche | Fait : commande commune ; l'IA passe à 60 % quand elle prépare un futur règlement |
| Rythmes allégé, normal, intensif | Fait : commande commune ; surcoût variable de l'intensif (Q11) |
| Fatigue par pôle, une seule jauge | Fait : productivité, incidents, estimations, heures dégradés ; récupération garantie |
| Incidents et défauts cachés | Fait : détectés (retard), défaut de performance ou pièce fragile (moins fiable en course), projet inutilisable si une équipe épuisée cumule les erreurs |
| Stress des responsables | Fait : alimenté par l'intensif et les incidents, sur le stress existant |
| Alertes des responsables | Fait : nées de l'état simulé, perçues imparfaitement (compétence, fatigue, stress) |
| Événements de conception (piste, contradiction CFD/soufflerie, matériau, réorientation) | Fait : ≈ 9 % des projets mesurés ; vérité fixée, estimation imparfaite |
| Dilemmes bloquants (Q10, interprétation « bloquant » **à confirmer**) | Fait : pour le joueur qui ne délègue pas ; l'IA et le DT délégué tranchent tout de suite |
| Écran Technique | Fait : fatigue des pôles, heures de soufflerie et barème, part de la recherche, rythme des projets, dilemmes à boutons |
| Format 32, tests | Fait : 539 tests verts (6 nouveaux), moteur pur, parcours navigateur réussi (34 étapes) |

**Simplification à signaler** : la fatigue est portée par le pôle, pas par chaque responsable. Les responsables ont leur stress (existant), qui pèse sur la fiabilité de leurs alertes.

## 2. Laboratoire : la même écurie, mêmes graines (8 × 4 saisons)

**Williams (milieu de grille)**

| Stratégie | Place moyenne | Gain d'indice | Fatigue moy. / max | Incidents | Dilemmes | Développement payé (M€/an) |
| --- | --- | --- | --- | --- | --- | --- |
| IA (alternance) | 5,00 | 2,55 | 14 / 18 | 0,5 | 3,5 | 66,5 |
| Normal permanent | 5,00 | 2,52 | 12 / 15 | 0,5 | 3,6 | 65,8 |
| **Intensif permanent** | 4,97 | **2,33** | **38 / 53** | **5,8** | **26,5** | 71,4 |
| Soufflerie sur la voiture (0 % recherche) | 4,97 | 2,76 | 14 / 17 | 0,6 | 3,5 | 66,3 |
| Soufflerie sur l'avenir (100 % recherche) | 5,13 | 2,19 | 14 / 18 | 0,5 | 3,6 | 66,0 |
| Barème plat (100 % pour tous) | 4,97 | 2,60 | 14 / 18 | 0,5 | 3,4 | 66,5 |

**Haass (fond de grille)**

| Stratégie | Place moyenne | Gain d'indice | Fatigue moy. / max | Incidents | Dilemmes | Développement payé |
| --- | --- | --- | --- | --- | --- | --- |
| IA (alternance) | 8,03 | 2,46 | 13 / 19 | 0,9 | 2,6 | 42,9 |
| Normal permanent | 8,09 | 2,46 | 11 / 15 | 1,0 | 2,6 | 42,7 |
| Intensif permanent | 8,16 | 2,35 | 37 / 53 | 4,6 | 22,6 | 44,6 |
| Soufflerie sur la voiture | 8,03 | 2,67 | 12 / 19 | 0,9 | 2,3 | 42,6 |
| Soufflerie sur l'avenir | 8,56 | 1,79 | 13 / 19 | 0,4 | 2,5 | 42,0 |
| Barème plat | 8,00 | 2,43 | 12 / 19 | 1,1 | 2,6 | 43,0 |

**Lecture franche**

Ce qui marche :
- **L'intensif permanent est une mauvaise stratégie.** Moins de progrès, onze fois plus d'incidents, un pôle durablement fatigué, plus d'argent dépensé. Le normal reste parfaitement viable.

Ce qui ne marche pas :
- **Les heures de soufflerie n'ont presque aucun effet mesurable.**
  - Le barème plat donne le même résultat que le barème réel, pour Williams comme pour Haass.
  - C'est l'inverse de ta demande (« la soufflerie doit apporter un vrai plus »). **Objectif non atteint.**
  - Cause : les trois usages sont trop faibles. Une heure vaut environ 0,012 point de savoir, et l'écart d'heures entre le champion et le dernier ne se voit pas à côté du reste.
- **Préparer l'avenir coûte sur 4 saisons**, sans que le bénéfice se voie dans cette fenêtre. Il faut une mesure à travers une réforme : la campagne de 30 saisons ci-dessous.
- **L'IA n'utilise presque jamais l'intensif à bon escient.** Elle passe en intensif seulement si l'équipe est fraîche et l'enjeu fort, puis revient au normal. Le gain de l'intensif ponctuel ne ressort donc pas.
- **Trop d'alertes en intensif permanent** : environ 6,6 dilemmes par saison, **bloquants** pour le joueur. C'est cohérent (l'équipe est surmenée), mais cela peut lasser.
- **Aucun échec ni pièce fragile observés** : la fatigue ne dépasse pas 53 sur ces fenêtres. Ces conséquences graves n'existent que si l'on pousse plus fort, par exemple avec plus de projets simultanés.

## 3. Hiérarchies sur 30 saisons (10 graines, mêmes graines)

| Indicateur | Avant 12a | 12a | V5 (12a) | 12b |
| --- | --- | --- | --- | --- |
| Champions constructeurs différents | 6,3 | 3,7 | 4,6 | **3,7** |
| Remontées (+3 places) | 38,9 | 9,4 | 17,1 | 13,8 |
| Plus longue série de titres | 6,2 | 8,1 | 7,8 | 7,9 |
| Écuries changeant d'étage par saison | 3,8 | 2,1 | 2,6 | 2,3 |
| Vainqueurs différents par saison | 7,4 | 5,9 | 6,7 | 6,0 |
| Victoires inattendues par saison | 1,6 | 1,4 | 1,5 | 1,8 |
| Dernière écurie avec au moins 1 point | 80 % | 36 % | 40 % | 46 % |
| Séries avec 5 titres consécutifs ou plus | 70 % | 90 % | 80 % | 90 % |
| Écart 1re–dernière voiture | 0,98 % | 1,58 % | 1,49 % | 1,50 % |

La 12b seule ne change pas la hiérarchie, ce qui est logique puisque la soufflerie pèse trop peu (§2).

## 4. Ce que je propose de tester ensuite (sans rien changer d'office)

1. **Renforcer l'effet réel des heures** (D-170 Q6, levier prévu) :
   - expertise par heure × 3 à 4 ;
   - recherche aéro plus dépendante des heures.
   - Critère : le barème plat doit donner un résultat nettement moins bon que le réel pour une écurie mal classée.
2. **Amplification α** du barème (D-169) : seulement si le point 1 ne suffit pas.
3. **V5** (savoir de fond à 30 % aux réformes, saturation plus rapide), combinée au point 1.
4. **IA** : utiliser l'intensif pour finir une pièce avant un Grand Prix, puis repasser en allégé.
5. **Alertes** : en intensif, une alerte par pôle toutes les 6 semaines au lieu de 4, pour réduire les blocages.
