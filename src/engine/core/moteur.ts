/**
 * Boucle de simulation (voir docs/architecture.md §4).
 *
 * Un pas = une semaine (D-028). À chaque pas :
 *   1. les commandes extérieures en file sont appliquées (et journalisées) ;
 *   2. les rendez-vous de la semaine sont extraits de l'agenda ;
 *   3. les systèmes s'exécutent, TOUJOURS dans le même ordre ;
 *   4. la date avance. Au changement d'année, le journal des événements est compacté.
 */

import { ajouterSemaines, comparerDates, datesEgales, phaseDe, rangSemaine, type DateJeu, type PhaseSaison } from './calendrier';
import { RegistreCommandes, type Commande, type ResultatCommande } from './commandes';
import { compacterJournal, type BilanCompactage } from './evenements';
import { etatInitialFlux, Flux } from './hasard';
import { nouvelIdentifiant } from './identifiants';
import type { CommandeJournalisee, Monde, RendezVous } from './monde';

export interface ContexteSysteme {
  monde: Monde;
  date: DateJeu;
  phase: PhaseSaison;
  /** Rendez-vous échus cette semaine (tous systèmes confondus, triés). */
  rendezVous: readonly RendezVous[];
  /** Flux de hasard propre à un nom (en général, celui du système). */
  flux(nom: string): Flux;
  /** Exécute une commande de l'IA, avec les mêmes règles que pour le joueur. */
  commanderIA(commande: Omit<Commande, 'source'>): ResultatCommande;
}

export interface Systeme {
  nom: string;
  /** Phases où le système s'exécute. Absent = toutes. */
  phases?: readonly PhaseSaison[];
  executer(ctx: ContexteSysteme): void;
}

/** Fournit des identifiants d'événements à ne pas supprimer (ex. : cités par des souvenirs). */
export type ProtecteurEvenements = (monde: Monde) => Iterable<string>;

/** Accès à un flux de hasard du monde (créé à la première utilisation). */
export function flux(monde: Monde, nom: string): Flux {
  let etat = monde.flux[nom];
  if (!etat) {
    etat = etatInitialFlux(monde.graine, nom);
    monde.flux[nom] = etat;
  }
  return new Flux(etat);
}

/** Ajoute un rendez-vous à l'agenda. */
export function planifier(monde: Monde, date: DateJeu, type: string, donnees: Record<string, unknown> = {}): string {
  if (comparerDates(date, monde.date) < 0) throw new Error(`Rendez-vous dans le passé : ${type}`);
  const id = nouvelIdentifiant(monde, 'rdv');
  monde.agenda.push({ id, date: { ...date }, type, donnees });
  return id;
}

export class Moteur {
  private readonly systemes: Systeme[] = [];
  private readonly protecteurs: ProtecteurEvenements[] = [];
  readonly commandes = new RegistreCommandes();
  /** Dernier bilan de compactage (diagnostic). */
  dernierCompactage: BilanCompactage | null = null;

  ajouterSysteme(s: Systeme): this {
    if (this.systemes.some((x) => x.nom === s.nom)) throw new Error(`Système déjà présent : ${s.nom}`);
    this.systemes.push(s);
    return this;
  }

  ajouterProtecteur(p: ProtecteurEvenements): this {
    this.protecteurs.push(p);
    return this;
  }

  get nomsSystemes(): string[] {
    return this.systemes.map((s) => s.nom);
  }

  /** Avance d'une semaine. Renvoie les motifs des commandes extérieures refusées. */
  avancerUneSemaine(monde: Monde): string[] {
    const refus: string[] = [];

    // 1. Commandes extérieures en file.
    const file = monde.fileCommandes;
    monde.fileCommandes = [];
    for (const commande of file) {
      const r = this.commandes.executer(monde, commande);
      monde.journalCommandes.push({ date: { ...monde.date }, commande });
      if (!r.ok) refus.push(r.motif);
    }

    // 2. Rendez-vous échus.
    const maintenant = rangSemaine(monde.date);
    const echus = monde.agenda
      .filter((r) => rangSemaine(r.date) <= maintenant)
      .sort((a, b) => rangSemaine(a.date) - rangSemaine(b.date) || (a.id < b.id ? -1 : 1));
    if (echus.length > 0) {
      const ids = new Set(echus.map((r) => r.id));
      monde.agenda = monde.agenda.filter((r) => !ids.has(r.id));
    }

    // 3. Systèmes, dans l'ordre.
    const phase = phaseDe(monde.date);
    const ctx: ContexteSysteme = {
      monde,
      date: { ...monde.date },
      phase,
      rendezVous: echus,
      flux: (nom) => flux(monde, nom),
      commanderIA: (c) => this.commandes.executer(monde, { ...c, source: 'ia' }),
    };
    for (const s of this.systemes) {
      if (s.phases && !s.phases.includes(phase)) continue;
      s.executer(ctx);
    }

    // 4. Avancée de la date ; compactage au changement d'année.
    const avant = monde.date.annee;
    monde.date = ajouterSemaines(monde.date, 1);
    if (monde.date.annee !== avant) {
      const proteges = new Set<string>();
      for (const p of this.protecteurs) for (const id of p(monde)) proteges.add(id);
      this.dernierCompactage = compacterJournal(monde, proteges);
    }
    return refus;
  }

  avancer(monde: Monde, semaines: number): string[] {
    const refus: string[] = [];
    for (let i = 0; i < semaines; i++) refus.push(...this.avancerUneSemaine(monde));
    return refus;
  }

  /**
   * Rejoue une partie : à partir du monde initial (recréé avec la même graine),
   * réinjecte chaque commande journalisée à sa date, jusqu'à la date cible.
   */
  rejouer(mondeInitial: Monde, journal: readonly CommandeJournalisee[], dateCible: DateJeu): Monde {
    const monde = mondeInitial;
    const parDate = [...journal];
    while (comparerDates(monde.date, dateCible) < 0) {
      while (parDate.length > 0 && datesEgales((parDate[0] as CommandeJournalisee).date, monde.date)) {
        monde.fileCommandes.push(structuredClone((parDate.shift() as CommandeJournalisee).commande));
      }
      this.avancerUneSemaine(monde);
    }
    // Audit (1.2) : une commande journalisée à la date cible elle-même a été exécutée tout de suite dans la partie d'origine (commande
    // du joueur entre deux semaines) : on l'exécute de même, sans la journaliser une seconde fois.
    while (parDate.length > 0 && datesEgales((parDate[0] as CommandeJournalisee).date, monde.date)) {
      const c = structuredClone((parDate.shift() as CommandeJournalisee).commande);
      if (this.commandes.executer(monde, c).ok) monde.journalCommandes.push({ date: { ...monde.date }, commande: c });
    }
    return monde;
  }
}

/**
 * Tirage LOCAL (D-057) : un flux de hasard déterminé uniquement par la graine du monde et une clé
 * (système, date, entité, événement…). Il n'est pas stocké et ne dépend pas des tirages précédents :
 * un tirage de plus ailleurs ne décale jamais ce résultat. Indispensable aux tests contrefactuels précis.
 * Exemple : tirageLocal(monde, 'resultats', 'gp_2027_03', 'per_leclerq', 'abandon').
 */
export function tirageLocal(monde: Monde, ...cles: (string | number)[]): Flux {
  return new Flux(etatInitialFlux(monde.graine, `local|${cles.join('|')}`));
}
