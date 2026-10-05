// @ts-nocheck
import React from 'react';
import { useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill } from 'remotion';
const Component = ({ item }) => {
// B02 ghostwriter: "People have told me that I have a ghostwriter on LinkedIn. Honestly, it's just AI."
// Rumour -> reveal. Comment bubbles pop on the left ("People" f1, "told" f18, "have a ghostwriter" f37-47);
// an empty office chair at a laptop with a "someone is typing" bubble whose dots tick in one by one;
// on "ghostwriter" a paper ghost pops into the chair, drapes two sheet-nub hands over the lid and types (two taps);
// it types again on "LinkedIn" as an "in" sticker lands on the lid;
// on "Honestly" the sheet (hands and all) is yanked off sideways and shrinks away, revealing the Claude spark (shared 12-ray mark, with eyes) in the seat;
// "ghostwriter?" is struck on "it's"; a narrow "just" stamp slams over the third rumour on "just" and the frame
// widens as "AI." punches into it on "AI.".
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const SH = "rgba(23,20,17,0.22)";
const popS = (f, t) => interpolate(f, [t, t + 7, t + 12], [0.3, 1.08, 1], CL);
const popO = (f, t) => interpolate(f, [t, t + 3], [0, 1], CL);
const around = (cx, cy, s, r) => "translate(" + cx + " " + cy + ") rotate(" + r + ") scale(" + s + ") translate(" + (-cx) + " " + (-cy) + ")";
// ghost sheet, 220 x ~304: the scalloped hem tucks behind the laptop and desk top
const GHOST_D = "M 0 110 C 0 45 50 0 110 0 C 170 0 220 45 220 110 L 220 282 Q 202 314 183 286 Q 165 260 147 288 Q 128 316 110 288 Q 92 260 73 288 Q 55 316 37 286 Q 18 258 0 284 Z";
// sheet-nub hand draped over the lid edge: rounded top, two little scalloped "fingers" hanging in front
const HAND_D = "M -19 6 C -19 -9 -10 -17 0 -17 C 10 -17 19 -9 19 6 Q 9.5 27 0 9 Q -9.5 27 -19 6 Z";
const CHAIR_BACK = "M 660 394 L 660 252 Q 660 208 704 208 L 766 208 Q 810 208 810 252 L 810 394 Z";
// Claude spark: the shared 12-ray mark (B01/B06 RAYS, angle + length in a 100-unit box, accent round-cap strokes, no outline)
const RAYS = [[0, 45], [31, 37], [62, 46], [92, 38], [121, 45], [152, 36], [182, 46], [211, 37], [242, 45], [271, 37], [302, 46], [331, 38]];


const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const acc = props.accent;
  const paper = props.paper;
  const gold = props.gold;

  // ---------- scene timing (word frames) ----------
  const T_C1 = 1, T_DESK = 3, T_DOTS = 10, T_C3 = 17, T_C2 = 36, T_GW = 44, T_GHOST = 45, T_HANDS = 46, T_TAP1 = 52, T_IN = 65, T_TAP2 = 66, T_WHISK = 88, T_STRIKE = 105, T_STAMP = 114, T_AI = 118;

  // desk scene pops up from the floor line (anchored at the bottom so nothing dips below the canvas)
  const deskS = interpolate(frame, [T_DESK, T_DESK + 7, T_DESK + 12], [0.82, 1.03, 1], CL);
  const deskO = interpolate(frame, [T_DESK, T_DESK + 4], [0, 1], CL);
  const deskT = around(735, 480, deskS, 0);

  // "someone is typing" bubble above the empty chair; the three dots tick in one by one, then hold
  const dotsIn = popS(frame, T_DOTS);
  const dotsOut = interpolate(frame, [T_GHOST - 3, T_GHOST], [1, 0], CL);
  const dotsS = dotsIn * dotsOut;
  const dotsO = popO(frame, T_DOTS) * (frame < T_GHOST ? 1 : 0);
  const dotS = (i) => interpolate(frame, [T_DOTS + 3 + i * 3, T_DOTS + 6 + i * 3, T_DOTS + 9 + i * 3], [0, 1.3, 1], CL);

  // ghost appears, squashes (anticipation), then the sheet is yanked off to the upper right and shrinks away
  const gS = popS(frame, T_GHOST);
  const gO = popO(frame, T_GHOST);
  const squash = interpolate(frame, [T_WHISK - 5, T_WHISK - 1, T_WHISK + 1], [1, 0.94, 1.03], CL);
  const GCX = 735, GCY = 252;
  const wE = interpolate(frame, [T_WHISK, T_WHISK + 10], [0, 1], { ...CL, easing: Easing.out(Easing.poly(4)) });
  const wS = interpolate(frame, [T_WHISK, T_WHISK + 10], [1, 0.14], { ...CL, easing: Easing.out(Easing.cubic) });
  const wX = 170 * wE, wY = -78 * wE, wR = 38 * wE;
  const wO = interpolate(frame, [T_WHISK + 7, T_WHISK + 9], [1, 0], CL);
  const whiskT = "translate(" + wX + " " + wY + ") " + around(GCX, GCY, wS, wR);
  const squashT = "translate(735 404) scale(1 " + squash + ") translate(-735 -404)";
  // speed dashes beside the sheet's path (clear of the sheet and the spark): draw on, then erase from the tail
  const streakOff = interpolate(frame, [T_WHISK + 1, T_WHISK + 4, T_WHISK + 9], [100, 0, -100], { ...CL, easing: Easing.inOut(Easing.quad) });
  const streakO = frame > T_WHISK && frame < T_WHISK + 9 ? 1 : 0;

  // the ghost's hands: pop onto the lid corners right after the ghost, tap (type) on "ghostwriter" and on "LinkedIn", then hold
  const hS = (t) => interpolate(frame, [t, t + 4, t + 7], [0.3, 1.12, 1], CL);
  const hO = (t) => interpolate(frame, [t, t + 2], [0, 1], CL);
  const tap = (t) => interpolate(frame, [t, t + 1, t + 3], [0, 6, 0], CL);
  const tapL = tap(T_TAP1) + tap(T_TAP2);
  const tapR = tap(T_TAP1 + 3) + tap(T_TAP2 + 3);
  const clack = (t) => interpolate(frame, [t, t + 1, t + 2, t + 3], [0, 1, 1, 0], CL);
  const clackL = clack(T_TAP1) + clack(T_TAP2);
  const clackR = clack(T_TAP1 + 3) + clack(T_TAP2 + 3);

  // spark revealed
  const sparkS = interpolate(frame, [T_WHISK + 2, T_WHISK + 8, T_WHISK + 14], [0.86, 1.08, 1], CL);
  const sparkRot = interpolate(frame, [T_WHISK, T_WHISK + 14], [-24, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  const glintS = (t) => popS(frame, t);
  const glintO = (t) => popO(frame, t);

  // "in" sticker on the lid
  const inS = popS(frame, T_IN);
  const inO = popO(frame, T_IN);
  const inR = interpolate(frame, [T_IN, T_IN + 7, T_IN + 12], [-28, 4, -6], CL);

  // bubbles
  const c1S = popS(frame, T_C1), c1O = popO(frame, T_C1);
  const c3S = popS(frame, T_C3), c3O = popO(frame, T_C3);
  const c2S = popS(frame, T_C2), c2O = popO(frame, T_C2);
  // side rumours step well back when "ghostwriter?" lands; the top one fades further for the punchline
  const c1Dim = interpolate(frame, [T_GW + 3, T_GW + 8, T_STRIKE, T_STRIKE + 6], [1, 0.45, 0.45, 0.28], CL);
  const c3Dim = interpolate(frame, [T_GW + 3, T_GW + 8], [1, 0.45], CL);
  // the third rumour is knocked away under the stamp
  const c3Out = interpolate(frame, [T_STAMP, T_STAMP + 1], [1, 0], CL);
  // bubble 2 grows from "you have a" to fit "ghostwriter?" while the word pops in (no empty box)
  const gwOpen = interpolate(frame, [T_GW - 2, T_GW + 5], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const L1W = 186, L2W = 450;
  const gwS = interpolate(frame, [T_GW - 2, T_GW + 4, T_GW + 8], [0.3, 1.03, 1], CL);
  const gwO = popO(frame, T_GW - 1);
  const strikeP = interpolate(frame, [T_STRIKE, T_STRIKE + 7], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const dim = interpolate(frame, [T_STRIKE + 2, T_STRIKE + 8], [1, 0.55], CL);

  // stamp slams in narrow around "just"; the frame widens as "AI." punches in
  const stS = interpolate(frame, [T_STAMP, T_STAMP + 2, T_STAMP + 4], [1.2, 0.97, 1], CL);
  const stO = frame >= T_STAMP ? 1 : 0;
  const stR = interpolate(frame, [T_STAMP, T_STAMP + 4], [-7, -4], CL);
  const aiOpen = interpolate(frame, [T_AI, T_AI + 2], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const aiS = interpolate(frame, [T_AI + 1, T_AI + 3, T_AI + 5], [1.32, 0.96, 1], CL);
  const aiO = interpolate(frame, [T_AI + 1, T_AI + 2], [0, 1], CL);
  const knock = interpolate(frame, [T_AI + 2, T_AI + 3, T_AI + 5], [0, 4, 0], CL);
  const stR2 = interpolate(frame, [T_AI + 2, T_AI + 3, T_AI + 5], [0, 1.2, 1], CL);

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };

  // ---------- comment bubble parts ----------
  const avatar = (fill, x, y) => (
    <div style={{ position: "absolute", left: x, top: y, width: 58, height: 58, borderRadius: 29, border: "3px solid " + ink, backgroundColor: paper, overflow: "hidden", boxShadow: "3px 4px 0 " + SH, boxSizing: "border-box" }}>
      <svg viewBox="0 0 52 52" style={{ width: 52, height: 52 }}>
        <circle cx="26" cy="21" r="9" fill={ink} />
        <path d="M 8 52 Q 9 33 26 33 Q 43 33 44 52 Z" fill={fill} stroke={ink} strokeWidth="3" />
      </svg>
    </div>
  );
  const tail = <svg viewBox="0 0 22 28" style={{ position: "absolute", left: -19, top: 18, width: 22, height: 28 }}><path d="M 22 2 L 3 14 L 22 26" fill={paper} stroke={ink} strokeWidth="3" strokeLinejoin="round" /></svg>;
  const bubbleBox = { position: "relative", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 26, padding: "8px 26px 10px 26px", boxShadow: "4px 6px 0 " + SH };

  // ---------- spark (sits low in the seat, hub over the backrest top, like the ghost did) ----------
  const SCX = 735, SCY = 224, K = 1.9; // K = px per mark unit (longest ray ~87 px)
  const spark = (
    <g transform={around(SCX, SCY, sparkS, 0)}>
      <g transform={"rotate(" + sparkRot + " " + SCX + " " + SCY + ")"}>
        {RAYS.map(([a, L], i) => {
          const r = (a * Math.PI) / 180;
          return <line key={i} x1={SCX + Math.cos(r) * 7 * K} y1={SCY + Math.sin(r) * 7 * K} x2={SCX + Math.cos(r) * L * K} y2={SCY + Math.sin(r) * L * K} stroke={acc} strokeWidth={11 * K} strokeLinecap="round" />;
        })}
      </g>
      <ellipse cx={SCX - 12} cy={SCY + 2} rx="6" ry="9.5" fill={ink} />
      <ellipse cx={SCX + 12} cy={SCY + 2} rx="6" ry="9.5" fill={ink} />
    </g>
  );
  const glint = (x, y, s, t) => (
    <g transform={around(x, y, glintS(t) * s, 0)} opacity={glintO(t)}>
      <path d={"M " + x + " " + (y - 16) + " Q " + (x + 3) + " " + (y - 3) + " " + (x + 16) + " " + y + " Q " + (x + 3) + " " + (y + 3) + " " + x + " " + (y + 16) + " Q " + (x - 3) + " " + (y + 3) + " " + (x - 16) + " " + y + " Q " + (x - 3) + " " + (y - 3) + " " + x + " " + (y - 16) + " Z"} fill={gold} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  );

  // ---------- ghost (sheet) ----------
  const GX = 625, GY = 100;
  const ghost = (
    <g opacity={gO * wO} transform={whiskT}>
      <g transform={around(735, 330, gS, 0) + " " + squashT}>
        <g transform={"translate(" + GX + " " + GY + ")"}>
          <path d={GHOST_D} transform="translate(5 7)" fill={SH} />
          <path d={GHOST_D} fill={paper} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
          <ellipse cx="88" cy="112" rx="9" ry="14" fill={ink} />
          <ellipse cx="132" cy="112" rx="9" ry="14" fill={ink} />
          <ellipse cx="66" cy="140" rx="12" ry="6" fill={acc} opacity="0.55" />
          <ellipse cx="154" cy="140" rx="12" ry="6" fill={acc} opacity="0.55" />
          <path d="M 100 146 Q 110 154 120 146" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
  // hands draped over the lid's top corners (in front of the lid); "clack" ticks flick out on each keystroke
  const hand = (hx, hy, side, tp, ck) => (
    <g transform={"translate(" + hx + " " + (hy + tp) + ")"}>
      <g opacity={ck} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round">
        <path d={"M " + (side * 26) + " -12 L " + (side * 34) + " -19"} />
        <path d={"M " + (side * 28) + " 0 L " + (side * 38) + " 0"} />
      </g>
      <g transform={"scale(" + hS(side < 0 ? T_HANDS : T_HANDS + 1) + ")"} opacity={hO(side < 0 ? T_HANDS : T_HANDS + 1)}>
        <path d={HAND_D} transform="translate(3 4)" fill={SH} />
        <path d={HAND_D} fill={paper} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    </g>
  );
  const hands = (
    <g opacity={wO} transform={whiskT}>
      <g transform={squashT}>
        {hand(661, 281, -1, tapL, clackL)}
        {hand(809, 281, 1, tapR, clackR)}
      </g>
    </g>
  );

  return <div style={rootStyle}>
    {/* ======== desk scene ======== */}
    <svg viewBox="0 0 980 500" style={{ position: "absolute", left: 0, top: 0, width: 980, height: 500, overflow: "visible" }}>
     <g transform="translate(14 0) translate(735 482) scale(1.08) translate(-735 -482)">
      <g transform={deskT} opacity={deskO}>
        {/* office chair: seat under the desk, gas stem, star base, casters, low back */}
        <rect x="664" y="417" width="142" height="14" rx="6" fill={paper} stroke={ink} strokeWidth="3" />
        <rect x="727" y="431" width="16" height="28" fill={paper} stroke={ink} strokeWidth="3" />
        <path d="M 684 462 L 786 462" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        <circle cx="688" cy="472" r="7" fill={paper} stroke={ink} strokeWidth="3" />
        <circle cx="782" cy="472" r="7" fill={paper} stroke={ink} strokeWidth="3" />
        <path d={CHAIR_BACK} transform="translate(4 6)" fill={SH} />
        <path d={CHAIR_BACK} fill={paper} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
      {/* typing bubble above the empty chair, tail pointing down at the seat */}
      <g transform={around(740, 160, dotsS, 0)} opacity={dotsO}>
        <rect x="686" y="114" width="108" height="48" rx="24" transform="translate(4 5)" fill={SH} />
        <rect x="686" y="114" width="108" height="48" rx="24" fill={paper} stroke={ink} strokeWidth="3.5" />
        <path d="M 726 158 L 740 182 L 754 158" fill={paper} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="714" cy="138" r="7" fill={ink} transform={around(714, 138, dotS(0), 0)} />
        <circle cx="740" cy="138" r="7" fill={ink} transform={around(740, 138, dotS(1), 0)} />
        <circle cx="766" cy="138" r="7" fill={acc} transform={around(766, 138, dotS(2), 0)} />
      </g>
      {/* speed dashes beside the sheet's path (behind the sheet and the spark) */}
      <g opacity={streakO} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round">
        <path d="M 752 112 Q 784 102 822 84" pathLength="100" strokeDasharray="100 100" strokeDashoffset={streakOff} />
        <path d="M 848 128 Q 880 116 918 98" pathLength="100" strokeDasharray="100 100" strokeDashoffset={streakOff} />
        <path d="M 872 282 Q 896 272 922 258" pathLength="100" strokeDasharray="100 100" strokeDashoffset={streakOff} />
      </g>
      {/* spark sits in the chair (hidden under the sheet until the whisk) */}
      {frame >= T_WHISK ? spark : null}
      {glint(860, 112, 1, T_WHISK + 8)}
      {glint(616, 150, 0.7, T_WHISK + 7)}
      {ghost}
      <g transform={deskT} opacity={deskO}>
        {/* chair arms (in front of whoever sits in it) */}
        <rect x="620" y="306" width="12" height="94" fill={paper} stroke={ink} strokeWidth="3" />
        <rect x="838" y="306" width="12" height="94" fill={paper} stroke={ink} strokeWidth="3" />
        <rect x="604" y="294" width="74" height="17" rx="8.5" fill={paper} stroke={ink} strokeWidth="3.5" />
        <rect x="792" y="294" width="74" height="17" rx="8.5" fill={paper} stroke={ink} strokeWidth="3.5" />
        {/* desk */}
        <rect x="578" y="414" width="16" height="66" fill={paper} stroke={ink} strokeWidth="3" />
        <rect x="876" y="414" width="16" height="66" fill={paper} stroke={ink} strokeWidth="3" />
        <rect x="560" y="398" width="350" height="18" rx="5" transform="translate(4 6)" fill={SH} />
        <rect x="560" y="398" width="350" height="18" rx="5" fill={paper} stroke={ink} strokeWidth="3.5" />
        {/* laptop (back of the lid faces us) */}
        <rect x="628" y="388" width="214" height="12" rx="5" fill={paper} stroke={ink} strokeWidth="3" />
        <rect x="645" y="280" width="180" height="112" rx="12" transform="translate(4 6)" fill={SH} />
        <rect x="645" y="280" width="180" height="112" rx="12" fill={paper} stroke={ink} strokeWidth="3.5" />
      </g>
      {/* "in" sticker on the lid */}
      <g transform={around(735, 336, inS, inR)} opacity={inO}>
        <rect x="704" y="305" width="62" height="62" rx="13" fill={ink} stroke={paper} strokeWidth="4" />
        <text x="759" y="358" textAnchor="end" fontFamily={props.sans} fontWeight="800" fontSize="42" letterSpacing="-1.5" fill={paper}>in</text>
      </g>
      {frame >= T_HANDS ? hands : null}
     </g>
    </svg>

    {/* ======== rumour bubbles ======== */}
    <div style={{ position: "absolute", left: 24, top: 40, opacity: c1O * c1Dim, transform: "scale(" + c1S + ") rotate(-1deg)", transformOrigin: "30px 30px" }}>
      {avatar(acc, 0, 0)}
      <div style={{ position: "absolute", left: 82, top: -5, whiteSpace: "nowrap" }}>
        <div style={{ ...bubbleBox }}>
          {tail}
          <div style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 40, lineHeight: 1.15, color: ink }}>who writes these?</div>
        </div>
      </div>
    </div>
    {/* third voice, bottom-left: the stamp lands on it later */}
    <div style={{ position: "absolute", left: 64, top: 356, opacity: c3O * c3Dim * c3Out, transform: "scale(" + c3S + ") rotate(-1.5deg)", transformOrigin: "30px 30px" }}>
      {avatar(gold, 0, 0)}
      <div style={{ position: "absolute", left: 82, top: -5, whiteSpace: "nowrap" }}>
        <div style={{ ...bubbleBox }}>
          {tail}
          <div style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 38, lineHeight: 1.15, color: ink }}>is this you?</div>
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 24, top: 126, opacity: c2O * dim, transform: "scale(" + c2S + ") rotate(1deg)", transformOrigin: "30px 30px" }}>
      {avatar(paper, 0, 0)}
      <div style={{ position: "absolute", left: 82, top: -5, whiteSpace: "nowrap" }}>
        <div style={{ ...bubbleBox, padding: "8px 20px 8px 22px" }}>
          {tail}
          <div style={{ width: L1W + (L2W - L1W) * gwOpen }}>
            <div style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 38, lineHeight: 1.12, color: ink }}>you have a</div>
            <div style={{ position: "relative", height: 82 * gwOpen }}>
              <div style={{ position: "absolute", left: 0, top: 0, fontFamily: props.hand, fontWeight: 700, fontSize: 80, lineHeight: 1.02, color: acc, opacity: gwO, transform: "scale(" + gwS + ")", transformOrigin: "0% 50%" }}>
                ghostwriter?
                <svg viewBox="0 0 470 40" style={{ position: "absolute", left: -6, top: 26, width: 470, height: 40, overflow: "visible" }}>
                  <path d="M 6 22 Q 120 8 235 20 T 464 14" pathLength="100" strokeDasharray="100 100" strokeDashoffset={100 * (1 - strikeP)} opacity={strikeP > 0.01 ? 1 : 0} fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ======== verdict stamp: narrow "just" lands on "just", widens as "AI." punches in on "AI." ======== */}
    <div style={{ position: "absolute", left: 52, top: 318, opacity: stO, transform: "translateY(" + knock + "px) rotate(" + (stR + stR2) + "deg) scale(" + stS + ")", transformOrigin: "90px 80px" }}>
      <div style={{ display: "inline-block", border: "5px solid " + acc, borderRadius: 18, padding: 5, backgroundColor: paper, boxShadow: "4px 6px 0 " + SH }}>
        <div style={{ border: "2.5px solid " + acc, borderRadius: 12, padding: "2px 26px 6px 26px", height: 118, boxSizing: "border-box", display: "flex", alignItems: "flex-end", whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 58, lineHeight: 1, color: ink, paddingBottom: 14 }}>just</span>
          <span style={{ display: "inline-block", width: 214 * aiOpen, height: 108, position: "relative" }}>
            <span style={{ position: "absolute", left: 18, bottom: 0, display: "inline-block", fontFamily: props.serif, fontWeight: 900, fontSize: 116, lineHeight: 1, color: acc, letterSpacing: 2, opacity: aiO, transform: "scale(" + aiS + ")", transformOrigin: "15% 65%" }}>AI.</span>
          </span>
        </div>
      </div>
    </div>
  </div>;
};

return __Inner({ item });
};

export default Component;
