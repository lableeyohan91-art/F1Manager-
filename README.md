# F1Manager- (nom de travail)

Simulation de management d'écurie de course automobile, sur mobile. L'univers est fictif. L'objectif : des carrières de 20 à 50 saisons dans un paddock vivant, qui a une mémoire.

> Nom définitif à choisir. Le jeu ne doit utiliser ni « F1 », ni « Formula 1 », ni aucun nom réel d'écurie ou de pilote : ce sont des marques déposées.

## État du projet

**Phase 0 — Cadrage (en cours).** Il n'y a encore aucun code. Le dépôt contient uniquement la conception.

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
