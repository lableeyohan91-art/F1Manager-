/**
 * D-168 : demandes bloquantes (augmentation, départ, contre-proposition) et commande « ne pas répondre ».
 */
import { describe, expect, it } from 'vitest';
import {
  contratEmploi, creerScenarioGrille2026, decisionsEnAttente, executerCommandeJoueur, table, TABLE_NEGOCIATIONS, TABLES, teamPrincipal,
  type Monde, type Personne,
} from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const ID = 'eq_williams';

function partie(deleguerPersonnel: boolean) {
  const m = sc.creerMonde(3), moteur = sc.creerMoteur();
  executerCommandeJoueur(moteur, m, { type: 'joueur.prendre_ecurie', auteur: 'joueur', parametres: { ecurie: ID, prenom: 'Camille', nom: 'Essai' } });
  const manager = teamPrincipal(m, ID)!;
  executerCommandeJoueur(moteur, m, { type: 'joueur.deleguer', auteur: manager.id, parametres: { ecurie: ID, domaine: 'personnel', actif: deleguerPersonnel } });
  const p = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((x) => x.statut === 'actif' && x.ecurie === ID && x.poste === 'directeur_financier')!;
  const ignorer = (demande: string) => executerCommandeJoueur(moteur, m, { type: 'demande.ignorer', auteur: manager.id, parametres: { ecurie: ID, personne: p.id, demande } });
  return { m, p, ignorer };
}
const bloquantes = (m: Monde) => decisionsEnAttente(m).filter((d) => d.bloquante);

describe('D-168 — demandes bloquantes', () => {
  it('une demande d’augmentation bloque ; « ne pas répondre » vaut refus et débloque', () => {
    const { m, p, ignorer } = partie(false);
    expect(bloquantes(m)).toEqual([]);
    const c = contratEmploi(m, p.id)!;
    c.demandeAugmentation = c.salaireMEUR + 1;
    c.demandeAugmentationDepuis = { ...m.date };
    expect(bloquantes(m).map((d) => d.type)).toEqual(['augmentation']);
    expect(decisionsEnAttente(m)[0]!.type).toBe('augmentation'); // en tête de liste
    expect(ignorer('augmentation')).toEqual({ ok: true });
    expect(c.demandeAugmentation).toBeUndefined();
    expect(Object.values(m.evenements).some((e) => e.type === 'augmentation.refusee')).toBe(true);
    expect(Object.values(m.evenements).some((e) => e.type === 'demande.sans_reponse')).toBe(true);
    expect(bloquantes(m)).toEqual([]);
    expect(ignorer('augmentation').ok).toBe(false); // plus rien en attente
  });

  it('demande de départ et contre-proposition : « ne pas répondre » vaut refus / non-prolongation', () => {
    const { m, p, ignorer } = partie(false);
    const c = contratEmploi(m, p.id)!;
    c.demandeDepart = { indemnite: 0.5, depuis: { ...m.date } };
    expect(bloquantes(m).map((d) => d.type)).toEqual(['depart']);
    expect(ignorer('depart')).toEqual({ ok: true });
    expect(c.demandeDepart?.refusee).toBe(true);
    c.fin = m.date.annee;
    table(m, TABLE_NEGOCIATIONS)[c.id] = { id: c.id, contrat: c.id, salaireDemande: 9, dureeAnnees: 2, promesses: [], evenement: '' } as never;
    expect(bloquantes(m).map((d) => d.type)).toEqual(['contre_offre']);
    expect(ignorer('contre_offre')).toEqual({ ok: true });
    expect(table(m, TABLE_NEGOCIATIONS)[c.id]).toBeUndefined();
    expect(c.nonProlonge).toBe(true);
    expect(bloquantes(m)).toEqual([]);
  });

  it('un domaine délégué ne bloque pas', () => {
    const { m, p } = partie(true);
    const c = contratEmploi(m, p.id)!;
    c.fin = m.date.annee;
    table(m, TABLE_NEGOCIATIONS)[c.id] = { id: c.id, contrat: c.id, salaireDemande: 9, dureeAnnees: 2, promesses: [], evenement: '' } as never;
    c.demandeAugmentation = c.salaireMEUR + 1;
    expect(bloquantes(m)).toEqual([]);
  });

  it('seul le team principal de l’écurie peut ne pas répondre', () => {
    const m = sc.creerMonde(3), moteur = sc.creerMoteur();
    const p = (Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).find((x) => x.statut === 'actif' && x.ecurie === ID && x.poste === 'directeur_financier')!;
    contratEmploi(m, p.id)!.demandeAugmentation = 5;
    expect(executerCommandeJoueur(moteur, m, { type: 'demande.ignorer', auteur: 'per_inconnu', parametres: { ecurie: ID, personne: p.id, demande: 'augmentation' } }).ok).toBe(false);
  });
});

describe('Format 30', () => {
  it('migration v29 → v30 : une partie antérieure se charge et avance', async () => {
    const { deserialiser, serialiser, VERSION_FORMAT } = await import('../src/engine');
    const m = sc.creerMonde(4);
    const migre = deserialiser(serialiser(m).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":29'));
    expect(migre.versionFormat).toBe(VERSION_FORMAT);
    sc.creerMoteur().avancer(migre, 30);
    expect(migre.date.semaine).toBeGreaterThan(m.date.semaine);
  }, 60_000);
});
