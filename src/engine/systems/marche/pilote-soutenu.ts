/**
 * Chantier 2, levier B — l'offre du pilote soutenu (fiche docs/systemes/phase-12e-levier-b-pilote-soutenu.md).
 * PROTOTYPE DE MESURE : désactivé par défaut (PILOTE_SOUTENU.actif = 0, paramètre d'expérience `pilotesSoutenus`). Seules les écuries de
 * l'IA reçoivent l'offre dans ce prototype ; la décision bloquante du joueur viendra après validation du porteur.
 */
import { PILOTE_SOUTENU, PERIODES_PAR_AN } from '../../balance/finances';
import { ajouterEvenement } from '../../core/evenements';
import { parametre, table, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';
import { totalDepenses } from '../../model/finances';
import { TABLES, type Ecurie, type Finances, type Personne, type Saison } from '../../model/types';
import { teamPrincipal } from '../humain/decision';
import { ecuriesActives, niveauPilote } from '../saison/performance';
import { contratsActifs, emplacementsLibres, signerSponsor } from '../economie/sponsors';
import { entrepriseLiee, valeurCommerciale } from './commercial';
import { besoinsPour, disponibilite, engagerPiloteSoutenu, titulairesPour, valeurTitulaire } from './index';

const arrondi = (x: number) => Math.round(x * 10) / 10;
const financesDe = (m: Monde, id: string) => (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === id);

/** Écurie en difficulté au sens du levier B (et trésorerie, pour départager). */
function enDifficulte(monde: Monde, e: Ecurie, fi: Finances, annee: number): boolean {
  const rangs = contratsActifs(monde, annee + 1, e.id).map((c) => c.rang);
  const sansSponsor = !rangs.includes('titre') && !rangs.includes('principal');
  const dernier = fi.historique.at(-1);
  const seuil = dernier ? (totalDepenses(dernier) / PERIODES_PAR_AN) * PILOTE_SOUTENU.tresorerieMois * (PERIODES_PAR_AN / 12) : 0;
  return sansSponsor || fi.tresorerieMEUR < seuil;
}

export function offrePiloteSoutenu(monde: Monde): void {
  if (parametre(monde, 'pilotesSoutenus', PILOTE_SOUTENU.actif) <= 0) return;
  const annee = monde.date.annee;
  const s = table(monde, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison | undefined;
  if (!s) return;
  const n = s.constructeurs.length;
  const eligibles = ecuriesActives(monde).filter((e) => {
    if (e.pilotee) return false; // prototype : le joueur n'est pas encore concerné
    const fi = financesDe(monde, e.id);
    if (!fi) return false;
    const ps = fi.piloteSoutenu;
    if (ps?.jusqua !== undefined && ps.jusqua >= annee) return false;
    if (ps?.refus !== undefined && annee - ps.refus < PILOTE_SOUTENU.delaiApresRefus) return false;
    const rang = s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1;
    return besoinsPour(monde, e.id, annee + 1) > 0 && rang > n / 2 && enDifficulte(monde, e, fi, annee);
  });
  if (!eligibles.length) return;
  const e = [...eligibles].sort((a, b) => financesDe(monde, a.id)!.tresorerieMEUR - financesDe(monde, b.id)!.tresorerieMEUR || (a.id < b.id ? -1 : 1))[0]!;
  const f = tirageLocal(monde, 'pilote.soutenu', annee);
  if (!f.chance(PILOTE_SOUTENU.chance)) return;
  const fi = financesDe(monde, e.id)!;
  // Référence : niveau moyen des titulaires actuels de l'écurie.
  const actuels = titulairesPour(monde, e.id, annee).map((id) => table(monde, TABLES.personnes)[id] as unknown as Personne).filter(Boolean);
  const ref = actuels.length ? actuels.reduce((a, p) => a + niveauPilote(p, false), 0) / actuels.length : 13;
  const candidats = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[])
    .filter((p) => p.statut === 'actif' && p.poste.startsWith('pilote') && p.poste !== 'pilote_titulaire')
    .filter((p) => { const d = disponibilite(monde, p, e, annee + 1); return typeof d !== 'string' && d.indemniteMEUR === 0; })
    .map((p) => ({ p, niveau: niveauPilote(p, false) }))
    .filter((x) => x.niveau >= PILOTE_SOUTENU.niveauMin && x.niveau <= ref - PILOTE_SOUTENU.ecartMin && x.niveau >= ref - PILOTE_SOUTENU.ecartMax)
    .sort((a, b) => valeurCommerciale(monde, b.p) - valeurCommerciale(monde, a.p) || (a.p.id < b.p.id ? -1 : 1));
  const choisi = candidats[0];
  if (!choisi) return;
  const p = choisi.p;
  const cheque = arrondi(PILOTE_SOUTENU.chequeMin + f.suivant() * (PILOTE_SOUTENU.chequeMax - PILOTE_SOUTENU.chequeMin));
  const montant = arrondi(PILOTE_SOUTENU.sponsorMin + f.suivant() * (PILOTE_SOUTENU.sponsorMax - PILOTE_SOUTENU.sponsorMin));
  const tp = teamPrincipal(monde, e.id);
  const ecart = ref - choisi.niveau;
  const accepte = !!tp && (ecart <= PILOTE_SOUTENU.ecartAccepteIA || enDifficulte(monde, e, fi, annee));
  const contexte = { pilote: p.id, niveau: arrondi(choisi.niveau), reference: arrondi(ref), cheque, sponsor: montant };
  if (!accepte) {
    fi.piloteSoutenu = { refus: annee, pilote: p.id };
    ajouterEvenement(monde, { type: 'pilote_soutenu.refus', acteurs: [{ id: e.id, role: 'ecurie' }, { id: p.id, role: 'pilote' }], importance: 2, visibilite: 'prive', contexte, texte: `${e.nom} refuse l'offre du groupe qui soutient ${p.prenom} ${p.nom}.` });
    return;
  }
  const sig = engagerPiloteSoutenu(monde, e, p, tp!.id, arrondi(Math.max(0.5, valeurTitulaire(monde, p) * PILOTE_SOUTENU.salaireParValeur)), PILOTE_SOUTENU.dureeGarantie, annee + 1);
  if (typeof sig === 'string') return;
  fi.tresorerieMEUR += cheque;
  fi.comptes.apportsExceptionnels += cheque;
  const sp = entrepriseLiee(monde, p, 'nat', montant);
  if (sp) {
    const libres = emplacementsLibres(monde, e.id, annee + 1);
    const rang = libres.titre > 0 ? 'titre' : libres.principal > 0 ? 'principal' : 'secondaire';
    const c = signerSponsor(monde, sp, e, rang, montant, annee + 1, false);
    c.pilote = p.id;
    c.fin = annee + PILOTE_SOUTENU.dureeSponsor;
    sp.derniereAnneeContrat = c.fin;
  }
  fi.piloteSoutenu = { jusqua: annee + PILOTE_SOUTENU.dureeSponsor, pilote: p.id };
  ajouterEvenement(monde, {
    type: 'pilote_soutenu.accepte', acteurs: [{ id: e.id, role: 'ecurie' }, { id: p.id, role: 'pilote' }], importance: 3, visibilite: 'public', causes: [sig.id], contexte,
    texte: `${p.prenom} ${p.nom} arrive chez ${e.nom} avec le soutien d'un grand groupe de son pays : ${cheque} M€ à la signature et ${montant} M€ par an de sponsoring.`,
  });
}
