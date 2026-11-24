/** Phase 11c — refonte du sponsoring (docs/systemes/phase-11c-sponsoring.md, D-155). */
import { describe, expect, it } from 'vitest';
import {
  bilanSaison, choisirVarianteEquipe, conclure, construireVariantes, contratsActifs, creerScenarioGrille2026, decisionsEnAttente, deserialiser, evaluerSponsors,
  executerCommandeJoueur, financesDe, objectifsGP, offresSponsors, operationsSponsors, probaClause, proposerOperation, rangAttenduPublic, serialiser, signerSponsor,
  sponsorsEngages, table, TABLES, teamPrincipal, variantesPour, VERSION_FORMAT, ecuriesActives,
  type ContratSponsoring, type Ecurie, type GrandPrix, type Monde, type OffreSponsor, type Personne, type Saison, type Sponsor,
} from '../src/engine';
import { PRIME_MAX_MULTIPLE_VALEUR } from '../src/engine/balance/sponsoring';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const ecurie = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;
/** Des entreprises fictives libres de tout engagement (le vivier est presque entièrement sous contrat en début de saison). */
let compteur = 0;
const sponsorsLibres = (m: Monde, n = 3) => {
  if (!Object.keys(table(m, TABLES.sponsors)).length) sc.creerMoteur().avancer(m, 1);
  const eng = sponsorsEngages(m, m.date.annee);
  const modele = (Object.values(table(m, TABLES.sponsors)) as unknown as Sponsor[]).find((s) => s.actif && !s.lie)!;
  const res: Sponsor[] = [];
  for (let i = 0; i < n; i++) {
    const s: Sponsor = { ...modele, id: `spo_test_${++compteur}`, nom: `Essai ${compteur}`, secteur: `essai${compteur}`, budgetMEUR: 60 - i * 5, rancunes: [], image: 'resultats' };
    table(m, TABLES.sponsors)[s.id] = s as never;
    expect(eng.has(s.id)).toBe(false);
    res.push(s);
  }
  return res;
};
const titulaires = (m: Monde, e: string) => (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === e && p.poste.startsWith('pilote_titulaire'));
const base = { montantMEUR: 10, partPrime: 0.2, objectifRang: 10, ecuries: 11, grandsPrix: 24, image: 'resultats', budgetF1MEUR: 60, titre: false };
const valeurPrudente = (v: ReturnType<typeof construireVariantes>) => v.find((x) => x.variante === 'prudente')!.valeurAttendueMEUR;

