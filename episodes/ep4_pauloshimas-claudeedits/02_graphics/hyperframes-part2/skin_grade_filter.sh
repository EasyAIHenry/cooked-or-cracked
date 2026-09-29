# prints the filter graph: input [IN] (yuv), output [OUT] (yuv444p), shader-equivalent skin smoothing + Ep3 grade
SS='st(9,clip((ld(8)-A)/(B-A),0,1));ld(9)*ld(9)*(3-2*ld(9))'
sm(){ echo "$SS" | sed -e "s/A/$1/g" -e "s/B/$2/g"; }
LY="st(8,(val-16)/219);255*($(sm 0.15 0.25))"
LU="st(8,(val-128)/224+0.5);st(7,$(sm 0.34 0.37));st(8,(val-128)/224+0.5);255*ld(7)*(1-($(sm 0.49 0.52)))"
LV="st(8,(val-128)/224+0.5);st(7,$(sm 0.52 0.56));st(8,(val-128)/224+0.5);255*ld(7)*(1-($(sm 0.66 0.70)))"
GRADE="eq=contrast=1.08:saturation=1.10:gamma=1.05:brightness=0.01,curves=all='0/0 0.5/0.53 0.82/0.82 1/0.965',colorbalance=rm=0.015:bm=-0.015"
echo "[IN]format=yuv444p,split=3[src][sm][mk];[sm]bilateral=sigmaS=4:sigmaR=0.09:planes=7,lutyuv=y='val+(235-val)*0.055'[smo];[mk]extractplanes=y+u+v[my][mu][mv];[my]lut=c0='$LY'[ly];[mu]lut=c0='$LU'[lu];[mv]lut=c0='$LV'[lv];[ly][lu]blend=all_mode=multiply[m1];[m1][lv]blend=all_mode=multiply,lut=c0='val*0.55',split=3[ma][mb][mc];[ma][mb][mc]mergeplanes=0x001020:yuv444p[m3];[src][smo][m3]maskedmerge,${GRADE},format=yuv444p[OUT]"
