// B01 "not sure" (Ep8, 7 Oct 2026). Canvas 980x500, 113 frames. ChatCut motion graphic (Remotion runtime).
// "Well, I'm not sure it can clone every app, but let's try."
// The claim card CLONE ANY APP pops on "Well" and gets a "the claim" tag; a cut-out question mark pops over its
// corner on "not sure"; each word underlines in orange as Henry says it (clone, every, app); a stopwatch pops on
// "let's try" with a "let's try" sticker, its crown clicks and the hand sweeps one short arc, then everything holds.
const CB = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EOUT = Easing.out(Easing.cubic);
const SHADOW = "4px 6px 0 rgba(23,20,17,0.22)";
const CARD_X = 56;
const CARD_Y = 76;
const CARD_W = 590;
const CARD_H = 340;
const WORD_SIZE = 108;
const QPATH = "M20 40 C20 14 44 6 62 12 C82 19 86 46 70 60 C58 70 50 74 50 96";

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;

  // ---- claim card pops on "Well" (f0), settled f11
  const cardOp = interpolate(frame, [0, 2], [0, 1], CB);
  const cardSc = interpolate(frame, [0, 7, 11], [0.3, 1.06, 1], CB);
  const cardRot = interpolate(frame, [0, 7, 11], [-9, 0.5, -1.5], CB);
  // "the claim" tag on the card's top edge (f4-14)
  const tagOp = interpolate(frame, [4, 6], [0, 1], CB);
  const tagSc = interpolate(frame, [4, 10, 14], [0.3, 1.08, 1], CB);
  const tagRot = interpolate(frame, [4, 10, 14], [-14, 1, -3], CB);

  // ---- word underlines: clone f43, every f52, app f62 (each finishes 1 frame before its word)
  const ul1 = interpolate(frame, [37, 42], [0, 1], { ...CB, easing: EOUT });
  const ul2 = interpolate(frame, [46, 51], [0, 1], { ...CB, easing: EOUT });
  const ul3 = interpolate(frame, [56, 61], [0, 1], { ...CB, easing: EOUT });
  const w1Sc = interpolate(frame, [38, 42, 47], [1, 1.07, 1], CB);
  const w2Sc = interpolate(frame, [47, 51, 56], [1, 1.07, 1], CB);
  const w3Sc = interpolate(frame, [57, 61, 66], [1, 1.07, 1], CB);

  // ---- question mark pops on "not sure" (not f18, sure f24): lands f21-22
  const qOp = frame >= 16 ? 1 : 0;
  const qSc = interpolate(frame, [16, 21, 25], [0.2, 1.14, 1], CB);
  const qRot = interpolate(frame, [16, 21, 25], [-24, 11, 7], CB);

  // ---- stopwatch pops on "let's try" (let's f76, try f84): lands f83
  const swOp = frame >= 78 ? 1 : 0;
  const swSc = interpolate(frame, [78, 83, 87], [0.3, 1.08, 1], CB);
  const swRot = interpolate(frame, [78, 83, 87], [14, -2, 3], CB);
  const crownDy = interpolate(frame, [84, 86, 89], [0, 6, 0], CB);
  const handDeg = interpolate(frame, [85, 98], [0, 64], { ...CB, easing: EOUT });
  // "let's try" sticker (f86-96)
  const stOp = interpolate(frame, [86, 88], [0, 1], CB);
  const stSc = interpolate(frame, [86, 92, 96], [0.3, 1.08, 1], CB);
  const stRot = interpolate(frame, [86, 92, 96], [12, -1, 3], CB);

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const lineStyle = { display: "flex", alignItems: "baseline", fontFamily: props.serif, fontWeight: 900, fontSize: WORD_SIZE, lineHeight: 1, color: ink, letterSpacing: 1, whiteSpace: "nowrap" };
  const word = (text, p, sc) => (
    <span style={{ position: "relative", display: "inline-block", transform: "scale(" + sc + ")", transformOrigin: "50% 80%" }}>
      {text}
      <svg viewBox="0 0 300 20" preserveAspectRatio="none" style={{ position: "absolute", left: -6, bottom: -4, width: "104%", height: 20, overflow: "visible" }}>
        <path d="M4 12 Q80 4 150 10 T296 8" fill="none" stroke={acc} strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />
      </svg>
    </span>
  );

  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const big = i % 3 === 0;
    const r0 = big ? 36 : 40;
    ticks.push(<line key={i} x1={60 + Math.sin(a) * r0} y1={82 - Math.cos(a) * r0} x2={60 + Math.sin(a) * 45} y2={82 - Math.cos(a) * 45} stroke={ink} strokeWidth={big ? 4 : 2.5} strokeLinecap="round" opacity={big ? 1 : 0.5} />);
  }

  return <div style={rootStyle}>
    {/* claim card */}
    <div style={{ position: "absolute", left: CARD_X, top: CARD_Y, width: CARD_W, height: CARD_H, opacity: cardOp, transform: "rotate(" + cardRot + "deg) scale(" + cardSc + ")", transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 14, boxShadow: SHADOW }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={lineStyle}>{word("CLONE", ul1, w1Sc)}</div>
        <div style={lineStyle}>{word("ANY", ul2, w2Sc)}<span style={{ display: "inline-block", width: 30 }} />{word("APP", ul3, w3Sc)}</div>
      </div>
      {/* "the claim" tag */}
      <div style={{ position: "absolute", left: 28, top: -34, display: "flex", alignItems: "center", gap: 10, backgroundColor: ink, color: paper, fontFamily: props.hand, fontWeight: 700, fontSize: 40, lineHeight: 1, padding: "9px 20px 7px 16px", borderRadius: 10, opacity: tagOp, transform: "rotate(" + tagRot + "deg) scale(" + tagSc + ")", transformOrigin: "30% 80%", boxShadow: SHADOW }}>
        <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
          <path d="M4 5 H20 V16 H11 L7 20 V16 H4 Z" fill="none" stroke={paper} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M8 9.5 H16 M8 12.5 H13" stroke={acc} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>the claim</span>
      </div>
    </div>

    {/* question mark cut-out */}
    <svg viewBox="0 0 100 140" style={{ position: "absolute", left: 600, top: 32, width: 180, height: 252, opacity: qOp, transform: "rotate(" + qRot + "deg) scale(" + qSc + ")", transformOrigin: "50% 60%", overflow: "visible", filter: "drop-shadow(4px 6px 0 rgba(23,20,17,0.22))" }}>
      <path d={QPATH} fill="none" stroke={ink} strokeWidth="27" strokeLinecap="round" strokeLinejoin="round" />
      <path d={QPATH} fill="none" stroke={acc} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="126" r="13.5" fill={ink} />
      <circle cx="50" cy="126" r="7.5" fill={acc} />
    </svg>

    {/* stopwatch */}
    <svg viewBox="0 0 120 140" style={{ position: "absolute", left: 704, top: 180, width: 230, height: 268, opacity: swOp, transform: "rotate(" + swRot + "deg) scale(" + swSc + ")", transformOrigin: "50% 60%", overflow: "visible", filter: "drop-shadow(4px 6px 0 rgba(23,20,17,0.22))" }}>
      <g transform={"translate(0 " + crownDy + ")"}>
        <rect x="55" y="18" width="10" height="14" fill={ink} />
        <rect x="48" y="5" width="24" height="14" rx="4" fill={gold} stroke={ink} strokeWidth="3.5" />
      </g>
      <rect x="92" y="20" width="16" height="11" rx="3" fill={paper} stroke={ink} strokeWidth="3.5" transform="rotate(42 100 25)" />
      <circle cx="60" cy="82" r="52" fill={paper} stroke={ink} strokeWidth="4.5" />
      {ticks}
      <text x="60" y="110" textAnchor="middle" fontFamily={props.sans} fontWeight="800" fontSize="15" fill={ink} opacity="0.55">00:00</text>
      <line x1="60" y1="82" x2="60" y2="46" stroke={acc} strokeWidth="5.5" strokeLinecap="round" transform={"rotate(" + handDeg + " 60 82)"} />
      <circle cx="60" cy="82" r="5.5" fill={ink} />
    </svg>
    {/* "let's try" sticker */}
    <div style={{ position: "absolute", left: 716, top: 418, display: "flex", alignItems: "center", backgroundColor: ink, color: paper, fontFamily: props.hand, fontWeight: 700, fontSize: 40, lineHeight: 1, padding: "9px 22px 7px 22px", borderRadius: 10, opacity: stOp, transform: "rotate(" + stRot + "deg) scale(" + stSc + ")", transformOrigin: "50% 50%", boxShadow: SHADOW, whiteSpace: "nowrap" }}>
      <span>let's try</span>
    </div>
  </div>;
};
