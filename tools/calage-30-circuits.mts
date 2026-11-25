/**
 * Phase 12c (D-175, chantier A1) — recalage de la voiture de référence avec le compromis appui / traînée contrôlé sur les 30 circuits.
 *
 * Calage (inchangé, D-159 décision 6) : vitesses réelles médianes des 5 tracés détaillés de data/circuits (+ écart de temps au tour).
 * Contraintes ajoutées, sur les 30 circuits (aucune vitesse des 25 autres n'entre dans le critère) :
 *   - le réglage d'ailerons optimal doit être à l'intérieur de la plage (une borne signale un effet absent du modèle) ;
 *   - ordre public d'appui (faits connus des écuries, pas des résultats) : les circuits « peu d'appui » (Monza, Las Vegas, Bakou,
 *     Djeddah) se courent avec moins d'appui que les circuits « appui maximal » (Monaco, Hongrie, Singapour, Zandvoort).
 * Validation (hors critère) : écart de vitesse moyen sur les 25 autres circuits, avant et après.
 * Usage : npx tsx tools/calage-30-circuits.mts   (affiche les valeurs à reporter dans src/engine/balance/profil.ts)
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { appuiNaturel, courbures, type Trace } from '../src/engine/circuits/profil';
import { NIVEAUX_AILERONS, VOITURE_REFERENCE } from '../src/engine/balance/profil';

type T = Trace & { points: { v: number }[]; altitudeM: number; tempsTourS: { mediane: number } };
const lire = (d: string) => readdirSync(d).filter((f) => f.startsWith('cir_') && f.endsWith('.json')).sort().map((f) => JSON.parse(readFileSync(`${d}/${f}`, 'utf8')) as T);
const calage = lire('data/circuits');
const autres = [...lire('data/circuits/validation'), ...(existsSync('data/circuits/reconstruits') ? lire('data/circuits/reconstruits') : [])];
const tous = [...calage, ...autres];
const ks = new Map(tous.map((t) => [t.circuit, courbures(t)]));
/** Ordre public d'appui (H : connaissance commune des réglages des écuries). */
const PEU_APPUI = ['cir_monza', 'cir_lasvegas', 'cir_bakou', 'cir_jeddah'];
const APPUI_MAX = ['cir_monaco', 'cir_hungaroring', 'cir_singapour', 'cir_zandvoort'];
/** Pénalités (km/h équivalents, H) : par circuit dont le réglage optimal touche une borne ; par paire de l'ordre public violée. */
const PENALITE_BORNE_KMH = 1.5;
const PENALITE_ORDRE_KMH = 3;
type V = typeof VOITURE_REFERENCE;

/** Plafond d'écart de vitesse par circuit de calage (km/h) : garde-fou des tests (±20 km/h par circuit), avec une marge. */
const PLAFOND_CIRCUIT_KMH = 19;
const PENALITE_PLAFOND_PAR_KMH = 2;
function niveauxEtEcarts(v: V, liste: T[]) {
  let s = 0, n = 0, eTemps = 0, depassement = 0;
  const niveaux: Record<string, number> = {};
  for (const t of liste) {
    const r = appuiNaturel(t, v, { altitudeM: t.altitudeM ?? 0 }, ks.get(t.circuit));
    niveaux[t.circuit] = r.niveau;
    let sc = 0;
    r.profil.vitesses.forEach((x, j) => { const e = Math.abs(x * 3.6 - t.points[j]!.v); s += e; sc += e; n++; });
    depassement += Math.max(0, sc / r.profil.vitesses.length - PLAFOND_CIRCUIT_KMH);
    eTemps += (100 * Math.abs(r.profil.tempsS - t.tempsTourS.mediane)) / t.tempsTourS.mediane / liste.length;
  }
  return { kmh: s / n, tempsPct: eTemps, niveaux, depassement };
}
function erreur(v: V) {
  const c = niveauxEtEcarts(v, calage);
  const a = niveauxEtEcarts(v, autres);
  const niveaux = { ...c.niveaux, ...a.niveaux };
  const bornes = Object.values(niveaux).filter((x) => x <= NIVEAUX_AILERONS.min + 1e-9 || x >= NIVEAUX_AILERONS.max - 1e-9).length;
  let ordre = 0;
  for (const b of PEU_APPUI) for (const h of APPUI_MAX) if (niveaux[b]! >= niveaux[h]!) ordre++;
  return { total: c.kmh + c.tempsPct + PENALITE_PLAFOND_PAR_KMH * c.depassement + PENALITE_BORNE_KMH * bornes + PENALITE_ORDRE_KMH * ordre, calage: c, validation: a, bornes, ordre, niveaux };
}
const BORNES: Partial<Record<keyof V, [number, number]>> = {
  cla: [2.5, 6.5], cda: [0.6, 1.4], muMeca: [1.2, 1.9], muAero: [1.2, 2.2], muMotricite: [0.7, 1.7], muFreinage: [1.3, 2.4], energieElectriqueTourJ: [2e6, 9e6],
  reductionTraineeLigne: [0.2, 0.95], reductionAppuiLigne: [0.2, 0.95], finesseIncrementale: [2.0, 6], partAppuiAileron: [0.25, 0.55], partTraineeAileron: [0.25, 0.55],
};
const PARAMS = Object.keys(BORNES) as (keyof V)[];
const ok = (k: keyof V, x: number) => x >= BORNES[k]![0] && x <= BORNES[k]![1];
const resume = (r: ReturnType<typeof erreur>) => `total ${r.total.toFixed(2)} | calage ${r.calage.kmh.toFixed(2)} km/h, ${r.calage.tempsPct.toFixed(2)} % | validation ${r.validation.kmh.toFixed(2)} km/h, ${r.validation.tempsPct.toFixed(2)} % | bornes ${r.bornes}/30 | ordre violé ${r.ordre}`;
let v: V = { ...VOITURE_REFERENCE, deploiement: { ...VOITURE_REFERENCE.deploiement } };
let r = erreur(v);
console.log('départ  ', resume(r));
for (const pas of [0.16, 0.08, 0.04, 0.02]) {
  let ameliore = true;
  while (ameliore) {
    ameliore = false;
    for (const k of PARAMS) for (const sgn of [1, -1]) {
      const x = (v[k] as number) * (1 + sgn * pas);
      if (!ok(k, x)) continue;
      const w = { ...v, [k]: x } as V;
      const rw = erreur(w);
      if (rw.total < r.total - 0.01) { v = w; r = rw; ameliore = true; console.log(`  ${String(k)} → ${(x).toPrecision(4)} : ${resume(r)}`); }
    }
  }
}
console.log('résultat', JSON.stringify(Object.fromEntries(PARAMS.map((k) => [k, +(v[k] as number).toPrecision(4)]))));
console.log('final   ', resume(r));
console.log('niveaux', Object.entries(r.niveaux).sort((a, b) => a[1] - b[1]).map(([c, x]) => `${c.replace('cir_', '')} ${x.toFixed(2)}`).join(' · '));
