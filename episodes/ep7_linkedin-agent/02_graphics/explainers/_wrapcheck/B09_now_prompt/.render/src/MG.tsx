// @ts-nocheck
import React from 'react';
import { useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill } from 'remotion';
const Component = ({ item }) => {
// B09 "now with this prompt, it can be done entirely through Claude, as long as you have the right measures to connect
// to LinkedIn." Canvas 980x500, 197 frames @30fps.
// f0 = B08's last frame exactly (B08 constants: card 900x400 at 40,72, rotate -0.8deg scale 0.96, aged paper, Buffer
//   circled, five ticked tiles, "every post" note, hand at rest). Everything lives on that same card.
// Scene A "now with this prompt" (0-36): NOW stamps big in the centre and docks into the tab slot as the BEFORE tab
//   flips shut; the aged paper wipes clean from the stamp; Buffer, the hand and "every post" leave; the five tiles drop
//   their labels and grey out; a Claude prompt bar pops where Buffer was and types "post this to my LinkedIn".
// Scene B "it can be done entirely through Claude" (33-103): send; the same five boxes tick in accent in a fast cascade
//   (no hand); "entirely": a thick accent brace gathers all five (card punch, chip ripple); "through Claude": the bar's
//   spark flies down into a big Claude pill at the brace's tip.
// Scene C "as long as you have the right measures to connect to LinkedIn" (103-197): callback to B08's NOW card. The
//   pill morphs into B08's Claude tile, a ghost LinkedIn tile ('in' anchored bottom-right, shared set mark) and a "?" gap appear; a plug leaves Claude and covers the
//   gap; a lock and the tag "via Buffer API / LinkedIn-approved" hang on it; it snaps in, LinkedIn powers on, the post
//   rides the cable, B08's tick badge stamps.
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const tw = (f, a, b, x, y, e) => interpolate(f, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e || Easing.out(Easing.cubic) });
const lin = (f, a, b, x, y) => interpolate(f, [a, b], [x, y], CL);
const pop = (f, t0, d) => interpolate(f, [t0, t0 + Math.round(d * 0.58), t0 + d], [0.3, 1.08, 1], CL);
const fade = (f, t0, d) => interpolate(f, [t0, t0 + d], [0, 1], CL);
// exits: a quick reverse pop
const outS = (f, t0, d) => interpolate(f, [t0, t0 + Math.round(d * 0.35), t0 + d], [1, 1.06, 0.3], CL);
const outO = (f, t0, d) => interpolate(f, [t0 + Math.round(d * 0.55), t0 + d], [1, 0], CL);
const lerp = (a, b, t) => a + (b - a) * t;
const rgba = (hex, a) => {
  const h = String(hex).replace("#", "");
  return "rgba(" + parseInt(h.slice(0, 2), 16) + "," + parseInt(h.slice(2, 4), 16) + "," + parseInt(h.slice(4, 6), 16) + "," + a + ")";
};
const SHADOW = "4px 6px 0 rgba(23,20,17,0.22)";

// ---------- B08 constants (its final frame is B09's f0)
const CW = 900, CH = 400, GS = 0.96;
const TILE_X = [126, 288, 450, 612, 774];
const TILE_TOP = 130;
const CB_Y = 290;
const LABELS = ["copy", "open", "upload", "time", "schedule"];
const REST = { x: 838, y: 318 };
const LOGO_X1 = 296, WM_L = 352;
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
// shared Claude mark (B01/B06 RAYS + B06 Spark): 12 rays, no centre dot
const RAYS = [[0, 45], [31, 37], [62, 46], [92, 38], [121, 45], [152, 36], [182, 46], [211, 37], [242, 45], [271, 37], [302, 46], [331, 38]];
const Spark = ({ size, color, rot }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", transform: "rotate(" + (rot || 0) + "deg)" }}>
    {RAYS.map(([a, L], i) => {
      const r = (a * Math.PI) / 180;
      return <line key={i} x1={50 + Math.cos(r) * 7} y1={50 + Math.sin(r) * 7} x2={50 + Math.cos(r) * L} y2={50 + Math.sin(r) * L} stroke={color} strokeWidth={11} strokeLinecap="round" />;
    })}
  </svg>
);

