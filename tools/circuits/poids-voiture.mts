/**
 * Phase 11b — poids des 6 caractéristiques de la voiture par circuit, calculés par le profil de vitesse sur les tracés réels des
 * 24 circuits du calendrier (5 circuits test + 19 de validation). Sortie : data/circuits/poids-voiture-profil.json.
 * Correspondance provisoire (H, jusqu'à la phase 12) entre paramètres physiques et caractéristiques du jeu :
 *   virages lents ← adhérence mécanique + motricité ; virages rapides ← appui ; vitesse de pointe ← traînée ; moteur ← puissance ;
 *   efficacité aéro ← moitié appui + moitié traînée ; gestion des pneus : part D-107 inchangée (le profil d'un tour ne mesure pas l'usure).
 * Normalisation : chaque caractéristique rapportée à sa moyenne sur les 24 circuits (« un point vaut le même gain moyen »).
 * Usage : npx tsx tools/circuits/poids-voiture.mts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, sensibilites, type Trace } from '../../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../../src/engine/balance/profil';
import { poidsVoiture } from '../../src/engine/systems/saison/performance';

const csv = readFileSync('data/grille-2026/circuits.csv', 'utf8').trim().split('\n').slice(1).map((l) => l.split(';'));
const CH = ['lents', 'rapides', 'freinage', 'motricite', 'lignesDroites', 'degradationPneus', 'exigencePhysique', 'difficulte', 'risqueAccident'];
const gains: Record<string, Record<string, number>> = {}, pneus: Record<string, number> = {};
for (const l of csv) {
  const id = l[0]!, f = existsSync(`data/circuits/${id}.json`) ? `data/circuits/${id}.json` : `data/circuits/validation/${id}.json`;
  if (!existsSync(f)) { console.error('trace absente', id); continue; }
  const t = JSON.parse(readFileSync(f, 'utf8')) as Trace & { altitudeM: number };
  const c = { altitudeM: t.altitudeM }, k = courbures(t);
  const { niveau } = appuiNaturel(t, VOITURE_REFERENCE, c, k);
  const g = sensibilites(t, avecAilerons(VOITURE_REFERENCE, niveau), c);
  const p = (x: number) => Math.max(0, x);
  gains[id] = { viragesLents: p(g.adherenceMecanique) + p(g.motricite), viragesRapides: p(g.appui), vitessePointe: p(g.trainee), motorisation: p(g.puissance), efficaciteAero: (p(g.appui) + p(g.trainee)) / 2 };
  const ex = Object.fromEntries(CH.map((k2, i) => [k2, Number(l[7 + i])]));
  pneus[id] = poidsVoiture({ exigences: ex as never, altitudeM: Number(l[5]) }).gestionPneus;
  console.error(id, 'ok');
}
const ids = Object.keys(gains), cles = Object.keys(gains[ids[0]!]!);
const moy = Object.fromEntries(cles.map((k) => [k, ids.reduce((a, i) => a + gains[i]![k]!, 0) / ids.length]));
const sortie: Record<string, Record<string, number>> = {};
for (const i of ids) {
  const rel = Object.fromEntries(cles.map((k) => [k, gains[i]![k]! / moy[k]!]));
  const tot = Object.values(rel).reduce((a, b) => a + b, 0);
  sortie[i] = { ...Object.fromEntries(cles.map((k) => [k, +((rel[k]! / tot) * (1 - pneus[i]!)).toFixed(4)])), gestionPneus: +pneus[i]!.toFixed(4) };
}
writeFileSync('data/circuits/poids-voiture-profil.json', JSON.stringify({ _lisezmoi: 'Phase 11b, expérience (non utilisée par défaut). Voir tools/circuits/poids-voiture.mts.', poids: sortie }, null, 1));
for (const [i, w] of Object.entries(sortie)) console.log(i.padEnd(16), Object.entries(w).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${Math.round(v * 100)}`).join(' '));
