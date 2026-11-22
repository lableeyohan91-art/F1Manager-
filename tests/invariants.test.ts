/**
 * Audit n°3 — invariants entre systèmes (et décisions volontairement extrêmes d'un joueur) :
 * effectifs de chaque saison future, absence de NaN / Infinity, cohérence des promesses, règles communes joueur / IA,
 * délais annoncés et réels.
 */
import { describe, expect, it } from 'vitest';
import {
  avancerProjets, creerScenarioGrille2026, faireUnePromesse, financesDe, occupantsPour, promesseRespectee, proposerProlongation, table, TABLES,
  teamPrincipal, type Contrat, type Ecurie, type Finances, type Monde, type Personne, type Promesse,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const contrats = (m: Monde) => Object.values(table(m, TABLES.contrats)) as unknown as Contrat[];
const ecuries = (m: Monde) => (Object.values(table(m, TABLES.ecuries)) as unknown as Ecurie[]).filter((e) => e.statut === 'active');
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];

/** Toute valeur numérique non finie dans le monde (finances, contrats, personnes…), avec son chemin. */
function valeursNonFinies(x: unknown, chemin = '', res: string[] = []): string[] {
  if (typeof x === 'number' && !Number.isFinite(x)) res.push(chemin);
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) valeursNonFinies(v, `${chemin}.${k}`, res);
  return res;
}

function verifierEffectifs(m: Monde): string[] {
  const erreurs: string[] = [];
  for (const e of ecuries(m)) for (let y = m.date.annee; y <= m.date.annee + 3; y++) {
    const n = occupantsPour(m, e.id, 'pilote_titulaire', y).length;
    if (n > 2) erreurs.push(`${e.id} ${y} : ${n} titulaires`);
  }
  return erreurs;
}

