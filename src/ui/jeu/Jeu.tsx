/**
 * Phase 10 — interface du joueur (docs/systemes/phase-10-joueur.md) : mobile d'abord, utilisable sur ordinateur.
 * Le diagnostic reste accessible à l'adresse #diagnostic.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { creerScenarioGrille2026, decisionsEnAttente, ecuriesActives, financesDe, formaterDate, plafond, type DecisionEnAttente, type Scenario } from '../../engine';
import { fichiersGrille2026 } from '../donnees';
import { chargerAvecSecours, copier, demanderStockagePersistant, enregistrer, existe } from '../../platform/navigateur/stockage';
import { avancer, commander, mesurerAppareil, ecurieJoueur, faitsVisibles, grandsPrix, meur, nom, nomCircuit, nomEcurie, personne, prochainGP, saisonCourante, type ArretAvance, type Partie } from './partie';
import { EcranEquipe, EcranMarche, FichePersonne } from './Equipe';
import { EcranActualites, EcranArchives, Image } from './Medias';
import { EcranChampionnat, EcranDirection, EcranFinances, EcranReglages, EcranTechnique } from './Gestion';
import { EcranCircuits } from './Circuits';
import './jeu.css';

export type Ecran = 'tableau' | 'actualites' | 'equipe' | 'marche' | 'technique' | 'finances' | 'championnat' | 'circuits' | 'archives' | 'direction' | 'reglages';
/** Sur téléphone, les 4 premiers écrans sont dans la barre du bas ; les autres derrière « Plus ». */
const PRINCIPAUX = 4;
const NAV: [Ecran, string, string][] = [
  ['tableau', 'Accueil', '◉'], ['actualites', 'Actualités', '✉'], ['equipe', 'Équipe', '☰'], ['marche', 'Marché', '⇄'], ['technique', 'Technique', '⚙'],
  ['finances', 'Finances', '€'], ['championnat', 'Championnat', '🏁'], ['circuits', 'Circuits', '◎'], ['archives', 'Archives', '★'], ['direction', 'Direction', '⚖'], ['reglages', 'Réglages', '⋯'],
];
export const NOM_SAUVEGARDE = 'partie-joueur';
/** Audit de la phase 10 : partie remplacée par une nouvelle, conservée et récupérable. */
export const NOM_ANCIENNE = 'partie-joueur-ancienne';

let scenario: Scenario | null = null;
const sc = () => (scenario ??= creerScenarioGrille2026(fichiersGrille2026()));

export interface Navigation {
  aller: (e: Ecran) => void;
  ouvrirPersonne: (id: string) => void;
  rafraichir: () => void;
}

