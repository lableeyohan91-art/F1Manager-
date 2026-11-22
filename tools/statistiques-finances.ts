/** Statistiques financières agrégées : N graines × S saisons (contrôle phase 5a). */
import { creerScenarioGrille2026, table, TABLES, totalPlafonne, totalRecettes, totalDepenses, type Finances, type Monde } from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const N = Number(process.argv[2] ?? 20), S = Number(process.argv[3] ?? 10);
const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const compteurs: Record<string, number> = {};
const sponsorsParRang: number[][] = [];
let detteTotale = 0, detteMax = 0;
let annees = 0, sousPlafond = 0, depassements = 0, depassMajeurs = 0, tresoNeg = 0, coupes = 0, licenciements = 0;
const tresoFin: number[] = [];
const ecartEffort: number[] = [];
const parType: Record<string, number[]> = {};
for (let g = 1; g <= N; g++) {
  const m: Monde = sc.creerMonde(g);
  const mo = sc.creerMoteur();
  // Les événements anciens sont élagués par le moteur (D-058) : on les compte au fil de la simulation.
  const vus = new Set<string>();
  const compter = () => {
    for (const [id, e] of Object.entries(m.evenements)) {
      if (vus.has(id)) continue;
      vus.add(id);
      if (e.type === 'finances.coupe_budget') coupes++;
      if (e.type === 'conseil.licenciement_tp') licenciements++;
      if (/^(finances\.(emprunt|tension|crise|administration)|proprietaire\.(sauvetage|rachat|retrait)|sponsor\.(depart|signature|renouvellement)|infrastructure\.(lancement|livraison|retard))$/.test(e.type)) compteurs[e.type] = (compteurs[e.type] ?? 0) + 1;
    }
  };
  for (let w = 0; w < S * 52 + 1; w += 13) { mo.avancer(m, Math.min(13, S * 52 + 1 - w)); compter(); }
  for (const fi of Object.values(table(m, TABLES.finances)) as unknown as Finances[]) {
    for (const h of fi.historique) {
      annees++;
      const p = totalPlafonne(h);
      if (p < 0.97 * 215) sousPlafond++;
      if (h.depassement > 0.01) { depassements++; if (h.depassement > 0.05 * 215) depassMajeurs++; }
      if (h.tresorerieFin < 0) tresoNeg++;
      ecartEffort.push(p);
    }
    tresoFin.push(fi.tresorerieMEUR);
  }
  for (const fi of Object.values(table(m, TABLES.finances)) as unknown as Finances[]) { detteTotale += fi.detteMEUR; detteMax = Math.max(detteMax, fi.detteMEUR); }
  // Revenus de sponsoring de la dernière année selon le rang au dernier classement.
  const derniere = (Object.values(table(m, TABLES.saisons)) as unknown as { annee: number; termine: boolean; constructeurs: { ecurie: string }[] }[]).filter((x) => x.termine).sort((a, b) => b.annee - a.annee)[0];
  derniere?.constructeurs.forEach((c, i) => {
    const fi = (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === c.ecurie)!;
    const h = fi.historique.at(-1);
    (sponsorsParRang[i] ??= []).push(h ? (h as unknown as { sponsors: number }).sponsors ?? 0 : 0);
  });
  for (const p of Object.values(table(m, TABLES.proprietaires)) as unknown as { type: string; ecurie: string }[]) {
    const fi = (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === p.ecurie)!;
    (parType[p.type] ??= []).push(fi.historique.reduce((a, h) => a + totalRecettes(h) - totalDepenses(h), 0) / fi.historique.length);
  }
}
const q = (v: number[], x: number) => [...v].sort((a, b) => a - b)[Math.floor(x * (v.length - 1))]!;
console.log(`${N} graines × ${S} saisons = ${annees} années-écurie`);
console.log(`Années sous le plafond (< 97 %) : ${(100 * sousPlafond / annees).toFixed(1)} %`);
console.log(`Dépassements : ${(100 * depassements / annees).toFixed(2)} % (majeurs ${(100 * depassMajeurs / annees).toFixed(2)} %)`);
console.log(`Trésorerie de fin d'année négative : ${(100 * tresoNeg / annees).toFixed(2)} %`);
console.log(`Coupes en cours d'année : ${(coupes / annees).toFixed(3)} par année-écurie`);
console.log(`Licenciements de TP par le conseil : ${(licenciements / N / S).toFixed(2)} par saison (toutes écuries)`);
console.log(`Dépenses plafonnées : 10 % ${q(ecartEffort, 0.1).toFixed(0)} · médiane ${q(ecartEffort, 0.5).toFixed(0)} · 90 % ${q(ecartEffort, 0.9).toFixed(0)}`);
console.log(`Trésorerie finale : 10 % ${q(tresoFin, 0.1).toFixed(0)} · médiane ${q(tresoFin, 0.5).toFixed(0)} · 90 % ${q(tresoFin, 0.9).toFixed(0)} · min ${q(tresoFin, 0).toFixed(0)} · max ${q(tresoFin, 1).toFixed(0)}`);
console.log(`Dette finale moyenne : ${(detteTotale / (N * 11)).toFixed(1)} M€ (max ${detteMax.toFixed(0)})`);
for (const [k, v] of Object.entries(compteurs).sort()) console.log(`${k} : ${(v / N / S).toFixed(2)} par saison (toutes écuries)`);
console.log('Sponsoring de la dernière année selon le rang : ' + sponsorsParRang.map((v, i) => `${i + 1}e ${(v.reduce((a, b) => a + b, 0) / v.length).toFixed(0)}`).join(' · '));
for (const [t, v] of Object.entries(parType)) console.log(`Résultat annuel moyen, propriétaire ${t} : ${(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)} M€`);
