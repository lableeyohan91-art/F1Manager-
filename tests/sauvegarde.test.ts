import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { deserialiser, ErreurSauvegarde, scenarioVideDemo, serialiser, VERSION_FORMAT } from '../src/engine';

describe('Critère 5 — migration de sauvegarde', () => {
  it('une sauvegarde au format 1 est migrée au format actuel', () => {
    const v1 = readFileSync(new URL('./donnees/sauvegarde-v1.json', import.meta.url), 'utf8');
    const monde = deserialiser(v1);
    expect(monde.versionFormat).toBe(VERSION_FORMAT);
    expect(monde.chronique).toEqual([]);
    expect(monde.tables['organisations']?.['org_demo']).toBeDefined();
    // Le monde migré est utilisable par le moteur.
    scenarioVideDemo.creerMoteur().avancer(monde, 60);
    expect(monde.date).toEqual({ annee: 2028, semaine: 9 });
  });

  it('une sauvegarde d’une version plus récente est refusée clairement', () => {
    const texte = serialiser(scenarioVideDemo.creerMonde(1)).replace(`"versionFormat":${VERSION_FORMAT}`, '"versionFormat":999');
    expect(() => deserialiser(texte)).toThrow(ErreurSauvegarde);
  });

  it('un fichier quelconque est refusé clairement', () => {
    expect(() => deserialiser('{"a":1}')).toThrow("n'est pas une sauvegarde de ce jeu");
    expect(() => deserialiser('pas du json')).toThrow('JSON invalide');
  });
});
