/**
 * Phase 12d — diagnostic des hiérarchies (demande du porteur, 26/11/2026). Aucun réglage modifié : on observe.
 * Pour chaque saison (mesure après la semaine 1 : intersaison et réformes exécutées), écrit un JSON par graine :
 *   - savoir et frontière : pour chaque écurie, savoir fondamental moyen, savoir propre au règlement en vigueur, frontière moyenne des six
 *     pièces (FRONTIERE.min + etendue = plafond), efficacité moyenne, année de grande réforme ou non ;
 *   - écart haut / milieu : indice de la voiture, niveau des deux pilotes titulaires, productivité des pôles, développement payé ;
 *   - classement constructeurs de la saison écoulée (rotation du bas) ;
 *   - erreurs de développement : pièces montées moins bonnes que celle qu'elles remplacent (la vérité est connue du laboratoire).
 * Usage : npx tsx tools/diagnostic-hierarchies.mts <graine de départ> <nombre de graines> <saisons> <sortie.json>
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const { FRONTIERE, TYPES_PIECES, PIECES } = await import(`${racine}/src/engine/balance/monoplaces.ts`);
const { savoirExistant } = await import(`${racine}/src/engine/systems/technique/acces.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const [g0, ng, S, sortie] = [Number(process.argv[2] ?? 1), Number(process.argv[3] ?? 1), Number(process.argv[4] ?? 30), process.argv[5] ?? 'diag.json'];
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(1, v.length);
type E = { id: string };
const resultat: unknown[] = [];
for (let g = g0; g < g0 + ng; g++) {
  const m = sc.creerMonde(g), mo = sc.creerMoteur();
  const saisons: unknown[] = [];
  let reculs: Record<string, number> = {}, montees: Record<string, number> = {};
  const vus = new Set(Object.keys(m.evenements));
  for (let s = 0; s < S; s++) {
    const annee = m.date.annee;
    for (let w = 0; w < (s === 0 ? 52 : 51) + 1; w++) {
      // Efficacité montée avant la semaine, par écurie et par type, pour juger les pièces montées ensuite.
      const avant = new Map((Object.values(m.tables['pieces']) as { ecurie: string; type: string; installee: boolean; efficacite: number }[]).filter((p) => p.installee).map((p) => [`${p.ecurie}|${p.type}`, p.efficacite]));
      mo.avancer(m, 1);
      for (const id of Object.keys(m.evenements)) {
        if (vus.has(id)) continue; vus.add(id);
        const ev = m.evenements[id] as { type: string; contexte: Record<string, unknown>; acteurs: { id: string }[] };
        if (ev.type !== 'conception.terminee' || !ev.contexte['installee']) continue;
        const ec = ev.acteurs[0]!.id, cle = `${ec}|${ev.contexte['piece']}`;
        montees[ec] = (montees[ec] ?? 0) + 1;
        if (avant.has(cle) && Number(ev.contexte['efficacite']) < avant.get(cle)! - 1e-9) reculs[ec] = (reculs[ec] ?? 0) + 1;
      }
    }
    const r = eng.reglementEnVigueur(m) as { id: string; debut: number; orientation: string } | undefined;
    const reforme = !!r && r.debut === m.date.annee && r.orientation !== 'initial';
    const sa = m.tables['saisons'][`ssn_${annee}`] as { constructeurs: { ecurie: string; points: number }[] } | undefined;
    const pilotes = eng.pilotesTitulaires(m) as { ecurie: string }[];
    const ecuries = (eng.ecuriesActives(m) as E[]).map((e) => {
      const pcs = eng.piecesInstallees(m, e.id) as { type: string; efficacite: number }[];
      const fondamental = moy(TYPES_PIECES.flatMap((t: string) => (PIECES as Record<string, { domaines: string[] }>)[t]!.domaines.map((d) => savoirExistant(m, e.id, d)?.fondamental ?? 0)));
      const propre = r ? moy(TYPES_PIECES.flatMap((t: string) => (PIECES as Record<string, { domaines: string[] }>)[t]!.domaines.map((d) => savoirExistant(m, e.id, d)?.parReglement[r.id] ?? 0))) : 0;
      const fi = (Object.values(m.tables['finances']) as { ecurie: string; historique: { annee: number; developpement: number }[] }[]).find((f) => f.ecurie === e.id);
      return {
        id: e.id, indice: eng.indiceMoyen(m, e), fondamental, propre,
        frontiere: moy(TYPES_PIECES.map((t: string) => eng.frontiere(m, e, t))), efficacite: moy(pcs.map((p) => p.efficacite)),
        // Année de réforme : frontière des seules pièces touchées par le nouveau règlement (les autres gardent leur savoir, à raison).
        frontiereTouchees: reforme ? moy(TYPES_PIECES.filter((t: string) => eng.pieceTouchee(r, t)).map((t: string) => eng.frontiere(m, e, t))) : null,
        pilotes: moy(pilotes.filter((p) => p.ecurie === e.id).map((p) => eng.niveauPilote(p, false))),
        productivite: (eng.productivite(m, e.id, 'aero') + eng.productivite(m, e.id, 'conception')) / 2,
        developpement: fi?.historique.find((h) => h.annee === annee)?.developpement ?? 0,
        place: sa ? sa.constructeurs.findIndex((c) => c.ecurie === e.id) + 1 : 0, points: sa?.constructeurs.find((c) => c.ecurie === e.id)?.points ?? 0,
        piecesMontees: montees[e.id] ?? 0, piecesEnRecul: reculs[e.id] ?? 0,
      };
    });
    saisons.push({ annee, reforme, plafond: FRONTIERE.min + FRONTIERE.etendue, ecuries });
    reculs = {}; montees = {};
  }
  resultat.push({ graine: g, saisons });
  console.log(`graine ${g} terminée`);
}
writeFileSync(sortie, JSON.stringify(resultat));
