const Component = ({ item }) => {
  // B10 local disk (Ep8, 7 Oct 2026). Canvas 980x500, 209 frames. ChatCut motion graphic (Remotion runtime).
  // "(Not) everything is needed to be on cloud. I think some things are great if you install it in your local drive itself."
  // f0: a laptop card pops at the centre (screen empty, two faint dashed slots). On "cloud" (57) a small cloud pops above
  // it and is struck through. On "install" (133) the two clone tiles, recorder and queue, drop from the top into the
  // slots with a squash landing. On "local drive" (168, 177) the hand label "on your own disk" writes on under the laptop
  // and a drive badge pops on the laptop's corner; on "itself" (186) the orange underline draws. Still from f196.
  const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const EO = Easing.out(Easing.cubic);
  const EI = Easing.in(Easing.cubic);
  const EIO = Easing.inOut(Easing.cubic);
  const pop = (f, t0, d) => {
    const dd = d || 12;
    return {
      s: interpolate(f, [t0, t0 + dd * 0.58, t0 + dd], [0.3, 1.08, 1], { ...CL, easing: EO }),
      o: interpolate(f, [t0, t0 + 3], [0, 1], CL),
    };
  };
  const prog = (f, a, b, e) => interpolate(f, [a, b], [0, 1], { ...CL, easing: e || EO });
  const TORN2 = "polygon(0% 6%,14% 0%,30% 5%,46% 1%,61% 6%,77% 0%,90% 4%,100% 1%,99% 95%,86% 100%,71% 95%,55% 100%,39% 96%,24% 100%,9% 95%,0% 99%)";
  const SHADOW = "4px 6px 0 rgba(23,20,17,0.22)";
  const CLOUD = [[64, 86, 34], [112, 58, 44], [162, 82, 36]];
  // laptop geometry (canvas units)
  const LX = 250, LY = 44, LW = 480, LH = 300;   // screen outer box
  const SLOT = [[LX + 52, LY + 60], [LX + 262, LY + 60]];   // slot top-left corners, 166x172 each

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
    const f = frame;

    // ---------- timings ----------
    const tLap = 0;        // "everything" (0)
    const tSlots = 10;
    const tCloud = 50;     // "cloud" (57)
    const tStrike = 56;
    const tDrop1 = 124;    // "install" (133): tile 1 lands f131
    const tDrop2 = 129;    // tile 2 lands f136
    const tLabel = 164;    // "local" (168) .. "drive" (177)
    const tBadge = 174;
    const tLine = 183;     // "itself" (186)

    // ---------- laptop ----------
    const lap = pop(f, tLap, 13);
    const lapR = interpolate(f, [tLap, tLap + 8, tLap + 13], [-5, 0.8, 0], CL);
    const slots = prog(f, tSlots, tSlots + 10);
    const bump1 = interpolate(f, [tDrop1 + 7, tDrop1 + 10, tDrop1 + 15], [0, 6, 0], CL);
    const bump2 = interpolate(f, [tDrop2 + 7, tDrop2 + 10, tDrop2 + 15], [0, 6, 0], CL);
    const lapBump = Math.max(bump1, bump2);

    // ---------- cloud, struck ----------
    const cloud = pop(f, tCloud, 11);
    const cloudR = interpolate(f, [tCloud, tCloud + 6, tCloud + 11], [8, -2, 1.5], CL);
    const strike = prog(f, tStrike, tStrike + 6);
    const cloudDim = interpolate(f, [tStrike + 3, tStrike + 9], [1, 0.4], CL);

    // ---------- tiles drop in ----------
    const drop = (t0) => {
      const y = interpolate(f, [t0, t0 + 7], [-96, 0], { ...CL, easing: EI });
      const sq = interpolate(f, [t0 + 7, t0 + 10, t0 + 15], [1, 0.86, 1], { ...CL, easing: EO });
      const wd = interpolate(f, [t0 + 7, t0 + 10, t0 + 15], [1, 1.12, 1], { ...CL, easing: EO });
      const o = interpolate(f, [t0, t0 + 2], [0, 1], CL);
      const rot = interpolate(f, [t0, t0 + 7], [-8, 0], CL);
      const grow = interpolate(f, [t0, t0 + 7], [0.72, 1], { ...CL, easing: EO });
      return { y: y, sq: sq * grow, wd: wd * grow, o: o, rot: rot };
    };
    const d1 = drop(tDrop1);
    const d2 = drop(tDrop2);

    // ---------- label, badge, underline ----------
    const lbl = pop(f, tLabel, 11);
    const lblTxt = prog(f, tLabel + 2, tLabel + 14, Easing.linear);
    const badge = pop(f, tBadge, 11);
    const badgeR = interpolate(f, [tBadge, tBadge + 6, tBadge + 11], [-24, 6, -6], CL);
    const line = prog(f, tLine, tLine + 10);

    // ---------- styles ----------
    const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
    const abs = { position: "absolute" };
    const svgFull = { position: "absolute", left: 0, top: 0, width: 980, height: 500, overflow: "visible" };

    const lapWrap = { ...abs, left: 0, top: 0, width: 980, height: 500, opacity: lap.o, transform: "rotate(" + lapR + "deg) scale(" + lap.s + ") translate(0, " + lapBump + "px)", transformOrigin: (LX + LW / 2) + "px " + (LY + LH / 2 + 20) + "px" };
    const screen = { ...abs, left: LX, top: LY, width: LW, height: LH, boxSizing: "border-box", backgroundColor: paper, border: "4px solid " + ink, borderRadius: 18, boxShadow: SHADOW };
    const screenIn = { ...abs, left: LX + 16, top: LY + 16, width: LW - 32, height: LH - 32, boxSizing: "border-box", borderRadius: 8, backgroundColor: "rgba(23,20,17,0.05)" };
    const screenMicro = { ...abs, left: LX + 30, top: LY + 24, fontFamily: sans, fontWeight: 800, fontSize: 18, lineHeight: "22px", letterSpacing: 3, color: ink, opacity: 0.35 };
    const slotStyle = (sx, sy) => ({ ...abs, left: sx, top: sy, width: 166, height: 172, boxSizing: "border-box", border: "3px dashed " + ink, borderRadius: 16, opacity: 0.28 * slots, transform: "scale(" + (0.8 + 0.2 * slots) + ")" });
    // faint serif numeral inside each empty slot; the tile covers it when it lands
    const slotNum = { ...abs, left: 0, top: 0, width: 160, height: 166, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontWeight: 900, fontSize: 78, lineHeight: 1, color: ink, opacity: 0.5 };

    const tileWrap = (sx, sy, d, rot) => ({ ...abs, left: sx, top: sy, width: 166, height: 172, opacity: d.o, transform: "translate(0, " + d.y + "px) rotate(" + (d.rot + rot) + "deg) scale(" + d.wd + ", " + d.sq + ")", transformOrigin: "50% 100%" });
    const tileFace = { ...abs, inset: 0, boxSizing: "border-box", backgroundColor: paper, border: "3.5px solid " + ink, borderRadius: 16, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center" };

    const lblWrap = { ...abs, left: 300, top: 390, filter: "drop-shadow(" + SHADOW + ")", opacity: lbl.o, transform: "rotate(-1.5deg) scale(" + lbl.s + ")", transformOrigin: "30% 50%" };
    const lblEdge = { backgroundColor: "rgba(23,20,17,0.2)", clipPath: TORN2, padding: 1.5 };
    const lblPaper = { backgroundColor: paper, clipPath: TORN2, padding: "8px 26px 8px 22px" };
    const lblText = { fontFamily: hand, fontWeight: 700, fontSize: 48, lineHeight: 1.2, color: ink, whiteSpace: "nowrap", clipPath: "inset(0 " + (100 - lblTxt * 100) + "% 0 0)" };

    const badgeWrap = { ...abs, left: LX + LW - 46, top: LY - 44, width: 92, height: 92, borderRadius: 46, backgroundColor: paper, border: "3.5px solid " + ink, boxSizing: "border-box", boxShadow: "3px 4px 0 rgba(23,20,17,0.22)", display: "flex", alignItems: "center", justifyContent: "center", opacity: badge.o, transform: "rotate(" + badgeR + "deg) scale(" + badge.s + ")" };

    const cloudWrap = { ...abs, left: 20, top: 40, width: 200, height: 128, opacity: cloud.o, transform: "rotate(" + cloudR + "deg) scale(" + cloud.s + ")", transformOrigin: "50% 60%" };

    // ---------- glyphs ----------
    const cloudSvg = <svg viewBox="0 0 220 140" style={{ width: 200, height: 127, overflow: "visible", opacity: cloudDim }}>
      <g stroke={ink} strokeWidth="9" fill={paper} strokeLinejoin="round">
        {CLOUD.map((c, i) => <circle key={"s" + i} cx={c[0]} cy={c[1]} r={c[2]} />)}
        <rect x="62" y="84" width="138" height="38" rx="16" />
      </g>
      <g fill={paper}>
        {CLOUD.map((c, i) => <circle key={"f" + i} cx={c[0]} cy={c[1]} r={c[2]} />)}
        <rect x="62" y="84" width="138" height="38" rx="16" />
      </g>
      <g fill={ink} opacity="0.35"><circle cx="92" cy="92" r="5" /><circle cx="114" cy="92" r="5" /><circle cx="136" cy="92" r="5" /></g>
    </svg>;
    // recorder tile: a screen with a record dot
    const recGlyph = <svg viewBox="0 0 100 100" style={{ width: 118, height: 118 }}>
      <rect x="10" y="18" width="80" height="54" rx="7" fill={paper} stroke={ink} strokeWidth="5" />
      <path d="M34 84 H66 M50 72 V84" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="45" r="13" fill={acc} stroke={ink} strokeWidth="4" />
      <circle cx="50" cy="45" r="5" fill={paper} />
    </svg>;
    // queue tile: a calendar with a clock
    const queueGlyph = <svg viewBox="0 0 100 100" style={{ width: 118, height: 118 }}>
      <rect x="12" y="20" width="66" height="60" rx="7" fill={paper} stroke={ink} strokeWidth="5" />
      <path d="M12 38 H78 M28 12 V26 M62 12 V26" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      <rect x="22" y="46" width="12" height="9" fill={acc} />
      <rect x="39" y="46" width="12" height="9" fill={ink} opacity="0.3" />
      <rect x="22" y="61" width="12" height="9" fill={ink} opacity="0.3" />
      <circle cx="72" cy="70" r="17" fill={gold} stroke={ink} strokeWidth="4.5" />
      <path d="M72 61 V70 L79 74" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
    // drive badge: a hard drive with an activity light
    const driveGlyph = <svg viewBox="0 0 48 48" style={{ width: 66, height: 66 }}>
      <rect x="6" y="10" width="36" height="28" rx="5" fill={paper} stroke={ink} strokeWidth="3.2" />
      <path d="M6 26 H42" stroke={ink} strokeWidth="3.2" />
      <circle cx="34" cy="32" r="3" fill={acc} />
      <path d="M12 32 H26" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <path d="M12 18 H22" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    </svg>;

    return <div style={rootStyle}>
      {/* laptop */}
      <div style={lapWrap}>
        <div style={screen} />
        <div style={screenIn} />
        <div style={screenMicro}>LOCAL</div>
        {/* base */}
        <svg viewBox="0 0 980 500" style={svgFull}>
          <path d={"M" + (LX - 40) + " " + (LY + LH + 2) + " H" + (LX + LW + 40) + " L" + (LX + LW + 28) + " " + (LY + LH + 26) + " Q" + (LX + LW + 24) + " " + (LY + LH + 34) + " " + (LX + LW + 12) + " " + (LY + LH + 34) + " H" + (LX - 12) + " Q" + (LX - 24) + " " + (LY + LH + 34) + " " + (LX - 28) + " " + (LY + LH + 26) + " Z"} fill={paper} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
          <path d={"M" + (LX + LW / 2 - 50) + " " + (LY + LH + 2) + " H" + (LX + LW / 2 + 50)} stroke={ink} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        </svg>
        <div style={slotStyle(SLOT[0][0], SLOT[0][1])}><div style={slotNum}>1</div></div>
        <div style={slotStyle(SLOT[1][0], SLOT[1][1])}><div style={slotNum}>2</div></div>
        {/* tiles */}
        <div style={tileWrap(SLOT[0][0], SLOT[0][1], d1, -2)}><div style={tileFace}>{recGlyph}</div></div>
        <div style={tileWrap(SLOT[1][0], SLOT[1][1], d2, 1.5)}><div style={tileFace}>{queueGlyph}</div></div>
        <div style={badgeWrap}>{driveGlyph}</div>
      </div>

      {/* small cloud, struck through */}
      <div style={cloudWrap}>{cloudSvg}</div>
      <svg viewBox="0 0 980 500" style={svgFull}>
        <path d="M26 150 L214 52" fill="none" stroke={acc} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - strike} opacity={strike > 0 ? 1 : 0} />
        {/* underline under the label on "itself" */}
        <path d="M312 476 Q440 460 560 472 T760 464" fill="none" stroke={acc} strokeWidth="11" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - line} opacity={line > 0 ? 1 : 0} />
      </svg>

      {/* hand label */}
      <div style={lblWrap}>
        <div style={lblEdge}><div style={lblPaper}><div style={lblText}>on your own disk</div></div></div>
      </div>
    </div>;
  };

  return __Inner({ item });
};
