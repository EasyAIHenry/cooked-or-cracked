// @ts-nocheck
import React from 'react';
import { useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill } from 'remotion';
const Component = ({ item }) => {
// B08 "Now this is crazy because in the past I have to use Buffer to do it." Canvas 980x500, 118 frames.
// Scene 1 (NOW): Claude spark -> one prompt -> LinkedIn tile, "!" on "crazy".
// Rewind (because, f39): a big rewind button stamps mid-card, ink speed streaks sweep left, scene 1 un-draws in
//   reverse order (! -> tick -> in -> arrow -> label -> Claude), the tab flips to rewind and the aged paper wipes in.
// Scene 2 (BEFORE): Buffer logo + 5 manual steps; a hand cursor ticks them, each trip slower and heavier;
//   the "Buffer" wordmark stamps in on "Buffer" and gets circled; "every post" lands on "to do it".
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const pop = (f, t0, d) => interpolate(f, [t0, t0 + Math.round(d * 0.58), t0 + d], [0.3, 1.08, 1], CL);
const fade = (f, t0, d) => interpolate(f, [t0, t0 + d], [0, 1], CL);
// rewind helpers: r goes 0 (intact) -> 1 (gone) linearly; the pop entrance plays backwards
const rew = (f, r0, d) => interpolate(f, [r0, r0 + d], [0, 1], CL);
const unS = (r) => interpolate(r, [0, 0.42, 1], [1, 1.08, 0.3], CL);
const unO = (r) => interpolate(r, [0.7, 1], [1, 0], CL);
const CW = 900, CH = 400, GS = 0.96;
const TICKS = [64, 70, 77, 86, 96];
const DWELL = [2, 2, 3, 3];
const ARC = [18, 14, 10, 7];
const PRESS = [0.85, 0.84, 0.82, 0.8, 0.78];
const TILE_X = [126, 288, 450, 612, 774];
const TILE_TOP = 130;
const CB_Y = 290;
const LABELS = ["copy", "open", "upload", "time", "schedule"];
const REST = { x: 838, y: 318 };
const LOGO_X0 = 450, LOGO_X1 = 296, WM_L = 352;
const CIRCLE = (() => {
  const cx = 450, cy = 63, rx = 224, ry = 50;
  const pts = [];
  const N = 80;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const a = -0.3 - t * (Math.PI * 2 + 0.6);
    const k = 1 + 0.05 * t;
    const x = cx + Math.cos(a) * rx * k;
    const y = cy + Math.sin(a) * ry * k + t * 4;
    pts.push((i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1));
  }
  return pts.join(" ");
})();
// shared Claude mark (same RAYS + Spark as B01/B06)
const RAYS = [[0, 45], [31, 37], [62, 46], [92, 38], [121, 45], [152, 36], [182, 46], [211, 37], [242, 45], [271, 37], [302, 46], [331, 38]];
const Spark = ({ size, color, sw, rot }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", transform: "rotate(" + rot + "deg)" }}>
    {RAYS.map(([a, L], i) => {
      const r = (a * Math.PI) / 180;
      return <line key={i} x1={50 + Math.cos(r) * 7} y1={50 + Math.sin(r) * 7} x2={50 + Math.cos(r) * L} y2={50 + Math.sin(r) * L} stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    })}
  </svg>
);
const STREAKS = [{ y: 92, len: 250, d: 1, w: 6 }, { y: 214, len: 360, d: 0, w: 7 }, { y: 318, len: 210, d: 2, w: 6 }];


