/** Phases 8a et 8b — règlements et recherche (D-128, D-132). */
import { describe, expect, it } from 'vitest';
import {
  copierMonde, creerScenarioGrille2026, deserialiser, empreinte, entreeEnVigueur, partRecherche, programmes, propositions, reglementAnnonce, reglementEnVigueur,
  reglements, rejeter, savoir, serialiser, table, TABLES, teamPrincipal, VERSION_FORMAT, voitureDe, type Ecurie, type Monde, type Personne, type Reglement,
} from '../src/engine';
import { CONCEPTION_PROVISOIRE, LISTE_DOMAINES, PROGRAMMES, SAVOIR } from '../src/engine/balance/technique';
import { reconcevoirGrille } from '../src/engine/systems/technique/conception';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const ecurie = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;
const CARACS = ['viragesLents', 'viragesRapides', 'vitessePointe', 'efficaciteAero', 'fiabilite', 'gestionPneus'] as const;

function mondeJoueur(semaines = 3) {
  const m = sc.creerMonde(1);
  ecurie(m, 'eq_williams').pilotee = true;
  const moteur = sc.creerMoteur();
  moteur.avancer(m, semaines);
  return { m, moteur, tp: teamPrincipal(m, 'eq_williams')! };
}

describe('Phase 8a — règlements', () => {
  it('cycle complet sur 15 saisons : propositions, vote en deux tours, annonce environ deux saisons avant, entrée en vigueur, reconception', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    const vus = new Set<string>();
    for (let s = 0; s < 15; s++) {
      for (let k = 0; k < 52; k++) {
        moteur.avancer(m, 1);
        const a = reglementAnnonce(m);
        if (a && !vus.has(a.id)) {
          vus.add(a.id);
          // Annoncée au vote de mi-saison pour une entrée en vigueur au moins deux saisons complètes plus tard.
          expect(a.debut - m.date.annee).toBeGreaterThanOrEqual(2);
        }
      }
      const enVigueur = reglements(m).filter((r) => r.statut === 'en_vigueur');
      expect(enVigueur).toHaveLength(1); // toujours un et un seul règlement en vigueur
      expect(reglements(m).filter((r) => r.statut === 'annonce').length).toBeLessThanOrEqual(1);
    }
    expect(vus.size).toBeGreaterThanOrEqual(1);
    expect(reglements(m).some((r) => r.generation > 1 && (r.statut === 'en_vigueur' || r.statut === 'termine'))).toBe(true);
  }, 120_000);

  it('obsolescence à l’entrée en vigueur : le savoir propre à l’ancien règlement est gardé à hauteur de (1 − intensité)', () => {
    const { m } = mondeJoueur();
    const ancien = reglementEnVigueur(m)!;
    const s = savoir(m, 'eq_mercedes', 'aero_avant');
    s.parReglement[ancien.id] = 40;
    s.fondamental = 10;
    const nouveau: Reglement = { id: 'reg_test', generation: 2, orientation: 'aero', debut: m.date.annee, fin: m.date.annee + 4, statut: 'annonce', intensites: Object.fromEntries(LISTE_DOMAINES.map((d) => [d, d === 'aero_avant' ? 0.75 : 0])), pneus: 1 };
    table(m, TABLES.reglements)[nouveau.id] = nouveau as never;
    expect(entreeEnVigueur(m)).toBe(true);
    expect(s.parReglement['reg_test']).toBeCloseTo(40 * 0.25, 3);
    expect(s.parReglement[ancien.id]).toBeUndefined();
    expect(s.fondamental).toBe(10); // le fondamental n'est jamais perdu
    expect(reglementEnVigueur(m)!.id).toBe('reg_test');
  });

  it('reconception neutre pour la grille, qui rebat la hiérarchie selon la préparation (contrefactuel)', () => {
    const { m } = mondeJoueur();
    const reg = reglementEnVigueur(m)!;
    const intensites = Object.fromEntries(LISTE_DOMAINES.map((d) => [d, 0.6]));
    const ecuries = (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).filter((e) => e.statut === 'active');
    const moyenne = (mm: Monde, c: (typeof CARACS)[number]) => ecuries.reduce((a, e) => a + voitureDe(mm, e.id)[c], 0) / ecuries.length;
    const a = copierMonde(m);
    const b = copierMonde(m);
    for (const d of LISTE_DOMAINES) savoir(b, 'eq_cadillac', d).parReglement[reg.id] = 40; // seule différence : la préparation
    const avant = CARACS.map((c) => moyenne(m, c));
    reconcevoirGrille(a, ecuries, intensites, reg.id, 'test');
    reconcevoirGrille(b, ecuries, intensites, reg.id, 'test');
    // Le niveau du plateau ne monte ni ne baisse d'office (seul l'aléa d'exécution, de moyenne nulle, le fait varier).
    CARACS.forEach((c, i) => expect(Math.abs(moyenne(a, c) - avant[i]!)).toBeLessThan(1));
    // La préparation paie : à aléa identique, l'écurie préparée est meilleure partout.
    for (const c of CARACS) expect(voitureDe(b, 'eq_cadillac')[c]).toBeGreaterThan(voitureDe(a, 'eq_cadillac')[c]);
  });

  it('vote du joueur par commande ; sans vote ni délégation, son écurie s’abstient', () => {
    const m = sc.creerMonde(1);
    ecurie(m, 'eq_williams').pilotee = true;
    const moteur = sc.creerMoteur();
    while (!propositions(m).length) moteur.avancer(m, 1);
    const tp = teamPrincipal(m, 'eq_williams')!;
    const autre = teamPrincipal(m, 'eq_mercedes')!;
    const vote = (auteur: string, option: string) => moteur.commandes.executer(m, { type: 'reglement.vote', auteur, source: 'exterieur', parametres: { ecurie: 'eq_williams', option } });
    expect(vote(autre.id, 'prolongation').ok).toBe(false); // seul le team principal de l'écurie
    expect(vote(tp.id, 'inconnue').ok).toBe(false);
    const copie = copierMonde(m);
    expect(vote(tp.id, propositions(m)[0]!.id).ok).toBe(true);
    while (propositions(m).length) moteur.avancer(m, 1);
    while (propositions(copie).length) moteur.avancer(copie, 1);
    const bulletins = (m: Monde) => (Object.values(m.evenements).find((e) => e.type === 'reglement.vote' || e.type === 'reglement.annonce')?.contexte['bulletins'] ?? {}) as Record<string, string>;
    expect(bulletins(m)['eq_williams']).toBeDefined();
    expect(bulletins(copie)['eq_williams']).toBeUndefined(); // abstention
  }, 60_000);
});

