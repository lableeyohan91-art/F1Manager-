/** Phase 10 — le joueur (docs/systemes/phase-10-joueur.md). */
import { describe, expect, it } from 'vitest';
import {
  contratEmploi, creerScenarioGrille2026, decisionsEnAttente, deserialiser, empreinte, executerCommandeJoueur, financesDe, iaDecide, serialiser, table, TABLES,
  teamPrincipal, verifierCoherence, VERSION_FORMAT, type Ecurie, type Monde, type Moteur, type Personne,
} from '../src/engine';
import { DELEGATIONS_DEFAUT } from '../src/engine/balance/joueur';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const ecurie = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie;
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const ID = 'eq_williams';

function partie(graine = 3): { m: Monde; moteur: Moteur; manager: Personne } {
  const m = sc.creerMonde(graine);
  const moteur = sc.creerMoteur();
  const r = executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: ID, prenom: 'Camille', nom: 'Testeur' } });
  expect(r).toEqual({ ok: true });
  return { m, moteur, manager: teamPrincipal(m, ID)! };
}

describe('Phase 10 — prise de fonction', () => {
  it('refuse les commandes invalides, avec un motif lisible', () => {
    const m = sc.creerMonde(3);
    const moteur = sc.creerMoteur();
    const essai = (prm: Record<string, unknown>) => executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: prm });
    expect(essai({ ecurie: 'eq_inconnue', prenom: 'A', nom: 'B' })).toMatchObject({ ok: false, motif: 'Écurie inconnue.' });
    expect(essai({ ecurie: ID, prenom: '', nom: 'B' })).toMatchObject({ ok: false });
    expect(m.journalCommandes).toHaveLength(0); // une commande refusée n'est pas journalisée
    expect(essai({ ecurie: ID, prenom: 'A', nom: 'B' })).toEqual({ ok: true });
    expect(essai({ ecurie: 'eq_ferrari', prenom: 'A', nom: 'B' })).toMatchObject({ ok: false, motif: 'Une écurie est déjà dirigée par le joueur dans cette partie.' });
  });

  it('le joueur devient team principal ; son prédécesseur part, et ce départ cite la prise de fonction', () => {
    const m = sc.creerMonde(3);
    const moteur = sc.creerMoteur();
    const ancien = teamPrincipal(m, ID)!;
    executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: ID, prenom: 'Camille', nom: 'Testeur' } });
    const manager = teamPrincipal(m, ID)!;
    expect(manager.joueur).toBe(true);
    expect(`${manager.prenom} ${manager.nom}`).toBe('Camille Testeur');
    expect(Object.values(manager.traits).every((v) => v === 10)).toBe(true);
    expect(ancien.statut).toBe('libre');
    expect(contratEmploi(m, manager.id)?.fin).toBe(2029);
    expect(m.joueur).toMatchObject({ personne: manager.id, ecurie: ID, etat: 'actif' });
    const e = ecurie(m, ID);
    expect(e.pilotee).toBe(true);
    expect(e.delegations).toEqual({ ...DELEGATIONS_DEFAUT, stands: true });
    const prise = Object.values(m.evenements).find((x) => x.type === 'joueur.prise_de_fonction')!;
    const depart = Object.values(m.evenements).find((x) => x.type === 'contrat.fin' && x.acteurs.some((a) => a.id === ancien.id))!;
    expect(depart.causes).toContain(prise.id);
    expect(verifierCoherence(m, { ages: false })).toEqual([]);
  });
});

describe('Phase 10 — délégations', () => {
  it('par défaut, le joueur gère ses pilotes ; tout le reste est délégué ; la commande change un domaine', () => {
    const { m, moteur, manager } = partie();
    const e = ecurie(m, ID);
    expect(iaDecide(e, 'pilotes')).toBe(false);
    expect(iaDecide(e, 'personnel')).toBe(true);
    expect(e.delegationRecherche).toBe(true);
    expect(executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'personnel', actif: false } })).toEqual({ ok: true });
    expect(iaDecide(e, 'personnel')).toBe(false);
    expect(executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'recherche', actif: false } })).toEqual({ ok: true });
    expect(e.delegationRecherche).toBe(false);
    // Une écurie de l'IA décide toujours de tout.
    expect(iaDecide(ecurie(m, 'eq_ferrari'), 'pilotes')).toBe(true);
    expect(executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'inconnu', actif: false } }).ok).toBe(false);
  });

  it('une demande d’augmentation n’attend le joueur que si le domaine n’est pas délégué', () => {
    const { m, moteur, manager } = partie();
    const dt = personnes(m).find((p) => p.ecurie === ID && p.poste === 'directeur_technique')!;
    contratEmploi(m, dt.id)!.demandeAugmentation = 9.9;
    expect(decisionsEnAttente(m).some((d) => d.type === 'augmentation')).toBe(false);
    executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'personnel', actif: false } });
    const d = decisionsEnAttente(m).find((x) => x.type === 'augmentation')!;
    expect(d.personne).toBe(dt.id);
    // Le joueur répond avec la même commande que l'IA : la décision disparaît.
    expect(executerCommandeJoueur(moteur, m, { type: 'contrat.repondre_augmentation', auteur: manager.id, parametres: { personne: dt.id, accepter: false } })).toEqual({ ok: true });
    expect(decisionsEnAttente(m).some((x) => x.type === 'augmentation')).toBe(false);
  });

  it('pilotes non délégués : l’IA ne fait aucune offre de pilote au nom de l’écurie du joueur pendant une saison', () => {
    const { m, moteur } = partie();
    moteur.avancer(m, 44); // pendant la fenêtre du marché (les offres sont effacées à sa clôture)
    const offres = Object.values(table(m, TABLES.offres)) as unknown as { ecurie: string; poste: string }[];
    expect(offres.filter((o) => o.ecurie === ID && o.poste === 'pilote_titulaire')).toHaveLength(0);
    expect(offres.filter((o) => o.ecurie !== ID && o.poste === 'pilote_titulaire').length).toBeGreaterThan(0);
  }, 60_000);
});

