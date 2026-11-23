/** Phase 10 — écrans Technique, Finances, Championnat, Direction et Réglages. */
import { useState } from 'preact/hooks';
import {
  budgetMaxJoueur, candidatsPresidence, copierMonde, ecuriesActives, profilTechnique, DOMAINES_DELEGATION, equipeStands, estDelegue, federation, financesDe, plafond, programmes,
  propositions, reglementEnVigueur, serialiser, table, TABLES, type DomaineJoueur, type Saison,
} from '../../engine';
import { DOMAINES, LISTE_DOMAINES, ORIENTATIONS, PROGRAMMES } from '../../engine/balance/technique';
import { ORIENTATIONS_STANDS } from '../../engine/balance/stands';
import { DEVELOPPEMENT_MINIMUM } from '../../engine/balance/finances';
import { enregistrer, exporter } from '../../platform/navigateur/stockage';
import { commander, ecurieJoueur, grandsPrix, meur, nom, nomCircuit, nomEcurie, personne, saisonCourante, type Partie } from './partie';
import type { Navigation } from './Jeu';
import { NOM_SAUVEGARDE } from './Jeu';

const pct = (x: number) => `${Math.round(x * 100)} %`;

function useRetour(): [string | null, (r: { ok: boolean; motif?: string }, succes?: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  return [msg, (r, succes) => setMsg(r.ok ? succes ?? 'C’est fait.' : `Impossible : ${(r as { motif: string }).motif}`)];
}

const LIB_DELEGATION: Record<DomaineJoueur, [string, string]> = {
  pilotes: ['Pilotes', 'Prolongations, marché des pilotes, réponses à leurs demandes'],
  personnel: ['Personnel', 'Recrutements, prolongations, demandes d’augmentation et de départ'],
  recherche: ['Recherche', 'Programmes de recherche (directeur technique)'],
  stands: ['Équipe des stands', 'Entraînement et recrutement (directeur sportif)'],
  academie: ['Académie', 'Places et missions de repérage'],
  politique: ['Politique', 'Votes du règlement et de la fédération, lobbying'],
};

function Delegation({ partie, domaine, nav }: { partie: Partie; domaine: DomaineJoueur; nav: Navigation }) {
  const e = ecurieJoueur(partie.monde)!;
  const actif = estDelegue(partie.monde, e, domaine);
  return (
    <label class="interrupteur">
      <input type="checkbox" checked={actif} onChange={() => { commander(partie, 'joueur.deleguer', { ecurie: e.id, domaine, actif: !actif }); nav.rafraichir(); }} />
      <span><strong>{LIB_DELEGATION[domaine][0]}</strong> : {actif ? 'délégué à votre équipe' : 'vous décidez'}<br /><span class="muted petit">{LIB_DELEGATION[domaine][1]}</span></span>
    </label>
  );
}

/* ------------------------------------------------------------------ Technique */

export function EcranTechnique({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [msg, noter] = useRetour();
  const actuel = reglementEnVigueur(m);
  const profil = profilTechnique(m, e.id); // lecture seule
  const nbEcuries = ecuriesActives(m).length;
  const progs = programmes(m, e.id);
  const eq = equipeStands(m, e.id);
  const deleguee = estDelegue(m, e, 'recherche');
  const [emplacement, setEmplacement] = useState(1);
  const [domaine, setDomaine] = useState<string>(LISTE_DOMAINES[0]!);
  const [horizon, setHorizon] = useState('actuelle');
  const [part, setPart] = useState('0.2');
  const futurs = (Object.values(table(m, TABLES.reglements)) as unknown as { id: string; statut: string; orientation: string; debut: number; connuPar?: string[] }[])
    .filter((r) => r.statut === 'propose' || r.statut === 'annonce' || (r.statut === 'brouillon' && (r.connuPar ?? []).includes(e.id)));
  return (
    <>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      <div class="carte">
        <h3>Savoir technique</h3>
        <p class="muted petit">Règlement en vigueur : {actuel ? `${ORIENTATIONS[actuel.orientation as keyof typeof ORIENTATIONS]?.libelle ?? 'règlement de départ'}, jusqu’en ${actuel.fin}` : '—'}.</p>
        <p class="muted petit">Votre rang parmi les {nbEcuries} écuries, domaine par domaine (savoir utile au règlement en vigueur ou annoncé).</p>
        <ul class="liste-faits">
          {profil.map((d) => <li key={d.domaine} class="ligne-rang"><span>{d.libelle}</span><span class={`num rang ${d.rang <= 3 ? 'bon' : d.rang > nbEcuries - 3 ? 'faible' : ''}`}>{d.rang}<sup>{d.rang === 1 ? 'er' : 'e'}</sup></span></li>)}
        </ul>
      </div>
      <div class="carte">
        <h3>Programmes de recherche</h3>
        <Delegation partie={partie} domaine="recherche" nav={nav} />
        {progs.length === 0 && <p class="muted">Aucun programme.</p>}
        <ul class="liste-faits">
          {progs.map((p) => <li key={p.id}>Emplacement {p.emplacement} : <strong>{DOMAINES[p.domaine as keyof typeof DOMAINES]?.libelle ?? p.domaine}</strong>, horizon {p.horizon === 'actuelle' ? 'voiture actuelle' : p.horizon === 'suivante' ? 'saison suivante' : 'futur règlement'}, {pct(p.part)} des moyens{p.statut === 'suspendu' ? ' (suspendu)' : ''}{p.remiseEnRoute > 0 ? `, remise en route ${p.remiseEnRoute} sem.` : ''}</li>)}
        </ul>
        {!deleguee && (
          <>
            <div class="ligne-champs">
              <label class="champ">Emplacement <select value={emplacement} onChange={(v) => setEmplacement(Number((v.target as HTMLSelectElement).value))}>{Array.from({ length: PROGRAMMES.emplacements }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label>
              <label class="champ">Domaine <select value={domaine} onChange={(v) => setDomaine((v.target as HTMLSelectElement).value)}>{LISTE_DOMAINES.map((d) => <option key={d} value={d}>{DOMAINES[d].libelle}</option>)}</select></label>
              <label class="champ">Horizon <select value={horizon} onChange={(v) => setHorizon((v.target as HTMLSelectElement).value)}>
                <option value="actuelle">Voiture actuelle</option><option value="suivante">Saison suivante</option>
                {futurs.map((r) => <option key={r.id} value={r.id}>Règlement {ORIENTATIONS[r.orientation as keyof typeof ORIENTATIONS]?.libelle ?? r.orientation} ({r.statut === 'brouillon' ? 'rumeur' : r.statut})</option>)}
              </select></label>
              <label class="champ">Part des moyens <select value={part} onChange={(v) => setPart((v.target as HTMLSelectElement).value)}>{[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35].map((x) => <option key={x} value={String(x)}>{pct(x)}</option>)}</select></label>
            </div>
            <div class="actions">
              <button class="btn principal" onClick={() => { noter(commander(partie, 'recherche.programme', { ecurie: e.id, emplacement, domaine, horizon, part: Number(part) }), 'Programme défini.'); nav.rafraichir(); }}>Définir le programme</button>
              <button class="btn" onClick={() => { noter(commander(partie, 'recherche.suspendre', { ecurie: e.id, emplacement }), 'Programme suspendu.'); nav.rafraichir(); }}>Suspendre</button>
            </div>
            <p class="muted petit">La recherche prend sur les moyens de développement de la voiture actuelle ({pct(PROGRAMMES.partTotaleMax)} au plus). Changer de domaine impose une remise en route.</p>
          </>
        )}
      </div>
      <div class="carte">
        <h3>Équipe des stands</h3>
        <Delegation partie={partie} domaine="stands" nav={nav} />
        {eq ? (
          <>
            <p>Rapidité <strong>{Math.round(eq.rapidite)}</strong>/{Math.round(eq.rapiditeMax)} · précision <strong>{Math.round(eq.precision)}</strong>/{Math.round(eq.precisionMax)} · cohésion {Math.round(eq.cohesion)} · fatigue {Math.round(eq.fatigue)}</p>
            <p class="muted petit">Plan : {eq.plan.orientation}, intensité {eq.plan.intensite}. Les arrêts aux stands compteront en course à partir de la phase 13.</p>
            {!estDelegue(m, e, 'stands') && (
              <div class="actions">
                {ORIENTATIONS_STANDS.map((o) => (['legere', 'normale', 'intensive'] as const).map((i) => (
                  <button key={o + i} class={`btn ${eq.plan.orientation === o && eq.plan.intensite === i ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'stands.plan', { ecurie: e.id, orientation: o, intensite: i }), 'Plan d’entraînement modifié.'); nav.rafraichir(); }}>{o} · {i}</button>
                )))}
              </div>
            )}
          </>
        ) : <p class="muted">L’équipe des stands sera constituée dans les prochaines semaines.</p>}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Finances */

export function EcranFinances({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const fi = financesDe(m, e.id);
  const [msg, noter] = useRetour();
  const [montant, setMontant] = useState(fi ? String(Math.round(fi.budget.developpementMEUR)) : '');
  if (!fi) return <div class="carte">Comptes indisponibles.</div>;
  const c = fi.comptes;
  const recettes = c.primes + c.commercial + c.apport + c.sponsors;
  const plafonnees = c.personnelPlafonne + c.departements + c.operations + c.entretien + c.developpement;
  return (
    <>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      <div class="carte">
        <h3>Situation</h3>
        <p>Trésorerie <strong>{meur(fi.tresorerieMEUR)}</strong>{fi.detteMEUR > 0 ? ` · dette ${meur(fi.detteMEUR)}` : ''} · état : {fi.etatCrise === 'sain' ? 'sain' : fi.etatCrise}</p>
        <p>Plafond budgétaire {meur(plafond(m))} · dépenses plafonnées depuis janvier {meur(plafonnees)}</p>
        <p class="muted">Recettes depuis janvier {meur(recettes)} (primes {meur(c.primes)}, commercial {meur(c.commercial)}, sponsors {meur(c.sponsors)}, propriétaire {meur(c.apport)})</p>
      </div>
      <div class="carte">
        <h3>Budget de développement {m.date.annee}</h3>
        <p>Actuel : <strong>{meur(fi.budget.developpementMEUR)}</strong> ({fi.budget.strategie === 'choix_du_team_principal' ? 'fixé par vous' : 'proposé par la direction financière'})</p>
        <label class="champ">Nouveau montant (M€/an, {DEVELOPPEMENT_MINIMUM} à {budgetMaxJoueur(m)})
          <input class="num" inputMode="decimal" value={montant} onInput={(v) => setMontant((v.target as HTMLInputElement).value)} />
        </label>
        <div class="actions"><button class="btn principal" onClick={() => { noter(commander(partie, 'budget.developpement', { ecurie: e.id, montant: Number(montant.replace(',', '.')) }), 'Budget modifié pour le reste de l’année.'); nav.rafraichir(); }}>Appliquer</button></div>
        <p class="muted petit">Plus de développement = une voiture qui progresse plus vite, mais une trésorerie qui baisse. Si la trésorerie de fin d’année devient négative, la direction financière coupe le développement (même règle que pour l’IA). Dépasser le plafond expose aux sanctions. Le budget est reproposé chaque mois de janvier.</p>
      </div>
      <div class="carte">
        <h3>Années précédentes</h3>
        {fi.historique.length === 0 ? <p class="muted">Aucun bilan pour l’instant.</p> : (
          <div class="defile"><table class="compact"><thead><tr><th>Année</th><th>Trésorerie fin</th><th>Plafonnées</th><th>Dépassement</th></tr></thead>
            <tbody>{fi.historique.slice(-5).reverse().map((h) => <tr key={h.annee}><td>{h.annee}</td><td class="num">{meur(h.tresorerieFin)}</td><td class="num">{meur(h.plafonnees)}</td><td class="num">{h.depassement > 0 ? meur(h.depassement) : '—'}</td></tr>)}</tbody>
          </table></div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Championnat */

export function EcranChampionnat({ partie }: { partie: Partie }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [vue, setVue] = useState<'pilotes' | 'constructeurs' | 'calendrier'>('constructeurs');
  const s: Saison | undefined = saisonCourante(m) ?? (table(m, TABLES.saisons)[`ssn_${m.date.annee - 1}`] as unknown as Saison | undefined);
  const gps = grandsPrix(m, s?.annee ?? m.date.annee);
  return (
    <>
      <div class="onglets">
        {(['constructeurs', 'pilotes', 'calendrier'] as const).map((v) => <button key={v} class={`btn ${vue === v ? 'actif' : ''}`} onClick={() => setVue(v)}>{v === 'calendrier' ? 'Calendrier' : v === 'pilotes' ? 'Pilotes' : 'Constructeurs'}</button>)}
      </div>
      <div class="carte">
        {!s ? <p class="muted">Pas encore de classement.</p> : vue === 'constructeurs' ? (
          <div class="defile"><table class="compact"><thead><tr><th>#</th><th>Écurie</th><th>Pts</th><th>V.</th></tr></thead>
            <tbody>{s.constructeurs.map((l, i) => <tr key={l.ecurie} class={l.ecurie === e.id ? 'moi' : ''}><td>{i + 1}</td><td>{nomEcurie(m, l.ecurie)}</td><td class="num">{l.points}</td><td class="num">{l.victoires}</td></tr>)}</tbody>
          </table></div>
        ) : vue === 'pilotes' ? (
          <div class="defile"><table class="compact"><thead><tr><th>#</th><th>Pilote</th><th>Pts</th><th>V.</th></tr></thead>
            <tbody>{s.pilotes.map((l, i) => <tr key={l.pilote} class={l.ecurie === e.id ? 'moi' : ''}><td>{i + 1}</td><td>{nom(personne(m, l.pilote))}<div class="muted petit">{nomEcurie(m, l.ecurie)}</div></td><td class="num">{l.points}</td><td class="num">{l.victoires}</td></tr>)}</tbody>
          </table></div>
        ) : (
          <ul class="liste-faits">
            {gps.map((g) => {
              const v = g.resultats.find((r) => r.position === 1);
              const miens = g.resultats.filter((r) => r.ecurie === e.id).map((r) => (r.position ? `P${r.position}` : 'abandon')).join(', ');
              return <li key={g.id}><strong>{g.manche}. {nomCircuit(m, g.circuit)}</strong> <span class="muted">sem. {g.semaine}{g.pluie ? ' · pluie' : ''}</span>{g.termine ? <div class="muted petit">Vainqueur {nom(personne(m, v?.pilote ?? ''))} · vos pilotes : {miens || '—'}</div> : null}</li>;
            })}
          </ul>
        )}
      </div>
      {s?.termine && s.chronique.length > 0 && <div class="carte"><h3>Chronique {s.annee}</h3><ul>{s.chronique.map((l) => <li key={l}>{l}</li>)}</ul></div>}
    </>
  );
}

/* ------------------------------------------------------------------ Direction */

export function EcranDirection({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [msg, noter] = useRetour();
  const props = propositions(m);
  const f = federation(m);
  const politiqueMoi = !estDelegue(m, e, 'politique');
  const election = f && m.date.annee === f.finMandat ? candidatsPresidence(m) : [];
  const [orientation, setOrientation] = useState<string>('aero');
  const [montant, setMontant] = useState('1');
  return (
    <>
      {msg && <div class="carte retour" role="status">{msg}</div>}
      <div class="carte">
        <h3>Délégations</h3>
        <p class="muted petit">Un domaine délégué est décidé par votre équipe, avec exactement les règles des écuries de l’IA. Vous pouvez reprendre la main à tout moment.</p>
        {DOMAINES_DELEGATION.map((d) => <Delegation key={d} partie={partie} domaine={d} nav={nav} />)}
      </div>
      <div class="carte">
        <h3>Fédération</h3>
        <p>Président : {f?.nomPresident ?? '—'}{f ? `, mandat jusqu’en ${f.finMandat}` : ''}</p>
        {!politiqueMoi && <p class="muted petit">Politique déléguée : votre écurie vote selon ses intérêts.</p>}
        {politiqueMoi && props.length > 0 && (
          <>
            <h4>Vote sur le prochain règlement</h4>
            <div class="actions">
              <button class={`btn ${props[0]!.votes?.[e.id] === 'prolongation' ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'reglement.vote', { ecurie: e.id, option: 'prolongation' }), 'Vote enregistré.'); nav.rafraichir(); }}>Prolonger le règlement actuel</button>
              {props.map((r) => <button key={r.id} class={`btn ${props[0]!.votes?.[e.id] === r.id ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'reglement.vote', { ecurie: e.id, option: r.id }), 'Vote enregistré.'); nav.rafraichir(); }}>{ORIENTATIONS[r.orientation as keyof typeof ORIENTATIONS]?.libelle ?? r.orientation} ({r.debut})</button>)}
            </div>
          </>
        )}
        {politiqueMoi && election.length > 1 && (
          <>
            <h4>Élection à la présidence</h4>
            <div class="actions">{election.map((c) => <button key={c.id} class={`btn ${f?.election?.votes[e.id] === c.id ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'federation.vote', { ecurie: e.id, candidat: c.id }), 'Vote enregistré.'); nav.rafraichir(); }}>{nom(c)}</button>)}</div>
          </>
        )}
        {politiqueMoi && f?.vote && f.vote.annee === m.date.annee && (
          <>
            <h4>Vote : {f.vote.sujet === 'plafondMEUR' ? 'plafond budgétaire' : f.vote.sujet === 'grandsPrix' ? 'nombre de Grands Prix' : 'restrictions aérodynamiques'} → {f.vote.valeur}</h4>
            <div class="actions">
              <button class={`btn ${f.vote.votes[e.id] === true ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'federation.vote', { ecurie: e.id, pour: true }), 'Vote enregistré.'); nav.rafraichir(); }}>Pour</button>
              <button class={`btn ${f.vote.votes[e.id] === false ? 'actif' : ''}`} onClick={() => { noter(commander(partie, 'federation.vote', { ecurie: e.id, pour: false }), 'Vote enregistré.'); nav.rafraichir(); }}>Contre</button>
            </div>
          </>
        )}
        {politiqueMoi && (
          <>
            <h4>Lobbying</h4>
            <div class="ligne-champs">
              <label class="champ">Orientation <select value={orientation} onChange={(v) => setOrientation((v.target as HTMLSelectElement).value)}>{Object.entries(ORIENTATIONS).map(([k, o]) => <option key={k} value={k}>{o.libelle}</option>)}</select></label>
              <label class="champ">Montant (M€) <input class="num" inputMode="decimal" value={montant} onInput={(v) => setMontant((v.target as HTMLInputElement).value)} /></label>
            </div>
            <div class="actions"><button class="btn" onClick={() => { noter(commander(partie, 'politique.lobbying', { ecurie: e.id, orientation, montant: Number(montant.replace(',', '.')) }), 'Pression exercée auprès de la fédération.'); nav.rafraichir(); }}>Faire pression</button></div>
            <p class="muted petit">Le lobbying rend une orientation plus probable parmi les prochaines propositions ; il ne change jamais le décompte des voix.</p>
          </>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Réglages et mesure */

export function EcranReglages({ partie, nav, quitter }: { partie: Partie; nav: Navigation; quitter: () => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [mesure, setMesure] = useState<string | null>(null);
  const sauver = async () => {
    try { const o = await enregistrer(NOM_SAUVEGARDE, partie.monde); setMsg(`Partie sauvegardée (${Math.round(o / 1024)} Ko compressés).`); } catch (x) { setMsg(`Échec de la sauvegarde : ${String(x)}`); }
  };
  const telecharger = async () => {
    const blob = await exporter(partie.monde);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `partie-${partie.monde.date.annee}-s${partie.monde.date.semaine}.sav`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  /** Page de mesure (D-110) : temps de calcul sur une copie du monde, sans toucher à la partie. */
  const mesurer = async (semaines: number) => {
    setMesure('Mesure en cours…');
    await new Promise((r) => setTimeout(r, 30));
    const copie = copierMonde(partie.monde);
    const t0 = performance.now();
    const temps: number[] = [];
    for (let i = 0; i < semaines; i++) {
      const a = performance.now();
      partie.moteur.avancerUneSemaine(copie);
      temps.push(performance.now() - a);
      if (i % 4 === 3) await new Promise((r) => setTimeout(r, 0));
    }
    const total = performance.now() - t0;
    temps.sort((x, y) => x - y);
    const taille = new Blob([serialiser(partie.monde)]).size;
    const comp = (await exporter(partie.monde)).size;
    setMesure(`${semaines} semaines en ${(total / 1000).toFixed(1)} s · médiane ${temps[Math.floor(semaines / 2)]!.toFixed(0)} ms, pire ${temps[semaines - 1]!.toFixed(0)} ms par semaine · saison estimée ${((total / semaines) * 52 / 1000).toFixed(1)} s · sauvegarde ${(taille / 1048576).toFixed(1)} Mo (${(comp / 1048576).toFixed(2)} Mo compressés) · ${navigator.userAgent.includes('Mobile') ? 'appareil mobile' : 'ordinateur'}`);
  };
  return (
    <>
      <div class="carte">
        <h3>Partie</h3>
        <p class="muted petit">Sauvegarde automatique à chaque fin de saison. Graine {partie.monde.graine}.</p>
        <div class="actions">
          <button class="btn principal" onClick={sauver}>Sauvegarder</button>
          <button class="btn" onClick={telecharger}>Télécharger la sauvegarde</button>
          <button class="btn" onClick={quitter}>Quitter vers l’accueil</button>
          <a class="btn" href="#diagnostic">Diagnostic</a>
        </div>
        {msg && <p class="retour">{msg}</p>}
      </div>
      <div class="carte">
        <h3>Mesure des performances</h3>
        <p class="muted petit">Simule des semaines sur une copie du monde (la partie n’avance pas) et mesure le temps de calcul de cet appareil.</p>
        <div class="actions">
          <button class="btn" onClick={() => mesurer(8)}>8 semaines</button>
          <button class="btn" onClick={() => mesurer(52)}>Une saison</button>
        </div>
        {mesure && <p class="num petit">{mesure}</p>}
      </div>
      <div class="carte">
        <h3>À propos</h3>
        <p class="muted petit">Phase 10 : premiers écrans du joueur. Pas encore de course en direct (phase 13), de conception de voiture (phase 12) ni de médias (phase 11). Écurie dirigée : {nomEcurie(partie.monde, partie.monde.joueur!.ecurie)}.</p>
        <button class="btn" onClick={() => nav.aller('tableau')}>Retour à l’accueil</button>
      </div>
    </>
  );
}
