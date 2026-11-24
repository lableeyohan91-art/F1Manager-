/**
 * Phase 11b — calage reproductible de la voiture de référence sur les vitesses réelles médianes des circuits détaillés.
 * Une seule voiture pour tous les circuits (aucun réglage par circuit, sauf le niveau d'ailerons choisi par le calcul).
 * Critère : écart absolu moyen de vitesse (km/h) sur tous les points de tous les circuits. Recherche par coordonnées.
 * Usage : npx tsx tools/calage-profil.mts   (affiche les valeurs à reporter dans src/engine/balance/profil.ts)
 */
import { readdirSync, readFileSync } from 'node:fs';
import { appuiNaturel, courbures, type Trace } from '../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../src/engine/balance/profil';

const ALTITUDE: Record<string, number> = { cir_monza: 160, cir_monaco: 10, cir_suzuka: 45, cir_singapour: 10, cir_mexico: 2240 };
const traces = readdirSync('data/circuits').filter((f) => f.endsWith('.json')).sort().map((f) => JSON.parse(readFileSync(`data/circuits/${f}`, 'utf8')) as Trace & { points: { v: number }[] });
const ks = traces.map((t) => courbures(t));
/** Adhérence de chaque piste, calée en même temps que la voiture (bornes 0,85–1,15), puis ramenée à une moyenne de 1. */
const piste: number[] = traces.map((t) => t.adherencePiste?.valeur ?? 1);
const BORNES_PISTE: [number, number] = [0.85, 1.15];
type V = typeof VOITURE_REFERENCE;
function erreur(v: V): number {
  let s = 0, n = 0;
  traces.forEach((t, i) => {
    const tp = { ...t, adherencePiste: { valeur: piste[i]!, statut: '' } };
    const p = appuiNaturel(tp, v, { altitudeM: ALTITUDE[t.circuit] ?? 0 }, ks[i]).profil;
    p.vitesses.forEach((x, j) => { s += Math.abs(x * 3.6 - t.points[j]!.v); n++; });
  });
  return s / n;
}
const PARAMS: (keyof V)[] = ['cla', 'cda', 'muMeca', 'muAero', 'muMotricite', 'muFreinage', 'energieElectriqueTourJ', 'reductionTraineeLigne', 'reductionAppuiLigne'];
/** Bornes physiquement plausibles pour une F1 (H) : le calage ne peut pas compenser un effet absent du modèle par une valeur absurde. */
const BORNES: Partial<Record<keyof V, [number, number]>> = {
  cla: [2.5, 5.5], cda: [0.6, 1.4], muMeca: [1.2, 1.9], muAero: [1.2, 2.2], muMotricite: [1.0, 1.7], muFreinage: [1.4, 2.4], energieElectriqueTourJ: [2e6, 9e6], reductionTraineeLigne: [0.1, 0.55], reductionAppuiLigne: [0.1, 0.7],
};
const dansBornes = (k: keyof V, x: number) => { const b = BORNES[k]; return !b || (x >= b[0] && x <= b[1]); };
let v: V = { ...VOITURE_REFERENCE, deploiement: { ...VOITURE_REFERENCE.deploiement } };
let e = erreur(v);
console.log('départ', e.toFixed(2));
for (const pasRel of [0.16, 0.08, 0.04, 0.02]) {
  let ameliore = true;
  while (ameliore) {
    ameliore = false;
    for (const k of PARAMS) {
      for (const sgn of [1, -1]) {
        const x = (v[k] as number) * (1 + sgn * pasRel);
        if (!dansBornes(k, x)) continue;
        const w = { ...v, [k]: x } as V;
        const ew = erreur(w);
        if (ew < e - 0.01) { v = w; e = ew; ameliore = true; console.log(`  ${String(k)} → ${(v[k] as number).toPrecision(4)} : ${e.toFixed(2)} km/h`); }
      }
    }
    for (let i = 0; i < piste.length; i++) {
      for (const sgn of [1, -1]) {
        const avant = piste[i]!, x = avant * (1 + sgn * pasRel / 2);
        if (x < BORNES_PISTE[0] || x > BORNES_PISTE[1]) continue;
        piste[i] = x;
        const ew = erreur(v);
        if (ew < e - 0.01) { e = ew; ameliore = true; console.log(`  piste ${traces[i]!.circuit} → ${x.toFixed(3)} : ${e.toFixed(2)} km/h`); } else piste[i] = avant;
      }
    }
  }
}
// Moyenne des adhérences de piste ramenée à 1 : l'écart est reporté sur les adhérences de la voiture (équivalent physiquement).
const moyP = piste.reduce((a, b) => a + b, 0) / piste.length;
for (const k of ['muMeca', 'muAero', 'muMotricite', 'muFreinage'] as const) (v as Record<string, number>)[k] = v[k] * moyP;
console.log('pistes', Object.fromEntries(traces.map((t, i) => [t.circuit, +(piste[i]! / moyP).toFixed(3)])));
console.log('résultat', JSON.stringify(Object.fromEntries(PARAMS.map((k) => [k, +(v[k] as number).toPrecision(4)]))), 'écart moyen', e.toFixed(2), 'km/h');
