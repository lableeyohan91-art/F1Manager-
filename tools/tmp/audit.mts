import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const P = await import('../../src/engine/balance/personnages.ts');
const fichiers: string[] = [];
const parcourir = (d: string) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) parcourir(p); else if (p.endsWith('.ts')) fichiers.push(p); } };
parcourir('src/engine/systems'); parcourir('src/engine/diagnostics');
const code = fichiers.map((f) => readFileSync(f, 'utf8')).join('\n') + readFileSync('src/engine/balance/memoire.ts', 'utf8') + readFileSync('src/engine/balance/carriere.ts', 'utf8');
const lu = (cle: string) => new RegExp(`['"\`:]${cle}['"\`]|\\.${cle}\\b|t:${cle}|v:${cle}`).test(code);
const comps = new Set<string>([...Object.values(P.COMPETENCES_PAR_POSTE).flat() as string[], ...P.COMPETENCES_PILOTE, ...P.COMPETENCES_TRANSVERSALES]);
for (const [nom, cles] of [['traits', Object.keys(P.TRAITS)], ['valeurs', Object.keys(P.VALEURS)], ['compétences', [...comps]]] as const) {
  const non = (cles as string[]).filter((c) => !lu(c));
  console.log(nom, (cles as string[]).length, 'non lus :', non.join(', ') || 'aucun');
}
