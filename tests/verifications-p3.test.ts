import { describe, expect, it } from 'vitest';
import { deserialiser, titreEncoreOuvert, VERSION_FORMAT, type LigneClassementPilote, type Saison } from '../src/engine';

const ligne = (pilote: string, points: number, victoires: number, podiums: number): LigneClassementPilote =>
  ({ pilote, ecurie: 'eq', points, victoires, podiums, abandons: 0, meilleurResultat: 1 });
const saison = (pilotes: LigneClassementPilote[]): Saison => ({
  id: 'ssn', annee: 2027, calendrier: [], bareme: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1], pilotes, constructeurs: [],
  leaders: [], ecartsTete: [], indiceDebut: {}, indiceFin: {}, termine: false, chronique: [],
});

describe('Titre ouvert avant la dernière manche — définition exacte', () => {
  it('écart de 26 points : titre joué', () => {
    expect(titreEncoreOuvert(saison([ligne('a', 300, 8, 15), ligne('b', 274, 2, 10)]))).toBe(false);
  });
  it('écart de 24 points : titre ouvert', () => {
    expect(titreEncoreOuvert(saison([ligne('a', 300, 8, 15), ligne('b', 276, 2, 10)]))).toBe(true);
  });
  it('écart de 25 points : égalité possible, départagée par les victoires', () => {
    // b gagne la dernière : 300 – 300, victoires 6 contre 8 → a reste champion : titre joué.
    expect(titreEncoreOuvert(saison([ligne('a', 300, 8, 15), ligne('b', 275, 5, 12)]))).toBe(false);
    // b à 7 victoires : 8 contre 8 → départage aux podiums : b 13 contre a 15 → joué.
    expect(titreEncoreOuvert(saison([ligne('a', 300, 8, 15), ligne('b', 275, 7, 12)]))).toBe(false);
    // b à 8 victoires : 9 contre 8 → b peut être champion : ouvert.
    expect(titreEncoreOuvert(saison([ligne('a', 300, 8, 15), ligne('b', 275, 8, 12)]))).toBe(true);
    // égalité parfaite possible (victoires et podiums) : ouvert.
    expect(titreEncoreOuvert(saison([ligne('a', 300, 8, 15), ligne('b', 275, 7, 14)]))).toBe(true);
  });
  it('un rival au 3e rang peut aussi garder le titre ouvert', () => {
    expect(titreEncoreOuvert(saison([ligne('a', 300, 8, 15), ligne('b', 270, 1, 5), ligne('c', 280, 3, 9)]))).toBe(true);
  });
});

describe('Migration v2 → v3 (réglages d’expérience)', () => {
  it('une sauvegarde au format 2 reçoit des réglages vides', () => {
    const v2 = JSON.stringify({ entete: { signature: 'f1manager-sauvegarde', versionFormat: 2, versionJeu: '0.1.0', graine: 1, date: { annee: 2027, semaine: 1 } },
      monde: { versionFormat: 2, versionJeu: '0.1.0', origine: { scenario: 'vide-demo', graine: 1 }, graine: 1, date: { annee: 2027, semaine: 1 }, compteurs: {}, flux: {}, tables: {}, evenements: {}, chronique: [], agenda: [], fileCommandes: [], journalCommandes: [] } });
    const m = deserialiser(v2);
    expect(m.versionFormat).toBe(VERSION_FORMAT);
    expect(m.parametres).toEqual({});
  });
});
