import { resolve } from 'node:path';
const r = resolve('.'); const eng = await import(`${r}/src/engine/index.ts`); const { lireDonneesGrille2026 } = await import(`${r}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(r)); const m = sc.creerMonde(42); sc.creerMoteur().avancer(m, 52 * 10);
const c = new Map<string, number>(); for (const e of m.chronique) c.set(e.type, (c.get(e.type) ?? 0) + 1); console.log(m.chronique.length, c);
for (const e of m.chronique.filter((x: any) => x.resume === x.type)) console.log('SANS TEXTE', e.type);
for (const e of m.chronique.filter((x: any) => x.date.annee >= 2029 && x.date.annee <= 2030)) console.log(e.date.annee, e.date.semaine, e.resume);
const s = (m.tables['saisons'] as any)['ssn_2030']; console.log(JSON.stringify(s.chronique ?? Object.keys(s)).slice(0, 600));
