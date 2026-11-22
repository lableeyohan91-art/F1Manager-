import { describe, expect, it } from 'vitest';
import {
  copierMonde, creerScenarioGrille2026, deserialiser, empreinte, facteurBudgetDeveloppement, financesDe, restrictionAero, serialiser,
  table, TABLES, totalPlafonne, verifierCoherence, VERSION_FORMAT, type Ecurie, type Finances, type Monde,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const S = 52;
const ecuries = (m: Monde) => Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[];

describe('Phase 5a — économie', () => {
  it('chaque écurie a des finances et un propriétaire ; chaque personne a une apparence persistante', () => {
    const m = sc.creerMonde(1);
    for (const e of ecuries(m)) {
      expect(financesDe(m, e.id)).toBeDefined();
      expect(Object.values(table(m, TABLES.proprietaires)).some((p) => p['ecurie'] === e.id)).toBe(true);
    }
    const p = table(m, TABLES.personnes)['per_leclerq'] as unknown as { apparence: { graine: number } };
    expect(p.apparence.graine).toBe((table(sc.creerMonde(1), TABLES.personnes)['per_leclerq'] as unknown as { apparence: { graine: number } }).apparence.graine);
  });

  it('deux saisons : budgets décidés, comptes tenus, aucun dépassement involontaire du plafond, déterminisme', () => {
    const m = sc.creerMonde(3);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2 * S + 1);
    for (const e of ecuries(m)) {
      const fi = financesDe(m, e.id) as Finances;
      expect(fi.historique).toHaveLength(2);
      expect(fi.budget.annee).toBe(m.date.annee);
      for (const h of fi.historique) {
        if (fi.budget.strategie !== 'offensif') expect(totalPlafonne(h)).toBeLessThanOrEqual(215 + 0.01);
        expect(h.primes).toBeGreaterThan(0);
      }
    }
    const m2 = sc.creerMonde(3);
    sc.creerMoteur().avancer(m2, 2 * S + 1);
    expect(empreinte(m2)).toBe(empreinte(m));
    expect(verifierCoherence(m, { ages: false })).toEqual([]);
  });

  it('un dépassement du plafond est sanctionné : amende et réduction du développement aéro', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 10);
    const fi = financesDe(m, 'eq_mercedes') as Finances;
    fi.budget.developpementMEUR += 60; // la direction décide de dépasser franchement
    moteur.avancer(m, S - 9);
    expect(fi.historique[0]!.depassement).toBeGreaterThan(0.05 * 215);
    expect(fi.historique[0]!.amendes).toBeGreaterThan(0);
    expect(fi.sanctionAero).toBeGreaterThan(0);
    expect(Object.values(m.evenements).some((e) => e.type === 'finances.depassement_plafond')).toBe(true);
  });

  it('restrictions aéro : le dernier du classement développe son aéro plus vite que le premier', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, S + 1);
    const s = table(m, TABLES.saisons)['ssn_2027'] as unknown as { constructeurs: { ecurie: string }[] };
    const premier = s.constructeurs[0]!.ecurie;
    const dernier = s.constructeurs.at(-1)!.ecurie;
    expect(restrictionAero(m, premier)).toBeCloseTo(0.75);
    expect(restrictionAero(m, dernier)).toBeCloseTo(1.15);
  });

  it('effort technique : les écuries au plafond sont à égalité, une écurie pauvre est en retrait', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const f = (id: string) => facteurBudgetDeveloppement(m, id);
    expect(Math.abs(f('eq_mercedes') - f('eq_alpine'))).toBeLessThan(0.03);
    expect(f('eq_haas')).toBeLessThan(f('eq_mercedes'));
  });

  it('une sauvegarde au format 4 est migrée : finances, propriétaires et apparences créés', () => {
    const m = sc.creerMonde(1);
    const ancien = copierMonde(m) as unknown as Record<string, unknown>;
    const tables = ancien['tables'] as Record<string, Record<string, Record<string, unknown>>>;
    delete tables['finances'];
    delete tables['proprietaires'];
    for (const p of Object.values(tables['personnes']!)) delete p['apparence'];
    ancien['versionFormat'] = 4;
    const texte = serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":4');
    const migre = deserialiser(texte);
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(Object.keys(table(migre, TABLES.finances))).toHaveLength(ecuries(m).length);
    expect(Object.values(table(migre, TABLES.personnes)).every((p) => p['apparence'])).toBe(true);
    sc.creerMoteur().avancer(migre, S + 1); // le monde migré tourne
    expect(financesDe(migre, 'eq_haas')!.historique).toHaveLength(1);
  });
});
