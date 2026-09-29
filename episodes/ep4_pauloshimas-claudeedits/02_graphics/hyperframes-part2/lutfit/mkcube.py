"""Bake the fitted correction into a 33^3 .cube, blending the cubic fit (where the footage has data)
with the grey-safe linear matrix (everywhere else)."""
import numpy as np
def gaussian_filter(a,sig):
    r=int(3*sig); k=np.exp(-0.5*(np.arange(-r,r+1)/sig)**2); k/=k.sum()
    for ax in range(3):
        a=np.apply_along_axis(lambda v: np.convolve(np.pad(v,r,mode='edge'),k,mode='valid'),ax,a)
    return a
X=np.load("grade/lutfit/X.npy").astype(np.float64); C=np.load("grade/lutfit/C.npy"); B=np.load("grade/lutfit/B.npy")
dec=lambda v: np.clip(v,0,1)**2.4; enc=lambda l: np.clip(l,0,1)**(1/2.4)
def feats(x):
    r,g,b=x.T; one=np.ones_like(r)
    return np.stack([one,r,g,b,r*g,r*b,g*b,r*r,g*g,b*b,r*g*b,r*r*g,r*r*b,g*g*r,g*g*b,b*b*r,b*b*g,r**3,g**3,b**3],1)
N=33
g=np.linspace(0,1,N)
# cube order: R fastest
bb,gg,rr=np.meshgrid(g,g,g,indexing='ij'); grid=np.stack([rr.ravel(),gg.ravel(),bb.ravel()],1)
pc=np.clip(feats(grid)@C,0,1); pb=enc(dec(grid)@B)
# data density on the grid
idx=np.clip(np.rint(X*(N-1)).astype(int),0,N-1)
H=np.zeros((N,N,N)); np.add.at(H,(idx[:,2],idx[:,1],idx[:,0]),1)
Hs=gaussian_filter(H,1.5); w=np.clip(Hs/ (Hs.max()*0.002),0,1).ravel()[:,None]
out=np.clip(w*pc+(1-w)*pb,0,1)
with open("grade/hf2ref.cube","w") as f:
    f.write('TITLE "HyperFrames HLG-SDR to correct BT.709 chroma (Ep4)"\nLUT_3D_SIZE 33\nDOMAIN_MIN 0 0 0\nDOMAIN_MAX 1 1 1\n')
    for v in out: f.write(f"{v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
print("weight>0.5 on",(w>0.5).mean()*100,"% of grid")
