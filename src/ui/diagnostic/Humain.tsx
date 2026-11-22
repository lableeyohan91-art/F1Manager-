import { useState } from 'preact/hooks';
import { ETIQUETTES } from '../../engine/balance/memoire';
import {
  contratEmploi, relation, souvenirsDe, teamPrincipal, valeurMarche,
  type Commande, type Evenement, type Monde, type Moteur, type Personne,
} from '../../engine';
import { Carte, ecuries, LIBELLES_POSTES, Lien, nomComplet, ORDRE_POSTES, personnes, texteClauses } from './outils';
import type { Selection } from './Vues';

type Ouvrir = (s: Selection) => void;
const f2 = (x: number) => (x >= 0 ? '+' : '') + x.toFixed(2);

function nomDe(monde: Monde, id: string): string {
  const p = monde.tables['personnes']?.[id] as unknown as Personne | undefined;
  if (p) return nomComplet(p);
  return (monde.tables['ecuries']?.[id] as unknown as { nom: string } | undefined)?.nom ?? id;
}

/** Souvenirs et relations d'une personne (fiche personne). */
export function MemoirePersonne({ monde, id, ouvrir }: { monde: Monde; id: string; ouvrir: Ouvrir }) {
  const souvenirs = souvenirsDe(monde, id).sort((a, b) => b.intensite - a.intensite);
  const rel = Object.values(monde.tables['relations'] ?? {})
    .map((r) => r as unknown as { de: string; vers: string })
    .filter((r) => r.de === id)
    .map((r) => ({ vers: r.vers, ...relation(monde, id, r.vers) }))
    .sort((a, b) => Math.abs(b.confiance) + Math.abs(b.affinite) + b.familiarite * 0.3 - (Math.abs(a.confiance) + Math.abs(a.affinite) + a.familiarite * 0.3))
    .slice(0, 10);
  return (
    <div class="grille">
      <Carte titre={`Souvenirs (${souvenirs.length})`}>
        {souvenirs.length === 0 ? <p class="muted">Aucun souvenir marquant.</p> : (
          <table class="compact">
            <thead><tr><th>Souvenir</th><th>Envers</th><th>Intensité</th><th>Depuis</th></tr></thead>
            <tbody>
              {souvenirs.map((s) => (
                <tr key={s.id}>
                  <td style={{ color: s.ressenti >= 0 ? 'var(--green)' : '#ff8a80' }}>{ETIQUETTES[s.etiquette]?.libelle ?? s.etiquette}</td>
                  <td>{s.cible === id ? <span class="muted">soi-même</span> : <Lien onClick={() => ouvrir(monde.tables['personnes']?.[s.cible] ? { type: 'personne', id: s.cible } : { type: 'ecurie', id: s.cible })}>{nomDe(monde, s.cible)}</Lien>}</td>
                  <td class="num">{Math.round(100 * s.intensite)} %</td>
                  <td class="num">{s.creeLe.annee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Carte>
      <Carte titre="Relations principales">
        {rel.length === 0 ? <p class="muted">Aucune relation connue.</p> : (
          <table class="compact">
            <thead><tr><th>Envers</th><th>Confiance</th><th>Respect</th><th>Affinité</th><th>Familiarité</th></tr></thead>
            <tbody>
              {rel.map((r) => (
                <tr key={r.vers}>
                  <td>{nomDe(monde, r.vers)}</td>
                  <td class="num">{f2(r.confiance)}</td><td class="num">{f2(r.respect)}</td><td class="num">{f2(r.affinite)}</td><td class="num">{Math.round(100 * r.familiarite)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Carte>
    </div>
  );
}

interface Retour { titre: string; motif?: string; evenements: Evenement[]; avant: ReturnType<typeof relation>; apres: ReturnType<typeof relation>; personne: string }

/** Bac à sable (phase 4, §9) : on incarne le team principal d'une écurie et on observe les réactions. */
export function BacASable({ monde, moteur, rafraichir, ouvrir }: { monde: Monde; moteur: Moteur; rafraichir: () => void; ouvrir: Ouvrir }) {
  const eqs = ecuries(monde);
  const [ecurie, setEcurie] = useState(eqs[0]?.id ?? '');
  const [cible, setCible] = useState<string>('');
  const [salaire, setSalaire] = useState('');
  const [duree, setDuree] = useState('2');
  const [promesseN1, setPromesseN1] = useState(false);
  const [retour, setRetour] = useState<Retour | null>(null);
  const tp = teamPrincipal(monde, ecurie);
  const equipe = personnes(monde).filter((p) => p.statut === 'actif' && p.ecurie === ecurie && p.id !== tp?.id)
    .sort((a, b) => ORDRE_POSTES.indexOf(a.poste) - ORDRE_POSTES.indexOf(b.poste));
  const choisie = equipe.find((p) => p.id === cible) ?? equipe[0];
  const pilotee = !!(monde.tables['ecuries']?.[ecurie] as { pilotee?: boolean } | undefined)?.pilotee;

  const agir = (titre: string, type: string, parametres: Record<string, unknown>) => {
    if (!tp || !choisie) return;
    const avant = relation(monde, choisie.id, tp.id);
    const dejaVus = new Set(Object.keys(monde.evenements));
    const commande: Commande = { type, auteur: tp.id, source: 'exterieur', parametres: { personne: choisie.id, ...parametres } };
    const r = moteur.commandes.executer(monde, commande);
    if (r.ok) monde.journalCommandes.push({ date: { ...monde.date }, commande });
    const evenements = Object.values(monde.evenements).filter((e) => !dejaVus.has(e.id));
    setRetour({ titre, ...(r.ok ? {} : { motif: r.motif }), evenements, avant, apres: relation(monde, choisie.id, tp.id), personne: choisie.id });
    rafraichir();
  };
  const avancer = (semaines: number) => {
    const dejaVus = new Set(Object.keys(monde.evenements));
    moteur.avancer(monde, semaines);
    const evenements = Object.values(monde.evenements).filter((e) => !dejaVus.has(e.id) && (e.texte || e.type.startsWith('promesse') || e.type.startsWith('negociation') || e.type.startsWith('augmentation')));
    if (choisie && tp) setRetour({ titre: `Temps avancé de ${semaines} semaine(s)`, evenements, avant: relation(monde, choisie.id, tp.id), apres: relation(monde, choisie.id, tp.id), personne: choisie.id });
    rafraichir();
  };

  const contrat = choisie ? contratEmploi(monde, choisie.id) : undefined;
  const valeur = choisie ? valeurMarche(monde, choisie) : 0;
  return (
    <>
      <Carte titre="Bac à sable — vous êtes le team principal">
        <div class="onglets">
          <select value={ecurie} onChange={(e) => { setEcurie((e.target as HTMLSelectElement).value); setCible(''); setRetour(null); }}>
            {eqs.map((e) => <option key={e.id} value={e.id}>{e.nom}</option>)}
          </select>
          <label class="muted" style={{ alignSelf: 'center' }}>
            <input type="checkbox" checked={pilotee} onChange={() => { (monde.tables['ecuries']![ecurie] as { pilotee?: boolean }).pilotee = !pilotee; rafraichir(); }} /> écurie pilotée par vous (l'IA ne décide plus pour elle)
          </label>
        </div>
        <p class="muted" style={{ fontSize: '.85rem' }}>Team principal : {tp ? nomComplet(tp) : '—'} · {monde.date.annee}, semaine {monde.date.semaine}. Les actions sont de vraies commandes, avec les mêmes règles que l'IA.</p>
        <select value={choisie?.id ?? ''} onChange={(e) => { setCible((e.target as HTMLSelectElement).value); setRetour(null); }}>
          {equipe.map((p) => <option key={p.id} value={p.id}>{LIBELLES_POSTES[p.poste]} — {nomComplet(p)}</option>)}
        </select>
        {choisie && (
          <p>
            <Lien onClick={() => ouvrir({ type: 'personne', id: choisie.id })}>Voir la fiche</Lien> · contrat {contrat ? `${contrat.fin} · ${contrat.salaireMEUR} M€${texteClauses(contrat.clauses) ? ' · ' + texteClauses(contrat.clauses) : ''}` : '—'} · valeur de marché ≈ {valeur.toFixed(1)} M€
            {contrat?.demandeAugmentation !== undefined && <b style={{ color: 'var(--yellow)' }}> · demande une augmentation à {contrat.demandeAugmentation} M€</b>}
          </p>
        )}
      </Carte>
      {choisie && tp && (
        <Carte titre="Actions">
          <div class="onglets">
            <input class="num" style={{ width: '90px' }} placeholder={valeur.toFixed(1)} value={salaire} onInput={(e) => setSalaire((e.target as HTMLInputElement).value)} />
            <span class="muted" style={{ alignSelf: 'center' }}>M€/an ·</span>
            <select value={duree} onChange={(e) => setDuree((e.target as HTMLSelectElement).value)}>{[1, 2, 3, 4].map((d) => <option key={d} value={d}>{d} an(s)</option>)}</select>
            {choisie.poste === 'pilote_titulaire' && <label class="muted" style={{ alignSelf: 'center' }}><input type="checkbox" checked={promesseN1} onChange={() => setPromesseN1(!promesseN1)} /> promettre le statut de n°1</label>}
            <button class="btn principal" onClick={() => agir('Proposition de prolongation', 'contrat.proposer_prolongation', { salaire: Number(salaire || valeur.toFixed(1)), duree: Number(duree), promesses: promesseN1 ? ['statut_n1'] : [], tour: 1 })}>Proposer une prolongation</button>
          </div>
          <div class="onglets">
            {contrat?.demandeAugmentation !== undefined && <>
              <button class="btn" onClick={() => agir('Augmentation accordée', 'contrat.repondre_augmentation', { accepter: true })}>Accorder l'augmentation</button>
              <button class="btn" onClick={() => agir('Augmentation refusée', 'contrat.repondre_augmentation', { accepter: false, justification: false })}>Refuser</button>
              <button class="btn" onClick={() => agir('Augmentation refusée (justifiée)', 'contrat.repondre_augmentation', { accepter: false, justification: true })}>Refuser en expliquant</button>
            </>}
            <button class="btn" onClick={() => agir('Soutien public', 'personnel.soutenir', { publique: true })}>Soutenir (public)</button>
            <button class="btn" onClick={() => agir('Soutien en privé', 'personnel.soutenir', { publique: false })}>Soutenir (privé)</button>
            <button class="btn" onClick={() => agir('Critique publique', 'personnel.critiquer', { publique: true })}>Critiquer (public)</button>
            <button class="btn" onClick={() => agir('Critique en privé', 'personnel.critiquer', { publique: false })}>Critiquer (privé)</button>
            <button class="btn" onClick={() => agir('Félicitations', 'personnel.feliciter', { publique: false })}>Féliciter</button>
            <button class="btn" onClick={() => agir('Excuses', 'personnel.excuses', { publique: false })}>S'excuser</button>
            <button class="btn" onClick={() => agir('Erreur reconnue', 'personnel.reconnaitre_erreur', { publique: false })}>Reconnaître une erreur</button>
            <button class="btn" onClick={() => agir('Discussion privée', 'personnel.discussion_privee', {})}>Discussion privée</button>
            {choisie.poste === 'pilote_titulaire' && <button class="btn" onClick={() => agir(contrat?.clauses.statutN1 ? 'Statut de n°1 retiré' : 'Statut de n°1 accordé', 'pilote.statut_n1', { accorder: !contrat?.clauses.statutN1 })}>{contrat?.clauses.statutN1 ? 'Retirer le statut de n°1' : 'Accorder le statut de n°1'}</button>}
            <button class="btn" onClick={() => { if (confirm(`Licencier ${nomComplet(choisie)} ?`)) agir('Licenciement', 'contrat.licencier', {}); }}>Licencier</button>
          </div>
          <div class="onglets">
            <button class="btn" onClick={() => avancer(4)}>Avancer d'un mois</button>
            <button class="btn" onClick={() => avancer(26)}>Avancer de 6 mois</button>
            <button class="btn" onClick={() => avancer(52)}>Avancer d'un an</button>
          </div>
        </Carte>
      )}
      {retour && (
        <Carte titre={retour.titre}>
          {retour.motif && <p class="erreur">Refusé : {retour.motif}</p>}
          <p class="muted">Relation de {nomDe(monde, retour.personne)} envers vous : confiance {f2(retour.avant.confiance)} → <b>{f2(retour.apres.confiance)}</b> · respect {f2(retour.avant.respect)} → <b>{f2(retour.apres.respect)}</b> · affinité {f2(retour.avant.affinite)} → <b>{f2(retour.apres.affinite)}</b></p>
          {retour.evenements.length === 0 ? <p class="muted">Aucun événement notable.</p> : (
            <ul>
              {retour.evenements.map((e) => (
                <li key={e.id}>
                  <b>{e.type}</b> {e.texte ? `— ${e.texte}` : ''}
                  {Array.isArray(e.contexte['raisons']) && <div class="muted" style={{ fontSize: '.85rem' }}>Pourquoi ? {(e.contexte['raisons'] as string[]).join(' · ')}</div>}
                  {e.contexte['ligneRouge'] ? <div style={{ color: 'var(--yellow)', fontSize: '.85rem' }}>Ligne rouge : {String(e.contexte['ligneRouge'])}</div> : null}
                  {e.contexte['salaireDemande'] !== undefined && <div style={{ fontSize: '.85rem' }}>Contre-offre : {String(e.contexte['salaireDemande'])} M€/an (proposez à nouveau ce montant pour l'accepter)</div>}
                </li>
              ))}
            </ul>
          )}
          <MemoirePersonne monde={monde} id={retour.personne} ouvrir={ouvrir} />
        </Carte>
      )}
    </>
  );
}
