/**
 * Phase 12b — soufflerie et CFD (barème réel), rythmes et fatigue, incidents, dilemmes techniques bloquants, format 32.
 */
import { describe, expect, it } from 'vitest';
import {
  allocationSemaine, chargePole, creerDilemme, creerScenarioGrille2026, decisionsEnAttente, deserialiser, dilemmes, evoluerFatigue, executerCommandeJoueur,
  facteurProductivite, fatigueEquilibre, probaIncident, projets, restrictionAero, serialiser, table, TABLES, teamPrincipal, VERSION_FORMAT,
  type Departement, type Ecurie, type ProjetConception,
} from '../src/engine';
import { RYTHMES } from '../src/engine/balance/monoplaces';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const ecurie = (m: ReturnType<typeof sc.creerMonde>, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;

describe('Phase 12b — soufflerie et CFD', () => {
  it('barème réel 2026 : 70 % au champion, +5 % par place, 115 % au plus ; plus d’heures pour le dernier', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 53);
    const s = table(m, TABLES.saisons)['ssn_2027'] as unknown as { constructeurs: { ecurie: string }[] };
    const premier = s.constructeurs[0]!.ecurie, dernier = s.constructeurs.at(-1)!.ecurie, deuxieme = s.constructeurs[1]!.ecurie;
    expect(restrictionAero(m, premier)).toBeCloseTo(0.7);
    expect(restrictionAero(m, deuxieme)).toBeCloseTo(0.75);
    expect(restrictionAero(m, dernier)).toBeCloseTo(1.15);
    expect(allocationSemaine(m, dernier).heures / allocationSemaine(m, premier).heures).toBeCloseTo(1.15 / 0.7, 5);
  }, 120_000);

  it('les heures vont aux projets aéro et à la recherche ; sans projet aéro, toutes à la recherche', () => {
    const m = sc.creerMonde(2), moteur = sc.creerMoteur();
    moteur.avancer(m, 12);
    const avecHeures = projets(m).filter((p) => (p.heures ?? 0) > 0);
    expect(avecHeures.length).toBeGreaterThan(0);
    for (const p of avecHeures) expect(['aileron_avant', 'aileron_arriere', 'pontons', 'fond_plat']).toContain(p.type);
  }, 120_000);
});

describe('Phase 12b — rythmes et fatigue', () => {
  it('normal soutenable, intensif fatigant, récupération garantie', () => {
    expect(fatigueEquilibre(1)).toBe(15);
    expect(fatigueEquilibre(RYTHMES.charge.intensif)).toBeGreaterThan(50);
    const d = { fatigue: 15 } as Departement;
    for (let i = 0; i < 12; i++) evoluerFatigue(d, RYTHMES.charge.intensif);
    const epuise = d.fatigue!;
    expect(epuise).toBeGreaterThan(40);
    for (let i = 0; i < 16; i++) evoluerFatigue(d, RYTHMES.charge.allege);
    expect(d.fatigue!).toBeLessThan(20); // une équipe épuisée remise à un rythme allégé redevient fraîche
    // L'intensif permanent ne rapporte presque plus : vitesse × productivité à l'équilibre.
    expect(RYTHMES.vitesse.intensif * facteurProductivite(fatigueEquilibre(RYTHMES.charge.intensif))).toBeLessThan(1.2);
    expect(RYTHMES.vitesse.intensif * facteurProductivite(33)).toBeCloseTo(1.3, 5); // quelques semaines : plein bénéfice
    expect(probaIncident(55)).toBeGreaterThan(5 * probaIncident(15));
  });

  it('charge d’un pôle : rythmes des projets en conception, rapportés aux équipes', () => {
    const p = (type: string, rythme: ProjetConception['rythme']) => ({ type, rythme } as ProjetConception);
    expect(chargePole([p('aileron_avant', 'intensif'), p('fond_plat', 'normal')], 'aero')).toBeCloseTo((1.35 + 1) / 2, 5);
    expect(chargePole([p('chassis', 'intensif')], 'aero')).toBe(0);
  });
});

describe('Phase 12b — dilemmes techniques', () => {
  it('bloquant pour le joueur qui ne délègue pas ; même commande ; l’IA tranche aussitôt', () => {
    const m = sc.creerMonde(3), moteur = sc.creerMoteur();
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: 'eq_williams', prenom: 'Camille', nom: 'Essai' } });
    const tp = teamPrincipal(m, 'eq_williams')!;
    executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: tp.id, parametres: { ecurie: 'eq_williams', domaine: 'recherche', actif: false } });
    moteur.avancer(m, 2);
    expect(executerCommandeJoueur(moteur, m, { type: 'conception.lancer', auteur: tp.id, parametres: { ecurie: 'eq_williams', type: 'fond_plat', concept: 0 } }).ok).toBe(true);
    const p = projets(m, 'eq_williams')[0]!;
    const d = creerDilemme(m, { ecurie: 'eq_williams', projet: p.id, famille: 'materiau', options: ['tenter', 'essais', 'conserver'], recommandation: 'essais', texte: 'Essai', verite: { fragile: true } });
    const bloquantes = decisionsEnAttente(m).filter((x) => x.bloquante && x.type === 'dilemme_technique');
    expect(bloquantes).toHaveLength(1);
    expect(executerCommandeJoueur(moteur, m, { type: 'conception.dilemme', auteur: tp.id, parametres: { dilemme: d.id, option: 'inconnue' } }).ok).toBe(false);
    expect(executerCommandeJoueur(moteur, m, { type: 'conception.dilemme', auteur: tp.id, parametres: { dilemme: d.id, option: 'tenter' } }).ok).toBe(true);
    expect(dilemmes(m, 'eq_williams')).toHaveLength(0);
    expect(p.defaut?.type).toBe('fragile'); // la vérité était fixée : le matériau était fragile
    // Une écurie de l'IA tranche tout de suite : rien n'attend.
    const q = projets(m).find((x) => x.ecurie !== 'eq_williams');
    if (q) {
      creerDilemme(m, { ecurie: q.ecurie, projet: q.id, famille: 'alerte', options: ['ralentir', 'verifier', 'maintenir'], recommandation: 'ralentir', texte: 'Essai', verite: {} });
      expect(dilemmes(m, q.ecurie)).toHaveLength(0);
      expect(table(m, TABLES.projetsConception)[q.id] && (table(m, TABLES.projetsConception)[q.id] as unknown as ProjetConception).rythme).toBe('allege');
    }
    expect(ecurie(m, 'eq_williams').pilotee).toBe(true);
  }, 120_000);
});

describe('Format 32', () => {
  it('migration v31 → v32 : la table des dilemmes est créée, la partie avance', () => {
    const m = sc.creerMonde(4);
    const texte = serialiser(m).replaceAll(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":31').replace('"dilemmesTechniques":{}', '"_x":{}');
    const migre = deserialiser(texte);
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(table(migre, TABLES.dilemmesTechniques)).toBeDefined();
    sc.creerMoteur().avancer(migre, 8);
  }, 120_000);
});
