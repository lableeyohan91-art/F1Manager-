/**
 * Audit économique du 27/11 — solutions A (dividendes selon les résultats), B (primes à chaque Grand Prix), C (rénovation financée par la
 * trésorerie dormante).
 */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, deciderProjet, ecuriesActives, economieRenovation, financesDe, table, TABLES, type Ecurie, type Finances, type Installation, type Saison } from '../src/engine';
import { IA_INSTALLATIONS, INSTALLATIONS_COUT } from '../src/engine/balance/capacites';
import { ENVELOPPE_PRIMES_MEUR } from '../src/engine/balance/reglement';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());

describe('Audit économique — A et B', () => {
  it('A : aucune écurie de la seconde moitié ne verse de dividendes ; B : les primes versées sur l’année font l’enveloppe', () => {
    const m = sc.creerMonde(5), mo = sc.creerMoteur();
    mo.avancer(m, 2 * 53 + 1);
    const annee = m.date.annee - 1;
    const s = table(m, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison;
    const n = s.constructeurs.length;
    let total = 0;
    for (const e of ecuriesActives(m)) {
      const h = (financesDe(m, e.id) as Finances).historique.find((x) => x.annee === annee)!;
      total += h.primes;
      const rang = s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1;
      if (rang > n / 2) expect(h.dividendes).toBe(0);
    }
    expect(total).toBeCloseTo(ENVELOPPE_PRIMES_MEUR, 0);
  }, 180_000);
});

describe('Audit économique — C', () => {
  it('écurie étranglée avec de l’argent qui dort : elle rénove l’installation dont l’entretien baisse le plus', () => {
    const m = sc.creerMonde(3), mo = sc.creerMoteur();
    mo.avancer(m, 2);
    const e = table(m, TABLES.ecuries)['eq_mercedes'] as unknown as Ecurie;
    const fi = financesDe(m, e.id) as Finances;
    fi.projets = [];
    fi.tresorerieMEUR = 500;
    fi.budget.developpementMEUR = IA_INSTALLATIONS.devMinAgrandissementMEUR - 10;
    const insts = (Object.values(table(m, TABLES.installations)) as unknown as Installation[]).filter((i) => i.ecurie === e.id);
    for (const i of insts) i.ageAnnees = 1;
    const usine = insts.find((i) => i.type === 'usine')!;
    usine.ageAnnees = 15; usine.niveau = 10;
    expect(economieRenovation(usine)).toBeCloseTo(INSTALLATIONS_COUT.entretienParNiveauCarre * 100 * 15 / 30, 5);
    const cmds: { type: string; parametres: Record<string, unknown> }[] = [];
    deciderProjet(m, e, fi, 0, (c) => cmds.push(c));
    expect(cmds).toEqual([expect.objectContaining({ type: 'infrastructure.lancer', parametres: expect.objectContaining({ installation: usine.id, nature: 'renovation' }) })]);
  }, 120_000);
});
