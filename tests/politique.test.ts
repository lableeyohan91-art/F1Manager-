/** Phase 8d-4 — politique : fédération et président élu, lobbying, autres votes, alliances. */
import { describe, expect, it } from 'vitest';
import {
  allies, candidatsPresidence, copierMonde, creerScenarioGrille2026, deserialiser, detecterAlliances, federation, financesDe, initialiserFederation, plafond,
  poidsOrientation, preparerReformes, avantProjets, reglementEnVigueur, serialiser, table, TABLES, teamPrincipal, VERSION_FORMAT, type Ecurie, type Monde,
} from '../src/engine';
import { FEDERATION, INFLUENCE, LOBBYING } from '../src/engine/balance/politique';
import { CALENDRIER_REGLEMENT } from '../src/engine/balance/technique';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const ecuries = (m: Monde) => (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).filter((e) => e.statut === 'active');

describe('Phase 8d-4 — fédération et président', () => {
  it('un président de départ, au profil borné ; élection tous les 4 ans ; le vote du joueur compte', () => {
    const m = sc.creerMonde(1);
    (table(m, TABLES.ecuries)['eq_williams'] as unknown as Ecurie).pilotee = true;
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 4); // les premières personnalités disponibles apparaissent avec le réservoir (semaine 3)
    const f = federation(m)!;
    expect(f.president).toBeDefined();
    expect(f.finMandat - f.debutMandat + 1).toBe(FEDERATION.dureeMandat);
    expect(f.rigueur).toBeGreaterThanOrEqual(-1);
    expect(f.rigueur).toBeLessThanOrEqual(1);
    expect(f.sensibiliteLobbying).toBeGreaterThanOrEqual(0);
    expect(f.sensibiliteLobbying).toBeLessThanOrEqual(1);
    while (!(m.date.annee === f.finMandat && m.date.semaine === FEDERATION.semaineElection)) moteur.avancer(m, 1);
    const candidats = candidatsPresidence(m);
    expect(candidats.length).toBeGreaterThanOrEqual(2);
    const tp = teamPrincipal(m, 'eq_williams')!;
    const choix = candidats[candidats.length - 1]!.id;
    expect(moteur.commandes.executer(m, { type: 'federation.vote', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', candidat: 'per_inconnu' } }).ok).toBe(false);
    expect(moteur.commandes.executer(m, { type: 'federation.vote', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', candidat: choix } }).ok).toBe(true);
    const ancienne = f.finMandat;
    moteur.avancer(m, 1);
    expect(f.debutMandat).toBe(ancienne + 1);
    expect(f.election?.votes['eq_williams']).toBe(choix);
    expect(Object.values(m.evenements).some((e) => e.type === 'federation.election')).toBe(true);
  }, 120_000);
});

describe('Phase 8d-4 — lobbying', () => {
  it('règles de la commande ; il pèse sur le choix des propositions (jamais sur les voix) ; il coûte réellement', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 1);
    const annee = reglementEnVigueur(m)!.fin - CALENDRIER_REGLEMENT.anneesAvantFin;
    const lob = (montant: number, orientation = 'aero') => moteur.commandes.executer(m, { type: 'politique.lobbying', auteur: teamPrincipal(m, 'eq_haas')!.id, source: 'exterieur', parametres: { ecurie: 'eq_haas', orientation, montant } });
    expect(lob(1).ok).toBe(false); // hors période
    while (!(m.date.annee === annee && m.date.semaine === 1)) moteur.avancer(m, 1);
    const f = federation(m)!;
    f.lobbyistes = f.lobbyistes.filter((e) => e !== 'eq_haas'); // l'IA a peut-être déjà fait pression pour Haas
    expect(lob(LOBBYING.montantMax + 1).ok).toBe(false);
    expect(lob(1, 'inconnue').ok).toBe(false);
    const fi = financesDe(m, 'eq_haas')!;
    const poids = poidsOrientation(m, 'aero', INFLUENCE.bonusPresident);
    fi.tresorerieMEUR = Math.max(fi.tresorerieMEUR, 50);
    const avant = fi.tresorerieMEUR;
    expect(lob(LOBBYING.montantMax)).toEqual({ ok: true });
    expect(lob(1).ok).toBe(false); // une fois par réforme
    expect(fi.tresorerieMEUR).toBeCloseTo(avant - LOBBYING.montantMax, 9);
    expect(poidsOrientation(m, 'aero', INFLUENCE.bonusPresident)).toBeGreaterThan(poids);
    // Contrefactuel : une pression écrasante pour l'aérodynamique la place parmi les propositions.
    const a = copierMonde(m);
    federation(a)!.lobbying = { aero: 1000 };
    preparerReformes(a);
    expect(avantProjets(a).some((r) => r.orientation === 'aero')).toBe(true);
  }, 120_000);
});

describe('Phase 8d-4 — autres votes et alliances', () => {
  it('une règle votée s’applique la saison suivante ; un réglage d’expérience la remplace', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 1);
    const f = initialiserFederation(m);
    const base = plafond(m);
    f.reglesAVenir = { plafondMEUR: base * 0.9 };
    expect(plafond(m)).toBe(base);
    const annee = m.date.annee;
    while (!(m.date.annee === annee + 1 && m.date.semaine === 2)) moteur.avancer(m, 1);
    expect(plafond(m)).toBeCloseTo(base * 0.9, 9);
    m.parametres['reglement.plafondMEUR'] = 300;
    expect(plafond(m)).toBe(300);
  }, 60_000);

  it('alliances : même motoriste ou écuries partenaires ; relation symétrique', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 4);
    const alliances = detecterAlliances(m);
    for (const a of alliances) expect(a.ecuries.length).toBeGreaterThanOrEqual(2);
    const parMoteur = new Map<string, string[]>();
    for (const e of ecuries(m)) (parMoteur.get(e.motoriste) ?? parMoteur.set(e.motoriste, []).get(e.motoriste)!).push(e.id);
    for (const ids of parMoteur.values()) if (ids.length > 1) for (const x of ids) for (const y of ids) if (x !== y) expect(allies(m, x)).toContain(y);
    for (const e of ecuries(m)) for (const x of allies(m, e.id)) expect(allies(m, x)).toContain(e.id);
  }, 60_000);

  it('format 24 : migration depuis 23 ; fédération recréée à la semaine suivante', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const ancien = copierMonde(m) as unknown as { tables: Record<string, unknown> };
    delete ancien.tables['federation'];
    delete ancien.tables['alliances'];
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":23'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(migre.tables['federation']).toEqual({});
    moteur.avancer(migre, 1);
    expect(federation(migre)?.president).toBeDefined();
  }, 60_000);
});

describe('Phase 8d-4 — nombre de Grands Prix (D-141)', () => {
  it('un nombre voté (20 à 24) fixe le calendrier de la saison suivante', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 1);
    initialiserFederation(m).reglesAVenir = { grandsPrix: 21 };
    const annee = m.date.annee;
    while (!(m.date.annee === annee + 1 && m.date.semaine === 2)) moteur.avancer(m, 1);
    const s = table(m, TABLES.saisons)[`ssn_${annee + 1}`] as unknown as { calendrier: string[] };
    expect(s.calendrier).toHaveLength(21);
  }, 60_000);
});