describe('Phase 8b — recherche', () => {
  it('commandes : mêmes règles pour le joueur et l’IA (auteur, domaine, horizon, part, plafond total)', () => {
    const { m, moteur, tp } = mondeJoueur();
    const prg = (auteur: string, p: Record<string, unknown>) => moteur.commandes.executer(m, { type: 'recherche.programme', auteur, source: 'exterieur', parametres: { ecurie: 'eq_williams', emplacement: 1, domaine: 'aero_avant', horizon: 'actuelle', part: 0.2, ...p } });
    expect(prg(teamPrincipal(m, 'eq_mercedes')!.id, {}).ok).toBe(false);
    expect(prg(tp.id, { domaine: 'inconnu' }).ok).toBe(false);
    expect(prg(tp.id, { horizon: 'reg_inexistant' }).ok).toBe(false);
    expect(prg(tp.id, { part: PROGRAMMES.partMax + 0.01 }).ok).toBe(false);
    expect(prg(tp.id, { part: Number.NaN }).ok).toBe(false);
    expect(prg(tp.id, { emplacement: 3 }).ok).toBe(false);
    expect(prg(tp.id, {}).ok).toBe(true);
    expect(prg(tp.id, { emplacement: 2, part: 0.35 }).ok).toBe(false); // 0,2 + 0,35 > 0,5
    expect(prg(tp.id, { emplacement: 2, part: 0.3, domaine: 'energie', horizon: 'suivante' }).ok).toBe(true);
    expect(partRecherche(m, 'eq_williams')).toBeCloseTo(0.5, 9);
    // Réorientation : remise en route (coût en temps seulement).
    expect(prg(tp.id, { domaine: 'chassis' }).ok).toBe(true);
    expect(programmes(m, 'eq_williams').find((p) => p.emplacement === 1)!.remiseEnRoute).toBe(SAVOIR.remiseEnRouteSemaines);
  });

  it('le joueur garde la main : sans délégation, l’IA ne touche pas à ses programmes ; avec délégation, son DT décide', () => {
    const { m, moteur, tp } = mondeJoueur(1);
    moteur.avancer(m, 10);
    expect(programmes(m, 'eq_williams')).toHaveLength(0);
    expect(programmes(m, 'eq_mercedes').length).toBeGreaterThan(0);
    expect(moteur.commandes.executer(m, { type: 'recherche.deleguer', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', actif: true } }).ok).toBe(true);
    moteur.avancer(m, 52);
    expect(programmes(m, 'eq_williams').length).toBeGreaterThan(0);
  }, 60_000);

  it('suspension sans perte ; recherche sur une proposition rejetée : seule la part fondamentale reste', () => {
    const { m, moteur, tp } = mondeJoueur();
    expect(moteur.commandes.executer(m, { type: 'recherche.programme', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', emplacement: 1, domaine: 'energie', horizon: 'actuelle', part: 0.2 } }).ok).toBe(true);
    moteur.avancer(m, 12);
    const s = savoir(m, 'eq_williams', 'energie');
    const acquis = JSON.stringify(s);
    expect(moteur.commandes.executer(m, { type: 'recherche.suspendre', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', emplacement: 1 } }).ok).toBe(true);
    moteur.avancer(m, 2);
    expect(s.fondamental).toBeGreaterThan(0);
    expect(JSON.parse(acquis).fondamental).toBeLessThanOrEqual(s.fondamental + 1e-9); // rien n'est perdu (hors vieillissement annuel)
    expect(partRecherche(m, 'eq_williams')).toBe(0);
    // Rejet : 30 % du savoir propre à la proposition devient fondamental ; les programmes qui la visaient sont suspendus.
    const s2 = savoir(m, 'eq_ferrari', 'chassis');
    s2.parReglement['reg_rejete'] = 20;
    const f0 = s2.fondamental;
    const r = { id: 'reg_rejete', generation: 9, orientation: 'chassis', debut: 2099, fin: 2100, statut: 'propose', intensites: {}, pneus: 1, votes: {} } as Reglement;
    table(m, TABLES.reglements)[r.id] = r as never;
    rejeter(m, r);
    expect(r.statut).toBe('rejete');
    expect(s2.parReglement['reg_rejete']).toBeUndefined();
    expect(s2.fondamental).toBeCloseTo(f0 + 20 * SAVOIR.partFondamentalRejet, 3);
  }, 60_000);

  it('la recherche coûte du développement aujourd’hui (contrefactuel)', () => {
    const { m, moteur, tp } = mondeJoueur();
    const a = copierMonde(m);
    const b = copierMonde(m);
    moteur.commandes.executer(b, { type: 'recherche.programme', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', emplacement: 1, domaine: 'energie', horizon: 'suivante', part: 0.35 } });
    moteur.avancer(a, 20);
    moteur.avancer(b, 20);
    const somme = (mm: Monde) => CARACS.reduce((x, c) => x + voitureDe(mm, 'eq_williams')[c], 0);
    expect(somme(b)).toBeLessThan(somme(a));
    expect(savoir(b, 'eq_williams', 'energie').pourSaisonSuivante).toBeGreaterThan(0);
    expect(CONCEPTION_PROVISOIRE.parPointPreparation).toBeGreaterThan(0);
  }, 60_000);
});

describe('Phase 8 — format et déterminisme', () => {
  it('format 20 : migration depuis 19, tables créées ; sauvegarde relue à l’identique', () => {
    const { m } = mondeJoueur();
    expect(VERSION_FORMAT).toBe(20);
    const ancien = copierMonde(m) as unknown as Record<string, unknown>;
    for (const t of ['reglements', 'evolutionsMineures', 'savoirs', 'programmes', 'historiqueRecherche', 'decouvertes']) delete (ancien['tables'] as Record<string, unknown>)[t];
    const migre = deserialiser(serialiser(ancien as unknown as Monde).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":19'));
    expect(migre.versionFormat).toBe(20);
    for (const t of ['reglements', 'evolutionsMineures', 'savoirs', 'programmes', 'historiqueRecherche', 'decouvertes']) expect(migre.tables[t]).toEqual({});
    expect(empreinte(deserialiser(serialiser(m)))).toBe(empreinte(m));
  });

  it('volumes bornés et déterminisme sur 12 saisons', () => {
    const run = () => {
      const m = sc.creerMonde(4);
      sc.creerMoteur().avancer(m, 52 * 12);
      return m;
    };
    const a = run();
    expect(empreinte(a)).toBe(empreinte(run()));
    expect(Object.keys(table(a, TABLES.savoirs)).length).toBeLessThanOrEqual(11 * LISTE_DOMAINES.length + 12 * 2);
    expect(Object.keys(table(a, TABLES.decouvertes)).length).toBeLessThanOrEqual(20);
    expect(Object.keys(table(a, TABLES.evolutionsMineures)).length).toBeLessThanOrEqual(10);
    const personnes = Object.values(table(a, TABLES.personnes)) as unknown as Personne[];
    expect(personnes.length).toBeGreaterThan(0);
  }, 240_000);
});
