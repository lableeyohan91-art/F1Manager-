/**
 * Phase 11b — génère les données des 30 circuits utilisées par le jeu (fiches, contraintes techniques, stratégie, incidents),
 * à partir des traces (data/circuits/**), du tableau des caractéristiques estimées (data/circuits/caracteres.csv), des virages
 * officiels (data/circuits/virages-officiels.json) et du PROFIL DE VITESSE DU MOTEUR (mêmes calculs que le jeu : un seul moteur).
 *
 * Sorties :
 *   data/grille-2026/circuits-fiches.json   fiches A à E des 30 circuits (lues par l'interface), avec statut de chaque donnée ;
 *   data/grille-2026/climat-circuits.csv    climat mensuel (lu par le moteur : probabilité de pluie selon le mois du Grand Prix).
 *
 * Statuts : V vérifié (source officielle ou publique), R relevé (dérivé de tours réels), E estimé, H hypothèse, C calculé par le moteur.
 * Les caractéristiques essentielles sont PROVISOIRES tant que les caractéristiques des voitures de la phase 12 n'existent pas.
 * Usage : npx tsx tools/circuits/generer-fiches-jeu.mts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, partsDuTour, pointsEssentiels, profilVitesse, sensibilites, type Trace } from '../../src/engine/circuits/profil';
import { CLASSES_VIRAGES, NIVEAUX_AILERONS, POINTS_ESSENTIELS, VOITURE_REFERENCE } from '../../src/engine/balance/profil';

const TEST = ['cir_monza', 'cir_monaco', 'cir_suzuka', 'cir_singapour', 'cir_mexico'];
const csv = (f: string) => { const [t, ...l] = readFileSync(f, 'utf8').trim().split('\n'); const h = t!.split(';'); return l.map((x) => Object.fromEntries(x.split(';').map((v, i) => [h[i]!, v]))); };
const caracteres = Object.fromEntries(csv('data/circuits/caracteres.csv').map((r) => [r.id!, r]));
const calendrier = csv('data/grille-2026/circuits.csv').map((r) => r.id!);
const ids = Object.keys(caracteres);
const fichier = (id: string) => ['data/circuits', 'data/circuits/validation', 'data/circuits/reconstruits'].map((d) => `${d}/${id}.json`).find(existsSync)!;
const officiels = JSON.parse(readFileSync('data/circuits/virages-officiels.json', 'utf8')) as Record<string, { virages: { numero: number; nom: string; portionsM: number[]; confiance: string }[] }>;

/* Seuils de l'outil (lecture des tracés ; aucun n'agit sur la simulation). */
/** Ligne droite : portion de rayon supérieur à 1 km d'au moins cette longueur (m). */
const LIGNE_DROITE_MIN_M = 200;
/** Zone de freinage : décélération d'au moins ce nombre de km/h. */
const FREINAGE_MIN_KMH = 40;
/** Zone favorable au dépassement : au moins 500 m près de la vitesse maximale (à 60 km/h près) avant un freinage d'au moins 100 km/h. */
const DEPASSEMENT = { ligneMinM: 500, freinageMinKmh: 100, procheVmaxKmh: 60 };
/** Sommet de virage : maximum local de courbure sur ± cette distance (m). */
const SOMMET_FENETRE_M = 25;
/** Pas de la carte de la fiche (m) : assez fin pour les chicanes, léger pour un téléphone. */
const PAS_CARTE_M = 20;
/** Temps hors circulation dans la voie des stands, en plus du trajet à vitesse limitée (s, H) : arrêt de 2,5 s et manœuvres. */
const STANDS_HORS_TRAJET_S = 3;
/** Immobilisation typique incluse dans le temps de passage relevé (s, E). */
const IMMOBILISATION_S = 2.5;

type T = Trace & { points: { x: number; y: number; z: number; v: number; frein?: number }[]; altitudeM: number; viragesOfficiels: number; annee?: number; tempsTourS: { mediane: number; statut?: string };
  voieStandsS: { mediane: number; arrets: number } | null; climat?: Climat; historique?: Historique; statuts: Record<string, string>; source: { nom: string }; sansReleveReel?: boolean };
type Climat = { source: string; station: string; statuts: Record<string, string>; moisGP2026: number; heureCourse: number; mois: Record<string, { airMaxC: number; airMinC: number | null; airCourseC: number; joursPluie: number | null; pluieMm: number | null; humidite: number | null; pluieCourse: number | null; statutJoursPluie: string }> };
type Historique = { regles: string; configuration?: string; resume: unknown; editions: { annee: number; nom: string; safetyCars: unknown[] | null; vsc: unknown[] | null; drapeauxRouges: unknown[]; verification: string }[] };

