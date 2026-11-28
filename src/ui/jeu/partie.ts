/**
 * Phase 10 — outils de l'interface joueur (hors moteur) : commandes du joueur, avancée du temps par tranches,
 * faits visibles par le joueur. Le moteur reste la seule source de vérité.
 */
import { FENETRE } from '../../engine/balance/marche';
import { rangSemaine } from '../../engine/core/calendrier';
import { exporter } from '../../platform/navigateur/stockage';
import {
  copierMonde, decisionsEnAttente, executerCommandeJoueur, iaDecide, managerJoueur, serialiser, table, TABLES,
  type DecisionEnAttente, type Ecurie, type Evenement, type GrandPrix, type Monde, type Moteur, type Personne, type ResultatCommande, type Saison,
} from '../../engine';

export interface Partie {
  monde: Monde;
  moteur: Moteur;
}

export const ecurieJoueur = (m: Monde) => (m.joueur ? (table(m, TABLES.ecuries)[m.joueur.ecurie] as unknown as Ecurie) : undefined);
export const personne = (m: Monde, id: string) => table(m, TABLES.personnes)[id] as unknown as Personne | undefined;
export const nom = (p?: { prenom: string; nom: string }) => (p ? `${p.prenom} ${p.nom}` : '—');
export const nomEcurie = (m: Monde, id: string) => (table(m, TABLES.ecuries)[id] as unknown as Ecurie | undefined)?.nom ?? id;

/** Le joueur passe une commande en son nom (team principal), appliquée tout de suite et journalisée. */
export function commander(p: Partie, type: string, parametres: Record<string, unknown>): ResultatCommande {
  const auteur = managerJoueur(p.monde)?.id ?? 'joueur';
  return executerCommandeJoueur(p.moteur, p.monde, { type, auteur, parametres });
}

/** Vérifie une commande sans l'appliquer (bouton grisé, motif affiché). */
export function verifier(p: Partie, type: string, parametres: Record<string, unknown>): ResultatCommande {
  const auteur = managerJoueur(p.monde)?.id ?? 'joueur';
  return p.moteur.commandes.verifier(p.monde, { type, auteur, source: 'exterieur', parametres });
}

export const saisonCourante = (m: Monde) => table(m, TABLES.saisons)[`ssn_${m.date.annee}`] as unknown as Saison | undefined;
export const grandsPrix = (m: Monde, annee = m.date.annee) =>
  (Object.values(table(m, TABLES.grandsPrix)) as unknown as GrandPrix[]).filter((g) => g.saison === annee).sort((a, b) => a.manche - b.manche);
export const prochainGP = (m: Monde) => grandsPrix(m).find((g) => !g.termine);
export const nomCircuit = (m: Monde, id: string) => (table(m, TABLES.circuits)[id] as unknown as { nom: string } | undefined)?.nom ?? id;

