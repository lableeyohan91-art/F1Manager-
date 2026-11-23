# Phase 8c — Qui sait quoi : fuites, rumeurs, réputation perçue

> Statut : principes **VALIDÉS** (fiche phase 8 §8, D-132). Formules et valeurs ci-dessous : choix de mise en œuvre (D-134, à discuter), toutes dans `src/engine/balance/information.ts`, indicatives (D-120).

## 1. Faits suivis

- **Ce qui est suivi.** Seuls certains événements **privés** sont suivis : ceux qui intéressent les autres. Chacun a un **intérêt** (0 à 1) :

  | Type d'événement | Intérêt |
  | --- | --- |
  | promesse rompue | 1 |
  | découverte technique | 1 |
  | licenciement privé | 0,8 |
  | tension financière | 0,8 |
  | offre de débauchage | 0,7 |
  | critique privée | 0,6 |
  | coupe budgétaire | 0,6 |
  | emprunt | 0,5 |
  | candidature spontanée | 0,5 |
  | promesse tenue | 0,4 |
  | refus de négociation | 0,4 |
  | soutien privé | 0,3 |
  | demande d'augmentation | 0,3 |

  Les événements de simple fonctionnement (offres ordinaires, programmes de recherche, reconceptions…) ne sont pas suivis.
- **Qui sait au départ.** Les personnes qui y participent. Pour une écurie, son team principal et son directeur technique ; pour les finances, aussi son directeur financier.
- **Volumes bornés.**
  - Au plus `connaisseursMax` personnes savent un fait. Au-delà, il devient public : trop de monde est au courant.
  - Au plus `faitsMax` faits suivis à la fois ; le plus ancien est retiré.
  - La diffusion s'arrête après `dureeDiffusion` semaines. Le fait reste connu de ceux qui le savent jusqu'à son effacement normal du journal.

## 2. Fuites (chaque semaine)

Pour chaque fait suivi encore jeune, chaque personne qui le connaît peut en parler à **une** personne qu'elle connaît :

- **Probabilité** = `tauxBase × intérêt × (1,5 − discrétion / 20)`. Une personne discrète en parle trois fois moins qu'une bavarde.
- **Destinataire.** Il est choisi parmi les relations de la personne, au prorata de la familiarité et de l'affinité. À défaut, c'est un collègue de son écurie. Il peut travailler dans **une autre écurie** : c'est ainsi qu'une information sort d'une équipe.
- **Rumeur.** Le récit est **déformé** (exagéré) avec la probabilité `deformation.base + deformation.manqueProfessionnalisme × (1 − professionnalisme / 20)`. Le destinataire reçoit alors une **rumeur**, pas le fait exact. Une rumeur reste une rumeur quand elle est répétée.
- **Croyance.** Le destinataire croit ce qu'on lui dit selon sa **confiance envers la source** : `croyance = 0,5 + 0,5 × confiance`, entre 0 et 1. Une rumeur pèse `amplification` fois plus qu'un fait exact (l'exagération), multipliée par cette croyance.

## 3. Révélation publique

- **Médias.** Chaque semaine, un fait suivi peut être révélé par la presse, avec la probabilité `revelation.base × intérêt × (nombre de personnes qui savent / connaisseursMax)`.
- **Seuil.** Un fait connu de `connaisseursMax` personnes devient public d'office.
- **Effet.** Le fait devient public, avec sa version exacte. Un événement « révélé » est créé, avec le fait comme cause. La réputation publique en tient alors compte.

## 4. Réputation perçue

`réputationPerçue(observateur, acteur)` reprend la réputation publique (phase 4). Elle y ajoute les **faits privés que l'observateur connaît**, avec les mêmes poids, multipliés par sa croyance, et par l'amplification pour une rumeur.

Elle remplace la réputation publique dans l'utilité d'une offre, quand la personne ne connaît pas le team principal. Ce qu'on a entendu dire d'un dirigeant pèse donc sur la décision.

## 5. Avant-projets de règlement (lien avec la 8b)

- **Avant-projets.** Les réformes sont préparées par la fédération dès la semaine `semaineAvantProjet` de l'année des propositions, en **avant-projet**. Elles ne sont publiées qu'en semaine 12.
- **Fuite d'un avant-projet.** Chaque semaine, une écurie peut en avoir vent, avec la probabilité `base × (politique du team principal / 20) × (0,5 + prestige / 20)`. Un événement privé informe son team principal et son directeur technique.
- **Ce que l'écurie en sait.** Elle connaît les intensités **approximativement** : chaque domaine est perçu avec un écart (`bruitIntensite`) propre à elle, borné entre 0 et 1. À la publication, tout le monde connaît les intensités exactes.
- **Effet sur la recherche.** Une écurie informée peut orienter un programme vers l'avant-projet, ce que la commande vérifie. L'IA le fait selon ses intensités perçues. Elle prend de l'avance, à ses risques : l'avant-projet peut être rejeté, et sa perception peut être fausse.

## 6. Ce qui n'est pas fait en 8c

- **Souvenirs des tiers.** Apprendre qu'un dirigeant a rompu une promesse envers un collègue ne crée pas de souvenir personnel (« injustice ») chez celui qui l'apprend. Seule la réputation perçue en tient compte. C'est à décider avec les groupes sociaux en 8d.
- **Écran.** L'affichage des rumeurs au joueur (« on dit que… ») viendra avec l'interface (phase 10) et les médias (phase 11). Les données sont déjà là.
