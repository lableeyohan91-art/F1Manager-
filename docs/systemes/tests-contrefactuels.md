# Tests contrefactuels — limites actuelles et améliorations prévues

> Statut : **PLAN** (22/11/2026), suite à la relecture de `diagnostics/dilemmes.ts` par ChatGPT. Mise en œuvre progressive : les corrections de validité dès la prochaine itération du laboratoire, les scores enrichis après la phase 5, la réévaluation des dilemmes après les phases 5, 6 et 7 (D-077).

## 1. Limites constatées (version de la phase 4)

| # | Limite | Conséquence | Gravité |
| --- | --- | --- | --- |
| 1 | **Score du personnel** = niveau moyen × part du personnel d'origine encore présent | Il récompense la stabilité en soi : un remplacement par quelqu'un de meilleur fait baisser le score | Forte : biais systématique en faveur de la conservation |
| 2 | **Score financier** = primes − masse salariale des postes clés | Ignore la trésorerie, les indemnités, les engagements futurs, le développement. Quasi constant entre branches | Forte, inévitable avant la phase 5 |
| 3 | **Validité de l'action non vérifiée** | Si la commande est refusée dans une branche (ex. : la personne a déjà quitté l'écurie), on compare deux mondes presque identiques et on conclut « pas d'effet » | Moyenne : peut masquer des effets ou en inventer |
| 4 | **Promesse de statut de n°1** : la prolongation qui la porte peut être **refusée** | On teste alors la rupture d'une promesse qui n'existe pas | Moyenne |
| 5 | **Départ** mesuré par « n'est plus dans l'écurie à la fin » | Un départ suivi d'un retour, ou un licenciement par l'IA, sont confondus avec un départ voulu | Moyenne |
| 6 | **Une seule date** (semaine 20 de 2027) et une écurie par graine | Le contexte (début ou fin de contrat, saison réussie ou ratée) varie peu : les conclusions sont fragiles | Moyenne |
| 7 | **Effet mesuré seulement sur l'écurie** | L'effet sur la personne concernée (moral, relation, carrière, performance) n'apparaît pas | Moyenne |
| 8 | **« A meilleure dans X % des cas »** compte des écarts minuscules | Une différence de 0,001 compte comme une victoire | Forte : surestime le nombre de dilemmes « réussis » |

## 2. Améliorations prévues

### Validité des expériences (prochaine itération du laboratoire)

- **Vérifier l'application** de l'action dans chaque branche : la commande renvoie « acceptée », l'événement attendu existe. Sinon, le contexte est **écarté** et compté à part.
- **Promesse acceptée** : le dilemme « tenir ou rompre » n'est joué que si la prolongation avec promesse a été acceptée dans les deux branches.
- **Typologie des départs** : démission ou refus de prolonger (départ voulu), non-prolongation décidée par l'écurie, licenciement, départ suivi d'un retour. Chaque catégorie est mesurée séparément.
- **Diversité des situations** : plusieurs dates (début, milieu, fin de saison, veille de fin de contrat), plusieurs écuries par graine, contextes classés (écurie en réussite ou en difficulté, personne en fin de contrat ou non, personnalité rancunière ou non). Résultats présentés **par type de contexte**.
- **Effet sur la personne concernée** : moral, confiance envers le décideur, relation avec l'écurie, performance (points pour un pilote, effet sur le développement pour un ingénieur), suite de carrière.

### Ampleur et significativité

- **Taille d'effet** : différence moyenne rapportée à la dispersion naturelle (écart type des scores entre graines), en plus du pourcentage de contextes gagnants.
- **Seuil d'effet significatif** : une différence de score inférieure à **0,01** (sur une échelle de 0 à 1), ou à 0,1 écart type, est classée « **effet négligeable** », et ne compte pas comme une victoire. Les trois catégories sont présentées : A nettement meilleure, B nettement meilleure, négligeable.
- **Intervalles de confiance** (bootstrap sur les graines) pour la différence moyenne.

### Scores enrichis

| Composante | Aujourd'hui | Prévu |
| --- | --- | --- |
| Personnel | Niveau × part du personnel d'origine | Séparer **qualité** (niveau des postes clés), **continuité** (ancienneté utile), **cohésion** (relations internes moyennes, groupes en conflit), **expertise** accumulée (phase 12) et **coût salarial**. Un remplacement bénéfique doit pouvoir **augmenter** le score |
| Finances | Primes − masse salariale | Après la phase 5 : variation de **trésorerie**, indemnités versées, engagements contractuels futurs (salaires restants), dépenses de développement, respect du plafond |
| Sport | Points / points du champion | + progression du classement constructeurs, + évolution de la voiture |
| Confiance | Confiance envers le TP + réputation | + réputation par facette pertinente selon le dilemme |

Les pondérations (D-069) restent configurables **selon la situation de l'écurie** : une écurie en difficulté financière pondère davantage les finances.

## 3. Ce qu'il ne faut pas faire

- **Amplifier les coefficients** pour que les dilemmes « réussissent » (D-077). Si un dilemme a peu d'effet, c'est soit une information juste (toutes les décisions ne comptent pas autant), soit le signe qu'il manque un mécanisme (ex. : le marché du travail pour la cascade du directeur technique).
- Rendre artificiellement la trahison avantageuse pour équilibrer un dilemme (D-069).