// ---------- B09 layout (card coords)
const CHIP_TOP = 120, CHIP_W = 132, CHIP_H = 88, CB1 = 234;
const TICKS = [44, 47, 50, 53, 56];
const BAR_L = 130, BAR_T = 26, BAR_W = 640, BAR_H = 80;
const PILL = { l: 300, t: 302, w: 300, h: 64 };
const SPK0 = { x: 345, y: 334, s: 48 };
const TXT0 = { x: 474, y: 334 };
const ROW = 152, CLX = 190, LIX = 710;
const SPK1 = { x: CLX, y: ROW, s: 112 };
const TXT1 = { x: CLX, y: ROW + 114, k: 40 / 56 };
const BX0 = 168, BX1 = 446, BX2 = 494;
const TAG_CX = 500, TAG_T = 256, TAG_W = 344, TAG_H = 112;


const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const f = frame;
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;
  const EIO = Easing.inOut(Easing.cubic);
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };

  // ---------- card (B08's group) + punch on "entirely"
  const punch = interpolate(f, [64, 67, 72], [1, 1.025, 1], CL);
  const groupStyle = { position: "absolute", left: 40, top: 72, width: CW, height: CH, transform: "translateX(0px) translateY(0px) rotate(-0.8deg) scale(" + GS * punch + ")", transformOrigin: "50% 50%" };
  const cardStyle = { position: "absolute", left: 0, top: 0, width: CW, height: CH, backgroundColor: paper, border: "3px solid " + ink, borderRadius: 10, boxShadow: "4px 6px 0 rgba(23,20,17,0.22)", boxSizing: "border-box", overflow: "hidden", zIndex: 2 };
  const content = { position: "absolute", left: 0, top: 0, width: CW, height: CH, zIndex: 3 };

  // ---------- "now": aged paper wipes clean from the stamp, B08 leftovers leave
  const wipeR = tw(f, 3, 13, 0, 560);
  const ageMask = "radial-gradient(circle at 447px 197px, transparent " + wipeR + "px, black " + (wipeR + 1) + "px)";
  const ageWrap = f < 3 ? { position: "absolute", inset: 0, clipPath: "inset(0px 0px 0px 0%)" } : { position: "absolute", inset: 0, WebkitMaskImage: ageMask, maskImage: ageMask };
  const ringO = lin(f, 3, 5, 0, 0.85) * lin(f, 9, 13, 1, 0);
  const befSY = tw(f, 1, 4, 1, 0, Easing.in(Easing.quad));
  const hdSY = tw(f, 1, 5, 1, 0, Easing.in(Easing.quad));
  const handE = tw(f, 1, 5, 0, 1, Easing.in(Easing.quad));
  const noteE = tw(f, 1, 8, 0, 1, Easing.in(Easing.quad));
  const noteHiE = tw(f, 1, 5, 0, 1, Easing.in(Easing.quad));

  // ---------- NOW stamp: lands big at the centre, docks into the tab slot by f12
  const dock = tw(f, 7, 12, 0, 1, EIO);
  const stPop = interpolate(f, [1, 4, 6], [0.3, 1.1, 1], CL);
  const stK = lerp(2.4, 1, dock) * stPop;
  const stDX = lerp(360, 0, dock), stDY = lerp(221.5, 0, dock);
  const stRot = lerp(-4, 0, dock);
  const stBR = lerp(12, 0, dock);

  // ---------- tiles -> chips, ticks
  const m = tw(f, 3, 12, 0, 1, EIO);
  const grey = tw(f, 2, 10, 0, 1);
  const labO = lin(f, 2, 6, 1, 0);
  const oldTick = tw(f, 1, 5, 0, 1, Easing.in(Easing.quad));
  const cbY = lerp(CB_Y, CB1, m);
  const tW = lerp(140, CHIP_W, m), tH = lerp(122, CHIP_H, m), tTop = lerp(TILE_TOP, CHIP_TOP, m);
  const tPad = lerp(13, (CHIP_H - 5 - 58) / 2, m);

  // ---------- prompt bar ("with this prompt")
  const barS = pop(f, 13, 11) * outS(f, 101, 7);
  const barO = fade(f, 13, 3) * outO(f, 101, 7);
  const PROMPT = "post this to my LinkedIn";
  const typed = PROMPT.slice(0, Math.round(lin(f, 16, 31, 0, PROMPT.length)));
  const caretOn = f >= 15 && f < 36;
  const sendHot = lin(f, 29, 32, 0, 1);
  const sendK = interpolate(f, [33, 35, 39], [1, 0.82, 1], CL);
  const sendRing = lin(f, 34, 42, 0, 1);
  const barSpin = tw(f, 34, 47, 0, 90);
  const barSparkK = interpolate(f, [82, 85, 89], [1, 1.35, 1], CL);

  // ---------- "entirely": brace gathers all five; "through Claude": spark flies into the pill
  const braceP = tw(f, 62, 72, 0, 1, Easing.out(Easing.quad)) * (1 - lin(f, 101, 105, 0, 1));
  const flyT = lin(f, 83, 90, 0, 1);
  const flyX = lerp(BAR_L + 3 + 16 + 23, SPK0.x, Easing.out(Easing.cubic)(flyT));
  const flyY = lerp(BAR_T + 3 + 14 + 23, SPK0.y, Easing.in(Easing.quad)(flyT));
  const flyK = lerp(46, SPK0.s, flyT) * (1 + 0.3 * Math.sin(Math.PI * flyT));
  const flyOn = f >= 83 && f < 90;
  const pillPop = pop(f, 87, 11);
  const pillO = fade(f, 87, 2);
  const txtO = fade(f, 89, 2);
  const txtPop = interpolate(f, [89, 93, 97], [0.6, 1.06, 1], CL);

  // ---------- scene C: pill -> Claude tile (B08 style), ghost LinkedIn tile, gap, plug
  const mo = tw(f, 103, 112, 0, 1, EIO);
  const pL = lerp(PILL.l, CLX - 80, mo), pT = lerp(PILL.t, ROW - 80, mo), pW = lerp(PILL.w, 160, mo), pH = lerp(PILL.h, 160, mo), pR = lerp(32, 26, mo);
  const sX = lerp(SPK0.x, SPK1.x, mo), sY = lerp(SPK0.y, SPK1.y, mo), sS = lerp(SPK0.s, SPK1.s, mo);
  // the word leaves the pill first, then re-lands as the tile's label (no collision with the moving spark)
  const lab = f >= 109;
  const tX = lab ? TXT1.x : TXT0.x, tY = lab ? TXT1.y : TXT0.y;
  const tK = lab ? TXT1.k * pop(f, 109, 10) : 1;
  const tOp = lab ? fade(f, 109, 2) : lin(f, 102, 104, 1, 0);

  const liS = pop(f, 108, 12), liO = fade(f, 108, 3);
  const dotsP = tw(f, 110, 118, 0, 1);
  const dotsO = fade(f, 110, 2);
  const qS = pop(f, 110, 12) * interpolate(f, [126, 129], [1, 0.3], CL);
  const qO = fade(f, 110, 3) * lin(f, 128, 129, 1, 0);
  const bx = tw(f, 121, 137, BX0, BX1) + tw(f, 160, 165, 0, BX2 - BX1, Easing.in(Easing.quad));
  const plugO = fade(f, 121, 2);
  const powered = f >= 165;
  const liPunch = interpolate(f, [165, 167, 172], [1, 1.08, 1], CL);
  const liJolt = interpolate(f, [165, 167, 172], [0, 6, 0], CL);
  const cableEnd = bx - 18;
  const CX0 = CLX + 80;
  const cd = Math.max(cableEnd - CX0, 1);
  const sag = Math.min(30, cd * 0.14);
  const cablePath = "M " + CX0 + " " + ROW + " C " + (CX0 + cd / 3) + " " + (ROW + sag) + ", " + (cableEnd - cd / 3) + " " + (ROW + sag) + ", " + cableEnd + " " + ROW;
  const cableCol = interpolateColors(tw(f, 166, 172, 0, 1), [0, 1], [ink, acc]);
  const dotsX0 = Math.max(CX0 + 10, bx + 100 + 34);
  const dotsX1 = CX0 + 10 + (LIX - 92 - CX0 - 10) * dotsP;
  const lockS = pop(f, 143, 11), lockO = fade(f, 143, 2);
  const tagO = fade(f, 146, 2);
  const tagDrop = interpolate(f, [146, 153, 158], [-40, 3, 0], CL);
  const tagRot = interpolate(f, [146, 153, 158, 162], [-8, 2, -2.5, -2], CL);
  const holeY = TAG_T + 16 + tagDrop;
  const burstT = lin(f, 165, 173, 0, 1);
  const burstO = fade(f, 165, 1) * lin(f, 171, 177, 1, 0);
  const pt = tw(f, 166, 176, 0, 1, Easing.inOut(Easing.quad));
  const bz = (p0, p1, p2, p3, t) => (1 - t) * (1 - t) * (1 - t) * p0 + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * p3;
  const pkX = bz(CX0, CX0 + cd / 3, cableEnd - cd / 3, cableEnd, pt);
  const pkY = bz(ROW, ROW + sag, ROW + sag, ROW, pt);
  const pkO = fade(f, 166, 2) * lin(f, 174, 176, 1, 0);
  const okS = pop(f, 176, 10), okO = fade(f, 176, 2);
  const okR = interpolate(f, [176, 186], [-40, 0], CL);

  // ---------- B08 step icons (exact copy)
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
    const T = TICKS[k];
    const re = lin(f, T - 1, T + 2, 0, 1);
    const inkA = 1 - 0.7 * grey + 0.7 * re;
    const inkC = inkA >= 0.999 ? ink : rgba(ink, +inkA.toFixed(3));
    const B = 62 + 4 * Math.abs(k - 2);
    const tileK = interpolate(f, [T, T + 3, T + 8], [1, 1.07, 1], CL) * interpolate(f, [B, B + 3, B + 7], [1, 1.07, 1], CL);
    const cbS = interpolate(f, [T, T + 3, T + 7], [1, 1.18, 1], CL);
    const sh = 0.2 * (1 - 0.7 * grey + 0.7 * re);
    const tileStyle = { position: "absolute", left: x - tW / 2, top: tTop, width: tW, height: tH, borderRadius: 16, backgroundColor: paper, border: "2.5px solid " + inkC, boxSizing: "border-box", boxShadow: "3px 5px 0 rgba(23,20,17," + +sh.toFixed(3) + ")", opacity: 1, transform: "scale(" + tileK + ") rotate(" + (k % 2 === 0 ? -1.2 : 1) + "deg)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: tPad };
    const labStyle = { fontFamily: props.hand, fontWeight: 700, fontSize: 32, lineHeight: "36px", color: ink, marginTop: 6, whiteSpace: "nowrap", opacity: labO, transform: labO < 1 ? "translateY(" + 8 * (1 - labO) + "px)" : "none" };
    const boxStyle = { position: "absolute", left: x - 20, top: cbY - 20, width: 40, height: 40, borderRadius: 7, border: "3px solid " + inkC, backgroundColor: paper, boxSizing: "border-box", opacity: 1, transform: "scale(" + cbS + ")" };
    const over = 2 * k;
    const tickP = tw(f, T, T + 4, 0, 1);
    const ringR = tw(f, T, T + 8, 16, 38);
    const rO = interpolate(f, [T, T + 1, T + 8], [0, 0.8, 0], CL);
    const iconO = 1 - 0.65 * grey + 0.65 * re;
    const wrap = f >= 101 ? { position: "absolute", left: 0, top: 0, width: CW, height: CH, transform: "scale(" + outS(f, 101 + (k % 2), 6) + ")", transformOrigin: x + "px 180px", opacity: outO(f, 101 + (k % 2), 6) } : { position: "absolute", left: 0, top: 0, width: CW, height: CH };
    return <div key={k} style={wrap}>
      <div style={tileStyle}>
        <svg viewBox="0 0 48 48" style={{ width: 58, height: 58, flexShrink: 0, opacity: iconO }}>{stepIcon(k)}</svg>
        {f < 7 ? <div style={labStyle}>{LABELS[k]}</div> : null}
      </div>
      <div style={boxStyle} />
      <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible" }}>
        {oldTick < 1 ? <path d={"M" + (x - 13) + " " + (cbY + 1) + " L" + (x - 3) + " " + (cbY + 11) + " L" + (x + 17 + over) + " " + (cbY - 17 - over)} pathLength="1" fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={oldTick} /> : null}
        {f >= T ? <circle cx={x + 3} cy={cbY + 2} r={ringR} fill="none" stroke={acc} strokeWidth="3.5" opacity={rO} /> : null}
        {f >= T ? <path d={"M" + (x - 13) + " " + (cbY + 1) + " L" + (x - 3) + " " + (cbY + 11) + " L" + (x + 17) + " " + (cbY - 17)} pathLength="1" fill="none" stroke={acc} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - tickP} /> : null}
      </svg>
    </div>;
  });

  // B08 hand (at REST) lifts off up-right and is gone by f5
  const handW = 56, handH = 64;
  const handStyle = { position: "absolute", left: REST.x - 10 * (handW / 28) + 18 * handE, top: REST.y - 1.6 * (handH / 32) - 30 * handE, width: handW, height: handH, opacity: 1 - handE, transform: "scale(1)", transformOrigin: "36% 5%", filter: "drop-shadow(3px 4px 0 rgba(23,20,17,0.25))", zIndex: 5 };
  // B08 "every post" note leaves on "now"
  const noteS = lerp(1, 0.45, noteE);
  const noteO = 1 - lin(f, 4, 8, 0, 1);
  const noteHiStyle = { position: "absolute", left: 356, top: 356, width: 214 * (1 - noteHiE), height: 15, borderRadius: 8, backgroundColor: gold, opacity: 0.85, transform: "rotate(-3deg)", transformOrigin: "0 50%" };
  const noteStyle = { position: "absolute", left: 300, width: 300, top: 326 + 14 * noteE, height: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: noteO, transform: "rotate(-3deg) scale(" + noteS + ")", transformOrigin: "50% 60%" };

  const tabTxt = { fontFamily: props.serif, fontWeight: 900, fontSize: 36, lineHeight: "44px", letterSpacing: 1.5, whiteSpace: "nowrap" };

  return (
    <div style={rootStyle}>
      <div style={groupStyle}>
        {/* ===== tabs: B08's BEFORE flips shut, the NOW stamp docks into B08's NOW tab ===== */}
        {f < 4 ? <div style={{ position: "absolute", left: 26, top: -54, height: 66, width: 262, backgroundColor: ink, border: "3px solid " + ink, borderRadius: "12px 12px 0 0", boxSizing: "border-box", overflow: "hidden", display: "flex", alignItems: "flex-start", paddingTop: 8, paddingLeft: 16, justifyContent: "flex-start", transform: "scaleY(" + befSY + ")", transformOrigin: "50% 100%", zIndex: 1, boxShadow: "4px 0 0 rgba(23,20,17,0.22)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg viewBox="0 0 40 26" style={{ width: 44, height: 30, flexShrink: 0 }}><path d="M19 3 L3 13 L19 23 Z M37 3 L21 13 L37 23 Z" fill={paper} stroke={paper} strokeWidth="2.5" strokeLinejoin="round" /></svg>
            <div style={{ ...tabTxt, color: paper, opacity: 1 }}>BEFORE</div>
          </div>
        </div> : null}
        {f >= 12 ? <div style={{ position: "absolute", left: 26, top: -54, height: 66, width: 128, backgroundColor: acc, border: "3px solid " + ink, borderRadius: "12px 12px 0 0", boxSizing: "border-box", overflow: "hidden", display: "flex", alignItems: "flex-start", paddingTop: 8, paddingLeft: 0, justifyContent: "center", zIndex: 1, boxShadow: "4px 0 0 rgba(23,20,17,0.22)" }}>
          <div style={{ ...tabTxt, color: ink }}>NOW</div>
        </div> : null}

        {/* ===== the card: aged paper wipes clean from the stamp ===== */}
        <div style={cardStyle}>
          {f < 13 ? <div style={ageWrap}>
            <div style={{ position: "absolute", inset: 0, backgroundColor: gold, opacity: 0.13 }} />
            <div style={{ position: "absolute", inset: 0, backgroundColor: ink, opacity: 0.05 }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 37px,rgba(23,20,17,0.08) 38px,transparent 39px)", boxShadow: "inset 0 0 46px rgba(23,20,17,0.14)" }} />
          </div> : null}
          {ringO > 0 ? <svg width={CW} height={CH} style={{ position: "absolute", left: -3, top: -3, opacity: ringO }}>
            <circle cx={450} cy={200} r={wipeR} fill="none" stroke={acc} strokeWidth={5} />
          </svg> : null}
        </div>

        {/* ===== card content ===== */}
        <div style={content}>
          {/* B08 Buffer header + circle flip shut on "now" */}
          {f < 5 ? <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, transform: f >= 1 ? "scaleY(" + hdSY + ")" : "none", transformOrigin: "450px 63px" }}>
            <svg viewBox="0 0 48 48" style={{ position: "absolute", left: LOGO_X1 - 37, top: 26, width: 74, height: 74, opacity: 1, transform: "scale(1)" }}>
              <path d="M24 5 L43 14.5 L24 24 L5 14.5 Z" fill={ink} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M5 23.5 L24 33 L43 23.5" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 32.5 L24 42 L43 32.5" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ position: "absolute", left: WM_L, top: 16, height: 92, fontFamily: props.serif, fontWeight: 900, fontSize: 86, lineHeight: "92px", color: ink, letterSpacing: 0.5, whiteSpace: "nowrap", opacity: 1, transform: "scale(1)", transformOrigin: "40% 55%" }}>Buffer</div>
            <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible" }}>
              <path d={CIRCLE} pathLength="1" fill="none" stroke={acc} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={0} opacity={1} />
            </svg>
          </div> : null}

          {/* the same five steps */}
          {f < 108 ? steps : null}

          {/* B08 "every post" note */}
          {f < 9 ? <div style={noteHiStyle} /> : null}
          {f < 9 ? <div style={noteStyle}>
            <svg viewBox="0 0 40 40" style={{ width: 40, height: 40, flexShrink: 0 }}>
              <path d="M31 13 A13 13 0 1 0 33 24" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
              <path d="M24 12 L32 13 L33 5" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 38, lineHeight: "46px", color: ink, whiteSpace: "nowrap" }}>every post</div>
          </div> : null}

          {/* B08 hand */}
          {f < 5 ? <svg viewBox="0 0 28 32" style={handStyle}>
            <path d="M8 18.5 L8 3.8 A2.2 2.2 0 0 1 12.4 3.8 L12.4 13 A2.2 2.2 0 0 1 16.8 13 L16.8 14.2 A2.2 2.2 0 0 1 21.2 14.2 L21.2 15.6 A2.2 2.2 0 0 1 25.6 15.6 L25.6 22 Q25.6 30.5 17.5 30.5 L14 30.5 Q10.5 30.5 8.6 27.6 L3.4 20.6 A2.1 2.1 0 0 1 6.6 18 Z" fill={paper} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M12.4 13 V18 M16.8 14.2 V18.6 M21.2 15.6 V19.2" fill="none" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
          </svg> : null}

          {/* ===== scene B: brace ("entirely") ===== */}
          {braceP > 0.001 ? <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible" }}>
            <path d="M450 292 Q456 278 474 278 L776 278 Q794 278 794 264" pathLength="1" fill="none" stroke={acc} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - braceP} />
            <path d="M450 292 Q444 278 426 278 L124 278 Q106 278 106 264" pathLength="1" fill="none" stroke={acc} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - braceP} />
          </svg> : null}

          {/* ===== scene C, behind the tiles: gap, cable, plug, tag ===== */}
          {f >= 110 && f < 165 ? <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible", opacity: dotsO }}>
            {dotsX1 > dotsX0 ? <line x1={dotsX0} y1={ROW} x2={dotsX1} y2={ROW} stroke={rgba(ink, 0.5)} strokeWidth={6} strokeLinecap="round" strokeDasharray="0.01 17" /> : null}
          </svg> : null}
          {f >= 110 && f < 129 ? <div style={{ position: "absolute", left: 450 - 32, top: ROW - 32, width: 64, height: 64, borderRadius: 32, backgroundColor: paper, border: "3px dashed " + rgba(ink, 0.55), boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", opacity: qO, transform: "scale(" + qS + ") rotate(-6deg)" }}>
            <span style={{ fontFamily: props.serif, fontWeight: 900, fontSize: 40, lineHeight: 1, color: rgba(ink, 0.7), marginTop: -2 }}>?</span>
          </div> : null}
          {/* socket plate on the LinkedIn tile */}
          {f >= 108 ? <div style={{ position: "absolute", left: LIX - 92, top: ROW - 30, width: 24, height: 60, borderRadius: 6, backgroundColor: powered ? ink : rgba(ink, 0.3), opacity: fade(f, 115, 3), transform: "translateX(" + liJolt + "px)" }} /> : null}
          {f >= 121 ? <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible", opacity: plugO }}>
            {cd > 2 ? <path d={cablePath} fill="none" stroke={cableCol} strokeWidth={8} strokeLinecap="round" /> : null}
          </svg> : null}
          {f >= 166 && f < 176 ? <div style={{ position: "absolute", left: pkX - 24, top: pkY - 19, width: 48, height: 38, opacity: pkO, transform: "rotate(-6deg) scale(1.3)", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 6, boxSizing: "border-box", boxShadow: "2px 3px 0 rgba(23,20,17,0.22)" }}>
            <div style={{ position: "absolute", left: 5, top: 5, width: 13, height: 13, borderRadius: 2, backgroundColor: ink }} />
            <div style={{ position: "absolute", left: 22, top: 6, width: 15, height: 4, borderRadius: 2, backgroundColor: acc }} />
            <div style={{ position: "absolute", left: 22, top: 13, width: 11, height: 4, borderRadius: 2, backgroundColor: rgba(ink, 0.4) }} />
            <div style={{ position: "absolute", left: 5, top: 23, width: 32, height: 4, borderRadius: 2, backgroundColor: rgba(ink, 0.4) }} />
          </div> : null}
          {/* tag: the honest mechanism */}
          {f >= 146 ? <div style={{ position: "absolute", left: TAG_CX - TAG_W / 2, top: TAG_T, width: TAG_W, height: TAG_H, opacity: tagO, transform: "translateY(" + tagDrop + "px) rotate(" + tagRot + "deg)", transformOrigin: TAG_W / 2 + "px 16px", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 12, boxSizing: "border-box", boxShadow: SHADOW }}>
            <div style={{ position: "absolute", left: TAG_W / 2 - 3 - 8, top: 16 - 3 - 8, width: 16, height: 16, borderRadius: 8, border: "3px solid " + ink, boxSizing: "border-box", backgroundColor: rgba(ink, 0.08) }} />
            <div style={{ position: "absolute", left: 0, top: 26, width: TAG_W - 6, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 38, lineHeight: "40px", color: ink, whiteSpace: "nowrap" }}>via Buffer API</div>
            <div style={{ position: "absolute", left: 0, top: 64, width: TAG_W - 6, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 38, lineHeight: "40px", color: acc, whiteSpace: "nowrap" }}>LinkedIn-approved</div>
          </div> : null}
          {f >= 146 ? <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible", opacity: tagO }}>
            <path d={"M " + (bx + 50) + " " + (ROW + 30) + " Q " + ((bx + 50 + TAG_CX) / 2 - 6) + " " + ((ROW + 30 + holeY) / 2 + 10) + " " + TAG_CX + " " + holeY} fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" />
          </svg> : null}
          {/* plug */}
          {f >= 121 ? <div style={{ position: "absolute", left: bx, top: ROW - 32, width: 100, height: 64, opacity: plugO }}>
            <div style={{ position: "absolute", left: -18, top: 16, width: 22, height: 32, backgroundColor: ink, borderRadius: 6 }} />
            <div style={{ position: "absolute", left: 94, top: 12, width: 34, height: 12, backgroundColor: paper, border: "3px solid " + ink, borderRadius: 3, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: 94, top: 40, width: 34, height: 12, backgroundColor: paper, border: "3px solid " + ink, borderRadius: 3, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 100, height: 64, backgroundColor: acc, border: "3px solid " + ink, borderRadius: "26px 12px 12px 26px", boxSizing: "border-box", boxShadow: SHADOW }} />
            <div style={{ position: "absolute", left: 24, top: 16, width: 4, height: 32, backgroundColor: rgba(ink, 0.5), borderRadius: 2 }} />
            <div style={{ position: "absolute", left: 34, top: 16, width: 4, height: 32, backgroundColor: rgba(ink, 0.5), borderRadius: 2 }} />
            {f >= 143 ? <div style={{ position: "absolute", left: 56 - 24, top: -26, width: 48, height: 48, borderRadius: 24, backgroundColor: paper, border: "3px solid " + ink, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", opacity: lockO, transform: "scale(" + lockS + ")" }}>
              <svg viewBox="0 0 24 24" style={{ width: 28, height: 28 }}>
                <path d="M8 11 V8 A4 4 0 0 1 16 8 V11" fill="none" stroke={ink} strokeWidth={2.8} strokeLinecap="round" />
                <rect x="5" y="11" width="14" height="10" rx="2" fill={ink} />
                <circle cx="12" cy="16" r="1.6" fill={gold} />
              </svg>
            </div> : null}
          </div> : null}

          {/* LinkedIn tile (B08 "in" tile): ghost until the plug snaps in */}
          {f >= 108 ? <div style={{ position: "absolute", left: LIX - 80, top: ROW - 80, width: 160, height: 160, opacity: liO, transform: "translateX(" + liJolt + "px) scale(" + liS * liPunch + ")" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 26, boxSizing: "border-box", border: powered ? "3px solid " + ink : "3px dashed " + rgba(ink, 0.45), backgroundColor: powered ? ink : paper, boxShadow: powered ? SHADOW : "none" }}>
              <div style={{ position: "absolute", right: 20, bottom: 7, fontFamily: props.sans, fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: -4, color: powered ? paper : rgba(ink, 0.2) }}>in</div>
            </div>
            {f >= 176 ? <div style={{ position: "absolute", left: 122 - 31 + 11, top: 22 - 31 - 22, width: 62, height: 62, borderRadius: 31, backgroundColor: acc, border: "3px solid " + ink, boxSizing: "border-box", opacity: okO, transform: "rotate(" + okR + "deg) scale(" + okS + ")", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" style={{ width: 36, height: 36 }}><path d="M5 12.5 L10 17 L19 7" fill="none" stroke={ink} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div> : null}
          </div> : null}

          {/* connection burst */}
          {f >= 165 && f < 178 ? <svg viewBox={"0 0 " + CW + " " + CH} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "visible", opacity: burstO }}>
            {[-100, -124, 100, 124].map((deg, k) => {
              const a = (deg * Math.PI) / 180;
              const r1 = 44 + burstT * 10, r2 = 56 + burstT * 24;
              const ox = LIX - 84;
              return <line key={k} x1={ox + Math.cos(a) * r1} y1={ROW + Math.sin(a) * r1} x2={ox + Math.cos(a) * r2} y2={ROW + Math.sin(a) * r2} stroke={acc} strokeWidth={6} strokeLinecap="round" />;
            })}
          </svg> : null}

          {/* ===== Claude: pill in scene B, morphs into B08's Claude tile in scene C ===== */}
          {f >= 87 ? <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, opacity: pillO, transform: f < 98 ? "scale(" + pillPop + ")" : "none", transformOrigin: SPK0.x + "px " + SPK0.y + "px" }}>
            <div style={{ position: "absolute", left: pL, top: pT, width: pW, height: pH, borderRadius: pR, backgroundColor: paper, border: "3px solid " + ink, boxSizing: "border-box", boxShadow: SHADOW }} />
            <div style={{ position: "absolute", left: sX - sS / 2, top: sY - sS / 2, width: sS, height: sS }}><Spark size={sS} color={acc} /></div>
            <div style={{ position: "absolute", left: tX - 150, top: tY - 32, width: 300, height: 64, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 56, lineHeight: "64px", color: ink, whiteSpace: "nowrap", opacity: txtO * tOp, transform: "scale(" + tK * txtPop + ")", transformOrigin: "50% 50%" }}>Claude</div>
          </div> : null}

          {/* ===== prompt bar ===== */}
          {f >= 13 && f < 108 ? <div style={{ position: "absolute", left: BAR_L, top: BAR_T, width: BAR_W, height: BAR_H, opacity: barO, transform: "scale(" + barS + ")", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 24, boxSizing: "border-box", boxShadow: SHADOW }}>
            <div style={{ position: "absolute", left: 16, top: 14, width: 46, height: 46, transform: "scale(" + barSparkK + ")" }}><Spark size={46} color={acc} rot={barSpin} /></div>
            <div style={{ position: "absolute", left: 76, top: 0, height: 74, display: "flex", alignItems: "center", fontFamily: props.sans, fontWeight: 800, fontSize: 32, color: ink, whiteSpace: "nowrap" }}>
              <span>{typed}</span>
              <span style={{ display: "inline-block", width: 4, height: 38, marginLeft: 3, backgroundColor: acc, opacity: caretOn ? 1 : 0 }} />
            </div>
            <div style={{ position: "absolute", left: BAR_W - 6 - 56 - 12, top: 9, width: 56, height: 56, transform: "scale(" + sendK + ")" }}>
              {sendRing > 0 && sendRing < 1 ? <div style={{ position: "absolute", inset: -9, borderRadius: 50, border: "3px solid " + acc, opacity: 1 - sendRing, transform: "scale(" + (1 + sendRing * 0.55) + ")" }} /> : null}
              <div style={{ position: "absolute", inset: 0, borderRadius: 28, backgroundColor: interpolateColors(sendHot, [0, 1], [rgba(ink, 0.1), acc]), border: "3px solid " + interpolateColors(sendHot, [0, 1], [rgba(ink, 0.25), ink]), boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" style={{ width: 28, height: 28 }}><path d="M12 19 V5 M6 11 L12 5 L18 11" fill="none" stroke={interpolateColors(sendHot, [0, 1], [rgba(ink, 0.4), ink])} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          </div> : null}

          {/* flying spark: bar -> Claude pill */}
          {flyOn ? <div style={{ position: "absolute", left: flyX - flyK / 2, top: flyY - flyK / 2, width: flyK, height: flyK, filter: "drop-shadow(2px 3px 0 rgba(23,20,17,0.22))" }}><Spark size={flyK} color={acc} rot={barSpin + 200 * flyT} /></div> : null}
        </div>

        {/* ===== NOW stamp: lands big, docks into the tab slot ===== */}
        {f >= 1 && f < 12 ? <div style={{ position: "absolute", left: 26, top: -54, width: 128, height: 57, backgroundColor: acc, border: "3px solid " + ink, borderRadius: "12px 12px " + stBR + "px " + stBR + "px", boxSizing: "border-box", display: "flex", alignItems: "flex-start", paddingTop: 8, justifyContent: "center", opacity: fade(f, 1, 1), transform: "translate(" + stDX + "px," + stDY + "px) rotate(" + stRot + "deg) scale(" + stK + ")", transformOrigin: "50% 50%", boxShadow: "3px " + lerp(4, 0, dock) + "px 0 rgba(23,20,17,0.22)", zIndex: 6 }}>
          <div style={{ ...tabTxt, color: ink }}>NOW</div>
        </div> : null}
      </div>
    </div>
  );
};

return __Inner({ item });
};

export default Component;