describe('Phase 11c — variantes : même valeur attendue, engagement ferme', () => {
  it('la prudente est le contrat d’avant la refonte ; les autres ne rapportent pas plus en moyenne (pas d’argent gratuit)', () => {
    for (const r of [1, 3, 5.5, 8, 10.7]) {
      const v = construireVariantes({ ...base, rangAttendu: r, objectifRang: Math.min(11, Math.round(r) + 2), rangDernier: Math.round(r) });
      const p = v[0]!;
      expect(p.variante).toBe('prudente');
      expect(p.fixeMEUR).toBe(10);
      expect(p.clauses).toEqual([expect.objectContaining({ type: 'rang', seuil: Math.min(11, Math.round(r) + 2), primeMEUR: 2 })]);
      const E = valeurPrudente(v);
      for (const x of v) {
        expect(x.valeurAttendueMEUR, `${r} ${x.variante}`).toBeLessThanOrEqual(E + 0.1);
        expect(x.valeurAttendueMEUR).toBeGreaterThanOrEqual(E * 0.9 - 0.1);
        expect(x.maximumMEUR).toBeLessThanOrEqual(base.budgetF1MEUR + 0.1);
        for (const c of x.clauses) if (x.variante !== 'prudente') expect(c.primeMEUR).toBeLessThanOrEqual(PRIME_MAX_MULTIPLE_VALEUR * E + 0.1);
      }
    }
  });

  it('petite écurie : un pari audacieux réussi rapporte beaucoup plus que le contrat prudent (D-155 question 2)', () => {
    const v = construireVariantes({ ...base, rangAttendu: 10.5, objectifRang: 11, rangDernier: 11 });
    const aud = v.find((x) => x.variante === 'audacieuse')!;
    expect(aud).toBeDefined();
    expect(aud.maximumMEUR).toBeGreaterThan(2.5 * valeurPrudente(v));
    expect(aud.clauses[0]!.probabilite).toBeLessThan(0.35);
  });

  it('sponsor trop petit pour une grosse prime : clause moins difficile ou pas de variante audacieuse (scénario 6)', () => {
    const riche = construireVariantes({ ...base, rangAttendu: 10, budgetF1MEUR: 200 });
    const pauvre = construireVariantes({ ...base, rangAttendu: 10, budgetF1MEUR: 16 });
    const pR = riche.find((x) => x.variante === 'audacieuse')!.clauses[0]!.probabilite;
    const aP = pauvre.find((x) => x.variante === 'audacieuse');
    if (aP) expect(aP.clauses[0]!.probabilite).toBeGreaterThan(pR);
    for (const x of pauvre) expect(x.maximumMEUR).toBeLessThanOrEqual(16.05);
  });

  it('probabilités vues par le sponsor : monotones (une écurie attendue plus haut a plus de chances)', () => {
    for (const t of ['podium', 'victoire'] as const) expect(probaClause(t, 1, 3, 11, 24)).toBeGreaterThan(probaClause(t, 1, 8, 11, 24));
    expect(probaClause('rang', 5, 4, 11, 24)).toBeGreaterThan(probaClause('rang', 5, 7, 11, 24));
    expect(probaClause('arrivees_points', 12, 5, 11, 24)).toBeGreaterThan(probaClause('arrivees_points', 12, 9, 11, 24));
  });

  it('choix de l’équipe : sans raison de se croire sous-estimée, un team principal neutre reste prudent (pas de stratégie universelle)', () => {
    const m = sc.creerMonde(5);
    const e = ecuriesActives(m).find((x) => x.id === 'eq_haas')!;
    const tp = teamPrincipal(m, e.id)!;
    const s = sponsorsLibres(m)[0]!;
    const v = variantesPour(m, s, e, 'principal', 12, m.date.annee);
    tp.traits['risque'] = 10;
    expect(choisirVarianteEquipe(m, e, v).variante).toBe('prudente'); // au départ, rang attendu = rang de la voiture
    tp.traits['risque'] = 20;
    expect(choisirVarianteEquipe(m, e, v).variante).not.toBe('prudente');
  });
});

