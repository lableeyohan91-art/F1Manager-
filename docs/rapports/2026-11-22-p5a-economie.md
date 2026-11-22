# Rapport — Phase 5a : économie de base

Date : 22/11/2026. Conception : `docs/systemes/phase-5-economie.md` (VALIDÉE, D-078). Méthode : D-076.

## 1. Ce qui a été livré

| Élément | Contenu | Où |
| --- | --- | --- |
| Données de départ | Trésorerie, type de propriétaire, apport, revenus commerciaux des 11 écuries (estimations, colonne `verification`) | `data/grille-2026/finances.csv` |
| Modèle | Propriétaires, finances (trésorerie, budget, comptes de l'année, historique), apparence persistante des personnes (D-080) | `src/engine/model/types.ts`, `model/finances.ts` |
| Sauvegarde | Format 5, migration 4 → 5 testée (finances et propriétaires estimés à partir de l'ancien budget indicatif) | `core/sauvegarde.ts` |
| Comptabilité | Une écriture toutes les 4 semaines (13 par an) ; recettes (primes, commercial, apport) et dépenses plafonnées / hors plafond | `systems/economie/index.ts` |
| Bilan annuel (semaine 1) | Clôture, contrôle du plafond, sanctions (amende = 2 × dépassement ; aéro −10 % ou −25 %), dividendes, historique borné à 30 ans | idem |
| Budget de l'IA | Recettes prévues − dépenses fixes − réserve visée (selon la patience du propriétaire et le goût du risque du team principal) + part de l'excédent ; limité par la marge sous le plafond ; dépassement volontaire possible pour une équipe joueuse et en position de gagner | idem |
| Coupes | Si la trésorerie projetée de fin d'année devient négative : −20 % sur le développement restant | idem |
| Développement | Facteur budget = effort technique sous plafond (voir § 3.1) ; restrictions aéro selon le classement (75 % pour le premier → 115 % pour le dernier) ; sanction aéro | `systems/saison/index.ts` |
| Conseil | Prolongation ou non du team principal (semaine 30) et licenciement en fin de saison selon l'écart au rang attendu (rang des moyens) et la patience du propriétaire. Remplace la règle provisoire de la phase 4 | `systems/economie/index.ts` |
| Diagnostic | Onglet « Finances » : vue d'ensemble, propriétaire, comptes de l'année, bilans passés | `src/ui/diagnostic/Finances.tsx` |
| Outils | `npm run finances -- <graine> <saisons>` (comptes détaillés), `npm run statistiques-finances -- <graines> <saisons>` | `tools/` |
| Laboratoire | Nouveaux indicateurs D-081/D-082 : écuries changeant d'étage par saison, transitions sans changement (étages : rangs 1–4 / 5–8 / 9+) | `diagnostics/indicateurs.ts` |
| Tests | 6 nouveaux tests (62 au total) : présence des données, deux saisons sans dépassement et déterministes, sanction d'un dépassement, restrictions aéro, égalité d'effort au plafond, migration 4 → 5 | `tests/economie.test.ts` |

**Pas encore fait (5b, conformément à la conception)** : sponsors, dette, crises, rachats, projets d'infrastructure. Le joueur ne peut pas encore modifier son budget (commande à ajouter avec l'interface de jeu).

## 2. Écarts à la conception validée — à trancher (D-084 à D-087)

Je les signale explicitement : ce sont des choix faits en cours d'implémentation, après constat sur les premiers essais.

1. **D-084 — Effort technique au lieu du seul budget de développement.** La conception prévoyait facteur = budget de développement / 90. Premier essai : les petites écuries, qui ont moins de salariés, avaient presque deux fois plus de marge sous le plafond (120 M€ contre 66 M€ pour Mercédes), donc elles développaient plus vite. C'était un **avantage caché pour les petits**, contraire à D-081. J'ai remplacé ce poste par l'effort technique, c'est-à-dire toutes les dépenses plafonnées prévues, référence 200 M€. Résultat : toutes les écuries au plafond sont à égalité (≈ 1,06) ; seules celles qui n'ont pas les moyens d'y arriver sont en retrait (Haass ≈ 0,91).
2. **D-085 — Dividendes.** Ce mécanisme n'était pas dans la conception. Sans lui, les écuries riches accumulaient 1 000 à 1 500 M€ en 5 saisons. Désormais, au-delà de 0,6 année de dépenses en trésorerie, le propriétaire retire une part de l'excédent selon son type : fonds 80 %, constructeur 60 %, milliardaire 30 %, etc.
3. **D-086 — Marge de sécurité de 1,5 % sous le plafond.** Sans elle, presque toutes les écuries dépassaient le plafond de 0,1 à 0,5 M€ chaque année, à cause des embauches en cours de saison.
4. **D-087 — Recalibrage des coûts** (provisoire) :
   - coût d'un employé : 0,05 M€ + 0,003 par point de niveau, au lieu de 0,08 + 0,004 ;
   - entretien : 0,25 M€ par niveau d'installation, au lieu de 0,6.

   Avec les valeurs initiales, les frais fixes plafonnés de Mercédes, Ferrary et McLarren dépassaient à eux seuls le plafond, donc dépassement automatique tous les ans.

## 3. Résultats d'équilibrage — conditions identiques

Mêmes graines (1–100 pour 10 saisons, 1–50 pour 20 saisons), mêmes mécaniques hors économie, réglage C2 dans les deux cas.

- **Référence** : le code d'avant l'économie (commit précédent), recalculé avec les nouveaux indicateurs d'étage. Il redonne exactement les valeurs de `p4-c2-reference` (32 % et 64 %), ce qui confirme que les conditions sont identiques.
- **Fichiers** : `docs/rapports/reference/p4-c2-reference-v2.*` et `p4-c2-reference-20saisons.*` (références), `p5a-reference.*` et `p5a-reference-20saisons.*` (nouveau).

### 3.1 Tous les indicateurs suivis — 100 graines × 10 saisons

| Indicateur | Référence C2 | Phase 5a | Écart | Sens |
| --- | --- | --- | --- | --- |
| Vainqueurs de GP différents / saison | 5,88 | 5,99 | +0,11 | ≈ |
| Écuries victorieuses / saison | 3,72 | 3,86 | +0,14 | favorable |
| Part des victoires de l'écurie dominante | 57 % | 57 % | 0 | ≈ |
| Taux d'abandon | 7,8 % | 7,7 % | — | ≈ |
| Écart 1re–dernière voiture (% temps au tour) | 1,73 | 1,55 | −0,18 | favorable (peloton plus resserré) |
| Écart de points P1–P2 | 49,3 | 52,7 | +3,4 | **défavorable** |
| Changements de leader du championnat | 3,63 | 3,44 | −0,19 | **défavorable** |
| Doublés / saison | 5,99 | 6,08 | +0,09 | ≈ |
| Corrélation voiture ↔ points | 0,92 | 0,89 | −0,03 | ≈ |
| Plus forte progression d'une voiture dans la saison | 0,97 | 1,00 | +0,03 | ≈ |
| Victoires inattendues / saison | 2,12 | 2,28 | +0,16 | favorable |
| Courses sous la pluie | 2,73 | 2,73 | 0 | (identique : même hasard) |
| Champions pilotes différents / 10 saisons | 3,96 | 3,87 | −0,09 | **défavorable (léger)** |
| Champions constructeurs différents / 10 saisons | 2,40 | 2,42 | +0,02 | ≈ (aucun progrès) |
| Plus longue série de titres constructeurs | 5,90 | 5,89 | 0 | ≈ (aucun progrès) |
| Écuries sans victoire sur 10 saisons | 5,72 | 4,86 | −0,86 | favorable |
| Remontées (+3 places) | 3,08 | 3,65 | +0,57 | favorable |
| Écuries changeant d'étage / saison | 1,70 | 1,95 | +0,25 | favorable |
| Transitions sans changement d'étage | 29 % | 23 % | −6 pts | favorable (cible D-082 < 20 % : **non atteinte**) |
| La dernière écurie marque ≥ 1 point | 32 % | 44 % | +12 pts | favorable (cible D-081 60–90 % : **non atteinte**) |
| Séries avec ≥ 5 titres consécutifs (dynasties) | 64 % | 66 % | +2 pts | **défavorable** |
| Titre ouvert avant la dernière manche | 36 % | 34 % | −2 pts | **défavorable (léger)** |
| Retournement à la dernière manche | 7,3 % | 6,6 % | −0,7 pt | ≈ |
| Champion et dauphin coéquipiers | 48 % | 48 % | 0 | ≈ |
| Lutte finale entre coéquipiers | 17,5 % | 16,9 % | — | ≈ |
| Lutte finale entre écuries différentes | 18,1 % | 16,7 % | −1,4 pt | **défavorable (léger)** |
| Saisons très serrées (≤ 10 pts) | 14,9 % | 14,0 % | −0,9 pt | ≈ |
| Dominations (≥ 120 pts) | 8,0 % | 9,6 % | +1,6 pt | **défavorable** |
| Coéquipiers : écart moyen | 0,442 | 0,445 | — | ≈ |
| Coéquipiers : part due aux compétences | 31 % | 31 % | — | ≈ |
| Coéquipiers : part due à la forme | 0 % | 0 % | — | (problème connu, D-074) |
| Coéquipiers : part due à l'aléa | 70 % | 69 % | — | ≈ |

### 3.2 Sur 20 saisons — 50 graines

| Indicateur | Référence C2 | Phase 5a | Sens |
| --- | --- | --- | --- |
| Écuries victorieuses / saison | 4,46 | 4,67 | favorable |
| Champions pilotes différents / 20 saisons | 5,96 | 6,18 | favorable |
| Champions constructeurs différents / 20 saisons | 3,74 | 4,00 | favorable (cible D-081 5–8 : **non atteinte**) |
| Plus longue série de titres constructeurs | 7,72 | 7,36 | favorable |
| Écuries sans victoire sur 20 saisons | 1,42 | 0,88 | favorable |
| Remontées (+3 places) | 10,1 | 12,2 | favorable |
| Écuries changeant d'étage / saison | 2,35 | 2,58 | favorable |
| Transitions sans changement d'étage | 20 % | 15 % | favorable (cible < 20 % : **atteinte**) |
| La dernière écurie marque ≥ 1 point | 47 % | 59 % | favorable (cible 60–90 % : **presque**) |
| Dynasties (≥ 5 titres consécutifs) | 86 % | 88 % | **défavorable** (cible « très rares » : **très loin**) |
| Dominations (≥ 120 pts) | 17,3 % | 17,1 % | ≈ (cible < 5 % : **très loin**) |
| Titre ouvert avant la dernière manche | 27,8 % | 28,1 % | ≈ (cible 30–50 % : **non atteinte**) |
| Écart de points P1–P2 | 67,0 | 67,5 | ≈ |
| Saisons très serrées | 12,2 % | 10,6 % | **défavorable** |
| Retournement à la dernière manche | 6,4 % | 5,0 % | **défavorable** |
| Corrélation voiture ↔ points | 0,83 | 0,77 | ≈ (hiérarchie moins figée) |

### 3.3 Santé financière — 30 graines × 20 saisons (6 600 années-écurie)

| Indicateur | Valeur | Commentaire |
| --- | --- | --- |
| Années sous le plafond (< 97 %) | 9,8 % | Presque tout le monde atteint le plafond |
| Dépassements du plafond | 0,55 % (aucun majeur) | Le dépassement volontaire est presque inexistant |
| Trésorerie de fin d'année négative | 0 % | **Aucune crise** |
| Coupes en cours d'année | 0 | Le mécanisme n'est jamais déclenché |
| Licenciements de team principal par le conseil | 0,54 par saison (toutes écuries) | Plausible |
| Dépenses plafonnées (10 % / médiane / 90 %) | 210 / 212 / 212 M€ | Très peu d'écart |
| Trésorerie finale (10 % / médiane / 90 %) | 75 / 227 / 557 M€ | Min 23, max 779 |
| Résultat annuel moyen selon le propriétaire | milliardaire +17, consortium +7, constructeur +6, fonds +4, famille +1 M€ | |

## 4. Lecture franche

- **Ce qui marche** : l'économie tient debout (aucune faillite absurde, pas d'accumulation infinie, pas de dépassement involontaire). Le bas et le milieu de grille se resserrent : la dernière écurie marque plus souvent, la mobilité entre étages augmente, il y a moins d'écuries sans victoire et plus de remontées.
- **Ce qui ne marche pas encore** : le **sommet** n'est pas touché. Dynasties, dominations et titres ouverts restent au niveau de la référence, voire légèrement pires sur 10 saisons. La raison est mesurée : 90 % des années-écurie sont au plafond, donc l'argent ne départage presque personne. Ce sont les compétences et les installations, déjà meilleures chez les grands, qui font la différence, et les restrictions aéro (75 % → 115 %) ne suffisent pas à les compenser.
- **Une économie trop calme** : aucune crise, aucune coupe, presque aucun pari sur le dépassement. C'est attendu, puisque la 5b apporte les sponsors, la dette et les crises. Mais à ce stade, l'économie influence peu le jeu.
- **Pas d'équilibrage artificiel** : aucun bonus pour les petits ni malus pour les grands n'a été ajouté (D-081). Le seul avantage caché détecté, celui des petites écuries au premier essai, a été **supprimé** (D-084).

## 5. Pistes pour la suite (rien n'est appliqué)

Conformément à ta consigne, « on ajustera après la phase 5 ». Pistes systémiques, sans bonus caché :

1. Phase 5b : sponsors liés aux résultats et à la popularité, dette, crises, projets d'infrastructure. C'est là que l'argent pourra départager **au-dessus** du plafond, via les installations, dont les investissements ne sont pas plafonnés.
2. Phase 7 (débauchage) : la mobilité des ingénieurs est le principal levier réel contre les dynasties. Un DT champion attire les offres.
3. Rendements décroissants plus marqués près du plafond technique, et règlements qui changent (phase 8) : ce sont les redistributions historiques de la F1.
4. Restrictions aéro plus fortes (par exemple 70 % → 120 %) : le réglage est simple, mais l'effet est limité, car seuls 3 des 7 axes de la voiture sont concernés.

## 6. Questions pour toi

1. Valides-tu les quatre écarts à la conception (D-084 à D-087) ?
2. Veux-tu qu'une écurie pilotée par le joueur soit, elle aussi, jugée par son conseil, avec un licenciement possible du joueur ? Aujourd'hui, le conseil ignore l'écurie du joueur.
3. On enchaîne sur la 5b (sponsors, dette, crises, infrastructures) ?
