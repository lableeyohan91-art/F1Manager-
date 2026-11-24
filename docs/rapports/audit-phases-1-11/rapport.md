# Audit des phases 1 à 11 : rapport (nuit du 24 au 25/11/2026)

> Demande du porteur : « reprendre les étapes importantes une par une, de la 1 à la 11, avec un audit phase par phase, pour détecter d'éventuels bugs ou problèmes non vus jusqu'ici ».
> Détail de chaque constat et de son état : `constats.md`. Décision correspondante : **D-165**.

## 1. Méthode

- **Six relectures indépendantes**, une par groupe de phases : 1–3, 4 et 9, 5 et 11c, 6 et 7, 8, 10 et 11.
  - Chaque relecture : lecture du code, puis scripts d'essai lancés sur de vraies parties. Le dépôt n'est pas modifié à cette étape.
- **Chaque constat vérifié par Claude Code** avant d'être corrigé. Plusieurs ont été reproduits par un test qui échouait avant la correction.
- Chaque correction a son test : `tests/audit-nuit.test.ts`, 16 tests. Total : **516 tests**, tous verts.
  - Pureté du moteur vérifiée.
  - Parcours complet dans le navigateur réussi (34 étapes, téléphone et ordinateur).
- **Campagne de contrôle (D-076)** : 20 graines × 10 saisons, comparée à la référence d'avant l'audit, dans les mêmes conditions. Voir §4.

## 2. Bilan chiffré

| Groupe | Constats | Corrigés | Corrigés en partie | Documentés | Écartés |
| --- | --- | --- | --- | --- | --- |
| Phases 1–3 (noyau, données, saison) | 16 | 11 | 1 | 4 | 0 |
| Phases 4 et 9 (humains, mémoire, histoire) | 16 | 15 | 1 | 0 | 0 |
| Phase 5 et 11c (économie, sponsoring) | 15 | 9 | 2 | 4 | 0 |
| Phases 6 et 7 (carrières, juniors, marché) | 12 | 6 | 2 | 4 | 0 |
| Phase 8 (règlements, information, stands, politique) | 13 | 11 | 0 | 2 | 0 |
| Phases 10 et 11 (joueur, médias, interface) | 20 | 15 | 2 | 2 | 1 |
| **Total** | **92** | **67** | **8** | **16** | **1** |

« Corrigé en partie » : le défaut principal est corrigé ; un reste mineur est documenté dans `constats.md`.

## 3. Ce qu'il faut retenir, phase par phase

### Phases 1 à 3 : noyau, données, saison
- **Le plus grave : deux parties partageaient des objets.**
  - Une rupture négociée dans une partie modifiait la partie suivante, ce qui cassait le déterminisme.
  - Corrigé : chaque monde reçoit sa propre copie des données.
- `rejouer`, la reconstruction d'une partie à partir de ses commandes, oubliait des commandes. Corrigé.
- Égalités au classement départagées par l'identifiant au lieu de la règle réelle (nombre de 2es places, de 3es…). Sur 54 saisons : 13 cas, jusqu'à 11 M€ d'écart de prime. Corrigé.
- Les Grands Prix ont lieu à la semaine de leur **date réelle**. La pluie suit donc le vrai mois.
- Les sauvegardes sont mieux contrôlées : agenda et file vérifiés ; un contenu plus ancien que son en-tête est refusé.

### Phases 4 et 9 : humains, mémoire, histoire
- **Défaut ancien trouvé (avant la phase 11)** : l'anti-répétition des gestes se trouvait elle-même.
  - Le geste qu'on venait d'enregistrer comptait comme « déjà fait ».
  - Effet : **tous** les soutiens, félicitations et réparations étaient réduits depuis leur création.
  - Corrigé : la vérification a lieu avant l'enregistrement. Ces gestes ont désormais leur pleine valeur, et seule la répétition est freinée.
- Contre-offre d'un team principal au conseil : il partait sans décision (5 cas sur 103). Corrigé.
- **Promesses vides acceptées.** Exemples : promettre la titularisation à un titulaire, le statut de n° 1 à un non-pilote. Elles sont maintenant refusées.
- **Ignorer une demande valait mieux que la refuser.** Désormais, le silence vaut refus au bout du délai, avec les mêmes conséquences.
- Le joueur pouvait sonder sans risque le salaire minimum : une seule ouverture de négociation par semaine désormais.

### Phase 5 et 11c : économie, sponsoring
- **Plafond budgétaire contournable par le joueur.**
  - Le joueur pouvait développer avec un gros budget puis le baisser avant la comptabilité.
  - Corrigé : le budget de développement se modifie **une fois par trimestre** au plus.