export function Jeu() {
  const partie = useRef<Partie | null>(null);
  const [, setVersion] = useState(0);
  const [ecran, setEcran] = useState<Ecran>('tableau');
  const [fiche, setFiche] = useState<string | null>(null);
  const [calcul, setCalcul] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [plus, setPlus] = useState(false);
  const rafraichir = () => setVersion((v) => v + 1);
  const nav: Navigation = {
    aller: (e) => { setFiche(null); setEcran(e); setPlus(false); window.scrollTo(0, 0); },
    ouvrirPersonne: (id) => { setFiche(id); window.scrollTo(0, 0); },
    rafraichir,
  };

  const p = partie.current;
  if (!p || !p.monde.joueur) {
    return <Accueil demarrer={(x, msg) => { partie.current = x; setEcran('tableau'); setMessage(msg ?? null); rafraichir(); window.scrollTo(0, 0); }} />;
  }

  const lancer = async (mode: 'semaine' | 'grand_prix' | 'decision') => {
    setMessage(null);
    setCalcul('Simulation…');
    const r = await avancer(p, mode, (n) => setCalcul(`Simulation… ${n} semaine(s)`));
    setCalcul(null);
    const textes: Record<ArretAvance, string> = {
      bloquante: '❗ Une demande attend votre réponse : répondez-y (ou choisissez « ne pas répondre ») pour continuer.', decision: 'Arrêt : une décision vous attend.', urgence: 'Arrêt : l’échéance d’une décision approche.', derniere_chance: 'Arrêt : dernière semaine pour répondre à une décision.', marche: 'Le marché des transferts est ouvert.',
      grand_prix: 'Grand Prix couru.', fin_de_saison: 'Fin de saison.',
      fin_de_partie: 'Le conseil vous a remplacé.', limite: 'Une saison s’est écoulée.', semaine: '',
    };
    setMessage(textes[r.arret] || null);
    // Audit 10.10 : un échec de la sauvegarde automatique est signalé (avant : ignoré en silence).
    if (r.arret === 'fin_de_saison' || r.arret === 'fin_de_partie') void enregistrer(NOM_SAUVEGARDE, p.monde).catch((x) => setMessage(`Sauvegarde automatique impossible : ${x instanceof Error ? x.message : String(x)}. Libérez de l’espace puis sauvegardez dans Réglages.`));
    rafraichir();
  };

  if (p.monde.joueur.etat === 'licencie') return <FinDePartie partie={p} recommencer={() => { partie.current = null; rafraichir(); }} />;

  const e = ecurieJoueur(p.monde)!;
  return (
    <div class="jeu">
      <header class="jeu-entete">
        <span class="marque" />
        <div class="jeu-titre">
          <strong>{e.nom}</strong>
          <span class="muted">{formaterDate(p.monde.date)}</span>
        </div>
        <div class="jeu-avance">
          <button class="btn reglages" onClick={() => nav.aller('reglages')} title="Réglages : sauvegarde, import, mesure des performances" aria-label="Réglages">⚙</button>
          <button class="btn" disabled={!!calcul} onClick={() => lancer('semaine')} title="Avancer d'une semaine">+1 sem.</button>
          <button class="btn principal" disabled={!!calcul} onClick={() => lancer('decision')} title="Avancer jusqu'à la prochaine décision">Continuer ▸</button>
        </div>
      </header>
      {(calcul || message) && <div class={`jeu-bandeau ${calcul ? 'calcul' : ''}`}>{calcul ?? message}</div>}
      <nav class={`jeu-nav ${plus ? 'ouvert' : ''}`}>
        {NAV.map(([id, lib, ic], i) => (
          <button key={id} class={`${ecran === id && !fiche ? 'actif' : ''} ${i >= PRINCIPAUX ? 'secondaire' : ''}`} onClick={() => nav.aller(id)}>
            <span class="ic">{ic}</span><span class="lib">{lib}</span>
          </button>
        ))}
        <button class={`plus ${NAV.slice(PRINCIPAUX).some(([id]) => id === ecran) && !fiche ? 'actif' : ''}`} onClick={() => setPlus(!plus)}>
          <span class="ic">⋯</span><span class="lib">Plus</span>
        </button>
      </nav>
      <main class="jeu-page">
        {fiche ? <FichePersonne partie={p} id={fiche} nav={nav} retour={() => setFiche(null)} /> : (
          <>
            {ecran === 'tableau' && <TableauDeBord partie={p} nav={nav} lancer={lancer} occupe={!!calcul} />}
            {ecran === 'actualites' && <EcranActualites partie={p} nav={nav} />}
            {ecran === 'archives' && <EcranArchives partie={p} />}
            {ecran === 'equipe' && <EcranEquipe partie={p} nav={nav} />}
            {ecran === 'marche' && <EcranMarche partie={p} nav={nav} />}
            {ecran === 'technique' && <EcranTechnique partie={p} nav={nav} />}
            {ecran === 'finances' && <EcranFinances partie={p} nav={nav} />}
            {ecran === 'championnat' && <EcranChampionnat partie={p} />}
            {ecran === 'circuits' && <EcranCircuits partie={p} />}
            {ecran === 'direction' && <EcranDirection partie={p} nav={nav} />}
            {ecran === 'reglages' && <EcranReglages partie={p} nav={nav} quitter={() => { partie.current = null; rafraichir(); }} remplacer={(m) => { partie.current = { monde: m, moteur: sc().creerMoteur() }; setMessage('Partie importée. Sauvegardez-la dans Réglages pour la garder.'); nav.aller('tableau'); }} />}
          </>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ Accueil */

function Accueil({ demarrer }: { demarrer: (p: Partie, message?: string) => void }) {
  const [etape, setEtape] = useState<'menu' | 'choix' | 'preparation'>('menu');
  const [graine, setGraine] = useState(String(1 + Math.floor(Math.random() * 99999)));
  const [prenom, setPrenom] = useState('');
  const [nomManager, setNomManager] = useState('');
  const [choix, setChoix] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const apercu = useRef<Partie | null>(null);
  const [mesure, setMesure] = useState<string | null>(null);
  const [existante, setExistante] = useState(false);
  const [ancienne, setAncienne] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  useEffect(() => {
    void existe(NOM_SAUVEGARDE).then(setExistante).catch(() => undefined);
    void existe(NOM_ANCIENNE).then(setAncienne).catch(() => undefined);
  }, []);
  /** Mesure des performances depuis l'accueil (monde de test de la graine choisie ; aucune partie n'est créée ni sauvegardée). */
  const mesurerIci = async () => {
    setMesure('Mesure en cours… (préparation du monde, puis 8 semaines)');
    await new Promise((r) => setTimeout(r, 30));
    const g = Number.parseInt(graine, 10);
    const p = { monde: sc().creerMonde(Number.isInteger(g) ? g : 1), moteur: sc().creerMoteur() };
    setMesure(await mesurerAppareil(p, 8));
  };

  const preparer = () => {
    setErreur(null);
    setEtape('preparation');
    setTimeout(() => {
      try {
        const g = Number.parseInt(graine, 10);
        apercu.current = { monde: sc().creerMonde(Number.isInteger(g) ? g : 1), moteur: sc().creerMoteur() };
        setEtape('choix');
      } catch (x) {
        setErreur(String(x));
        setEtape('menu');
      }
    }, 20);
  };
  const reprendre = async () => {
    setErreur(null);
    try {
      // Audit de la phase 10 : reprise par la sauvegarde de secours si la principale est illisible.
      const r = await chargerAvecSecours(NOM_SAUVEGARDE);
      if (!r) { setErreur('Aucune partie sauvegardée.'); return; }
      demarrer({ monde: r.monde, moteur: sc().creerMoteur() }, r.depuisSecours
        ? `Partie récupérée depuis la sauvegarde de secours : la sauvegarde principale était illisible (${r.erreur ?? 'erreur inconnue'}). Vérifiez la partie, puis sauvegardez-la dans Réglages.`
        : undefined);
    } catch (x) {
      setErreur(`Sauvegardes illisibles (principale et secours) : ${x instanceof Error ? x.message : String(x)}`);
    }
  };
  /**
   * Audit de la phase 10 (arbitrage du porteur) : une nouvelle partie ne détruit jamais l'ancienne sans confirmation ;
   * la partie remplacée est gardée dans l'emplacement « ancienne partie », récupérable depuis l'accueil.
   */
  const valider = async (confirme = false) => {
    const p = apercu.current;
    if (!p || !choix) return;
    if (!confirme && existante) { setConfirmation(true); return; }
    const r = commander(p, 'joueur.prendre_ecurie', { ecurie: choix, prenom, nom: nomManager });
    if (!r.ok) { setErreur(r.motif); return; }
    // Audit 10.10 : le message « conservée » n'est affiché que si la copie a vraiment réussi ; stockage persistant demandé.
    void demanderStockagePersistant();
    const conservee = existante ? await copier(NOM_SAUVEGARDE, NOM_ANCIENNE).catch(() => false) : false;
    const enregistree = await enregistrer(NOM_SAUVEGARDE, p.monde).then(() => true, () => false);
    demarrer(p, [existante ? (conservee ? 'Nouvelle partie commencée. La précédente est conservée : « Reprendre l’ancienne partie » sur l’accueil.' : 'Nouvelle partie commencée, mais la précédente n’a pas pu être mise de côté.') : '',
      enregistree ? '' : 'Attention : la nouvelle partie n’a pas pu être sauvegardée (espace de stockage ?).'].filter(Boolean).join(' ') || undefined);
  };
  /** Reprend l'ancienne partie : les deux emplacements sont échangés (la partie reprise redevient la principale). */
  const reprendreAncienne = async () => {
    setErreur(null);
    try {
      const r = await chargerAvecSecours(NOM_ANCIENNE);
      if (!r) { setErreur('Aucune ancienne partie.'); return; }
      await copier(NOM_SAUVEGARDE, `${NOM_SAUVEGARDE}::echange`);
      await copier(NOM_ANCIENNE, NOM_SAUVEGARDE);
      await copier(`${NOM_SAUVEGARDE}::echange`, NOM_ANCIENNE);
      demarrer({ monde: r.monde, moteur: sc().creerMoteur() }, 'Ancienne partie reprise ; l’autre partie devient à son tour l’« ancienne partie ».');
    } catch (x) {
      setErreur(`Ancienne partie illisible : ${x instanceof Error ? x.message : String(x)}`);
    }
  };

  return (
    <div class="jeu">
      <header class="jeu-entete"><span class="marque" /><div class="jeu-titre"><strong>APEX Manager</strong><span class="muted">nom de travail</span></div></header>
      <main class="jeu-page">
        {etape === 'menu' && (
          <div class="carte">
            <h2 style={{ marginTop: 0 }}>Prendre la tête d’une écurie</h2>
            <p class="muted">Départ en 2027, avec une grille inspirée de 2026 et un paddock qui partage déjà un passé. Noms altérés, personnalités fictives.</p>
            <label class="champ">Graine du monde <input class="num" value={graine} onInput={(x) => setGraine((x.target as HTMLInputElement).value)} /></label>
            <div class="actions">
              <button class="btn principal" onClick={preparer}>Nouvelle partie</button>
              <button class="btn" onClick={reprendre}>Reprendre la partie</button>
              {ancienne && <button class="btn" onClick={reprendreAncienne}>Reprendre l’ancienne partie</button>}
              <a class="btn" href="#diagnostic">Diagnostic</a>
            </div>
            <div class="actions">
              <button class="btn" disabled={!!mesure && mesure.startsWith('Mesure en cours')} onClick={mesurerIci}>Mesurer les performances de cet appareil</button>
            </div>
            {mesure && <p class="num petit" role="status">{mesure}</p>}
            {erreur && <p class="erreur">{erreur}</p>}
          </div>
        )}
        {etape === 'preparation' && <div class="carte">Préparation du monde (histoire 2010–2026)…</div>}
        {etape === 'choix' && apercu.current && (
          <>
            <div class="carte">
              <h2 style={{ marginTop: 0 }}>Votre manager</h2>
              <div class="ligne-champs">
                <label class="champ">Prénom <input value={prenom} maxLength={30} onInput={(x) => setPrenom((x.target as HTMLInputElement).value)} /></label>
                <label class="champ">Nom <input value={nomManager} maxLength={30} onInput={(x) => setNomManager((x.target as HTMLInputElement).value)} /></label>
              </div>
            </div>
            <h3>{sc().departs ? 'Choisir votre départ' : 'Choisir une écurie'}</h3>
            <div class="liste-cartes">
              {/* D-185 : en V1, le joueur choisit un mode de départ (données : departs.csv) ; l'écurie est imposée par ce mode. */}
              {sc().departs?.map((d) => {
                const m = apercu.current!.monde;
                const e = ecuriesActives(m).find((x) => x.id === d.ecurie);
                if (!e) return null;
                const fi = financesDe(m, e.id);
                return (
                  <button key={d.mode} class={`carte-choix ${choix === e.id ? 'actif' : ''}`} onClick={() => setChoix(e.id)}>
                    <strong>{d.libelle} : {e.nom}</strong>
                    <span class="muted">{d.description}</span>
                    <span class="muted">Budget {meur(e.budgetMEUR)}{fi ? ` · trésorerie ${meur(fi.tresorerieMEUR)}` : ''}</span>
                  </button>
                );
              })}
              {!sc().departs && ecuriesActives(apercu.current.monde).sort((a, b) => b.prestige - a.prestige).map((e) => {
                const m = apercu.current!.monde;
                const fi = financesDe(m, e.id);
                return (
                  <button key={e.id} class={`carte-choix ${choix === e.id ? 'actif' : ''}`} onClick={() => setChoix(e.id)}>
                    <strong>{e.nom}</strong>
                    <span class="muted">Prestige {e.prestige}/20 · budget {meur(e.budgetMEUR)}{fi ? ` · trésorerie ${meur(fi.tresorerieMEUR)}` : ''}</span>
                    <span class="muted">Attentes du conseil : {e.toleranceConseil >= 14 ? 'patient' : e.toleranceConseil >= 9 ? 'exigeant' : 'très exigeant'}</span>
                  </button>
                );
              })}
            </div>
            <div class="actions collant">
              <button class="btn" onClick={() => setEtape('menu')}>Retour</button>
              <button class="btn principal" disabled={!choix || !prenom.trim() || !nomManager.trim()} onClick={() => void valider()}>Prendre la tête de l’écurie</button>
            </div>
            {confirmation && (
              <div class="carte attention" role="alertdialog">
                <p><strong>Une partie est déjà sauvegardée.</strong> Elle ne sera pas perdue : elle devient l’« ancienne partie », récupérable depuis l’accueil. Une seule ancienne partie est gardée.</p>
                <div class="actions">
                  <button class="btn principal" onClick={() => { setConfirmation(false); void valider(true); }}>Confirmer et commencer</button>
                  <button class="btn" onClick={() => setConfirmation(false)}>Annuler</button>
                </div>
              </div>
            )}
            {erreur && <p class="erreur">{erreur}</p>}
          </>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ Tableau de bord */

const LIB_DECISION: Record<DecisionEnAttente['type'], string> = {
  contre_offre: 'Négociation', augmentation: 'Augmentation', depart: 'Départ', fin_contrat: 'Contrat',
  poste_vacant: 'Recrutement', offre_marche: 'Marché', vote_reglement: 'Règlement', election: 'Fédération', vote_federation: 'Fédération', conference: 'Presse',
  offre_sponsor: 'Sponsor', operation_sponsor: 'Sponsor', dilemme_technique: 'Technique',
};

function cibleDecision(d: DecisionEnAttente, nav: Navigation) {
  if (d.type === 'offre_sponsor' || d.type === 'operation_sponsor') return () => nav.aller('finances');
  if (d.type === 'dilemme_technique') return () => nav.aller('technique');
  if (d.personne && d.type !== 'offre_marche' && d.type !== 'conference') return () => nav.ouvrirPersonne(d.personne!);
  if (d.type === 'poste_vacant' || d.type === 'offre_marche') return () => nav.aller('marche');
  if (d.type === 'conference') return () => nav.aller('actualites');
  return () => nav.aller('direction');
}

function TableauDeBord({ partie, nav, lancer, occupe }: { partie: Partie; nav: Navigation; lancer: (m: 'semaine' | 'grand_prix' | 'decision') => void; occupe: boolean }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const decisions = decisionsEnAttente(m);
  const s = saisonCourante(m);
  const rangC = s ? s.constructeurs.findIndex((x) => x.ecurie === e.id) + 1 : 0;
  const lignesPilotes = s ? s.pilotes.map((l, i) => ({ ...l, rang: i + 1 })).filter((l) => l.ecurie === e.id) : [];
  const fi = financesDe(m, e.id);
  const gp = prochainGP(m);
  const derniers = grandsPrix(m).filter((g) => g.termine).slice(-1)[0];
  return (
    <>
      <div class="grille">
        <div class="carte">
          <h3>Championnat {m.date.annee}</h3>
          {s ? (
            <>
              <p class="grand">{rangC ? `${rangC}${rangC === 1 ? 're' : 'e'}` : '—'} <span class="muted">constructeurs · {s.constructeurs.find((x) => x.ecurie === e.id)?.points ?? 0} pts</span></p>
              {lignesPilotes.map((l) => <p key={l.pilote} class="muted">{nom(personne(m, l.pilote))} : {l.rang}e, {l.points} pts</p>)}
            </>
          ) : <p class="muted">La saison n’a pas commencé.</p>}
        </div>
        <div class="carte">
          <h3>Prochain Grand Prix</h3>
          {gp ? <p>{nomCircuit(m, gp.circuit)} <span class="muted">· manche {gp.manche}, semaine {gp.semaine}</span></p> : <p class="muted">{grandsPrix(m).length ? 'Aucun d’ici la fin de saison.' : 'Le calendrier de la saison sera publié la semaine prochaine.'}</p>}
          {derniers && <p class="muted">Dernier : {nomCircuit(m, derniers.circuit)}, vainqueur {nom(personne(m, derniers.resultats.find((r) => r.position === 1)?.pilote ?? ''))}</p>}
          {/* Phase 13a : la course de vos pilotes (place, stratégie, arrêts). */}
          {derniers && derniers.resultats.filter((r) => r.ecurie === e.id).map((r) => (
            <p key={r.pilote} class="muted petit">{nom(personne(m, r.pilote))} : {r.position ? `${r.position}e` : `abandon (${r.abandon === 'mecanique' ? 'panne' : r.abandon === 'carburant' ? 'panne sèche' : 'incident'})`}
              {r.explication?.grille ? ` · parti ${r.explication.grille}e${r.explication.depassements ? `, ${r.explication.depassements} dépassement${r.explication.depassements > 1 ? 's' : ''}` : ''}` : ''}
              {r.explication?.strategie ? ` · ${r.explication.strategie.split('-').map((x) => ({ T: 'tendre', M: 'moyen', D: 'dur', P: 'pluie' })[x] ?? x).join(' → ')} (${r.explication.strategie.split('-').length - 1} arrêt${r.explication.strategie.split('-').length > 2 ? 's' : ''})` : ''}</p>
          ))}
          <button class="btn" disabled={occupe || !gp} onClick={() => lancer('grand_prix')}>Jusqu’au Grand Prix ▸</button>
        </div>
        <div class="carte" onClick={() => nav.aller('finances')} style={{ cursor: 'pointer' }}>
          <h3>Finances</h3>
          {fi && <p>Trésorerie <strong>{meur(fi.tresorerieMEUR)}</strong></p>}
          {fi && <p class="muted">Développement {meur(fi.budget.developpementMEUR)} · plafond {meur(plafond(m))}{fi.detteMEUR > 0 ? ` · dette ${meur(fi.detteMEUR)}` : ''}</p>}
          <p class="muted petit">Image publique : <Image v={e.image} /></p>
        </div>
      </div>
      <div class="carte">
        <h3>Décisions en attente {decisions.length > 0 && <span class="badge">{decisions.length}</span>}</h3>
        {decisions.length === 0 ? <p class="muted">Rien ne vous attend. Les domaines délégués sont gérés par votre équipe.</p> : (
          <ul class="liste-decisions">
            {decisions.map((d, i) => (
              <li key={i} class={d.bloquante ? 'bloquante' : d.urgente ? 'urgente' : ''} onClick={cibleDecision(d, nav)}>
                <span class="etiquette">{d.bloquante ? '❗ ' : ''}{LIB_DECISION[d.type] ?? d.type}</span>
                <div>
                  <strong>{d.titre}</strong>
                  <div class="muted">{d.detail}</div>
                  <div class="muted petit">{d.echeance ? `Avant la semaine ${d.echeance.semaine}. ` : ''}{d.consequence}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div class="carte">
        <h3>Dernières nouvelles de l’écurie</h3>
        <ListeFaits faits={faitsVisibles(m, 'ecurie', 6)} />
        <button class="btn" onClick={() => nav.aller('actualites')}>Actualités</button>
      </div>
    </>
  );
}

export function ListeFaits({ faits }: { faits: { id: string; date: { annee: number; semaine: number }; texte?: string; importance: number }[] }) {
  if (!faits.length) return <p class="muted">Aucun fait pour l’instant.</p>;
  return (
    <ul class="liste-faits">
      {faits.map((f) => <li key={f.id} class={f.importance >= 4 ? 'fort' : ''}><span class="muted petit">{f.date.annee} · sem. {f.date.semaine}</span> {f.texte}</li>)}
    </ul>
  );
}

function FinDePartie({ partie, recommencer }: { partie: Partie; recommencer: () => void }) {
  const m = partie.monde;
  const j = m.joueur!;
  const fin = j.evenementFin ? m.evenements[j.evenementFin] : undefined;
  const causes = fin?.causes.map((c) => m.evenements[c]).filter(Boolean) ?? [];
  return (
    <div class="jeu">
      <header class="jeu-entete"><span class="marque" /><div class="jeu-titre"><strong>Fin de partie</strong><span class="muted">{formaterDate(m.date)}</span></div></header>
      <main class="jeu-page">
        <div class="carte">
          <h2 style={{ marginTop: 0 }}>{fin?.texte ?? 'Vous avez quitté la tête de l’écurie.'}</h2>
          {causes.map((c) => <p key={c!.id} class="muted">Pourquoi : {c!.texte ?? c!.type}</p>)}
          <p>À la tête de {nomEcurie(m, j.ecurie)} depuis {j.depuis.annee}.</p>
          <p class="muted">Retrouver un poste dans une autre écurie viendra avec la phase 14 (carrière du manager).</p>
          <button class="btn principal" onClick={recommencer}>Nouvelle partie</button>
        </div>
      </main>
    </div>
  );
}
