/** Phase 8d — équipe des stands (D-129 ; fiche phase 8 §9 bis). */
import { describe, expect, it } from 'vitest';
import {
  copierMonde, creerScenarioGrille2026, deserialiser, equipeStands, financesDe, plafondCohesion, serialiser, table, TABLES, teamPrincipal, VERSION_FORMAT,
  type Departement, type Ecurie, type EquipeStands, type Monde, type Personne,
} from '../src/engine';
import { COHESION_STANDS, CREATION_STANDS, RECRUTEMENT_STANDS } from '../src/engine/balance/stands';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const ecuries = (m: Monde) => (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).filter((e) => e.statut === 'active');
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const auPoste = (m: Monde, e: string, poste: string) => personnes(m).find((p) => p.statut === 'actif' && p.ecurie === e && p.poste === poste);
const dep = (m: Monde, e: string) => (Object.values(table(m, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === e && d.type === 'stands')!;

describe('Phase 8d — équipe des stands', () => {
  it('chaque écurie a son équipe et son chef ; le niveau ne dépasse jamais le plafond ; la cohésion reste sous le plafond de l’encadrement (5 saisons)', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    for (const e of ecuries(m)) expect(auPoste(m, e.id, 'chef_stands')).toBeDefined();
    for (let s = 0; s < 5 * 13; s++) {
      moteur.avancer(m, 4);
      for (const e of ecuries(m)) {
        const eq = equipeStands(m, e.id)!;
        expect(eq).toBeDefined();
        expect(eq.rapidite).toBeLessThanOrEqual(eq.rapiditeMax + 1e-9);
        expect(eq.precision).toBeLessThanOrEqual(eq.precisionMax + 1e-9);
        for (const v of [eq.rapidite, eq.precision, eq.cohesion, eq.fatigue, eq.experience]) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100); }
        expect(eq.cohesion).toBeLessThanOrEqual(Math.max(plafondCohesion(eq.encadrement ?? 1), CREATION_STANDS.cohesion + 4 * CREATION_STANDS.ecartCohesion) + 1e-9);
        expect(eq.historique.length).toBeLessThanOrEqual(10);
      }
    }
  }, 180_000);

  it('entraînement : l’intensité fait progresser plus vite et fatigue davantage (contrefactuel, intersaison sans course)', () => {
    const base = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(base, 1);
    const tp = teamPrincipal(base, 'eq_williams')!;
    ecuries(base).find((e) => e.id === 'eq_williams')!.pilotee = true; // l'IA ne touche pas au plan
    const essai = (orientation: string, intensite: string) => {
      const m = copierMonde(base);
      expect(moteur.commandes.executer(m, { type: 'stands.plan', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', orientation, intensite } }).ok).toBe(true);
      moteur.avancer(m, 6);
      return equipeStands(m, 'eq_williams')!;
    };
    const legere = essai('rapidite', 'legere'), intensive = essai('rapidite', 'intensive'), repos = essai('recuperation', 'normale');
    expect(intensive.rapidite).toBeGreaterThan(legere.rapidite);
    expect(intensive.fatigue).toBeGreaterThan(legere.fatigue);
    expect(repos.fatigue).toBeLessThan(legere.fatigue);
    expect(repos.rapidite).toBeLessThanOrEqual(legere.rapidite);
  }, 60_000);

  it('l’ancienneté seule ne suffit pas : sans entraînement ni course, la cohésion plafonne bas', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    ecuries(m).find((e) => e.id === 'eq_williams')!.pilotee = true;
    moteur.avancer(m, 1);
    const eq = equipeStands(m, 'eq_williams')!;
    eq.cohesion = 10;
    eq.plan = { orientation: 'recuperation', intensite: 'legere' };
    moteur.avancer(m, 7); // semaines 2 à 8 : pas de Grand Prix
    expect(eq.cohesion).toBeLessThan(COHESION_STANDS.partStabilite * plafondCohesion(eq.encadrement!));
    expect(eq.cohesion).toBeGreaterThan(10);
  }, 60_000);

  it('recrutement par vagues : mêmes règles pour tous, plafonds relevés, cohésion entamée, coût réel, niveau du département', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 3);
    const tp = teamPrincipal(m, 'eq_haas')!;
    const d = dep(m, 'eq_haas');
    const eq = { ...equipeStands(m, 'eq_haas')! } as EquipeStands;
    const fi = financesDe(m, 'eq_haas')!;
    const tresorerie = fi.tresorerieMEUR;
    const rec = (auteur: string, nombre: number, niveau = 19) => moteur.commandes.executer(m, { type: 'stands.recrutement', auteur, source: 'exterieur', parametres: { ecurie: 'eq_haas', nombre, niveau } });
    expect(rec(teamPrincipal(m, 'eq_ferrari')!.id, 3).ok).toBe(false);
    expect(rec(tp.id, Math.floor(d.effectif * RECRUTEMENT_STANDS.partMax) + 1).ok).toBe(false);
    expect(rec(tp.id, 3, 25).ok).toBe(false);
    const niveauAvant = d.niveauMoyen;
    expect(rec(tp.id, 6).ok).toBe(true);
    const apres = equipeStands(m, 'eq_haas')!;
    expect(apres.rapiditeMax).toBeGreaterThan(eq.rapiditeMax);
    expect(apres.cohesion).toBeLessThan(eq.cohesion);
    expect(d.niveauMoyen).toBeGreaterThan(niveauAvant);
    expect(fi.tresorerieMEUR).toBeCloseTo(tresorerie - 6 * RECRUTEMENT_STANDS.coutParMecanicien * 1.9, 9);
  }, 60_000);

  it('le départ du chef d’équipe coûte de la cohésion', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 3);
    const temoin = copierMonde(m);
    const avant = equipeStands(m, 'eq_alpine')!.cohesion;
    const chef = auPoste(m, 'eq_alpine', 'chef_stands')!;
    chef.statut = 'libre';
    chef.ecurie = null as never;
    moteur.avancer(m, 1);
    moteur.avancer(temoin, 1);
    // Contrefactuel : seule différence, le départ du chef (la semaine d'entraînement est la même des deux côtés).
    expect(equipeStands(temoin, 'eq_alpine')!.cohesion - equipeStands(m, 'eq_alpine')!.cohesion).toBeGreaterThan(0.8 * COHESION_STANDS.changementChef * avant);
    expect(Object.values(m.evenements).some((e) => e.type === 'stands.changement_chef' && e.acteurs.some((a) => a.id === 'eq_alpine'))).toBe(true);
  }, 60_000);

  it('le joueur garde la main sur son équipe ; s’il la délègue, son directeur sportif décide', () => {
    const m = sc.creerMonde(1);
    ecuries(m).find((e) => e.id === 'eq_williams')!.pilotee = true;
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 30);
    const tp = teamPrincipal(m, 'eq_williams')!;
    expect(Object.values(m.evenements).some((e) => e.type === 'stands.recrutement' && e.acteurs.some((a) => a.id === 'eq_williams'))).toBe(false);
    expect(equipeStands(m, 'eq_williams')!.plan).toEqual({ orientation: 'coordination', intensite: 'normale' });
    expect(moteur.commandes.executer(m, { type: 'stands.deleguer', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', actif: true } }).ok).toBe(true);
    moteur.avancer(m, 8);
    expect(equipeStands(m, 'eq_williams')!.delegation).toBe(true);
  }, 60_000);

  it('format 22 : migration depuis 21 ; les équipes sont recréées à la semaine suivante', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 3);
    const ancien = copierMonde(m) as unknown as { tables: Record<string, unknown> };
    delete ancien.tables['equipesStands'];
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":21'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(migre.tables['equipesStands']).toEqual({});
    moteur.avancer(migre, 1);
    for (const e of ecuries(migre)) expect(equipeStands(migre, e.id)).toBeDefined();
  }, 60_000);
});