- **Un plafond voté sanctionnait l'année déjà écoulée** : 9 écuries sur 11 étaient pénalisées. Chaque année est maintenant jugée avec son propre plafond.
- Versements de la semaine 1 absents des comptes ; retrait d'un ancien propriétaire maintenu après un rachat. Corrigés.
- Sponsors :
  - exclusivité de secteur respectée pour le joueur ;
  - probabilités ramenées au nombre réel de Grands Prix (20 au lieu de 24).

### Phases 6 et 7 : carrières, juniors, marché
- **Prolongation acceptée alors que la personne avait déjà signé ailleurs** : 38 cas en 8 saisons. Résultat : deux contrats sur la même saison et un faux fait public. Corrigé.
- L'académie décidait à la place du joueur (non-prolongation de son titulaire). Corrigé.
- **Pilotes titulaires à 51 ans** : le contrat les protégeait de la retraite. La protection s'arrête désormais à 41 ans.
- Mécènes accordés à des familles aisées. Corrigé.

### Phase 8 : règlements, information, stands, départs, groupes, politique
- Après un départ par commande, un poste restait vacant 19 semaines. Il est maintenant pourvu au passage mensuel.
- Le nouveau président prenait ses fonctions dès la semaine 40. Il entre désormais en fonctions avec la saison suivante.
- Le vote sur le nombre de Grands Prix était annulé quand le nombre était à une borne. Corrigé.
- Chef des stands rattaché par erreur au directeur technique. Corrigé.

### Phases 10 et 11 : joueur, médias, interface
- **Communication déléguée non neutre** : l'équipe du joueur pouvait critiquer publiquement son pilote. Corrigé.
- **« Continuer » laissait passer des décisions** du même type sans les montrer. Corrigé.
- **Débauchage déséquilibré** : le joueur pouvait débaucher le personnel de l'IA, mais pas l'inverse. Les règles sont maintenant identiques des deux côtés (D-012).
- Sauvegardes :
  - quota dépassé et échecs maintenant signalés ;
  - stockage persistant demandé au navigateur ;
  - le message « conservée » n'apparaît que si c'est vrai.
- Faux « record battu » en cas d'égalité ; image qui ne revenait jamais à zéro ; textes de l'écran presse. Corrigés.

### Hors audit, même nuit : pluie
- Vérification contre les 10 dernières éditions réelles des 30 circuits (récits de course, en vérification seulement) :
  - réel : **29 courses humides sur 258 (11,2 %)** ;
  - modèle : 9,0 %.
- La part pluvieuse passe de 0,35 à **0,43**. Un seul facteur global : la répartition entre circuits et entre mois reste celle du climat réel.

## 4. Effet mesuré (campagne de contrôle)

Voir `donnees/campagne-audit-apres.md`, avec la référence d'avant l'audit (`donnees/campagne-audit-reference.md`) et tous les indicateurs suivis.

- Mêmes 20 graines × 10 saisons, mêmes mécaniques que la référence.
- La référence est la campagne « 30 circuits, après », faite avant l'audit et avant le passage de la pluie à 0,43.
- L'écart vient donc des corrections de l'audit **et** de la part pluvieuse.

