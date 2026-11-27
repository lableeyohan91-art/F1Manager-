/**
 * Chantier 2 (piège de la pauvreté, 26/11/2026) — diagnostic financier, sans rien modifier.
 * Après S saisons, écrit pour chaque écurie ses comptes annuels (recettes par source, dépenses par poste, dividendes, développement,
 * trésorerie), sa place au championnat, son indice, et son propriétaire (type, apport de base, patience, ambition) au départ et à la fin.
 * Usage : npx tsx tools/diagnostic-finances.mts <graine de départ> <nombre de graines> <saisons> <sortie.json> [réglages « nom=valeur,… »]
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const [g0, ng, S, sortie] = [Number(process.argv[2] ?? 1), Number(process.argv[3] ?? 1), Number(process.argv[4] ?? 30), process.argv[5] ?? 'fin.json'];
// Réglages d'expérience facultatifs (6e argument, « nom=valeur,… »), comme diagnostic-hierarchies.
const PARAMS: Record<string, number> = Object.fromEntries((process.argv[6] ?? '').split(',').filter(Boolean).map((x) => { const [k, v] = x.split('='); return [k!, Number(v)]; }));
const proprio = (m: unknown, id: string) => {
  const p = (Object.values((m as { tables: Record<string, Record<string, unknown>> }).tables['proprietaires']!) as { ecurie: string; actif?: boolean; type: string; apportBaseMEUR: number; patience: number; ambition: number; depuis?: number }[]).find((x) => x.ecurie === id && x.actif !== false);
  return p ? { type: p.type, apportBase: p.apportBaseMEUR, patience: p.patience, ambition: p.ambition, depuis: p.depuis ?? null } : null;
};
const res: unknown[] = [];
for (let g = g0; g < g0 + ng; g++) {
  const m = sc.creerMonde(g), mo = sc.creerMoteur();
  m.parametres = { ...(m.parametres ?? {}), ...PARAMS };
  const depart = Object.fromEntries((eng.ecuriesActives(m) as { id: string }[]).map((e) => [e.id, proprio(m, e.id)]));
  const places: Record<string, number[]> = {}, indices: Record<string, number[]> = {};
  for (let s = 0; s < S; s++) {
    const annee = m.date.annee;
    mo.avancer(m, 52);
    const sa = m.tables['saisons'][`ssn_${annee}`] as { constructeurs: { ecurie: string }[] } | undefined;
    for (const e of eng.ecuriesActives(m) as { id: string }[]) {
      (places[e.id] ??= []).push(sa ? sa.constructeurs.findIndex((c) => c.ecurie === e.id) + 1 : 0);
      (indices[e.id] ??= []).push(eng.indiceMoyen(m, e));
    }
  }
  mo.avancer(m, 2); // clôture des comptes de la dernière saison
  const ecuries = (eng.ecuriesActives(m) as { id: string }[]).map((e) => {
    const fi = (Object.values(m.tables['finances']) as { ecurie: string; historique: Record<string, number>[]; detteMEUR: number }[]).find((f) => f.ecurie === e.id)!;
    return { id: e.id, places: places[e.id], indices: indices[e.id], historique: fi.historique, dette: fi.detteMEUR, proprietaireDepart: depart[e.id], proprietaireFin: proprio(m, e.id) };
  });
  res.push({ graine: g, ecuries });
  console.log(`graine ${g} terminée`);
}
writeFileSync(sortie, JSON.stringify(res));
