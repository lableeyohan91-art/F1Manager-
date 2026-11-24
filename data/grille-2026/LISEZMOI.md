# Jeu de données « grille 2026 »

Situation de départ de la carrière au **1er janvier 2027**, inspirée de la **grille d'ouverture de la saison 2026** de Formule 1. Noms altérés d'une lettre (D-042). Les personnalités, valeurs et relations ne figurent pas ici : elles sont fictives et générées par la simulation.

> **Statut : données de travail, à relire.** Aucun code ne les lit encore (chargement prévu en phase 2). Format et colonnes susceptibles d'évoluer d'ici là.

## Fichiers

Séparateur `;` et encodage UTF-8 : ils s'ouvrent dans Excel (Données → À partir d'un fichier texte/CSV, si les accents s'affichent mal).

| Fichier | Contenu | Lignes |
| --- | --- | --- |
| `ecuries.csv` | 11 écuries : identité, motoriste, niveau de voiture, budget, prestige, culture, philosophie, titres | 11 |
| `motoristes.csv` | 5 motoristes | 5 |
| `personnes.csv` | 22 pilotes, 2 anciens champions (palmarès), 11 team principals, quelques directeurs techniques et sportifs | 46 |
| `contrats.csv` | Contrats des pilotes au départ de 2027 | 22 |
| `carrieres.csv` | Carrières des pilotes depuis 2010 (D-046), et **dates d'arrivée des dirigeants** (une ligne par passage dans une écurie, D-143). Colonnes facultatives `moisDe` et `moisA` (1 à 12) : mois d'arrivée la première année et de départ la dernière, pour un **transfert en cours de saison** (vide = année entière). Deux passages la même année doivent préciser leurs mois, sans se chevaucher | ~88 |
| `palmares.csv` | Champions pilotes et constructeurs de 2010 à 2026 | 17 |
| `circuits.csv` | 24 circuits réels, noms altérés (D-045) | 24 |
| `histoires.csv` | Rivalités et histoires réelles publiquement connues (2010–2026) : porteur, cible (personne ou écurie), type de souvenir, intensité (0,2 à 2), réciproque ou non (D-143) | 22 |

Les postes non renseignés (directeur financier, responsables aéro et conception, pilote de réserve, certains directeurs techniques et sportifs) seront **générés** au chargement, sous forme de personnages fictifs.

## Fiabilité des données

La colonne `verification` indique, pour chaque ligne, ce qui est vérifié et ce qui est estimé.

| Donnée | Fiabilité |
| --- | --- |
| Écuries, motoristes, pilotes titulaires d'ouverture 2026, nationalités, dates de naissance | Vérifiées (sources ci-dessous et connaissances) |
| Team principals | Vérifiés, sauf Alpyne (les sources divergent sur le titre exact) |
| Directeurs techniques et sportifs | Partiellement vérifiés : voir chaque ligne |
| Palmarès 2010–2026 | Vérifié. Titres 2026 confirmés en novembre 2026, saison pas encore terminée |
| Carrières depuis 2010 | De mémoire, à relire. Remplacements ponctuels simplifiés |
| Notes des pilotes (1–20), niveaux de voiture, budgets, salaires, échéances de contrat, prestige, culture | **Estimations** inspirées de la réalité, à ajuster par le porteur et ChatGPT |
| Années de naissance des dirigeants | Approximatives |
| Types et climats des circuits | Estimés |

**Choix de la grille :** c'est la grille d'**ouverture** de 2026. Les changements survenus en cours de saison (remplacements, départs annoncés) sont ignorés, faute de sources concordantes, et pour garder une grille stable (D-049).

## Règle des noms

Une seule lettre modifiée, prononciation conservée quand c'est possible (Ferrari → Ferrary). Pas de nom de sponsor, pas de logo. Les prénoms sont conservés. Tous les noms se modifient ici, jamais dans le code.

## Sources consultées le 22/11/2026

- [Formula1.com – Les équipes 2026](https://www.formula1.com/en/latest/article/who-are-the-2026-formula-1-teams.1lkaenQFrnBNcRxQo28Ckv)
- [Formula1.com – Les team principals 2026](https://www.formula1.com/en/latest/article/who-are-the-2026-team-principals.2Jrw5LEJbEoX2gM5OtFL8K)
- [The Race – Grille 2026](https://www.the-race.com/formula-1/who-will-drive-in-f1-2026-drivers-teams/)
- [The Race – Motoristes 2026](https://the-race.com/formula-1/2026-f1-team-engines)
- [RacingNews365 – Classement 2026](https://racingnews365.com/f1/standings/2026/drivers)
- [Pitdebrief – Organigrammes 2026](https://www.pitdebrief.com/?p=98560)
