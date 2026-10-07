const Component = ({ item }) => {
  // B11 CLONE CTA (Ep8, 7 Oct 2026). Canvas 820x420, 299 frames. ChatCut motion graphic (Remotion runtime).
  // "...I've actually created 10 more apps that you can use without the internet and without cloud storage.
  //  Comment down below Clone and I'll send you my workflow."
  // 1 (f52-196): on "created" ten small app cards fan out from a pile while the big counter rolls 1 to 10 (lands f70,
  //   "10" at 72); "more apps" hand label on "apps". On "without" a wifi badge pops and is struck on "internet"; on
  //   "cloud" a cloud badge pops and is struck on "storage".
  // 2 (f196-250): the whole fan shrinks away; on "Comment" a comment pill pops with a "comment" sticker; on "Clone"
  //   the letters C L O N E pop in one by one.
  // 3 (f250-): on "send" the pill lifts and a guide cover card slides in under it ("Ten apps / worth cloning in an
  //   hour"); on "workflow" the orange underline draws. Still from f280.
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
  // fan geometry: pivot below the canvas, cards spread by angle
  const PX = 556, PY = 610, RAD = 370, CW = 106, CH = 136;
  const ANG = [-33, -25.7, -18.3, -11, -3.7, 3.7, 11, 18.3, 25.7, 33];
  // tiny generic app glyphs (24-unit viewBox), ink lines only
  const GLYPH = [
    "M12 4 L20 19 H4 Z", "M5 5 H19 V19 H5 Z", "M12 4 A8 8 0 1 0 12 20 A8 8 0 1 0 12 4", "M5 18 V11 M12 18 V6 M19 18 V14",
    "M7 5 L19 12 L7 19 Z", "M5 8 H19 M5 12 H19 M5 16 H15", "M12 5 V19 M5 12 H19", "M6 15 Q12 4 18 15 M6 15 H18",
    "M5 12 L10 17 L19 7", "M4 7 H20 V17 H10 L6 20 V17 H4 Z",
  ];
  const LETTERS = ["C", "L", "O", "N", "E"];

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
    const tFan = 52;      // "created" (56) .. counter lands 10 at f70, "10" (72)
    const tMore = 81;     // "apps" (84)
    const tWifi = 114;    // "without" (117)
    const tXw = 127;      // "internet" (130)
    const tCloud = 165;   // "cloud" (168)
    const tXc = 173;      // "storage" (176)
    const tOut = 196;     // fan shrinks away
    const tPill = 199;    // "Comment" (202)
    const tClone = 222;   // "Clone" (226): letters f222..226
    const tCover = 250;   // "send" (254)
    const tUl = 268;      // "workflow" (271)

    // ---------- 1: fan + counter ----------
    const count = f < tFan ? 0 : Math.min(10, Math.floor((f - tFan) / 2) + 1);
    const lastT = tFan + (count - 1) * 2;
    const digitBump = count > 0 ? interpolate(f, [lastT, lastT + 2, lastT + 6], [1.18, 0.96, 1], CL) : 0;
    const cntO = interpolate(f, [tFan, tFan + 2], [0, 1], CL);
    const more = pop(f, tMore, 11);
    const moreR = interpolate(f, [tMore, tMore + 6, tMore + 11], [-10, 1, -2], CL);
    const wifi = pop(f, tWifi, 11);
    const wifiR = interpolate(f, [tWifi, tWifi + 6, tWifi + 11], [14, -3, 2], CL);
    const xw = prog(f, tXw, tXw + 5);
    const cloud = pop(f, tCloud, 11);
    const cloudR = interpolate(f, [tCloud, tCloud + 6, tCloud + 11], [-14, 3, -2], CL);
    const xc = prog(f, tXc, tXc + 5);
    const dimW = interpolate(f, [tXw + 2, tXw + 8], [1, 0.45], CL);
    const dimC = interpolate(f, [tXc + 2, tXc + 8], [1, 0.45], CL);
    const outS = interpolate(f, [tOut, tOut + 7], [1, 0], { ...CL, easing: EI });
    const outO = interpolate(f, [tOut + 4, tOut + 7], [1, 0], CL);

    // ---------- 2: pill + CLONE ----------
    const pill = pop(f, tPill, 12);
    const pillR = interpolate(f, [tPill, tPill + 7, tPill + 12], [-4, 0.6, -1], CL);
    const caretOn = f >= tPill + 6 && f < tClone && Math.floor(f / 8) % 2 === 0;
    const stick = pop(f, tPill + 3, 11);
    const stickR = interpolate(f, [tPill + 3, tPill + 9, tPill + 14], [-14, 0, -3], CL);
    // ---------- 3: lift + cover ----------
    const lift = prog(f, tCover, tCover + 9, EIO);
    const pillY = -62 * lift;
    const pillS = 1 - 0.24 * lift;
    const cov = prog(f, tCover + 1, tCover + 10);
    const covX = 160 + 150 * (1 - cov);
    const covS = 0.7 + 0.3 * cov;
    const covR = interpolate(f, [tCover + 1, tCover + 7, tCover + 11], [6, 0.4, 1.2], CL);
    const covO = interpolate(f, [tCover + 1, tCover + 3], [0, 1], CL);
    const ul = prog(f, tUl, tUl + 9);

    // ---------- styles ----------
    const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
    const abs = { position: "absolute" };
    const svgFull = { position: "absolute", left: 0, top: 0, width: 820, height: 420, overflow: "visible" };

    const phase1 = { ...abs, left: 0, top: 0, width: 820, height: 420, opacity: outO, transform: "scale(" + outS + ")", transformOrigin: "440px 220px" };
    const cntBox = { ...abs, left: 30, top: 68, width: 250, height: 180, display: "flex", alignItems: "center", justifyContent: "center", opacity: cntO };
    const cntText = { fontFamily: serif, fontWeight: 900, fontSize: 176, lineHeight: 1, color: ink, letterSpacing: -4, transform: "scale(" + digitBump + ")", transformOrigin: "50% 70%" };
    const moreWrap = { ...abs, left: 46, top: 254, filter: "drop-shadow(" + SHADOW + ")", opacity: more.o, transform: "rotate(" + moreR + "deg) scale(" + more.s + ")", transformOrigin: "30% 50%" };
    const edge = { backgroundColor: "rgba(23,20,17,0.2)", clipPath: TORN2, padding: 1.5 };
    const tagPaper = { backgroundColor: paper, clipPath: TORN2, padding: "6px 22px 6px 18px" };
    const handTxt = { fontFamily: hand, fontWeight: 700, fontSize: 42, lineHeight: 1.2, color: ink, whiteSpace: "nowrap" };

    const cardStyle = (i) => {
      const t0 = tFan + i * 2;
      const p = prog(f, t0, t0 + 10);
      const o = interpolate(f, [t0, t0 + 2], [0, 1], CL);
      const a = (ANG[i] * p * Math.PI) / 180;
      const cx = PX + RAD * Math.sin(a);
      const cy = PY - RAD * Math.cos(a);
      const sc = 0.3 + 0.7 * p;
      return { ...abs, left: cx - CW / 2, top: cy - CH / 2, width: CW, height: CH, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 12, boxShadow: "3px 4px 0 rgba(23,20,17,0.2)", opacity: o, transform: "rotate(" + (ANG[i] * p) + "deg) scale(" + sc + ")", transformOrigin: "50% 50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 };
    };

    const badge = (p, rot, left, top) => ({ ...abs, left: left, top: top, width: 92, height: 92, borderRadius: 46, backgroundColor: paper, border: "3.5px solid " + ink, boxSizing: "border-box", boxShadow: "3px 4px 0 rgba(23,20,17,0.22)", display: "flex", alignItems: "center", justifyContent: "center", opacity: p.o, transform: "rotate(" + rot + "deg) scale(" + p.s + ")" });

    const PW = 660, PH = 140;
    const pillWrap = { ...abs, left: 410 - PW / 2, top: 150 - PH / 2, width: PW, height: PH, opacity: pill.o, transform: "translate(0, " + pillY + "px) rotate(" + pillR + "deg) scale(" + (pill.s * pillS) + ")", transformOrigin: "50% 50%" };
    const pillFace = { ...abs, inset: 0, boxSizing: "border-box", backgroundColor: paper, border: "3.5px solid " + ink, borderRadius: PH / 2, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center" };
    const cloneTxt = { fontFamily: serif, fontWeight: 900, fontSize: 104, lineHeight: 1, color: ink, letterSpacing: 2, whiteSpace: "nowrap", display: "flex", alignItems: "center", marginTop: 4 };
    const caret = { display: caretOn ? "inline-block" : "none", width: 7, height: 86, backgroundColor: acc, borderRadius: 3 };
    const stickStyle = { ...abs, left: 54, top: -34, display: "flex", alignItems: "center", gap: 10, backgroundColor: ink, color: paper, fontFamily: hand, fontWeight: 700, fontSize: 42, lineHeight: 1, padding: "9px 20px 7px 16px", borderRadius: 10, opacity: stick.o, transform: "rotate(" + stickR + "deg) scale(" + stick.s + ")", transformOrigin: "30% 80%", boxShadow: SHADOW };
    const letters = LETTERS.map((ch, i) => {
      const t0 = tClone + i;
      if (f < t0) return null;
      const s = interpolate(f, [t0, t0 + 2, t0 + 6], [0.6, 1.14, 1], CL);
      return <span key={i} style={{ display: "inline-block", transform: "scale(" + s + ")", transformOrigin: "50% 85%" }}>{ch}</span>;
    });

    const COVW = 600, COVH = 222;
    const covWrap = { ...abs, left: covX, top: 178, width: COVW, height: COVH, opacity: covO, transform: "rotate(" + covR + "deg) scale(" + covS + ")", transformOrigin: "50% 50%" };
    const covFace = { ...abs, inset: 0, boxSizing: "border-box", backgroundColor: paper, border: "3.5px solid " + ink, borderRadius: 16, boxShadow: SHADOW, overflow: "hidden" };
    const spine = { ...abs, left: 0, top: 0, bottom: 0, width: 30, backgroundColor: acc, borderRight: "3.5px solid " + ink };
    const spineMicro = { ...abs, left: 4, top: 96, width: 22, textAlign: "center", fontFamily: sans, fontWeight: 800, fontSize: 11, lineHeight: "12px", letterSpacing: 1, color: paper, opacity: 0.85, transform: "rotate(-90deg)", transformOrigin: "50% 50%", whiteSpace: "nowrap" };
    const covTitle = { ...abs, left: 62, top: 34, fontFamily: serif, fontWeight: 900, fontSize: 74, lineHeight: 1, color: ink, letterSpacing: -1, whiteSpace: "nowrap" };
    const covSub = { ...abs, left: 64, top: 128, fontFamily: hand, fontWeight: 700, fontSize: 38, lineHeight: 1.2, color: ink, whiteSpace: "nowrap" };
    const dog = { ...abs, right: -2, top: -2, width: 54, height: 54 };

    // ---------- glyphs ----------
    const wifiSvg = <svg viewBox="0 0 48 48" style={{ width: 60, height: 60, opacity: dimW }}>
      <path d="M6 19 C16 9 32 9 42 19" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M13 26 C19 20 29 20 35 26" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M19 33 C22 30 26 30 29 33" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="39" r="3" fill={acc} />
    </svg>;
    const cloudSvg = <svg viewBox="0 0 220 140" style={{ width: 66, height: 42, overflow: "visible", opacity: dimC }}>
      <g stroke={ink} strokeWidth="13" fill={paper} strokeLinejoin="round">
        {CLOUD.map((c, i) => <circle key={"s" + i} cx={c[0]} cy={c[1]} r={c[2]} />)}
        <rect x="62" y="84" width="138" height="38" rx="16" />
      </g>
      <g fill={paper}>
        {CLOUD.map((c, i) => <circle key={"f" + i} cx={c[0]} cy={c[1]} r={c[2]} />)}
        <rect x="62" y="84" width="138" height="38" rx="16" />
      </g>
    </svg>;
    const strikeSvg = (p) => <svg viewBox="0 0 92 92" style={{ ...abs, left: -4, top: -4, width: 92, height: 92, overflow: "visible" }}>
      <path d="M14 78 L78 14" fill="none" stroke={acc} strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />
    </svg>;

    return <div style={rootStyle}>
      {/* 1: counter, fan, badges */}
      <div style={phase1}>
        <div style={cntBox}><div style={cntText}>{count > 0 ? count : ""}</div></div>
        <div style={moreWrap}><div style={edge}><div style={tagPaper}><div style={handTxt}>more apps</div></div></div></div>
        {ANG.map((a, i) => <div key={i} style={cardStyle(i)}>
          <svg viewBox="0 0 24 24" style={{ width: 50, height: 50 }}><path d={GLYPH[i]} fill={i % 3 === 0 ? acc : "none"} stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{ width: 52, height: 7, borderRadius: 4, backgroundColor: "rgba(23,20,17,0.25)" }} />
          <div style={{ width: 34, height: 7, borderRadius: 4, backgroundColor: "rgba(23,20,17,0.15)" }} />
        </div>)}
        <div style={badge(wifi, wifiR, 548, 26)}>{wifiSvg}{strikeSvg(xw)}</div>
        <div style={badge(cloud, cloudR, 666, 30)}>{cloudSvg}{strikeSvg(xc)}</div>
      </div>

      {/* 3: guide cover (behind the pill) */}
      <div style={covWrap}>
        <div style={covFace}>
          <div style={spine} />
          <div style={spineMicro}>GUIDE</div>
          <div style={covTitle}>Ten apps</div>
          <div style={covSub}>worth cloning in an hour</div>
          <svg viewBox="0 0 54 54" style={dog}><path d="M0 0 H54 V54 Z" fill={gold} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" /></svg>
          <svg viewBox="0 0 300 20" preserveAspectRatio="none" style={{ ...abs, left: 236, top: 170, width: 300, height: 20, overflow: "visible" }}>
            <path d="M4 12 Q80 4 150 10 T296 8" fill="none" stroke={acc} strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - ul} opacity={ul > 0 ? 1 : 0} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* 2: comment pill */}
      <div style={pillWrap}>
        <div style={pillFace}><div style={cloneTxt}>{letters}<span style={caret} /></div></div>
        <div style={stickStyle}>
          <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
            <path d="M4 5 H20 V16 H11 L7 20 V16 H4 Z" fill="none" stroke={paper} strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="8.5" cy="10.5" r="1.3" fill={acc} /><circle cx="12" cy="10.5" r="1.3" fill={acc} /><circle cx="15.5" cy="10.5" r="1.3" fill={acc} />
          </svg>
          <span>comment</span>
        </div>
      </div>
    </div>;
  };

  return __Inner({ item });
};