/** Un monde à la fin de la saison 2027 (classement établi, bilan pas encore fait). */
function finDeSaison(graine: number): { m: Monde; moteur: ReturnType<typeof sc.creerMoteur> } {
  const m = sc.creerMonde(graine);
  const moteur = sc.creerMoteur();
  moteur.avancer(m, 51);
  return { m, moteur };
}
const dernier = (m: Monde, annee: number) => (table(m, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison).constructeurs.at(-1)!.ecurie;

describe('Phase 11c — bilan annuel des clauses', () => {
  it('podium inattendu : la clause audacieuse paie ; une clause audacieuse ratée déçoit moins qu’une prudente ratée', () => {
    const { m } = finDeSaison(6);
    const id = dernier(m, 2027);
    const e = ecurie(m, id);
    const [s1, s2, s3] = sponsorsLibres(m);
    const prud = signerSponsor(m, s1!, e, 'principal', 10, 2027, false, { variante: 'prudente', fixeMEUR: 10, clauses: [{ type: 'rang', seuil: 5, primeMEUR: 2, probabilite: 0.75 }], valeurAttendueMEUR: 11.5, maximumMEUR: 12 });
    const aud = signerSponsor(m, s2!, e, 'principal', 10, 2027, false, { variante: 'audacieuse', fixeMEUR: 5, clauses: [{ type: 'rang', seuil: 5, primeMEUR: 40, probabilite: 0.1 }], valeurAttendueMEUR: 9, maximumMEUR: 45 });
    const pod = signerSponsor(m, s3!, e, 'principal', 10, 2027, false, { variante: 'audacieuse', fixeMEUR: 5, clauses: [{ type: 'podium', seuil: 1, primeMEUR: 30, probabilite: 0.1 }], valeurAttendueMEUR: 8, maximumMEUR: 35 });
    for (const c of [prud, aud, pod]) c.fin = 2029; // pas de fin de contrat ce bilan
    // Un podium inattendu : le meilleur pilote de l'écurie finit 2e d'un Grand Prix.
    const gp = table(m, TABLES.grandsPrix)[(table(m, TABLES.saisons)['ssn_2027'] as unknown as Saison).calendrier[3]!] as unknown as GrandPrix;
    gp.resultats.find((r) => r.ecurie === id)!.position = 2;
    expect(bilanSaison(m, 2027, id).podiums).toBeGreaterThanOrEqual(1);
    const fi = financesDe(m, id)!;
    const avant = fi.comptes.sponsors;
    evaluerSponsors(m, 2027, (x) => financesDe(m, x));
    expect(pod.clauses[0]!.atteinte).toBe(true);
    expect(pod.primesVerseesMEUR).toBe(30);
    expect(prud.clauses[0]!.atteinte).toBe(false);
    expect(aud.clauses[0]!.atteinte).toBe(false);
    expect(fi.comptes.sponsors - avant).toBeGreaterThanOrEqual(30); // les autres contrats de l'écurie versent aussi leurs primes
    expect(aud.satisfaction).toBeGreaterThan(prud.satisfaction);
    expect(pod.satisfaction).toBeGreaterThan(60);
  });

  it('une sauvegarde au format 27 est migrée : les contrats deviennent prudents, à une clause, celle d’avant', () => {
    const m = sc.creerMonde(7);
    sc.creerMoteur().avancer(m, 1);
    const brut = JSON.parse(serialiser(m));
    brut.entete.versionFormat = 27;
    brut.monde.versionFormat = 27;
    for (const k of ['offresSponsors', 'objectifsGP', 'operationsSponsors']) delete brut.monde.tables[k];
    for (const c of Object.values(brut.monde.tables.contratsSponsoring) as Record<string, unknown>[]) {
      const cl = (c['clauses'] as { seuil: number; primeMEUR: number }[])[0]!;
      c['objectifRang'] = cl.seuil; c['primeObjectifMEUR'] = cl.primeMEUR;
      delete c['clauses']; delete c['variante']; delete c['primesVerseesMEUR'];
    }
    const migre = deserialiser(JSON.stringify(brut));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    const c = Object.values(table(migre, TABLES.contratsSponsoring))[0] as unknown as ContratSponsoring;
    expect(c.variante).toBe('prudente');
    expect(c.clauses).toHaveLength(1);
    expect(c.clauses[0]!.type).toBe('rang');
    expect(table(migre, TABLES.offresSponsors)).toEqual({});
    sc.creerMoteur().avancer(migre, 2);
  });
});

describe('Phase 11c — offres faites au joueur', () => {
  function partie() {
    const m = sc.creerMonde(8);
    const moteur = sc.creerMoteur();
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: 'eq_williams', prenom: 'Camille', nom: 'Sponsor' } });
    const tp = teamPrincipal(m, 'eq_williams')!;
    // Des places principales libres.
    for (const c of contratsActifs(m, m.date.annee, 'eq_williams')) if (c.rang === 'principal') { c.statut = 'termine'; c.fin = m.date.annee - 1; }
    return { m, moteur, tp, e: ecurie(m, 'eq_williams') };
  }

  it('le joueur choisit une variante (même commande, mêmes règles) ; une commande d’un autre que le team principal est refusée', () => {
    const { m, moteur, tp, e } = partie();
    const s = sponsorsLibres(m)[0]!;
    const o = conclure(m, s, e, 'principal', 12, m.date.annee, false) as OffreSponsor;
    expect(o.variantes.length).toBeGreaterThanOrEqual(2);
    expect(decisionsEnAttente(m).some((d) => d.type === 'offre_sponsor' && d.offreSponsor === o.id)).toBe(true);
    expect(executerCommandeJoueur(moteur, m, { type: 'sponsor.signer', auteur: 'quelquun', parametres: { offre: o.id, variante: 'prudente' } }).ok).toBe(false);
    const v = o.variantes.at(-1)!.variante;
    expect(executerCommandeJoueur(moteur, m, { type: 'sponsor.signer', auteur: tp.id, parametres: { offre: o.id, variante: v } }).ok).toBe(true);
    const c = contratsActifs(m, m.date.annee, e.id).find((x) => x.sponsor === s.id)!;
    expect(c.variante).toBe(v);
    expect(offresSponsors(m, e.id).some((x) => x.id === o.id)).toBe(false);
  });

  it('décliner : le sponsor va ailleurs ; sans réponse, l’équipe signe à l’échéance', () => {
    const { m, moteur, tp, e } = partie();
    const [s1, s2] = sponsorsLibres(m);
    for (const k of Object.keys(table(m, TABLES.offresSponsors))) delete table(m, TABLES.offresSponsors)[k]; // offres du marché de la semaine 1 retirées
    const o1 = conclure(m, s1!, e, 'principal', 12, m.date.annee, false) as OffreSponsor;
    const o2 = conclure(m, s2!, e, 'principal', 9, m.date.annee, false) as OffreSponsor;
    expect(executerCommandeJoueur(moteur, m, { type: 'sponsor.signer', auteur: tp.id, parametres: { offre: o1.id, variante: null } }).ok).toBe(true);
    // Le sponsor décliné cherche ailleurs : il signe avec une autre écurie, ou reste libre si aucune n'a de place.
    expect(contratsActifs(m, m.date.annee).some((c) => c.sponsor === s1!.id && c.ecurie === e.id)).toBe(false);
    expect(Object.values(m.evenements).some((ev) => ev.type === 'sponsor.offre_declinee' && ev.contexte?.['offre'] === o1.id)).toBe(true);
    moteur.avancer(m, 4);
    expect(offresSponsors(m, e.id)).toHaveLength(0);
    expect(contratsActifs(m, m.date.annee, e.id).some((c) => c.sponsor === s2!.id)).toBe(true);
    expect(Object.values(m.evenements).some((ev) => ev.type === 'sponsor.offre_signee' && ev.contexte?.['offre'] === o2.id && ev.contexte?.['parQui'] === 'equipe')).toBe(true);
  });
});

