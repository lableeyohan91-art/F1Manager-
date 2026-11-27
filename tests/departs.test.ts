/**
 * D-185 — départs proposés au joueur (V1 : écurie imposée selon le mode), lus dans data/grille-2026/departs.csv.
 */
import { describe, expect, it } from 'vitest';
import { creerScenarioGrille2026 } from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

describe('D-185 — départs proposés', () => {
  it('deux modes (fond de grille, milieu), chacun lié à une écurie existante ; le joueur peut en prendre la tête', () => {
    const fichiers = lireDonneesGrille2026();
    const sc = creerScenarioGrille2026(fichiers);
    expect(sc.departs?.map((d) => d.mode)).toEqual(['fond', 'milieu']);
    const m = sc.creerMonde(1), mo = sc.creerMoteur();
    for (const d of sc.departs!) expect(m.tables['ecuries']![d.ecurie]).toBeDefined();
    const tp = Object.values(m.tables['personnes']!).find((p) => (p as { poste?: string }).poste === 'team_principal') as { id: string };
    expect(mo.commandes.executer(m, { type: 'joueur.prendre_ecurie', auteur: tp.id, source: 'exterieur', parametres: { ecurie: sc.departs![0]!.ecurie, prenom: 'A', nom: 'B' } }).ok).toBe(true);
  });

  it('une écurie inconnue dans departs.csv est refusée au chargement', () => {
    const fichiers = { ...lireDonneesGrille2026(), 'departs.csv': 'mode;ecurie;libelle;description\nfond;eq_inconnue;X;Y\n' };
    expect(() => creerScenarioGrille2026(fichiers)).toThrow(/écurie inconnue/);
  });

  it('sans departs.csv : choix libre (aucun départ proposé)', () => {
    const fichiers = { ...lireDonneesGrille2026() };
    delete fichiers['departs.csv'];
    expect(creerScenarioGrille2026(fichiers).departs).toBeUndefined();
  });
});
