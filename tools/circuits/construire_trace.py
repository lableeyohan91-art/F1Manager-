"""Phase 11b — construit la trace de référence d'un circuit à partir des tours réels collectés (collecte_tours.py).

Sortie (dans le dépôt, données DÉRIVÉES, jamais les données brutes) : data/circuits/<id>.json
- ligne du tracé tous les PAS mètres (repère local, mètres), altitude relative, à partir du tour le plus rapide ;
- vitesse médiane, minimale et maximale des N tours à chaque point ; part du temps à pleine charge et au freinage ;
- provenance exacte (session, pilotes, tours) pour pouvoir tout récupérer à l'identique.
Usage : python3 construire_trace.py <dossier_cache> <id_circuit> <longueur_officielle_m> <virages_officiels> <fichier_sortie>
"""
import json, math, sys, statistics, datetime

PAS = 5.0  # m, pas de la trace stockée (10 m arrondissait les chicanes : rayon minimal surestimé)


def ts(s):
    return datetime.datetime.fromisoformat(s.replace('Z', '+00:00')).timestamp()


def profil_tour(tour, longueur):
    """Distance le long du tour (mise à l'échelle de la longueur officielle) et grandeurs associées, triées par temps."""
    loc = sorted(tour['location'], key=lambda p: p['date'])
    car = sorted(tour['car'], key=lambda c: c['date'])
    P = [(p['x'] / 10.0, p['y'] / 10.0, p['z'] / 10.0, ts(p['date'])) for p in loc]  # unité OpenF1 : 1/10 m
    s = [0.0]
    for a, b in zip(P, P[1:]):
        s.append(s[-1] + math.dist(a[:2], b[:2]))
    k = longueur / s[-1]
    s = [x * k for x in s]
    T = [p[3] for p in P]

    def dist_au_temps(t):
        if t <= T[0]:
            return 0.0
        if t >= T[-1]:
            return longueur
        i = max(j for j in range(len(T)) if T[j] <= t)
        f = (t - T[i]) / max(1e-9, T[i + 1] - T[i])
        return s[i] + f * (s[i + 1] - s[i])

    tele = [(dist_au_temps(ts(c['date'])), c['speed'], c['throttle'], c['brake']) for c in car]
    return P, s, k, tele