describe('Phase 11c — objectifs de course du sponsor titre', () => {
  function avecTitre(strategie: number) {
    const m = sc.creerMonde(9);
    const moteur = sc.creerMoteur();
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: 'eq_haas', prenom: 'Camille', nom: 'Titre' } });
    const e = ecurie(m, 'eq_haas');
    for (const c of contratsActifs(m, m.date.annee, e.id)) if (c.rang === 'titre') { c.statut = 'termine'; c.fin = m.date.annee - 1; }
    const s = sponsorsLibres(m)[0]!;
    const v = variantesPour(m, s, e, 'titre', 32, m.date.annee).find((x) => x.variante === 'prudente')!;
    const c = signerSponsor(m, s, e, 'titre', 32, m.date.annee, false, v);
    const ds = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'directeur_sportif')!;
    ds.competences['strategie'] = strategie;
    moteur.avancer(m, 9); // semaine 10 : objectif du premier Grand Prix prêt
    return { m, moteur, e, c, tp: teamPrincipal(m, e.id)! };
  }

  it('3 objectifs du plus facile au plus difficile, de même valeur attendue pour le sponsor (l’audacieux décoté)', () => {
    const { m, e } = avecTitre(12);
    const o = objectifsGP(m, e.id)[0]!;
    expect(o.options.map((x) => x.niveau)).toEqual(['prudent', 'intermediaire', 'audacieux']);
    expect(o.options[0]!.seuil).toBeGreaterThan(o.options[2]!.seuil);
    for (const x of o.options) {
      const attendu = x.niveau === 'audacieux' ? o.partMEUR * 0.9 : o.partMEUR;
      expect(x.primeMEUR * x.probabilite).toBeGreaterThan(attendu - 0.06);
      expect(x.primeMEUR * x.probabilite).toBeLessThan(attendu + 0.06);
    }
  });

  it('la fourchette du directeur sportif est plus étroite s’il est bon stratège', () => {
    const largeur = (strategie: number) => { const { m, e } = avecTitre(strategie); return objectifsGP(m, e.id)[0]!.options.reduce((a, x) => a + x.estimation[1] - x.estimation[0], 0); };
    expect(largeur(20)).toBeLessThan(largeur(1));
  });

  it('jugement sur le résultat réellement simulé ; sans choix, le directeur commercial choisit (sans arrêt)', () => {
    const { m, moteur, e, c, tp } = avecTitre(12);
    const o = objectifsGP(m, e.id)[0]!;
    expect(executerCommandeJoueur(moteur, m, { type: 'sponsor.objectif_gp', auteur: tp.id, parametres: { objectif: o.id, choix: 'audacieux' } }).ok).toBe(true);
    const avant = c.primesVerseesMEUR;
    moteur.avancer(m, 2); // premier Grand Prix (semaine 11)
    const gp = table(m, TABLES.grandsPrix)[o.gp] as unknown as GrandPrix;
    expect(gp.termine).toBe(true);
    const best = Math.min(...gp.resultats.filter((r) => r.ecurie === e.id && r.position !== null).map((r) => r.position!));
    const opt = o.options.find((x) => x.niveau === 'audacieux')!;
    expect(c.primesVerseesMEUR - avant).toBeCloseTo(best <= opt.seuil ? opt.primeMEUR : 0, 5);
    const ev = Object.values(m.evenements).find((x) => x.type === 'sponsor.objectif_course' && x.contexte?.['gp'] === o.gp)!;
    expect(ev.contexte?.['choisiPar']).toBe('joueur');
    // Grand Prix suivant sans choix : l'équipe choisit, et la simulation ne s'arrête pas pour autant.
    expect(decisionsEnAttente(m).some((d) => d.type === 'offre_sponsor' || d.type === 'operation_sponsor')).toBe(false);
    moteur.avancer(m, 3);
    expect(Object.values(m.evenements).some((x) => x.type === 'sponsor.objectif_course' && x.contexte?.['choisiPar'] === 'equipe')).toBe(true);
  });
});

