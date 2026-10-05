// @ts-nocheck
import React from 'react';
import { useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill } from 'remotion';
const Component = ({ item }) => {
// B05 results. Canvas 980x500, 337 frames. ChatCut motion graphic (Remotion runtime).
// Scene 1 (f0-88): a folded results card opens; an eye opens and a counter rolls to 9,600 impressions.
// Scene 2 (f88-249): the card flips; five post bars line up, the middle one (median) becomes the 134 bar,
//   a post tile stamps on it ("per post"), then "vs" and the 217 bar for the rest of the year.
// Scene 3 (f249-337): the page lifts away; from one shared start, posts climb to 36 while reach stays flat;
//   taped note "more posts ≠ more reach".
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EO = Easing.out(Easing.cubic);
const EI = Easing.in(Easing.cubic);
const EIO = Easing.inOut(Easing.cubic);
const CW = 840;
const CH = 440;
const popS = (t) => interpolate(t, [0, 7, 12], [0.3, 1.08, 1], CL);
const popO = (t) => interpolate(t, [0, 3], [0, 1], CL);
const popR = (t, r) => interpolate(t, [0, 7, 12], [r * 5, -r * 0.6, r], CL);
const lenOf = (pts) => {
  let L = 0;
  const acc = [0];
  for (let i = 1; i < pts.length; i++) {
    L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    acc.push(L);
  }
  return { L, acc };
};
const toD = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
// scene 3 chart: posts staircase, weekday posting 4 May - 2 Jun (22 posting days, 36 posts), flat on weekends.
// Posts and reach start from ONE shared origin (X0, Y0); posts climb, reach stays flat.
const X0 = 98;
const X1 = 500;
const Y0 = 326;
const Y1 = 118;
const dayX = (d) => X0 + (d * (X1 - X0)) / 30;
const postY = (n) => Y0 - (n * (Y0 - Y1)) / 36;
const PER = 36 / 22;
const POSTS = [[0, 0], [5, 5], [7, 5], [12, 10], [14, 10], [19, 15], [21, 15], [26, 20], [28, 20], [30, 22]].map((p) => [dayX(p[0]), postY(p[1] * PER)]);
const POSTS_LEN = lenOf(POSTS);
const REACH = [];
for (let i = 0; i <= 10; i++) REACH.push([X0 + (i * (X1 - X0)) / 10, Y0 + (i === 0 || i === 10 ? 0 : (random("reach" + i) - 0.5) * 8)]);
const REACH_LEN = lenOf(REACH);
// scene 2: five illustrative post bars (unlabelled), sorted short to tall; the middle one is the median
const TILES = [44, 68, 96, 128, 170];
const TILE_W = 38;
const TILE_P = 50;

// crisp counter: whole digits only, fixed-width columns (no fractional offsets, so no slivers)
const Odo = ({ v, size, color, font }) => {
  const n = Math.max(0, Math.min(9999, Math.round(v)));
  const s = String(n).padStart(4, "0");
  const lead = n === 0 ? 3 : 4 - String(n).length;
  const lh = Math.round(size * 1.12);
  const cw = Math.round(size * 0.63);
  const cell = (ch, i, w, o) => (
    <div key={"c" + i} style={{ width: w, height: lh, lineHeight: lh + "px", textAlign: "center", fontFamily: font, fontWeight: 900, fontSize: size, color, opacity: o }}>{ch}</div>
  );
  const cols = [];
  for (let i = 0; i < 4; i++) {
    cols.push(cell(s[i], i, cw, i < lead ? 0.14 : 1));
    if (i === 0) cols.push(cell(",", "comma", Math.round(size * 0.26), lead > 0 ? 0.14 : 1));
  }
  return <div style={{ display: "flex" }}>{cols}</div>;
};


const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const acc = props.accent;
  const paper = props.paper;
  const gold = props.gold;
  const serif = props.serif;
  const hand = props.hand;
  const sans = props.sans;
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const grid = "linear-gradient(" + ink + "0E 1.5px, transparent 1.5px), linear-gradient(90deg, " + ink + "0E 1.5px, transparent 1.5px)";
  const cardFace = { position: "absolute", left: 0, top: 0, width: CW, height: CH, boxSizing: "border-box", backgroundColor: paper, backgroundImage: grid, backgroundSize: "37px 37px", backgroundPosition: "18px 18px", border: "3px solid " + ink, borderRadius: 14, boxShadow: "4px 6px 0 rgba(23,20,17,0.22)" };
  const stage = { position: "absolute", left: 70, top: 28, width: CW, height: CH, perspective: 3200 };
  const full = { position: "absolute", left: 0, top: 0, width: CW, height: CH };

  // ---------- card flip (scene 1 -> 2): shrink a little at mid-flip so the near edge never nears the canvas edge ----------
  const flipY = interpolate(frame, [88, 97], [0, 180], { ...CL, easing: EIO });
  const flipS = interpolate(frame, [88, 92.5, 97], [1, 0.86, 1], CL);

  // ---------- scene 1: folded card opens, eye opens, counter rolls ----------
  const s1 = interpolate(frame, [0, 7, 12], [0.3, 1.05, 1], CL);
  const o1 = popO(frame);
  const unfold = interpolate(frame, [13, 22, 26], [-90, 5, 0], { ...CL, easing: EO });
  const unfoldP = interpolate(frame, [13, 24], [0, 1], CL);
  const eyeOpen = interpolate(frame, [24, 29, 32], [0.06, 1.12, 1], CL);
  const eyeO = interpolate(frame, [23, 25], [0, 1], CL);
  const rays = interpolate(frame, [31, 38], [0, 1], { ...CL, easing: EO });
  const count = 9600 * interpolate(frame, [27, 54], [0, 1], { ...CL, easing: EO });
  const numO = interpolate(frame, [26, 29], [0, 1], CL);
  const numS = interpolate(frame, [26, 33, 38], [0.6, 1.04, 1], CL);
  const lblT = frame - 60;
  const underline = interpolate(frame, [64, 78], [0, 1], { ...CL, easing: EO });

  const eyeSvg = (w, h, openAmt, showRays) => (
    <svg viewBox="0 0 220 140" width={w} height={h} style={{ overflow: "visible" }}>
      <g transform={"translate(110 74) scale(1 " + openAmt + ") translate(-110 -74)"}>
        <path d="M14 74 Q110 -6 206 74 Q110 154 14 74 Z" fill={paper} stroke={ink} strokeWidth="7" strokeLinejoin="round" />
        <circle cx="110" cy="74" r="35" fill={acc} stroke={ink} strokeWidth="6" />
        <circle cx="110" cy="74" r="14" fill={ink} />
        <circle cx="122" cy="62" r="6" fill={paper} />
      </g>
      {showRays ? (
        <g stroke={ink} strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M110 20 L110 0" strokeDasharray="22" strokeDashoffset={22 * (1 - rays)} />
          <path d="M60 30 L48 12" strokeDasharray="24" strokeDashoffset={24 * (1 - rays)} />
          <path d="M160 30 L172 12" strokeDasharray="24" strokeDashoffset={24 * (1 - rays)} />
        </g>
      ) : null}
    </svg>
  );

  const face1 = (
    <div style={{ ...full, transform: "rotateY(" + flipY + "deg) scale(" + flipS + ")", transformOrigin: "50% 50%" }}>
      <div style={{ ...full, perspective: 1800, opacity: o1, transform: "scale(" + s1 + ") rotate(-0.5deg)", transformOrigin: "50% 18%" }}>
        {/* top half */}
        <div style={{ ...cardFace, height: CH / 2, borderBottom: "none", borderRadius: "14px 14px 0 0" }} />
        {/* bottom half unfolds down */}
        <div style={{ ...cardFace, top: CH / 2, height: CH / 2, borderTop: "none", borderRadius: "0 0 14px 14px", backgroundPosition: "18px " + (18 - CH / 2) + "px", transformOrigin: "50% 0%", transform: "rotateX(" + unfold + "deg)", backfaceVisibility: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundColor: ink, opacity: 0.16 * (1 - unfoldP), borderRadius: "0 0 12px 12px" }} />
        </div>
        {/* fold line: hard edge while folded, faint crease once open */}
        <div style={{ position: "absolute", left: 0, top: CH / 2 - 3, width: CW, height: 3, backgroundColor: ink, opacity: interpolate(unfoldP, [0, 1], [1, 0.08]) }} />
        {/* header */}
        <svg viewBox="0 0 24 24" width="44" height="44" style={{ position: "absolute", left: 30, top: 22 }}>
          <g stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="16" rx="2" fill={paper} />
            <path d="M3 10 H21 M8 3 V7 M16 3 V7" />
          </g>
          <rect x="6" y="13" width="4" height="3.5" fill={acc} />
        </svg>
        <div style={{ position: "absolute", left: 86, top: 16, fontFamily: hand, fontWeight: 700, fontSize: 40, lineHeight: "54px", color: ink }}>May challenge</div>
        <div style={{ position: "absolute", right: 32, top: 33, fontFamily: sans, fontWeight: 800, fontSize: 19, letterSpacing: 1.5, color: ink, opacity: 0.55 }}>4 MAY → 2 JUN</div>
        {/* eye */}
        <div style={{ position: "absolute", left: 66, top: 132, opacity: eyeO }}>{eyeSvg(236, 150, eyeOpen, true)}</div>
        {/* counter */}
        <div style={{ position: "absolute", left: 336, top: 118, opacity: numO, transform: "scale(" + numS + ")", transformOrigin: "0% 60%" }}>
          <Odo v={count} size={156} color={ink} font={serif} />
        </div>
        <div style={{ position: "absolute", left: 346, top: 290, fontFamily: hand, fontWeight: 700, fontSize: 54, lineHeight: "64px", color: ink, opacity: popO(lblT), transform: "rotate(" + popR(lblT, -1.5) + "deg) scale(" + popS(lblT) + ")", transformOrigin: "10% 50%" }}>impressions</div>
        <svg viewBox="0 0 320 30" width="320" height="30" style={{ position: "absolute", left: 340, top: 358 }}>
          <path d="M6 18 Q90 6 170 15 T314 11" fill="none" stroke={acc} strokeWidth="10" strokeLinecap="round" strokeDasharray="330" strokeDashoffset={330 * (1 - underline)} />
        </svg>
      </div>
    </div>
  );

  // ---------- scene 2: median per post, two bars ----------
  const pageLift = interpolate(frame, [249, 257], [0, -90], { ...CL, easing: EI });
  const BASE = 362;
  const K = 1.05;
  const CXA = 260;
  const CXB = 600;
  // five post bars grow from the baseline on "median"
  const tileG = (i) => interpolate(frame - (95 + 1.5 * i), [0, 6, 9], [0, 1.1, 1], CL);
  const pick = interpolate(frame, [102, 106], [0, 1], CL);
  const caretT = frame - 102;
  const caretO = popO(caretT) * interpolate(frame, [114, 118], [1, 0], CL);
  const collapse = interpolate(frame, [113, 119], [1, 0], { ...CL, easing: EI });
  // the median bar lifts out: widens and grows into the May bar while the count rolls to 134
  const morph = interpolate(frame, [117, 127], [0, 1], { ...CL, easing: EO });
  const growA = interpolate(frame, [117, 127, 131], [0, 1.03, 1], { ...CL, easing: EO });
  const hA = TILES[2] + (134 * K - TILES[2]) * growA;
  const wA = TILE_W + (150 - TILE_W) * morph;
  const cntA = Math.round(134 * interpolate(frame, [117, 127], [0, 1], { ...CL, easing: EO }));
  const growB = interpolate(frame, [192, 209, 214], [0, 1.03, 1], { ...CL, easing: EO });
  const cntB = Math.round(217 * interpolate(frame, [192, 209], [0, 1], { ...CL, easing: EO }));
  const hB = 217 * K * growB;
  const stT = frame - 156;
  const stS = interpolate(stT, [0, 5, 9], [1.6, 0.94, 1], CL);
  const vsT = frame - 172;
  const labATm = frame - 117;
  const labBTm = frame - 224;
  const lvl = interpolate(frame, [228, 242], [0, 1], { ...CL, easing: EO });
  const bar = (cx, w, h, fill) => ({ position: "absolute", left: cx - w / 2, top: BASE - h, width: w, height: h, boxSizing: "border-box", backgroundColor: fill, border: h > 2 ? "3px solid " + ink : "none", borderBottom: "none", borderRadius: "8px 8px 0 0" });
  const num = (cx, h, col, o) => ({ position: "absolute", left: cx - 130, width: 260, top: BASE - h - 104, height: 96, textAlign: "center", fontFamily: serif, fontWeight: 900, fontSize: 96, lineHeight: "96px", color: col, opacity: o });
  const lab = (cx, t, col, r) => ({ position: "absolute", left: cx - 160, width: 320, top: BASE + 12, textAlign: "center", fontFamily: hand, fontWeight: 700, fontSize: 38, lineHeight: "48px", color: col, opacity: popO(t), transform: "rotate(" + popR(t, r) + "deg) scale(" + popS(t) + ")" });
  const lvlY = BASE - 134 * K;
  const fillA = interpolateColors(pick, [0, 1], [paper, acc]);

  const tiles = TILES.map((h, i) => {
    if (i === 2) return null;
    const g = tileG(i) * collapse;
    if (g <= 0.001) return null;
    return <div key={"t" + i} style={{ ...bar(CXA + (i - 2) * TILE_P, TILE_W, h * g, paper), opacity: collapse < 1 ? 0.35 + 0.65 * collapse : 1 }} />;
  });
  const medianH = frame < 117 ? TILES[2] * tileG(2) : hA;

  const face2 = (
    <div style={{ ...full, transform: "rotateY(" + (flipY - 180) + "deg) scale(" + flipS + ")", transformOrigin: "50% 50%" }}>
      <div style={{ ...full, perspective: 1800, transform: "rotate(0.5deg)" }}>
        <div style={{ ...full, transformOrigin: "50% 0%", transform: "rotateX(" + pageLift + "deg)", backfaceVisibility: "hidden" }}>
          <div style={cardFace} />
          <div style={{ position: "absolute", left: 28, top: 26 }}>{eyeSvg(64, 41, 1, false)}</div>
          <div style={{ position: "absolute", left: 104, top: 16, fontFamily: hand, fontWeight: 700, fontSize: 40, lineHeight: "54px", color: ink }}>median per post</div>
          {/* five post bars, the middle one is the median */}
          {tiles}
          {medianH > 0.5 ? <div style={bar(CXA, wA, medianH, fillA)} /> : null}
          {/* gold caret marks the middle bar */}
          <svg viewBox="0 0 40 32" width="48" height="38" style={{ position: "absolute", left: CXA - 24, top: BASE - TILES[2] - 52, opacity: caretO, transform: "scale(" + popS(caretT) + ")", transformOrigin: "50% 100%" }}>
            <path d="M5 4 L35 4 L20 27 Z" fill={gold} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
          </svg>
          {/* bar B */}
          <div style={bar(CXB, 150, hB, ink)} />
          <div style={num(CXA, hA, acc, interpolate(frame, [117, 120], [0, 1], CL))}>{cntA}</div>
          <div style={num(CXB, hB, ink, interpolate(frame, [192, 195], [0, 1], CL))}>{cntB}</div>
          {/* "per post": a post tile stamps onto the May bar */}
          <svg viewBox="0 0 76 84" width="76" height="84" style={{ position: "absolute", left: CXA - 38, top: BASE - 134 * K + 26, opacity: interpolate(stT, [0, 2], [0, 1], CL), transform: "rotate(-5deg) scale(" + stS + ")", transformOrigin: "50% 50%" }}>
            <rect x="3" y="3" width="70" height="78" rx="8" fill={paper} stroke={ink} strokeWidth="3.5" />
            <circle cx="16" cy="17" r="6.5" fill={ink} />
            <path d="M28 14 L60 14 M28 22 L48 22" stroke={ink} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
            <rect x="11" y="32" width="54" height="28" rx="3" fill={acc} stroke={ink} strokeWidth="3" />
            <path d="M12 70 L56 70" stroke={ink} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
          </svg>
          {/* May level carried across to the taller bar */}
          <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={"M" + 335 + " " + lvlY + " L" + 700 + " " + lvlY} stroke={acc} strokeWidth="5" strokeLinecap="round" strokeDasharray="14 12" fill="none" style={{ clipPath: "inset(0 " + (100 - lvl * 100) + "% 0 0)" }} />
            <line x1="110" y1={BASE} x2="750" y2={BASE} stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: 388, top: 258, width: 84, height: 84, borderRadius: 42, boxSizing: "border-box", border: "3px solid " + ink, backgroundColor: paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontWeight: 900, fontSize: 38, lineHeight: "38px", paddingBottom: 4, color: ink, opacity: popO(vsT), transform: "rotate(" + popR(vsT, -4) + "deg) scale(" + popS(vsT) + ")" }}>vs</div>
          <div style={lab(CXA, labATm, acc, -1.5)}>May challenge</div>
          <div style={lab(CXB, labBTm, ink, 1.5)}>rest of my year</div>
          <div style={{ position: "absolute", inset: 0, backgroundColor: ink, opacity: interpolate(-pageLift, [0, 90], [0, 0.35]), borderRadius: 14 }} />
        </div>
      </div>
    </div>
  );

  // ---------- scene 3: posts climb, reach stays flat, taped note ----------
  const pP = interpolate(frame, [255, 277], [0, 1], { ...CL, easing: EIO });
  const pR = interpolate(frame, [269, 292], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
  const postsCount = Math.round(36 * pP);
  const postsLblT = frame - 258;
  const reachLblT = frame - 289;
  const noteT = frame - 297;
  const w1 = interpolate(frame, [299, 307], [0, 1], CL);
  const neq = frame - 305;
  const w2 = interpolate(frame, [309, 317], [0, 1], CL);
  const tornClip = "polygon(0% 3%,14% 0%,30% 2%,46% 0%,62% 3%,78% 0%,100% 2%,98% 30%,100% 62%,98% 97%,82% 100%,64% 97%,47% 100%,30% 97%,14% 100%,0% 97%,2% 64%,0% 32%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 33px," + ink + "1A 34px,transparent 35px)";
  const NW = 320;

  const face3 = (
    <div style={{ ...full, transform: "rotate(-0.5deg)" }}>
      <div style={cardFace} />
      <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0 }}>
        <g stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d={"M84 366 L84 44 M72 58 L84 44 L96 58"} />
          <path d={"M84 366 L528 366 M514 354 L528 366 L514 378"} />
          {[7, 14, 21, 28].map((d) => <path key={"wk" + d} d={"M" + dayX(d).toFixed(1) + " 366 L" + dayX(d).toFixed(1) + " 376"} opacity="0.45" />)}
        </g>
        <path d={toD(REACH)} stroke={ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={pR > 0.002 ? 1 : 0} strokeDasharray={REACH_LEN.L + 2} strokeDashoffset={(REACH_LEN.L + 2) * (1 - pR)} />
        <path d={toD(POSTS)} stroke={acc} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={pP > 0.002 ? 1 : 0} strokeDasharray={POSTS_LEN.L + 2} strokeDashoffset={(POSTS_LEN.L + 2) * (1 - pP)} />
        {/* shared start dot */}
        <circle cx={X0} cy={Y0} r="7" fill={ink} opacity={pP > 0.002 ? 1 : 0} />
        {[1, 3, 5, 7, 9].map((idx) => {
          const at = POSTS_LEN.acc[idx] / POSTS_LEN.L;
          const t = (pP - at) * 60;
          const sc = interpolate(t, [0, 4, 8], [0, 1.25, 1], CL);
          return <rect key={idx} x={POSTS[idx][0] - 9} y={POSTS[idx][1] - 9} width="18" height="18" rx="3" fill={paper} stroke={ink} strokeWidth="3.5" transform={"translate(" + POSTS[idx][0] + " " + POSTS[idx][1] + ") scale(" + sc + ") translate(" + -POSTS[idx][0] + " " + -POSTS[idx][1] + ")"} />;
        })}
      </svg>
      {/* posts counter at the top of the climb */}
      <div style={{ position: "absolute", left: 236, width: 276, top: 18, display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 10, opacity: popO(postsLblT), transform: "rotate(" + popR(postsLblT, -1.5) + "deg) scale(" + popS(postsLblT) + ")", transformOrigin: "90% 70%" }}>
        <span style={{ fontFamily: serif, fontWeight: 900, fontSize: 86, lineHeight: "88px", color: acc, minWidth: 104, textAlign: "right" }}>{postsCount}</span>
        <span style={{ fontFamily: hand, fontWeight: 700, fontSize: 40, lineHeight: "48px", color: ink }}>posts</span>
      </div>
      {/* reach label */}
      <div style={{ position: "absolute", left: 330, width: 176, top: 262, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, opacity: popO(reachLblT), transform: "rotate(" + popR(reachLblT, 1.5) + "deg) scale(" + popS(reachLblT) + ")", transformOrigin: "90% 70%" }}>
        <svg viewBox="0 0 24 24" width="38" height="38">
          <g stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" fill={paper} />
            <path d="M4 21 A8 8 0 0 1 20 21 Z" fill={paper} />
          </g>
        </svg>
        <span style={{ fontFamily: hand, fontWeight: 700, fontSize: 40, lineHeight: "48px", color: ink }}>reach</span>
      </div>
      {/* taped note */}
      <div style={{ position: "absolute", left: 548, top: 50, width: NW, height: 296, opacity: popO(noteT), transform: "rotate(" + popR(noteT, 2.5) + "deg) scale(" + popS(noteT) + ")", filter: "drop-shadow(4px 6px 0 rgba(23,20,17,0.22))" }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: paper, backgroundImage: ruled, clipPath: tornClip }} />
        <div style={{ position: "absolute", left: 0, width: NW, top: 28, textAlign: "center", fontFamily: hand, fontWeight: 700, fontSize: 58, lineHeight: "68px", color: ink, clipPath: "inset(0 " + (100 - w1 * 100) + "% 0 0)" }}>more posts</div>
        <svg viewBox="0 0 100 80" width="110" height="88" style={{ position: "absolute", left: NW / 2 - 55, top: 104, opacity: popO(neq), transform: "scale(" + popS(neq) + ") rotate(" + popR(neq, -3) + "deg)" }}>
          <g stroke={acc} strokeWidth="11" strokeLinecap="round" fill="none">
            <path d="M14 30 L86 30 M14 54 L86 54" />
            <path d="M64 8 L36 76" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 0, width: NW, top: 198, textAlign: "center", fontFamily: hand, fontWeight: 700, fontSize: 58, lineHeight: "68px", color: ink, clipPath: "inset(0 " + (100 - w2 * 100) + "% 0 0)" }}>more reach</div>
        <div style={{ position: "absolute", left: NW / 2 - 52, top: -16, width: 104, height: 34, backgroundColor: gold, opacity: 0.85, transform: "rotate(-4deg)" }} />
      </div>
    </div>
  );

  return (
    <div style={rootStyle}>
      <div style={stage}>
        {frame >= 249 ? face3 : null}
        {flipY >= 90 && frame < 258 ? face2 : null}
        {flipY < 90 ? face1 : null}
      </div>
    </div>
  );
};

return __Inner({ item });
};

export default Component;
