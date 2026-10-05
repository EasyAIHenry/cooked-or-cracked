// @ts-nocheck
import React from 'react';
import { useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill } from 'remotion';
const Component = ({ item }) => {
// B12 ghost CTA (Ep7, 5 Oct 2026). Canvas 820x420, 77 frames. ChatCut motion graphic (Remotion runtime).
// "comment GHOST and I'll send you my workflow."
// An Instagram-style comment field pops in, GHOST types in big and gets sent; the posted comment slides up-left,
// the send arrow flies off as a paper plane (dotted trail) and a DM bubble unfolds where it lands,
// holding a file card (lands with the bubble on "send", name shown as skeleton bars) that resolves to "my" (pop) and
// "workflow" (wipe), whose underline draws after the last word. Round 2: margins, palette-safe entrance, 72 px title.
const CB = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EOUT = Easing.out(Easing.cubic);
const EINOUT = Easing.inOut(Easing.cubic);
const bez = (t, a, b, c, d) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
const bezD = (t, a, b, c, d) => { const u = 1 - t; return 3 * u * u * (b - a) + 6 * u * t * (c - b) + 3 * t * t * (d - c); };
const pop = (f, t0, from) => interpolate(f, [t0, t0 + 6, t0 + 11], [from, 1.08, 1], CB);

// comment card geometry (unscaled), start and posted positions
const CW = 750;
const CH = 170;
const C0X = 410;
const C0Y = 214;
const S1 = 0.725;
const C1X = 24 + (CW * S1) / 2;
const C1Y = 48 + (CH * S1) / 2;
const R0 = -1;
const R1 = -1.5;
// DM bubble
const BX = 150;
const BY = 234;
const BW = 640;
const BH = 148;
const RIM = 12;
// plane flight: from the posted send button to the bubble's top-right corner
const BTN_REL_X = CW - 24 - 48 - CW / 2;
const rad1 = (R1 * Math.PI) / 180;
const P0X = C1X + Math.cos(rad1) * BTN_REL_X * S1;
const P0Y = C1Y + Math.sin(rad1) * BTN_REL_X * S1;
const P1X = 660;
const P1Y = 26;
const P2X = 790;
const P2Y = 90;
const P3X = BX + BW - 22;
const P3Y = BY + 4;
const LETTERS = ["G", "H", "O", "S", "T"];
const LT = [11, 12, 13, 14, 15];


const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;
  const shadow = "4px 6px 0 rgba(23,20,17,0.22)";

  // ---- comment card: pop in, then post (slide up-left, shrink)
  const cardOp = interpolate(frame, [0, 3], [0, 1], CB);
  const cardPop = interpolate(frame, [0, 7, 12], [0.3, 1.025, 1], CB);
  const mv = interpolate(frame, [25, 33], [0, 1], { ...CB, easing: EOUT });
  const cx = C0X + (C1X - C0X) * mv;
  const cy = C0Y + (C1Y - C0Y) * mv;
  const csc = cardPop * (1 + (S1 - 1) * mv);
  const crot = R0 + (R1 - R0) * mv;
  const cardWrap = { position: "absolute", left: cx - CW / 2, top: cy - CH / 2, width: CW, height: CH, opacity: cardOp, transform: "rotate(" + crot + "deg) scale(" + csc + ")", transformOrigin: "50% 50%" };
  const cardFace = { position: "absolute", inset: 0, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: CH / 2, boxShadow: shadow };

  // "comment" tag sticker on the card's top edge
  const tagOp = interpolate(frame, [2, 5], [0, 1], CB);
  const tagSc = pop(frame, 2, 0.3);
  const tagRt = interpolate(frame, [2, 8, 13], [-14, 0, -2], CB);
  const tagStyle = { position: "absolute", left: 64, top: -32, display: "flex", alignItems: "center", gap: 10, backgroundColor: ink, color: paper, fontFamily: props.hand, fontWeight: 700, fontSize: 42, lineHeight: 1, padding: "9px 20px 7px 16px", borderRadius: 10, opacity: tagOp, transform: "rotate(" + tagRt + "deg) scale(" + tagSc + ")", transformOrigin: "30% 80%", boxShadow: shadow };

  // avatar
  const avStyle = { position: "absolute", left: 24, top: 37, width: 96, height: 96, borderRadius: 48, boxSizing: "border-box", border: "3px solid " + ink, backgroundColor: "rgba(23,20,17,0.07)", overflow: "hidden" };

  // typing area
  const phOp = frame >= 4 && frame < 11 ? interpolate(frame, [4, 6], [0, 1], CB) : 0;
  const caretOn = frame >= 7 && frame < 24;
  const textArea = { position: "absolute", left: 138, top: 0, height: CH, right: 132, display: "flex", alignItems: "center" };
  const phStyle = { position: "absolute", left: 22, top: 0, height: CH, display: "flex", alignItems: "center", fontFamily: props.sans, fontWeight: 800, fontSize: 34, color: ink, opacity: phOp * 0.38, whiteSpace: "nowrap" };
  const letters = LETTERS.map((ch, i) => {
    if (frame < LT[i]) return null;
    const s = interpolate(frame, [LT[i], LT[i] + 2, LT[i] + 5], [0.7, 1.12, 1], CB);
    const ls = { display: "inline-block", transform: "scale(" + s + ")", transformOrigin: "50% 85%" };
    return <span key={i} style={ls}>{ch}</span>;
  });
  const ghostStyle = { fontFamily: props.serif, fontWeight: 900, fontSize: 116, lineHeight: 1, color: ink, letterSpacing: 1, whiteSpace: "nowrap", display: "flex", alignItems: "center", marginTop: 6 };
  const caretStyle = { display: caretOn ? "inline-block" : "none", width: 7, height: 96, marginLeft: 8, backgroundColor: acc, borderRadius: 3 };

  // send button: press, then the arrow leaves as a plane and a check stamps in
  const btnSc = interpolate(frame, [19, 21, 23, 27], [1, 0.82, 1.1, 1], CB);
  const btnStyle = { position: "absolute", left: CW - 24 - 96, top: 37, width: 96, height: 96, borderRadius: 48, boxSizing: "border-box", border: "3px solid " + ink, backgroundColor: acc, display: "flex", alignItems: "center", justifyContent: "center", transform: "scale(" + btnSc + ")" };
  const planeInBtn = frame < 31;
  const chkSc = interpolate(frame, [32, 36, 40], [0.2, 1.15, 1], CB);
  const chkOp = interpolate(frame, [32, 34], [0, 1], CB);

  // ---- plane flight + dotted trail
  const ft = interpolate(frame, [31, 37], [0, 1], { ...CB, easing: EINOUT });
  const flying = frame >= 31 && frame < 41;
  const px = bez(ft, P0X, P1X, P2X, P3X);
  const py = bez(ft, P0Y, P1Y, P2Y, P3Y);
  const dx = bezD(Math.min(Math.max(ft, 0.02), 0.98), P0X, P1X, P2X, P3X);
  const dy = bezD(Math.min(Math.max(ft, 0.02), 0.98), P0Y, P1Y, P2Y, P3Y);
  const tang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const startAng = -32 + R1;
  const blendIn = interpolate(frame, [31, 33], [0, 1], CB);
  const pAng = startAng + (tang - startAng) * blendIn;
  // the plane dives into the corner and unfolds into the DM bubble
  const pSc = interpolate(frame, [31, 34, 37, 40], [S1, 1.2, 0.9, 0], CB);
  const pOp = interpolate(frame, [38, 40], [1, 0], CB);
  const PS = 50;
  const planeStyle = { position: "absolute", left: px - PS / 2, top: py - PS / 2, width: PS, height: PS, transform: "rotate(" + pAng + "deg) scale(" + pSc + ")", opacity: pOp, display: flying ? "block" : "none" };
  const dots = [];
  const ND = 16;
  for (let i = 1; i < ND; i++) {
    const t = i / ND;
    if (ft < t + 0.03 || t > 0.97) continue;
    dots.push(<circle key={i} cx={bez(t, P0X, P1X, P2X, P3X)} cy={bez(t, P0Y, P1Y, P2Y, P3Y)} r={3.6} fill={ink} opacity={0.4} />);
  }

  // ---- DM bubble unfolds from the landing corner
  const bOp = frame >= 36 ? 1 : 0;
  const bSc = interpolate(frame, [35, 41, 46], [0.15, 1.06, 1], CB);
  const bRt = interpolate(frame, [35, 41, 46], [6, 1.6, 0.6], CB);
  const bubble = { position: "absolute", left: BX, top: BY, width: BW, height: BH, boxSizing: "border-box", backgroundColor: acc, border: "3px solid " + ink, borderRadius: 34, boxShadow: shadow, opacity: bOp, transform: "rotate(" + bRt + "deg) scale(" + bSc + ")", transformOrigin: (P3X - BX) + "px " + (P3Y - BY) + "px" };

  // "your DMs" tag on the bubble's top edge, lands on "you"
  const dOp = interpolate(frame, [40, 43], [0, 1], CB);
  const dSc = pop(frame, 40, 0.3);
  const dRt = interpolate(frame, [40, 46, 51], [12, 1, 3], CB);
  const dmTag = { position: "absolute", left: 30, top: -30, display: "flex", alignItems: "center", gap: 8, backgroundColor: ink, color: paper, fontFamily: props.hand, fontWeight: 700, fontSize: 34, lineHeight: 1, padding: "8px 18px 6px 12px", borderRadius: 10, opacity: dOp, transform: "rotate(" + dRt + "deg) scale(" + dSc + ")", transformOrigin: "30% 80%", boxShadow: shadow, zIndex: 2 };

  // file card inside the bubble
  // file card arrives with the bubble (on "send"), its name resolves on "my" / "workflow"
  const fOp = frame >= 38 ? 1 : 0;
  const fSc = interpolate(frame, [38, 41, 45], [0.6, 1.03, 1], CB);
  const fileCard = { position: "absolute", left: RIM, top: RIM, right: RIM, bottom: RIM, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 34 - RIM, display: "flex", alignItems: "center", gap: 16, padding: "0 16px", opacity: fOp, transform: "scale(" + fSc + ")", transformOrigin: "70% 40%" };
  const TS = 72;
  const titleBox = { position: "relative", display: "flex", alignItems: "center", height: TS, marginTop: -8 };
  const titleStyle = { fontFamily: props.serif, fontWeight: 900, fontSize: TS, lineHeight: 1, color: ink, whiteSpace: "nowrap", display: "flex", alignItems: "baseline" };
  // "my" pops (f46-49)
  const myOp = frame >= 46 ? 1 : 0;
  const mySc = interpolate(frame, [46, 48, 50], [0.4, 1.12, 1], CB);
  const mySpan = { display: "inline-block", opacity: myOp, transform: "scale(" + mySc + ")", transformOrigin: "50% 80%" };
  // "workflow" wipes on (f51-55), underline draws f55-63
  const wipe = interpolate(frame, [51, 55], [0, 100], { ...CB, easing: EOUT });
  const wfSpan = { position: "relative", display: "inline-block", marginLeft: 18 };
  const wfText = { display: "inline-block", opacity: wipe > 0 ? 1 : 0, clipPath: "inset(-14px " + (100 - wipe) + "% -14px -14px)" };
  const ul = interpolate(frame, [55, 63], [0, 1], { ...CB, easing: EOUT });
  const ulSvg = { position: "absolute", left: -4, bottom: -14, width: "104%", height: 20, overflow: "visible" };
  // skeleton name bars while the file is landing, replaced by the words
  const skOp = interpolate(frame, [38, 40], [0, 1], CB);
  const sk1Op = skOp * interpolate(frame, [46, 48], [1, 0], CB);
  const sk1 = { position: "absolute", left: 6, top: TS * 0.5 - 2, width: 104, height: 20, borderRadius: 10, backgroundColor: "rgba(23,20,17,0.12)", opacity: sk1Op };
  const sk2 = { position: "absolute", left: 138, top: TS * 0.5 - 2, width: 356, height: 20, borderRadius: 10, backgroundColor: "rgba(23,20,17,0.12)", opacity: skOp, clipPath: "inset(0 0 0 " + wipe + "%)" };

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  return <div style={rootStyle}>
    {/* dotted trail */}
    <svg width={820} height={420} style={{ position: "absolute", left: 0, top: 0 }}>{dots}</svg>

    {/* DM bubble */}
    <div style={bubble}>
      <svg width={120} height={40} style={{ position: "absolute", left: 22, top: BH - 11, overflow: "visible" }}>
        <path d="M12 0 H68 V8 C54 12 34 24 6 32 C20 22 22 12 12 8 Z" fill={acc} />
        <path d="M68 6.5 C54 11 34 24 6 32 C20 22 22 12 12 6.5" fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div style={dmTag}>
        <svg viewBox="0 0 24 24" style={{ width: 30, height: 30, transform: "rotate(-28deg)" }}>
          <path d="M2.5 4 L22 12 L2.5 20 L6.5 12 Z" fill="none" stroke={paper} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M6.5 12 H22" stroke={acc} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>your DMs</span>
      </div>
      <div style={fileCard}>
        <svg viewBox="0 0 70 88" style={{ width: 48, height: 60, flexShrink: 0, marginTop: -4 }}>
          <path d="M4 3 H48 L66 21 V85 H4 Z" fill={paper} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M48 3 V21 H66 Z" fill={gold} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          <rect x="13" y="30" width="20" height="13" rx="3" fill={paper} stroke={ink} strokeWidth="3" />
          <rect x="37" y="49" width="20" height="13" rx="3" fill={acc} stroke={ink} strokeWidth="3" />
          <rect x="13" y="68" width="20" height="11" rx="3" fill={paper} stroke={ink} strokeWidth="3" />
          <path d="M33 36.5 H47 V49 M37 55.5 H23 V68" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={titleBox}>
          <div style={sk1} />
          <div style={sk2} />
          <div style={titleStyle}><span style={mySpan}>my</span><span style={wfSpan}><span style={wfText}>workflow</span><svg viewBox="0 0 300 20" preserveAspectRatio="none" style={ulSvg}><path d="M4 12 Q80 4 150 10 T296 8" fill="none" stroke={acc} strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ul} opacity={ul > 0 ? 1 : 0} /></svg></span></div>
        </div>
      </div>
    </div>

    {/* comment card */}
    <div style={cardWrap}>
      <div style={cardFace} />
      <div style={avStyle}>
        <svg viewBox="0 0 96 96" style={{ width: 90, height: 90 }}>
          <circle cx="45" cy="36" r="15" fill={acc} stroke={ink} strokeWidth="3" />
          <path d="M16 90 C18 64 72 64 74 90 Z" fill={acc} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={textArea}>
        <div style={phStyle}>Add a comment…</div>
        <div style={ghostStyle}>{letters}<span style={caretStyle} /></div>
      </div>
      <div style={btnStyle}>
        {planeInBtn ? <svg viewBox="0 0 24 24" style={{ width: 50, height: 50, transform: "rotate(-32deg)" }}><path d="M2.5 4 L22 12 L2.5 20 L6.5 12 Z" fill={paper} stroke={ink} strokeWidth="1.8" strokeLinejoin="round" /><path d="M6.5 12 H22" stroke={ink} strokeWidth="1.5" strokeLinecap="round" /></svg> : null}
        {!planeInBtn ? <svg viewBox="0 0 24 24" style={{ width: 54, height: 54, opacity: chkOp, transform: "scale(" + chkSc + ")" }}><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={ink} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
      </div>
      <div style={tagStyle}>
        <svg viewBox="0 0 24 24" style={{ width: 34, height: 34 }}>
          <path d="M4 5 H20 V16 H11 L7 20 V16 H4 Z" fill="none" stroke={paper} strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="8.5" cy="10.5" r="1.3" fill={acc} />
          <circle cx="12" cy="10.5" r="1.3" fill={acc} />
          <circle cx="15.5" cy="10.5" r="1.3" fill={acc} />
        </svg>
        <span>comment</span>
      </div>
    </div>

    {/* flying plane (dives into the bubble corner, then unfolds into it) */}
    <svg viewBox="0 0 24 24" style={planeStyle}>
      <path d="M2.5 4 L22 12 L2.5 20 L6.5 12 Z" fill={paper} stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6.5 12 H22" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>;
};

return __Inner({ item });
};

export default Component;
