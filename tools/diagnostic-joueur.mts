/**
 * Phase 10 — mesure indicative (D-120) : la même écurie, avec les mêmes graines, dirigée
 *   A. par l'IA (sans joueur),
 *   B. par un joueur passif qui délègue tout,
 *   C. par un joueur passif avec les délégations par défaut (il gère ses pilotes… sans rien faire),
 *   D. par un joueur passif qui ne délègue rien.
 * B doit rester proche de A (les délégations reprennent les règles de l'IA ; seule différence : le manager neutre remplace
 * le team principal d'origine). C et D mesurent le filet de sécurité (recrutements d'office) et ce que coûte l'inaction.
 * Usage : npx tsx tools/diagnostic-joueur.mts <graines> <saisons> [fichier de sortie]
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const N = Number(process.argv[2] ?? 12), S = Number(process.argv[3] ?? 5);
const sortie = process.argv[4];
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const ECURIES = ['eq_redbull', 'eq_ferrari', 'eq_mercedes', 'eq_mclaren', 'eq_aston', 'eq_alpine', 'eq_williams', 'eq_racingbulls', 'eq_haas', 'eq_audi', 'eq_cadillac'];
const DOMAINES = ['pilotes', 'personnel', 'recherche', 'stands', 'academie', 'politique'];
type Variante = 'A' | 'B' | 'C' | 'D';
const moy = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const res: Record<Variante, { rang: number[]; points: number[]; tresorerie: number[]; office: number[]; incoherences: number; licencie: number; ms: number[] }> = {
  A: { rang: [], points: [], tresorerie: [], office: [], incoherences: 0, licencie: 0, ms: [] },
  B: { rang: [], points: [], tresorerie: [], office: [], incoherences: 0, licencie: 0, ms: [] },
  C: { rang: [], points: [], tresorerie: [], office: [], incoherences: 0, licencie: 0, ms: [] },
  D: { rang: [], points: [], tresorerie: [], office: [], incoherences: 0, licencie: 0, ms: [] },
};
const actives = new Set(eng.ecuriesActives(sc.creerMonde(1)).map((e: any) => e.id));
const liste = ECURIES.filter((e) => actives.has(e));
for (let g = 1; g <= N; g++) {
  const id = liste[(g - 1) % liste.length]!;
  for (const v of ['A', 'B', 'C', 'D'] as Variante[]) {
    const m = sc.creerMonde(g);
    const mo = sc.creerMoteur();
    const tpOrigine = eng.teamPrincipal(m, id)?.id;
    if (v !== 'A') {
      eng.executerCommandeJoueur(mo, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: id, prenom: 'Joueur', nom: 'Passif' } });
      const tp = eng.teamPrincipal(m, id).id;
      for (const d of DOMAINES) {
        const actif = v === 'B' ? true : v === 'D' ? false : undefined;
        if (actif !== undefined) eng.executerCommandeJoueur(mo, m, { type: 'joueur.deleguer', auteur: tp, parametres: { ecurie: id, domaine: d, actif } });
      }
    }
    const t0 = performance.now();
    let office = 0;
    const vus = new Set<string>();
    for (let s = 0; s < S; s++) {
      for (let k = 0; k < 52; k++) {
        mo.avancerUneSemaine(m);
        if (m.date.semaine === 51) for (const e of Object.values(m.evenements) as any[]) {
          if (vus.has(e.id)) continue;
          vus.add(e.id);
          // Pilotes titulaires recrutés hors marché (filet de sécurité de fin de saison, ou intérim généré).
          if ((e.type === 'recrutement' || e.type === 'recrutement.genere') && e.contexte?.poste === 'pilote_titulaire' && e.acteurs.some((a: any) => a.id === id)) office++;
        }
      }
      const saison = eng.table(m, eng.TABLES.saisons)[`ssn_${m.date.annee - 1}`] as any;
      if (saison) {
        const i = saison.constructeurs.findIndex((x: any) => x.ecurie === id);
        res[v].rang.push(i + 1);
        res[v].points.push(saison.constructeurs[i]?.points ?? 0);
      }
      res[v].incoherences += eng.verifierCoherence(m, { ages: false }).length;
    }
    res[v].ms.push((performance.now() - t0) / (S * 52));
    res[v].tresorerie.push(eng.financesDe(m, id)?.tresorerieMEUR ?? NaN);
    res[v].office.push(office);
    // Team principal parti : le joueur renvoyé (B à D), ou le team principal d'origine qui n'est plus en poste (A).
    if (v === 'A' ? eng.teamPrincipal(m, id)?.id !== tpOrigine : m.joueur?.etat === 'licencie') res[v].licencie++;
  }
  console.error(`graine ${g} (${id}) terminée`);
}
const lib: Record<Variante, string> = { A: 'A. IA (référence)', B: 'B. joueur passif, tout délégué', C: 'C. joueur passif, délégations par défaut', D: 'D. joueur passif, rien de délégué' };
const f1 = (x: number) => x.toFixed(1).replace('.', ',');
let md = `# Phase 10 — joueur passif face à l'IA (${N} graines × ${S} saisons, mesure indicative D-120)\n\n`;
md += `Chaque graine fixe une écurie (rotation sur les ${liste.length} écuries) ; les 4 variantes partent du même monde.\n\n`;
md += '| Variante | Rang constructeurs moyen | Points par saison | Trésorerie finale (M€) | Pilotes recrutés hors marché (par partie) | Incohérences | Team principal parti (renvoyé ou non prolongé) | ms par semaine |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n';
for (const v of ['A', 'B', 'C', 'D'] as Variante[]) {
  const r = res[v];
  md += `| ${lib[v]} | ${f1(moy(r.rang))} | ${f1(moy(r.points))} | ${f1(moy(r.tresorerie))} | ${f1(moy(r.office))} | ${r.incoherences} | ${r.licencie}/${N} | ${f1(moy(r.ms))} |\n`;
}
console.log(md);
if (sortie) writeFileSync(sortie, md);
