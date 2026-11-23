/** Phase 7b — marché du personnel technique et dirigeant. */
import { describe, expect, it } from 'vitest';
import {
  capaciteDeveloppement, contratEmploi, creerScenarioGrille2026, deserialiser, evaluerOffre, financesDe, lassitude, offresMarche, serialiser, table, TABLES,
  teamPrincipal, verifierCoherence, VERSION_FORMAT, type Contrat, type Ecurie, type Finances, type Monde, type Personne,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const contrats = (m: Monde) => Object.values(table(m, TABLES.contrats)) as unknown as Contrat[];
const ecurie = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;

describe('Phase 7b — personnel technique', () => {
  it('sur 5 saisons : le personnel se recrute sur le marché, effectifs et cohérence respectés', () => {
    const m = sc.creerMonde(2);
    sc.creerMoteur().avancer(m, 5 * 52);
    const signatures = Object.values(m.evenements).filter((e) => e.type === 'marche.signature');
    const postes = new Set(signatures.map((e) => (table(m, TABLES.contrats)[String(e.contexte['contrat'])] as unknown as Contrat | undefined)?.poste));
    expect([...postes].some((p) => p && p !== 'pilote_titulaire')).toBe(true);
    expect(verifierCoherence(m, { ages: false })).toEqual([]);
  }, 120_000);

  it('remplacement d’un responsable : la recrue arrive, la personne remplacée est libérée avec indemnité', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    ecurie(m, 'eq_williams').pilotee = true;
    (financesDe(m, 'eq_williams') as Finances).tresorerieMEUR = 500;
    moteur.avancer(m, 25);
    const tp = teamPrincipal(m, 'eq_williams')!;
    const enPlace = personnes(m).find((p) => p.statut === 'actif' && p.ecurie === 'eq_williams' && p.poste === 'responsable_aero')!;
    const libres = personnes(m).filter((p) => p.statut === 'libre' && (p.poste === 'responsable_aero' || p.poste === 'ingenieur')).sort((a, b) => (a.id < b.id ? -1 : 1));
    let signee: Personne | undefined;
    for (const p of libres) {
      const r = moteur.commandes.executer(m, { type: 'marche.offre', auteur: tp.id, source: 'exterieur', parametres: { ecurie: 'eq_williams', personne: p.id, poste: 'responsable_aero', salaire: 6, duree: 2, debut: 2028, remplace: enPlace.id } });
      if (!r.ok) continue;
      const o = offresMarche(m).find((x) => x.personne === p.id)!;
      for (let i = 0; i < 6 && o.statut === 'en_attente'; i++) moteur.avancer(m, 1);
      if (o.statut === 'acceptee') { signee = p; break; }
    }
    expect(signee).toBeDefined();
    const fi = financesDe(m, 'eq_williams') as Finances;
    const indemnitesAvant = fi.comptes.indemnites;
    const ancien = contratEmploi(m, enPlace.id)!;
    moteur.avancer(m, 52 - m.date.semaine + 2);
    expect(signee!.ecurie).toBe('eq_williams');
    expect(signee!.poste).toBe('responsable_aero');
    expect(ancien.motifFin).toBe('licenciement');
    expect(ancien.indemniteVerseeMEUR).toBeGreaterThan(0);
    expect(fi.comptes.indemnites).toBeGreaterThan(indemnitesAvant - 1e-9);
    // (Pas de contrôle de cohérence complet ici : l'écurie du joueur n'est pas complétée automatiquement par l'IA.)
  }, 60_000);

  it('non-concurrence (D-127) : une personne débauchée travaille à efficacité réduite pendant 6 mois', () => {
    const m = sc.creerMonde(1);
    const e = ecurie(m, 'eq_ferrari');
    const dt = personnes(m).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'directeur_technique')!;
    const normale = capaciteDeveloppement(m, e);
    dt.nonConcurrenceJusqua = { annee: m.date.annee, semaine: 26 };
    const pendant = capaciteDeveloppement(m, e);
    expect(pendant).toBeLessThan(normale);
    expect(pendant).toBeGreaterThan(0);
    m.date = { annee: m.date.annee, semaine: 27 };
    expect(capaciteDeveloppement(m, e)).toBe(normale);
  });

  it('candidatures spontanées : commande de la personne elle-même, poste égal ou supérieur, nombre borné', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    const resp = personnes(m).find((p) => p.statut === 'actif' && p.poste === 'responsable_aero')!;
    const autres = (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).filter((e) => e.id !== resp.ecurie && e.statut === 'active');
    const cand = (auteur: string, ecurieId: string, poste: string) => moteur.commandes.executer(m, { type: 'marche.candidature', auteur, source: 'ia', parametres: { ecurie: ecurieId, poste } }).ok;
    expect(cand(resp.id, resp.ecurie, 'responsable_aero')).toBe(false); // sa propre écurie
    expect(cand(resp.id, autres[0]!.id, 'directeur_financier')).toBe(false); // profil inadapté
    expect(cand(resp.id, autres[0]!.id, 'responsable_aero')).toBe(true);
    expect(cand(resp.id, autres[1]!.id, 'directeur_technique')).toBe(true);
    expect(cand(resp.id, autres[2]!.id, 'responsable_aero')).toBe(false); // deux par saison au plus
  });

  it('lassitude du personnel et attrait d’un poste plus important', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 6 * 52);
    const anciens = personnes(m).filter((p) => p.statut === 'actif' && ['directeur_technique', 'responsable_aero', 'responsable_conception'].includes(p.poste));
    expect(anciens.some((p) => lassitude(m, p).niveau > 0)).toBe(true);
    const resp = anciens.find((p) => p.poste === 'responsable_aero')!;
    const autre = (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).find((e) => e.id !== resp.ecurie && e.statut === 'active')!;
    const ev = evaluerOffre(m, resp, { organisation: autre.id, decideur: teamPrincipal(m, autre.id)!.id, poste: 'directeur_technique', salaireMEUR: 5, dureeAnnees: 2, promesses: [], prolongation: false });
    expect(ev.raisons.some((r) => r.libelle === 'poste plus important' && r.contribution > 0)).toBe(true);
  }, 60_000);

  it('une sauvegarde au format 15 est migrée (table des candidatures créée)', () => {
    const m = sc.creerMonde(1);
    delete (m.tables as Record<string, unknown>)['candidatures'];
    const migre = deserialiser(serialiser(m).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":15'));
    expect(migre.tables['candidatures']).toEqual({});
    void contrats;
  });
});

