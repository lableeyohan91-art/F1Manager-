/**
 * D-180, levier B — tableau de bord prévisionnel : fonction pure, cohérence des blocs, alertes, précision mesurée.
 */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, ecuriesActives, financesDe, previsionFinances, serialiser, type Finances } from '../src/engine';
import { periodesRestantes } from '../src/engine/systems/economie/previsions';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());

describe('D-180, levier B — prévisions financières', () => {
  it('écritures restantes : 13 en semaine 1, 12 en semaine 5, 1 en semaine 52', () => {
    expect(periodesRestantes(1)).toBe(13);
    expect(periodesRestantes(4)).toBe(13);
    expect(periodesRestantes(5)).toBe(12);
    expect(periodesRestantes(52)).toBe(1);
  });

  it('ne modifie pas le monde ; blocs cohérents (marge, dividendes, recettes) pour les 11 écuries', () => {
    const m = sc.creerMonde(7), mo = sc.creerMoteur();
    mo.avancer(m, 53 + 20);
    const avant = serialiser(m);
    for (const e of ecuriesActives(m)) {
      const p = previsionFinances(m, e.id)!;
      expect(p).toBeDefined();
      expect(p.plafond.marge).toBeCloseTo(p.plafond.montant - p.plafond.depense - p.plafond.aVenir, 0);
      expect(p.tresorerie.finApresDividendes).toBeCloseTo(p.tresorerie.finAvantDividendes - p.dividendes.montant, 0);
      expect(p.dividendes.montant).toBeGreaterThanOrEqual(0);
      expect(p.recettes.garanties).toBeCloseTo(p.recettes.primes + p.recettes.droits + p.recettes.sponsors + p.recettes.apport, 0);
      for (const v of [p.tresorerie.dansQuatreSemaines, p.depenses.total, p.developpement.payePrevu, p.saisonSuivante.primesALaPlace]) expect(Number.isFinite(v)).toBe(true);
    }
    expect(serialiser(m)).toBe(avant);
  }, 120_000);

  it('alerte quand une dépense engagée ferait dépasser le plafond', () => {
    const m = sc.creerMonde(7), mo = sc.creerMoteur();
    mo.avancer(m, 53 + 20);
    const e = ecuriesActives(m)[0]!;
    const fi = financesDe(m, e.id) as Finances;
    const p0 = previsionFinances(m, e.id)!;
    fi.depensesTechniques = { annee: m.date.annee, projetsMEUR: fi.depensesTechniques?.projetsMEUR ?? 0, aPayerMEUR: p0.plafond.marge + 20 };
    const p = previsionFinances(m, e.id)!;
    expect(p.plafond.depassementPrevu).toBeGreaterThan(15);
    expect(p.alertes.some((a) => a.startsWith('Dépassement du plafond prévu'))).toBe(true);
  }, 120_000);

  it('précision : à mi-saison, la trésorerie de fin d’année prévue est juste à 30 M€ près en moyenne (imprévus compris)', () => {
    const m = sc.creerMonde(11), mo = sc.creerMoteur();
    mo.avancer(m, 53 + 25); // semaine 27 de la deuxième saison
    const annee = m.date.annee;
    const prev = new Map(ecuriesActives(m).map((e) => [e.id, previsionFinances(m, e.id)!.tresorerie.finAvantDividendes]));
    while (m.date.annee === annee) mo.avancer(m, 1);
    mo.avancer(m, 1);
    const ecarts = ecuriesActives(m).map((e) => {
      const h = (financesDe(m, e.id) as Finances).historique.find((x) => x.annee === annee)!;
      return Math.abs(h.tresorerieFin + h.dividendes - prev.get(e.id)!);
    });
    expect(ecarts.reduce((a, b) => a + b, 0) / ecarts.length).toBeLessThan(30);
  }, 180_000);
});
