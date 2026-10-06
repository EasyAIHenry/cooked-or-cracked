const Component = ({ item }) => {
// B03 "11 skills" (Ep8, 7 Oct 2026). Canvas 980x500, 255 frames. ChatCut motion graphic (Remotion runtime).
// "While there's 11 different types of skill sets, I wanted to put to the test whether it works or not.
//  So, as you can see, I've actually installed Loom over here."
// A row of 11 blank skill cards counts in while a torn-paper counter rolls 1 to 11 (lands on "11"); the cards tilt
// apart on "different" and get their own small icons on "types"; a TEST stamp slams over the row on "test", a tick
// and a cross badge pop on "works" and "not"; on "as you can see" a terminal strip pops in, types
// `ls ~/.claude/skills`, returns 11 (lands f193) with an "installed" tick on "installed" (f195), and a small recorder card pops in its
// corner on "Loom". Then everything holds.
const CB = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EOUT = Easing.out(Easing.cubic);
const SHADOW = "4px 6px 0 rgba(23,20,17,0.22)";
const NC = 11;
const CW = 72;
const CH = 94;
const CGAP = 10;
const CX0 = 44;
const CY0 = 26;
const cardT = (k) => 3 + k * 1.1;
const iconT = (k) => 35 + k * 0.4;
const TORN = "polygon(0% 3%,14% 0%,30% 3%,46% 0%,62% 2%,79% 0%,100% 2%,98% 30%,100% 62%,99% 98%,82% 100%,66% 97%,50% 100%,33% 97%,17% 100%,0% 98%,2% 66%,0% 33%)";
const CMD = "ls ~/.claude/skills";
const TYPE_T0 = 172;
const TERM = { x: 372, y: 172, w: 566, h: 290 };
// small line icons, one per skill card (24-unit viewBox paths)
const GLYPHS = [
  "M13 2 L5 13 H11 L10 22 L19 10 H13 Z",
  "M8 4 C5 4 5 6 5 8 V10 C5 11.5 4 12 3 12 C4 12 5 12.5 5 14 V16 C5 18 5 20 8 20 M16 4 C19 4 19 6 19 8 V10 C19 11.5 20 12 21 12 C20 12 19 12.5 19 14 V16 C19 18 19 20 16 20",
  "M12 8 A4 4 0 1 0 12 16 A4 4 0 1 0 12 8 M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M5 5 L7 7 M17 17 L19 19 M5 19 L7 17 M17 7 L19 5",
  "M12 3 A9 9 0 1 0 12 21 A9 9 0 1 0 12 3 M3 12 H21 M12 3 C8 8 8 16 12 21 M12 3 C16 8 16 16 12 21",
  "M4 20 L8 19 L19 8 L16 5 L5 16 Z M14 7 L17 10",
  "M4 20 H20 M6 16 V10 M11 16 V6 M16 16 V12",
  "M6 11 V8 A6 6 0 0 1 18 8 V11 M5 11 H19 V21 H5 Z M12 15 V18",
  "M7 18 A4 4 0 0 1 7 10 A5.5 5.5 0 0 1 17.5 9 A4.5 4.5 0 0 1 17 18 Z",
  "M4 5 H20 V16 H11 L7 20 V16 H4 Z",
  "M4 4 H10 V10 H4 Z M14 4 H20 V10 H14 Z M4 14 H10 V20 H4 Z M14 14 H20 V20 H14 Z",
  "M12 3 L14.6 8.6 L20.5 9.3 L16.2 13.4 L17.4 19.3 L12 16.4 L6.6 19.3 L7.8 13.4 L3.5 9.3 L9.4 8.6 Z",
];

const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };

  // ---- cards count in (f3-15), tilt apart on "different" (f26), icons on "types" (f42)
  let n = 0;
  for (let k = 0; k < NC; k++) if (frame >= cardT(k)) n = k + 1;
  const tiltP = interpolate(frame, [22, 26, 30], [0, 1.15, 1], CB);
  const cards = [];
  for (let k = 0; k < NC; k++) {
    const t0 = cardT(k);
    const vis = frame >= t0 ? 1 : 0;
    const sc = interpolate(frame, [t0, t0 + 4, t0 + 8], [0.3, 1.1, 1], CB);
    const tilt = (random("tilt" + k) * 2 - 1) * 5 * tiltP;
    const lift = (random("lift" + k) * 2 - 1) * 5 * tiltP;
    const iOp = frame >= iconT(k) ? 1 : 0;
    const iSc = interpolate(frame, [iconT(k), iconT(k) + 3, iconT(k) + 6], [0.2, 1.2, 1], CB);
    const hot = k % 3 === 1;
    cards.push(<div key={k} style={{ position: "absolute", left: CX0 + k * (CW + CGAP), top: CY0 + lift, width: CW, height: CH, opacity: vis, transform: "rotate(" + tilt + "deg) scale(" + sc + ")", transformOrigin: "50% 60%" }}>
      <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", backgroundColor: paper, border: "2.5px solid " + ink, borderRadius: 9, boxShadow: SHADOW }} />
      <div style={{ position: "absolute", left: 10, top: 66, width: CW - 20, height: 4, borderRadius: 2, backgroundColor: ink, opacity: 0.18 }} />
      <div style={{ position: "absolute", left: 10, top: 76, width: CW - 34, height: 4, borderRadius: 2, backgroundColor: ink, opacity: 0.18 }} />
      <svg viewBox="0 0 24 24" style={{ position: "absolute", left: 16, top: 14, width: 40, height: 40, opacity: iOp, transform: "scale(" + iSc + ")", transformOrigin: "50% 50%" }}>
        <path d={GLYPHS[k]} fill={hot ? acc : "none"} stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>);
  }

  // ---- counter chip: pops with the first card, number bumps on each count, lands on 11 at f15 (word "11" f17)
  const chipOp = frame >= 2 ? 1 : 0;
  const chipSc = interpolate(frame, [2, 7, 11], [0.3, 1.08, 1], CB);
  const chipRot = interpolate(frame, [2, 7, 11], [8, -1, -2], CB);
  const lastT = n > 0 ? cardT(n - 1) : 0;
  const bump = 1 + 0.12 * (1 - interpolate(frame - lastT, [0, 2.5], [0, 1], CB));
  const land = interpolate(frame, [15, 18, 23], [1, 1.14, 1], CB);
  const shown = Math.max(1, n);

  // ---- TEST stamp slams over the row on "test" (f100): hits f98
  const stOp = interpolate(frame, [94, 96], [0, 1], CB);
  const stSc = interpolate(frame, [94, 98, 101, 104], [1.35, 0.88, 1.03, 0.97], CB);
  const jolt = interpolate(frame, [98, 100, 104], [0, 3, 0], CB);
  const burst = interpolate(frame, [98, 104], [0, 1], { ...CB, easing: EOUT });
  const burstOp = interpolate(frame, [98, 99, 105, 110], [0, 1, 1, 0], CB);
  const burstLines = [[-1, -0.5], [-1, 0.5], [1, -0.5], [1, 0.5]].map((v, k) => {
    const x0 = v[0] * 160;
    const y0 = v[1] * 44;
    const x1 = v[0] * (160 + 26 * burst);
    const y1 = v[1] * (44 + 24 * burst);
    return <line key={k} x1={x0} y1={y0} x2={x1} y2={y1} stroke={acc} strokeWidth="5" strokeLinecap="round" />;
  });
  // tick on "works" (f118), cross on "not" (f128)
  const tkOp = frame >= 114 ? 1 : 0;
  const tkSc = interpolate(frame, [114, 118, 122], [0.2, 1.15, 1], CB);
  const tkRot = interpolate(frame, [114, 118, 122], [-20, 4, -4], CB);
  const crOp = frame >= 124 ? 1 : 0;
  const crSc = interpolate(frame, [124, 128, 132], [0.2, 1.15, 1], CB);
  const crRot = interpolate(frame, [124, 128, 132], [20, -4, 5], CB);

  // ---- terminal pops on "as you can see" (see f161): lands f160; types f172-191; returns 11 f191-195; tick f195
  const tmOp = frame >= 156 ? 1 : 0;
  const tmSc = interpolate(frame, [156, 160, 164], [0.6, 1.04, 1], CB);
  const tmDy = interpolate(frame, [156, 161], [30, 0], { ...CB, easing: EOUT });
  const typed = Math.min(CMD.length, Math.max(0, Math.floor(frame - TYPE_T0) + 1));
  const typing = frame >= 160 && frame < TYPE_T0 + CMD.length + 1;
  const cursorOn = typing && (frame < TYPE_T0 ? Math.floor(frame / 8) % 2 === 0 : true);
  const outVis = frame >= 191 ? 1 : 0;
  const outN = Math.min(11, Math.max(1, 1 + Math.floor((frame - 189) * 2.5)));
  const outSc = interpolate(frame, [193, 196, 201], [1, 1.1, 1], CB);
  const insOp = frame >= 191 ? 1 : 0;
  const insSc = interpolate(frame, [191, 194, 198], [0.4, 1.08, 1], CB);
  const okOp = frame >= 191 ? 1 : 0;
  const okSc = interpolate(frame, [191, 194, 198], [0.2, 1.18, 1], CB);
  const okRot = interpolate(frame, [191, 194, 198], [-25, 5, -5], CB);
  const okDraw = interpolate(frame, [192, 195], [0, 1], { ...CB, easing: EOUT });
  // recorder mini card on "Loom" (f214): lands f213
  const rcOp = frame >= 209 ? 1 : 0;
  const rcSc = interpolate(frame, [209, 213, 217], [0.3, 1.1, 1], CB);
  const rcRot = interpolate(frame, [209, 213, 217], [12, -2, 3], CB);

  return <div style={rootStyle}>
    {cards}

    {/* counter chip */}
    <div style={{ position: "absolute", left: 44, top: 162, width: 290, height: 262, opacity: chipOp, transform: "rotate(" + chipRot + "deg) scale(" + chipSc + ")", transformOrigin: "50% 50%", filter: "drop-shadow(4px 6px 0 rgba(23,20,17,0.22))" }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: paper, clipPath: TORN }} />
      <div style={{ position: "absolute", left: 0, top: 14, width: 290, height: 170, lineHeight: "170px", textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 160, color: ink, transform: "scale(" + (bump * land) + ")", transformOrigin: "50% 55%" }}>{String(shown)}</div>
      <div style={{ position: "absolute", left: 0, top: 186, width: 290, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 48, lineHeight: "54px", color: acc, letterSpacing: 1 }}>skills</div>
    </div>

    {/* TEST stamp over the card row */}
    <div style={{ position: "absolute", left: 340, top: 28 + jolt, width: 300, height: 92, opacity: stOp, transform: "rotate(-5deg) scale(" + stSc + ")", transformOrigin: "50% 60%" }}>
      <svg viewBox="-280 -110 560 220" style={{ position: "absolute", left: 150 - 280, top: 46 - 110, width: 560, height: 220, overflow: "visible", opacity: burstOp }}>{burstLines}</svg>
      <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", border: "5px solid " + acc, borderRadius: 12, backgroundColor: "rgba(255,254,250,0.94)" }} />
      <div style={{ position: "absolute", left: 9, top: 9, right: 9, bottom: 9, boxSizing: "border-box", border: "2px solid " + acc, borderRadius: 6 }} />
      <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 62, lineHeight: "92px", color: acc, letterSpacing: 8, paddingLeft: 8 }}>TEST</div>
    </div>
    {/* works / not badges */}
    <div style={{ position: "absolute", left: 706, top: 36, width: 70, height: 70, borderRadius: 35, boxSizing: "border-box", backgroundColor: gold, border: "3px solid " + ink, boxShadow: SHADOW, opacity: tkOp, transform: "rotate(" + tkRot + "deg) scale(" + tkSc + ")" }}>
      <svg viewBox="0 0 24 24" style={{ position: "absolute", left: 11, top: 11, width: 42, height: 42 }}><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={ink} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    <div style={{ position: "absolute", left: 800, top: 40, width: 70, height: 70, borderRadius: 35, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, boxShadow: SHADOW, opacity: crOp, transform: "rotate(" + crRot + "deg) scale(" + crSc + ")" }}>
      <svg viewBox="0 0 24 24" style={{ position: "absolute", left: 11, top: 11, width: 42, height: 42 }}><path d="M7 7 L17 17 M17 7 L7 17" fill="none" stroke={acc} strokeWidth="3.6" strokeLinecap="round" /></svg>
    </div>

    {/* terminal strip */}
    <div style={{ position: "absolute", left: TERM.x, top: TERM.y, width: TERM.w, height: TERM.h, opacity: tmOp, transform: "translateY(" + tmDy + "px) rotate(1deg) scale(" + tmSc + ")", transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", backgroundColor: ink, border: "3px solid " + ink, borderRadius: 16, boxShadow: SHADOW }} />
      <div style={{ position: "absolute", left: 20, top: 16, display: "flex", gap: 9 }}>
        {[0, 1, 2].map((d) => <div key={d} style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: d === 0 ? acc : paper, opacity: d === 0 ? 1 : 0.35 }} />)}
      </div>
      <div style={{ position: "absolute", left: 28, top: 58, display: "flex", alignItems: "center", fontFamily: props.sans, fontWeight: 800, fontSize: 36, lineHeight: "44px", color: paper, whiteSpace: "pre" }}>
        <span style={{ color: acc, marginRight: 14 }}>$</span>
        <span>{CMD.slice(0, typed)}</span>
        <span style={{ display: cursorOn ? "inline-block" : "none", width: 18, height: 36, marginLeft: 4, backgroundColor: acc, borderRadius: 2 }} />
      </div>
      <div style={{ position: "absolute", left: 28, top: 122, display: "flex", alignItems: "center", gap: 18, opacity: outVis }}>
        <div style={{ fontFamily: props.serif, fontWeight: 900, fontSize: 108, lineHeight: "110px", color: paper, minWidth: 130, transform: "scale(" + outSc + ")", transformOrigin: "50% 55%" }}>{String(outN)}</div>
        <div style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 46, lineHeight: "50px", color: acc, opacity: insOp, transform: "scale(" + insSc + ")", transformOrigin: "0% 50%", whiteSpace: "nowrap" }}>installed</div>
        <div style={{ width: 70, height: 70, borderRadius: 35, boxSizing: "border-box", backgroundColor: gold, border: "3px solid " + paper, opacity: okOp, transform: "rotate(" + okRot + "deg) scale(" + okSc + ")", flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" style={{ position: "absolute", left: 11, top: 11, width: 42, height: 42 }}><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={ink} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - okDraw} /></svg>
        </div>
      </div>
      {/* recorder mini card, pops on "Loom" */}
      <div style={{ position: "absolute", left: TERM.w - 130, top: TERM.h - 106, width: 106, height: 88, opacity: rcOp, transform: "rotate(" + rcRot + "deg) scale(" + rcSc + ")", transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 12, boxShadow: "3px 4px 0 rgba(255,254,250,0.25)" }} />
        <svg viewBox="0 0 160 130" style={{ position: "absolute", left: 10, top: 6, width: 86, height: 70 }}>
          <rect x="12" y="8" width="136" height="94" rx="10" fill={paper} stroke={ink} strokeWidth="6" />
          <circle cx="80" cy="56" r="24" fill="none" stroke={ink} strokeWidth="6" />
          <circle cx="80" cy="56" r="13" fill={acc} />
          <path d="M44 122 H116" stroke={ink} strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  </div>;
};

return __Inner({ item });
};
