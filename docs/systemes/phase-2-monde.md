# Phase 2 — Génération du monde et diagnostic v0

> Statut : **PROPOSÉ**. À valider avant le début de la phase 2.
> **Révisé le 22/11/2026** : le départ par défaut est la grille inspirée de la F1 2026 (voir [donnees-initiales.md](donnees-initiales.md)). Le générateur ci-dessous reste nécessaire : pour le jeu de données fictif, le réservoir de juniors et les nouvelles générations. Le chargement des CSV de la grille 2026 et ses contrôles s'ajoutent au contenu de la phase.
> Objectif : un paddock fictif de 10 écuries, crédible et varié, généré à partir d'une graine ou chargé depuis des fichiers modifiables dans Excel, et consultable dans une page de diagnostic.

## Contenu

### 1. Données de départ (`data/`)

| Fichier | Contenu | Format |
| --- | --- | --- |
| `noms/<nationalité>.csv` | Prénoms et noms par nationalité, avec leur fréquence | CSV |
| `nationalites.csv` | Nationalités, poids dans le paddock, pays | CSV |
| `ecuries.csv` | Les 10 écuries de départ (facultatif : si absent, elles sont générées) | CSV |
| `circuits.csv` | Circuits fictifs : nom, pays, type, exigences | CSV |
| `metiers.json` | Métiers, compétences associées, courbes d'âge | JSON |
| `equilibrage/*.json` | Paramètres de génération (âges, fourchettes de compétences, budgets…) | JSON |

Les noms, écuries et circuits fictifs seront proposés par ChatGPT (contenu), puis relus par le porteur.

Chaque fichier est **vérifié au chargement**. Une erreur donne un message clair en français : fichier, ligne, colonne, problème.

### 2. Générateur

1. **Organisations** : 10 écuries, 3 à 4 motoristes, l'instance dirigeante, des propriétaires (personnes ou sociétés), des agences d'agents.
2. **Profils d'écuries variés**, pour éviter 10 clones : grand constructeur historique, écurie privée familiale, nouvelle venue ambitieuse, écurie en déclin, satellite d'un motoriste… Chaque profil fixe des fourchettes (budget, prestige, installations, culture).
3. **Personnes** : les 9 postes individualisés par écurie (90), environ 40 agents et dirigeants d'autres organisations, et un **réservoir** d'environ 250 personnes libres ou dans les catégories inférieures (pilotes juniors, ingénieurs disponibles). Environ 400 personnes au total.
4. **Les 5 couches** pour chaque personne. Personnalité et valeurs tirées selon des distributions paramétrables, compétences cohérentes avec le poste et l'écurie (les meilleures écuries ont en moyenne les meilleurs, avec des exceptions).
5. **Contrats** de départ, avec des échéances étalées (pas tous en fin de saison 2027).
6. **Départements** et **installations** cohérents avec le profil de l'écurie.
7. **Finances de départ.**
8. **Contrôles de cohérence** automatiques (voir les critères).

> Le monde généré en phase 2 n'a pas encore d'histoire. Elle viendra de la simulation historique (phase 9), qui partira justement de ce générateur.

### 3. Diagnostic v0 (première interface)

Page web (Preact), utilisable sur téléphone, **en lecture seule** :

- Liste des écuries → fiche écurie : identité, profil, finances, installations, départements, personnel.
- Liste des personnes, avec filtres (poste, écurie, âge, nationalité) → fiche personne : les 5 couches **en clair** (c'est un outil de conception, rien n'y est caché), contrat, organisation.
- Liste des contrats.
- Bouton « Nouveau monde » avec choix de la graine, pour comparer des mondes.
- Export JSON du monde.

L'interface de diagnostic est un outil pour l'équipe de conception. Ce n'est pas l'interface du jeu. Elle reste sobre et reprend le style sombre de Paddock.

## Critères de validation

| # | Critère | Comment on le vérifie |
| --- | --- | --- |
| 1 | Monde complet généré en moins d'1 s | Lanceur sans écran |
| 2 | Même graine = même monde | Test automatique |
| 3 | Aucun poste clé vide, aucun contrat orphelin, âges plausibles par métier | Contrôles de cohérence automatiques |
| 4 | Modification dans Excel → rechargement sans erreur ; erreur volontaire → message clair | Test manuel par le porteur + tests automatiques |
| 5 | Variété : les 10 écuries se distinguent sur au moins 4 des 6 dimensions (budget, prestige, culture, philosophie, installations, âge moyen du personnel) | Rapport automatique |
| 6 | Diagnostic consultable sur téléphone | Test du porteur sur son téléphone |
| 7 | Crédibilité ressentie | Le porteur et ChatGPT relisent 3 mondes (3 graines) et les jugent crédibles et variés |

## Décisions nécessaires avant de démarrer

D-025 et D-026 (traits et valeurs), D-027 (échelle), D-029 (les 9 postes), D-032 (monnaie), D-036 (noms fictifs), D-037 (langue).
