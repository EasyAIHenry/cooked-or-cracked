import numpy as np, colorsys
X=np.load("grade/lutfit/X.npy").astype(np.float64); Y=np.load("grade/lutfit/Y.npy").astype(np.float64)
dec=lambda v: np.clip(v,0,1)**2.4; enc=lambda l: np.clip(l,0,1)**(1/2.4)
n=len(X); tr=np.arange(n)%5!=0; te=~tr
# A: 3x3 matrix in linear light
Xl=dec(X); Yl=dec(Y)
A,_,_,_=np.linalg.lstsq(Xl[tr],Yl[tr],rcond=None)
predA=enc(Xl@A)
# B: 3x3 matrix in linear light, rows constrained to sum to 1 (keeps greys grey)
# solve per output channel with constraint via substitution
Ab=np.zeros((3,3))
for j in range(3):
    # y - x2 = a0 (x0 - x2) + a1 (x1 - x2), a2 = 1-a0-a1
    Z=np.stack([Xl[tr,0]-Xl[tr,2],Xl[tr,1]-Xl[tr,2]],1); yy=Yl[tr,j]-Xl[tr,2]
    s,_,_,_=np.linalg.lstsq(Z,yy,rcond=None); Ab[:,j]=[s[0],s[1],1-s[0]-s[1]]
predB=enc(Xl@Ab)
# C: cubic polynomial in gamma space
def feats(x):
    r,g,b=x.T; one=np.ones_like(r)
    return np.stack([one,r,g,b,r*g,r*b,g*b,r*r,g*g,b*b,r*g*b,r*r*g,r*r*b,g*g*r,g*g*b,b*b*r,b*b*g,r**3,g**3,b**3],1)
C,_,_,_=np.linalg.lstsq(feats(X[tr]),Y[tr],rcond=None); predC=np.clip(feats(X)@C,0,1)
for nm,p in [("none",X),("A lin3x3",predA),("B lin3x3 grey-safe",predB),("C cubic",predC)]:
    e=np.abs(p[te]-Y[te]); print(f"{nm:20s} MAE={e.mean():.4f}  p95={np.percentile(e.max(1),95):.4f}")
np.set_printoptions(precision=4,suppress=True)
print("A=\n",A.T); print("B=\n",Ab.T)
np.save("grade/lutfit/A.npy",A); np.save("grade/lutfit/B.npy",Ab); np.save("grade/lutfit/C.npy",C)
