// B07 files + 10 min (Ep7 explainer, 5 Oct 2026). Canvas 980x500, 156 frames. ChatCut motion graphic (Remotion runtime).
// "Claude actually checked my old project files. And totally it took about 10 minutes."
// Scene A: the Claude spark pops, grows a handle and becomes a magnifier; it slides left beside the folder that pops in,
// turns its glass to face it and leans in on "checked". The label writes word by word, four file cards fan out on
// "project" and the lens sweeps across them left to right (it really magnifies: a clipped 1.22x copy of the cards shows
// inside the glass), a tick stamping on each card 1 frame after the lens passes. The lens lifts off to the right so the
// four ticked files hold still (f60-75).
// Scene B (from f75, inside "totally"): the folder collapses in place, the lens retracts its handle and morphs into a
// stopwatch at centre (ticks drawn all round at once, the stub swings up into the crown), the crown clicks on "took",
// the hand sweeps an orange 10-minute wedge, the stopwatch slides right as "about" lands, the hand stops on 10 with the
// big "10", the burst clears, and "MIN" lands on "minutes" with an orange underline.
const B7_CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const B7_RAISE = 38;
const B7_PARK = { x: 868, y: 158 };
const B7_DIAL0 = { x: 550, y: 266 };
const B7_DIAL1 = { x: 771, y: 266 };
const B7_REST = { x: 222, y: 226 };
const B7_LEAN = { x: 250, y: 236 };
const B7_M = 75; // morph start (inside "totally", f72-89)
const B7_MAG = 1.22;
const B7_CARDS = [
  { x: 530, y: 262, r: -10, k: 0, ext: "DOC" },
  { x: 628, y: 248, r: -3.5, k: 1, ext: "PNG" },
  { x: 726, y: 248, r: 3.5, k: 2, ext: "MP4" },
  { x: 824, y: 262, r: 10, k: 3, ext: "PDF" },
];
const B7_FOLDER = { x: 677, y: 392 };
const B7_SHIFT = -130;
const B7_SHIFTY = -32;
const b7rad = (d) => (d * Math.PI) / 180;
const b7polar = (cx, cy, R, a) => [cx + R * Math.sin(b7rad(a)), cy - R * Math.cos(b7rad(a))];
const b7rot = (x, y, deg) => [x * Math.cos(b7rad(deg)) - y * Math.sin(b7rad(deg)), x * Math.sin(b7rad(deg)) + y * Math.cos(b7rad(deg))];
const b7arc = (cx, cy, R, a0, a1) => {
  const p0 = b7polar(cx, cy, R, a0);
  const p1 = b7polar(cx, cy, R, a1);
  return "M " + p0[0] + " " + p0[1] + " A " + R + " " + R + " 0 " + (a1 - a0 > 180 ? 1 : 0) + " 1 " + p1[0] + " " + p1[1];
};
const b7wedge = (cx, cy, R, a) => {
  if (a < 0.3) return "M 0 0";
  const p0 = b7polar(cx, cy, R, 0);
  const p1 = b7polar(cx, cy, R, a);
  return "M " + cx + " " + cy + " L " + p0[0] + " " + p0[1] + " A " + R + " " + R + " 0 " + (a > 180 ? 1 : 0) + " 1 " + p1[0] + " " + p1[1] + " Z";
};
// shared 12-ray Claude mark (same RAYS constant as B01/B06: [angle, length] in a 100-box, inner radius 7, longest ray 46).
// B06 angles are measured from 3 o'clock; b7polar measures from 12 o'clock, hence +90. s = outer radius of the longest ray.
const RAYS = [[0, 45], [31, 37], [62, 46], [92, 38], [121, 45], [152, 36], [182, 46], [211, 37], [242, 45], [271, 37], [302, 46], [331, 38]];
const b7spark = (cx, cy, s, sw, color) => (
  <g>
    {RAYS.map(([a, L], i) => {
      const p0 = b7polar(cx, cy, (s * 7) / 46, a + 90);
      const p1 = b7polar(cx, cy, (s * L) / 46, a + 90);
      return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    })}
  </g>
);

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;
  const f = frame;
  const EO = Easing.out(Easing.cubic);
  const EIO = Easing.inOut(Easing.cubic);
  const EI = Easing.in(Easing.cubic);
  const shadow = "rgba(23,20,17,0.22)";
  const faint = "rgba(23,20,17,0.17)";
  const ce = (input, outA, outB, easing) => interpolate(f, input, [outA, outB], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easing });

  // ---------- Claude badge -> magnifier -> stopwatch ----------
  const popSc0 = interpolate(f, [0, 7, 12], [0.3, 1.08, 1], B7_CL);
  const popRt = interpolate(f, [0, 7, 12], [10, -3, 0], B7_CL);
  const popOp = interpolate(f, [0, 3], [0, 1], B7_CL);
  const mForm = ce([10, 22], 0, 1, EO);
  const M = B7_M;
  const morph = ce([M, M + 10], 0, 1, EIO);
  // lens path: centre -> beside the folder (f16-23) -> leans in on "checked" (f23-27) -> eases onto card 0 (f42-48)
  // -> constant-speed sweep across the cards, 2 frames per card (f48-54) -> lifts off to the right (f54-59)
  const lp = B7_CARDS.map((c) => ({ x: c.x + B7_SHIFT, y: c.y + B7_SHIFTY - B7_RAISE }));
  const EIq = Easing.in(Easing.quad);
  const EOq = Easing.out(Easing.quad);
  let scanX = 490;
  let scanY = 240;
  if (f >= 16 && f < 23) {
    const t = ce([16, 23], 0, 1, EO);
    scanX = 490 + (B7_REST.x - 490) * t;
    scanY = 240 + (B7_REST.y - 240) * t;
  } else if (f >= 23 && f < 42) {
    const t = ce([23, 27], 0, 1, EO);
    scanX = B7_REST.x + (B7_LEAN.x - B7_REST.x) * t;
    scanY = B7_REST.y + (B7_LEAN.y - B7_REST.y) * t;
  } else if (f >= 42 && f < 48) {
    const t = ce([42, 48], 0, 1, EIq);
    scanX = B7_LEAN.x + (lp[0].x - B7_LEAN.x) * t;
    scanY = B7_LEAN.y + (lp[0].y - B7_LEAN.y) * t;
  } else if (f >= 48 && f < 54) {
    scanX = interpolate(f, [48, 50, 52, 54], [lp[0].x, lp[1].x, lp[2].x, lp[3].x], B7_CL);
    scanY = interpolate(f, [48, 50, 52, 54], [lp[0].y, lp[1].y, lp[2].y, lp[3].y], B7_CL);
  } else if (f >= 54) {
    const t = ce([54, 59], 0, 1, EOq);
    scanX = lp[3].x + (B7_PARK.x - lp[3].x) * t;
    scanY = lp[3].y + (B7_PARK.y - lp[3].y) * t;
  }
  const startBig = 1 + 0.28 * (1 - ce([16, 23], 0, 1, EO));
  const dialX = interpolate(f, [100, 108], [B7_DIAL0.x, B7_DIAL1.x], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EIO });
  const cx = scanX + (dialX - scanX) * morph;
  const cy = scanY + (B7_DIAL0.y - scanY) * morph;
  const R = 74 + (140 - 74) * morph;
  const popSc = popSc0 * startBig;
  // glass: light paper tint (0.5) so the ruled page shows through; near-opaque only while it magnifies the cards
  // (so the originals do not ghost under the enlarged copy); solid paper as the badge and as the stopwatch face
  const lensFill = interpolate(f, [10, 20, 40, 45, 55, 59, M, M + 5], [1, 0.5, 0.5, 0.97, 0.97, 0.5, 0.5, 1], B7_CL);
  const magOn = f >= 40 && f < 60;
  const glareOp = interpolate(f, [14, 20], [0, 1], B7_CL) * (f < M + 1 ? 1 : 0);
  // the spark steps aside while the glass magnifies the cards (so it does not merge with the enlarged orange marks)
  const sparkVis = 1 - ce([42, 46], 0, 1, EIO) + ce([55, 59], 0, 1, EIO);
  const sparkS = (44 + (15 - 44) * mForm + (22 - 15) * morph) * sparkVis;
  // stroke kept near the B06 ratio (sw ~ 0.24 x outer radius) so the 12 rays stay distinct at small sizes
  const sparkW = (10 + (3.8 - 10) * mForm + (5.2 - 3.8) * morph) * Math.min(1, sparkVis * 1.5);
  // handle (magnifier): grows pointing down-left, so the glass faces right towards where the folder lands; tips forward
  // on "checked" and trails behind the lens through the sweep (clear of the label); swings down-right as the lens lifts
  // off; on "totally" the grip is cut, the handle retracts to a stub, then the stub swings up into the crown
  const tip = ce([23, 27], 0, 1, EO);
  const lift = ce([54, 59], 0, 1, EIO);
  const shrink = ce([M, M + 3], 0, 1, EO);
  const swing = ce([M + 2, M + 9], 0, 1, EIO);
  const hAng = 135 + 14 * tip - 87 * lift - 152 * swing;
  const hLen = mForm * (70 - 46 * shrink);
  const hW = 26 + 4 * swing;
  const press = interpolate(f, [91, 93, 98], [0, 8, 0], B7_CL) + interpolate(f, [110, 112, 117], [0, 8, 0], B7_CL);
  const hx = cx + R * Math.cos(b7rad(hAng)) - press * Math.cos(b7rad(hAng));
  const hy = cy + R * Math.sin(b7rad(hAng)) - press * Math.sin(b7rad(hAng));
  const gripOp = f < M + 1 ? 1 : 0;
  const capOp = interpolate(f, [M + 5, M + 9], [0, 1], B7_CL);
  const capSc = interpolate(f, [M + 5, M + 9], [0.4, 1], B7_CL);

  // stopwatch face
  const faceOn = f >= M + 2;
  const sweepKeys = [94, 116, 120];
  const sweep = interpolate(f, sweepKeys, [0, 62, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EIO });
  const sweepPrev = interpolate(f - 4, sweepKeys, [0, 62, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EIO });
  const speed = Math.max(0, sweep - sweepPrev);
  const handOp = interpolate(f, [M + 8, M + 12], [0, 1], B7_CL);
  const handLen = interpolate(f, [M + 8, M + 14], [0, 62], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO });
  const handTip = b7polar(cx, cy, handLen, sweep);
  const handTail = b7polar(cx, cy, handLen * 0.18, sweep + 180);
  const secs = Math.round((Math.min(sweep, 60) / 60) * 600);
  const readout = String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
  const readOp = interpolate(f, [M + 10, M + 14], [0, 1], B7_CL) * (1 - 0.6 * interpolate(f, [127, 133], [0, 1], B7_CL));
  const sideSc = interpolate(f, [M + 8, M + 13, M + 17], [0, 1.15, 1], B7_CL);
  const burstDraw = ce([112, 118], 0, 1, EO);
  const burstOut = ce([124, 128], 0, 1, EI);
  const pressLinesOp = interpolate(f, [91, 92, 97, 99], [0, 1, 1, 0], B7_CL) + interpolate(f, [110, 111, 116, 118], [0, 1, 1, 0], B7_CL);
  const numGrey = interpolateColors(0.5, [0, 1], [paper, ink]);

  // dial ticks: all 60 grow in at once, all the way round, so the face reads as a stopwatch immediately
  const tickGrow = ce([M + 2, M + 7], 0, 1, EO);
  const ticks = [];
  if (faceOn) {
    for (let k = 0; k < 60; k++) {
      const major = k % 5 === 0;
      const rOut = (R * 130) / 140;
      const rIn = (R * (major ? 114 : 123)) / 140;
      const p0 = b7polar(cx, cy, rOut - (rOut - rIn) * tickGrow, k * 6);
      const p1 = b7polar(cx, cy, rOut, k * 6);
      ticks.push(<line key={"t" + k} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={ink} strokeOpacity={major ? 1 : 0.42} strokeWidth={major ? 4 : 2.4} strokeLinecap="round" opacity={Math.min(1, tickGrow * 3)} />);
    }
  }
  const nums = [0, 10, 20, 30, 40, 50].map((n, i) => {
    const p = b7polar(cx, cy, (R * 85) / 140, i * 60);
    const sc = interpolate(f, [M + 7 + i, M + 12 + i, M + 16 + i], [0.3, 1.1, 1], B7_CL);
    const op = interpolate(f, [M + 7 + i, M + 10 + i], [0, 1], B7_CL);
    return (
      <text key={"n" + n} x={p[0]} y={p[1] + 9} textAnchor="middle" fontFamily={props.serif} fontWeight={900} fontSize={26} fill={numGrey} stroke={paper} strokeWidth={7} strokeLinejoin="round" paintOrder="stroke" opacity={faceOn ? op : 0} transform={"translate(" + p[0] + " " + p[1] + ") scale(" + sc + ") translate(" + -p[0] + " " + -p[1] + ")"}>
        {n}
      </text>
    );
  });

  // ---------- folder + file cards ----------
  const fSc = interpolate(f, [21, 28, 33], [0.3, 1.08, 1], B7_CL);
  const fOp = interpolate(f, [21, 24], [0, 1], B7_CL);
  // exit on "totally": a small swell, then it collapses in place (no drift)
  const exSc = interpolate(f, [M, M + 2, M + 6], [1, 1.04, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const fSc2 = fSc * exSc;
  const fRt = -8 * ce([M + 2, M + 6], 0, 1, EI);
  const fOp2 = fOp * (f >= M + 6 ? 0 : 1);
  const folderT = "translate(" + B7_SHIFT + " " + B7_SHIFTY + ") translate(" + B7_FOLDER.x + " " + (B7_FOLDER.y - 60) + ") rotate(" + fRt + ") scale(" + fSc2 + ") translate(" + -B7_FOLDER.x + " " + -(B7_FOLDER.y - 60) + ")";
  // label writes in step with the words: "old" by ~f39, "project" by ~f47, "files" by ~f54
  const labelW = interpolate(f, [35, 54], [0, 360], B7_CL);
  const cardStart = (i) => 44 + 1.5 * i;
  const cardState = B7_CARDS.map((c, i) => {
    // spring fan-out; its sub-pixel tail is faded out by 11 frames in so the ticked set is truly still from f60
    const p0 = spring({ frame: f - cardStart(i), fps: 30, config: { damping: 15, stiffness: 200, mass: 0.7 } });
    const p = 1 - (1 - p0) * interpolate(f - cardStart(i), [7, 11], [1, 0], B7_CL);
    return {
      x: B7_FOLDER.x + (c.x - B7_FOLDER.x) * p,
      y: B7_FOLDER.y + (c.y - B7_FOLDER.y) * p,
      r: c.r * p,
      s: 0.45 + 0.55 * p,
      on: f >= cardStart(i),
    };
  });
  const cardBody = (c, i) => {
    const st = cardState[i];
    let content = null;
    if (c.k === 0) {
      content = (
        <g>
          <rect x={-48} y={-62} width={58} height={11} rx={5.5} fill={acc} />
          {[[-38, 92], [-24, 80], [-10, 92], [4, 64], [18, 86]].map((l, j) => <rect key={j} x={-48} y={l[0]} width={l[1]} height={7} rx={3.5} fill={faint} />)}
        </g>
      );
    } else if (c.k === 1) {
      content = (
        <g>
          <rect x={-48} y={-62} width={96} height={66} rx={4} fill="none" stroke={ink} strokeWidth={2.5} />
          <circle cx={24} cy={-44} r={8} fill={acc} />
          <path d="M -46 2 L -20 -26 L -2 -8 L 14 -30 L 46 2" fill="none" stroke={ink} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          <rect x={-48} y={18} width={80} height={7} rx={3.5} fill={faint} />
          <rect x={-48} y={32} width={58} height={7} rx={3.5} fill={faint} />
        </g>
      );
    } else if (c.k === 2) {
      content = (
        <g>
          <rect x={-48} y={-62} width={96} height={66} rx={4} fill={ink} />
          <path d="M -9 -42 L 14 -29 L -9 -16 Z" fill={acc} />
          <rect x={-48} y={18} width={86} height={7} rx={3.5} fill={faint} />
          <rect x={-48} y={32} width={58} height={7} rx={3.5} fill={faint} />
        </g>
      );
    } else {
      content = (
        <g>
          {[[-44, 22], [-20, 40], [4, 30], [28, 56]].map((b, j) => <rect key={j} x={b[0]} y={4 - b[1]} width={16} height={b[1]} fill={j === 3 ? acc : faint} />)}
          <line x1={-48} y1={6} x2={48} y2={6} stroke={ink} strokeWidth={2.5} strokeLinecap="round" />
          <rect x={-48} y={18} width={84} height={7} rx={3.5} fill={faint} />
          <rect x={-48} y={32} width={66} height={7} rx={3.5} fill={faint} />
        </g>
      );
    }
    return (
      <g key={"c" + i} opacity={st.on ? 1 : 0} transform={"translate(" + st.x + " " + st.y + ") rotate(" + st.r + ") scale(" + st.s + ")"}>
        <path d="M -61 -76.5 H 45 L 69 -52.5 V 88.5 H -61 Z" fill={shadow} />
        <path d="M -65 -82.5 H 41 L 65 -58.5 V 82.5 H -65 Z" fill={paper} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
        <path d="M 41 -82.5 V -58.5 H 65 Z" fill={faint} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
        {content}
        <text x={-48} y={68} fontFamily={props.sans} fontWeight={800} fontSize={15} fill={ink} fillOpacity={0.5} letterSpacing={1}>{c.ext}</text>
      </g>
    );
  };
  const tickBadges = B7_CARDS.map((c, i) => {
    const st = cardState[i];
    // stamps 1 frame after the lens passes the card centre (lens at card i on f48 + 2i), on the card's top-left
    // corner, just behind the moving lens
    const t0 = 49 + 2 * i;
    const sc = interpolate(f, [t0, t0 + 3, t0 + 5], [0, 1.25, 1], B7_CL);
    const rt = interpolate(f, [t0, t0 + 3, t0 + 5], [-30, 6, 0], B7_CL);
    const off = b7rot(-47 * st.s, -76 * st.s, st.r);
    const tx = st.x + off[0];
    const ty = st.y + off[1];
    return (
      <g key={"k" + i} opacity={f >= t0 ? 1 : 0} transform={"translate(" + tx + " " + ty + ") rotate(" + rt + ") scale(" + sc + ")"}>
        <circle cx={3} cy={4} r={21} fill={shadow} />
        <circle cx={0} cy={0} r={21} fill={acc} stroke={ink} strokeWidth={3} />
        <path d="M -9 1 L -2.5 8 L 10 -7" fill="none" stroke={ink} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  });

  // ---------- scene B type ----------
  const aboutSc = interpolate(f, [101, 107, 112], [0.3, 1.08, 1], B7_CL);
  const aboutOp = interpolate(f, [101, 104], [0, 1], B7_CL);
  const tenSc = interpolate(f, [111, 116, 121], [0.3, 1.08, 1], B7_CL);
  const tenOp = interpolate(f, [111, 114], [0, 1], B7_CL);
  const minSc = interpolate(f, [127, 133, 138], [0.3, 1.08, 1], B7_CL);
  const minOp = interpolate(f, [127, 130], [0, 1], B7_CL);
  const ul = ce([131, 143], 0, 1, EO);

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const svgStyle = { position: "absolute", left: 0, top: 0, width: 980, height: 500, overflow: "visible" };
  const aboutStyle = { position: "absolute", left: 74, top: 84, fontFamily: props.hand, fontWeight: 700, fontSize: 62, lineHeight: 1, color: acc, opacity: aboutOp, transform: "rotate(-5deg) scale(" + aboutSc + ")", transformOrigin: "left center" };
  const rowStyle = { position: "absolute", left: 62, top: 150, display: "flex", alignItems: "baseline", gap: 18 };
  const tenStyle = { fontFamily: props.serif, fontWeight: 900, fontSize: 196, lineHeight: 1, color: ink, opacity: tenOp, transform: "scale(" + tenSc + ")", transformOrigin: "center bottom", display: "inline-block" };
  const minStyle = { fontFamily: props.serif, fontWeight: 900, fontSize: 116, lineHeight: 1, color: ink, opacity: minOp, transform: "scale(" + minSc + ")", transformOrigin: "left bottom", display: "inline-block" };

  const folderGroup = (
    <g transform={folderT} opacity={fOp2}>
      <path d="M 472 310 Q 472 300 482 300 H 488 V 288 Q 488 278 498 278 H 600 Q 610 278 613 288 L 617 300 H 872 Q 882 300 882 310 V 446 Q 882 456 872 456 H 482 Q 472 456 472 446 Z" fill={shadow} transform="translate(4 6)" />
      <path d="M 472 310 Q 472 300 482 300 H 488 V 288 Q 488 278 498 278 H 600 Q 610 278 613 288 L 617 300 H 872 Q 882 300 882 310 V 446 Q 882 456 872 456 H 482 Q 472 456 472 446 Z" fill={acc} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
      {B7_CARDS.map((c, i) => cardBody(c, i))}
      <path d="M 464 338 L 890 332 L 884 458 L 470 458 Z" fill={shadow} transform="translate(4 6)" />
      <path d="M 464 338 L 890 332 L 884 458 L 470 458 Z" fill={paper} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
      <g clipPath="url(#b07label)">
        <text x={677} y={412} textAnchor="middle" fontFamily={props.hand} fontWeight={700} fontSize={44} fill={ink}>old project files</text>
      </g>
      {tickBadges}
    </g>
  );

  const magT = "translate(" + cx + " " + cy + ") rotate(" + popRt + ") scale(" + popSc + ") translate(" + -cx + " " + -cy + ")";
  const sideP = b7polar(cx, cy, R, -45);

  return (
    <div style={rootStyle}>
      <svg viewBox="0 0 980 500" style={svgStyle}>
        <defs>
          <clipPath id="b07label">
            <rect x={490} y={360} width={labelW} height={80} />
          </clipPath>
          <clipPath id="b07lensclip">
            <circle cx={cx} cy={cy} r={R - 3} />
          </clipPath>
          <mask id="b07outside" maskUnits="userSpaceOnUse" x={-200} y={-200} width={1380} height={900}>
            <rect x={-200} y={-200} width={1380} height={900} fill="#fff" />
            <circle cx={cx} cy={cy} r={R} fill="#000" />
          </mask>
        </defs>

        {/* folder + cards */}
        {folderGroup}

        {/* magnifier / stopwatch */}
        <g transform={magT} opacity={popOp}>
          {/* side button */}
          {faceOn ? (
            <g transform={"translate(" + sideP[0] + " " + sideP[1] + ") rotate(-45) scale(" + sideSc + ")"}>
              <rect x={-11} y={-16} width={22} height={20} rx={4} fill={paper} stroke={ink} strokeWidth={3.5} />
            </g>
          ) : null}
          {/* handle / crown */}
          {hLen > 2 ? (
            <g transform={"translate(" + hx + " " + hy + ") rotate(" + hAng + ")"}>
              <rect x={4} y={-hW / 2 + 6} width={hLen} height={hW} rx={hW / 2.6} fill={shadow} />
              <rect x={0} y={-hW / 2} width={hLen} height={hW} rx={hW / 2.6} fill={paper} stroke={ink} strokeWidth={4} />
              <rect x={Math.max(0, hLen - 40)} y={-hW / 2} width={Math.min(40, hLen)} height={hW} rx={hW / 2.6} fill={acc} stroke={ink} strokeWidth={4} opacity={gripOp} />
              <g opacity={capOp} transform={"translate(" + hLen + " 0) scale(" + capSc + ")"}>
                <rect x={-2} y={-30} width={18} height={60} rx={7} fill={paper} stroke={ink} strokeWidth={4} />
              </g>
            </g>
          ) : null}
          {/* press action lines */}
          {pressLinesOp > 0 ? (
            <g opacity={Math.min(1, pressLinesOp)} stroke={ink} strokeWidth={3.5} strokeLinecap="round">
              <line x1={cx - 52} y1={cy - R - 40} x2={cx - 68} y2={cy - R - 52} />
              <line x1={cx + 52} y1={cy - R - 40} x2={cx + 68} y2={cy - R - 52} />
            </g>
          ) : null}
          {/* lens / face: offset shadow only outside the glass (a rim shadow), light glass tint, magnified copy */}
          <circle cx={cx + 5} cy={cy + 7} r={R} fill={shadow} mask="url(#b07outside)" />
          <circle cx={cx} cy={cy} r={R} fill={paper} fillOpacity={Math.min(1, lensFill)} />
          {magOn ? (
            <g clipPath="url(#b07lensclip)">
              <g transform={"translate(" + cx + " " + cy + ") scale(" + B7_MAG + ") translate(" + -cx + " " + -cy + ")"}>{folderGroup}</g>
            </g>
          ) : null}
          {faceOn ? <path d={b7wedge(cx, cy, 110, Math.min(sweep, 60))} fill={acc} fillOpacity={0.92} /> : null}
          {ticks}
          {nums}
          {faceOn ? (
            <text x={cx} y={cy + 56} textAnchor="middle" fontFamily={props.sans} fontWeight={800} fontSize={24} fill={ink} opacity={readOp} letterSpacing={1}>{readout}</text>
          ) : null}
          {/* speed arcs while sweeping */}
          {faceOn && speed > 1.5 && f < 112 ? (
            <g fill="none" stroke={ink} strokeLinecap="round" opacity={Math.min(1, speed / 10) * (1 - interpolate(f, [110, 112], [0, 1], B7_CL))}>
              {sweep - 4 > 16 ? <path d={b7arc(cx, cy, R + 18, Math.max(14, sweep - 4 - speed * 2.2), sweep - 4)} strokeWidth={4} /> : null}
              {sweep - 8 > 18 ? <path d={b7arc(cx, cy, R + 30, Math.max(16, sweep - 8 - speed * 1.4), sweep - 8)} strokeWidth={3} /> : null}
            </g>
          ) : null}
          {/* burst at 10 */}
          {burstDraw > 0 && burstOut < 1 ? (
            <g stroke={ink} strokeWidth={4} strokeLinecap="round" opacity={1 - burstOut}>
              {[-14, 0, 14].map((d, i) => {
                const p0 = b7polar(cx, cy, R + 16 + 24 * burstOut, 60 + d);
                const p1 = b7polar(cx, cy, R + 16 + 22 * burstDraw + 10 * burstOut, 60 + d);
                return <line key={"b" + i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} />;
              })}
            </g>
          ) : null}
          {/* hand */}
          {faceOn ? (
            <g opacity={handOp}>
              <line x1={handTail[0]} y1={handTail[1]} x2={handTip[0]} y2={handTip[1]} stroke={ink} strokeWidth={7} strokeLinecap="round" />
            </g>
          ) : null}
          {/* glare */}
          <g opacity={glareOp} fill="none" stroke={gold} strokeWidth={7} strokeLinecap="round">
            <path d={b7arc(cx, cy, R * 0.68, 285, 330)} />
            <path d={b7arc(cx, cy, R * 0.68, 268, 276)} />
          </g>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={ink} strokeWidth={7} />
          {faceOn ? <circle cx={cx} cy={cy} r={sparkS * 0.55} fill={paper} opacity={handOp} /> : null}
          {sparkVis > 0.04 ? b7spark(cx, cy, sparkS, sparkW, acc) : null}
        </g>
      </svg>

      {/* scene B type */}
      <div style={aboutStyle}>about</div>
      <div style={rowStyle}>
        <span style={tenStyle}>10</span>
        <span style={minStyle}>MIN</span>
      </div>
      <svg viewBox="0 0 980 500" style={svgStyle}>
        <path d="M 70 392 Q 212 378 352 388 T 584 382" pathLength={1} fill="none" stroke={acc} strokeWidth={13} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - ul} opacity={ul > 0 ? 1 : 0} />
      </svg>
    </div>
  );
};
