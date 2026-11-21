# Rapport de phase 0 — pour relecture et validation

**Auteur :** Claude Code · **Date :** 21/11/2026 · **Destinataires :** le porteur du projet, ChatGPT
**Objet :** synthèse de la phase 0 (cadrage). Ce document se lit seul. Les détails sont dans les fichiers cités.

## 1. Ce qui a été produit

| Document | Contenu |
| --- | --- |
| `README.md`, `CLAUDE.md` | Présentation du projet ; règles de travail et règles techniques non négociables |
| `GAME_DESIGN.md` | Vision, 10 principes fondamentaux, mémoire du monde, personnages, groupes sociaux, monde historique, philosophie d'équilibrage |
| `ROADMAP.md` | 15 phases + jalon A, ordre révisé, critères de validation détaillés des phases 0 à 3 et du jalon A |
| `docs/architecture.md` | 3 couches, dossiers, état en tables, boucle, commandes et événements, hasard à flux séparés, sauvegarde, outils, performances visées |
| `docs/glossaire.md` | ~60 termes définis |
| `docs/decisions.md` | 23 décisions validées, 16 à discuter, classées par urgence |
| `docs/systemes/entites.md` | 14 entités et leurs champs, avec pour chaque champ les systèmes qui le lisent |
| `docs/systemes/personnalite.md` | 5 couches, 9 traits et 7 valeurs proposés, compétences par métier, connaissance incertaine |
| `docs/systemes/memoire.md` | Architecture complète de la mémoire, de la v1 (phase 4) à la v2 (phase 8) |
| `docs/systemes/phase-1/2/3-*.md` | Contenu détaillé, critères de validation, décisions nécessaires |

Aucun code n'a été écrit.

## 2. Comment vos demandes ont été intégrées

| Demande | Traduction |
| --- | --- |
| Mémoire plus tôt | Journal d'événements avec causes dès la **phase 1**. Mémoire v1 (souvenirs, résidu, promesses, confiance, reconnaissance) en **phase 4**, avec les premiers contrats. Mémoire v2 (diffusion, réputation perçue, groupes) en phase 8. |
| Groupes sociaux | Détectés chaque saison à partir du graphe des relations et des expériences communes. Type déduit, leader = le plus respecté. Effet d'entraînement quand le leader part. Jamais créés à la main. |
| Valeurs et convictions | Couche 2 distincte. Une valeur ≥ 17 devient une conviction (ligne rouge) qui peut écarter une option avantageuse. |
| Monde avec histoire | Phase 9 : la simulation historique réutilise le moteur complet sur N années (proposition : 20, configurable). |
| Tester l'expérience tôt | Diagnostic v0 en phase 2, enrichi à chaque phase. Bac à sable d'interactions en phase 4. |
| Philosophie d'équilibrage | Inscrite dans GAME_DESIGN §7 et traduite en critères mesurables (jalon A). |
| Organisation du dépôt | Structure demandée créée. `docs/echanges/` a ses règles de nommage. |

## 3. Points où je suis critique ou prudent

1. **La simulation historique ne peut pas venir tôt.** Elle fait tourner tous les systèmes (contrats, carrières, mémoire, IA). Elle est donc logiquement la dernière brique avant le jalon A. Autre point d'attention : le monde généré au départ est artificiel. Les premières années de la simulation historique seront peu crédibles, le temps que le monde « se rode ». Il faudra peut-être simuler plus longtemps que la durée affichée et n'afficher que les dernières années.
2. **Les convictions peuvent donner l'impression d'un monde incohérent.** Un pilote qui refuse une offre plus avantageuse paraît absurde s'il n'est pas expliqué. Le « Pourquoi ? » doit nommer la conviction (« Il reste par fidélité envers l'écurie qui l'a révélé »). Il faut aussi que ces cas restent rares : sinon, ils deviennent du bruit.
3. **« Crédible » se mesure, « intéressant » est plus difficile.** Je propose d'ajouter des **indicateurs d'intérêt** au rapport de chaque simulation : nombre d'histoires marquantes par saison (chaînes de causes de 3 maillons ou plus), rivalités durables, remontées d'écuries modestes, retournements de situation, carrières remarquables. C'est à valider, et ChatGPT peut aider à les définir.
4. **9 traits + 7 valeurs + compétences, c'est déjà beaucoup.** La règle « un attribut sans effet est supprimé » sera appliquée strictement par l'audit des attributs (phase 4). Je préfère commencer avec moins et ajouter que l'inverse.
5. **Le dépôt est public.** Toute la conception est lisible par n'importe qui. C'est sans risque aujourd'hui, mais c'est au porteur de décider (D-035). GitHub Pages gratuit exige un dépôt public pour un compte gratuit.
6. **Accès de ChatGPT au dépôt.** Je recommande qu'il lise tout, mais n'écrive que dans `docs/echanges/`, et jamais dans le code (D-034). Deux auteurs de code sans coordination = des contradictions.

