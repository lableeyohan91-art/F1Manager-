# Levier B — tableau de bord prévisionnel : rapport court (26/11/2026)

> D-180, « ok pour B d'abord » (porteur). Rapport court (D-120). Aucun effet sur l'équilibrage : la prévision ne modifie rien
> (test : monde identique avant et après l'appel).

## Ce qui a été fait

- `previsionFinances(monde, écurie)` (moteur, fonction pure, `src/engine/systems/economie/previsions.ts`) : rejoue les règles comptables
  jusqu'à la fin de l'année. Seuils d'affichage dans `src/engine/balance/previsions.ts`.
- Carte « Prévisions » en tête de l'écran Finances :
  - trésorerie (maintenant, dans 4 semaines, fin de saison, après dividendes) ;
  - recettes garanties et primes de sponsors probables et possibles ;
  - dépenses restantes ;
  - marge sous le plafond ;
  - développement (budget, dépense prévue, budget non dépensé) ;
  - dividendes à venir ;
  - saison suivante (primes à la place actuelle, contrats qui se terminent) ;
  - alertes (dépassement de plafond, trésorerie négative, budget non dépensé, retrait du propriétaire).
- Pas de prévision avant l'établissement du budget de l'année (semaine 1).
- Outil de mesure : `tools/precision-previsions.mts`. Tests : `tests/previsions.test.ts`.

## Précision mesurée (4 graines × 4 saisons, 176 bilans d'écurie, imprévus compris)

| Prévision faite en… | Écart moyen sur la trésorerie de fin d'année | Écart médian (réel − prévu) | Écart relatif médian |
| --- | --- | --- | --- |
| Semaine 2 (janvier) | 24,5 M€ | + 17,3 M€ | 13 % |
| Semaine 14 (avril) | 15,4 M€ | + 9,1 M€ | 5 % |
| Semaine 27 (juillet) | 11,2 M€ | + 5,0 M€ | 3 % |
| Semaine 40 (octobre) | 6,4 M€ | + 1,3 M€ | 2 % |

**Défauts, dits franchement** :
- La prévision reste **un peu pessimiste** : le développement réellement payé ne fait qu'environ 80 % de la prévision. En janvier, la
  prévision suit le budget, alors que les écuries ne peuvent pas tout dépenser. C'est précisément le défaut que le levier A doit corriger.
- Corrections faites pendant la mesure :
  - **Primes de sponsors.** Je ne les comptais pas d'abord : jusqu'à 66 M€ d'écart pour Mercédès. Elles sont maintenant estimées
    selon la situation actuelle : place au championnat, podiums et victoires au rythme actuel, valeur attendue des objectifs de course.
  - **Dépense de projets.** Elle se concentre en début d'année : 39 % le premier mois, moins de 1 % le dernier. La prévision suit
    désormais les Grands Prix restants au lieu du rythme moyen de l'année.
- Imprévus non prévisibles par nature : retrait du propriétaire non annoncé, emprunts, crises.

## Suite

Levier A révisé selon les réponses du porteur (fiche, §E), puis mesures de la campagne complète.
