// @ts-nocheck
import React from 'react';
import { useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill } from 'remotion';
const Component = ({ item }) => {
// B01 "So the true test is does it run on my LinkedIn?" Canvas 980x500, 96 frames. ChatCut motion graphic (Remotion runtime).
// Phase 1 (So / the true / test): a paper flask pops and fills, "the true" writes on, "TEST" stamps on a torn label, underline draws.
// Phase 2 (is): the title condenses into one row at the top while the flask drops into the middle of the rig as the test chamber.
// does it: the Claude spark tile pops, a dashed wire reaches out to an empty slot. run: an orange pulse runs from Claude along
// the wire (dashes turn orange behind it) into the flask, the liquid surges. my LinkedIn: the LinkedIn tile pops into the slot,
// and an orange "?" bubble rises out of the flask: the Claude-to-LinkedIn run is not proven yet. Final state holds still from f86.
const CB = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const OUT = Easing.out(Easing.cubic);
const IO = Easing.inOut(Easing.cubic);
const lerp = (a, b, t) => a + (b - a) * t;
const pop = (frame, s, rotFrom, rotTo) => {
  const t = frame - s;
  return {
    op: interpolate(t, [0, 1], [0, 1], CB),
    sc: interpolate(t, [0, 7, 12], [0.3, 1.08, 1], CB),
    rot: interpolate(t, [0, 7, 12], [rotFrom, rotTo - (rotFrom - rotTo) * 0.12, rotTo], CB),
  };
};
const popQuick = (frame, s) => {
  const t = frame - s;
  return { op: interpolate(t, [0, 1], [0, 1], CB), sc: interpolate(t, [0, 4, 7], [0.3, 1.15, 1], CB), rot: 0 };
};
const popStyle = (p) => ({ opacity: p.op, transform: "rotate(" + p.rot + "deg) scale(" + p.sc + ")" });
// wire: cubic bezier between the two tiles, sagging through the flask in the middle
const P0 = [284, 312], P1 = [390, 345], P2 = [590, 345], P3 = [696, 312];
const bez = (t) => {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * P0[0] + b * P1[0] + c * P2[0] + d * P3[0], a * P0[1] + b * P1[1] + c * P2[1] + d * P3[1]];
};
const WIRE_D = "M" + P0[0] + " " + P0[1] + " C" + P1[0] + " " + P1[1] + " " + P2[0] + " " + P2[1] + " " + P3[0] + " " + P3[1];
// Claude spark: rays from the centre of the tile
const RAYS = [[0, 58], [31, 50], [62, 60], [92, 52], [121, 59], [152, 49], [182, 60], [211, 51], [242, 58], [271, 50], [302, 60], [331, 52]];
const FLASK_D = "M62 16 V72 L18 166 Q12 182 30 182 H120 Q138 182 132 166 L88 72 V16";