def reechantillonner(P, s, longueur, pas):
    n = int(longueur // pas)
    out, j = [], 0
    for i in range(n):
        si = i * pas
        while j + 1 < len(s) - 1 and s[j + 1] < si:
            j += 1
        f = (si - s[j]) / max(1e-9, s[j + 1] - s[j])
        a, b = P[j], P[j + 1]
        out.append(tuple(a[q] + (b[q] - a[q]) * f for q in range(3)))
    return out


def lisser(v, w):
    m = len(v)
    return [sum(v[(i + o) % m] for o in range(-w, w + 1)) / (2 * w + 1) for i in range(m)]


FACTEUR_LISSAGE = 1.0  # demi-fenêtre de lissage = espacement local des mesures × facteur


def lisser_adaptatif(v, demi):
    m = len(v)
    return [sum(v[(i + o) % m] for o in range(-demi[i], demi[i] + 1)) / (2 * demi[i] + 1) for i in range(m)]


def valeur_a(tele, d, champ):
    """Valeur télémétrique au point de distance d (plus proche échantillon)."""
    best = min(tele, key=lambda t: abs(t[0] - d))
    return best[champ]


def construire(cache, cid, longueur, virages_officiels, sortie):
    src = json.load(open(f'{cache}/{cid}.json'))
    tours = src['tours']
    # Ligne du tracé : moyenne des positions des N tours à la même distance (le bruit GPS se compense, le tracé reste).
    lignes = []
    for t in tours:
        P, s, k, _ = profil_tour(t, longueur)
        lignes.append(reechantillonner(P, s, longueur, PAS))
    nmin = min(len(l) for l in lignes)
    pts = [tuple(statistics.mean(l[i][q] for l in lignes) for q in range(3)) for i in range(nmin)]
    k = statistics.mean(profil_tour(t, longueur)[2] for t in tours)
    # Les positions sont mesurées dans le temps (≈ 0,27 s) : à 240 km/h, un point tous les 18 m. Relier des points aussi espacés
    # crée de faux angles, donc de faux virages serrés dans les courbes rapides. Lissage proportionnel à l'espacement réel des mesures.
    ref = min(tours, key=lambda t: t['duree'])
    Pr, sr, _, _ = profil_tour(ref, longueur)
    espacement = []
    for i in range(nmin):
        d = i * PAS
        j = min(range(len(sr) - 1), key=lambda q: abs(sr[q] - d))
        espacement.append(sr[j + 1] - sr[j])
    demi = [max(1, round(FACTEUR_LISSAGE * e / PAS)) for e in espacement]
    X = lisser_adaptatif([p[0] for p in pts], demi)
    Y = lisser_adaptatif([p[1] for p in pts], demi)
    Z = lisser([p[2] for p in pts], 3)
    # La moyenne des tours et le lissage « coupent » légèrement les virages : la ligne raccourcit (jusqu'à 3 % à Monaco), ce qui
    # resserrerait tous les rayons. Remise à l'échelle exacte de la longueur officielle.
    lg = sum(math.dist((X[i], Y[i]), (X[(i + 1) % len(X)], Y[(i + 1) % len(X)])) for i in range(len(X)))
    f = longueur / lg
    cx, cy = statistics.mean(X), statistics.mean(Y)
    X = [cx + (x - cx) * f for x in X]
    Y = [cy + (y - cy) * f for y in Y]
    x0, y0, z0 = X[0], Y[0], min(Z)
    teles = [profil_tour(t, longueur)[3] for t in tours]
    vitesses, gaz, freins = [], [], []
    for i in range(len(pts)):
        d = i * PAS
        v = [valeur_a(te, d, 1) for te in teles]
        vitesses.append((round(statistics.median(v)), min(v), max(v)))
        gaz.append(round(statistics.median(valeur_a(te, d, 2) for te in teles)))
        freins.append(round(sum(1 for te in teles if valeur_a(te, d, 3) > 0) / len(teles), 2))
    arrets = [a['lane_duration'] for a in src.get('arrets', []) if a.get('lane_duration') and 12 < a['lane_duration'] < 45 and (a.get('stop_duration') or 0) < 6]
    sortie_d = dict(
        circuit=cid,
        longueurM=longueur, viragesOfficiels=virages_officiels, pasM=PAS,
        source=dict(nom='OpenF1 (données publiques de chronométrage du championnat)', meeting=src['meeting'], session=src['session'],
                    tours=[dict(pilote=t['pilote'], tour=t['tour'], dureeS=t['duree']) for t in tours],
                    usage='base de calibrage seulement (D-159, décision 6) ; données brutes non redistribuées'),
        statuts=dict(trace='R (moyenne des positions des tours retenus, lissée, mise à l’échelle de la longueur officielle)', altitude='R (relative, lissée)',
                     vitesses='V (médiane de plusieurs tours)', longueur='V (Wikipédia)', virages='V (Wikipédia)'),
        echelleTrace=round(k, 4),
        tempsTourS=dict(min=min(t['duree'] for t in tours), mediane=statistics.median(t['duree'] for t in tours)),
        voieStandsS=dict(mediane=round(statistics.median(arrets), 1), arrets=len(arrets)) if arrets else None,
        points=[dict(x=round(X[i] - x0, 1), y=round(Y[i] - y0, 1), z=round(Z[i] - z0, 1), v=vitesses[i][0], vMin=vitesses[i][1], vMax=vitesses[i][2],
                     gaz=gaz[i], frein=freins[i]) for i in range(len(pts))],
    )
    # L'adhérence de piste est calée à part (tools/calage-profil.mts) : on la conserve si la trace existe déjà.
    try:
        ancienne = json.load(open(sortie))
        if 'adherencePiste' in ancienne:
            sortie_d['adherencePiste'] = ancienne['adherencePiste']
    except (OSError, ValueError):
        pass
    json.dump(sortie_d, open(sortie, 'w'), ensure_ascii=False, separators=(',', ':'))
    return sortie_d


if __name__ == '__main__':
    cache, cid, L, nv, sortie = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
    d = construire(cache, cid, L, nv, sortie)
    print(cid, len(d['points']), 'points ; tour médian', d['tempsTourS']['mediane'], 's ; échelle', d['echelleTrace'])
