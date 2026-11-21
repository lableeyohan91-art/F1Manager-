/**
 * Scénarios de départ : de quoi recréer un monde initial à l'identique à partir d'une graine.
 * La sauvegarde garde le nom du scénario et la graine (monde.origine), ce qui permet de rejouer.
 */

import { creerMondeVide, table, type Monde } from './core/monde';
import { Moteur } from './core/moteur';
import { installerDemo } from './systems/demo';

export interface Scenario {
  nom: string;
  description: string;
  creerMonde(graine: number): Monde;
  creerMoteur(): Moteur;
}

/** Phase 1 : monde vide + systèmes de démonstration. */
export const scenarioVideDemo: Scenario = {
  nom: 'vide-demo',
  description: 'Monde vide et systèmes de démonstration (test du noyau, phase 1).',
  creerMonde(graine) {
    const monde = creerMondeVide(graine, 'vide-demo', { annee: 2027, semaine: 1 });
    table(monde, 'organisations')['org_demo'] = { id: 'org_demo', nom: 'Écurie de démonstration' };
    return monde;
  },
  creerMoteur() {
    return installerDemo(new Moteur());
  },
};

const SCENARIOS: Record<string, Scenario> = { [scenarioVideDemo.nom]: scenarioVideDemo };

export function scenario(nom: string): Scenario {
  const s = SCENARIOS[nom];
  if (!s) throw new Error(`Scénario inconnu : ${nom}. Disponibles : ${Object.keys(SCENARIOS).join(', ')}`);
  return s;
}

export function enregistrerScenario(s: Scenario): void {
  SCENARIOS[s.nom] = s;
}

export function nomsScenarios(): string[] {
  return Object.keys(SCENARIOS);
}
