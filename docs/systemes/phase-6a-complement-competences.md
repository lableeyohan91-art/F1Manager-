# Phase 6a complémentaire — Compétences des pilotes, expérience, circuits, affinités

> Statut : **VALIDÉE** (D-104 à D-108, 22/11/2026) — **réalisée** (rapport `docs/rapports/2026-11-22-p6a-complement-competences.md`). Demande du porteur et de ChatGPT ; analyse critique de Claude Code acceptée (virages moyens supprimés, 2 attributs mentaux créés au lieu de 8, affinités légères dès maintenant, notes des pilotes réels fixées par Claude Code).
> Méthode : D-095 (mesurer, ne pas recalibrer). Chaque attribut a une formule qui le lit (§7).

## 1. Compétences des pilotes (liste définitive)

| Compétence | Nature (vieillissement, 6a) | Rôle dans le modèle abstrait |
| --- | --- | --- |
| Freinage | technique | Part du « rythme », pondérée par l'exigence de freinage du circuit |
| Virages lents | technique | Part du rythme, selon la part de virages lents du circuit |
| Virages rapides | physique (engagement, condition du cou) | Part du rythme, selon la part de virages rapides du circuit |
| Motricité (sortie de virage) | technique | Part du rythme, selon l'exigence de motricité du circuit |
| Dépassement | technique | Poids fixe dans le niveau |
| Défense | technique | Poids fixe |
| Départs | physique (réflexes) | Poids fixe |
| Pluie | technique | Remplace une grande part du rythme quand il pleut |
| Gestion des pneus | expérience | Poids modulé par la dégradation des pneus du circuit |
| Retour technique | expérience | Poids fixe (servira au développement et aux réglages, phases 12 et 13) |
| Condition physique | physique | Poids modulé par l'exigence physique du circuit |
| Régularité | expérience | Poids fixe ; risque d'incident ; amplitude de la forme du jour (phase 13, D-103) |
| **Intelligence de course** (nouvelle) | expérience | Poids dans le niveau ; c'est elle qui permet à un vétéran malin de battre un jeune plus rapide |
| Adaptabilité (compétence générale existante) | transversale | Réduit le handicap d'un circuit découvert et d'une nouvelle écurie |

**Supprimé** : « vitesse ». La vitesse d'un pilote est désormais le résultat de ses qualités de rythme face aux exigences de chaque circuit.

**Non retenus** (doublons) :
- **concentration** : fusionnée avec régularité ;
- **gestion des risques** : elle découle du trait « goût du risque » et de l'intelligence de course ;
- **combativité** : elle découle des traits ambition, goût du risque et tempérament, et des compétences dépassement et défense.

**Génération** : les quatre compétences de rythme partagent une composante commune (le style), ce qui évite des profils incohérents. Les points forts et faibles individuels s'y ajoutent.

## 2. Qualités mentales

| Attribut | Type | Rôle |
| --- | --- | --- |
| Sang-froid | trait existant | **Erreurs sous pression** dans les courses décisives (§4) ; stress (phase 4) |
| Professionnalisme | trait existant | Progression et déclin (6a) |
| Goût du risque | trait existant | Décisions (phases 4 et 5) |
| **Résilience** (nouveau trait) | trait | Vitesse à laquelle le moral et la confiance remontent après un coup dur, et résistance à leur chute |
| Régularité, intelligence de course | compétences | §1 |

Les traits sont innés et stables ; les compétences se travaillent et progressent (6a).

## 3. Expérience réelle

Compteurs par pilote, tous à rendements décroissants :
- Grands Prix disputés ;
- courses sous la pluie ;
- luttes pour le titre (pilote encore en course pour le titre à la dernière manche) ;
- courses par circuit ;
- Grands Prix avec l'écurie actuelle ;
- courses juniors (en 6b).

| Effet | Formule (provisoire, `balance/carriere.ts`) |
| --- | --- |
| Progression des compétences d'« expérience » | Le facteur d'expérience **remplace l'âge** comme moteur : multiplicateur de 0,6 (débutant) à 1,4 (vétéran), selon 1 − e^(−GP/60) |
| Circuit découvert | Handicap de 0,4 point de niveau la première fois, qui s'efface en quelques visites ; réduit par l'adaptabilité |
| Nouvelle écurie | Handicap de 0,3 point, qui s'efface en une demi-saison ; réduit par l'adaptabilité |
| Pluie | Chaque course sous la pluie fait un peu progresser la compétence pluie (apprentissage décroissant) |
| Luttes pour le titre | Réduisent le risque d'erreur sous pression (§4) |

