/**
 * D-181, levier A (version 2) — capacités achetables : ingénieurs et vitesse des projets, recrutement et réduction, cohésion, essais
 * renforcés, fatigue selon le rythme, chantiers lancés par la commande commune, entretien progressif, rendement décroissant ; format 34.
 */
import { describe, expect, it } from 'vitest';
import {
  chargePole, creerScenarioGrille2026, depensesFixes, deserialiser, departementDe, facteurAbandon, facteurIngenieurs, financesDe, niveauUtile,
  serialiser, table, TABLES, teamPrincipal, VERSION_FORMAT, type Ecurie, type Finances, type Installation, type ProjetConception,
} from '../src/engine';
import { COHESION_DEPARTEMENT, ESSAIS_RENFORCES, INGENIEURS, INSTALLATIONS_COUT, RECRUTEMENT_DEPARTEMENT } from '../src/engine/balance/capacites';
import { PIECES } from '../src/engine/balance/monoplaces';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const projet = (ecurie: string, type: string, extra: Partial<ProjetConception> = {}): ProjetConception =>
  ({ id: `prj_${ecurie}_${type}`, ecurie, type, concept: 0, joursRestants: 30, joursTotal: 30, debut: { annee: 2026, semaine: 1 }, coutMEUR: 1, ...extra }) as ProjetConception;

describe('D-181 — les ingénieurs font avancer les projets', () => {
  it('vitesse selon les ingénieurs affectés : un projet seul va plus vite que trois en parallèle ; un prioritaire reçoit deux parts', () => {
    const m = sc.creerMonde(1);
    const t = table(m, TABLES.projetsConception);
    const aero = departementDe(m, 'eq_haas', 'aero')!;
    t['a'] = projet('eq_haas', 'aileron_avant', { id: 'a' }) as never;
    const seul = facteurIngenieurs(m, t['a'] as unknown as ProjetConception);
    expect(seul).toBeCloseTo(Math.min(INGENIEURS.vitesseMax, (aero.effectif / INGENIEURS.reference) ** INGENIEURS.exposant), 5);
    t['b'] = projet('eq_haas', 'aileron_arriere', { id: 'b' }) as never;
    t['c'] = projet('eq_haas', 'fond_plat', { id: 'c', prioritaire: true }) as never;
    const normal = facteurIngenieurs(m, t['a'] as unknown as ProjetConception);
    const prio = facteurIngenieurs(m, t['c'] as unknown as ProjetConception);
    expect(normal).toBeLessThan(seul);
    expect(normal).toBeCloseTo(Math.max(INGENIEURS.vitesseMin, ((aero.effectif / 4) / INGENIEURS.reference) ** INGENIEURS.exposant), 5);
    expect(prio).toBeCloseTo(Math.max(INGENIEURS.vitesseMin, ((aero.effectif / 2) / INGENIEURS.reference) ** INGENIEURS.exposant), 5);
    // Rendement décroissant : répartir donne plus au total que concentrer.
    expect(2 * normal + prio).toBeGreaterThan(seul);
  });

  it('la fatigue dépend du rythme, pas du nombre de projets ni de l’effectif', () => {
    expect(chargePole([projet('x', 'aileron_avant', { rythme: 'normal' })], 'aero')).toBeCloseTo(1, 5);
    expect(chargePole([projet('x', 'aileron_avant', { rythme: 'normal' }), projet('x', 'fond_plat', { rythme: 'normal' })], 'aero')).toBeCloseTo(1, 5);
    expect(chargePole([projet('x', 'aileron_avant', { rythme: 'intensif', prioritaire: true }), projet('x', 'fond_plat', { rythme: 'normal' })], 'aero')).toBeCloseTo((2 * 1.35 + 1) / 3, 5);
    expect(chargePole([], 'aero')).toBe(0);
  });
});

describe('D-181 — recruter et réduire (commande commune)', () => {
  it('recrutement : frais sous le plafond, arrivée après le délai, cohésion en baisse puis en remontée ; pas de licenciement juste après', () => {
    const m = sc.creerMonde(2), moteur = sc.creerMoteur();
    moteur.avancer(m, 3);
    const e = 'eq_haas';
    const tp = teamPrincipal(m, e)!;
    const d = departementDe(m, e, 'aero')!;
    const fi = financesDe(m, e) as Finances;
    const cmd = (nombre: number, extra: Record<string, unknown> = {}) => moteur.commandes.executer(m, { type: 'departement.effectif', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e, departement: 'aero', nombre, ...extra } });
    expect(cmd(2).ok).toBe(false); // campagne trop petite
    expect(cmd(1000).ok).toBe(false);
    expect(moteur.commandes.executer(m, { type: 'departement.effectif', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e, departement: 'marketing', nombre: 10 } }).ok).toBe(false);
    const avant = d.effectif, depAvant = fi.comptes.departements, coh = d.cohesion;
    expect(cmd(30, { profil: 'confirmes' }).ok).toBe(true);
    expect(fi.comptes.departements - depAvant).toBeCloseTo(30 * RECRUTEMENT_DEPARTEMENT.fraisParPersonne * RECRUTEMENT_DEPARTEMENT.fraisConfirmes, 5);
    expect(cmd(10).ok).toBe(false); // un mouvement à la fois
    moteur.avancer(m, RECRUTEMENT_DEPARTEMENT.delaiArriveeSemaines);
    expect(d.effectif).toBe(avant);
    moteur.avancer(m, 1);
    expect(d.effectif).toBe(avant + 30);
    expect(d.cohesion).toBeLessThan(coh);
    const basse = d.cohesion;
    moteur.avancer(m, 8);
    expect(d.cohesion).toBeGreaterThan(basse);
    expect(d.cohesion - basse).toBeLessThanOrEqual(2 * COHESION_DEPARTEMENT.remonteeParMois + 1e-9);
    expect(cmd(-10).ok).toBe(false); // moins d'un an après un recrutement
  }, 120_000);

  it('fiabilité : plus de personnes, moins de pannes (borné)', () => {
    const m = sc.creerMonde(1);
    const d = departementDe(m, 'eq_haas', 'fiabilite')!;
    d.effectif = 20; const peu = facteurAbandon(m, 'eq_haas');
    d.effectif = 70; const beaucoup = facteurAbandon(m, 'eq_haas');
    expect(peu).toBeGreaterThan(1);
    expect(beaucoup).toBeLessThan(1);
  });
});