const traces = Object.fromEntries(ids.map((id) => [id, JSON.parse(readFileSync(fichier(id), 'utf8')) as T]));
const calc = Object.fromEntries(ids.map((id) => {
  const t = traces[id]!, k = courbures(t), c = { altitudeM: t.altitudeM ?? 0 };
  const { niveau, profil } = appuiNaturel(t, VOITURE_REFERENCE, c, k);
  const gains = sensibilites(t, avecAilerons(VOITURE_REFERENCE, niveau), c);
  // Sensibilité au réglage d'ailerons : perte moyenne de temps à ±0,5 du niveau calculé (provisoire, D-163).
  const ecart = [niveau - 0.5, niveau + 0.5].filter((a) => a >= NIVEAUX_AILERONS.min - 1e-9 && a <= NIVEAUX_AILERONS.max + 1e-9)
    .map((a) => profilVitesse(t, avecAilerons(VOITURE_REFERENCE, a), c, k).tempsS - profil.tempsS);
  return [id, { k, niveau, profil, gains, parts: partsDuTour(t, profil), sensReglage: ecart.reduce((a, b) => a + b, 0) / Math.max(1, ecart.length) }];
}));
const cles = Object.keys(calc[ids[0]!]!.gains) as (keyof (typeof calc)[string]['gains'])[];
const surCalendrier = ids.filter((id) => calendrier.includes(id));
const moyennes = Object.fromEntries(cles.map((p) => [p, surCalendrier.reduce((a, id) => a + Math.max(0, calc[id]!.gains[p]), 0) / surCalendrier.length])) as Record<string, number>;

const LIB: Record<string, string> = { adherenceMecanique: 'Adhérence mécanique (virages lents)', appui: 'Appui (virages rapides)', trainee: 'Faible traînée (vitesse de pointe)', puissance: 'Puissance du moteur', motricite: 'Motricité (sorties de virage)', freinage: 'Freinage' };
const EXPLIC: Record<string, string> = {
  adherenceMecanique: 'beaucoup de temps se joue dans les virages lents, où l’appui aérodynamique aide peu',
  appui: 'les virages rapides et moyens pèsent lourd : l’appui y fait la vitesse de passage',
  trainee: 'les longues pleines charges récompensent une voiture qui fend l’air',
  puissance: 'une grande part du tour se fait à pleine puissance',
  motricite: 'les nombreuses sorties de virage lentes récompensent une voiture qui transmet sa puissance au sol',
  freinage: 'les gros freinages, nombreux, font gagner du temps à une voiture stable et efficace au freinage',
};

