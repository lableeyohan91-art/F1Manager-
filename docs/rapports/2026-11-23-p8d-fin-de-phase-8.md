# Rapport court — Phase 8d et fin de la phase 8

> Date : 23/11/2026. Mesures **indicatives** (D-120), sans recalibrage (D-095).
> Conditions identiques aux références précédentes, mêmes graines :
> - 100 graines × 10 saisons, comparées à la référence `p8c` ;
> - 50 graines × 20 saisons, comparées à la référence `p8ab-20saisons` ;
> - diagnostics sur 20 graines (15 ou 20 saisons).
>
> Références conservées : `docs/rapports/reference/p8d-*`. Toutes les lignes suivies figurent dans `p8d-reference*.md` ; ce rapport court reprend celles qui bougent ou qui comptent.

## 1. Ce qui a été fait (quatre livraisons, chacune testée et poussée)

| Livraison | Contenu | Décision |
| --- | --- | --- |
| **8d-1 Équipe des stands** | Équipe collective adossée au département des stands : rapidité et précision (avec plafond), cohésion, fatigue, expérience, plan d'entraînement, recrutement par vagues, départs d'hiver. Nouveau poste de chef d'équipe (marché du personnel). Commandes et IA. | D-135 |
| **8d-2 Démissions et ruptures** | Envie de partir, demandes de départ à l'amiable, démissions (non-concurrence, trahison ressentie), ruptures négociées proposées par l'employeur. Commandes et IA. | D-136 |
| **8d-3 Groupes sociaux** | Lien social, détection annuelle, leader, types (clan, opposants, mentor, anciens collaborateurs, collègues). Les membres suivent leur leader, les opposants dégradent le climat. | D-137 |
| **8d-4 Politique** | Président de la fédération élu tous les 4 ans, lobbying sur les propositions de réforme, votes sur le plafond et les restrictions aérodynamiques, alliances. | D-138 |

**Formats et tests.**
- Formats de sauvegarde 22 à 24, chacun avec sa migration et son test.
- **184 tests** (21 nouveaux).

**Corrections faites en chemin.**
- **Sponsor orphelin.** Un sponsor accompagnant restait lié à un pilote parti hors marché. Il suit désormais son pilote, ou le partenariat prend fin.
- **Optimisation des départs.** Le calcul des départs passe de 29 s à 5,8 s sur 50 saisons, sans changer un seul résultat (empreintes vérifiées).

## 2. Mesures

### Vie humaine et politique (20 graines × 15 saisons)

| Indicateur | Valeur |
| --- | --- |
| Stands : rapidité / précision / cohésion moyennes | 60 / 60 / 67 (sur 100) |
| Stands : écart de rapidité entre la meilleure et la moins bonne équipe | 26 points |
| Stands : fatigue moyenne / part de l'équipe renouvelée par saison | 37 / 15 % |
| Demandes de départ par saison (toutes écuries) : acceptées / refusées | 2,6 : 1,6 / 1,0 |
| Démissions | **0** (aucune dans un monde sans conflit) |
| Ruptures négociées proposées par l'employeur | 0,4 par saison, toutes acceptées |
| Groupes sociaux : nombre moyen / taille moyenne | 6,2 / 5,7 personnes |
| Groupes par type | collègues, mentors, clans, anciens collaborateurs à parts proches ; opposants : **presque aucun** |
| Membres qui suivent leur leader | 0,13 par saison |
| Élections / intérims (président recruté par une écurie) | une tous les 4 ans / 0,12 par saison |
| Lobbying | environ 1 action par saison |
| Votes plafond / restrictions : adoptés / rejetés | à peu près moitié-moitié |
| **Plafond budgétaire après 15 saisons** (départ 215 M€) | **de 194 à 258 M€** selon la partie (médiane 226) |
| Alliances | 3 (les trois familles de motoristes) |

### Règlements et information (20 graines × 20 saisons, comparés à la 8c)

| Indicateur | 8c | 8d |
| --- | --- | --- |
| Champion qui garde son titre, année d'une réforme / autres années | 47 % / 61 % | 49 % / 56 % |
| Faits révélés publiquement par saison | 3,8 | 6,1 (nouveaux faits diffusables : demandes de départ, lobbying…) |
| Orientations adoptées | variées | variées (aéro un peu moins souvent) |

