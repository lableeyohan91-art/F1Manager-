/**
 * Phase 12a — monoplaces : sensibilités des circuits, physique des pièces, frontière, projets de conception, paris de concept, format 31.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  avecPiece, copierMonde, creerScenarioGrille2026, deserialiser, ecartMoyen, ecartTempsPct, effetPiece, empreinte, frontiere, indiceMoyen, paysage,
  paysagePercu, parametresVoiture, piecesInstallees, projets, savoir, serialiser, table, TABLES, teamPrincipal, VERSION_FORMAT,
  type Circuit, type Ecurie, type Monde, type Reglement,
} from '../src/engine';
import { PARAMETRES_SENSIBILITE, PIECES, SENSIBILITES_MOYENNES, TYPES_PIECES } from '../src/engine/balance/monoplaces';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const circuit = (m: Monde, id: string) => table(m, TABLES.circuits)[id] as unknown as Circuit;
const ecurie = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;

describe('Phase 12a — physique', () => {
  it('les 30 circuits ont leurs sensibilités et leurs températures ; les sensibilités moyennes sont la moyenne du fichier', () => {
    const m = sc.creerMonde(1);
    const cs = Object.values(table(m, TABLES.circuits)) as unknown as Circuit[];
    expect(cs).toHaveLength(30);
    for (const c of cs) {
      expect(c.sensibilites!.d1['cda']).toBeGreaterThan(0); // plus de traînée : plus lent partout
      expect(c.sensibilites!.d1['cla']).toBeLessThan(0); // plus d'appui : plus rapide partout (au réglage optimal)
      expect(c.temperatureMensuelle).toHaveLength(12);
    }
    const lignes = readFileSync('data/grille-2026/sensibilites-circuits.csv', 'utf8').trim().split('\n');
    const entete = lignes[0]!.split(';');
    for (const k of PARAMETRES_SENSIBILITE) {
      const col = entete.indexOf(`d1_${k}`);
      const moy = lignes.slice(1).reduce((a, l) => a + Number(l.split(';')[col]), 0) / (lignes.length - 1);
      expect(SENSIBILITES_MOYENNES.d1[k]).toBeCloseTo(moy, 4);
    }
  });

  it('un vrai compromis : l’aileron arrière « faible traînée » paie à Monza, « fort appui » à Monaco', () => {
    const m = sc.creerMonde(1);
    const e = ecurie(m, 'eq_williams');
    // Avance (% de temps au tour) du concept « faible traînée » sur le concept « fort appui » : positive si la faible traînée est plus rapide.
    const gainFaibleTrainee = (id: string) => ecartTempsPct(avecPiece(m, e, 'aileron_arriere', 10, 1), circuit(m, id)) - ecartTempsPct(avecPiece(m, e, 'aileron_arriere', 10, -1), circuit(m, id));
    expect(gainFaibleTrainee('cir_monza')).toBeGreaterThan(0);
    expect(gainFaibleTrainee('cir_monaco')).toBeLessThan(0);
    // Aucun concept d'aileron n'est meilleur partout.
    const signes = (Object.values(table(m, TABLES.circuits)) as unknown as Circuit[]).map((c) => Math.sign(gainFaibleTrainee(c.id)));
    expect(signes.filter((x) => x > 0).length).toBeGreaterThan(5);
    expect(signes.filter((x) => x < 0).length).toBeGreaterThan(5);
  });

  it('refroidissement : des pontons serrés coûtent de la puissance là où il fait chaud', () => {
    const m = sc.creerMonde(1);
    const e = ecurie(m, 'eq_williams');
    const singapour = circuit(m, 'cir_singapour');
    const serres = avecPiece(m, e, 'pontons', 10, -1), genereux = avecPiece(m, e, 'pontons', 10, 1);
    expect(serres.refroidissement).toBeLessThan(genereux.refroidissement);
    expect(serres.cda).toBeLessThan(genereux.cda);
    // Puissance perdue faute de refroidissement, mesurée sans l'effet de traînée : même carrosserie, marge différente.
    const memeTrainee = { ...genereux, refroidissement: serres.refroidissement };
    expect(ecartTempsPct(memeTrainee, singapour, 9)).toBeGreaterThan(ecartTempsPct(genereux, singapour, 9));
  });

  it('voitures de départ : six pièces, hiérarchie des notes conservée, savoir de départ cohérent', () => {
    const m = sc.creerMonde(1);
    for (const id of ['eq_mercedes', 'eq_cadillac']) expect(piecesInstallees(m, id).map((p) => p.type).sort()).toEqual([...TYPES_PIECES].sort());
    expect(indiceMoyen(m, ecurie(m, 'eq_mercedes'))).toBeGreaterThan(indiceMoyen(m, ecurie(m, 'eq_cadillac')));
    expect(savoir(m, 'eq_mercedes', 'aero_avant').fondamental).toBeGreaterThan(savoir(m, 'eq_cadillac', 'aero_avant').fondamental);
    for (const id of ['eq_mercedes', 'eq_cadillac']) for (const p of piecesInstallees(m, id)) expect(frontiere(m, ecurie(m, id), p.type as never)).toBeGreaterThan(p.efficacite);
  });

  it('effets des pièces : un point d’efficacité améliore la voiture, sans compromis', () => {
    for (const t of TYPES_PIECES) {
      const e = effetPiece(t, 11, 0) as Record<string, number>;
      for (const [k, x] of Object.entries(PIECES[t].gain)) expect(Math.sign(e[k]!)).toBe(Math.sign(x as number));
    }
  });
});

describe('Phase 12a — conception', () => {
  it('commande : mêmes règles pour tous, coût payé au lancement, version installée à la fin si elle est estimée meilleure', () => {
    const m = sc.creerMonde(4);
    ecurie(m, 'eq_williams').pilotee = true; // sans délégation : seul le joueur décide pour Williams
    ecurie(m, 'eq_williams').delegationRecherche = false;
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 3);
    const tp = teamPrincipal(m, 'eq_williams')!;
    const lancer = (prm: Record<string, unknown>, auteur = tp.id) => moteur.commandes.executer(m, { type: 'conception.lancer', auteur, source: 'exterieur', parametres: { ecurie: 'eq_williams', ...prm } });
    expect(lancer({ type: 'aileron_avant', concept: 0 }, teamPrincipal(m, 'eq_mercedes')!.id).ok).toBe(false);
    expect(lancer({ type: 'aileron_volant', concept: 0 }).ok).toBe(false);
    expect(lancer({ type: 'aileron_avant', concept: 3 }).ok).toBe(false);
    const fi = (Object.values(table(m, TABLES.finances)) as unknown as { ecurie: string; depensesTechniques?: { projetsMEUR: number } }[]).find((f) => f.ecurie === 'eq_williams')!;
    const avant = fi.depensesTechniques?.projetsMEUR ?? 0;
    expect(lancer({ type: 'aileron_avant', concept: 0.2 })).toEqual({ ok: true });
    expect(fi.depensesTechniques!.projetsMEUR).toBeCloseTo(avant + PIECES.aileron_avant.coutProjetMEUR, 5);
    expect(lancer({ type: 'aileron_avant', concept: 0 }).ok).toBe(false); // déjà un projet sur cette pièce
    const versionAvant = piecesInstallees(m, 'eq_williams').find((p) => p.type === 'aileron_avant')!.version;
    for (let i = 0; i < 20 && projets(m, 'eq_williams').length; i++) moteur.avancer(m, 1);
    expect(projets(m, 'eq_williams')).toHaveLength(0);
    const fin = Object.values(m.evenements).find((e) => e.type === 'conception.terminee' && e.acteurs.some((a) => a.id === 'eq_williams'))!;
    expect(fin).toBeDefined();
    const installee = piecesInstallees(m, 'eq_williams').find((p) => p.type === 'aileron_avant')!;
    expect(installee.version > versionAvant).toBe(fin.contexte['installee'] === true);
  }, 120_000);

  it('l’IA conçoit des pièces pendant la saison ; mêmes résultats avec la même graine', () => {
    const a = sc.creerMonde(5), b = sc.creerMonde(5);
    sc.creerMoteur().avancer(a, 30);
    sc.creerMoteur().avancer(b, 30);
    expect(Object.values(a.evenements).filter((e) => e.type === 'conception.terminee').length).toBeGreaterThan(10);
    expect(empreinte(a)).toBe(empreinte(b));
  }, 120_000);

  it('frontière : plus de savoir l’élargit, avec un rendement décroissant', () => {
    const m = sc.creerMonde(1);
    const e = ecurie(m, 'eq_haas');
    const f = (s: number) => { savoir(m, 'eq_haas', 'fond_plat').fondamental = s; return frontiere(m, e, 'fond_plat'); };
    const f0 = f(0), f30 = f(30), f60 = f(60);
    expect(f30).toBeGreaterThan(f0);
    expect(f60 - f30).toBeLessThan(f30 - f0);
  });
});

describe('Phase 12a — paris de concept', () => {
  it('chaque grande réforme cache une architecture meilleure ; la perception se resserre avec le savoir préparé', () => {
    const m = sc.creerMonde(1);
    const r: Reglement = { id: 'reg_test', generation: 2, orientation: 'aero', debut: 2030, fin: 2034, statut: 'annonce', intensites: { aero_avant: 0.8, aero_arriere: 0.8, fond_plat: 0.8, refroidissement: 0.5 }, pneus: 1 };
    table(m, TABLES.reglements)[r.id] = r as never;
    const { familles, penalites } = paysage(m, r);
    expect(familles.length).toBeGreaterThanOrEqual(2);
    expect(Object.values(penalites).filter((x) => x === 0)).toHaveLength(1);
    const erreur = (mm: Monde) => { const p = paysagePercu(mm, 'eq_haas', r); return familles.reduce((a, x) => a + Math.abs(p[x]! - penalites[x]!), 0); };
    const prepare = copierMonde(m);
    for (const d of ['aero_avant', 'aero_arriere', 'fond_plat', 'refroidissement', 'gestion_thermique']) savoir(prepare, 'eq_haas', d).parReglement[r.id] = 60;
    expect(erreur(prepare)).toBeLessThan(erreur(m));
    // Une mauvaise architecture réduit la frontière des pièces touchées, pas des autres.
    const e = ecurie(m, 'eq_haas');
    const mauvaise = familles.find((x) => penalites[x]! > 0)!;
    const bonne = familles.find((x) => penalites[x] === 0)!;
    e.architectures = { [r.id]: bonne };
    const fBonne = frontiere(m, e, 'fond_plat', r), fSuspBonne = frontiere(m, e, 'suspensions', r);
    e.architectures = { [r.id]: mauvaise };
    expect(frontiere(m, e, 'fond_plat', r)).toBeLessThan(fBonne);
    expect(frontiere(m, e, 'suspensions', r)).toBe(fSuspBonne);
  });
});

describe('Phase 12a — format 31', () => {
  it('migration v30 → v31 : la voiture d’une ancienne partie devient six pièces, sans notes de vitesse', () => {
    const m = sc.creerMonde(2);
    const ancien = JSON.parse(serialiser(m));
    const contenu = ancien.contenu ?? ancien;
    const tables = contenu.tables ?? contenu.monde?.tables;
    expect(tables).toBeDefined();
    tables.pieces = {};
    for (const v of Object.values(tables.voitures) as Record<string, unknown>[]) Object.assign(v, { viragesLents: 15, viragesRapides: 15, vitessePointe: 14, efficaciteAero: 15 });
    for (const c of Object.values(tables.circuits) as Record<string, unknown>[]) { delete c['sensibilites']; delete c['temperatureMensuelle']; }
    const texte = JSON.stringify(ancien).replaceAll(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":30');
    const migre = deserialiser(texte);
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    expect(piecesInstallees(migre, 'eq_williams')).toHaveLength(6);
    expect((Object.values(table(migre, TABLES.voitures))[0] as Record<string, unknown>)['viragesLents']).toBeUndefined();
    // Sans sensibilités propres, les circuits utilisent la moyenne : la partie avance normalement.
    expect(Number.isFinite(ecartMoyen(parametresVoiture(migre, ecurie(migre, 'eq_williams')), [circuit(migre, 'cir_monza')]))).toBe(true);
    sc.creerMoteur().avancer(migre, 12);
  }, 120_000);
});