function virages(id: string, t: T, kmh: number[]) {
  const k = calc[id]!.k, n = k.length, pas = t.pasM, w = Math.round(SOMMET_FENETRE_M / pas);
  // Sommets : maxima locaux de courbure ; angle = rotation cumulée tant que la courbure garde le même signe et reste marquée.
  const sommets: { i: number; angle: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.abs(k[i]!);
    if (a < 1 / 600) continue;
    let max = true;
    for (let o = -w; o <= w && max; o++) if (o && Math.abs(k[(i + o + n) % n]!) > a) max = false;
    if (!max) continue;
    let ang = 0;
    for (const d of [-1, 1]) for (let o = d === -1 ? 0 : 1; Math.abs(o) < n / 4; o += d) {
      const q = k[(i + o + n) % n]!;
      if (q * k[i]! <= 0 || Math.abs(q) < 1 / 1500) break;
      ang += q * pas;
    }
    sommets.push({ i, angle: (ang * 180) / Math.PI });
  }
  const off = officiels[id];
  const pt = (i: number) => ({ s: i * pas, x: Math.round(t.points[i]!.x), y: Math.round(t.points[i]!.y), angleDeg: 0, sens: k[i]! > 0 ? 'gauche' : 'droite', rayonM: Math.round(1 / Math.max(Math.abs(k[i]!), 1e-6)), vMinKmh: Math.round(Math.min(...[-3, -2, -1, 0, 1, 2, 3].map((o) => kmh[(i + o + n) % n]!))) });
  if (off) {
    const positions = off.virages.map((v) => (v.portionsM.length ? v.portionsM[0]! : NaN));
    // Virage sans portion relevée (enchaînement trop court) : placé entre ses voisins.
    positions.forEach((x, j) => { if (Number.isNaN(x)) { const a = positions.slice(0, j).reverse().find((y) => !Number.isNaN(y)) ?? 0, b = positions.slice(j + 1).find((y) => !Number.isNaN(y)) ?? a; positions[j] = (a + b) / 2; } });
    return off.virages.map((v, j) => {
      const i = Math.round(positions[j]! / pas) % n;
      const s = sommets.filter((x) => Math.abs(x.i - i) <= 12).sort((a, b) => Math.abs(b.angle) - Math.abs(a.angle))[0];
      const p = pt(s ? s.i : i);
      const classe = p.vMinKmh < CLASSES_VIRAGES.lentMaxKmh ? 'lent' : p.vMinKmh < CLASSES_VIRAGES.moyenMaxKmh ? 'moyen' : 'rapide';
      return { numero: v.numero, nom: v.nom, ...p, angleDeg: Math.round(Math.abs(s?.angle ?? 0)), classe, statut: `R (rapprochement manuel, ${v.confiance})` };
    });
  }
  // Numérotation automatique : les N sommets les plus marqués (N = nombre officiel), dans l'ordre du tour depuis la ligne.
  const retenus = [...sommets].sort((a, b) => Math.abs(b.angle) - Math.abs(a.angle)).slice(0, t.viragesOfficiels).sort((a, b) => a.i - b.i);
  return retenus.map((s, j) => {
    const p = pt(s.i);
    const classe = p.vMinKmh < CLASSES_VIRAGES.lentMaxKmh ? 'lent' : p.vMinKmh < CLASSES_VIRAGES.moyenMaxKmh ? 'moyen' : 'rapide';
    return { numero: j + 1, nom: '', ...p, angleDeg: Math.round(Math.abs(s.angle)), classe, statut: 'R (numérotation automatique des sommets les plus marqués, à vérifier)' };
  });
}

function lignesEtFreinages(id: string, t: T, kmh: number[]) {
  const k = calc[id]!.k, n = k.length, pas = t.pasM;
  const lignes: { debutM: number; finM: number; longueurM: number; vMaxKmh: number }[] = [];
  let d = -1;
  for (let i = 0; i <= n; i++) {
    const droit = i < n && Math.abs(k[i]!) < 1 / 1000;
    if (droit && d < 0) d = i;
    if (!droit && d >= 0) { if ((i - d) * pas >= LIGNE_DROITE_MIN_M) lignes.push({ debutM: d * pas, finM: i * pas, longueurM: (i - d) * pas, vMaxKmh: Math.max(...kmh.slice(d, i)) }); d = -1; }
  }
  // Ligne droite qui traverse la ligne d'arrivée : on recolle la dernière et la première.
  if (lignes.length > 1 && lignes[0]!.debutM === 0 && lignes[lignes.length - 1]!.finM === n * pas) {
    const a = lignes.pop()!, b = lignes.shift()!;
    lignes.unshift({ debutM: a.debutM, finM: b.finM, longueurM: a.longueurM + b.longueurM, vMaxKmh: Math.max(a.vMaxKmh, b.vMaxKmh) });
  }
  const freinages: { debutM: number; finM: number; vAvantKmh: number; vApresKmh: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = kmh[(i - 1 + n) % n]!, b = kmh[i]!, c = kmh[(i + 1) % n]!;
    if (!(b >= a && b > c)) continue; // maximum local de vitesse : début d'une décélération
    let domine = false; // le bruit des relevés crée de petits maxima : seul le maximum sur ± 100 m compte
    for (let o = -20; o <= 20 && !domine; o++) if (kmh[(i + o + n) % n]! > b) domine = true;
    if (domine) continue;
    // Fin du freinage : la vitesse cesse de baisser (tolérance de 3 km/h au bruit des relevés), au plus bas atteint.
    let j = i, bas = i;
    while (j - i < n / 3 && kmh[(j + 1) % n]! <= kmh[bas % n]! + 3) { j++; if (kmh[j % n]! < kmh[bas % n]!) bas = j; }
    j = bas;
    const drop = b - kmh[j % n]!;
    if (drop >= FREINAGE_MIN_KMH) freinages.push({ debutM: i * pas, finM: (j % n) * pas, vAvantKmh: Math.round(b), vApresKmh: Math.round(kmh[j % n]!) });
  }
  return { lignes, freinages };
}

