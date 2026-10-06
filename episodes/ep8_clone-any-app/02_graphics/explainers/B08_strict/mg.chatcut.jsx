const Component = ({ item }) => {
// B08 strict: "So Meta is actually very strict on that." (Ep8, 79 frames, 980x500). ChatCut motion graphic (Remotion runtime).
// Two elements. A rules sheet pops on "Meta" (f2) and three rule lines get ticked through "is actually" (f14, f22, f30).
// A shield pops on "very" (f31); on "strict" (f39) it fills orange and the hand label STRICT slams across it. Still from f50.
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EO = Easing.out(Easing.cubic);
const popS = (t) => interpolate(t, [0, 7, 12], [0.3, 1.08, 1], CL);
const popO = (t) => interpolate(t, [0, 3], [0, 1], CL);
const popR = (t, r) => interpolate(t, [0, 7, 12], [r * 5, -r * 0.6, r], CL);
const SHIELD = "M50 4 L94 18 V54 C94 84 76 102 50 112 C24 102 6 84 6 54 V18 Z";
const ROWS = [108, 194, 280];
const TICKS = [14, 22, 30];

const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;
  const serif = props.serif;
  const hand = props.hand;
  const sans = props.sans;
  const shadow = "4px 6px 0 rgba(23,20,17,0.22)";
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };

  // ---------- timings (frames relative to MG start) ----------
  // So f3 / meta f4 / is f13 / actually f17 / very f34 / strict f42 / on f54 / that f58
  const tSheet = 2;      // Meta: the rules sheet
  const tShield = 31;    // very: the shield
  const tStrict = 39;    // strict: fill + label

  const sheetT = frame - tSheet;
  const underline = interpolate(frame, [tSheet + 8, tSheet + 16], [0, 1], { ...CL, easing: EO });
  const shT = frame - tShield;
  const fillP = interpolate(frame, [tStrict, tStrict + 7], [0, 1], { ...CL, easing: EO });
  const stT = frame - tStrict;
  const stS = interpolate(stT, [0, 5, 9], [1.6, 0.94, 1], CL);
  const stO = interpolate(stT, [0, 2], [0, 1], CL);
  const stR = interpolate(stT, [0, 5], [-10, -5], { ...CL, easing: EO });
  const shieldBump = interpolate(frame, [tStrict + 2, tStrict + 6, tStrict + 11], [1, 1.07, 1], CL);
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 41px," + ink + "14 42px,transparent 43px)";

  const row = (top, i) => {
    const barW = interpolate(frame, [tSheet + 6 + i * 3, tSheet + 14 + i * 3], [0, 1], { ...CL, easing: EO });
    const tk = frame - TICKS[i];
    const tickS = interpolate(tk, [0, 4, 8], [0, 1.25, 1], CL);
    const tickD = interpolate(tk, [0, 5], [0, 1], { ...CL, easing: EO });
    const boxS = interpolate(tk, [0, 3, 7], [1, 1.12, 1], CL);
    return (
      <div key={"r" + i} style={{ position: "absolute", left: 30, top, width: 380, height: 52 }}>
        <div style={{ position: "absolute", left: 0, top: 2, width: 50, height: 50, boxSizing: "border-box", border: "3px solid " + ink, borderRadius: 10, backgroundColor: paper, transform: "scale(" + boxS + ")" }} />
        <svg viewBox="0 0 50 50" width="62" height="62" style={{ position: "absolute", left: -4, top: -6, overflow: "visible", transform: "scale(" + tickS + ")", transformOrigin: "50% 50%" }}>
          <path d="M10 27 L21 38 L42 12" fill="none" stroke={acc} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="52" strokeDashoffset={52 * (1 - tickD)} />
        </svg>
        <div style={{ position: "absolute", left: 72, top: 18, width: 300 * barW, height: 18, borderRadius: 9, backgroundColor: ink, opacity: 0.22 }} />
      </div>
    );
  };

  return (
    <div style={rootStyle}>
      {/* rules sheet */}
      <div style={{ position: "absolute", left: 90, top: 46, width: 440, height: 408, boxSizing: "border-box", backgroundColor: paper, backgroundImage: ruled, backgroundPosition: "0 24px", border: "3px solid " + ink, borderRadius: 14, boxShadow: shadow, opacity: popO(sheetT), transform: "rotate(" + popR(sheetT, -1.5) + "deg) scale(" + popS(sheetT) + ")", transformOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 30, top: 10, fontFamily: hand, fontWeight: 700, fontSize: 48, lineHeight: "60px", color: ink }}>rules</div>
        <svg viewBox="0 0 160 20" width="160" height="20" style={{ position: "absolute", left: 26, top: 66 }}>
          <path d="M4 12 Q50 4 90 10 T156 8" fill="none" stroke={acc} strokeWidth="7" strokeLinecap="round" strokeDasharray="160" strokeDashoffset={160 * (1 - underline)} />
        </svg>
        <div style={{ position: "absolute", right: 24, top: 22, fontFamily: sans, fontWeight: 800, fontSize: 22, lineHeight: "26px", letterSpacing: 3, color: ink, opacity: 0.5 }}>PLATFORM</div>
        {ROWS.map(row)}
      </div>
      {/* shield */}
      <div style={{ position: "absolute", left: 596, top: 30, width: 310, height: 358, opacity: popO(shT), transform: "rotate(" + popR(shT, 2) + "deg) scale(" + popS(shT) * shieldBump + ")", transformOrigin: "50% 50%", filter: "drop-shadow(4px 6px 0 rgba(23,20,17,0.22))" }}>
        <svg viewBox="0 0 100 116" width="310" height="358" style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="b08fill"><rect x="0" y={116 - 116 * fillP} width="100" height="120" /></clipPath>
          </defs>
          <path d={SHIELD} fill={paper} />
          <path d={SHIELD} fill={acc} clipPath="url(#b08fill)" />
          <path d="M50 14 L84 25 V54 C84 76 70 91 50 100 Z" fill={paper} opacity={0.12 * fillP} />
          <path d={SHIELD} fill="none" stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
        </svg>
      </div>
      {/* STRICT, hand label with a highlighter bar */}
      <div style={{ position: "absolute", left: 540, top: 262, width: 420, height: 110, opacity: stO, transform: "rotate(" + stR + "deg) scale(" + stS + ")", transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 40, top: 46, width: 340, height: 44, backgroundColor: gold, opacity: 0.9, transform: "rotate(-1deg)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 420, textAlign: "center", fontFamily: hand, fontWeight: 700, fontSize: 104, lineHeight: "110px", letterSpacing: 2, color: ink }}>STRICT</div>
      </div>
    </div>
  );
};

return __Inner({ item });
};