const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const acc = props.accent;
  const paper = props.paper;
  const shadow = "4px 6px 0 rgba(23,20,17,0.22)";
  const dropShadow = "drop-shadow(4px 6px 0 rgba(23,20,17,0.22))";
  const tornClip = "polygon(0% 5%,14% 0%,30% 4%,45% 1%,60% 4%,74% 0%,88% 3%,100% 1%,99% 96%,84% 100%,70% 96%,55% 100%,40% 96%,25% 99%,11% 96%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 21px,#DEDAD3 22px,transparent 23px)";

  // ---- phase 1: flask, "the true", TEST stamp, underline
  const flaskPop = pop(frame, 2, -14, -3);
  const liquid = interpolate(frame, [6, 18], [182, 116], { ...CB, easing: OUT }) + interpolate(frame, [67, 71, 75], [0, -16, -12], CB);
  const bub1 = interpolate(frame, [12, 13], [0, 1], CB);
  const bub2 = interpolate(frame, [15, 16], [0, 1], CB);
  const writeOn = interpolate(frame, [13, 23], [100, 0], { ...CB, easing: OUT });
  const tStamp = frame - 25;
  const stampOp = interpolate(tStamp, [0, 1], [0, 1], CB);
  const stampSc = interpolate(tStamp, [0, 5, 10], [1.22, 0.96, 1], CB);
  const stampRt = interpolate(tStamp, [0, 5, 10], [4, -3.5, -2.5], CB);
  const under = interpolate(frame, [28, 37], [0, 1], { ...CB, easing: OUT });

  // ---- "is": lift. Title condenses to one row at the top; flask drops into the rig as the test chamber.
  const L = interpolate(frame, [40, 49], [0, 1], { ...CB, easing: IO });
  // flask drops first, then slides right, so it passes under the rising title instead of through it
  const Ld = interpolate(frame, [40, 45], [0, 1], { ...CB, easing: OUT });
  const Lx = interpolate(frame, [42, 49], [0, 1], { ...CB, easing: IO });
  const flaskCx = lerp(225, 490, Lx), flaskCy = lerp(266, 316, Ld), flaskS = flaskPop.sc * lerp(1, 0.8, L);
  // "the true" leads by a frame and TEST follows by a frame, so the two never cross mid-move
  const Lt = interpolate(frame, [39, 47], [0, 1], { ...CB, easing: IO });
  const Ls = interpolate(frame, [41, 49], [0, 1], { ...CB, easing: IO });
  const trueX = lerp(342, 262, Lt), trueY = lerp(100, 58, Lt), trueS = lerp(1, 0.6, Lt);
  const testX = lerp(326, 438, Ls), testY = lerp(190, 28, Ls), testS = lerp(1, 0.54, Ls);

  // ---- phase 2: the test rig
  const claude = pop(frame, 48, -24, -3);
  const sparkRot = interpolate(frame, [48, 62], [-60, 0], { ...CB, easing: OUT });
  const claudeLbl = pop(frame, 52, 6, -2);
  const slotOp = interpolate(frame, [52, 56], [0, 1], CB) * interpolate(frame, [72, 74], [1, 0], CB);
  const draw = interpolate(frame, [54, 62], [0, 1], { ...CB, easing: OUT });
  const tip = bez(Math.max(draw, 0.001));
  const wireOp = interpolate(frame, [54, 55], [0, 1], CB);
  const pt = interpolate(frame, [60, 68], [0, 0.5], { ...CB, easing: Easing.inOut(Easing.quad) });
  const pulse = bez(pt);
  const pulseOp = interpolate(frame, [59, 60], [0, 1], CB);
  const li = pop(frame, 71, 20, 3);
  const liLbl = pop(frame, 73, -6, 2);
  const q = pop(frame, 73, 24, -3);
  const qX = interpolate(frame - 73, [0, 10], [490, 546], { ...CB, easing: OUT });
  const qY = interpolate(frame - 73, [0, 8, 12], [262, 184, 190], CB);
  const qb1 = popQuick(frame, 75);
  const qb2 = popQuick(frame, 77);

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const tileBase = { position: "absolute", top: 222, width: 180, height: 180, borderRadius: 34, boxSizing: "border-box", boxShadow: shadow };
  const lbl = { position: "absolute", top: 414, width: 300, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 46, lineHeight: 1.1, color: ink, whiteSpace: "nowrap" };

  return <div style={rootStyle}>
    {/* wire + pulse (behind tiles and flask) */}
    <svg width="980" height="500" viewBox="0 0 980 500" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id="b01wire"><rect x="0" y="0" width={tip[0]} height="500" /></clipPath>
        <clipPath id="b01trail"><rect x="0" y="0" width={pulse[0]} height="500" /></clipPath>
      </defs>
      <rect x="712" y="224" width="176" height="176" rx="32" fill="none" stroke={ink} strokeOpacity="0.3" strokeWidth="4" strokeDasharray="14 12" opacity={slotOp} />
      <g clipPath="url(#b01wire)" opacity={wireOp}>
        <path d={WIRE_D} fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeDasharray="18 16" />
      </g>
      <g clipPath="url(#b01trail)" opacity={pulseOp}>
        <path d={WIRE_D} fill="none" stroke={acc} strokeWidth="8" strokeLinecap="round" strokeDasharray="18 16" />
      </g>
      <circle cx={P0[0]} cy={P0[1]} r="9" fill={paper} stroke={ink} strokeWidth="3" opacity={wireOp} />
      <circle cx={tip[0]} cy={tip[1]} r="9" fill={paper} stroke={ink} strokeWidth="3" opacity={wireOp} />
      <circle cx={pulse[0]} cy={pulse[1]} r="13" fill={acc} stroke={ink} strokeWidth="3" opacity={pulseOp} />
    </svg>

    {/* the open question: rises out of the flask mouth (behind the flask) */}
    <div style={{ position: "absolute", left: 494 - 6, top: 238 - 6, width: 12, height: 12, borderRadius: 6, backgroundColor: acc, border: "2.5px solid " + ink, boxSizing: "border-box", ...popStyle(qb1) }} />
    <div style={{ position: "absolute", left: 503 - 9, top: 222 - 9, width: 18, height: 18, borderRadius: 9, backgroundColor: acc, border: "3px solid " + ink, boxSizing: "border-box", ...popStyle(qb2) }} />
    <div style={{ position: "absolute", left: qX - 46, top: qY - 46, width: 92, height: 92, borderRadius: 46, backgroundColor: acc, border: "3px solid " + ink, boxSizing: "border-box", boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", ...popStyle(q) }}>
      <div style={{ fontFamily: props.serif, fontWeight: 900, fontSize: 72, lineHeight: 1, color: ink, marginTop: 4 }}>?</div>
    </div>

    {/* flask: hero in phase 1, test chamber on the wire in phase 2 */}
    <svg width="150" height="200" viewBox="0 0 150 200" style={{ position: "absolute", left: flaskCx - 75, top: flaskCy - 100, overflow: "visible", filter: dropShadow, opacity: flaskPop.op, transformOrigin: "75px 100px", transform: "rotate(" + flaskPop.rot + "deg) scale(" + flaskS + ")" }}>
      <defs>
        <clipPath id="b01flask"><path d={FLASK_D + " Z"} /></clipPath>
      </defs>
      <path d={FLASK_D + " Z"} fill={paper} />
      <rect x="0" y={liquid} width="150" height="200" fill={acc} clipPath="url(#b01flask)" />
      <path d={"M14 " + liquid + " H136"} stroke={ink} strokeWidth="4" clipPath="url(#b01flask)" />
      <path d={FLASK_D} fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M50 16 H100" stroke={ink} strokeWidth="7" strokeLinecap="round" />
      <circle cx="66" cy="150" r="8" fill={paper} stroke={ink} strokeWidth="3" opacity={bub1} />
      <circle cx="90" cy="136" r="5" fill={props.gold} stroke={ink} strokeWidth="3" opacity={bub2} />
    </svg>

    {/* TEST stamp + underline */}
    <div style={{ position: "absolute", left: testX, top: testY, width: 525, height: 200, transformOrigin: "0 0", transform: "scale(" + testS + ")" }}>
      <div style={{ position: "absolute", left: 0, top: 0, filter: dropShadow, transformOrigin: "8% 25%", opacity: stampOp, transform: "rotate(" + stampRt + "deg) scale(" + stampSc + ")" }}>
        <div style={{ padding: "6px 34px 0 34px", backgroundColor: paper, backgroundImage: ruled, clipPath: tornClip, fontFamily: props.serif, fontWeight: 900, fontSize: 160, lineHeight: 1.04, letterSpacing: 4, color: ink }}>TEST</div>
      </div>
      <svg width="440" height="30" viewBox="0 0 440 30" style={{ position: "absolute", left: 24, top: 170, overflow: "visible" }}>
        <path d="M8 18 Q120 6 220 14 T432 10" fill="none" stroke={acc} strokeWidth="17" strokeLinecap="round" strokeDasharray="460" strokeDashoffset={460 * (1 - under)} />
      </svg>
    </div>

    {/* "the true" (above the stamp so the lift never hides it) */}
    <div style={{ position: "absolute", left: trueX, top: trueY, transformOrigin: "0 0", transform: "scale(" + trueS + ") rotate(-3deg)" }}>
      <div style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 73, lineHeight: 1.1, color: acc, whiteSpace: "nowrap", clipPath: "inset(-10% " + writeOn + "% -10% 0)" }}>the true</div>
    </div>

    {/* Claude tile */}
    <div style={{ ...tileBase, left: 90, backgroundColor: paper, border: "3px solid " + ink, ...popStyle(claude) }}>
      <svg width="174" height="174" viewBox="0 0 174 174" style={{ position: "absolute", left: 0, top: 0, transform: "rotate(" + sparkRot + "deg)" }}>
        {RAYS.map(([a, Ln], i) => {
          const r = (a * Math.PI) / 180;
          return <line key={i} x1={87 + Math.cos(r) * 8} y1={87 + Math.sin(r) * 8} x2={87 + Math.cos(r) * Ln} y2={87 + Math.sin(r) * Ln} stroke={acc} strokeWidth="15" strokeLinecap="round" />;
        })}
      </svg>
    </div>
    <div style={{ ...lbl, left: 30, ...popStyle(claudeLbl) }}>Claude</div>

    {/* LinkedIn tile (fully opaque from its first visible frame; the pop's scale does the entrance) */}
    <div style={{ ...tileBase, left: 710, backgroundColor: ink, ...popStyle(li) }}>
      <div style={{ position: "absolute", right: 22, bottom: 8, fontFamily: props.sans, fontWeight: 800, fontSize: 118, lineHeight: 1, letterSpacing: -4, color: paper }}>in</div>
    </div>
    <div style={{ ...lbl, left: 650, ...popStyle(liLbl) }}><span style={{ color: acc, fontFamily: props.hand, fontWeight: 700, fontSize: 48 }}>my</span> LinkedIn</div>
  </div>;
};

return __Inner({ item });
};

export default Component;
