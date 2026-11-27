/**
 * Phase 13a — banc des consignes : une écurie applique une consigne à ses deux pilotes toute la saison, les autres restent neutres ;
 * comparaison contrefactuelle (même graine, même monde) des points et de la place moyenne en course de cette écurie.
 * Usage : npx tsx tools/banc-consignes.mts <écurie> <graines> [saisons]
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const [ecurie, ng] = [process.argv[2] ?? 'eq_alpine', Number(process.argv[3] ?? 5)];
const variantes: Record<string, Record<string, string>> = {
  neutre: {}, conduiteAgressive: { conduite: 'agressive' }, conduiteConservatrice: { conduite: 'conservatrice' }, pneusAgressifs: { pneus: 'agressive' },
  pneusConservateurs: { pneus: 'conservatrice' }, carburantAgressif: { carburant: 'agressive' }, carburantConservateur: { carburant: 'conservatrice' },
  batterieAgressive: { batterie: 'agressive' }, toutAgressif: { conduite: 'agressive', pneus: 'agressive', carburant: 'agressive', batterie: 'agressive' },
  toutConservateur: { conduite: 'conservatrice', pneus: 'conservatrice', carburant: 'conservatrice', batterie: 'conservatrice' },
};
const res: Record<string, { pts: number[]; pos: number[]; ab: number[] }> = {};
for (let g = 1; g <= ng; g++) {
  for (const [nom, v] of Object.entries(variantes)) {
    const m = sc.creerMonde(g), mo = sc.creerMoteur();
    mo.avancer(m, 2);
    const e = m.tables['ecuries'][ecurie] as { consignesCourse?: Record<string, unknown> };
    const pilotes = (Object.values(m.tables['personnes']) as { id: string; ecurie?: string; poste?: string; statut: string }[]).filter((p) => p.ecurie === ecurie && p.poste === 'pilote_titulaire' && p.statut === 'actif');
    e.consignesCourse = Object.fromEntries(pilotes.map((p) => [p.id, { conduite: 'neutre', batterie: 'neutre', carburant: 'neutre', pneus: 'neutre', ...v }]));
    mo.avancer(m, 50);
    const gps = (Object.values(m.tables['grandsprix']) as { termine: boolean; resultats: { ecurie: string; position: number | null; points: number; abandon: string | null }[] }[]).filter((x) => x.termine);
    const rs = gps.flatMap((x) => x.resultats.filter((r) => r.ecurie === ecurie));
    (res[nom] ??= { pts: [], pos: [], ab: [] });
    res[nom]!.pts.push(rs.reduce((a, r) => a + r.points, 0));
    res[nom]!.pos.push(rs.filter((r) => r.position).reduce((a, r) => a + r.position!, 0) / Math.max(1, rs.filter((r) => r.position).length));
    res[nom]!.ab.push(rs.filter((r) => r.abandon).length);
  }
  console.error(`graine ${g} terminée`);
}
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
console.log(`| Consigne (${ecurie}, ${ng} saisons) | Points | Place moyenne à l'arrivée | Abandons |`);
console.log('| --- | --- | --- | --- |');
for (const [nom, r] of Object.entries(res)) console.log(`| ${nom} | ${moy(r.pts).toFixed(1)} | ${moy(r.pos).toFixed(2)} | ${moy(r.ab).toFixed(1)} |`);
