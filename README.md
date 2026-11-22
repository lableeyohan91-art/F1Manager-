# F1Manager- (nom de travail)

Simulation de management d'écurie de course automobile, sur mobile. Le départ s'inspire de la grille réelle 2026 (noms altérés), puis le monde évolue librement. L'objectif : des carrières de 20 à 50 saisons dans un paddock vivant, qui a une mémoire.

> Nom définitif à choisir. Le jeu ne doit utiliser ni « F1 », ni « Formula 1 », ni aucun nom réel exact d'écurie ou de pilote. Voir [docs/systemes/donnees-initiales.md](docs/systemes/donnees-initiales.md).

## État du projet

**Phases 1 (noyau) et 3 (saisons simulées) : réalisées. Phase 2 (monde et diagnostic) : en grande partie réalisée.** Voir `docs/rapports/`.

## Par où commencer

| Document | Contenu |
| --- | --- |
| [GAME_DESIGN.md](GAME_DESIGN.md) | Vision, principes fondamentaux, philosophie de la mémoire et de l'équilibrage |
| [ROADMAP.md](ROADMAP.md) | Phases, contenu et critères de validation |
| [docs/architecture.md](docs/architecture.md) | Architecture technique générale |
| [docs/decisions.md](docs/decisions.md) | Journal des décisions : validées / à discuter |
| [docs/glossaire.md](docs/glossaire.md) | Vocabulaire commun |
| [docs/systemes/](docs/systemes/) | Une fiche par système (entités, personnalité, mémoire, phases 1 à 3…) |
| [docs/rapports/](docs/rapports/) | Rapports de simulation et de diagnostic |
| [docs/echanges/](docs/echanges/) | Propositions et analyses à relire (notamment par ChatGPT) |
| [CHANGELOG.md](CHANGELOG.md) | Historique des modifications |
| [CLAUDE.md](CLAUDE.md) | Règles de travail du projet |

## Équipe

- **Le porteur du projet** : arbitre final de toutes les décisions.
- **Claude Code** : architecte et développeur principal. Seul à écrire le code du dépôt.
- **ChatGPT** : game design, personnalités, formules, équilibrage, contenu, direction artistique, relecture.

## Technologies retenues

TypeScript, Preact, Vite. Application web installable (PWA), hébergée sur GitHub Pages. Moteur de simulation indépendant de l'interface, déterministe (hasard à graine). Voir [docs/architecture.md](docs/architecture.md).
