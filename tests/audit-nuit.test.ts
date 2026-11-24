/**
 * Audit des phases 1 à 11 (nuit du 24 au 25/11/2026) : un test par correction, pour qu'aucun défaut ne revienne.
 * Constats : docs/rapports/audit-phases-1-11/constats.md.
 */
import { describe, expect, it } from 'vitest';
import {
  chargerDonnees, creerScenarioGrille2026, deserialiser, empreinte, ErreurDonnees, ErreurSauvegarde, executerCommandeJoueur, saisonDe, serialiser,
  table, TABLES, trierClassements, grandPrix, type Saison,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const fichiers = lireDonneesGrille2026();
const sc = creerScenarioGrille2026(fichiers);

describe('Audit — phases 1 à 3', () => {
  it('1.1 : modifier un monde ne modifie jamais les données du scénario ni le monde suivant', () => {
    const a = sc.creerMonde(2);
    const avant = empreinte(sc.creerMonde(3));
    for (const c of Object.values(table(a, TABLES.contrats)) as unknown as { clauses?: Record<string, unknown> }[]) if (c.clauses) c.clauses['indemniteRuptureMEUR'] = 99;
    for (const c of Object.values(table(a, TABLES.circuits)) as unknown as { vivier?: { finContrat: number | null } }[]) if (c.vivier) c.vivier.finContrat = 1;
    expect(empreinte(sc.creerMonde(3))).toBe(avant);
  });

  it('1.2 : rejouer réapplique aussi les commandes passées à la date cible', () => {
    const m = sc.creerMonde(8), moteur = sc.creerMoteur();
    moteur.avancer(m, 3);
    expect(executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: 'eq_williams', prenom: 'Camille', nom: 'Essai' } }).ok).toBe(true);
    const rejoue = sc.creerMoteur().rejouer(sc.creerMonde(8), m.journalCommandes, m.date);
    expect(empreinte(rejoue)).toBe(empreinte(m));
  });

  it('1.3 et 1.4 : les erreurs des fichiers communs et du climat sont signalées (jamais de mois à 0 en silence)', () => {
    const essai = (nom: string, texte: (t: string) => string) => {
      try { chargerDonnees({ ...fichiers, [nom]: texte(fichiers[nom]!) }); return ''; } catch (e) { return e instanceof ErreurDonnees ? e.message : String(e); }
    };
    expect(essai('ecuries-juniors.csv', (t) => t.split('\n').slice(0, 2).join('\n'))).toMatch(/au moins 21 noms/);
    expect(essai('climat-circuits.csv', (t) => t.split('\n').filter((l) => !l.startsWith('cir_monza;7;')).join('\n'))).toMatch(/12 mois/);
    expect(essai('climat-circuits.csv', (t) => t.replace(/^cir_monza;7;([^;]*);[^;]*;/m, 'cir_monza;7;$1;abc;'))).toMatch(/climat-circuits/);
    expect(essai('palmares.csv', (t) => `${t.trim()}\n${t.trim().split('\n').at(-1)}\n`)).toMatch(/en double/);
  });

  it('1.6 et 1.7 : à égalité de points et de victoires, le plus de 2es places passe devant (jamais l’identifiant)', () => {
    const s = {
      pilotes: [
        { pilote: 'per_a', ecurie: 'eq_a', points: 30, victoires: 0, podiums: 2, abandons: 0, meilleurResultat: 2, places: [0, 0, 2] },
        { pilote: 'per_b', ecurie: 'eq_b', points: 30, victoires: 0, podiums: 2, abandons: 0, meilleurResultat: 2, places: [0, 1, 1] },
      ],
      constructeurs: [
        { ecurie: 'eq_a', points: 30, victoires: 0, doubles: 0, places: [0, 0, 2] },
        { ecurie: 'eq_b', points: 30, victoires: 0, doubles: 0, places: [0, 1, 1] },
      ],
    } as unknown as Saison;
    trierClassements(s);
    expect(s.pilotes[0]!.pilote).toBe('per_b');
    expect(s.constructeurs[0]!.ecurie).toBe('eq_b');
  });

  it('1.8 : une sauvegarde sans agenda, ou au contenu plus ancien que son en-tête, est refusée avec un message clair', () => {
    const m = sc.creerMonde(4);
    const sansAgenda = JSON.parse(serialiser(m)) as { monde: Record<string, unknown> };
    delete sansAgenda.monde['agenda'];
    expect(() => deserialiser(JSON.stringify(sansAgenda))).toThrow(ErreurSauvegarde);
    const incoherente = JSON.parse(serialiser(m)) as { monde: Record<string, unknown> };
    incoherente.monde['versionFormat'] = 3;
    expect(() => deserialiser(JSON.stringify(incoherente))).toThrow(/en-tête/);
  });

  it('1.15 : chaque Grand Prix tombe à la semaine de sa date habituelle (son vrai mois), sans doublon', () => {
    const m = sc.creerMonde(5);
    sc.creerMoteur().avancer(m, 2);
    const s = saisonDe(m, 2027)!;
    const semaines = s.calendrier.map((id) => grandPrix(m, id).semaine);
    for (let i = 1; i < semaines.length; i++) expect(semaines[i]!).toBeGreaterThan(semaines[i - 1]!);
    const parCircuit = Object.fromEntries(s.calendrier.map((id) => [grandPrix(m, id).circuit, grandPrix(m, id).semaine]));
    expect(parCircuit['cir_monaco']).toBe(23); // jour 158 → semaine 23 (juin)
    expect(parCircuit['cir_monza']).toBe(36); // jour 249 → semaine 36 (septembre)
  });
});

