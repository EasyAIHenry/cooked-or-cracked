// B03 "30 days" (Ep7). Canvas 980x500, 158 frames. ChatCut motion graphic (Remotion runtime).
// "I ran a challenge in May and I posted 30 days straight, no fail, Monday to Friday."
// Calendar card swings down on its hinge (ran -> challenge) -> MAY lands in the header + dates fill (May)
// -> card slides left, DAY counter pops (posted) -> flip-wave ticks every weekday, weekends hatch, counter runs 1 -> 30 (30 days)
// -> streak flame (straight) -> "0 MISSED" stamp slams into the empty June row (no fail)
// -> M-F headers underline + weekends fade (Monday to Friday).
// Real window: Mon 4 May -> Tue 2 Jun 2026 = 30 days, 22 weekdays ticked, 8 weekend days.
const CB = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const CW = 620;
const CH = 420;
const CARD_TOP = 42;
const PX = 83;
const CELLW = 75;
const PY = 48;
const CELLH = 41;
const GX = 23;
const GY = 129;
// tick wave: first cell flips at SWEEP_A, last (Tue 2 Jun) at SWEEP_B; counter trails by LAG so each number shows as its cell turns orange
const SWEEP_A = 55;
const SWEEP_B = 70;
const LAG = 2;
const dayTime = (k) => {
  const y = k / 29;
  const t = y <= 0.5 ? Math.sqrt(y / 2) : 1 - Math.sqrt((1 - y) / 2);
  return SWEEP_A + (SWEEP_B - SWEEP_A) * t;
};
const DAYS = [];
for (let i = 0; i < 30; i++) {
  DAYS.push({ i: i, col: i % 7, row: Math.floor(i / 7), label: i < 28 ? String(4 + i) : (i === 28 ? "1 Jun" : "2"), weekend: (i % 7) >= 5, t: dayTime(i) });
}
const LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
// M-F underline (Easing.inOut(sin)); letters pop exactly when the eased line reaches them
const UL_S = 115;
const UL_D = 26;
const UL_X0 = GX + 4;
const UL_X1 = GX + 4 * PX + CELLW - 4;
const al = (hex, a) => hex + Math.round(a * 255).toString(16).padStart(2, "0");
const TORN = "polygon(0% 3%,14% 0%,30% 3%,46% 0%,62% 2%,79% 0%,100% 2%,98% 30%,100% 62%,99% 98%,82% 100%,66% 97%,50% 100%,33% 97%,17% 100%,0% 98%,2% 66%,0% 33%)";
// stamp: base 280x70, sits in the empty June row (cols 2-6), settles at 0.9 and -3deg
const ST_W = 280;
const ST_H = 74;
const ST_CX = 396;
const ST_CY = 361;

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;

  // ---- calendar card: swings down from its top hinge (ran f3 -> lands on "a challenge" f12-13), small 3deg bounce, settled f18
  const cardOp = interpolate(frame, [2, 4], [0, 1], CB);
  const fallP = interpolate(frame, [3, 12], [0, 1], { ...CB, easing: Easing.in(Easing.quad) });
  const flipRx = frame < 12 ? -90 + 93 * fallP : interpolate(frame, [12, 15, 18], [3, -1, 0], CB);
  const cardLeft = interpolate(frame, [47, 56], [180, 30], { ...CB, easing: Easing.out(Easing.cubic) });
  const jolt = interpolate(frame, [104, 106, 111], [0, 4, 0], CB);

  // ---- MAY glides into the header on "May" (f42)
  const mayMax = interpolate(frame, [38, 46], [0, 158], { ...CB, easing: Easing.out(Easing.cubic) });
  const mayGap = interpolate(frame, [38, 44], [0, 16], CB);
  const maySc = interpolate(frame, [38, 44, 49], [0.3, 1.12, 1], CB);
  const mayRot = interpolate(frame, [38, 44, 49], [-14, 3, 0], CB);
  const mayOp = interpolate(frame, [38, 41], [0, 1], CB);

  // ---- day counter rolls 1 -> 30 with the tick wave; 30 lands f72 (word "30" f75)
  const d = interpolate(frame - LAG, [SWEEP_A, SWEEP_B], [1, 30], { ...CB, easing: Easing.inOut(Easing.quad) });
  const n = Math.min(30, Math.max(1, Math.floor(d + 1e-6)));
  const tN = n >= 2 ? dayTime(n - 1) + LAG : -999;
  const tP = n >= 3 ? dayTime(n - 2) + LAG : SWEEP_A + LAG;
  const gap = tN - tP;
  const rollR = n >= 2 && gap >= 2.5 ? interpolate(frame, [tN, tN + Math.min(gap, 4)], [0, 1], { ...CB, easing: Easing.out(Easing.cubic) }) : 1;
  const chipOp = interpolate(frame, [55, 57], [0, 1], CB);
  const chipSc = interpolate(frame, [55, 60, 64], [0.3, 1.08, 1], CB);
  const chipRot = interpolate(frame, [55, 60, 64], [10, 0, 2], CB);
  const numSc = interpolate(frame, [72, 75, 80], [1, 1.12, 1], CB);
  // streak flame on "straight" (f98)
  const flameSc = interpolate(frame, [94, 98, 102], [0.2, 1.18, 1], CB);
  const flameRot = interpolate(frame, [94, 98, 102], [-25, 10, 6], CB);
  const flameOp = interpolate(frame, [94, 96], [0, 1], CB);

  // ---- "0 MISSED" stamp slams on "no fail" (f102-107)
  const stampSc = interpolate(frame, [100, 104, 107, 110], [1.28, 0.85, 0.93, 0.9], CB);
  const stampOp = interpolate(frame, [100, 102], [0, 1], CB);
  const burst = interpolate(frame, [104, 109], [0, 1], { ...CB, easing: Easing.out(Easing.cubic) });
  const burstOp = interpolate(frame, [104, 105, 110, 115], [0, 1, 1, 0], CB);

  // ---- Monday to Friday (f120-138): underline draws M -> F, letters turn accent as it reaches them, weekends fade
  const ulP = interpolate(frame, [UL_S, UL_S + UL_D], [0, 1], { ...CB, easing: Easing.inOut(Easing.sin) });
  const wkFade = interpolate(frame, [118, 128], [1, 0.38], CB);

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const serif = { fontFamily: props.serif, fontWeight: 900 };

  const cells = DAYS.map((c) => {
    const f = frame - c.t;
    const p = Math.min(1, Math.max(0, f / 4));
    const flipped = p >= 0.5;
    const sx = Math.max(0.04, Math.abs(Math.cos(Math.PI * p)));
    const numOp = interpolate(frame, [40 + c.i * 0.3, 43 + c.i * 0.3], [0, 1], CB);
    const tickQ = interpolate(f, [2, 6], [0, 1], { ...CB, easing: Easing.out(Easing.cubic) });
    const pop = interpolate(f, [4, 6, 9], [1, 1.08, 1], CB);
    let bg = paper;
    let border = "2px solid " + al(ink, 0.2);
    let bgImg = "none";
    if (flipped && !c.weekend) { bg = al(acc, 0.1); border = "2.5px solid " + acc; }
    if (flipped && c.weekend) { bg = al(ink, 0.05); border = "2px solid " + al(ink, 0.12); bgImg = "repeating-linear-gradient(135deg," + al(ink, 0.16) + " 0px," + al(ink, 0.16) + " 2px,transparent 2px,transparent 9px)"; }
    const op = c.weekend ? wkFade : 1;
    return <div key={c.i} style={{ position: "absolute", left: GX + c.col * PX, top: GY + c.row * PY, width: CELLW, height: CELLH, boxSizing: "border-box", borderRadius: 9, backgroundColor: bg, backgroundImage: bgImg, border: border, opacity: op, transform: "scaleX(" + sx + ") scale(" + pop + ")" }}>
      <div style={{ position: "absolute", left: 7, top: 2, fontFamily: props.sans, fontWeight: 800, fontSize: c.i === 28 ? 13 : 15, color: al(ink, flipped && !c.weekend ? 0.75 : 0.5), opacity: numOp, whiteSpace: "nowrap" }}>{c.label}</div>
      {flipped && !c.weekend ? <svg viewBox="0 0 75 42" style={{ position: "absolute", left: 0, top: -1, width: 75, height: 42 }}>
        <path d="M28 23 L36.5 31.5 L55 10" fill="none" stroke={acc} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="42" strokeDashoffset={42 * (1 - tickQ)} />
      </svg> : null}
    </div>;
  });

  const letters = LETTERS.map((L, c) => {
    const cx = GX + c * PX + CELLW / 2;
    const pReach = (cx - 6 - UL_X0) / (UL_X1 - UL_X0);
    const tPass = c < 5 ? UL_S + UL_D * Math.acos(1 - 2 * pReach) / Math.PI : 999;
    const passed = c < 5 && frame >= tPass;
    const sc = c < 5 ? interpolate(frame, [tPass, tPass + 3, tPass + 7], [1, 1.32, 1.12], CB) : 1;
    const col = passed ? acc : ink;
    const op = c >= 5 ? interpolate(frame, [118, 128], [1, 0.3], CB) : 1;
    return <div key={c} style={{ position: "absolute", left: GX + c * PX, top: 78, width: CELLW, textAlign: "center", ...serif, fontSize: 30, lineHeight: "34px", color: col, opacity: op, transform: "scale(" + sc + ")" }}>{L}</div>;
  });

  const DH = 178;
  const numCell = { height: DH, lineHeight: DH + "px", textAlign: "center", ...serif, fontSize: 168, color: ink };

  // burst rays: two per side, kept in the clear paper either side of the stamp
  const burstLines = [[-1, -0.4], [-1, 0.4], [1, -0.4], [1, 0.4]].map((v, k) => {
    const x0 = v[0] * 158;
    const y0 = v[1] * 40;
    const x1 = v[0] * (158 + 26 * burst);
    const y1 = v[1] * (40 + 22 * burst);
    return <line key={k} x1={x0} y1={y0} x2={x1} y2={y1} stroke={acc} strokeWidth="5" strokeLinecap="round" />;
  });

  return <div style={rootStyle}>
    {/* calendar card */}
    <div style={{ position: "absolute", left: cardLeft, top: CARD_TOP + jolt, width: CW, height: CH, opacity: cardOp, transform: "perspective(1600px) rotateX(" + flipRx + "deg) rotate(-1deg)", transformOrigin: "50% 0%" }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: paper, borderRadius: 12, boxShadow: "4px 6px 0 rgba(23,20,17,0.22)" }} />
      {/* header band */}
      <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: 70, backgroundColor: ink, borderRadius: "12px 12px 0 0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <span style={{ display: "inline-block", maxWidth: mayMax, marginRight: mayGap, whiteSpace: "nowrap", overflow: "visible" }}>
          <span style={{ display: "inline-block", ...serif, fontSize: 62, lineHeight: "70px", color: acc, opacity: mayOp, transform: "translateY(-3px) scale(" + maySc + ") rotate(" + mayRot + "deg)" }}>MAY</span>
        </span>
        <span style={{ ...serif, fontSize: 50, lineHeight: "70px", color: paper, letterSpacing: 1 }}>CHALLENGE</span>
      </div>
      {/* binder rings */}
      {[44, 576].map((x, k) => <div key={k} style={{ position: "absolute", left: x - 9, top: -20, width: 18, height: 40, boxSizing: "border-box", borderRadius: 9, border: "4px solid " + ink, backgroundColor: paper }} />)}
      {letters}
      {/* M-F underline */}
      <svg viewBox={"0 0 " + CW + " 20"} style={{ position: "absolute", left: 0, top: 107, width: CW, height: 20, overflow: "visible" }}>
        <path d={"M" + UL_X0 + " 10 Q" + (UL_X0 + 100) + " 5 " + (UL_X0 + 200) + " 10 T " + UL_X1 + " 9"} fill="none" stroke={acc} strokeWidth="8.5" strokeLinecap="round" strokeDasharray="420" strokeDashoffset={420 * (1 - ulP)} opacity={ulP > 0 ? 1 : 0} />
      </svg>
      {cells}
      {/* stamp */}
      <div style={{ position: "absolute", left: ST_CX - ST_W / 2, top: ST_CY - ST_H / 2, width: ST_W, height: ST_H, opacity: stampOp, transform: "rotate(-3deg) scale(" + stampSc + ")", transformOrigin: "50% 80%" }}>
        <svg viewBox="-260 -100 520 200" style={{ position: "absolute", left: ST_W / 2 - 260, top: ST_H / 2 - 100, width: 520, height: 200, overflow: "visible", opacity: burstOp }}>{burstLines}</svg>
        <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", border: "4.5px solid " + acc, borderRadius: 10, backgroundColor: al(paper, 0.94) }} />
        <div style={{ position: "absolute", left: 8.5, top: 8.5, right: 8.5, bottom: 8.5, boxSizing: "border-box", border: "2px solid " + acc, borderRadius: 5 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 13 }}>
          <span style={{ ...serif, fontSize: 56, lineHeight: ST_H + "px", color: acc }}>0</span>
          <span style={{ display: "inline-block", ...serif, fontSize: 38, lineHeight: ST_H + "px", color: acc, letterSpacing: 3, transform: "translateY(6.5px)" }}>MISSED</span>
        </div>
      </div>
      {/* outline on top */}
      <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", border: "3px solid " + ink, borderRadius: 12 }} />
    </div>

    {/* day counter chip */}
    <div style={{ position: "absolute", left: 683, top: 112, width: 270, height: 272, opacity: chipOp, transform: "rotate(" + chipRot + "deg) scale(" + chipSc + ")", transformOrigin: "80% 60%", filter: "drop-shadow(4px 6px 0 rgba(23,20,17,0.22))" }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: paper, clipPath: TORN }} />
      <div style={{ position: "absolute", left: 0, top: 22, width: 270, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 46, lineHeight: "50px", color: ink, letterSpacing: 2 }}>DAY</div>
      <div style={{ position: "absolute", left: 21, top: 70, width: 228, height: DH, transform: "scale(" + numSc + ")", transformOrigin: "50% 55%" }}>
        <div style={{ ...numCell, position: "absolute", left: 0, top: 0, width: 228, opacity: n >= 2 ? Math.max(0, 1 - 2.4 * rollR) : 0, transform: "translateY(" + (-46 * rollR) + "px)" }}>{n >= 2 ? String(n - 1) : ""}</div>
        <div style={{ ...numCell, position: "absolute", left: 0, top: 0, width: 228, opacity: Math.min(1, Math.max(0, (rollR - 0.3) / 0.45)), transform: "translateY(" + (46 * (1 - rollR)) + "px)" }}>{String(n)}</div>
      </div>
      {/* streak flame */}
      <svg viewBox="0 0 40 52" style={{ position: "absolute", left: 208, top: -26, width: 58, height: 75, opacity: flameOp, transform: "rotate(" + flameRot + "deg) scale(" + flameSc + ")", transformOrigin: "50% 90%", overflow: "visible" }}>
        <path d="M20 3 C26 13 36 19 35 33 C34 44 27 50 20 50 C12 50 5 44 5 34 C5 25 11 21 13 13 C16 19 18 21 20 22 C21 15 20 9 20 3 Z" fill={acc} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 28 C24 33 28 36 27 42 C26 47 23 49 20 49 C16 49 13 46 13 42 C13 37 17 34 20 28 Z" fill={gold} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </div>
  </div>;
};
