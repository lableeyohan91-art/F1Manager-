import { resolve } from 'node:path';
const r = resolve('.'); const eng = await import(`${r}/src/engine/index.ts`); const { lireDonneesGrille2026 } = await import(`${r}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(r)); const m = sc.creerMonde(42); const mo = sc.creerMoteur();
const vus = new Map<string, any>();
for (let k = 0; k < 52 * 2; k++) { mo.avancer(m, 1); for (const e of Object.values(m.evenements) as any[]) if (!vus.has(e.id)) vus.set(e.id, e); }
const c = new Map<string, [number, number, string]>(); for (const e of vus.values()) { const x = c.get(e.type) ?? [0, 0, '']; x[0]++; if (e.texte) { x[1]++; x[2] = e.texte; } c.set(e.type, x); }
for (const [t, [n, avecTexte, ex]] of [...c].sort((a, b) => b[1][0] - a[1][0])) console.log(n, avecTexte, t, '|', ex.slice(0, 110));
