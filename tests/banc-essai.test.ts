/**
 * Audit APEX, point 10 : un banc d'essai doit pouvoir neutraliser les facteurs parasites (météo, abandons, erreur sous pression,
 * aléa de course) par paramètres d'expérience, et rester reproductible.
 */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, table, TABLES, type GrandPrix } from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const courses = (m: ReturnType<typeof sc.creerMonde>) => (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).filter((g) => g.termine);

describe('Banc d’essai : neutralisation des facteurs parasites', () => {
  it('sans pluie, sans abandon, sans aléa : aucune course mouillée, aucun abandon, résultats reproductibles', () => {
    const jouer = () => {
      const m = sc.creerMonde(5);
      m.parametres = { 'course.meteoForcee': 0, 'course.abandons': 0, 'course.pression': 0, 'course.aleaSigma': 0 };
      sc.creerMoteur().avancer(m, 30);
      return courses(m);
    };
    const a = jouer(), b = jouer();
    expect(a.length).toBeGreaterThan(3);
    expect(a.some((g) => g.pluie)).toBe(false);
    expect(a.flatMap((g) => g.resultats).some((r) => r.abandon)).toBe(false);
    expect(JSON.stringify(a.map((g) => g.resultats.map((r) => r.pilote)))).toBe(JSON.stringify(b.map((g) => g.resultats.map((r) => r.pilote))));
  }, 120_000);

  it('pluie imposée : toutes les courses sont mouillées', () => {
    const m = sc.creerMonde(5);
    m.parametres = { 'course.meteoForcee': 1 };
    sc.creerMoteur().avancer(m, 20);
    expect(courses(m).length).toBeGreaterThan(0);
    expect(courses(m).every((g) => g.pluie)).toBe(true);
  }, 120_000);
});