describe('Phase 7b — remplacement par calcul coût/bénéfice', () => {
  it('une indemnité plus lourde et une non-concurrence rendent le remplacement moins intéressant', async () => {
    const { bilanRemplacement } = await import('../src/engine');
    const m = sc.creerMonde(1);
    const e = ecurie(m, 'eq_haas');
    const tp = teamPrincipal(m, e.id)!;
    const enPlace = personnes(m).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'responsable_aero')!;
    const candidat = personnes(m).find((p) => p.id !== enPlace.id && (p.poste === 'responsable_aero' || p.poste === 'ingenieur'))!;
    const base = { p: candidat, d: { indemniteMEUR: 0, debauchage: false }, salaire: 2, duree: 2, score: 0.8 };
    const simple = bilanRemplacement(m, e, tp, enPlace, base);
    const debauche = bilanRemplacement(m, e, tp, enPlace, { ...base, d: { indemniteMEUR: 5, debauchage: true } });
    expect(debauche.couts).toBeGreaterThan(simple.couts); // non-concurrence de 6 mois
    contratEmploi(m, enPlace.id)!.clauses.indemniteRuptureMEUR = 40;
    expect(bilanRemplacement(m, e, tp, enPlace, base).couts).toBeGreaterThan(simple.couts); // indemnité de licenciement plus lourde
  });
});
