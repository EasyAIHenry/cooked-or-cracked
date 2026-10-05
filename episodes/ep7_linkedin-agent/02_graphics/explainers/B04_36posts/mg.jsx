// B04 "So 36 posts in 30 days, Claude wrote them. Buffer is the app that I'm using, posted them." 980x500, 163 f @30.
// A  (f0-50): the counter rolls to 36 while 36 mini post cards pop into a grid; "posts"; "in 30 days" chip with a MAY
//    calendar glyph (ties back to B03). Full state holds f38-44.
// B  (f44-80, camera 1.6x on Claude): the grid cards fly together and BECOME Claude's stack (they blank out in flight,
//    the last one lands as the top card ~f56). Claude's pencil writes the top post; on "them" a 36 badge stamps it.
// C1 (f79-126, camera pans right to Buffer at 1.84x): the stack rides along arrow 1 (drawn as its trail) and drops into
//    Buffer's queue; Mon/Tue/Wed rows are dealt from it; a hand cursor slides in and taps Schedule on "I'm".
// C2 (f126-163): camera pulls back to the full pipeline Claude -> Buffer -> LinkedIn; LinkedIn pops; on "posted" three
//    posts fly along arrow 2 and tuck behind the LinkedIn tile (peeking out of its top); on "them" the 36 badge hops
//    onto LinkedIn. Final state still from f153.
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const ez = (e) => ({ extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const lerp = (a, b, t) => a + (b - a) * t;
const pop = (f, t0, d) => {
  const dd = d || 12;
  if (f < t0) return 0;
  const a = t0 + Math.round(dd * 0.55);
  if (f <= a) return interpolate(f, [t0, a], [0.3, 1.08], ez(Easing.out(Easing.cubic)));
  return interpolate(f, [a, t0 + dd], [1.08, 1], ez(Easing.inOut(Easing.quad)));
};
const pOut = (f, a, b) => interpolate(f, [a, b], [0, 1], ez(Easing.out(Easing.cubic)));
const pIn = (f, a, b) => interpolate(f, [a, b], [0, 1], ez(Easing.in(Easing.cubic)));
const pInOut = (f, a, b) => interpolate(f, [a, b], [0, 1], ez(Easing.inOut(Easing.cubic)));
const mix = (a, b) => Object.assign({}, a, b);
const wavy = (x0, x1, y, amp, step) => {
  let d = "M" + x0 + " " + y;
  let up = true;
  for (let x = x0; x < x1; x += step) {
    const xe = Math.min(x + step, x1);
    d += " Q" + (x + xe) / 2 + " " + (y + (up ? -amp : amp)) + " " + xe + " " + y;
    up = !up;
  }
  return d;
};

// ---------- world layout (camera zoom 1 = canvas) ----------
const ST_Y = 128;     // top of the three stations
const ST_H = 176;
const MID_Y = 216;
const CL_X = 36;      // Claude tile 176x176
const BF_X = 385;     // Buffer window 210x176
const LI_X = 768;     // LinkedIn tile 176x176
const BF_ROT = 1.5;
const CARD_CX = 290;  // Claude's stack: top card 110x135 (a 44x54 post at 2.5x), centre (290, MID_Y)
const CAM0 = [1.6, 208, 258];   // [zoom, focus x, focus y]: Claude + stack
const CAM1 = [1.84, 490, 226];  // Buffer window
const CAM2 = [1, 490, 250];     // whole pipeline
const GATHER = [490 + (CARD_CX - CAM0[1]) * CAM0[0], 250 + (MID_Y - CAM0[2]) * CAM0[0]];
const GS = (i) => 44 + (35 - i) * 0.12;   // gather start per grid card (8 frames each)
// a point in Buffer-window coords (210x176, top-left of the window) -> world, with the window's tilt
const winPt = (px, py) => {
  const a = BF_ROT * Math.PI / 180;
  const dx = px - 105;
  const dy = py - 88;
  return [BF_X + 105 + dx * Math.cos(a) - dy * Math.sin(a), ST_Y + 88 + dx * Math.sin(a) + dy * Math.cos(a)];
};
const PEEK = [[LI_X + 47, ST_Y + 8, -9], [LI_X + 58, ST_Y + 2, -2], [LI_X + 69, ST_Y + 7, 6]];
// shared Claude mark (B01/B06 RAYS + B06 Spark): 12 rays, stroke 11 in a 100 box, round caps
const RAYS = [[0, 45], [31, 37], [62, 46], [92, 38], [121, 45], [152, 36], [182, 46], [211, 37], [242, 45], [271, 37], [302, 46], [331, 38]];
const Spark = ({ size, color, sw, rot }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", transform: "rotate(" + rot + "deg)" }}>
    {RAYS.map(([a, L], i) => {
      const r = (a * Math.PI) / 180;
      return <line key={i} x1={50 + Math.cos(r) * 7} y1={50 + Math.sin(r) * 7} x2={50 + Math.cos(r) * L} y2={50 + Math.sin(r) * L} stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    })}
  </svg>
);
const L1 = wavy(7, 37, 20.5, 0.95, 2.4);
const L2 = wavy(7, 37, 26, 0.95, 2.4);
const L3 = wavy(7, 25, 31.5, 0.95, 2.4);

// mini post card drawn in a 44x54 box; w = rendered width, sw = outline width in rendered px, blank fades the body
const MiniPost = ({ ink, paper, accent, gold, v, w, sw, blank }) => {
  const u = sw * 44 / w;
  const fill = v === 0 ? accent : v === 2 ? gold : ink;
  const fo = v === 3 ? 0.16 : 1;
  return <svg viewBox="0 0 44 54" width={w} height={w * 54 / 44} style={{ display: "block", overflow: "visible" }}>
    <rect x="1" y="1" width="42" height="52" rx="5" fill={paper} stroke={ink} strokeWidth={u} />
    <circle cx="9.5" cy="10" r="4" fill={accent} />
    <path d="M17 8.5 H35 M17 13 H28" stroke={ink} strokeWidth={u} strokeLinecap="round" opacity="0.75" />
    <g opacity={1 - blank}>
      <path d="M7 21 H37 M7 26.5 H30" stroke={ink} strokeWidth={u} strokeLinecap="round" opacity="0.4" />
      <rect x="7" y="33" width="30" height="14" rx="2.5" fill={fill} fillOpacity={fo} />
    </g>
  </svg>;
};

const Component = ({ item }) => {
  const f = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const accent = props.accent;
  const gold = props.gold;
  const shadow = "4px 6px 0 rgba(23,20,17,0.22)";
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };

  // ---------- camera ----------
  const late = f >= 126;
  const camA = late ? CAM1 : CAM0;
  const camB = late ? CAM2 : CAM1;
  const ctx = late ? pInOut(f, 126, 134) : pInOut(f, 79, 96);
  const ctz = late ? pInOut(f, 126, 134) : pInOut(f, 86, 97);
  const zoom = lerp(camA[0], camB[0], ctz);
  const fx = lerp(camA[1], camB[1], ctx);
  const fy = lerp(camA[2], camB[2], ctz);
  const worldStyle = { position: "absolute", left: 0, top: 0, width: 980, height: 500, transformOrigin: "0 0", transform: "translate(" + (490 - fx * zoom) + "px," + (250 - fy * zoom) + "px) scale(" + zoom + ")" };

  // ---------- scene A: counter + grid ----------
  const cardT = (i) => 3 + i * 0.5;
  const count = f < 3 ? 0 : Math.min(36, Math.floor((f - 3) / 0.5) + 1);
  const aScale = interpolate(f, [44, 48], [1, 0], ez(Easing.in(Easing.quad)));
  const aTx = interpolate(f, [44, 48], [0, -150], ez(Easing.in(Easing.quad)));
  const aOp = f < 48 ? 1 : 0;
  const numS = pop(f, 2, 12);
  const postsS = pop(f, 13, 12);
  const chipS = pop(f, 26, 10);
  const grid = [];
  for (let i = 0; i < 36; i++) {
    const r = Math.floor(i / 6);
    const c = i % 6;
    const gx = 543 + c * 54;
    const gy = 63 + r * 64;
    const rot = (random("rot" + i) - 0.5) * 7;
    const rv = random("v" + i);
    const v = i === 20 ? 2 : rv < 0.45 ? 0 : rv < 0.75 ? 3 : 1;   // orange / grey / ink, one gold
    const t0 = cardT(i);
    const s = f < t0 ? 0 : interpolate(f, [t0, t0 + 4, t0 + 7], [0.3, 1.12, 1], ez(Easing.out(Easing.quad)));
    const dy = f < t0 ? 0 : interpolate(f, [t0, t0 + 4], [-14, 0], ez(Easing.out(Easing.cubic)));
    const g = pInOut(f, GS(i), GS(i) + 8);
    if (s === 0 || g >= 1) continue;
    const cx = lerp(gx + 22, GATHER[0], g);
    const cy = lerp(gy + 27, GATHER[1], g) + dy;
    const ww = lerp(44, 176, g);
    const hh = ww * 54 / 44;
    const rr = lerp(rot, -2, g);
    grid.push(<div key={"g" + i} style={{ position: "absolute", left: cx - ww / 2, top: cy - hh / 2, width: ww, height: hh, borderRadius: ww * 0.11, boxShadow: "2px 3px 0 rgba(23,20,17," + (0.22 * (1 - g)) + ")", transform: "rotate(" + rr + "deg) scale(" + s + ")" }}>
      <MiniPost ink={ink} paper={paper} accent={accent} gold={gold} v={v} w={ww} sw={lerp(2, 4.8, g)} blank={Math.min(1, g * 1.4)} />
    </div>);
  }

  // ---------- scene B: Claude + the stack the grid becomes ----------
  const clS = pop(f, 48, 12);
  const clName = pop(f, 49, 11);
  const clRole = pop(f, 60, 11);
  const sparkRot = interpolate(f, [58, 76], [0, 72], ez(Easing.inOut(Easing.quad)));
  let landed = 0;
  for (let i = 0; i < 36; i++) if (f >= GS(i) + 8) landed++;
  const spread = landed <= 1 ? 0 : Math.sqrt(Math.min(1, (landed - 1) / 35));
  const w1 = interpolate(f, [60, 64], [0, 1], CLAMP);
  const w2 = interpolate(f, [64, 67], [0, 1], CLAMP);
  const w3 = interpolate(f, [67, 70], [0, 1], CLAMP);
  const wi = interpolate(f, [70, 74], [0, 1], CLAMP);
  // stack rides along arrow 1 and drops into Buffer's first queue row
  const trav = pInOut(f, 83, 99);
  const rowEnd = winPt(25, 59.25);
  const stX = lerp(CARD_CX, rowEnd[0], trav);
  const stY = lerp(MID_Y, rowEnd[1], pInOut(f, 90, 99));
  const stSc = trav < 0.6 ? lerp(1, 0.8, trav / 0.6) : lerp(0.8, 0.18, Math.pow((trav - 0.6) / 0.4, 2));
  const stRot = lerp(-2, BF_ROT, trav);
  const stOn = landed > 0 && f < 99;
  const arrP1 = f >= 99 ? 1 : f < 83 ? 0 : Math.max(0, Math.min(1, (stX - 55 * stSc - 236) / 133));
  const toWorldCard = (x, y) => {
    const a = -2 * Math.PI / 180;
    const dx = (x - 22) * 2.5;
    const dy = (y - 27) * 2.5;
    return [CARD_CX + dx * Math.cos(a) - dy * Math.sin(a), MID_Y + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  let pen = null;
  if (f >= 56 && f < 81) {
    let tip;
    const lineTip = (x0, x1, y, p) => toWorldCard(lerp(x0, x1, p), y + Math.sin(p * Math.PI * 7) * 0.65);
    if (f < 60) {
      const p = pOut(f, 56, 60);
      const st = [CL_X + 88, ST_Y + 88];
      const en = toWorldCard(7, 20.5);
      tip = [lerp(st[0], en[0], p), lerp(st[1], en[1], p) - Math.sin(p * Math.PI) * 30];
    } else if (f < 64) tip = lineTip(7, 37, 20.5, w1);
    else if (f < 67) tip = lineTip(7, 37, 26, w2);
    else if (f < 70) tip = lineTip(7, 25, 31.5, w3);
    else if (f < 75) tip = toWorldCard(7 + 30 * wi, 41 + 4.5 * Math.sin(wi * Math.PI * 5));
    else tip = toWorldCard(37, 41);
    const ex = pOut(f, 75, 80);
    const ps = (f < 60 ? lerp(0.5, 1, pOut(f, 56, 60)) : 1) * (1 - ex);
    pen = <svg width="1" height="1" style={{ position: "absolute", left: tip[0] + ex * 24, top: tip[1] - ex * 24, overflow: "visible" }}>
      <g transform={"scale(" + ps + ") rotate(-38)"}>
        <polygon points="0,0 15,-7.5 15,7.5" fill={paper} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        <polygon points="0,0 5.5,-2.8 5.5,2.8" fill={ink} />
        <rect x="15" y="-7.5" width="44" height="15" fill={accent} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M17 -2.5 H57" stroke={ink} strokeWidth="1.6" opacity="0.35" />
        <rect x="59" y="-7.5" width="11" height="15" rx="3" fill={gold} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
      </g>
    </svg>;
  }

  // ---------- the 36 badge: stamps the stack, rides to Buffer's corner, hops onto LinkedIn ----------
  const bP0 = [CARD_CX + 52, MID_Y - 44];
  const bP1 = winPt(205, 5);
  const bP2 = [LI_X + 138, ST_Y];
  const bt2 = pInOut(f, 142, 149);
  const sa = (stRot + 0) * Math.PI / 180;
  let bx = stX + (52 * Math.cos(sa) + 44 * Math.sin(sa)) * stSc;
  let by = stY + (52 * Math.sin(sa) - 44 * Math.cos(sa)) * stSc;
  let bD = 72 * stSc;
  let bPop = f >= 99 ? 0 : 1;
  if (f >= 100) {
    bx = bP1[0];
    by = bP1[1];
    bD = 54;
    bPop = pop(f, 100, 10);
  }
  if (f >= 142) {
    bx = lerp(bP1[0], bP2[0], bt2);
    by = lerp(bP1[1], bP2[1], bt2) - Math.sin(bt2 * Math.PI) * 46;
    bD = lerp(54, 96, bt2);
  }
  const stamp1 = f < 70 ? 0 : interpolate(f, [70, 74, 78], [1.45, 0.92, 1], ez(Easing.out(Easing.quad))) * bPop;
  const land2 = f < 149 ? 1 : interpolate(f, [149, 151, 153], [1.09, 0.97, 1], CLAMP);
  const bRot = f >= 142 ? interpolate(f, [142, 149, 151, 153], [-6, 6, -7, -5], CLAMP) : f >= 100 ? -6 : f < 70 ? 0 : interpolate(f, [70, 74, 78], [-18, 5, -6], CLAMP) + (stRot + 2);

  // ---------- scene C1: Buffer window, queue rows, hand cursor ----------
  const bfS = pop(f, 84, 12);
  const bfName = pop(f, 85, 11);
  const bfRole = pop(f, 134, 11);
  const rowS = [pop(f, 99, 8), pop(f, 102, 8), pop(f, 105, 8)];
  const days = ["Mon", "Tue", "Wed"];
  const handTip = winPt(183, 153);
  const hIn = interpolate(f, [108, 118], [0, 1], ez(Easing.out(Easing.quad)));
  const hOut = pIn(f, 125, 131);
  const hx = lerp(728, handTip[0], hIn) + 70 * hOut;
  const hy = lerp(252, handTip[1], hIn) - Math.sin(hIn * Math.PI) * 10 + 24 * hOut;
  const hOp = f < 108 ? 0 : Math.min(1, (f - 108) / 3) * (1 - hOut);
  const press = f < 118 ? 1 : interpolate(f, [118, 120, 123], [1, 0.84, 1], CLAMP);
  const tap = f < 120 ? 0 : interpolate(f, [120, 121, 124], [0, 1, 0], CLAMP);
  const btnOn = f >= 120;
  const ripple = pOut(f, 120, 129);

  // ---------- scene C2: LinkedIn + posts landing ----------
  const arr2 = pOut(f, 134, 141);
  const liS = pop(f, 133, 11);
  const liName = pop(f, 134, 10);
  const arrivals = [143, 146, 149];
  let liBump = 0;
  arrivals.forEach((a) => { if (f >= a) liBump += 0.05 * Math.max(0, 1 - (f - a) / 4); });
  const fly = [];
  const ticks = [];
  const departed = [];
  for (let k = 0; k < 3; k++) {
    const s0 = 135 + 3 * k;
    const t = pInOut(f, s0, s0 + 8);
    ticks.push(pop(f, s0 + 1, 9));
    departed.push(f >= s0);
    if (f >= s0) {
      const p0 = winPt(25, 59.25 + 30 * k);
      const c = [690, MID_Y + 6];
      const p2 = PEEK[k];
      const x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p2[0];
      const y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p2[1];
      const gw = Math.min(1, t / 0.35);
      const ww = lerp(20, 76, gw);
      const hh = ww * 54 / 44;
      fly.push(<div key={"fly" + k} style={{ position: "absolute", left: x - ww / 2, top: y - hh / 2, width: ww, height: hh, borderRadius: ww * 0.11, boxShadow: (3 * gw) + "px " + (4 * gw) + "px 0 rgba(23,20,17,0.22)", transform: "rotate(" + lerp(BF_ROT, p2[2], t) + "deg)" }}>
        <MiniPost ink={ink} paper={paper} accent={accent} gold={gold} v={k === 1 ? 1 : 0} w={ww} sw={lerp(1.2, 2.8, gw)} blank={0} />
      </div>);
    }
  }

  // ---------- styles ----------
  const tileStyle = (left, w, s, rot) => ({ position: "absolute", left: left, top: ST_Y, width: w, height: ST_H, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 22, boxShadow: shadow, transform: "rotate(" + rot + "deg) scale(" + s + ")", opacity: s > 0 ? 1 : 0 });
  const centred = { display: "flex", alignItems: "center", justifyContent: "center" };
  const nameStyle = (cx, s) => ({ position: "absolute", left: cx - 150, width: 300, top: ST_Y + ST_H + 12, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 40, lineHeight: 1, color: ink, transform: "scale(" + s + ")", opacity: s > 0 ? 1 : 0 });
  const roleStyle = (cx, s, rot) => ({ position: "absolute", left: cx - 150, width: 300, top: ST_Y + ST_H + 56, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 38, lineHeight: 1, color: accent, transform: "rotate(" + rot + "deg) scale(" + s + ")", opacity: s > 0 ? 1 : 0 });

  const a1 = "M236 " + MID_Y + " Q303 " + (MID_Y - 16) + " 369 " + MID_Y;
  const h1 = "M357 " + (MID_Y - 10) + " L371 " + MID_Y + " L358 " + (MID_Y + 10);
  const a2 = "M612 " + MID_Y + " Q684 " + (MID_Y - 16) + " 754 " + MID_Y;
  const h2 = "M742 " + (MID_Y - 10) + " L756 " + MID_Y + " L743 " + (MID_Y + 10);

  const stackSil = [[17, 15, 3], [11, 10, -1], [5, 5, 2]];

  return <div style={rootStyle}>
    <div style={worldStyle}>
      {/* arrows */}
      <svg width="980" height="500" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={a1} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" opacity={arrP1 > 0 ? 1 : 0} pathLength="100" strokeDasharray="100" strokeDashoffset={100 * (1 - arrP1)} />
        <path d={h1} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={arrP1 > 0.97 ? 1 : 0} />
        <path d={a2} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" opacity={arr2 > 0 ? 1 : 0} pathLength="100" strokeDasharray="100" strokeDashoffset={100 * (1 - arr2)} />
        <path d={h2} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={arr2 > 0.9 ? 1 : 0} />
      </svg>

      {/* Claude */}
      <div style={mix(tileStyle(CL_X, 176, clS, -2), centred)}>
        <Spark size={118} color={accent} sw={11} rot={sparkRot} />
      </div>
      <div style={nameStyle(CL_X + 88, clName)}>Claude</div>
      <div style={roleStyle(CL_X + 88, clRole, -3)}>writes</div>

      {/* Buffer window (drawn in its own 210x176 coords) */}
      <div style={{ position: "absolute", left: BF_X, top: ST_Y, width: 210, height: ST_H, borderRadius: 20, backgroundColor: paper, boxShadow: shadow, transform: "rotate(" + BF_ROT + "deg) scale(" + bfS + ")", opacity: bfS > 0 ? 1 : 0 }}>
        <svg width="210" height="176" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <rect x="1.5" y="1.5" width="207" height="173" rx="19" fill="none" stroke={ink} strokeWidth="3" />
          <g transform="translate(12 6.5) scale(1.15)">
            <path d="M12 2.6 L21.2 7.1 L12 11.6 L2.8 7.1 Z" fill={ink} stroke={ink} strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M3.2 11.6 L12 15.9 L20.8 11.6" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.2 16 L12 20.3 L20.8 16" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x="46" y="28" fontFamily={props.sans} fontWeight="800" fontSize="16" fill={ink}>Queue</text>
          <line x1="2" y1="40" x2="208" y2="40" stroke={ink} strokeWidth="2.5" />
          {[0, 1, 2].map((k) => <rect key={"slot" + k} x="11" y={46 + 30 * k} width="188" height="26" rx="6" fill="none" stroke={ink} strokeOpacity="0.22" strokeWidth="2" strokeDasharray="5 5" />)}
          <rect x={92 - tap * 2} y={140 - tap} width={104 + tap * 4} height={24 + tap * 2} rx="12" fill={btnOn ? accent : paper} stroke={ink} strokeWidth="2.5" />
          <text x="144" y="156.5" textAnchor="middle" fontFamily={props.sans} fontWeight="800" fontSize="13" fill={ink}>Schedule</text>
        </svg>
        {[0, 1, 2].map((k) => <div key={"row" + k} style={{ position: "absolute", left: 11, top: 46 + 30 * k, width: 188, height: 26, transform: "scale(" + rowS[k] + ")", transformOrigin: "30px 13px", opacity: rowS[k] > 0 ? 1 : 0 }}>
          <div style={{ position: "absolute", left: 34, top: 5, fontFamily: props.sans, fontWeight: 800, fontSize: 15, lineHeight: 1, color: ink }}>{days[k]}</div>
          <div style={{ position: "absolute", left: 78, top: 11, width: 98, height: 4, borderRadius: 2, backgroundColor: ink, opacity: 0.18 }} />
        </div>)}
        {[0, 1, 2].map((k) => {
          const on = k === 0 ? f >= 99 : f >= 98 + 3 * k;
          const py = k === 0 ? 47 : lerp(47, 47 + 30 * k, pOut(f, 98 + 3 * k, 103 + 3 * k));
          return <div key={"rp" + k} style={{ position: "absolute", left: 15, top: py, width: 20, height: 24.5, opacity: on && !departed[k] ? 1 : 0 }}>
            <MiniPost ink={ink} paper={paper} accent={accent} gold={gold} v={k === 1 ? 1 : 0} w={20} sw={1.2} blank={0} />
          </div>;
        })}
        {[0, 1, 2].map((k) => <svg key={"tk" + k} width="26" height="26" style={{ position: "absolute", left: 12, top: 46 + 30 * k, overflow: "visible", transform: "scale(" + ticks[k] + ")", opacity: ticks[k] > 0 ? 1 : 0 }}>
          <circle cx="13" cy="13" r="11" fill={accent} stroke={ink} strokeWidth="2.2" />
          <path d="M7.5 13.5 L11.5 17 L18.5 9" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>)}
      </div>
      <div style={nameStyle(BF_X + 105, bfName)}>Buffer</div>
      <div style={roleStyle(BF_X + 105, bfRole, 2)}>posts</div>

      {/* posts flying to LinkedIn: under the tile, so they tuck behind it and peek out of its top */}
      {fly}

      {/* LinkedIn */}
      <div style={mix(tileStyle(LI_X, 176, liS * (1 + liBump), -1.5), { backgroundColor: ink })}>
        <div style={{ position: "absolute", right: 21, bottom: 7, fontFamily: props.sans, fontWeight: 800, fontSize: 116, lineHeight: 1, letterSpacing: -4, color: paper }}>in</div>
      </div>
      <div style={nameStyle(LI_X + 88, liName)}>LinkedIn</div>

      {/* Claude's stack: the gathered grid cards; rides arrow 1 into Buffer */}
      <div style={{ position: "absolute", left: stX - 55, top: stY - 67.5, width: 110, height: 135, opacity: stOn ? 1 : 0, transform: "rotate(" + (stRot + 2) + "deg) scale(" + stSc + ")" }}>
        {stackSil.map((o, i) => <div key={"sil" + i} style={{ position: "absolute", left: o[0] * spread, top: o[1] * spread, width: 110, height: 135, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 12.5, transform: "rotate(" + (o[2] * spread - 2) + "deg)", boxShadow: i === 0 ? shadow : "none" }} />)}
        <svg viewBox="0 0 44 54" width="110" height="135" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: "rotate(-2deg)" }}>
          <rect x="1" y="1" width="42" height="52" rx="5" fill={paper} stroke={ink} strokeWidth="1.2" />
          <circle cx="9.5" cy="10" r="4" fill={accent} />
          <path d="M17 8.5 H35 M17 13 H28" stroke={ink} strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
          <path d={L1} fill="none" stroke={ink} strokeWidth="1.2" strokeLinecap="round" opacity={w1 > 0 ? 0.7 : 0} pathLength="100" strokeDasharray="100" strokeDashoffset={100 * (1 - w1)} />
          <path d={L2} fill="none" stroke={ink} strokeWidth="1.2" strokeLinecap="round" opacity={w2 > 0 ? 0.7 : 0} pathLength="100" strokeDasharray="100" strokeDashoffset={100 * (1 - w2)} />
          <path d={L3} fill="none" stroke={ink} strokeWidth="1.2" strokeLinecap="round" opacity={w3 > 0 ? 0.7 : 0} pathLength="100" strokeDasharray="100" strokeDashoffset={100 * (1 - w3)} />
          <rect x="7" y="35" width={30 * wi} height="12" rx="1.5" fill={accent} />
        </svg>
      </div>
      {pen}

      {/* hand cursor (Henry using the app) */}
      <svg width="1" height="1" style={{ position: "absolute", left: handTip[0], top: handTip[1], overflow: "visible", opacity: f >= 120 ? 1 - ripple : 0 }}>
        <circle cx="0" cy="0" r={6 + ripple * 26} fill="none" stroke={accent} strokeWidth="3" />
      </svg>
      <div style={{ position: "absolute", left: hx - 15, top: hy - 2.4, width: 42, height: 48, opacity: hOp, transform: "rotate(-22deg) scale(" + press + ")", transformOrigin: "15px 2.4px", filter: "drop-shadow(2px 2.5px 0 rgba(23,20,17,0.25))" }}>
        <svg viewBox="0 0 28 32" width="42" height="48" style={{ display: "block", overflow: "visible" }}>
          <path d="M8 18.5 L8 3.8 A2.2 2.2 0 0 1 12.4 3.8 L12.4 13 A2.2 2.2 0 0 1 16.8 13 L16.8 14.2 A2.2 2.2 0 0 1 21.2 14.2 L21.2 15.6 A2.2 2.2 0 0 1 25.6 15.6 L25.6 22 Q25.6 30.5 17.5 30.5 L14 30.5 Q10.5 30.5 8.6 27.6 L3.4 20.6 A2.1 2.1 0 0 1 6.6 18 Z" fill={paper} stroke={ink} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12.4 13 V18 M16.8 14.2 V18.6 M21.2 15.6 V19.2" fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>

      {/* the 36 badge */}
      <div style={{ position: "absolute", left: bx - 48, top: by - 48, width: 96, height: 96, boxSizing: "border-box", borderRadius: 48, backgroundColor: accent, border: "3.5px solid " + ink, boxShadow: "3px 4px 0 rgba(23,20,17,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 48, lineHeight: 1, color: ink, opacity: stamp1 > 0 ? 1 : 0, transform: "rotate(" + bRot + "deg) scale(" + (bD / 96 * stamp1 * land2) + ")" }}>36</div>
    </div>

    {/* scene A grid cards: above the world, so each arriving card lands on top and becomes the stack */}
    {grid}

    {/* scene A text */}
    <div style={{ position: "absolute", left: 120, top: 0, width: 360, height: 500, opacity: aOp, transform: "translateX(" + aTx + "px) scale(" + aScale + ")", transformOrigin: "180px 230px" }}>
      <div style={{ position: "absolute", left: 0, width: 360, top: 38, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 250, lineHeight: 1, color: ink, fontVariantNumeric: "tabular-nums", transform: "scale(" + numS + ")", opacity: numS > 0 ? 1 : 0 }}>{count}</div>
      <div style={{ position: "absolute", left: 0, width: 360, top: 262, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 86, lineHeight: 1, color: accent, transform: "rotate(-3deg) scale(" + postsS + ")", opacity: postsS > 0 ? 1 : 0 }}>posts</div>
      <div style={{ position: "absolute", left: 18, width: 324, top: 366, height: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 14, boxShadow: shadow, transform: "rotate(-2deg) scale(" + chipS + ")", opacity: chipS > 0 ? 1 : 0 }}>
        <svg viewBox="0 0 50 52" width="50" height="52" style={{ display: "block", overflow: "visible" }}>
          <rect x="2" y="6" width="46" height="44" rx="7" fill={paper} />
          <path d="M2 20 V13 A7 7 0 0 1 9 6 H41 A7 7 0 0 1 48 13 V20 Z" fill={accent} />
          <rect x="2" y="6" width="46" height="44" rx="7" fill="none" stroke={ink} strokeWidth="3" />
          <line x1="2" y1="20" x2="48" y2="20" stroke={ink} strokeWidth="2.5" />
          <line x1="15" y1="2" x2="15" y2="10" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="35" y1="2" x2="35" y2="10" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
          <text x="25" y="17.5" textAnchor="middle" fontFamily={props.sans} fontWeight="800" fontSize="9" fill={ink}>MAY</text>
          {[0, 1, 2, 3, 4, 5].map((d) => <circle key={"d" + d} cx={13 + (d % 3) * 12} cy={29 + Math.floor(d / 3) * 11} r="2.6" fill={ink} opacity="0.35" />)}
        </svg>
        <span style={{ fontFamily: props.hand, fontWeight: 700, fontSize: 40, lineHeight: 1, color: accent }}>in</span>
        <span style={{ fontFamily: props.serif, fontWeight: 900, fontSize: 44, lineHeight: 1, color: ink }}>30 days</span>
      </div>
    </div>
  </div>;
};