### Équilibrage général

| Indicateur | Avant (8c / 8ab) | Après (8d) |
| --- | --- | --- |
| **Dynasties** (5 titres consécutifs ou plus), séries de 10 saisons | 55 % | **60 %** (défavorable) |
| **Dynasties**, séries de 20 saisons | 68 % | **72 %** (défavorable) |
| Plus longue série de titres, 20 saisons | 6,2 | 5,9 |
| Champions constructeurs différents, 20 saisons | 4,6 | 4,3 (défavorable) |
| Écuries sans victoire sur 20 saisons | 0,3 | 0,5 (défavorable) |
| Part des victoires de l'écurie dominante | 60 % / 52 % | 60 % / 52 % |
| Écart 1re–dernière voiture (10 / 20 saisons) | 1,56 / 1,17 | 1,57 / 1,18 (**toujours hors objectif** sur 20 saisons) |
| La dernière écurie marque (10 saisons) | 62 % | 64 % |
| Remontées de 3 places ou plus (20 saisons) | 18,9 | 19,5 |

### Performances (50 saisons, graine 1)

Total : **111 s**, contre 80 s avant la 8d sur la même machine. Dont :
- départs : 5,8 s ;
- stands : 3,5 s ;
- politique et groupes : 1,5 s ;
- le reste vient d'un marché plus actif, puisque les départs créent du mouvement.

## 3. Lecture franche

- **Tout fonctionne et reste mesuré.** Les équipes des stands se distinguent nettement : 26 points d'écart de rapidité entre la meilleure et la moins bonne. La fatigue oblige à choisir entre s'entraîner et récupérer. Les départs à l'amiable existent sans hémorragie. Les groupes émergent sans être fabriqués. La politique produit des votes disputés.
- **Défavorable : les dynasties remontent un peu** (de 55 à 60 % sur 10 saisons, de 68 à 72 % sur 20). C'est dans la marge du bruit statistique, environ ±5 points, mais dans le mauvais sens. Je vois deux causes plausibles, à vérifier lors de la grande campagne :
  1. **Le lobbying aide les écuries en tête.** Elles ont de l'avance de savoir et de l'argent : les réformes proposées leur ressemblent davantage. C'est réaliste, mais cela réduit l'effet « rebattre les cartes ». On le voit d'ailleurs : le champion garde son titre 56 % du temps hors réforme, contre 61 % avant.
  2. **La dérive du plafond.** Selon le président élu, il peut monter jusqu'à 258 M€, ce qui avantage les écuries riches.

  Je ne corrige rien maintenant (D-095). Le test à faire : mesurer avec le lobbying, puis avec les votes de plafond, neutralisés un par un.
- **À surveiller.**
  - **Aucune démission ni groupe d'opposants dans un monde « calme ».** Les team principals de l'IA ne provoquent presque jamais de conflit. Ces mécanismes se déclencheront surtout avec un joueur maladroit ou des crises. C'est cohérent, mais invisible dans les mesures actuelles.
  - **Le plafond peut bouger de ±20 %.** C'est un choix fort : à valider par toi.
  - **Faits révélés : 6 par saison**, ce qui fait peut-être beaucoup. On en jugera avec les médias (phase 11).

## 4. Questions pour toi (à trancher au point)

1. **D-134 à D-138** : ce sont mes choix de mise en œuvre de la 8c et de la 8d, notés « à discuter ». La 8c est validée ; les autres attendent ta validation.
2. **Lien social (D-137).** Je l'ai limité aux groupes. Faut-il l'étendre aux relations elles-mêmes, pour que les collègues s'apprécient et s'estiment au quotidien ? Ce serait une remise en cause de la mémoire v1 (D-070), qui touche toutes les décisions.
3. **Plafond budgétaire votable de 80 à 120 %** de sa valeur de départ : est-ce trop large ?
4. **Nombre de Grands Prix** : il n'est pas encore soumis au vote, car le calendrier en dépend partout. Faut-il le prévoir plus tard ?
5. **Ingénieurs clés individualisés** (question 10 de la phase 8) : toujours ouverte. Les groupes et les départs fonctionnent pour l'instant sans eux.