describe('Audit n°3 — invariants entre systèmes', () => {
  it('1. effectifs : une prolongation ne peut pas créer un troisième titulaire (scénario de l’audit)', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    const e = ecuries(m).find((x) => x.id === 'eq_williams')!;
    e.pilotee = true;
    const [a, b] = contrats(m).filter((c) => c.organisation === e.id && c.poste === 'pilote_titulaire' && c.statut === 'actif');
    a!.fin = 2027; // le titulaire sortant
    b!.fin = Math.max(b!.fin, 2028);
    // Une recrue a signé pour 2028 : les deux baquets de 2028 sont attribués.
    const recrue = personnes(m).find((p) => p.poste === 'pilote_junior' && p.statut === 'libre')!;
    table(m, TABLES.contrats)['ctr_test'] = { id: 'ctr_test', personne: recrue.id, organisation: e.id, type: 'emploi', poste: 'pilote_titulaire', debut: 2028, fin: 2029, salaireMEUR: 1, clauses: {}, statut: 'signe', verification: 'test' } as never;
    const tp = teamPrincipal(m, e.id)!;
    const r = moteur.commandes.executer(m, { type: 'contrat.proposer_prolongation', auteur: tp.id, source: 'exterieur', parametres: { personne: a!.personne, salaire: 5, duree: 1 } });
    expect(r.ok).toBe(false);
    // Même garde pour l'IA, qui appelle directement la négociation.
    expect(proposerProlongation(m, a!, tp.id, 5, 1, [], 0).issue).toBe('refus');
    expect(a!.fin).toBe(2027);
    expect(verifierEffectifs(m)).toEqual([]);
  });

  it('2. validation numérique : durées entières, valeurs finies, salaire validé après arrondi, bornes', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    const e = ecuries(m).find((x) => x.id === 'eq_williams')!;
    e.pilotee = true;
    const c = contrats(m).find((x) => x.organisation === e.id && x.poste === 'pilote_titulaire' && x.statut === 'actif')!;
    c.fin = 2027;
    c.nonProlonge = true;
    (financesDe(m, e.id) as Finances).tresorerieMEUR = 500;
    moteur.avancer(m, 25);
    const tp = teamPrincipal(m, e.id)!;
    const cible = personnes(m).find((p) => p.poste === 'pilote_junior' && p.statut === 'libre' && 2028 - p.anneeNaissance >= 18 && !contrats(m).some((x) => x.personne === p.id && x.type === 'affiliation' && x.statut === 'actif'))!;
    const offre = (salaire: unknown, duree: unknown, debut: unknown = 2028) => moteur.commandes.executer(m, { type: 'marche.offre', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e.id, personne: cible.id, salaire, duree, debut } }).ok;
    expect(offre(2, 2.5)).toBe(false); // durée fractionnaire
    expect(offre(0.04, 2)).toBe(false); // positif mais nul après arrondi
    expect(offre(1e9, 2)).toBe(false); // démesuré
    expect(offre('Infinity', 2)).toBe(false);
    expect(offre(Infinity, 2)).toBe(false);
    expect(offre(NaN, 2)).toBe(false);
    expect(offre(2, 2, 2028.5)).toBe(false);
    expect(offre(2, 6)).toBe(false);
    expect(offre(2, 2)).toBe(true);
    // Prolongation : mêmes contrôles.
    const autre = contrats(m).find((x) => x.organisation === e.id && x.poste === 'pilote_titulaire' && x.statut === 'actif' && x.id !== c.id)!;
    const prol = (salaire: unknown, duree: unknown) => moteur.commandes.executer(m, { type: 'contrat.proposer_prolongation', auteur: tp.id, source: 'exterieur', parametres: { personne: autre.personne, salaire, duree } }).ok;
    expect(prol('Infinity', 1)).toBe(false);
    expect(prol(3, 1.5)).toBe(false);
    expect(prol(0.01, 1)).toBe(false);
  });

  it('2 bis. le conseil arbitre les engagements salariaux excessifs (décision risquée possible, absurde refusée)', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    const e = ecuries(m).find((x) => x.id === 'eq_haas')!;
    e.pilotee = true;
    const c = contrats(m).find((x) => x.organisation === e.id && x.poste === 'pilote_titulaire' && x.statut === 'actif')!;
    c.fin = 2027;
    c.nonProlonge = true;
    moteur.avancer(m, 25);
    const tp = teamPrincipal(m, e.id)!;
    const cible = personnes(m).find((p) => p.poste === 'pilote_junior' && p.statut === 'libre' && 2028 - p.anneeNaissance >= 18 && !contrats(m).some((x) => x.personne === p.id && x.type === 'affiliation' && x.statut === 'actif'))!;
    const r = moteur.commandes.executer(m, { type: 'marche.offre', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e.id, personne: cible.id, salaire: 140, duree: 3, debut: 2028 } });
    expect(r.ok).toBe(false); // > 50 % du budget en salaires de pilotes
    if (!r.ok) expect(r.motif).toMatch(/conseil/);
  });

  it('3. promesses : statut de n°1 exclusif, paramètres obligatoires, départ provoqué ou volontaire', () => {
    const m = sc.creerMonde(1);
    const [a, b] = contrats(m).filter((c) => c.organisation === 'eq_ferrari' && c.poste === 'pilote_titulaire' && c.statut === 'actif');
    const tp = teamPrincipal(m, 'eq_ferrari')!;
    a!.clauses.statutN1 = true;
    b!.clauses.statutN1 = true;
    const promesse = (personne: string, type: Promesse['type'], parametres: Record<string, string | number> = {}) =>
      faireUnePromesse(m, { auteur: tp.id, organisation: 'eq_ferrari', beneficiaire: personne, type, parametres, echeance: { annee: 2028, semaine: 48 }, publique: false });
    const pa = promesse(a!.personne, 'statut_n1');
    const pb = promesse(b!.personne, 'statut_n1');
    expect(promesseRespectee(m, pa)).toBe(false);
    expect(promesseRespectee(m, pb)).toBe(false);
    delete b!.clauses.statutN1;
    expect(promesseRespectee(m, pa)).toBe(true);
    expect(() => promesse(a!.personne, 'salaire_minimum')).toThrow(); // sans montant : impossible à faire
    expect(() => promesse(a!.personne, 'ne_pas_recruter')).toThrow();
    const ps = promesse(a!.personne, 'salaire_minimum', { salaire: a!.salaireMEUR + 50 });
    expect(promesseRespectee(m, ps)).toBe(false);
    // Départ provoqué (licenciement) : rompue ; départ volontaire : caduque.
    const moteur = sc.creerMoteur();
    const pr = promesse(b!.personne, 'prolongation', { finAvant: b!.fin });
    const pc = promesse(a!.personne, 'prolongation', { finAvant: a!.fin });
    const pb2 = table(m, TABLES.personnes)[b!.personne] as unknown as Personne;
    const pa2 = table(m, TABLES.personnes)[a!.personne] as unknown as Personne;
    b!.statut = 'rompu'; b!.motifFin = 'licenciement'; pb2.statut = 'libre'; pb2.ecurie = '';
    a!.statut = 'termine'; a!.motifFin = 'demission'; pa2.statut = 'libre'; pa2.ecurie = '';
    moteur.avancer(m, 1);
    expect(pr.statut).toBe('rompue');
    expect(pc.statut).toBe('caduque');
  });

  it('4. délais : un chantier suspendu faute d’enveloppe affiche son retard calendaire (scénario de l’audit)', () => {
    const m = sc.creerMonde(1);
    const e = ecuries(m).find((x) => x.id === 'eq_williams')!;
    const fi = financesDe(m, e.id) as Finances;
    const inst = Object.values(table(m, TABLES.installations)).find((i) => i['ecurie'] === e.id)!;
    fi.projets = [{ id: 'prj_test', installation: String(inst['id']), nature: 'renovation', coutPrevuMEUR: 4, dureePrevueSemaines: 8, coutReelMEUR: 4, dureeReelleSemaines: 8, depenseMEUR: 0, avancementSemaines: 0, debut: { ...m.date } }];
    // 52 semaines sans enveloppe disponible (13 périodes de 4 semaines).
    // Comme dans le moteur, chaque appel fait le bilan des 4 semaines qui viennent de s'écouler.
    const quatreSemaines = () => { m.date = { annee: m.date.annee + Math.floor((m.date.semaine + 3) / 52), semaine: ((m.date.semaine + 3) % 52) + 1 }; };
    for (let i = 0; i < 13; i++) {
      quatreSemaines();
      fi.comptes.investissements = 1e6;
      avancerProjets(m, e, fi);
    }
    fi.comptes.investissements = 0;
    for (let i = 0; i < 2; i++) {
      quatreSemaines();
      avancerProjets(m, e, fi);
    }
    const livraison = Object.values(m.evenements).find((x) => x.type === 'infrastructure.livraison')!;
    expect(livraison).toBeDefined();
    expect(Number(livraison.contexte['semainesSuspendues'])).toBeGreaterThanOrEqual(52);
    expect(Number(livraison.contexte['dureeCalendaire'])).toBe(60); // 52 semaines de suspension + 8 de travail
    expect(Number(livraison.contexte['retardSemaines'])).toBe(52);
    expect(Object.values(m.evenements).some((x) => x.type === 'infrastructure.retard')).toBe(true);
  });

  it('5. joueur extrême sur 3 saisons : effectifs bornés, aucune valeur non finie, règles identiques joueur et IA', () => {
    const m = sc.creerMonde(6);
    const moteur = sc.creerMoteur();
    const e = ecuries(m).find((x) => x.id === 'eq_alpine')!;
    e.pilotee = true;
    const valeursAbsurdes: unknown[] = [Infinity, -1, 0.04, 1e12, 'abc', NaN, 2.5, 3];
    for (let semaine = 0; semaine < 3 * 52; semaine++) {
      const tp = teamPrincipal(m, e.id);
      if (tp) {
        const cibles = personnes(m).filter((p) => p.poste.startsWith('pilote') && p.statut !== 'retraite').slice(semaine % 7, (semaine % 7) + 3);
        for (const [i, p] of cibles.entries()) {
          const v = valeursAbsurdes[(semaine + i) % valeursAbsurdes.length];
          const commande = { type: 'marche.offre', auteur: tp.id, parametres: { ecurie: e.id, personne: p.id, salaire: v, duree: v, debut: m.date.annee + 1 } };
          const joueur = moteur.commandes.executer(m, { ...commande, source: 'exterieur' });
          if (!joueur.ok) expect(moteur.commandes.executer(m, { ...commande, source: 'ia' }).ok).toBe(false); // mêmes règles
          const mien = contrats(m).find((c) => c.organisation === e.id && c.statut === 'actif' && c.poste === 'pilote_titulaire');
          if (mien) moteur.commandes.executer(m, { type: 'contrat.proposer_prolongation', auteur: tp.id, source: 'exterieur', parametres: { personne: mien.personne, salaire: v, duree: 5, promesses: ['statut_n1', 'salaire_minimum'] } });
        }
        moteur.commandes.executer(m, { type: 'academie.capacite', auteur: tp.id, source: 'exterieur', parametres: { ecurie: e.id, places: semaine % 10 } });
      }
      moteur.avancer(m, 1);
      if (m.date.semaine === 1 || m.date.semaine === 30) {
        expect(verifierEffectifs(m)).toEqual([]);
        expect(valeursNonFinies(m.tables)).toEqual([]);
      }
    }
    // Promesses : jamais deux statuts de n°1 tenus en même temps dans une écurie.
    for (const eq of ecuries(m)) {
      const tenues = (Object.values(table(m, 'promesses')) as unknown as Promesse[]).filter((p) => p.organisation === eq.id && p.type === 'statut_n1' && p.statut === 'en_cours' && promesseRespectee(m, p) === true);
      expect(tenues.length).toBeLessThanOrEqual(1);
    }
  }, 120_000);
});
