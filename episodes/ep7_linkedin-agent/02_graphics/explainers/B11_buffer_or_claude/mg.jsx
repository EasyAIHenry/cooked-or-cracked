// B11 Buffer or Claude: a fork from YOU. Top path: just started -> "?" -> flips to Buffer. Bottom path (on "Only"): Claude,
// padlocked; on "if" a checklist arrives (experienced, comfortable); both tick, the lock opens, and the fork ends as a
// two-row summary. The Buffer row dims as one group (path + tag + card) while Claude is explained, then lights back up.
// Canvas 980x500, 193 frames. Props: serif, hand, sans, paper, ink, accent, gold.
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

// fork geometry: cubic from YOU, then a straight run to the card
const X0 = 138, Y0 = 244, XE = 524;
const pathD = (y) => "M" + X0 + " " + Y0 + " C 186 " + Y0 + ", 172 " + y + ", 222 " + y + " L " + XE + " " + y;
const sampler = (y) => {
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, u = 1 - t;
    pts.push([u * u * u * X0 + 3 * u * u * t * 186 + 3 * u * t * t * 172 + t * t * t * 222, u * u * u * Y0 + 3 * u * u * t * Y0 + 3 * u * t * t * y + t * t * t * y]);
  }
  pts.push([XE, y]);
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts: pts, acc: acc, len: acc[acc.length - 1] };
};
const pointAt = (S, p) => {
  const L = p * S.len;
  let i = 1;
  while (i < S.acc.length - 1 && S.acc[i] < L) i++;
  const seg = S.acc[i] - S.acc[i - 1] || 1;
  const k = Math.max(0, Math.min(1, (L - S.acc[i - 1]) / seg));
  return [S.pts[i - 1][0] + (S.pts[i][0] - S.pts[i - 1][0]) * k, S.pts[i - 1][1] + (S.pts[i][1] - S.pts[i - 1][1]) * k];
};
const YU = 130, YL = 356;
const UP = pathD(YU), LO = pathD(YL);
const SU = sampler(YU), SL = sampler(YL);
const TORN = "polygon(0% 6%,14% 0%,30% 5%,46% 1%,61% 6%,77% 0%,90% 4%,100% 1%,99% 95%,86% 100%,71% 95%,55% 100%,39% 96%,24% 100%,9% 95%,0% 99%)";
const SHADOW = "4px 6px 0 rgba(23,20,17,0.22)";
// shared 12-ray Claude mark (same RAYS as B06 Spark, 100-unit viewBox)
const RAYS = [[0, 45], [31, 37], [62, 46], [92, 38], [121, 45], [152, 36], [182, 46], [211, 37], [242, 45], [271, 37], [302, 46], [331, 38]];