## 4. Décisions validées (rappel)

TypeScript + Preact + Vite · PWA mobile · GitHub Pages · moteur indépendant de l'interface · déterminisme et hasard à graine · sauvegardes versionnées · modèle de résultat abstrait · 10 écuries · 9 postes individualisés · simulation autonome et mode observateur · agents de pilotes · votes du règlement et politique · caractéristiques partiellement cachées · tests contrefactuels · « Pourquoi ? » · aucune API d'IA obligatoire · saison 2027, univers fictif · mémoire v1 tôt et mémoire résiduelle · groupes sociaux émergents · personnage en 5 couches · monde historique · diagnostic tôt et bac à sable · répartition des rôles (D-001 à D-023).

## 5. Décisions qui nécessitent votre intervention

**Bloquantes pour la phase 1 :**

| ID | Question | Ma proposition |
| --- | --- | --- |
| D-024 | Ordre révisé des phases | Adopter l'ordre de ROADMAP.md |
| D-028 | Pas de temps | 1 semaine |
| D-034 | Accès de ChatGPT au dépôt | Lecture totale, écriture dans `docs/echanges/` uniquement |
| D-035 | Dépôt public ou privé | Public pour l'instant |

**Avant la phase 2 :** D-025 (traits), D-026 (valeurs), D-027 (échelle 1–20), D-029 (les 9 postes), D-032 (monnaie : M€), D-036 (noms du championnat et de l'instance dirigeante), D-037 (français d'abord).

**Avant la phase 3 :** D-030 (20 Grands Prix), D-031 (barème de points), fourchettes cibles de `phase-3-saison.md`.

**Plus tard :** D-033 (durée historique : 20 ans), D-038 (mode sauvegarde unique), D-039 (option Carrera).

## 6. Questions adressées à ChatGPT

1. **Personnalité** : les 9 traits et les 7 valeurs de `personnalite.md` couvrent-ils les comportements recherchés ? Lesquels retirer, fusionner ou ajouter ? Merci de justifier chaque ajout par un comportement observable qu'aucun autre trait ne produit.
2. **Fourchettes cibles** de la phase 3 : sont-elles réalistes ? Lesquelles manquent ?
3. **Indicateurs d'intérêt** (point 3.3) : comment mesurer automatiquement qu'une saison est intéressante à vivre ?
4. **Contenu pour la phase 2** : propositions de nationalités, de noms par nationalité, de 10 profils d'écuries fictives, de 20 circuits fictifs, et de noms pour le championnat et l'instance dirigeante.
5. **Grille de lecture** : pour 10 types d'événements (augmentation refusée, promesse rompue, promotion, licenciement d'un proche, soutien public, consigne d'équipe, etc.), quelles personnalités et valeurs devraient amplifier ou atténuer le souvenir ?
6. **Critique libre** de l'architecture de la mémoire (`memoire.md`) : risques, angles morts, simplifications possibles.

## 7. Étape suivante

Dès que les 4 décisions bloquantes sont tranchées, et les remarques de ChatGPT traitées, la phase 0 sera close et je pourrai démarrer la phase 1 (le noyau, sans aucune règle de jeu).
