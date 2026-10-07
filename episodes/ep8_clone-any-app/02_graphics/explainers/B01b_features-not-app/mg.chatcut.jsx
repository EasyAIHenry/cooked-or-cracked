const Component = ({ item }) => {
  // B01b features, not the app (Ep8 v3, 7 Oct 2026). Canvas 980x500, 330 frames. ChatCut motion graphic (Remotion runtime).
  // "I am guessing that if you're gonna clone an app, you're just gonna clone the features and not the entire app itself."
  // Word frames from the line start (in = 127.34 s), timed from the energy bursts (both Whisper passes drift here): guessing 12,
  // clone 94, features 206, not 236, entire 246, itself 282; speech ends at f299.
  // f4: the app card pops at the left: title "the app", four feature chips, a grey strip under them (users, servers, storage).
  // f94 "clone": a dashed "your clone" card slides in at the right with four empty chip slots.
  // f206 "features": the chips copy across one by one (7 frames apart) and land in the slots; "features only" writes on in the clone.
  // f236 "not": the grey strip glows gold; f246 "entire": a cross draws over it; f282 "itself": hand label "the rest stays theirs". Still after.
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
  // card geometry (canvas units)
  const AX = 40, AY = 56, AW = 400, AH = 388;          // the app
  const CX = 560, CW = 380;                            // the clone (same top and height)
  const CHIP = [[24, 92], [212, 92], [24, 168], [212, 168]];   // chip top-left inside a card, 164x60 each
  const CHIPS = ["record", "share link", "queue", "calendar"];
  const STRIP = [24, 252, 352, 92];                    // the grey strip inside the app card
  const STRIP_ITEMS = ["USERS", "SERVERS", "STORAGE"];

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
    const tApp = 4;        // "I am guessing": the app card
    const tClone = 94;     // "clone": the clone card slides in
    const tFeat = 206;     // "features": chips copy across
    const tOnly = 226;     // "features only" writes on
    const tNot = 236;      // "not": strip glows
    const tX = 246;        // "entire": cross
    const tLabel = 282;    // "itself": label

    // ---------- app card ----------
    const app = pop(f, tApp, 13);
    const appR = interpolate(f, [tApp, tApp + 8, tApp + 13], [-5, 0.8, -1], CL);
    const chipIn = (i) => pop(f, tApp + 10 + i * 3, 10);
    const stripIn = prog(f, tApp + 22, tApp + 30);
    // ---------- clone card ----------
    const cl = prog(f, tClone, tClone + 12);
    const clX = CX + (1000 - CX) * (1 - cl);
    const clR = interpolate(f, [tClone, tClone + 8, tClone + 14], [4, -0.6, 1], CL);
    const clO = interpolate(f, [tClone, tClone + 3], [0, 1], CL);
    // ---------- chips fly ----------
    const fly = (i) => {
      const t0 = tFeat + i * 7;
      const p = prog(f, t0, t0 + 10, EIO);
      const x0 = AX + CHIP[i][0], x1 = CX + CHIP[i][0] + 8;
      const y0 = AY + CHIP[i][1], y1 = AY + CHIP[i][1];
      const lift = Math.sin(p * Math.PI) * -34;
      const land = interpolate(f, [t0 + 10, t0 + 13, t0 + 17], [1, 1.08, 1], CL);
      return { x: x0 + (x1 - x0) * p, y: y0 + (y1 - y0) * p + lift, s: land, o: f >= t0 ? 1 : 0, rot: interpolate(f, [t0, t0 + 10], [0, (i % 2 ? 2 : -2)], CL) };
    };
    const only = prog(f, tOnly, tOnly + 12);
    // ---------- strip: glow, cross ----------
    const glow = interpolate(f, [tNot, tNot + 6, tX + 10, tX + 18], [0, 1, 1, 0.55], CL);
    const x1 = prog(f, tX, tX + 5);
    const x2 = prog(f, tX + 3, tX + 8);
    const xO = f >= tX ? 1 : 0;
    const shake = f >= tX + 4 && f <= tX + 12 ? Math.sin((f - tX - 4) * 2.2) * 5 * (1 - (f - tX - 4) / 8) : 0;
    const stripDim = interpolate(f, [tX + 6, tX + 14], [1, 0.55], CL);
    // ---------- label ----------
    const lbl = pop(f, tLabel, 11);
    const lblTxt = prog(f, tLabel + 2, tLabel + 12, Easing.linear);

    // ---------- styles ----------
    const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
    const abs = { position: "absolute" };
    const card = (left, top, w, h, dashed) => ({ ...abs, left, top, width: w, height: h, boxSizing: "border-box", backgroundColor: paper, border: (dashed ? "3.5px dashed " : "3.5px solid ") + ink, borderRadius: 22, boxShadow: dashed ? "none" : SHADOW });
    const title = { ...abs, left: 24, top: 14, fontFamily: hand, fontWeight: 700, fontSize: 40, lineHeight: "48px", color: ink, whiteSpace: "nowrap" };
    const micro = { ...abs, right: 22, top: 22, fontFamily: sans, fontWeight: 800, fontSize: 18, lineHeight: "22px", letterSpacing: 3, color: ink, opacity: 0.4 };
    const chipBox = { width: 164, height: 60, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 14, boxShadow: "3px 4px 0 rgba(23,20,17,0.2)", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" };
    const chipTxt = { fontFamily: hand, fontWeight: 700, fontSize: 28, lineHeight: "32px", color: ink, whiteSpace: "nowrap" };
    const slot = (i) => ({ ...abs, left: CHIP[i][0] + 8, top: CHIP[i][1], width: 164, height: 60, boxSizing: "border-box", border: "3px dashed " + ink, borderRadius: 14, opacity: 0.3 });
    const stripBox = { ...abs, left: STRIP[0], top: STRIP[1], width: STRIP[2], height: STRIP[3], boxSizing: "border-box", border: "3px dashed " + ink, borderRadius: 16, opacity: stripIn, transform: "translate(" + shake + "px, 0)" };
    const stripGlow = { ...abs, inset: -4, borderRadius: 18, backgroundColor: gold, opacity: 0.55 * glow };
    const stripItem = (i) => ({ ...abs, left: 18 + i * 112, top: 10, width: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: stripDim });
    const stripMicro = { fontFamily: sans, fontWeight: 800, fontSize: 15, lineHeight: "18px", letterSpacing: 2, color: ink, opacity: 0.6 };
    const onlyTxt = { ...abs, left: 0, top: STRIP[1] + 22, width: CW - 7, textAlign: "center", fontFamily: serif, fontWeight: 900, fontSize: 44, lineHeight: "52px", color: acc, clipPath: "inset(-10px " + (100 - only * 100) + "% -10px -10px)" };
    const lblWrap = { ...abs, left: 70, top: 404, filter: "drop-shadow(" + SHADOW + ")", opacity: lbl.o, transform: "rotate(-2deg) scale(" + lbl.s + ")", transformOrigin: "20% 50%" };
    const lblEdge = { backgroundColor: "rgba(23,20,17,0.2)", clipPath: TORN2, padding: 1.5 };
    const lblPaper = { backgroundColor: paper, clipPath: TORN2, padding: "6px 24px 6px 20px" };
    const lblText = { fontFamily: hand, fontWeight: 700, fontSize: 40, lineHeight: 1.2, color: ink, whiteSpace: "nowrap", clipPath: "inset(0 " + (100 - lblTxt * 100) + "% 0 0)" };

    // ---------- glyphs ----------
    const chipGlyph = (i) => {
      if (i === 0) return <svg viewBox="0 0 24 24" width="30" height="30"><circle cx="12" cy="12" r="9" fill="none" stroke={ink} strokeWidth="2.5" /><circle cx="12" cy="12" r="4.5" fill={acc} /></svg>;
      if (i === 1) return <svg viewBox="0 0 24 24" width="30" height="30"><path d="M10 14 L14 10 M8.5 15.5 a3.5 3.5 0 0 1 0-5 l2-2 M15.5 8.5 a3.5 3.5 0 0 1 0 5 l-2 2" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" /><circle cx="18" cy="6" r="2.2" fill={acc} /></svg>;
      if (i === 2) return <svg viewBox="0 0 24 24" width="30" height="30"><g fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round"><path d="M5 7 H19 M5 12 H19 M5 17 H13" /></g><circle cx="18" cy="17" r="2.5" fill={acc} /></svg>;
      return <svg viewBox="0 0 24 24" width="30" height="30"><rect x="4" y="5" width="16" height="15" rx="2.5" fill="none" stroke={ink} strokeWidth="2.5" /><path d="M4 10 H20 M8 3 V7 M16 3 V7" stroke={ink} strokeWidth="2.5" strokeLinecap="round" /><rect x="7" y="13" width="4" height="3" fill={acc} /></svg>;
    };
    const stripGlyph = (i) => {
      if (i === 0) return <svg viewBox="0 0 32 32" width="34" height="34"><circle cx="11" cy="12" r="5" fill="none" stroke={ink} strokeWidth="2.6" /><circle cx="22" cy="13" r="4" fill="none" stroke={ink} strokeWidth="2.6" /><path d="M3 27 a8 8 0 0 1 16 0 M17 25 a6 6 0 0 1 12 0" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" /></svg>;
      if (i === 1) return <svg viewBox="0 0 32 32" width="34" height="34"><g fill="none" stroke={ink} strokeWidth="2.6"><rect x="5" y="5" width="22" height="9" rx="2.5" /><rect x="5" y="18" width="22" height="9" rx="2.5" /></g><circle cx="22" cy="9.5" r="1.8" fill={acc} /><circle cx="22" cy="22.5" r="1.8" fill={acc} /></svg>;
      return <svg viewBox="0 0 32 32" width="34" height="34"><g fill="none" stroke={ink} strokeWidth="2.6"><ellipse cx="16" cy="8" rx="10" ry="4" /><path d="M6 8 V24 a10 4 0 0 0 20 0 V8 M6 16 a10 4 0 0 0 20 0" /></g></svg>;
    };

    const chip = (i, extra) => <div style={{ ...chipBox, ...extra }}>{chipGlyph(i)}<span style={chipTxt}>{CHIPS[i]}</span></div>;

    return <div style={rootStyle}>
      {/* the app */}
      <div style={{ ...card(AX, AY, AW, AH, false), opacity: app.o, transform: "rotate(" + appR + "deg) scale(" + app.s + ")", transformOrigin: "40% 40%" }}>
        <div style={title}>the app</div>
        <div style={micro}>APP</div>
        {CHIPS.map((c, i) => <div key={"c" + i} style={{ ...abs, left: CHIP[i][0], top: CHIP[i][1], opacity: chipIn(i).o, transform: "scale(" + chipIn(i).s + ")" }}>{chip(i, {})}</div>)}
        <div style={stripBox}>
          <div style={stripGlow} />
          {STRIP_ITEMS.map((t, i) => <div key={"s" + i} style={stripItem(i)}>{stripGlyph(i)}<div style={stripMicro}>{t}</div></div>)}
          <svg viewBox="0 0 352 92" width="352" height="92" style={{ ...abs, left: -3, top: -3, overflow: "visible", opacity: xO }}>
            <g strokeLinecap="round" fill="none">
              <path d="M28 14 L324 78" stroke={ink} strokeWidth="18" strokeDasharray="310" strokeDashoffset={310 * (1 - x1)} />
              <path d="M324 14 L28 78" stroke={ink} strokeWidth="18" strokeDasharray="310" strokeDashoffset={310 * (1 - x2)} />
              <path d="M28 14 L324 78" stroke={acc} strokeWidth="10" strokeDasharray="310" strokeDashoffset={310 * (1 - x1)} />
              <path d="M324 14 L28 78" stroke={acc} strokeWidth="10" strokeDasharray="310" strokeDashoffset={310 * (1 - x2)} />
            </g>
          </svg>
        </div>
      </div>

      {/* your clone */}
      <div style={{ ...card(clX, AY, CW, AH, true), opacity: clO, transform: "rotate(" + clR + "deg)", transformOrigin: "50% 50%" }}>
        <div style={title}>your clone</div>
        <div style={micro}>CLONE</div>
        {CHIPS.map((c, i) => <div key={"k" + i} style={slot(i)} />)}
        <div style={onlyTxt}>features only</div>
      </div>

      {/* chips in flight (canvas coordinates, above both cards) */}
      {f >= tFeat ? CHIPS.map((c, i) => {
        const q = fly(i);
        return <div key={"f" + i} style={{ ...abs, left: q.x, top: q.y, opacity: q.o, transform: "rotate(" + q.rot + "deg) scale(" + q.s + ")", transformOrigin: "50% 50%" }}>{chip(i, {})}</div>;
      }) : null}

      {/* label */}
      <div style={lblWrap}>
        <div style={lblEdge}><div style={lblPaper}><div style={lblText}>the rest stays theirs</div></div></div>
      </div>
    </div>;
  };

  return __Inner({ item });
};
