/** Phase 11b — test hors échantillon : adhérence de piste prédite par catégorie (permanent, urbain, semi-urbain), jamais calée par circuit. */
import { readdirSync, readFileSync } from 'node:fs';
import { appuiNaturel } from '../src/engine/circuits/profil';
import { VOITURE_REFERENCE } from '../src/engine/balance/profil';
// Catégorie de revêtement (prédiction par catégorie, jamais par circuit) : moyenne des valeurs calées sur les circuits test de la même catégorie.
const PERMANENT = (1.058 + 1.077) / 2, URBAIN = 0.935, SEMI = (PERMANENT + URBAIN) / 2;
const CAT: Record<string, number> = { cir_bakou: URBAIN, cir_jeddah: URBAIN, cir_lasvegas: URBAIN, cir_madrid: URBAIN, cir_miami: SEMI, cir_montreal: SEMI, cir_albert: SEMI };
const E: number[] = [], E0: number[] = [];
for (const f of readdirSync('data/circuits/validation').sort()) {
  const t = JSON.parse(readFileSync(`data/circuits/validation/${f}`, 'utf8'));
  if (t.annee !== 2026) continue;
  const a = CAT[t.circuit] ?? PERMANENT;
  const p0 = appuiNaturel(t, VOITURE_REFERENCE, { altitudeM: t.altitudeM }).profil;
  const p = appuiNaturel({ ...t, adherencePiste: { valeur: a, statut: '' } }, VOITURE_REFERENCE, { altitudeM: t.altitudeM }).profil;
  const e0 = 100 * (p0.tempsS - t.tempsTourS.mediane) / t.tempsTourS.mediane, e = 100 * (p.tempsS - t.tempsTourS.mediane) / t.tempsTourS.mediane;
  E.push(e); E0.push(e0);
  console.log(t.circuit.padEnd(16), 'adhérence', a.toFixed(3), `écart ${e0.toFixed(1)} % → ${e.toFixed(1)} %`);
}
const m = (x: number[]) => x.reduce((a, b) => a + b, 0) / x.length;
console.log(`moyenne ${m(E0).toFixed(1)} % → ${m(E).toFixed(1)} % ; absolu ${m(E0.map(Math.abs)).toFixed(1)} % → ${m(E.map(Math.abs)).toFixed(1)} %`);