L'expérience compense le déclin physique : les compétences d'expérience continuent de progresser quand les compétences physiques baissent.

## 4. Pression et erreurs (modèle abstrait)

Une course est **décisive** pour un pilote s'il fait partie des 4 dernières manches et qu'il peut encore être champion. Pour lui, une erreur coûteuse a une probabilité de :

> base × (1,5 − sang-froid/20) × (1 − 0,6 × expérience des luttes pour le titre)

Une erreur coûte un temps qui fait perdre quelques places. Effet attendu : un pilote rapide mais fragile craque plus souvent en fin de championnat, et un pilote solide et expérimenté tient.

## 5. Circuits aux exigences propres

Nouvelles colonnes de `circuits.csv`, notées de 1 à 5 :
- virages lents, virages rapides, freinage, motricité, lignes droites ;
- dégradation des pneus, exigence physique, difficulté technique, risque d'accident.

Elles **remplacent les 5 profils par type**. Elles déterminent :
- la **répartition du rythme** du pilote (freinage, virages lents, virages rapides, motricité) ;
- le **poids des caractéristiques de la voiture** (virages lents, virages rapides, vitesse de pointe, efficacité aérodynamique, motorisation, gestion des pneus) ;
- le poids des pneus et de la condition physique ;
- l'**influence du pilote** : la difficulté technique amplifie les écarts entre pilotes ;
- le **risque d'incident** (le risque d'accident remplace le multiplicateur « urbain »).

L'influence totale du pilote et de la voiture reste **à la même échelle** qu'avant (poids normalisés), pour ne pas changer l'équilibre par accident.

**Plus tard** (lues uniquement par le moteur de course) :
- possibilités de dépassement et importance des qualifications (phase 13) ;
- rotation des circuits et calendrier évolutif (phase 8, réservoir de 30 circuits, 20 Grands Prix).

## 6. Affinités avec les circuits (version légère)

- Échelle de −2 à +2. On ne stocke que les affinités non neutres.
- Effet : **0,15 point de niveau effectif par cran**, soit ±0,3 au plus.
- **Affinité naturelle** : tirée la première fois qu'un pilote dispute un circuit. Grand Prix à domicile : souvent +1, parfois +2. Ailleurs, un cran est rare.
- **Évolution** sur les événements connus du modèle abstrait :
  - podium, victoire, titre gagné sur ce circuit (vers +) ;
  - abandon sur incident (vers −).
- **La personnalité module la réaction** : le besoin de reconnaissance amplifie le positif, la rancune le négatif.
- **Plus tard** : blessures et souvenirs liés aux lieux (phases 8 et 13).

## 7. Mode développeur

Commande `dev.modifier_personne` (compétence, potentiel ou trait d'une personne). Elle passe par le moteur comme toute modification de l'état : journalisée, rejouable, avec un événement. L'interface de diagnostic propose un interrupteur « mode développeur » qui rend les notes modifiables sur la fiche d'une personne.

## 8. Ce qui lit chaque nouvel attribut

| Attribut | Lu par |
| --- | --- |
| freinage, viragesLents, viragesRapides, motricite | Niveau du pilote sur un circuit (modèle de course) ; progression 6a |
| intelligenceCourse | Niveau du pilote ; progression 6a |
| resilience (trait) | État émotionnel (remontée et chute du moral et de la confiance) |
| experience.* | Progression des compétences d'expérience ; handicaps de nouveauté ; apprentissage de la pluie ; erreurs sous pression ; estimation (6a) |
| affinites | Niveau effectif du pilote sur un circuit |
| Colonnes des circuits | Modèle de course (pilote, voiture, incidents) |

## 9. Données, sauvegarde, tests

- **Pilotes réels** : nouvelles notes fixées par Claude Code (estimations de game design, marquées comme telles), modifiables dans `personnes.csv` ou en mode développeur.
- **Format 8** : migration (la vitesse est répartie entre les quatre compétences de rythme selon un style tiré de façon déterministe ; ajout de l'intelligence de course, de la résilience et des compteurs).
- **Tests de laboratoire** :
  - deux pilotes de même niveau sur des circuits opposés ;
  - prodige contre vétéran ;
  - pilote fragile contre pilote solide en finale ;
  - même pilote en confiance et en méforme ;
  - influence de chaque compétence ;
  - audit des doublons (chaque attribut lu, aucune lecture de « vitesse ») ;
  - mode développeur.