describe('Phase 10 — budget de développement', () => {
  it('le joueur fixe son budget de développement dans les bornes ; hors bornes, refus motivé', () => {
    const { m, moteur, manager } = partie();
    moteur.avancer(m, 1); // budget de l'année décidé en semaine 1
    const fi = financesDe(m, ID)!;
    expect(executerCommandeJoueur(moteur, m, { type: 'budget.developpement', auteur: manager.id, parametres: { ecurie: ID, montant: 1 } }).ok).toBe(false);
    expect(executerCommandeJoueur(moteur, m, { type: 'budget.developpement', auteur: manager.id, parametres: { ecurie: ID, montant: 1e6 } }).ok).toBe(false);
    expect(executerCommandeJoueur(moteur, m, { type: 'budget.developpement', auteur: 'per_x', parametres: { ecurie: ID, montant: 50 } }).ok).toBe(false);
    expect(executerCommandeJoueur(moteur, m, { type: 'budget.developpement', auteur: manager.id, parametres: { ecurie: ID, montant: 50 } })).toEqual({ ok: true });
    expect(fi.budget.developpementMEUR).toBe(50);
  });
});

describe('Phase 10 — parties de contrôle', () => {
  it('joueur passif qui ne délègue rien pendant 3 saisons : l’écurie reste complète (filet de sécurité), le monde cohérent', () => {
    const { m, moteur, manager } = partie(5);
    for (const domaine of ['pilotes', 'personnel', 'recherche', 'stands', 'politique']) {
      expect(executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine, actif: false } })).toEqual({ ok: true });
    }
    // Audit 10.9 : l'académie reste confiée à l'équipe tant qu'aucun écran ne permet de la diriger (sinon elle se figerait).
    expect(executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'academie', actif: false } }).ok).toBe(false);
    let vuDecisions = 0;
    for (let k = 0; k < 52 * 3; k++) {
      moteur.avancer(m, 1);
      vuDecisions += decisionsEnAttente(m).length;
      if (m.date.semaine === 1) {
        expect({ date: m.date, pb: verifierCoherence(m, { ages: false }) }).toEqual({ date: m.date, pb: [] });
        if (m.joueur?.etat !== 'actif') break;
        const effectif = personnes(m).filter((p) => p.statut === 'actif' && p.ecurie === ID);
        expect(effectif.filter((p) => p.poste === 'pilote_titulaire')).toHaveLength(2);
        expect(effectif.some((p) => p.poste === 'directeur_technique')).toBe(true);
      }
    }
    expect(vuDecisions).toBeGreaterThan(0); // des fins de contrat, des places à pourvoir… lui ont été signalées
  }, 120_000);

  it('licencié (l’écurie lui échappe), le joueur quitte la partie : fin de partie expliquée, écurie rendue à l’IA', () => {
    const { m, moteur, manager } = partie();
    ecurie(m, ID).pilotee = false; // ce que fait le conseil (D-089) en le licenciant
    moteur.avancer(m, 1);
    expect(m.joueur?.etat).toBe('licencie');
    expect(manager.statut).toBe('retraite');
    expect(m.evenements[m.joueur!.evenementFin!]?.type).toBe('joueur.fin_de_partie');
    moteur.avancer(m, 2);
    expect(teamPrincipal(m, ID)).toBeDefined(); // un successeur est recruté par l'IA
    expect(decisionsEnAttente(m)).toEqual([]);
  });

  it('le joueur n’est jamais sur le marché ni à la retraite à sa place', () => {
    const { m, moteur, manager } = partie();
    const autre = teamPrincipal(m, 'eq_ferrari')!;
    m.date.semaine = 30;
    const r = moteur.commandes.verifier(m, { type: 'marche.offre', auteur: autre.id, source: 'ia', parametres: { ecurie: 'eq_ferrari', personne: manager.id, poste: 'team_principal', salaire: 10, duree: 2, debut: 2028 } });
    expect(r).toMatchObject({ ok: false, motif: 'Le manager du joueur n’est pas sur le marché.' });
  });
});

describe('Phase 10 — sauvegarde et rejouabilité', () => {
  it('une sauvegarde au format 24 est migrée (format 25, puis le format actuel)', () => {
    const m = sc.creerMonde(2);
    const texte = serialiser(m).replaceAll(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":24');
    const migre = deserialiser(texte);
    expect(migre.versionFormat).toBe(VERSION_FORMAT); // 24 → 25 → 26 (phase 11)
    expect(migre.joueur).toBeUndefined();
  });

  it('une partie avec des commandes du joueur se rejoue à l’identique', () => {
    const { m, moteur, manager } = partie(8);
    moteur.avancer(m, 3);
    executerCommandeJoueur(moteur, m, { type: 'budget.developpement', auteur: manager.id, parametres: { ecurie: ID, montant: 40 } });
    executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'personnel', actif: false } });
    moteur.avancer(m, 20);
    const rejoue = sc.creerMoteur().rejouer(sc.creerMonde(8), m.journalCommandes, m.date);
    expect(empreinte(rejoue)).toBe(empreinte(m));
    // Sauvegarde puis rechargement : l'état du joueur est conservé.
    const recharge = deserialiser(serialiser(m));
    expect(recharge.joueur).toEqual(m.joueur);
  }, 60_000);
});
