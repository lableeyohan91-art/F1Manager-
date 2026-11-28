/**
 * Phase 13b+ — essais libres : programmes, effets, plan par défaut de l'IA, commande commune, format 37.
 */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026, deserialiser, serialiser, table, TABLES, teamPrincipal, VERSION_FORMAT, type Circuit, type Ecurie, type GrandPrix, type Personne } from '../src/engine';
import { ESSAIS } from '../src/engine/balance/course';
import { essaisLibres, planParDefaut } from '../src/engine/systems/saison/essais';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const titulaire = (m: ReturnType<typeof sc.creerMonde>, ecurie: string) => (Object.values(table(m, TABLES.personnes)) as unknown as Personne[])
  .filter((p) => p.ecurie === ecurie && p.poste === 'pilote_titulaire' && p.statut === 'actif').sort((a, b) => (a.id < b.id ? -1 : 1))[0]!;
const premierGp = (m: ReturnType<typeof sc.creerMonde>) => (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).sort((a, b) => a.manche - b.manche)[0]!;

describe('Phase 13b+ — essais libres', () => {
  it('chaque programme a son effet : réglages, longs relais, simulation de qualification, apprentissage', () => {
    const m = sc.creerMonde(1); sc.creerMoteur().avancer(m, 1);
    const gp = premierGp(m), c = table(m, TABLES.circuits)[gp.circuit] as unknown as Circuit;
    const e = table(m, TABLES.ecuries)['eq_alpine'] as unknown as Ecurie, p = titulaire(m, e.id);
    const avec = (x: string[]) => { e.programmesEssais = { [p.id]: x as never }; return essaisLibres(m, gp, c, [p]).get(p.id)!; };
    const r0 = avec(['longsRelais', 'longsRelais', 'longsRelais']), r3 = avec(['reglages', 'reglages', 'reglages']);
    expect(r3.reglagePct).toBeCloseTo(r0.reglagePct * ESSAIS.parSeanceReglages ** 3, 6); // même tirage, trois séances de réglages
    expect(r0.facteurEstimation).toBeCloseTo(ESSAIS.parSeanceRelais ** 3, 6);
    const q = avec(['simulationQualif', 'simulationQualif', 'reglages']);
    expect(q.facteurErreurQualif).toBeCloseTo(ESSAIS.parSeanceSimulation ** 2, 6);
    expect(q.bonusQualifPct).toBeCloseTo(2 * ESSAIS.bonusSimulationPct, 6);
    expect(avec(['apprentissage', 'reglages', 'reglages']).facteurNouveaute).toBeCloseTo(ESSAIS.parSeanceApprentissage, 6);
  });

  it('plan par défaut : un pilote qui découvre le circuit commence par l’apprentissage ; sinon deux séances de réglages et une simulation', () => {
    const m = sc.creerMonde(1); sc.creerMoteur().avancer(m, 1);
    const gp = premierGp(m), c = table(m, TABLES.circuits)[gp.circuit] as unknown as Circuit;
    const e = table(m, TABLES.ecuries)['eq_alpine'] as unknown as Ecurie, p = titulaire(m, e.id);
    p.carriere!.experience!.circuits[c.id] = 0;
    expect(planParDefaut(m, e, p, c, gp)[0]).toBe('apprentissage');
    p.carriere!.experience!.circuits[c.id] = 5;
    expect(planParDefaut(m, e, p, c, gp)).toEqual(['reglages', 'reglages', 'simulationQualif']);
  });

  it('commande commune : refus du jeune pilote hors EL1 et des programmes inconnus ; choix gardé ; réglage visible dans le résultat', () => {
    const m = sc.creerMonde(2), mo = sc.creerMoteur();
    mo.avancer(m, 3);
    const e = table(m, TABLES.ecuries)['eq_alpine'] as unknown as Ecurie, p = titulaire(m, e.id), tp = teamPrincipal(m, e.id)!;
    const cmd = (prm: Record<string, unknown>) => mo.commandes.executer(m, { type: 'essais.programmes', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e.id, pilote: p.id, ...prm } });
    expect(cmd({ el1: 'reglages', el2: 'jeunePilote', el3: 'reglages' }).ok).toBe(false);
    expect(cmd({ el1: 'danse', el2: 'reglages', el3: 'reglages' }).ok).toBe(false);
    expect(cmd({ el1: 'longsRelais', el2: 'longsRelais', el3: 'longsRelais' }).ok).toBe(true);
    expect(e.programmesEssais?.[p.id]).toEqual(['longsRelais', 'longsRelais', 'longsRelais']);
    mo.avancer(m, 12);
    const gp = (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).find((g) => g.termine)!;
    // Sans aucune séance de réglages, la perte de réglage est presque toujours non nulle.
    expect(gp.resultats.find((r) => r.pilote === p.id)!.explication?.reglage ?? 0).toBeGreaterThan(0);
  }, 120_000);

  it('format 37 : une sauvegarde v36 se charge et la partie avance', () => {
    const m = sc.creerMonde(3);
    const migre = deserialiser(serialiser(m).replaceAll(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":36'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    sc.creerMoteur().avancer(migre, 2);
  }, 120_000);
});
