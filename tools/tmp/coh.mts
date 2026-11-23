import { resolve } from 'node:path';
const r = resolve('.'); const eng = await import(`${r}/src/engine/index.ts`); const { lireDonneesGrille2026 } = await import(`${r}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(r));
for (let g = 1; g <= 20; g++) { const m = sc.creerMonde(g); const mo = sc.creerMoteur();
  for (let s = 0; s < 52 * 10; s++) { mo.avancer(m, 1); if (m.date.semaine === 50) continue; const pb = eng.verifierCoherence(m, { ages: false }); if (pb.length) { console.log(g, m.date.annee, pb.slice(0, 4)); break; } } }