| Indicateur | Avant l'audit | Après | Lecture |
| --- | --- | --- | --- |
| Courses sous la pluie par saison | 1,7 | **2,2** | Favorable : effet voulu de la pluie vérifiée |
| Vainqueurs différents par saison | 5,7 | 5,7 | Inchangé |
| Écuries victorieuses par saison | 4,0 | 4,0 | Inchangé |
| Part des victoires de l'écurie dominante | 58 % | 59 % | Inchangé |
| Victoires inattendues par saison | 2,2 | 2,0 | Légèrement défavorable |
| Écart de points entre les deux premiers | 55 | 61 | **Défavorable** |
| Titre encore ouvert avant la dernière manche | 35 % | 32 % | **Défavorable** |
| Retournement à la dernière manche | 6 % | 8 % | Favorable |
| Dominations (≥ 120 points d'écart) | 11 % | 14 % | **Défavorable** |
| Séries avec 5 titres consécutifs ou plus | 45 % | **55 %** | **Défavorable, objectif 0–25 % toujours non atteint** |
| Plus longue série de titres constructeurs | 5,0 | 5,3 | Défavorable |
| Écuries sans aucune victoire sur 10 saisons | 3,0 | 3,5 | Défavorable |
| Remontées (+3 places d'une saison à l'autre) | 6,3 | 5,5 | Défavorable |
| Transitions sans changement d'étage | 17 % | 12 % | Favorable |
| Dernière écurie avec au moins 1 point | 54 % | 59 % | Favorable |
| Champions pilotes différents sur 10 saisons | 4,3 | 4,2 | Inchangé |
| Taux d'abandon | 7 % | 7 % | Inchangé |
| Écart 1re–dernière voiture | 1,53 | 1,53 | Inchangé (52 % dans l'objectif) |

Tous les autres indicateurs (luttes, coéquipiers, compétitivité à toutes les positions) sont dans les fichiers complets. Ils bougent d'un point au plus.

**Lecture franche**
- La tendance est **plutôt défavorable sur les dynasties** : séries de 5 titres à 55 %, dominations à 14 %.
- C'est **en grande partie du bruit** :
  - 45 % → 55 %, c'est 2 séries de plus sur 20 ;
  - à cette taille d'échantillon, l'incertitude est d'environ ±11 points.
- Une cause réelle est plausible et va dans ce sens : le plafond budgétaire **n'est plus contournable** et ne sanctionne plus l'année écoulée.
  - Avant, 9 écuries sur 11 étaient pénalisées à tort chaque année de vote, ce qui brassait artificiellement la hiérarchie.
- Conformément à ta consigne, **aucune correction des dynasties avant la fin de la phase 12**. Le problème reste ouvert et prioritaire pour la campagne de la phase 12.
- À confirmer sur 100 graines lors de cette campagne.


## 5. Nouveaux choix de conception à valider (inclus dans D-165)

Ces choix ont été nécessaires pour corriger. Tu peux revenir sur chacun d'eux.

1. **Budget de développement modifiable une fois par trimestre** (au lieu de chaque semaine).
2. **Le personnel du joueur peut être débauché par l'IA**, avec les mêmes règles qu'en sens inverse.
3. **Offre de sponsor tranchée 2 semaines avant l'échéance** (au lieu de l'échéance), pour toucher tout le fixe.
4. **Protection de retraite par le contrat jusqu'à 41 ans** pour un pilote.
5. **Académie confiée à l'équipe** tant qu'il n'existe pas d'écran pour la diriger.
6. **Part pluvieuse 0,43** (vérifiée sur l'historique réel).
7. **Grands Prix placés à la semaine de leur date habituelle.**

## 6. Ce qui n'est pas corrigé, et pourquoi

| Sujet | Raison | Quand |
| --- | --- | --- |
| **Aucune faillite possible** (sauvetage illimité, 5.9) | Choix de jeu : **à trancher par toi** | Question ouverte |
| Rumeurs toujours vraies hors pilotes titulaires (10.6) | Ta décision D-158 : laissé tel quel | — |
| Pas d'écran pour diriger l'académie ni recruter aux stands (10.9) | Interface à concevoir | Phase 12 ou 13 |
| Le joueur ne décide pas de sa propre prolongation (10.19) | À concevoir (fiche) | À planifier |
| Attributs non lus (`cohesion`, `culture`, `responsable`, 1.9) | À brancher sur une formule ou retirer (règle CLAUDE.md) | Phase 12 |
| Résultats des Grands Prix conservés sans limite (≈ 80 ko par saison, 1.12) et journal des commandes non borné (10.20) | Compactage à concevoir ; aucun effet avant de longues parties | Avant la phase 13 |
| Nombres « magiques » restants (5.13, 6.9) | Rangement dans `balance/` sans changer de valeur | Campagne de la phase 12 |
| Anciennes sauvegardes (formats 7 à 24) sans expérience F1 rattrapée (6.6) | Plus aucune partie réelle sur ces formats | — |
| Divers mineurs (1.13, 1.16, 4.16, 5.10, 5.12, 5.14, 5.15, 6.7, 6.10, 6.11, 6.12, 8.9, 8.13, 10.10) | Effet faible ou nul aujourd'hui, détail dans `constats.md` | Au fil des phases |

## 7. Avis franc

- **Les défauts les plus sérieux étaient silencieux.**
  - Ils ne faisaient planter aucun test, mais faussaient le jeu : parties partagées, saturation des gestes, plafond appliqué à la mauvaise année, double contrat.
  - Ils venaient surtout d'**interactions entre systèmes construits à des phases différentes**.
  - Un audit transversal de ce type mérite d'être refait après les phases 12 et 13.
- **Rien n'a été recalibré** (méthode D-095).
  - Les écarts mesurés au §4 viennent des corrections, pas d'un réglage.
  - Les dynasties restent hors objectif, comme convenu, jusqu'à la fin de la phase 12.