describe('Phase 11c — opérations exceptionnelles', () => {
  /** Saison 2027 jouée ; le joueur prend la plus petite écurie (rang attendu le plus bas) en 2028, après le premier Grand Prix. */
  function apresUneSaison() {
    const m = sc.creerMonde(10);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 52 + 22);
    const tri = ecuriesActives(m).sort((a, b) => rangAttenduPublic(m, b.id) - rangAttenduPublic(m, a.id));
    const petite = tri[0]!, autrePetite = tri[1]!, grande = tri.at(-1)!;
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: petite.id, prenom: 'Camille', nom: 'Exploit' } });
    for (const e of [petite, autrePetite, grande]) {
      if (!contratsActifs(m, 2028, e.id).some((c) => c.rang === 'principal')) {
        const s = sponsorsLibres(m)[0]!;
        signerSponsor(m, s, e, 'principal', 10, 2028, false);
      }
    }
    const saison = table(m, TABLES.saisons)['ssn_2028'] as unknown as Saison;
    const gps = saison.calendrier.map((id) => table(m, TABLES.grandsPrix)[id] as unknown as GrandPrix).filter((g) => g.termine);
    return { m, moteur, petite, autrePetite, grande, gps, tp: teamPrincipal(m, petite.id)! };
  }
  const podium = (gp: GrandPrix, id: string, pos: number) => { gp.resultats.find((r) => r.ecurie === id)!.position = pos; };

  it('podium d’une petite écurie : opération proposée, pilote affiché, acceptée → argent, sollicitation datée, exposition ; une seule par saison', () => {
    const { m, moteur, petite, gps, tp } = apresUneSaison();
    expect(rangAttenduPublic(m, petite.id)).toBeGreaterThanOrEqual(7);
    podium(gps[0]!, petite.id, 3);
    proposerOperation(m, petite, gps[0]!);
    const op = operationsSponsors(m, petite.id).find((o) => o.statut === 'proposee')!;
    expect(op).toBeDefined();
    expect(decisionsEnAttente(m).some((d) => d.type === 'operation_sponsor')).toBe(true);
    const pilote = op.pilote ?? op.auteur;
    const p = table(m, TABLES.personnes)[pilote] as unknown as Personne;
    const expo = p.exposition ?? 0;
    const fi = financesDe(m, petite.id)!;
    const avant = fi.tresorerieMEUR;
    expect(executerCommandeJoueur(moteur, m, { type: 'sponsor.operation', auteur: tp.id, parametres: { operation: op.id, format: 'campagne', pilote } }).ok).toBe(true);
    const campagne = op.formats.find((f) => f.format === 'campagne')!.montantMEUR;
    expect(fi.tresorerieMEUR - avant).toBeCloseTo(campagne, 5);
    expect(campagne).toBeGreaterThan(op.formats.find((f) => f.format === 'tenues')!.montantMEUR);
    expect((p.exposition ?? 0)).toBeGreaterThan(expo);
    const ev = Object.values(m.evenements).find((x) => x.type === 'sponsor.operation' && x.contexte?.['operation'] === op.id)!;
    expect(ev.contexte?.['sollicitation']).toBe('lourde');
    expect((table(m, TABLES.contratsSponsoring)[op.contrat] as unknown as ContratSponsoring).operationFaite).toBe(true);
    // Rareté : un second exploit la même saison ne donne rien.
    podium(gps[1]!, petite.id, 2);
    proposerOperation(m, petite, gps[1]!);
    expect(operationsSponsors(m, petite.id)).toHaveLength(1);
  });

  it('une écurie de tête qui gagne n’en reçoit jamais ; une petite écurie de l’IA décide tout de suite', () => {
    const { m, grande, autrePetite, gps } = apresUneSaison();
    podium(gps[0]!, grande.id, 1);
    proposerOperation(m, grande, gps[0]!);
    expect(operationsSponsors(m, grande.id)).toHaveLength(0);
    if (rangAttenduPublic(m, autrePetite.id) >= 7) {
      podium(gps[0]!, autrePetite.id, 3);
      proposerOperation(m, autrePetite, gps[0]!);
      const op = operationsSponsors(m, autrePetite.id)[0]!;
      expect(op.statut).toBe('acceptee');
      expect(titulaires(m, autrePetite.id).some((p) => p.id === op.pilote)).toBe(true);
    }
  });

  it('refuser : aucun argent, l’offre est close', () => {
    const { m, moteur, petite, gps, tp } = apresUneSaison();
    podium(gps[0]!, petite.id, 3);
    proposerOperation(m, petite, gps[0]!);
    const op = operationsSponsors(m, petite.id)[0]!;
    const avant = financesDe(m, petite.id)!.tresorerieMEUR;
    expect(executerCommandeJoueur(moteur, m, { type: 'sponsor.operation', auteur: tp.id, parametres: { operation: op.id, format: null } }).ok).toBe(true);
    expect(op.statut).toBe('refusee');
    expect(financesDe(m, petite.id)!.tresorerieMEUR).toBe(avant);
  });
});
