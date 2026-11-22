# Rapport — Phase 4 : contrats, mémoire v1 et interactions humaines

**Date :** 22/11/2026 · **Rapports chiffrés :** [équilibrage 100 graines](2026-11-22-p4-equilibrage-100-graines.md) (comparé à la référence P3) · [dilemmes 100 graines](2026-11-22-p4-dilemmes-100-graines.md)

## Résumé

Les personnages négocient, se souviennent et réagissent. Les écuries prolongent ou se séparent de leur personnel, recrutent des remplaçants (plusieurs écuries peuvent viser la même personne, c'est elle qui choisit), font et rompent des promesses. Les relations évoluent selon les souvenirs : ils s'oublient selon les traits de chacun, laissent un résidu durable et se réparent par des excuses. Le porteur peut incarner un team principal dans le **bac à sable**, sur mobile.

**Le monde bouge** : en moyenne 3 nouveaux pilotes titulaires et 4 recrutements de personnel par saison ; environ 32 prolongations et 10 non-prolongations par saison. Sur 50 saisons : 894 personnes, sauvegarde de 0,6 Mo compressée, 10 s de calcul.

## Ce qui a été construit

| Élément | Détail | Fichiers |
| --- | --- | --- |
| 11 traits (D-054) | `risque` et `remiseEnQuestion` ; migration du format 3 au format 4 | `balance/personnages.ts`, `core/sauvegarde.ts` |
| Contrats génériques (D-063) | Types (emploi ; affiliation, financement, placement réservés), clauses structurées, plusieurs contrats possibles, organisations typées | `model/types.ts` |
| Mémoire v1 | Souvenirs (18 étiquettes), relations sur 4 axes, oubli modulé par les traits (la rancune agit sur la durée), résidu, plafond de 40, saturation, réconciliation, protection des événements cités | `systems/memoire/`, `balance/memoire.ts` |
| Promesses et réputation | 5 types vérifiés automatiquement ; réputation publique (parole tenue, fidélité, impitoyable, formateur) | `systems/humain/promesses.ts` |
| Décisions par utilité | Valeur de marché (niveau, âge, courbe du métier, palmarès) ; 7 valeurs avec convictions ×2 ; **lignes rouges situationnelles** (D-067) ; relations comme **seul** canal des souvenirs (pas de double comptage, D-070) ; 3 raisons pour chaque réponse | `systems/humain/decision.ts`, `balance/contrats.ts` |
| Contrats | Négociations à partir de la semaine 30 (offre, contre-offre, offre finale), IA du team principal (continuité, loyauté, relation, âge), conseil pour le team principal, fins de contrat, **remplacement multi-écuries** (D-066), réservoir renouvelé, retraite des personnes libres depuis 3 saisons (provisoire avant 6a) | `systems/humain/contrats.ts` |
| Interactions | Soutenir, critiquer (justifiée ou non, en public ou en privé), féliciter, s'excuser, reconnaître une erreur, discussion privée, statut de n°1, licenciement, demandes et réponses d'augmentation ; réactions de l'IA ; bilan de saison (rivalités, réussite collective, échec personnel) | `systems/humain/interactions.ts` |
| État émotionnel | Moral, confiance en soi, motivation, stress recalculés chaque mois. La confiance agit sur la forme en course ; la motivation du personnel technique agit sur le développement de la voiture | `systems/humain/etat.ts` |
| Bac à sable | Choix d'une écurie, de la personne et de l'action ; réponse, « Pourquoi ? », souvenirs, relation avant/après ; avancer le temps | `ui/diagnostic/Humain.tsx` |
| Dilemmes contrefactuels | 3 dilemmes, score de réussite D-069, horizons de 1, 3 et 5 saisons | `diagnostics/dilemmes.ts`, `npm run dilemmes` |

## Critères de validation

| # | Critère | Résultat |
| --- | --- | --- |
| 1 | Les choix comptent | **Partiellement.** Les effets sont systématiques mais faibles. Rompre une promesse de statut de n°1 fait partir le pilote dans 62 % des cas contre 51 % (5 saisons). Refuser une augmentation au directeur technique fait chuter de 0,3 à 0,4 l'utilité qu'il accorde à une prolongation, mais ne change presque rien en 5 saisons (voir « limites ») |
| 2 | Pas de réponse toujours gagnante | Diagnostic (D-069) : tenir sa promesse gagne dans 82 % des contextes, soutenir plutôt que critiquer dans 88 %. C'est **légitime** pour la promesse ; c'est discutable pour la critique (voir limites). Augmentation : 69 % (25 % d'écarts nuls) |
| 3 | Cascade de référence | **Non observée à 10 %.** Son maillon principal (une écurie rivale qui fait une offre à un cadre mécontent) n'existera qu'avec le marché du travail (phase 7) |
| 4 | Mémoire bornée | **OK.** ≤ 40 souvenirs par personne (test sur 30 saisons) ; 0,6 Mo compressés après 50 saisons |
| 5 | Réparable | **OK.** Les excuses réduisent un souvenir négatif (test) ; le résidu revient lentement vers 0 |
| 6 | Explicable | **OK.** Chaque réponse a 3 raisons, et la ligne rouge éventuelle est nommée |
| 7 | Audit des attributs | Les 7 valeurs et 10 traits sur 11 sont lus. `discretion` : exception validée (D-068). **Constat : `sangFroid` ne sert qu'au stress, que rien n'utilise encore.** À brancher (performance sous pression, phase 13) |
| 8 | Bac à sable | Fonctionne sur mobile (test automatisé). **À éprouver par le porteur** une fois GitHub Pages activé |
| 9 | Comparaison à la référence P3 | Voir ci-dessous |

## Comparaison à la référence de la phase 3 (100 graines × 10 saisons)

| Indicateur | Référence P3 | Phase 4 |
| --- | --- | --- |
| Vainqueurs différents par saison | 6,5 | 5,0 |
| Champions différents sur 10 saisons | 4,1 | 3,6 |
| Dynasties (5 titres consécutifs) | 56 % | 64 % |
| Champion et vice-champion coéquipiers | 59 % | 41 % |
| Part des compétences dans l'écart entre coéquipiers | 10 % | 58 % |
| La dernière écurie marque au moins un point | 45 % | **11 %** |
| Dominations (≥ 120 points d'écart) | 4 % | **17 %** |

### Constat important sur le réglage B (D-059) — à trancher

**La chute de « la dernière écurie marque un point » (de 45 % à 11 %) et la hausse des dominations (de 4 % à 17 %) viennent surtout du réglage B, pas de la phase 4.** Le rapport archivé du réglage B, sans les mécaniques humaines, donne déjà 17 % et 17 %. Je n'avais pas mis ces deux lignes dans le tableau soumis à ChatGPT. C'est une erreur de ma part, et la validation s'est faite sans elles.

| Réglage | Dernière écurie marque | Dominations | Part des compétences entre coéquipiers |
| --- | --- | --- | --- |
| Référence (0,10 / 0,30) | 45 % | 4 % | 10 % |
| **A (0,20 / 0,30)** | **38 %** | **14 %** | 30 % |
| B (0,20 / 0,22) — appliqué | 17 % | 17 % | 44 % |
| C (0,25 / 0,25) | 21 % | 22 % | 49 % |

**Proposition : passer au réglage A.** Il garde l'essentiel du gain sur les compétences, et presque tout le suspense en bas de classement. Décision au porteur et à ChatGPT (D-074).

## Calibrages faits pendant la phase (tous dans `balance/`)

| Constat | Correction |
| --- | --- |
| 50 prolongations par saison : contrats d'un an pour tout le personnel de plus de 34 ans | Durée selon les années restantes avant le déclin du métier |
| 71 non-prolongations pour 35 accords : remplacements pour un rien | Prime de continuité (connaître l'écurie a une valeur) |
| Pilotes de plus de 50 ans encore recrutés | Pénalité d'âge au recrutement (en attendant les retraites de la phase 6a) |
| 20 compliments rapprochés pesaient plus qu'un seul | Saturation plafonnée à 1,2 fois l'effet d'un événement |
| Une offre à 30 % de sa valeur acceptée | Socle d'importance de l'argent pour tous, offre insultante sous 60 % |
| Hammilton prolongeait à 6,6 M€ au lieu de 55 | Palmarès dans la valeur de marché, pénalité de baisse de salaire |
| Remplaçants générés trop faibles (11 à 13) | Pilotes générés autour de 14,2 (provisoire avant 6b) |
| Effets des décisions quasi nuls | Poids de la confiance (×1,7), sensibilité du moral, effet de la motivation sur le développement |

## Limites connues et suites

- **Cascade incomplète** : sans offres d'écuries rivales (phase 7), un cadre mécontent ne peut partir qu'à la fin de son contrat. Il ne reste alors que l'effet sur la motivation, donc sur le développement. C'est le prochain levier fort.
- **Critique publique toujours pire que le soutien (88 %)** : aucun mécanisme ne permet encore à une critique justifiée de faire progresser un pilote qui se remet en question. À prévoir avec la progression individualisée (phase 6a).
- **Demandes d'augmentation souvent refusées** (environ 1 sur 3 accordée) : plausible, à surveiller.
- **Lignes rouges** : environ 3 déclenchées par saison sur l'ensemble du paddock.
- `sangFroid` sans effet tant que le stress n'est utilisé nulle part.
- Le **joueur dans le bac à sable** exécute ses commandes immédiatement : c'est équivalent à la file de commandes du moteur, et la partie reste rejouable.