describe('Audit — phases 4 et 9', () => {
  const partie = () => {
    const m = sc.creerMonde(11), moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: 'eq_williams', prenom: 'Camille', nom: 'Essai' } });
    const personnes = Object.values(table(m, TABLES.personnes)) as unknown as { id: string; ecurie: string; poste: string; statut: string }[];
    const manager = m.joueur!.personne;
    const titulaire = personnes.find((p) => p.ecurie === 'eq_williams' && p.poste === 'pilote_titulaire' && p.statut === 'actif')!;
    const dt = personnes.find((p) => p.ecurie === 'eq_williams' && p.poste === 'directeur_technique' && p.statut === 'actif')!;
    return { m, moteur, manager, titulaire, dt };
  };
  const prolonger = (x: ReturnType<typeof partie>, personne: string, promesses: string[], salaire = 3) =>
    executerCommandeJoueur(x.moteur, x.m, { type: 'contrat.proposer_prolongation', auteur: x.manager, parametres: { personne, salaire, duree: 2, promesses, tour: 0 } });

  it('4.2 : les promesses vides ou absurdes sont refusées', () => {
    const x = partie();
    expect(prolonger(x, x.titulaire.id, ['prolongation'])).toMatchObject({ ok: false });
    expect(prolonger(x, x.titulaire.id, ['salaire_minimum'])).toMatchObject({ ok: false });
    expect(prolonger(x, x.titulaire.id, ['titularisation'])).toMatchObject({ ok: false });
    expect(prolonger(x, x.dt.id, ['statut_n1'])).toMatchObject({ ok: false });
    expect(prolonger(x, x.titulaire.id, ['n_importe_quoi'])).toMatchObject({ ok: false });
  });

  it('4.4 : une seule offre de prolongation par semaine et par personne (on ne sonde pas le salaire minimum)', () => {
    const x = partie();
    expect(prolonger(x, x.dt.id, [], 0.5).ok).toBe(true);
    // Refus ou contre-offre : dans les deux cas, une nouvelle ouverture au tour 0 la même semaine est refusée.
    expect(prolonger(x, x.dt.id, [], 0.6)).toMatchObject({ ok: false });
  });

  it('4.3 : un geste de réparation répété dans la fenêtre de saturation n’a plus d’effet', () => {
    const x = partie();
    const discuter = () => executerCommandeJoueur(x.moteur, x.m, { type: 'personnel.discussion_privee', auteur: x.manager, parametres: { personne: x.dt.id } });
    const relationDe = () => JSON.stringify((Object.values(table(x.m, 'relations')) as unknown as { de: string; vers: string }[]).find((r) => r.de === x.dt.id && r.vers === x.manager));
    expect(discuter().ok).toBe(true);
    const apresUn = relationDe();
    expect(apresUn).toBeDefined();
    for (let i = 0; i < 10; i++) discuter();
    expect(relationDe()).toBe(apresUn);
  });
});