/** Membres actuels de l'écurie du joueur (identifiants). */
export function membres(m: Monde): Set<string> {
  const e = m.joueur?.ecurie;
  return new Set((Object.values(table(m, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === e).map((p) => p.id));
}

/**
 * Faits que le joueur peut connaître : publics, ou privés mais connus de lui ou de son écurie (phase 8c).
 * `ecurie` : seulement ceux qui concernent son écurie ; sinon, les faits publics marquants du paddock.
 */
export function faitsVisibles(m: Monde, portee: 'ecurie' | 'paddock', limite = 80): Evenement[] {
  const e = m.joueur?.ecurie ?? '';
  const moi = m.joueur?.personne ?? '';
  const nous = membres(m);
  const res: Evenement[] = [];
  const ids = Object.keys(m.evenements);
  for (let i = ids.length - 1; i >= 0 && res.length < limite; i--) {
    const ev = m.evenements[ids[i]!]!;
    if (!ev.texte) continue;
    const concerne = ev.acteurs.some((a) => a.id === e || nous.has(a.id));
    const connu = ev.visibilite === 'public'
      ? true
      : ev.acteurs.some((a) => a.id === moi || a.id === e) || ev.connuPar.includes(moi) || ev.connuPar.includes(e);
    if (!connu) continue;
    if (portee === 'ecurie' ? concerne : ev.visibilite === 'public' && ev.importance >= 3) res.push(ev);
  }
  return res;
}

/** Phase 13e : Grands Prix pour lesquels le joueur a choisi (regarder ou simuler) ; la partie ne s'y arrête plus. */
export const coursesDecidees = new Set<string>();

export type ArretAvance = 'course' | 'bloquante' | 'decision' | 'urgence' | 'derniere_chance' | 'marche' | 'grand_prix' | 'fin_de_saison' | 'fin_de_partie' | 'limite' | 'semaine';

/**
 * Avance le temps semaine par semaine, en rendant la main à l'écran entre deux semaines (calcul par tranches, D-147).
 * S'arrête sur une nouvelle décision, un Grand Prix couru (si demandé), la fin de saison, ou la fin de partie.
 */
export async function avancer(p: Partie, mode: 'semaine' | 'grand_prix' | 'decision', surProgression: (semaines: number) => void, max = 52): Promise<{ arret: ArretAvance; semaines: number; msParSemaine: number }> {
  const m = p.monde;
  // Audit 10.5 : la clé distingue aussi chaque conférence, offre et opération (deux décisions du même type ne se confondent plus).
  const cle = (d: DecisionEnAttente) => `${d.type}|${d.contrat ?? d.poste ?? ''}|${d.personne ?? ''}|${d.conference ?? d.offreSponsor ?? d.operation ?? ''}`;
  const depart = decisionsEnAttente(m);
  // D-168 : une demande bloquante attend une réponse (accepter, refuser ou « ne pas répondre ») : le temps n'avance pas.
  if (depart.some((d) => d.bloquante)) return { arret: 'bloquante', semaines: 0, msParSemaine: 0 };
  const avant = new Set(depart.map(cle));
  const urgentesAvant = new Set(depart.filter((d) => d.urgente).map(cle));
  // Audit de la phase 10 (arbitrage du porteur) : quel que soit le bouton, l'avance s'arrête la dernière semaine avant une échéance.
  const derniereChance = (d: DecisionEnAttente) => !!d.echeance && rangSemaine(d.echeance) - rangSemaine(m.date) <= 1;
  const derniereChanceAvant = new Set(depart.filter(derniereChance).map(cle));
  const gpAvant = grandsPrix(m).filter((g) => g.termine).length;
  let n = 0;
  let total = 0;
  while (n < max) {
    // Phase 13e : la semaine d'un Grand Prix, on s'arrête avant la course pour proposer de la regarder en direct (une fois par Grand Prix).
    const g = prochainGP(m);
    if (g && g.semaine === m.date.semaine && !coursesDecidees.has(g.id)) return { arret: 'course', semaines: n, msParSemaine: n ? total / n : 0 };
    const t0 = performance.now();
    const annee = m.date.annee;
    p.moteur.avancerUneSemaine(m);
    total += performance.now() - t0;
    n++;
    surProgression(n);
    if (m.joueur?.etat === 'licencie') return { arret: 'fin_de_partie', semaines: n, msParSemaine: total / n };
    if (mode === 'semaine') return { arret: 'semaine', semaines: n, msParSemaine: total / n };
    if (m.date.annee !== annee || m.date.semaine === 50) return { arret: 'fin_de_saison', semaines: n, msParSemaine: total / n };
    const maintenant = decisionsEnAttente(m);
    if (maintenant.some((d) => d.bloquante)) return { arret: 'bloquante', semaines: n, msParSemaine: total / n };
    if (maintenant.some((d) => derniereChance(d) && !derniereChanceAvant.has(cle(d)))) return { arret: 'derniere_chance', semaines: n, msParSemaine: total / n };
    if (maintenant.some((d) => !avant.has(cle(d)))) return { arret: 'decision', semaines: n, msParSemaine: total / n };
    if (mode === 'grand_prix' && m.date.annee === annee && grandsPrix(m).filter((g) => g.termine).length > gpAvant) return { arret: 'grand_prix', semaines: n, msParSemaine: total / n };
    // Une décision déjà connue dont l'échéance approche : on s'arrête aussi (le joueur ne la laisse pas filer sans le savoir).
    if (maintenant.some((d) => d.urgente && !urgentesAvant.has(cle(d)))) return { arret: 'urgence', semaines: n, msParSemaine: total / n };
    if (m.date.semaine === FENETRE.debut && !iaDecide(ecurieJoueur(m)!, 'pilotes')) return { arret: 'marche', semaines: n, msParSemaine: total / n };
    // Rendre la main au navigateur : l'écran reste réactif pendant le calcul.
    await new Promise((r) => setTimeout(r, 0));
  }
  return { arret: 'limite', semaines: n, msParSemaine: total / n };
}

export const r1 = (x: number) => Math.round(x * 10) / 10;
export const meur = (x: number) => `${r1(x).toLocaleString('fr-FR')} M€`;

/**
 * Page de mesure (D-110) : simule des semaines sur une copie du monde (la partie n'avance pas) et rend une ligne lisible.
 * Utilisable depuis une partie (Réglages) ou depuis l'accueil (monde de test).
 */
export async function mesurerAppareil(p: Partie, semaines: number): Promise<string> {
  await new Promise((r) => setTimeout(r, 30));
  const copie = copierMonde(p.monde);
  const t0 = performance.now();
  const temps: number[] = [];
  for (let i = 0; i < semaines; i++) {
    const a = performance.now();
    p.moteur.avancerUneSemaine(copie);
    temps.push(performance.now() - a);
    if (i % 4 === 3) await new Promise((r) => setTimeout(r, 0));
  }
  const total = performance.now() - t0;
  temps.sort((x, y) => x - y);
  const taille = new Blob([serialiser(p.monde)]).size;
  const comp = (await exporter(p.monde)).size;
  return `${semaines} semaines en ${(total / 1000).toFixed(1)} s · médiane ${temps[Math.floor(semaines / 2)]!.toFixed(0)} ms, pire ${temps[semaines - 1]!.toFixed(0)} ms par semaine · saison estimée ${((total / semaines) * 52 / 1000).toFixed(1)} s · sauvegarde ${(taille / 1048576).toFixed(1)} Mo (${(comp / 1048576).toFixed(2)} Mo compressés) · ${navigator.userAgent.includes('Mobile') ? 'appareil mobile' : 'ordinateur'}`;
}
