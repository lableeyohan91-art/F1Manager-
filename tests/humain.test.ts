import { describe, expect, it } from 'vitest';
import {
  relationBrute,
  ajouterEvenement, contratEmploi, copierMonde, creerScenarioGrille2026, deserialiser, empreinte, lireEvenement, passerUnMois,
  personneDe, promesses, proposerProlongation, relation, serialiser, souvenirsDe, soumettreCommande, teamPrincipal, valeurMarche,
  verifierCoherence, VERSION_FORMAT, type Monde, type Personne,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const S = 52;
const evt = (m: Monde, type = 'test.evenement') => ajouterEvenement(m, { type, acteurs: [], importance: 2 }).id;
const p = (m: Monde, id: string) => personneDe(m, id) as Personne;

describe('Phase 4 — mémoire v1', () => {
  it('un souvenir négatif fait baisser la confiance ; l’oubli et le résidu laissent une trace durable', () => {
    const m = sc.creerMonde(1);
    const tp = teamPrincipal(m, 'eq_ferrari')!.id;
    lireEvenement(m, 'per_leclerq', tp, 'promesse_rompue', evt(m));
    const avant = relation(m, 'per_leclerq', tp).confiance;
    expect(avant).toBeLessThan(-0.2);
    for (let i = 0; i < 120; i++) passerUnMois(m); // 10 ans
    expect(souvenirsDe(m, 'per_leclerq').filter((s) => s.etiquette === 'promesse_rompue')).toHaveLength(0);
    const apres = relation(m, 'per_leclerq', tp).confiance;
    expect(apres).toBeLessThan(0); // mémoire résiduelle
    expect(apres).toBeGreaterThan(avant); // mais atténuée
  });

  it('la rancune agit sur la durée du souvenir, pas sur sa création', () => {
    const m = sc.creerMonde(1);
    const a = p(m, 'per_leclerq'), b = p(m, 'per_hammilton');
    a.traits['rancune'] = 20; b.traits['rancune'] = 1;
    for (const x of [a, b]) for (const k of Object.keys(x.traits)) if (k !== 'rancune') x.traits[k] = 10;
    for (const x of [a, b]) for (const k of Object.keys(x.valeurs)) x.valeurs[k] = 10;
    // Phase 9 : le passé donne des familiarités différentes avec l'écurie ; on les égalise (seule la rancune doit différer).
    for (const x of [a, b]) relationBrute(m, x.id, 'eq_ferrari', true)!.familiarite = 0.5;
    const e = evt(m);
    const sa = lireEvenement(m, a.id, 'eq_ferrari', 'humiliation', e)!;
    const sb = lireEvenement(m, b.id, 'eq_ferrari', 'humiliation', e)!;
    expect(sa.intensite).toBeCloseTo(sb.intensite, 5);
    for (let i = 0; i < 12; i++) passerUnMois(m);
    expect(sa.intensite).toBeGreaterThan(sb.intensite);
  });

  it('saturation : des compliments répétés ne font pas exploser la relation', () => {
    const m = sc.creerMonde(1);
    const tp = teamPrincipal(m, 'eq_ferrari')!.id;
    lireEvenement(m, 'per_leclerq', tp, 'reconnaissance', evt(m));
    const une = relation(m, 'per_leclerq', tp).confiance;
    for (let i = 0; i < 20; i++) lireEvenement(m, 'per_leclerq', tp, 'reconnaissance', evt(m));
    const vingt = relation(m, 'per_leclerq', tp).confiance;
    expect(vingt - une).toBeLessThan(une); // 20 compliments rapprochés apportent moins qu'un seul
  });

  it('réconciliation : des excuses réduisent un souvenir négatif (critère 5 : réparable)', () => {
    const m = sc.creerMonde(1);
    const tp = teamPrincipal(m, 'eq_ferrari')!;
    m.tables['ecuries']!['eq_ferrari']!['pilotee'] = true;
    lireEvenement(m, 'per_leclerq', tp.id, 'humiliation', evt(m));
    const avant = relation(m, 'per_leclerq', tp.id).confiance;
    soumettreCommande(m, { type: 'personnel.excuses', auteur: tp.id, source: 'exterieur', parametres: { personne: 'per_leclerq', publique: false } });
    sc.creerMoteur().avancerUneSemaine(m);
    expect(relation(m, 'per_leclerq', tp.id).confiance).toBeGreaterThan(avant);
  });

  it('plafond : jamais plus de 40 souvenirs par personne', () => {
    const m = sc.creerMonde(1);
    const etiquettes = ['soutien', 'humiliation', 'gratitude', 'conflit', 'injustice'];
    const cibles = Object.keys(m.tables['personnes']!).slice(0, 30);
    for (const c of cibles) for (const e of etiquettes) lireEvenement(m, 'per_leclerq', c, e, evt(m));
    expect(souvenirsDe(m, 'per_leclerq').length).toBeLessThanOrEqual(40);
  });
});

describe('Phase 4 — contrats et négociations', () => {
  it('une offre très en dessous de la valeur est refusée ou contestée ; une offre généreuse est acceptée', () => {
    const m = sc.creerMonde(2);
    const c = contratEmploi(m, 'per_noris')!;
    const tp = teamPrincipal(m, 'eq_mclaren')!.id;
    const v = valeurMarche(m, p(m, 'per_noris'));
    expect(proposerProlongation(copierMonde(m), c, tp, v * 0.3, 2, [], 1).issue).not.toBe('accord');
    expect(proposerProlongation(m, c, tp, v * 1.6, 3, [], 1).issue).toBe('accord');
  });

  it('chaque réponse a des raisons lisibles (critère 6)', () => {
    const m = sc.creerMonde(2);
    const res = proposerProlongation(m, contratEmploi(m, 'per_alonzo')!, teamPrincipal(m, 'eq_aston')!.id, 5, 1, [], 1);
    expect(res.raisons.length).toBeGreaterThan(0);
    expect(res.raisons.every((r) => /^[+−] /.test(r))).toBe(true);
  });

  it('une promesse de statut de n°1 rompue crée un souvenir de promesse rompue', () => {
    const m = sc.creerMonde(4);
    const tp = teamPrincipal(m, 'eq_ferrari')!;
    m.tables['ecuries']!['eq_ferrari']!['pilotee'] = true;
    const mo = sc.creerMoteur();
    const c = contratEmploi(m, 'per_hammilton')!;
    const res = proposerProlongation(m, c, tp.id, valeurMarche(m, p(m, 'per_hammilton')) * 2, 2, ['statut_n1'], 1);
    expect(res.issue).toBe('accord');
    expect(promesses(m).some((x) => x.beneficiaire === 'per_hammilton' && x.type === 'statut_n1')).toBe(true);
    soumettreCommande(m, { type: 'pilote.statut_n1', auteur: tp.id, source: 'exterieur', parametres: { personne: 'per_hammilton', accorder: false } });
    mo.avancer(m, 2);
    expect(promesses(m).find((x) => x.beneficiaire === 'per_hammilton')!.statut).toBe('rompue');
    expect(souvenirsDe(m, 'per_hammilton').some((s) => s.etiquette === 'promesse_rompue' && s.cible === tp.id)).toBe(true);
  });
});

describe('Phase 4 — simulation longue', () => {
  it('10 saisons : déterministe, cohérent, la grille évolue, sauvegarde/reprise transparente', () => {
    const a = sc.creerMonde(8);
    sc.creerMoteur().avancer(a, 10 * S);
    expect(verifierCoherence(a, { ages: false })).toEqual([]);
    const b = sc.creerMonde(8);
    const mb = sc.creerMoteur();
    mb.avancer(b, 6 * S);
    const r = deserialiser(serialiser(b));
    mb.avancer(r, 4 * S);
    expect(empreinte(r)).toBe(empreinte(a));
    const titulaires = Object.values(a.tables['personnes']!).filter((x) => x['poste'] === 'pilote_titulaire' && x['statut'] === 'actif').map((x) => x.id);
    expect(titulaires).toHaveLength(22);
    expect(titulaires.filter((id) => /^per_\d/.test(id)).length).toBeGreaterThan(0); // au moins un pilote généré est arrivé en F1
  }, 120_000); // simulation longue : délai large pour les machines d'intégration (référence locale ≈ 13 s, voir le rapport de performances)

  it('30 saisons : mémoire bornée et sauvegarde raisonnable', () => {
    const m = sc.creerMonde(9);
    sc.creerMoteur().avancer(m, 30 * S);
    const parPersonne = new Map<string, number>();
    for (const s of Object.values(m.tables['souvenirs'] ?? {})) parPersonne.set(String(s['porteur']), (parPersonne.get(String(s['porteur'])) ?? 0) + 1);
    expect(Math.max(0, ...parPersonne.values())).toBeLessThanOrEqual(40);
    expect(serialiser(m).length).toBeLessThan(12_000_000);
    expect(verifierCoherence(m, { ages: false })).toEqual([]);
  }, 240_000); // 30 saisons : référence locale ≈ 27 s
});

describe('Migration v3 → v4', () => {
  it('contrats génériques, écuries typées et nouveaux traits', () => {
    const m = sc.creerMonde(1);
    const brut = JSON.parse(serialiser(m));
    brut.entete.versionFormat = 3; brut.monde.versionFormat = 3;
    for (const c of Object.values(brut.monde.tables.contrats) as Record<string, unknown>[]) { c['ecurie'] = c['organisation']; delete c['organisation']; delete c['type']; c['clauses'] = 'pilote n°1 / note'; }
    for (const e of Object.values(brut.monde.tables.ecuries) as Record<string, unknown>[]) delete e['typeOrganisation'];
    for (const x of Object.values(brut.monde.tables.personnes) as { traits: Record<string, number> }[]) { delete x.traits['risque']; delete x.traits['remiseEnQuestion']; }
    const migre = deserialiser(JSON.stringify(brut));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    const c = Object.values(migre.tables['contrats']!)[0]!;
    expect(c['organisation']).toBeDefined();
    expect(c['type']).toBe('emploi');
    expect(c['clauses']).toEqual({ statutN1: true, note: 'note' });
    expect((Object.values(migre.tables['personnes']!)[0] as unknown as Personne).traits['risque']).toBeGreaterThanOrEqual(1);
  });
});
