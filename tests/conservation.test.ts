import { describe, expect, it } from 'vitest';
import { ajouterEvenement, compacterJournal, scenarioVideDemo, tirageLocal, SEMAINES_PAR_AN_EXPORT as S } from '../src/cli/_moteur';

const nouveau = () => ({ monde: scenarioVideDemo.creerMonde(1), moteur: scenarioVideDemo.creerMoteur() });

describe('Conservation — correctifs du 22/11/2026', () => {
  it('la protection extérieure se propage aux causes de l’événement protégé', () => {
    const { monde } = nouveau();
    const cause = ajouterEvenement(monde, { type: 't.cause', acteurs: [], importance: 1 });
    const protege = ajouterEvenement(monde, { type: 't.protege', acteurs: [], importance: 1, causes: [cause.id] });
    monde.date = { annee: monde.date.annee + 3, semaine: 1 };
    compacterJournal(monde, new Set([protege.id]));
    expect(monde.evenements[protege.id]).toBeDefined();
    expect(monde.evenements[cause.id]).toBeDefined(); // supprimée avant le correctif
  });

  it('élagage : au-delà de 10 saisons, un événement majeur ne protège plus ses causes mineures, mais garde un résumé', () => {
    const { monde } = nouveau();
    const mineur = ajouterEvenement(monde, { type: 't.mineur', acteurs: [], importance: 1 });
    const majeur = ajouterEvenement(monde, { type: 't.majeur', acteurs: [], importance: 5, causes: [mineur.id] });
    monde.date = { annee: monde.date.annee + 5, semaine: 1 };
    compacterJournal(monde);
    expect(monde.evenements[mineur.id]).toBeDefined();
    monde.date = { annee: monde.date.annee + 7, semaine: 1 };
    const bilan = compacterJournal(monde);
    expect(monde.evenements[mineur.id]).toBeUndefined();
    expect(monde.evenements[majeur.id]?.causes).toEqual([]);
    expect(monde.evenements[majeur.id]?.causesResumees).toEqual([{ type: 't.mineur', date: { annee: 2027, semaine: 1 } }]);
    expect(bilan.liensElagues).toBe(1);
  });

  it('les liens entre événements majeurs ne sont jamais élagués', () => {
    const { monde, moteur } = nouveau();
    moteur.avancer(monde, 30 * S);
    const derniere = monde.chronique.at(-1)!;
    let e = monde.evenements[derniere.id]!;
    let n = 1;
    while (e.causes.length > 0) { e = monde.evenements[e.causes[0]!]!; n++; }
    expect(n).toBe(30);
  });
});

describe('Tirages locaux (D-057)', () => {
  it('ne dépendent que de la graine et de la clé, pas des tirages précédents', () => {
    const { monde } = nouveau();
    const a = tirageLocal(monde, 'resultats', 'gp_2027_01', 'per_x').suivant();
    for (let i = 0; i < 100; i++) tirageLocal(monde, 'autre', i).suivant();
    const b = tirageLocal(monde, 'resultats', 'gp_2027_01', 'per_x').suivant();
    expect(a).toBe(b);
    expect(tirageLocal(monde, 'resultats', 'gp_2027_01', 'per_y').suivant()).not.toBe(a);
  });
});
