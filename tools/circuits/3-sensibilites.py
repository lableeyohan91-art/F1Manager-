import json, math, datetime
import os
_o=json.load(open('../wiki/officiel.json'))
OFF={k:round(float(v['longueur_km'])*1000) for k,v in _o.items() if os.path.exists(f'tours/{k}.json')}
ALT={'cir_mexico':2240,'cir_interlagos':785,'cir_spielberg':680,'cir_madrid':650,'cir_lasvegas':620,'cir_spa':400}
ts=lambda s: datetime.datetime.fromisoformat(s.replace('Z','+00:00')).timestamp()
def courbure(nom,pas=5.0):
    d=json.load(open(f'tours/{nom}.json')); L=OFF[nom]
    loc=sorted(d['location'],key=lambda x:x['date'])
    P=[(p['x']/10,p['y']/10) for p in loc]
    s=[0.0]
    for a,b in zip(P,P[1:]): s.append(s[-1]+math.dist(a,b))
    k=L/s[-1]; s=[x*k for x in s]; n=int(L//pas); pts=[]; j=0
    for i in range(n):
        si=i*pas
        while j+1<len(s)-1 and s[j+1]<si: j+=1
        f=(si-s[j])/max(1e-9,s[j+1]-s[j]); a,b=P[j],P[j+1]; pts.append((a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f))
    lis=lambda v,w:[sum(v[(i+o)%len(v)] for o in range(-w,w+1))/(2*w+1) for i in range(len(v))]
    X=lis([p[0] for p in pts],3);Y=lis([p[1] for p in pts],3)
    cap=[math.atan2(Y[(i+1)%n]-Y[i],X[(i+1)%n]-X[i]) for i in range(n)]
    dc=lis([(cap[(i+1)%n]-cap[i]+math.pi)%(2*math.pi)-math.pi for i in range(n)],4)
    return [abs(x)/pas for x in dc], d['duree']
REF=dict(m=850, P=740e3, CLA=3.6, CDA=1.05, mu=1.65, rho0=1.2)
def tour(kap,pas,v,alt):
    rho=v['rho0']*math.exp(-alt/8500); m,P,CLA,CDA,mu=v['m'],v['P']*(rho/v['rho0'])**0.35,v['CLA'],v['CDA'],v['mu']; g=9.81  # moteur turbo : perte de puissance modérée en altitude (hypothèse)
    n=len(kap); vmax=[]
    for k in kap:
        den=m*k-mu*0.5*rho*CLA
        vmax.append(min(110.0, math.sqrt(mu*m*g/den)) if den>0 else 110.0)
    V=vmax[:]
    for _ in range(2):
        for i in range(1,2*n):
            a,b=(i-1)%n,i%n; vv=V[a]; drag=0.5*rho*CDA*vv*vv; grip=mu*(m*g+0.5*rho*CLA*vv*vv)
            V[b]=min(vmax[b], math.sqrt(max(0,vv*vv+2*pas*(min(P/max(vv,5),grip)-drag)/m)))
        for i in range(2*n,0,-1):
            a,b=i%n,(i-1)%n; vv=V[a]; drag=0.5*rho*CDA*vv*vv; grip=mu*(m*g+0.5*rho*CLA*vv*vv)
            V[b]=min(V[b], math.sqrt(vv*vv+2*pas*(grip+drag)/m))
    return sum(pas/max(x,1) for x in V), V
# Correspondance provisoire « un point de note » → paramètre physique (hypothèse H, à calibrer par la normalisation)
CARAC={'virages lents (adhérence mécanique)':('mu',1.01),'virages rapides (appui)':('CLA',1.02),'vitesse de pointe (traînée)':('CDA',0.98),'moteur (puissance)':('P',1.02)}
res={}
for nom in OFF:
    kap,reel=courbure(nom); t0,V=tour(kap,5,REF,ALT.get(nom,50))
    g={}
    for lib,(cle,f) in CARAC.items():
        v=dict(REF); v[cle]*=f; g[lib]=t0-tour(kap,5,v,ALT.get(nom,50))[0]
    res[nom]=dict(t=t0,reel=reel,vmax=max(V)*3.6,vmin=min(V)*3.6,g=g)
moy={lib:sum(r['g'][lib] for r in res.values())/len(res) for lib in CARAC}
for nom,r in res.items():
    rel={lib:r['g'][lib]/moy[lib] for lib in CARAC}
    tri=sorted(rel.items(),key=lambda x:-x[1])
    print(f"{nom:16s} modèle {r['t']:.1f}s (réel {r['reel']:.1f}) vmax {r['vmax']:.0f} vmin {r['vmin']:.0f} | essentiels : {tri[0][0]} ×{tri[0][1]:.2f}, {tri[1][0]} ×{tri[1][1]:.2f} | moins important : {tri[-1][0]} ×{tri[-1][1]:.2f}")

json.dump({n:dict(t=r['t'],reel=r['reel'],g=r['g']) for n,r in res.items()},open('sensib.json','w'),indent=1)