/** Texte de Wikipédia lisible : sans modèles, liens réduits à leur texte, entités HTML retirées. */
const nettoyer = (x: string) => x.replace(/\{\{[^}]*\}\}?/g, '').replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1').replace(/:?[a-z]{2}:[^|]*\|/g, '').replace(/&nbsp;/g, ' ').replace(/\|.*$/, '').replace(/\s+/g, ' ').replace(/[ ,]+\(/g, ' (').trim();
const sortie: Record<string, unknown> = {};
const climatCsv: string[] = ['id;mois;airCourseC;pluieCourse;humidite;joursPluie;statut'];
for (const id of ids) {
  const t = traces[id]!, ca = caracteres[id]!, c = calc[id]!, n = t.points.length, pas = t.pasM;
  const reel = !t.sansReleveReel;
  const kmh = reel ? t.points.map((p) => p.v) : c.profil.vitesses.map((v) => v * 3.6);
  const vir = virages(id, t, kmh);
  const { lignes, freinages } = lignesEtFreinages(id, t, kmh);
  const virageApres = (s: number) => vir.find((v) => v.s >= s) ?? vir[0];
  // B — exigences (calcul du moteur, normalisé sur le calendrier, règle du gain négligeable).
  const pe = pointsEssentiels(c.gains as Record<string, number>, moyennes);
  // Contraintes pour les voitures (index 0–100 relatif au calendrier : 50 = moyenne). Lecture : ce que le circuit sollicite.
  const indice = (p: string) => Math.round(Math.min(100, 50 * Math.max(0, c.gains[p as keyof typeof c.gains]) / moyennes[p]!));
  const zMin = Math.min(...t.points.map((p) => p.z)), zMax = Math.max(...t.points.map((p) => p.z));
  let pente = 0;
  for (let i = 0; i < n; i += 4) { const j = (i + 4) % n; pente = Math.max(pente, Math.abs(t.points[j]!.z - t.points[i]!.z) / (4 * pas) * 100); }
  const cl = t.climat, moisGP = cl?.moisGP2026 ?? 0, mGP = cl?.mois[String(moisGP)];
  const lentPart = kmh.filter((v) => v < CLASSES_VIRAGES.lentMaxKmh).length / n;
  // Stands : temps de passage relevé (entrée → sortie de la voie, arrêt compris) et perte nette par rapport au tour sans arrêt.
  const vLim = Number(ca.vitesseStandsKmh) / 3.6;
  const tVoie = t.voieStandsS?.mediane ?? null;
  const longueurVoie = tVoie ? Math.max(150, (tVoie - STANDS_HORS_TRAJET_S) * vLim) : 350;
  const nVoie = Math.round(longueurVoie / pas / 2);
  let tPiste = 0;
  for (let o = -nVoie; o < nVoie; o++) tPiste += pas / Math.max(1, kmh[(o + n) % n]! / 3.6);
  const tPassage = tVoie ?? +(longueurVoie / vLim + STANDS_HORS_TRAJET_S).toFixed(1);
  // Dépassements et risques.
  const zonesDepassement = freinages.map((f) => {
    // Longueur de l'aspiration : distance parcourue avant le freinage à moins de PROCHE_VMAX_KMH de la vitesse de début de freinage.
    const i0 = Math.round(f.debutM / pas);
    // Des deux côtés du maximum : en 2026, la voiture perd souvent de la vitesse avant de freiner (déploiement électrique coupé).
    let o = 0, av = 0;
    while (o < n / 2 && kmh[(i0 - o - 1 + n) % n]! >= f.vAvantKmh - DEPASSEMENT.procheVmaxKmh) o++;
    while (av < n / 2 && kmh[(i0 + av + 1) % n]! >= f.vAvantKmh - DEPASSEMENT.procheVmaxKmh) av++;
    const longueur = (o + av) * pas, chute = f.vAvantKmh - f.vApresKmh;
    return { s: f.debutM, virage: virageApres(f.debutM)?.numero ?? null, ligneAvantM: longueur, chuteKmh: chute, favorable: longueur >= DEPASSEMENT.ligneMinM && chute >= DEPASSEMENT.freinageMinKmh };
  }).filter((z) => z.favorable).sort((a, b) => b.ligneAvantM * b.chuteKmh - a.ligneAvantM * a.chuteKmh)
    .filter((z, i, l) => l.findIndex((y) => y.virage === z.virage) === i).slice(0, 5); // une zone par virage d'arrivée
  const largeur = Number(ca.largeur), murs = Number(ca.murs), deg = Number(ca.degagements);
  const difficulteDepassement = Math.max(1, Math.min(5, Math.round(5 - zonesDepassement.length + (3 - largeur) * 0.5)));
  const zonesRisque = vir.map((v) => ({ v, score: (v.vMinKmh / 100) * (murs + (6 - deg)) / 2 })).sort((a, b) => b.score - a.score).slice(0, 4)
    .map(({ v }) => ({ virage: v.numero, s: v.s, raison: v.vMinKmh >= 180 ? 'virage rapide' + (murs >= 4 ? ', murs proches' : deg <= 2 ? ', dégagement court' : '') : murs >= 4 ? 'murs au ras de la piste' : 'freinage appuyé, accrochages possibles', statut: 'C (vitesse du tracé) et E (murs, dégagements)' }));
  const carte: [number, number][] = [];
  for (let i = 0; i < n; i += Math.round(PAS_CARTE_M / pas)) carte.push([Math.round(t.points[i]!.x), Math.round(t.points[i]!.y)]);
  const h = t.historique;
  sortie[id] = {
    id, permanent: ca.statut === 'permanent', calendrier2026: calendrier.includes(id), pilote: TEST.includes(id),
    A: {
      longueurM: t.longueurM, virages: t.viragesOfficiels, sens: ca.sens, nature: ca.nature, nuit: ca.nuit === '1',
      tourReelS: reel ? t.tempsTourS.mediane : null, anneeReleve: t.annee ?? null, source: t.source.nom,
      carte, depart: carte[0], virages_: vir.map((v) => ({ numero: v.numero, nom: v.nom, s: v.s, x: v.x, y: v.y, sens: v.sens, angleDeg: v.angleDeg, rayonM: v.rayonM, vMinKmh: v.vMinKmh, classe: v.classe })),
      statutVirages: vir[0]?.statut ?? '', lignesDroites: lignes, freinages,
      denivele: { ecartM: +(zMax - zMin).toFixed(1), penteMaxPct: +pente.toFixed(1), statut: reel ? 'R (altitude des tours relevés, lissée)' : 'H (relief inconnu)' },
      statuts: { trace: t.statuts.trace, vitesses: reel ? t.statuts.vitesses : 'C (calculées par le moteur, aucun relevé réel)' },
    },
    B: {
      provisoire: true,
      essentiels: pe.essentiels.map((p) => ({ id: p, nom: LIB[p], pourquoi: EXPLIC[p], gainS: +c.gains[p as keyof typeof c.gains].toFixed(3) })),
      moinsImportant: { id: pe.moinsImportant, nom: LIB[pe.moinsImportant], gainS: +c.gains[pe.moinsImportant as keyof typeof c.gains].toFixed(3) },
      gainsBrutsS: Object.fromEntries(cles.map((p) => [p, +c.gains[p].toFixed(3)])),
      limites: `Calcul du moteur (profil de vitesse, voiture de référence, +2 % sur chaque caractéristique), normalisé sur les 24 circuits du calendrier 2026 ; un gain inférieur à ${POINTS_ESSENTIELS.gainNegligeableS} s ne peut pas être essentiel. Provisoire : les caractéristiques des voitures de la phase 12 (refroidissement, pneus, architectures aérodynamiques) n’existent pas encore.${reel ? '' : ' Tracé sans relevé réel : plus incertain.'}`,
    },
    contraintes: {
      _lecture: 'Indice 0–100 relatif au calendrier (50 = moyenne). Données préparées pour les phases 12 et 13 ; AUCUN effet sur la simulation avant que la formule correspondante existe.',
      appui: indice('appui'), traineeVitessePointe: indice('trainee'), puissance: indice('puissance'), adherenceMecanique: indice('adherenceMecanique'), motricite: indice('motricite'), freinage: indice('freinage'),
      energie: { partPleineChargePct: Math.round(100 * (c.parts.puissance + c.parts.butee)), coupureElectriqueKmh: c.profil.coupureKmh, energieUtiliseePct: Math.round(100 * c.profil.energieElectriqueJ / VOITURE_REFERENCE.energieElectriqueTourJ), statut: 'C' },
      refroidissement: { airCourseC: mGP?.airCourseC ?? null, altitudeM: t.altitudeM ?? 0, partLentePct: Math.round(100 * lentPart), statut: 'C et E : indicateurs seulement (modèle thermique en phase 12)' },
      pneus: { stress: Number(ca.stressPneus), abrasivite: Number(ca.abrasivite), evolutionPiste: Number(ca.evolutionPiste), statut: ca.statutValeurs },
      bosses: Number(ca.bosses), vibreurs: Number(ca.vibreurs), altitudeM: t.altitudeM ?? 0, temperatureAirC: mGP?.airCourseC ?? null,
      sensibiliteReglagesS: +c.sensReglage.toFixed(2), sensibiliteReglagesStatut: 'C provisoire (réglage d’ailerons de la voiture de référence, à refaire avec les architectures de la phase 12, D-163)',
      statutEstimations: ca.statutValeurs === 'H' ? 'H (aucune source : hypothèse)' : 'E (connaissance publique générale : fiches du manufacturier de pneus, presse spécialisée ; à recouper)',
    },
    C: {
      climat: cl ? { source: cl.source, station: nettoyer(cl.station), moisGP: moisGP, heureCourse: cl.heureCourse, statuts: cl.statuts,
        mois: Object.fromEntries(Object.entries(cl.mois).map(([m, x]) => [m, { airC: x.airCourseC, pluie: x.pluieCourse, humidite: x.humidite, joursPluie: x.joursPluie }])) } : null,
      revetement: { abrasivite: Number(ca.abrasivite), adherence: Number(ca.adherenceRevetement), adherenceCalee: (t as unknown as { adherencePiste?: { valeur: number } }).adherencePiste?.valeur ?? null, statut: ca.statutValeurs },
      altitudeM: t.altitudeM ?? 0, nuit: ca.nuit === '1',
    },
    D: h ? { regles: h.regles, configuration: h.configuration ?? null, resume: h.resume, editions: h.editions.map((e) => ({ annee: e.annee, nom: e.nom, sc: e.safetyCars ? e.safetyCars.length : null, vsc: e.vsc ? e.vsc.length : null, rouges: e.drapeauxRouges.length, verification: e.verification })) } : null,
    E: {
      _lecture: 'Structure prête pour la phase 13 : les réglages se découvrent en essais libres et ne sont jamais donnés (D-161).',
      reglages: ['ailerons', 'hauteurCaisse', 'suspension', 'refroidissement', 'freins'].map((r) => ({ id: r, etat: 'à découvrir en essais libres (phase 13)' })),
      retoursIngenieurs: [],
    },
    strategie: {
      stands: { tempsPassageS: tPassage, perteNetteS: +(tPassage - tPiste).toFixed(1), perteHorsImmobilisationS: +(tPassage - tPiste - IMMOBILISATION_S).toFixed(1), vitesseLimiteKmh: Number(ca.vitesseStandsKmh),
        statut: tVoie ? `R (médiane de ${t.voieStandsS!.arrets} passages réels, arrêt compris) ; perte nette C (même distance en piste, vitesses du tracé)` : 'E (voie estimée ; aucun passage relevé)' },
      zonesDepassement, difficulteDepassement, statutDepassement: 'C (lignes droites et freinages du tracé) et E (largeur)',
      pneus: { stress: Number(ca.stressPneus), abrasivite: Number(ca.abrasivite) },
    },
    incidents: { zonesRisque, murs, degagements: deg, largeur, evacuation: Number(ca.evacuation), statut: 'E (murs, dégagements, largeur, évacuation : connaissance publique générale, à recouper) ; zones C' },
  };
  if (cl) for (let m = 1; m <= 12; m++) { const x = cl.mois[String(m)]!; climatCsv.push([id, m, x.airCourseC, x.pluieCourse ?? '', x.humidite ?? '', x.joursPluie ?? '', x.statutJoursPluie.startsWith('V') ? 'V' : 'E'].join(';')); }
  console.error(id, 'essentiels', pe.essentiels.join('+'), '| virages', vir.length, '/', t.viragesOfficiels, '| lignes', lignes.length, '| freinages', freinages.length, '| dépassement', zonesDepassement.length, '| stands', tPassage, (tPassage - tPiste).toFixed(1), cl ? '' : '| SANS CLIMAT');
}
writeFileSync('data/grille-2026/circuits-fiches.json', JSON.stringify({ _lisezmoi: 'Généré par tools/circuits/generer-fiches-jeu.mts (ne pas modifier à la main). Statuts : V vérifié, R relevé, E estimé, H hypothèse, C calculé par le moteur.', moyennesCalendrier: moyennes, circuits: sortie }));
writeFileSync('data/grille-2026/climat-circuits.csv', climatCsv.join('\n') + '\n');
