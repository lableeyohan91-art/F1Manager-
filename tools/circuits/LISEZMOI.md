# Outils des circuits détaillés (phase 11b)

Tout se relance depuis le dépôt. Les **données brutes** (tours OpenF1) ne sont pas dans le dépôt (D-159, décision 6) : elles se
re-téléchargent à l'identique avec les commandes ci-dessous. Les **traces dérivées** (`data/circuits/*.json`) sont dans le dépôt :
les tests et les diagnostics n'ont besoin d'aucun téléchargement.

## 1. Récupérer les tours réels (Python 3, bibliothèque standard, accès à api.openf1.org)

```
python3 tools/circuits/collecte_tours.py <cache> cir_monza 1293 Qualifying 5
python3 tools/circuits/collecte_tours.py <cache> cir_monaco 1286 Qualifying 5
python3 tools/circuits/collecte_tours.py <cache> cir_suzuka 1281 Qualifying 5
python3 tools/circuits/collecte_tours.py <cache> cir_singapour 1296 Qualifying 5
python3 tools/circuits/collecte_tours.py <cache> cir_mexico 1298 Qualifying 5
```
Les 5 meilleurs tours de qualification 2026 de 5 pilotes différents (la liste exacte des pilotes et tours est inscrite dans
chaque trace, champ `source`).

## 2. Construire les traces de référence

```
python3 tools/circuits/construire_trace.py <cache> cir_monza 5793 11 data/circuits/cir_monza.json
python3 tools/circuits/construire_trace.py <cache> cir_monaco 3337 19 data/circuits/cir_monaco.json
python3 tools/circuits/construire_trace.py <cache> cir_suzuka 5807 18 data/circuits/cir_suzuka.json
python3 tools/circuits/construire_trace.py <cache> cir_singapour 4927 19 data/circuits/cir_singapour.json
python3 tools/circuits/construire_trace.py <cache> cir_mexico 4304 17 data/circuits/cir_mexico.json
```
(longueur et nombre de virages officiels : Wikipédia, `docs/rapports/phase-11b/donnees/fiches-officielles-30-circuits.json`).

## 3. Calcul, calage, tests

```
npx tsx tools/calage-profil.mts            # recalcule la voiture de référence (valeurs à reporter dans src/engine/balance/profil.ts)
npx tsx tools/diagnostic-circuits.mts f.json # modèle contre réel, parts du tour, sensibilités
npx vitest run tests/circuits-profil.test.ts
```

## 4. Neutralisations (vérification par les messages officiels)

`4-verification-neutralisations.py` (OpenF1, courses 2023–2026) et `historique-neutralisations-reel.json` (jeu communautaire CC0).
`5-climat.py` : archives météo Open-Meteo (CC BY 4.0), en attente (quota).

## Relevé v1 des 26 circuits (prototype du 24/11/2026)

`1-tours-reels.py`, `2-elements.py`, `3-sensibilites.py` (+ `config.json`) ont produit `docs/rapports/phase-11b/releve-circuits-v1.md`
(un seul tour par circuit, ancien modèle à une seule adhérence). Conservés pour pouvoir refaire ce relevé à l'identique ; **remplacés**
pour les 5 circuits test par la chaîne ci-dessus (5 tours, modèle séparant adhérence, appui, motricité, freinage, budget d'énergie).