describe('D-181 — essais renforcés, installations', () => {
  it('essais renforcés : coût de conception × 1,5 ; refusés si le paramètre est invalide', () => {
    const m = sc.creerMonde(3), moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const e = table(m, TABLES.ecuries)['eq_williams'] as unknown as Ecurie;
    e.pilotee = true; // l'IA ne lance plus de projets pour cette écurie
    for (const id of Object.keys(table(m, TABLES.projetsConception))) if (id.includes('williams')) delete table(m, TABLES.projetsConception)[id];
    const tp = teamPrincipal(m, e.id)!;
    const lancer = (type: string, essais?: string) => moteur.commandes.executer(m, { type: 'conception.lancer', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e.id, type, concept: 0, ...(essais ? { essais } : {}) } });
    expect(lancer('aileron_avant', 'beaucoup').ok).toBe(false);
    expect(lancer('aileron_avant', 'renforces').ok).toBe(true);
    const p = Object.values(table(m, TABLES.projetsConception)).find((x) => (x as unknown as ProjetConception).ecurie === e.id && (x as unknown as ProjetConception).type === 'aileron_avant') as unknown as ProjetConception;
    expect(p.essaisRenforces).toBe(true);
    expect(p.coutMEUR).toBeCloseTo(PIECES.aileron_avant.coutProjetMEUR * (1 + ESSAIS_RENFORCES.surcout), 2);
  }, 120_000);

  it('entretien progressif (niveau²) et rendement décroissant au-dessus du seuil', () => {
    expect(niveauUtile(5)).toBe(5);
    expect(niveauUtile(10)).toBeCloseTo(INSTALLATIONS_COUT.seuilRendement + INSTALLATIONS_COUT.rendementAuDela * (10 - INSTALLATIONS_COUT.seuilRendement), 5);
    const m = sc.creerMonde(1);
    const e = table(m, TABLES.ecuries)['eq_mercedes'] as unknown as Ecurie;
    const inst = (Object.values(table(m, TABLES.installations)) as unknown as Installation[]).filter((i) => i.ecurie === e.id);
    const attendu = inst.reduce((a, i) => a + INSTALLATIONS_COUT.entretienParNiveauCarre * i.niveau ** 2 * (1 + Math.min(i.ageAnnees, INSTALLATIONS_COUT.ageMaxEntretien) / 30), 0);
    expect(depensesFixes(m, e).entretien).toBeCloseTo(attendu, 5);
  });

  it('chantier : commande commune (le joueur choisit), un seul à la fois', () => {
    const m = sc.creerMonde(4), moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const e = 'eq_cadillac';
    const fi = financesDe(m, e) as Finances;
    fi.projets = [];
    fi.tresorerieMEUR = 200;
    const tp = teamPrincipal(m, e)!;
    const inst = (Object.values(table(m, TABLES.installations)) as unknown as Installation[]).find((i) => i.ecurie === e && i.type === 'soufflerie' && i.niveau < 10)!;
    const cmd = () => moteur.commandes.executer(m, { type: 'infrastructure.lancer', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e, installation: inst.id, nature: 'amelioration' } });
    expect(cmd().ok).toBe(true);
    expect(fi.projets.length).toBe(1);
    expect(cmd().ok).toBe(false);
  }, 120_000);
});

describe('Format 34', () => {
  it('migration v33 → v34 : cohésion habituelle renseignée, la partie avance', () => {
    const m = sc.creerMonde(5);
    for (const d of Object.values(table(m, TABLES.departements)) as unknown as { cohesionHabituelle?: number }[]) delete d.cohesionHabituelle;
    const texte = serialiser(m).replaceAll(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":33');
    const migre = deserialiser(texte);
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    for (const d of Object.values(table(migre, TABLES.departements)) as unknown as { cohesion: number; cohesionHabituelle?: number }[]) expect(d.cohesionHabituelle).toBe(d.cohesion);
    sc.creerMoteur().avancer(migre, 4);
  }, 120_000);
});
