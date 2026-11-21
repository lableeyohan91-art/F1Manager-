# Architecture générale

> Statut : technologies **VALIDÉES** (D-001 à D-006). Organisation interne **PROPOSÉE**, à affiner en phase 1.

## 1. Trois couches étanches

```
┌───────────────────────────────────────────────────────────┐
│ INTERFACE (Preact)  src/ui/         écrans, diagnostic    │
│   lit l'état (lecture seule) ─────► envoie des commandes  │
└───────────────▲───────────────────────────┬───────────────┘
                │ instantanés               │ commandes
┌───────────────┴───────────────────────────▼───────────────┐
│ MOTEUR  src/engine/   (Web Worker sur mobile, Node en test)│
│   noyau · systèmes · IA · mémoire · équilibrage            │
└───────────────▲───────────────────────────┬───────────────┘
                │ chargement                │ écriture
┌───────────────┴───────────────────────────▼───────────────┐
│ DONNÉES   data/ (CSV/JSON de départ)  ·  IndexedDB (parties)│
└───────────────────────────────────────────────────────────┘
```

- **L'interface ne modifie jamais l'état.** Elle envoie des commandes et reçoit des instantanés (copies en lecture seule).
- **Le moteur ne connaît pas l'interface.** Le même code tourne dans le navigateur (Web Worker, pour ne pas figer l'écran) et dans Node (tests, simulations longues).
- **Les données de départ sont modifiables sans toucher au code** : fichiers CSV qui s'ouvrent dans Excel.

## 2. Organisation des dossiers (proposée)

```
src/
  engine/
    core/          noyau : identifiants, hasard, calendrier, boucle, événements, commandes, sauvegarde
    model/         types des entités (personne, écurie, contrat…)
    systems/       un dossier par système (finances, resultats, memoire, marche…)
    ai/            décisions des écuries et des personnes (utilité)
    balance/       TOUS les coefficients, nommés et commentés
    generation/    création du monde et simulation historique
    diagnostics/   indicateurs, rapports, audit des attributs
  ui/
    diagnostic/    interface de diagnostic (phase 2 et suivantes)
    game/          écrans du jeu (phase 10 et suivantes)
  cli/             lanceur sans écran (simulations, rapports, tests contrefactuels)
data/              données de départ : noms par nationalité, écuries, paramètres
tests/             tests automatiques
docs/              conception
```

## 3. L'état du monde

- L'état est un ensemble de **tables** (une par type d'entité), indexées par identifiant. Pas d'objets imbriqués qui se référencent entre eux : les liens passent par les identifiants. Cela rend la sauvegarde, la copie (tests contrefactuels) et la migration triviales.
- Les **index** (par ex. « contrats actifs d'une écurie ») sont recalculés au chargement. Ils ne sont pas sauvegardés.
- Les données **calculées** (état émotionnel, valeur d'une relation) sont soit recalculées, soit mises en cache avec une règle d'invalidation explicite.

## 4. La boucle de simulation

Un pas = une semaine (proposition D-028). À chaque pas, les systèmes s'exécutent **toujours dans le même ordre** :

1. Calendrier (rendez-vous de la semaine)
2. Résultats (si Grand Prix)
3. Finances
4. Travail des départements
5. Personnes (état émotionnel)
6. Décisions de l'IA → commandes
7. Marché du travail (traitement des commandes contractuelles)
8. Mémoire (souvenirs, diffusion, oubli mensuel)
9. Médias (plus tard)

Des **phases de saison** encadrent la boucle : intersaison, présaison, saison, fin de saison. Certains systèmes ne tournent qu'à certaines phases (retraites en fin de saison, par exemple).

## 5. Commandes et événements

```
Commande ──► validation (mêmes règles pour joueur et IA) ──► application
                                                               │
                                     événement(s) + causes ◄───┘
                                               │
                         mémoire, réputation, médias, diagnostic
```

- Une **commande** a un auteur, une date, des paramètres. Elle est refusée avec un motif lisible si elle n'est pas valide.
- Un **événement** décrit ce qui s'est passé, qui est concerné, sa visibilité, son importance et ses causes.
- Le journal des commandes, ajouté à la graine, suffit à rejouer une partie à l'identique.

## 6. Déterminisme et hasard

- Générateur pseudo-aléatoire à graine, petit et maison (pas de dépendance).
- **Un flux par système**, dérivé de la graine du monde et du nom du système. Ajouter un tirage dans le marché du travail ne change pas les résultats des courses.
- Interdits dans le moteur : `Math.random`, `Date.now`, `new Date()`, l'ordre d'itération non garanti. Les parcours de tables se font dans l'ordre des identifiants.
- Un test automatique vérifie que deux simulations identiques produisent un état identique.

## 7. Sauvegarde

- Format : l'état en JSON, compressé, avec un en-tête (version de format, version du jeu, graine, date de jeu).
- Stockage : IndexedDB sur le téléphone. Export et import d'un fichier possibles (comme dans Paddock).
- **Migrations** : une fonction par changement de version (v1 → v2 → v3…), chacune testée.
- Taille visée : moins de 5 Mo compressés après 50 saisons. C'est rendu possible par les règles d'oubli (voir [systemes/memoire.md](systemes/memoire.md)).

## 8. Outils de l'équipe de conception

| Outil | Rôle | Phase |
| --- | --- | --- |
| Lanceur sans écran (`cli`) | `simuler --graine 42 --saisons 10` produit une sauvegarde et un rapport | 1 |
| Rapport de diagnostic | Indicateurs chiffrés, comparés aux résultats cibles | 1, enrichi ensuite |
| Interface de diagnostic | Consulter écuries, personnes, contrats, relations, souvenirs, événements, raisons | 2, enrichie ensuite |
| Bac à sable | Déclencher une interaction à la main et observer la réaction | 4 |
| Test contrefactuel | `contrefactuel --graine 42 --a ... --b ... --saisons 3` | 4 |
| Audit des attributs | Liste des attributs, des formules qui les lisent et de leur influence mesurée | 4 |
| Chronique | Récit lisible des saisons simulées | 3, enrichie ensuite |

## 9. Performances visées

| Mesure | Cible |
| --- | --- |
| Une saison simulée sur téléphone de milieu de gamme | moins de 10 s |
| 50 saisons sur PC (lanceur sans écran) | moins de 2 min une fois tous les systèmes en place |
| Personnes actives | ~1 000 (≈ 4 000 au total avec les retraités) |
| Chargement d'une sauvegarde | moins de 2 s |

Pour tenir ces cibles, aucun système ne doit comparer chaque personne avec chaque autre. Les relations sont « creuses » : on ne stocke que celles qui existent.

## 10. Dépendances externes

Le moins possible. Chaque ajout est justifié dans `docs/decisions.md`. Prévues : Preact, Vite, Vitest, un plugin PWA pour Vite, une bibliothèque de compression. Aucune dépendance dans le cœur du moteur, à part la compression.
