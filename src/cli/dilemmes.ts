/**
 * Rapport des tests contrefactuels de dilemmes (phase 4).
 * Exemple : npm run dilemmes -- --graines 100 --sortie docs/rapports/dilemmes.md
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { performance } from 'node:perf_hooks';
import { creerScenarioGrille2026, DILEMMES, jouerDilemme, type ResultatDilemme, type Score } from '../engine';
import { lireDonneesGrille2026 } from '../platform/node/donnees';
import { lireArguments } from './arguments';

const args = lireArguments(process.argv.slice(2));
const nGraines = Number(args['graines'] ?? 100);
const horizons = (args['horizons'] ?? '1,3').split(',').map(Number);
const sc = creerScenarioGrille2026(lireDonneesGrille2026());

const f = (x: number, d = 3) => x.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d });
const pct = (x: number) => `${Math.round(100 * x)} %`;
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / (v.length || 1);
const ecartType = (v: number[]) => { const m = moy(v); return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, v.length - 1)); };

const t0 = performance.now();
const md: string[] = [
  `# Tests contrefactuels des dilemmes — ${nGraines} graines`,
  '',
  'Pour chaque graine, l’écurie concernée change (graine modulo 11), et la décision est prise en semaine 20 de la saison 2027. Les deux options sont jouées dans deux copies du même monde (tirages locaux, D-057), puis comparées avec le score de réussite D-069 : 40 % sport, 25 % personnel, 20 % finances, 15 % confiance et réputation. Chaque composante est notée de 0 à 1.',
  '',
  '> Le seuil de 80 % n’est qu’un diagnostic (D-069) : une option peut légitimement être meilleure dans la plupart des cas (tenir une promesse, par exemple).',
  '',
];

for (const d of DILEMMES) {
  const res: ResultatDilemme[] = [];
  for (let g = 1; g <= nGraines; g++) {
    const r = jouerDilemme(d, () => sc.creerMonde(g), () => sc.creerMoteur(), horizons);
    if (r) res.push(r);
  }
  md.push(`## ${d.nom} — A : ${d.options[0]} · B : ${d.options[1]}`, '', `${res.length} contextes joués.`, '');
  md.push('| Horizon | Δ score total (A − B) | Écart type | A meilleure | Écart nul | Δ sport | Δ personnel | Δ finances | Δ confiance |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (let i = 0; i < horizons.length; i++) {
    const d0 = (k: keyof Score) => res.map((r) => r.horizons[i]!.a[k] - r.horizons[i]!.b[k]);
    const tot = d0('total');
    md.push(`| ${horizons[i]} saison(s) | ${f(moy(tot))} | ${f(ecartType(tot))} | ${pct(tot.filter((x) => x > 1e-9).length / tot.length)} | ${pct(tot.filter((x) => Math.abs(x) <= 1e-9).length / tot.length)} | ${f(moy(d0('sport')))} | ${f(moy(d0('personnel')))} | ${f(moy(d0('finances')))} | ${f(moy(d0('confiance')))} |`);
  }
  md.push('', `Départ de la personne concernée sur l’horizon le plus long : **${pct(res.filter((r) => r.departA).length / res.length)}** avec A, **${pct(res.filter((r) => r.departB).length / res.length)}** avec B.`, '');
}
md.push(`Durée : ${f((performance.now() - t0) / 1000, 1)} s.`);

const texte = md.join('\n') + '\n';
if (args['sortie']) {
  mkdirSync(dirname(args['sortie']), { recursive: true });
  writeFileSync(args['sortie'], texte);
  console.log(`Rapport écrit : ${args['sortie']}`);
} else console.log(texte);
