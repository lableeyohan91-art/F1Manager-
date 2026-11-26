/**
 * Levier B (prototype) — l'offre du pilote soutenu aide-t-elle vraiment l'écurie ? Mesure par paires : chaque graine est jouée sans puis avec
 * l'offre (paramètre `pilotesSoutenus`). Pour chaque offre acceptée (écurie E, saison A), on compare la place de E au championnat
 * constructeurs pendant les 5 saisons suivantes, avec et sans l'offre (même graine), ainsi que l'argent reçu et le développement payé.
 * Usage : npx tsx tools/mesure-pilote-soutenu.mts <graine de départ> <nombre> <saisons> <sortie.json>
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const [g0, ng, S, sortie] = [Number(process.argv[2]), Number(process.argv[3]), Number(process.argv[4] ?? 30), process.argv[5]];
type Run = { places: Record<string, Record<number, number>>; dev: Record<string, Record<number, number>>; accepte: { ecurie: string; annee: number; cheque: number; sponsor: number; ecart: number }[]; refus: number };
function jouer(g: number, actif: boolean): Run {
  const m = sc.creerMonde(g); if (actif) m.parametres = { pilotesSoutenus: 1 };
  const mo = sc.creerMoteur();
  // Les détails des événements sont compactés au fil des ans (mémoire bornée) : on les relève chaque saison.
  const vus = new Set(Object.keys(m.evenements));
  const accepte: Run['accepte'] = []; let refus = 0;
  for (let s = 0; s < S; s++) {
    mo.avancer(m, s === S - 1 ? 54 : 52);
    for (const [id, x] of Object.entries(m.evenements) as [string, { type: string; date: { annee: number }; acteurs: { id: string; role: string }[]; contexte: Record<string, number> }][]) {
      if (vus.has(id)) continue; vus.add(id);
      if (x.type === 'pilote_soutenu.accepte') accepte.push({ ecurie: x.acteurs.find((a) => a.role === 'ecurie')!.id, annee: x.date.annee, cheque: x.contexte['cheque']!, sponsor: x.contexte['sponsor']!, ecart: x.contexte['reference']! - x.contexte['niveau']! });
      if (x.type === 'pilote_soutenu.refus') refus++;
    }
  }
  const places: Run['places'] = {}, dev: Run['dev'] = {};
  for (const s of Object.values(m.tables['saisons']) as { annee: number; constructeurs: { ecurie: string }[] }[]) s.constructeurs.forEach((c, i) => ((places[c.ecurie] ??= {})[s.annee] = i + 1));
  for (const fi of Object.values(m.tables['finances']) as { ecurie: string; historique: { annee: number; developpement: number }[] }[]) for (const h of fi.historique) (dev[fi.ecurie] ??= {})[h.annee] = h.developpement;
  return { places, dev, accepte, refus,
  };
}
const res = [];
for (let g = g0; g < g0 + ng; g++) { res.push({ graine: g, sans: jouer(g, false), avec: jouer(g, true) }); console.log(`graine ${g}`); }
writeFileSync(sortie, JSON.stringify(res));
