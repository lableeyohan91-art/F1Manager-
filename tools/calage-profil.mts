/**
 * Phase 11b — calage reproductible de la voiture de référence sur les vitesses réelles médianes des circuits détaillés.
 * Une seule voiture pour tous les circuits (aucun réglage par circuit, sauf le niveau d'ailerons choisi par le calcul).
 * Critère : écart absolu moyen de vitesse (km/h) sur tous les points, plus l'écart moyen de temps au tour (%, poids 1 km/h par %). Recherche par coordonnées.
 * Usage : npx tsx tools/calage-profil.mts [paramètres séparés par des virgules | pistes (adhérences des pistes seules)]   (affiche les valeurs à reporter dans src/engine/balance/profil.ts)
 */
import { readdirSync, readFileSync } from 'node:fs';
import { appuiNaturel, courbures, type Trace } from '../src/engine/circuits/profil';
import { NIVEAUX_AILERONS, VOITURE_REFERENCE } from '../src/engine/balance/profil';

/** Poids de l'écart de temps au tour dans le critère : 1 km/h d'écart moyen de vitesse « vaut » 1 % d'écart de temps au tour (H). */
const POIDS_TEMPS_KMH_PAR_POURCENT = 1;
const traces = readdirSync('data/circuits').filter((f) => f.startsWith('cir_') && f.endsWith('.json')).sort().map((f) => JSON.parse(readFileSync(`data/circuits/${f}`, 'utf8')) as Trace & { points: { v: number }[]; altitudeM: number; tempsTourS: { mediane: number } });
const ks = traces.map((t) => courbures(t));
/** Adhérence de chaque piste, calée en même temps que la voiture (bornes 0,85–1,15), puis ramenée à une moyenne de 1. */
const piste: number[] = traces.map((t) => t.adherencePiste?.valeur ?? 1);
const BORNES_PISTE: [number, number] = [0.85, 1.15];
type V = typeof VOITURE_REFERENCE;
/**
 * Contrainte de plausibilité (fait public, comme les bornes) : à Monza, les écuries mettent moins d'appui qu'à Monaco.
 * Le calage rejette tout jeu de paramètres qui la viole ; il n'impose aucun niveau d'ailerons précis, seulement cet ordre.
 */
const CONTRAINTE_AILERONS: [string, string] = ['cir_monza', 'cir_monaco'];
/**
 * Phase 12a (refonte D-163) : ordre public complémentaire, lu sur deux circuits de validation (jamais calés sur leurs vitesses) :
 * Las Vegas se court avec moins d'appui que le Hungaroring. Et le réglage optimal doit rester À L'INTÉRIEUR de la plage sur ces
 * 7 circuits : un réglage collé à une borne signale un effet absent du modèle (c'était le défaut constaté, ailerons au maximum).
 */
const CONTRAINTE_VALIDATION: [string, string] = ['cir_lasvegas', 'cir_hungaroring'];
const tracesContrainte = CONTRAINTE_VALIDATION.map((id) => JSON.parse(readFileSync(`data/circuits/validation/${id}.json`, 'utf8')) as Trace & { altitudeM: number });
const ksContrainte = tracesContrainte.map((t) => courbures(t));
/** Pénalité (km/h) par circuit dont le réglage optimal touche une borne de la plage (H). */
const PENALITE_BORNE_KMH = 6;
/** Pénalité (km/h) d'un ordre public d'appui violé (H, forte : l'ordre doit être respecté au résultat). */
const PENALITE_ORDRE_KMH = 10;
function erreur(v: V): number {
  let s = 0, n = 0, eTemps = 0;
  const niveaux: Record<string, number> = {};
  traces.forEach((t, i) => {
    const tp = { ...t, adherencePiste: { valeur: piste[i]!, statut: '' } };
    const r = appuiNaturel(tp, v, { altitudeM: t.altitudeM ?? 0 }, ks[i]);
    niveaux[t.circuit] = r.niveau;
    r.profil.vitesses.forEach((x, j) => { s += Math.abs(x * 3.6 - t.points[j]!.v); n++; });
    eTemps += (100 * Math.abs(r.profil.tempsS - t.tempsTourS.mediane)) / t.tempsTourS.mediane / traces.length;
  });
  tracesContrainte.forEach((t, i) => { niveaux[t.circuit] = appuiNaturel(t, v, { altitudeM: t.altitudeM ?? 0 }, ksContrainte[i]).niveau; });
  // Ordre violé : forte pénalité, croissante avec l'écart (et non un rejet sec, pour que la recherche puisse partir d'un état qui la viole).
  let violations = 0;
  for (const [bas, haut] of [CONTRAINTE_AILERONS, CONTRAINTE_VALIDATION]) {
    if (niveaux[bas] !== undefined && niveaux[haut] !== undefined && niveaux[bas]! >= niveaux[haut]!) violations += PENALITE_ORDRE_KMH * (1 + niveaux[bas]! - niveaux[haut]!);
  }
  const bornes = Object.values(niveaux).filter((a) => a <= NIVEAUX_AILERONS.min + 1e-9 || a >= NIVEAUX_AILERONS.max - 1e-9).length;
  return s / n + POIDS_TEMPS_KMH_PAR_POURCENT * eTemps + PENALITE_BORNE_KMH * bornes + violations;
}
const TOUS: (keyof V)[] = ['cla', 'cda', 'muMeca', 'muAero', 'muMotricite', 'muFreinage', 'energieElectriqueTourJ', 'reductionTraineeLigne', 'reductionAppuiLigne', 'finesseIncrementale', 'partAppuiAileron', 'partTraineeAileron'];
/** Paramètres recalés : tous par défaut, ou une liste (ex. « cda,muMotricite ») pour un recalage partiel après une correction ciblée. */
const PARAMS: (keyof V)[] = process.argv[2] === 'pistes' ? [] : process.argv[2] ? (process.argv[2].split(',') as (keyof V)[]) : TOUS;
/** Bornes physiquement plausibles pour une F1 (H) : le calage ne peut pas compenser un effet absent du modèle par une valeur absurde. */
const BORNES: Partial<Record<keyof V, [number, number]>> = {
  // Phase 12a : les réductions de l'aéro active ne portent plus que sur les ailerons (ils s'ouvrent presque entièrement en ligne droite).
  cla: [2.5, 6.5], cda: [0.6, 1.4], muMeca: [1.2, 1.9], muAero: [1.2, 2.2], muMotricite: [1.0, 1.7], muFreinage: [1.4, 2.4], energieElectriqueTourJ: [2e6, 9e6], reductionTraineeLigne: [0.2, 0.95], reductionAppuiLigne: [0.2, 0.95], finesseIncrementale: [2.5, 6], partAppuiAileron: [0.3, 0.55], partTraineeAileron: [0.25, 0.45],
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
const moyP = PARAMS.length === 0 ? 1 : piste.reduce((a, b) => a + b, 0) / piste.length;
for (const k of ['muMeca', 'muAero', 'muMotricite', 'muFreinage'] as const) (v as Record<string, number>)[k] = v[k] * moyP;
console.log('pistes', Object.fromEntries(traces.map((t, i) => [t.circuit, +(piste[i]! / moyP).toFixed(3)])));
console.log('résultat', JSON.stringify(Object.fromEntries(TOUS.map((k) => [k, +(v[k] as number).toPrecision(4)]))), 'écart moyen', e.toFixed(2), 'km/h');
