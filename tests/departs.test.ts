/** Phase 8d-2 — démissions et ruptures négociées (D-077). */
import { describe, expect, it } from 'vitest';
import {
  contratEmploi, creerScenarioGrille2026, envieDePartir, financesDe, indemniteRupture, relationBrute, souvenirsDe, table, TABLES, teamPrincipal,
  type Ecurie, type Monde, type Personne,
} from '../src/engine';
import { DEMANDES_DEPART } from '../src/engine/balance/departs';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
const auPoste = (m: Monde, e: string, poste: string) => personnes(m).find((p) => p.statut === 'actif' && p.ecurie === e && p.poste === poste)!;

/** Une personne en conflit ouvert avec son team principal. */
function enConflit(m: Monde, p: Personne) {
  const tp = teamPrincipal(m, p.ecurie)!;
  relationBrute(m, p.id, tp.id, true)!.base.confiance = -1;
  relationBrute(m, p.id, p.ecurie, true)!.base.confiance = -1;
  p.etat.motivation = 10;
  return tp;
}

describe('Phase 8d-2 — démissions et ruptures négociées', () => {
  it('l’envie de partir monte avec la méfiance envers le team principal (contrefactuel)', () => {
    const m = sc.creerMonde(1);
    sc.creerMoteur().avancer(m, 2);
    const p = auPoste(m, 'eq_ferrari', 'directeur_financier');
    const avant = envieDePartir(m, p).envie;
    enConflit(m, p);
    const apres = envieDePartir(m, p);
    expect(apres.envie).toBeGreaterThan(avant);
    expect(apres.envie).toBeGreaterThanOrEqual(DEMANDES_DEPART.seuilDemission);
    expect(apres.raisons['mefiance']).toBeGreaterThan(0);
  });

  it('une personne en conflit demande à partir ; refusée, elle finit par démissionner : sans indemnité, non-concurrence, trahison ressentie', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const p = auPoste(m, 'eq_ferrari', 'directeur_financier');
    const tp = enConflit(m, p);
    const c = contratEmploi(m, p.id)!;
    c.demandeDepart = { indemnite: 0.5, depuis: { ...m.date }, refusee: true };
    for (let k = 0; k < 60 && p.statut === 'actif'; k++) {
      enConflit(m, p);
      moteur.avancer(m, 1);
    }
    expect(p.statut).toBe('libre');
    expect(c.motifFin).toBe('demission');
    expect(c.indemniteVerseeMEUR ?? 0).toBe(0);
    expect(p.nonConcurrenceJusqua).toBeDefined();
    expect(souvenirsDe(m, tp.id).some((s) => s.cible === p.id && s.etiquette === 'trahison')).toBe(true);
    expect(Object.values(m.evenements).some((e) => e.type === 'contrat.demission' && e.acteurs.some((a) => a.id === p.id))).toBe(true);
  }, 60_000);

  it('rupture négociée proposée par l’employeur : refusée si l’indemnité est trop basse, acceptée sinon, indemnité réellement versée', () => {
    const m = sc.creerMonde(1);
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const p = auPoste(m, 'eq_haas', 'responsable_aero');
    p.etat.motivation = 100;
    const tp = teamPrincipal(m, 'eq_haas')!;
    const c = contratEmploi(m, p.id)!;
    const plein = indemniteRupture(c);
    const rup = (auteur: string, indemnite: number) => moteur.commandes.executer(m, { type: 'contrat.rupture_negociee', auteur, source: 'exterieur', parametres: { personne: p.id, indemnite } });
    expect(rup(teamPrincipal(m, 'eq_ferrari')!.id, plein).ok).toBe(false);
    expect(rup(tp.id, -1).ok).toBe(false);
    expect(rup(tp.id, 3 * plein).ok).toBe(false);
    expect(rup(tp.id, 0).ok).toBe(true);
    expect(p.statut).toBe('actif'); // refusée : il n'a aucune envie de partir
    const fi = financesDe(m, 'eq_haas')!;
    const avant = fi.tresorerieMEUR;
    expect(rup(tp.id, plein).ok).toBe(true);
    expect(p.statut).toBe('libre');
    expect(c.motifFin).toBe('rupture_employeur');
    expect(fi.tresorerieMEUR).toBeCloseTo(avant - plein, 9);
  }, 60_000);

  it('écurie du joueur : la demande attend sa réponse (commande) ; sans réponse, elle vaut refus', () => {
    const m = sc.creerMonde(1);
    (table(m, TABLES.ecuries)['eq_williams'] as unknown as Ecurie).pilotee = true;
    const moteur = sc.creerMoteur();
    moteur.avancer(m, 2);
    const a = auPoste(m, 'eq_williams', 'responsable_aero');
    const b = auPoste(m, 'eq_williams', 'directeur_financier');
    const tp = teamPrincipal(m, 'eq_williams')!;
    for (const p of [a, b]) contratEmploi(m, p.id)!.demandeDepart = { indemnite: 0.3, depuis: { ...m.date } };
    const rep = (p: Personne, accepter: boolean) => moteur.commandes.executer(m, { type: 'contrat.repondre_depart', auteur: tp.id, source: 'exterieur', parametres: { personne: p.id, accepter } });
    moteur.avancer(m, 4);
    expect(a.statut).toBe('actif'); // l'IA ne répond pas à la place du joueur
    expect(rep(a, true).ok).toBe(true);
    expect(a.statut).toBe('libre');
    expect(contratEmploi(m, b.id)!.demandeDepart?.refusee).toBeFalsy();
    moteur.avancer(m, DEMANDES_DEPART.delaiReponseSemaines + 4);
    expect(b.statut === 'libre' || contratEmploi(m, b.id)?.demandeDepart?.refusee === true || contratEmploi(m, b.id)?.demandeDepart === undefined).toBe(true);
    expect(rep(b, true).ok).toBe(false); // plus rien en attente
  }, 60_000);
});