const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;

  // ---------- card + tab ----------
  const cardS = interpolate(frame, [0, 6, 11], [0.9, 1.01, 1], CL) * GS;
  const cardY = interpolate(frame, [0, 9], [20, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  const cardO = fade(frame, 0, 3);
  const jolt = interpolate(frame, [22, 25, 29, 33], [0, 0.6, -0.5, 0], CL);
  const shakeX = interpolate(frame, [22, 24, 27, 30, 33], [0, 8, -6, 3, 0], CL);
  const cardRot = interpolate(frame, [0, 10], [-1.5, -0.8], { ...CL, easing: Easing.out(Easing.cubic) }) + jolt;
  const ageClip = interpolate(frame, [40, 50], [100, 0], { ...CL, easing: Easing.inOut(Easing.quad) });

  // tab: NOW (accent) -> flips to a rewind glyph (ink) on "because" -> widens to "BEFORE" on "past"
  const flipA = interpolate(frame, [39, 42], [1, 0], CL);
  const flipB = interpolate(frame, [42, 46], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const pastTab = frame >= 42;
  const tabSY = pastTab ? flipB : flipA;
  const tabW = pastTab ? interpolate(frame, [60, 66], [80, 262], { ...CL, easing: Easing.out(Easing.cubic) }) : 128;
  const befO = interpolate(frame, [62, 66], [0, 1], CL);

  // ---------- rewind cue ----------
  const rwS = interpolate(frame, [39, 42, 45, 49, 52], [0.3, 1.12, 1, 1, 0.55], CL);
  const rwO = interpolate(frame, [39, 40, 49, 52], [0, 1, 1, 0], CL);
  const streakX = (d) => interpolate(frame, [39 + d, 49 + d], [CW + 40, -420], CL);
  const streakO = (d) => interpolate(frame, [39 + d, 40 + d, 47 + d, 49 + d], [0, 0.55, 0.55, 0], CL);

  // ---------- scene 1 (plays forward, then un-draws in reverse order from f40) ----------
  const rEx = rew(frame, 39, 4), rOk = rew(frame, 41, 4), rIn = rew(frame, 43, 4);
  const rAr = rew(frame, 45, 4), rLb = rew(frame, 47, 4), rCl = rew(frame, 49, 4);
  const rwX = interpolate(frame, [39, 53], [0, -28], CL);
  const clS = pop(frame, 2, 12) * unS(rCl), clO = fade(frame, 2, 3) * unO(rCl);
  const arrowP = interpolate(frame, [8, 15], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) }) * (1 - rAr);
  const headP = interpolate(frame, [14, 17], [0, 1], CL) * interpolate(rAr, [0, 0.3], [1, 0], CL);
  const lblS = pop(frame, 9, 10) * unS(rLb), lblO = fade(frame, 9, 3) * unO(rLb);
  const hiP = interpolate(frame, [13, 20], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) }) * (1 - rLb);
  const inS = pop(frame, 12, 11) * unS(rIn), inO = fade(frame, 12, 3) * unO(rIn);
  const okS = pop(frame, 17, 10) * unS(rOk), okO = fade(frame, 17, 2) * unO(rOk);
  const okR = interpolate(frame, [17, 27], [-40, 0], CL) - 40 * rOk;
  const exS = pop(frame, 20, 11) * unS(rEx), exO = fade(frame, 20, 2) * unO(rEx);
  const exR = interpolate(frame, [20, 26, 31], [-20, 14, 8], CL) - 28 * rEx;
  const burstP = interpolate(frame, [23, 29], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) }) * interpolate(rEx, [0, 0.5], [1, 0], CL);

  // ---------- scene 2 (BEFORE) ----------
  const logoS = pop(frame, 51, 11), logoO = fade(frame, 51, 3);
  const logoX = interpolate(frame, [86, 92], [LOGO_X0, LOGO_X1], { ...CL, easing: Easing.out(Easing.cubic) });
  const wmS = pop(frame, 88, 9), wmO = fade(frame, 88, 2);
  const circP = interpolate(frame, [92, 102], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const noteS = pop(frame, 101, 8), noteO = fade(frame, 101, 2);
  const noteHi = interpolate(frame, [103, 108], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });

  // cursor (fingertip position in card coords): enters inside the card, each trip slower and lower
  const cb = (k) => ({ x: TILE_X[k] + 3, y: CB_Y + 5 });
  let cx, cy;
  if (frame < TICKS[0]) {
    const t = interpolate(frame, [56, 62], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
    cx = interpolate(t, [0, 1], [40, cb(0).x]);
    cy = interpolate(t, [0, 1], [304, cb(0).y]);
  } else {
    let k = 0;
    while (k < 4 && frame >= TICKS[k + 1]) k++;
    if (k >= 4) {
      const t = interpolate(frame, [TICKS[4] + 2, TICKS[4] + 8], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
      cx = interpolate(t, [0, 1], [cb(4).x, REST.x]);
      cy = interpolate(t, [0, 1], [cb(4).y, REST.y]) - Math.sin(Math.PI * t) * 6;
    } else {
      const t = interpolate(frame, [TICKS[k] + DWELL[k], TICKS[k + 1] - 1], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
      cx = interpolate(t, [0, 1], [cb(k).x, cb(k + 1).x]);
      cy = interpolate(t, [0, 1], [cb(k).y, cb(k + 1).y]) - Math.sin(Math.PI * t) * ARC[k];
    }
  }
  let press = 1;
  TICKS.forEach((T, k) => { press = Math.min(press, interpolate(frame, [T - 2, T, T + 3], [1, PRESS[k], 1], CL)); });
  const curO = fade(frame, 56, 3);

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const groupStyle = { position: "absolute", left: 40, top: 72, width: CW, height: CH, opacity: cardO, transform: "translateX(" + shakeX + "px) translateY(" + cardY + "px) rotate(" + cardRot + "deg) scale(" + cardS + ")", transformOrigin: "50% 50%" };
  const cardStyle = { position: "absolute", left: 0, top: 0, width: CW, height: CH, backgroundColor: paper, border: "3px solid " + ink, borderRadius: 10, boxShadow: "4px 6px 0 rgba(23,20,17,0.22)", boxSizing: "border-box", overflow: "hidden", zIndex: 2 };
  const ageWrap = { position: "absolute", inset: 0, clipPath: "inset(0px 0px 0px " + ageClip + "%)" };
  const ageGold = { position: "absolute", inset: 0, backgroundColor: props.gold, opacity: 0.13 };
  const ageInk = { position: "absolute", inset: 0, backgroundColor: ink, opacity: 0.05 };
  const ageRule = { position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 37px,rgba(23,20,17,0.08) 38px,transparent 39px)", boxShadow: "inset 0 0 46px rgba(23,20,17,0.14)" };
  const tabStyle = { position: "absolute", left: 26, top: -54, height: 66, width: tabW, backgroundColor: pastTab ? ink : acc, border: "3px solid " + ink, borderRadius: "12px 12px 0 0", boxSizing: "border-box", overflow: "hidden", display: "flex", alignItems: "flex-start", paddingTop: 8, paddingLeft: pastTab ? 16 : 0, justifyContent: pastTab ? "flex-start" : "center", transform: "scaleY(" + tabSY + ")", transformOrigin: "50% 100%", zIndex: 1, boxShadow: "4px 0 0 rgba(23,20,17,0.22)" };
  const tabTxt = { fontFamily: props.serif, fontWeight: 900, fontSize: 36, lineHeight: "44px", letterSpacing: 1.5, color: pastTab ? paper : ink, whiteSpace: "nowrap" };
  const content = { position: "absolute", left: 0, top: 0, width: CW, height: CH, zIndex: 3 };
  const fxClip = { position: "absolute", left: 0, top: 0, width: CW, height: CH, borderRadius: 10, overflow: "hidden", zIndex: 4 };
  const s1 = { position: "absolute", left: 0, top: 0, width: CW, height: CH, transform: "translateX(" + rwX + "px)" };

  // scene 1 pieces
  const tile = (x, y, s, o, bg) => ({ position: "absolute", left: x - 80, top: y - 80, width: 160, height: 160, borderRadius: 26, backgroundColor: bg, border: "3px solid " + ink, boxSizing: "border-box", boxShadow: "4px 6px 0 rgba(23,20,17,0.22)", opacity: o, transform: "scale(" + s + ")", display: "flex", alignItems: "center", justifyContent: "center" });
  const lblStyle = { position: "absolute", left: 300, width: 260, top: 106, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 36, lineHeight: "44px", color: ink, opacity: lblO, transform: "scale(" + lblS + ") rotate(-2deg)" };
  const hiStyle = { position: "absolute", left: 342, top: 134, width: 176 * hiP, height: 16, borderRadius: 8, backgroundColor: props.gold, opacity: 0.85 * fade(frame, 9, 3), transform: "rotate(-2deg)" };
  const okStyle = { position: "absolute", left: 682, top: 100, width: 62, height: 62, borderRadius: 31, backgroundColor: acc, border: "3px solid " + ink, boxSizing: "border-box", opacity: okO, transform: "rotate(" + okR + "deg) scale(" + okS + ")", display: "flex", alignItems: "center", justifyContent: "center" };
  const exStyle = { position: "absolute", left: 764, top: 76, width: 80, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 190, lineHeight: "220px", color: acc, textShadow: "4px 6px 0 rgba(23,20,17,0.22)", opacity: exO, transform: "rotate(" + exR + "deg) scale(" + exS + ")", transformOrigin: "50% 80%" };
  const rwStyle = { position: "absolute", left: 450 - 78, top: 200 - 78, width: 156, height: 156, borderRadius: 78, backgroundColor: paper, border: "3.5px solid " + ink, boxSizing: "border-box", boxShadow: "4px 6px 0 rgba(23,20,17,0.22)", opacity: rwO, transform: "rotate(-4deg) scale(" + rwS + ")", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 };

  // scene 2 pieces
  const logoStyle = { position: "absolute", left: logoX - 37, top: 26, width: 74, height: 74, opacity: logoO, transform: "scale(" + logoS + ")" };
  const wmStyle = { position: "absolute", left: WM_L, top: 16, height: 92, fontFamily: props.serif, fontWeight: 900, fontSize: 86, lineHeight: "92px", color: ink, letterSpacing: 0.5, whiteSpace: "nowrap", opacity: wmO, transform: "scale(" + wmS + ")", transformOrigin: "40% 55%" };
  const noteStyle = { position: "absolute", left: 300, width: 300, top: 326, height: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: noteO, transform: "rotate(-3deg) scale(" + noteS + ")", transformOrigin: "50% 60%" };
  const noteHiStyle = { position: "absolute", left: 356, top: 356, width: 214 * noteHi, height: 15, borderRadius: 8, backgroundColor: props.gold, opacity: 0.85 * noteO, transform: "rotate(-3deg)", transformOrigin: "0 50%" };

  const stepIcon = (k) => {
    const sw = 3.2;
    const g = { stroke: ink, strokeWidth: sw, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
    if (k === 0) return <g {...g}><rect x="17" y="5" width="24" height="30" rx="3" /><rect x="8" y="12" width="24" height="31" rx="3" fill={paper} /><path d="M13.5 22 H26.5 M13.5 28 H26.5 M13.5 34 H21" /></g>;
    if (k === 1) return <g {...g}><rect x="4" y="8" width="40" height="32" rx="4" fill={paper} /><path d="M4 16 H44" /><circle cx="9.5" cy="12" r="0.9" fill={ink} /><circle cx="14" cy="12" r="0.9" fill={ink} /><path d="M24 20.5 L33 25 L24 29.5 L15 25 Z" fill={ink} /><path d="M15 29.5 L24 34 L33 29.5" /></g>;
    if (k === 2) return <g {...g}><rect x="5" y="15" width="30" height="27" rx="3" fill={paper} /><circle cx="13" cy="23" r="2.6" /><path d="M8 38 L17 29 L23 35 L27 31 L32 36" /><path d="M40 21 V5 M34 11 L40 5 L46 11" /></g>;
    if (k === 3) return <g {...g}><circle cx="24" cy="26" r="16" fill={paper} /><path d="M24 26 V16 M24 26 L31 30 M20 6 H28 M24 6 V10" /></g>;
    return <g {...g}><rect x="5" y="9" width="38" height="33" rx="4" fill={paper} /><path d="M5 18 H43 M15 5 V12 M33 5 V12" /><path d="M15 30 H31 M26 25 L31 30 L26 35" /></g>;
  };

  const steps = TILE_X.map((x, k) => {
    const t0 = 52 + 2 * k;
    const s = pop(frame, t0, 10);
    const o = fade(frame, t0, 3);
    const T = TICKS[k];
    const tickP = interpolate(frame, [T, T + 5], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
    const cbS = interpolate(frame, [T, T + 3, T + 7], [1, 1.18, 1], CL);
    const ringR = interpolate(frame, [T, T + 7], [16, 36], { ...CL, easing: Easing.out(Easing.cubic) });
    const ringO = interpolate(frame, [T, T + 1, T + 7], [0, 0.5, 0], CL);
    const tileStyle = { position: "absolute", left: x - 70, top: TILE_TOP, width: 140, height: 122, borderRadius: 16, backgroundColor: paper, border: "2.5px solid " + ink, boxSizing: "border-box", boxShadow: "3px 5px 0 rgba(23,20,17,0.2)", opacity: o, transform: "scale(" + s + ") rotate(" + (k % 2 === 0 ? -1.2 : 1) + "deg)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 13 };
    const labStyle = { fontFamily: props.hand, fontWeight: 700, fontSize: 32, lineHeight: "36px", color: ink, marginTop: 6, whiteSpace: "nowrap" };
    const boxStyle = { position: "absolute", left: x - 20, top: CB_Y - 20, width: 40, height: 40, borderRadius: 7, border: "3px solid " + ink, backgroundColor: paper, boxSizing: "border-box", opacity: o, transform: "scale(" + s * cbS + ")" };
    const over = 2 * k;
    return <div key={k}>
      <div style={tileStyle}>
        <svg viewBox="0 0 48 48" style={{ width: 58, height: 58 }}>{stepIcon(k)}</svg>
        <div style={labStyle}>{LABELS[k]}</div>
      </div>
      <div style={boxStyle} />
      <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible" }}>
        <circle cx={x + 3} cy={CB_Y + 2} r={ringR} fill="none" stroke={ink} strokeWidth="3" opacity={ringO} />
        <path d={"M" + (x - 13) + " " + (CB_Y + 1) + " L" + (x - 3) + " " + (CB_Y + 11) + " L" + (x + 17 + over) + " " + (CB_Y - 17 - over)} pathLength="1" fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - tickP} />
      </svg>
    </div>;
  });

  const handW = 56, handH = 64;
  const handStyle = { position: "absolute", left: cx - 10 * (handW / 28), top: cy - 1.6 * (handH / 32), width: handW, height: handH, opacity: curO, transform: "scale(" + press + ")", transformOrigin: "36% 5%", filter: "drop-shadow(3px 4px 0 rgba(23,20,17,0.25))", zIndex: 5 };

  return <div style={rootStyle}>
    <div style={groupStyle}>
      <div style={tabStyle}>
        {pastTab ? <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg viewBox="0 0 40 26" style={{ width: 44, height: 30, flexShrink: 0 }}><path d="M19 3 L3 13 L19 23 Z M37 3 L21 13 L37 23 Z" fill={paper} stroke={paper} strokeWidth="2.5" strokeLinejoin="round" /></svg>
          <div style={{ ...tabTxt, opacity: befO }}>BEFORE</div>
        </div> : <div style={tabTxt}>NOW</div>}
      </div>
      <div style={cardStyle}>
        <div style={ageWrap}>
          <div style={ageGold} />
          <div style={ageInk} />
          <div style={ageRule} />
        </div>
      </div>
      <div style={content}>
        {/* scene 1 */}
        <div style={s1}>
          <div style={tile(220, 202, clS, clO, paper)}>
            <Spark size={128} color={acc} sw={10.5} rot={0} />
          </div>
          <div style={hiStyle} />
          <div style={lblStyle}>one prompt</div>
          <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible" }}>
            <path d="M318 202 L536 202" pathLength="1" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - arrowP} opacity={arrowP > 0.01 ? 1 : 0} />
            <path d="M518 186 L540 202 L518 218" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={headP} />
            <g stroke={ink} strokeWidth="5" strokeLinecap="round" opacity={exO}>
              <path d="M838 90 L856 66" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - burstP} />
              <path d="M852 124 L876 117" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - burstP} />
              <path d="M804 70 L804 44" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - burstP} />
            </g>
          </svg>
          <div style={tile(640, 202, inS, inO, ink)}>
            <div style={{ position: "absolute", right: 17, bottom: 4, fontFamily: props.sans, fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: -3.5, color: paper }}>in</div>
          </div>
          <div style={okStyle}>
            <svg viewBox="0 0 24 24" style={{ width: 36, height: 36 }}><path d="M5 12.5 L10 17 L19 7" fill="none" stroke={ink} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={exStyle}>!</div>
        </div>

        {/* scene 2 */}
        <svg viewBox="0 0 48 48" style={logoStyle}>
          <path d="M24 5 L43 14.5 L24 24 L5 14.5 Z" fill={ink} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M5 23.5 L24 33 L43 23.5" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 32.5 L24 42 L43 32.5" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={wmStyle}>Buffer</div>
        {steps}
        <div style={noteHiStyle} />
        <div style={noteStyle}>
          <svg viewBox="0 0 40 40" style={{ width: 40, height: 40, flexShrink: 0 }}>
            <path d="M31 13 A13 13 0 1 0 33 24" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <path d="M24 12 L32 13 L33 5" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 38, lineHeight: "46px", color: ink, whiteSpace: "nowrap" }}>every post</div>
        </div>
        <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible" }}>
          <path d={CIRCLE} pathLength="1" fill="none" stroke={acc} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - circP} opacity={circP > 0 ? 1 : 0} />
        </svg>
        <svg viewBox="0 0 28 32" style={handStyle}>
          <path d="M8 18.5 L8 3.8 A2.2 2.2 0 0 1 12.4 3.8 L12.4 13 A2.2 2.2 0 0 1 16.8 13 L16.8 14.2 A2.2 2.2 0 0 1 21.2 14.2 L21.2 15.6 A2.2 2.2 0 0 1 25.6 15.6 L25.6 22 Q25.6 30.5 17.5 30.5 L14 30.5 Q10.5 30.5 8.6 27.6 L3.4 20.6 A2.1 2.1 0 0 1 6.6 18 Z" fill={paper} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12.4 13 V18 M16.8 14.2 V18.6 M21.2 15.6 V19.2" fill="none" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      {/* rewind fx, clipped to the card */}
      <div style={fxClip}>
        <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH }}>
          {STREAKS.map((s, i) => {
            const x = streakX(s.d);
            return <g key={i} opacity={streakO(s.d)}>
              <line x1={x} y1={s.y} x2={x + s.len} y2={s.y} stroke={ink} strokeWidth={s.w} strokeLinecap="round" />
              <line x1={x + 40} y1={s.y + 16} x2={x + 40 + s.len * 0.45} y2={s.y + 16} stroke={ink} strokeWidth={3} strokeLinecap="round" />
            </g>;
          })}
        </svg>
      </div>
      <div style={rwStyle}>
        <svg viewBox="0 0 40 26" style={{ width: 86, height: 56, marginLeft: -6 }}><path d="M19 3 L3 13 L19 23 Z M37 3 L21 13 L37 23 Z" fill={ink} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" /></svg>
      </div>
    </div>
  </div>;
};

return __Inner({ item });
};

export default Component;
