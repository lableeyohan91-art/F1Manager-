/**
 * Scénarios de départ : de quoi recréer un monde initial à l'identique à partir d'une graine.
 * La sauvegarde garde le nom du scénario et la graine (monde.origine), ce qui permet de rejouer.
 */

import { creerMondeVide, table, type Monde } from './core/monde';
import { Moteur } from './core/moteur';
import { installerDemo } from './systems/demo';
import { chargerDonnees, type FichiersDonnees } from './generation/chargement';
import { construireMonde } from './generation/construction';
import { installerSaison } from './systems/saison';
import { installerHumain } from './systems/humain';
import { installerEconomie } from './systems/economie';
import { installerCarriere } from './systems/carriere';
import { installerDeveloppeur } from './systems/developpeur';
import { installerJuniors } from './systems/juniors';
import { installerTechnique } from './systems/technique';
import { installerInformation } from './systems/information';
import { installerStands } from './systems/stands';

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

/**
 * Phase 2 : départ inspiré de la grille 2026 (D-042). Les fichiers de données sont fournis
 * par la plateforme (lus sur le disque, ou embarqués dans le site).
 */
export function creerScenarioGrille2026(fichiers: FichiersDonnees): Scenario {
  const donnees = chargerDonnees(fichiers);
  return {
    nom: 'grille-2026',
    description: 'Départ en 2027 avec la grille inspirée de 2026 (data/grille-2026).',
    creerMonde: (graine) => construireMonde(graine, donnees, 'grille-2026'),
    creerMoteur: () => installerDeveloppeur(installerStands(installerInformation(installerJuniors(installerCarriere(installerHumain(installerTechnique(installerSaison(installerEconomie(new Moteur()))))))))),
  };
}
