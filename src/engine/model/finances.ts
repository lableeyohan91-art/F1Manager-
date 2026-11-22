/** Utilitaires du modèle financier (phase 5a). */
import type { ComptesAnnee } from './types';

export function comptesVides(annee: number): ComptesAnnee {
  return {
    annee, primes: 0, commercial: 0, apport: 0,
    personnelPlafonne: 0, departements: 0, operations: 0, entretien: 0, developpement: 0,
    salairesHorsPlafond: 0, marketing: 0, indemnites: 0, amendes: 0, dividendes: 0,
  };
}

export function totalRecettes(c: ComptesAnnee): number {
  return c.primes + c.commercial + c.apport;
}

export function totalPlafonne(c: ComptesAnnee): number {
  return c.personnelPlafonne + c.departements + c.operations + c.entretien + c.developpement;
}

export function totalDepenses(c: ComptesAnnee): number {
  return totalPlafonne(c) + c.salairesHorsPlafond + c.marketing + c.indemnites + c.amendes + (c.dividendes ?? 0);
}
