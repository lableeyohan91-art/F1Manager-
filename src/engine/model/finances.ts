/** Utilitaires du modèle financier (phase 5a). */
import type { ComptesAnnee } from './types';

export function comptesVides(annee: number): ComptesAnnee {
  return {
    annee, primes: 0, commercial: 0, apport: 0,
    personnelPlafonne: 0, departements: 0, operations: 0, entretien: 0, developpement: 0,
    salairesHorsPlafond: 0, marketing: 0, indemnites: 0, amendes: 0, dividendes: 0, sponsors: 0, interets: 0, investissements: 0, apportsExceptionnels: 0, academie: 0, transfertsRecus: 0,
  };
}

export function totalRecettes(c: ComptesAnnee): number {
  return c.primes + c.commercial + c.apport + (c.sponsors ?? 0) + (c.transfertsRecus ?? 0);
}

export function totalPlafonne(c: ComptesAnnee): number {
  return c.personnelPlafonne + c.departements + c.operations + c.entretien + c.developpement;
}

export function totalDepenses(c: ComptesAnnee): number {
  return totalPlafonne(c) + c.salairesHorsPlafond + c.marketing + c.indemnites + c.amendes + (c.dividendes ?? 0) + (c.interets ?? 0) + (c.investissements ?? 0) + (c.academie ?? 0) + (c.entretienHorsPlafond ?? 0);
}