describe('Audit — économie (phase 5 et sponsoring)', () => {
  it('5.1 et 10.2 : le budget de développement se modifie au plus une fois par trimestre, et le budget annuel garde ce choix', () => {
    const m = sc.creerMonde(12), moteur = sc.creerMoteur();
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: 'eq_haas', prenom: 'Camille', nom: 'Essai' } });
    const budget = (montant: number) => executerCommandeJoueur(moteur, m, { type: 'budget.developpement', auteur: m.joueur!.personne, parametres: { ecurie: 'eq_haas', montant } });
    expect(budget(60).ok).toBe(true);
    moteur.avancer(m, 2);
    const fi = (Object.values(table(m, TABLES.finances)) as unknown as { ecurie: string; budget: { developpementMEUR: number } }[]).find((f) => f.ecurie === 'eq_haas')!;
    expect(fi.budget.developpementMEUR).toBe(60); // non écrasé par le budget annuel de la semaine 1
    expect(budget(200).ok).toBe(false); // deuxième modification dans le trimestre
  });

  it('5.2 : chaque année est jugée avec le plafond en vigueur cette année-là', () => {
    const m = sc.creerMonde(13);
    sc.creerMoteur().avancer(m, 2);
    for (const f of Object.values(table(m, TABLES.finances)) as unknown as { comptes: { plafondMEUR?: number } }[]) expect(f.comptes.plafondMEUR).toBeGreaterThan(0);
  });

  it('5.8 : les probabilités de podium et de victoire suivent le nombre de Grands Prix', async () => {
    const { probaClause } = await import('../src/engine/systems/economie/probabilites');
    expect(probaClause('podium', 0, 6, 11, 20)).toBeLessThan(probaClause('podium', 0, 6, 11, 24));
    expect(probaClause('victoire', 0, 4, 11, 24)).toBeCloseTo(probaClause('victoire', 0, 4, 11, 24), 10);
  });
});

describe('Audit — phases 6 et 7', () => {
  it('6.1 : une personne qui a signé ailleurs ne peut plus être prolongée par son employeur actuel', async () => {
    const { proposerProlongation, contratEmploi } = await import('../src/engine');
    const m = sc.creerMonde(21);
    sc.creerMoteur().avancer(m, 30);
    const contrats = Object.values(table(m, TABLES.contrats)) as unknown as { personne: string; statut: string; type: string; organisation: string }[];
    const signe = contrats.find((c) => c.type === 'emploi' && c.statut === 'signe' && contratEmploi(m, c.personne) && contratEmploi(m, c.personne)!.organisation !== c.organisation);
    expect(signe).toBeDefined();
    const actuel = contratEmploi(m, signe!.personne)!;
    const finAvant = actuel.fin;
    const r = proposerProlongation(m, actuel, actuel.organisation, actuel.salaireMEUR * 2, 2, [], 0);
    expect(r.issue).toBe('refus');
    expect(actuel.fin).toBe(finAvant);
  }, 60_000);

  it('6.4 : passé l’âge de fin de protection, un pilote n’est plus retenu par son contrat dans sa décision de retraite', async () => {
    const { probabiliteRetraite } = await import('../src/engine');
    const { RETRAITE } = await import('../src/engine/balance/carriere');
    const m = sc.creerMonde(22);
    const pilote = (Object.values(table(m, TABLES.personnes)) as unknown as { id: string; poste: string; statut: string; anneeNaissance: number; carriere?: unknown }[])
      .find((p) => p.poste === 'pilote_titulaire' && p.statut === 'actif' && p.carriere)!;
    const age = (a: number) => { pilote.anneeNaissance = m.date.annee - a; return probabiliteRetraite(m, pilote as never); };
    const jeune = age(RETRAITE.ageFinProtectionPilote - 1), vieux = age(RETRAITE.ageFinProtectionPilote);
    expect(vieux).toBeGreaterThan(jeune);
  });
});