const Component = ({ item }) => {
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

  // ---------- timings (frames, relative to MG start) ----------
  const tYou = 0;          // "If you"
  const tUpTag = 6;        // "just started" (8, 14)
  const tLplate = 11;
  const tQ = 26;           // "and don't really know" (26, 29)
  const tShake = 46;       // "what to do" (47)
  const tFlip = 64;        // "use Buffer" (69, 73): Buffer face from 70
  const tUpGo = 69;        // path turns solid, dot travels to Buffer
  const tLow = 89;         // "Only" (92): lower path starts drawing
  const tDim = 90;         // Buffer row steps back just before "Only"
  const tClaude = 101;     // "Claude" (105)
  const tLock = 108;
  const tNote = 117;       // "to do this" (117)
  const tCheck = 131;      // "if" (134): the conditions card arrives
  const tRow1 = 139;       // "experienced" (144)
  const tTick1 = 146;
  const tRow2 = 165;       // "comfortable" (171): handwriting, linear
  const tTick2 = 169;
  const tOpen = 171;       // lock opens, dot travels to Claude, top row lights back up

  // ---------- YOU ----------
  const you = pop(f, tYou, 12);
  // "?" thought bubble on YOU: "don't really know what to do"; it pops away when Buffer answers it
  const tThink = 36;
  const think = pop(f, tThink, 11);
  const thinkOut = interpolate(f, [tFlip + 2, tFlip + 8], [1, 0], { ...CL, easing: EI });
  const youLbl = prog(f, 3, 11);

  // ---------- upper path ----------
  const upDraw = prog(f, 5, 20);
  const upSolid = prog(f, tUpGo, tUpGo + 10, EIO);
  const upDot = pointAt(SU, upSolid);
  const upDotO = interpolate(upSolid, [0, 0.04, 0.88, 1], [0, 1, 1, 0], CL);
  const upArrow = pop(f, tUpGo + 7, 7);
  const dimU = interpolate(f, [tDim, tDim + 8, tOpen + 1, tOpen + 9], [1, 0.32, 0.32, 1], CL);

  // upper tag + L plate
  const upTag = pop(f, tUpTag, 12);
  const upTxt = prog(f, tUpTag + 2, tUpTag + 13);
  const lp = interpolate(f, [tLplate, tLplate + 6, tLplate + 10], [1.9, 0.92, 1], { ...CL, easing: EO });
  const lpR = interpolate(f, [tLplate, tLplate + 6, tLplate + 10], [-38, -4, -8], { ...CL, easing: EO });
  const lpO = interpolate(f, [tLplate, tLplate + 2], [0, 1], CL);

  // "?" card -> flip -> Buffer
  const q = pop(f, tQ, 12);
  const qGlyph = pop(f, tQ + 4, 12);
  const shake = interpolate(f, [tShake, tShake + 3, tShake + 6, tShake + 9, tShake + 12], [0, -6, 5, -2, 0], CL);
  const flipA = interpolate(f, [tFlip, tFlip + 6], [1, 0], { ...CL, easing: EI });
  const flipB = interpolate(f, [tFlip + 6, tFlip + 11, tFlip + 14], [0, 1.08, 1], { ...CL, easing: EO });
  const showBuffer = f >= tFlip + 6;
  const layer = (k) => {
    const t0 = tFlip + 6 + k * 2;
    return { o: interpolate(f, [t0, t0 + 3], [0, 1], CL), y: interpolate(f, [t0, t0 + 6], [-9, 0], { ...CL, easing: EO }) };
  };
  const L0 = layer(0), L1 = layer(1), L2 = layer(2);
  const flipX = showBuffer ? flipB : flipA;

  // ---------- lower path ----------
  const loDraw = prog(f, tLow, tLow + 14);
  const loSolid = prog(f, tOpen, tOpen + 10, EIO);
  const loDot = pointAt(SL, loSolid);
  const loDotO = interpolate(loSolid, [0, 0.04, 0.88, 1], [0, 1, 1, 0], CL);
  const loArrow = pop(f, tOpen + 5, 7);
  const check = pop(f, tCheck, 12);
  const claude = pop(f, tClaude, 12);
  const sparkR = interpolate(f, [tClaude + 1, tClaude + 13], [-150, 0], { ...CL, easing: EO });
  const sparkS = interpolate(f, [tClaude + 1, tClaude + 9, tClaude + 13], [0.3, 1.15, 1], { ...CL, easing: EO });
  const lock = pop(f, tLock, 10);
  const note = prog(f, tNote, tNote + 12);
  const row1 = prog(f, tRow1, tRow1 + 10);
  const row2 = prog(f, tRow2, tRow2 + 8, Easing.linear);
  const tick1 = prog(f, tTick1, tTick1 + 6);
  const tick2 = prog(f, tTick2, tTick2 + 6);
  const box1 = interpolate(f, [tTick1, tTick1 + 3, tTick1 + 7], [1, 1.22, 1], CL);
  const box2 = interpolate(f, [tTick2, tTick2 + 3, tTick2 + 7], [1, 1.22, 1], CL);
  const shackle = interpolate(f, [tOpen, tOpen + 5, tOpen + 8], [0, 1.1, 1], { ...CL, easing: EO });
  const lockBump = interpolate(f, [tOpen, tOpen + 4, tOpen + 8], [1, 1.16, 1], CL);
  const ping = prog(f, tOpen + 2, tOpen + 9);

  // ---------- styles ----------
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const abs = { position: "absolute" };
  const svgFull = { position: "absolute", left: 0, top: 0, width: 980, height: 500, overflow: "visible" };

  const youBadge = { ...abs, left: 26, top: 188, width: 112, height: 112, borderRadius: 56, backgroundColor: paper, border: "3.5px solid " + ink, boxSizing: "border-box", boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", opacity: you.o, transform: "rotate(-3deg) scale(" + you.s + ")" };
  const youText = { ...abs, left: 22, top: 304, width: 120, textAlign: "center", fontFamily: hand, fontWeight: 700, fontSize: 42, lineHeight: 1.2, color: ink, clipPath: "inset(0 " + (100 - youLbl * 100) + "% 0 0)" };

  const tagWrap = (p, rot, left, top) => ({ ...abs, left: left, top: top, filter: "drop-shadow(" + SHADOW + ")", opacity: p.o, transform: "rotate(" + rot + "deg) scale(" + p.s + ")" });
  const edge = { backgroundColor: "rgba(23,20,17,0.2)", clipPath: TORN, padding: 1.5 };
  const tagPaper = { backgroundColor: paper, clipPath: TORN, padding: "10px 20px 10px 14px", display: "flex", alignItems: "center", gap: 12 };
  const handTxt = { fontFamily: hand, fontWeight: 700, fontSize: 37, lineHeight: 1.25, color: ink, whiteSpace: "nowrap" };

  const lplate = { width: 44, height: 44, flex: "0 0 44px", borderRadius: 5, border: "3px solid " + ink, boxSizing: "border-box", backgroundColor: paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontWeight: 800, fontSize: 30, lineHeight: 1, color: acc, opacity: lpO, transform: "rotate(" + lpR + "deg) scale(" + lp + ")" };

  const cardBox = { ...abs, left: 0, top: 0, width: 394, height: 124, borderRadius: 12, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 12, padding: "0 20px 0 22px" };
  const bigName = { fontFamily: serif, fontWeight: 900, fontSize: 80, lineHeight: 1, color: ink, letterSpacing: -1, whiteSpace: "nowrap" };

  const upCardWrap = { ...abs, left: 546, top: YU - 62, width: 394, height: 124, opacity: q.o, transform: "rotate(" + (-1.5 + (showBuffer ? 0 : shake)) + "deg) scale(" + q.s + ") scaleX(" + flipX + ")" };
  const qFace = { ...cardBox, justifyContent: "center", backgroundColor: paper, border: "3.5px dashed " + ink };
  const bFace = { ...cardBox, backgroundColor: paper, border: "3.5px solid " + ink, boxShadow: SHADOW };

  const loCardWrap = { ...abs, left: 546, top: YL - 62, width: 394, height: 124, opacity: claude.o, transform: "rotate(1deg) scale(" + claude.s + ")" };
  const cFace = { ...cardBox, backgroundColor: paper, border: "3.5px solid " + ink, boxShadow: SHADOW };

  const lockWrap = { ...abs, left: 878, top: YL - 94, width: 64, height: 64, borderRadius: 32, backgroundColor: paper, border: "3px solid " + ink, boxSizing: "border-box", boxShadow: "3px 4px 0 rgba(23,20,17,0.22)", display: "flex", alignItems: "center", justifyContent: "center", opacity: lock.o, transform: "rotate(8deg) scale(" + (lock.s * lockBump) + ")" };

  const checkWrap = { ...abs, left: 206, top: YL - 62, filter: "drop-shadow(" + SHADOW + ")", opacity: check.o, transform: "rotate(1.5deg) scale(" + check.s + ")" };
  const checkPaper = { backgroundColor: paper, clipPath: TORN, padding: "12px 20px 12px 16px", display: "flex", flexDirection: "column", gap: 4, width: 271, boxSizing: "border-box" };
  const rowStyle = { display: "flex", alignItems: "center", gap: 12, height: 48 };
  const boxStyle = (sc) => ({ width: 32, height: 32, flex: "0 0 32px", borderRadius: 5, border: "3px solid " + ink, boxSizing: "border-box", backgroundColor: paper, position: "relative", transform: "scale(" + sc + ")" });
  const blank = { ...abs, left: 0, right: 0, bottom: 5, height: 0, borderBottom: "2.5px dashed " + ink, opacity: 0.18 };

  const thinkStyle = { ...abs, left: 100, top: 126, width: 58, height: 58, borderRadius: 29, backgroundColor: paper, border: "3px solid " + ink, boxSizing: "border-box", boxShadow: "3px 4px 0 rgba(23,20,17,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontWeight: 900, fontSize: 40, lineHeight: 1, color: acc, opacity: think.o * (thinkOut > 0 ? 1 : 0), transform: "rotate(10deg) scale(" + (think.s * thinkOut) + ")" };
  const thinkDot = { ...abs, left: 107, top: 184, width: 14, height: 14, borderRadius: 7, backgroundColor: paper, border: "2.5px solid " + ink, boxSizing: "border-box", opacity: think.o * (thinkOut > 0 ? 1 : 0), transform: "scale(" + (think.s * thinkOut) + ")" };
  const noteStyle = { ...abs, right: 40, top: YL + 76, whiteSpace: "nowrap", fontFamily: hand, fontWeight: 700, fontSize: 32, lineHeight: 1.2, color: ink, clipPath: "inset(0 " + (100 - note * 100) + "% 0 0)" };

  const tickPath = (p) => <svg viewBox="0 0 32 32" style={{ position: "absolute", left: -4, top: -8, width: 40, height: 40, overflow: "visible" }}><path d="M5 17 L13 25 L29 4" fill="none" stroke={acc} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - p} /></svg>;

  // Buffer mark: a stack of three layers, ink
  const bufferMark = <svg viewBox="0 0 24 24" style={{ width: 56, height: 56, flex: "0 0 56px" }}>
    <path d="M3.2 16 L12 20.3 L20.8 16" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity={L0.o} transform={"translate(0 " + L0.y + ")"} />
    <path d="M3.2 11.6 L12 15.9 L20.8 11.6" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity={L1.o} transform={"translate(0 " + L1.y + ")"} />
    <path d="M12 2.6 L21.2 7.1 L12 11.6 L2.8 7.1 Z" fill={ink} stroke={ink} strokeWidth="1.2" strokeLinejoin="round" opacity={L2.o} transform={"translate(0 " + L2.y + ")"} />
  </svg>;
  // Claude mark: an orange spark
  const claudeMark = <svg viewBox="0 0 100 100" style={{ width: 56, height: 56, flex: "0 0 56px", overflow: "visible", transform: "rotate(" + sparkR + "deg) scale(" + sparkS + ")" }}>
    {RAYS.map((r, i) => {
      const a = (r[0] * Math.PI) / 180;
      return <line key={i} x1={50 + Math.cos(a) * 7} y1={50 + Math.sin(a) * 7} x2={50 + Math.cos(a) * r[1]} y2={50 + Math.sin(a) * r[1]} stroke={acc} strokeWidth="11" strokeLinecap="round" />;
    })}
  </svg>;
  // person glyph for YOU
  const person = <svg viewBox="0 0 24 24" style={{ width: 70, height: 70 }}>
    <path d="M4.6 21.2 C 5.2 15.4, 18.8 15.4, 19.4 21.2 Z" fill={paper} stroke={ink} strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="12" cy="9.2" r="4.4" fill={acc} stroke={ink} strokeWidth="1.7" />
  </svg>;
  // padlock: shackle lifts and swings open on "comfortable"
  const padlock = <svg viewBox="0 0 24 24" style={{ width: 44, height: 44, overflow: "visible" }}>
    <g transform={"translate(0 " + (-4 * shackle) + ") rotate(" + (-28 * shackle) + " 16 11)"}>
      <path d="M8 11.5 V8 a4 4 0 0 1 8 0 V11.5" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
    </g>
    <rect x="4.8" y="11" width="14.4" height="10.4" rx="2" fill={acc} stroke={ink} strokeWidth="2" />
    <circle cx="12" cy="15.6" r="1.4" fill={ink} />
  </svg>;
  const arrowHead = <path d="M-15 -13 L0 0 L-15 13" fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />;
  const LX = 910, LY = YL - 62;

  return <div style={rootStyle}>
    {/* lower path (drawn first so the checklist and Claude card sit on top of it) */}
    <svg viewBox="0 0 980 500" style={svgFull}>
      <defs>
        <mask id="b11ml" maskUnits="userSpaceOnUse" x="0" y="0" width="980" height="500">
          <path d={LO} fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - loDraw} />
        </mask>
      </defs>
      <path d={LO} fill="none" stroke={ink} strokeWidth="5.5" strokeLinecap="round" strokeDasharray="0.1 14" mask="url(#b11ml)" opacity={0.55} />
      <path d={LO} fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - loSolid} />
      <g transform={"translate(" + (XE + 6) + " " + YL + ") scale(" + loArrow.s + ")"} opacity={loArrow.o}>{arrowHead}</g>
      {/* unlock ping lines */}
      <g opacity={ping} stroke={gold} strokeWidth="5" strokeLinecap="round">
        <line x1={LX} y1={LY - 42 + 4 * (1 - ping)} x2={LX} y2={LY - 54} />
        <line x1={LX + 30} y1={LY - 30} x2={LX + 39} y2={LY - 40} />
        <line x1={LX - 30} y1={LY - 30} x2={LX - 39} y2={LY - 40} />
      </g>
    </svg>

    {/* YOU */}
    <div style={youBadge}>{person}</div>
    <div style={youText}>you</div>
    <div style={thinkDot} />
    <div style={thinkStyle}>?</div>

    {/* upper row: path, tag, card and dot share ONE opacity, so the tag hides the line before the group dims */}
    <div style={{ ...abs, left: 0, top: 0, width: 980, height: 500, opacity: dimU }}>
      <svg viewBox="0 0 980 500" style={svgFull}>
        <defs>
          <mask id="b11mu" maskUnits="userSpaceOnUse" x="0" y="0" width="980" height="500">
            <path d={UP} fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - upDraw} />
          </mask>
        </defs>
        <path d={UP} fill="none" stroke={ink} strokeWidth="5.5" strokeLinecap="round" strokeDasharray="0.1 14" mask="url(#b11mu)" opacity={0.55} />
        <path d={UP} fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - upSolid} />
        <g transform={"translate(" + (XE + 6) + " " + YU + ") scale(" + upArrow.s + ")"} opacity={upArrow.o}>{arrowHead}</g>
      </svg>
      <div style={tagWrap(upTag, -2, 206, YU - 34)}>
        <div style={edge}>
          <div style={tagPaper}>
            <div style={lplate}>L</div>
            <div style={{ ...handTxt, clipPath: "inset(0 " + (100 - upTxt * 100) + "% 0 0)" }}>just started</div>
          </div>
        </div>
      </div>
      <div style={upCardWrap}>
        {showBuffer
          ? <div style={bFace}>{bufferMark}<div style={bigName}>Buffer</div></div>
          : <div style={qFace}><div style={{ fontFamily: serif, fontWeight: 900, fontSize: 92, lineHeight: 1, color: acc, opacity: qGlyph.o, transform: "scale(" + qGlyph.s + ")" }}>?</div></div>}
      </div>
      {/* travelling dot you -> Buffer, above the tag so the whole journey reads */}
      <svg viewBox="0 0 980 500" style={svgFull}>
        <circle cx={upDot[0]} cy={upDot[1]} r="10" fill={acc} stroke={ink} strokeWidth="3.5" opacity={upDotO} />
      </svg>
    </div>

    {/* lower row */}
    <div style={checkWrap}>
      <div style={edge}>
        <div style={checkPaper}>
          <div style={rowStyle}>
            <div style={boxStyle(box1)}>{tickPath(tick1)}</div>
            <div style={{ position: "relative", flex: 1, height: 48 }}>
              <div style={blank} />
              <div style={{ ...handTxt, position: "absolute", left: 0, top: 0, clipPath: "inset(0 " + (100 - row1 * 100) + "% 0 0)" }}>experienced</div>
            </div>
          </div>
          <div style={rowStyle}>
            <div style={boxStyle(box2)}>{tickPath(tick2)}</div>
            <div style={{ position: "relative", flex: 1, height: 48 }}>
              <div style={blank} />
              <div style={{ ...handTxt, position: "absolute", left: 0, top: 0, clipPath: "inset(0 " + (100 - row2 * 100) + "% 0 0)" }}>comfortable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style={loCardWrap}>
      <div style={cFace}>{claudeMark}<div style={bigName}>Claude</div></div>
    </div>
    <div style={lockWrap}>{padlock}</div>
    <div style={noteStyle}>via Buffer API</div>
    {/* travelling dot you -> Claude, above the checklist */}
    <svg viewBox="0 0 980 500" style={svgFull}>
      <circle cx={loDot[0]} cy={loDot[1]} r="10" fill={acc} stroke={ink} strokeWidth="3.5" opacity={loDotO} />
    </svg>

  </div>;
};
