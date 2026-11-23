import { creerScenarioGrille2026, envieDePartir, table, TABLES } from '../../src/engine';
import { lireDonneesGrille2026 } from '../../src/platform/node/donnees';
const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const m = sc.creerMonde(1); const mo = sc.creerMoteur();
for (let a = 0; a < 4; a++) { mo.avancer(m, 52);
  const ps = (Object.values(table(m, TABLES.personnes)) as any[]).filter((p) => p.statut === 'actif' && p.ecurie && !p.poste.startsWith('pilote') && p.poste !== 'team_principal');
  const v = ps.map((p) => ({ p, ...envieDePartir(m, p) })).sort((x, y) => y.envie - x.envie);
  const q = (f: number) => v[Math.floor(f * (v.length - 1))]!.envie.toFixed(2);
  console.log(m.date.annee, 'n', v.length, 'max', q(0), 'p10', q(0.1), 'med', q(0.5), 'top3', v.slice(0, 3).map((x) => `${x.p.poste}:${x.envie.toFixed(2)} ${JSON.stringify(Object.fromEntries(Object.entries(x.raisons).map(([k, y]) => [k, (y as number).toFixed(2)])))} mot${x.p.etat.motivation}`).join(' | '));
}
