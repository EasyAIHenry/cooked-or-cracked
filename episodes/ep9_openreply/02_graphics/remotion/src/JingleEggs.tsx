// @ts-nocheck
// Egg jingle title (henry-scrapbook-reel references/mg/jingle-title-eggs.jsx), wrapped for Remotion.
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const paper = "#FFFEFA";
  const ink = "#171411";
  const accent = props.accent;
  const gold = props.gold;
  const goldDeep = "#C98A1B";
  const b1 = props.beat1, b2 = props.beat2, b3 = props.beat3;
  const tornClip = "polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const pop = (delay, baseRot) => {
    const t = frame - delay;
    return {
      opacity: interpolate(t, [0, 4], [0, 1], C),
      transform: "rotate(" + interpolate(t, [0, 7, 13], [baseRot * 6, -baseRot * 0.5, baseRot], C) + "deg) scale(" + interpolate(t, [0, 7, 13], [0.3, 1.1, 1], C) + ")",
    };
  };
  const p1 = pop(b1, -2), p2 = pop(b2, 3), p3 = pop(b3, -1.5);
  const root = { position: "absolute", inset: 0, backgroundColor: "transparent" };
  const cardBase = { position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", clipPath: tornClip, backgroundImage: ruled };
  const c1 = { ...cardBase, left: 230, top: 16, width: 460, height: 160, backgroundColor: paper, opacity: p1.opacity, transform: p1.transform };
  const c2 = { ...cardBase, left: 30, top: 226, width: 150, height: 104, backgroundColor: ink, backgroundImage: "none", opacity: p2.opacity, transform: p2.transform };
  const c3 = { ...cardBase, left: 200, top: 196, width: 580, height: 164, backgroundColor: accent, backgroundImage: "none", opacity: p3.opacity, transform: p3.transform };
  const word = (size, color) => ({ fontFamily: "Fraunces, Georgia, serif", fontWeight: 900, fontSize: size, color, letterSpacing: -2, lineHeight: 1, whiteSpace: "nowrap" });
  const panT = frame - b1;
  const panOp = interpolate(panT, [2, 7], [0, 1], C);
  const panScale = interpolate(panT, [2, 9, 15], [0.4, 1.08, 1], C);
  const burn = interpolate(frame, [b1 + 6, b2 + 6, b3 + 8], [0, 0.55, 1], C);
  const mix = (a, b, t) => {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    return "rgb(" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",") + ")";
  };
  const yolk = burn < 0.5 ? mix("#F2B33D", "#7A3C0C", burn * 2) : mix("#7A3C0C", "#1A120C", (burn - 0.5) * 2);
  const white = burn < 0.5 ? mix("#FFFFFF", "#C9A36A", burn * 2) : mix("#C9A36A", "#3A2A1A", (burn - 0.5) * 2);
  const smoke = (i) => {
    const t = frame - (b1 + 12) - i * 6;
    const rise = interpolate(t, [0, 30], [0, -80], C);
    const op = burn < 0.2 ? 0 : interpolate(t % 30, [0, 6, 24, 30], [0, 0.6, 0.4, 0], C) * interpolate(burn, [0.2, 0.6], [0, 1], C);
    return { rise, op };
  };
  const eggT = frame - b3;
  const dropY = interpolate(eggT, [0, 6], [-120, 0], { ...C, easing: (t) => t * t });
  const eggOp = interpolate(eggT, [0, 2], [0, 1], C);
  const crack = interpolate(eggT, [6, 10], [0, 1], C);
  const shellL = { x: interpolate(crack, [0, 1], [0, -26]), r: interpolate(crack, [0, 1], [0, -40]), y: interpolate(crack, [0, 1], [0, 12]) };
  const shellR = { x: interpolate(crack, [0, 1], [0, 28]), r: interpolate(crack, [0, 1], [0, 36]), y: interpolate(crack, [0, 1], [0, 10]) };
  const pour = interpolate(eggT, [7, 30], [0, 1], C);
  const pool = interpolate(eggT, [8, 34], [0, 1], C);
  const drip1 = interpolate(eggT, [10, 40], [0, 1], C), drip2 = interpolate(eggT, [14, 44], [0, 1], C), drip3 = interpolate(eggT, [12, 48], [0, 1], C);
  const spark = (i) => { const t = (frame - (b3 + 12) - i * 5) % 20; return interpolate(t, [0, 5, 10], [0, 1, 0], C) * (eggT > 12 ? 1 : 0); };
  const drawT = frame - (b3 + 6);
  const draw = interpolate(drawT, [0, 16], [0, 1], C);
  return <div style={root}>
    <div style={c1}><div style={word(104, ink)}>{props.word1}</div></div>
    <div style={c2}><div style={word(74, paper)}>{props.word2}</div></div>
    <div style={c3}><div style={word(100, paper)}>{props.word3}</div></div>
    <svg viewBox="0 0 200 200" style={{ position: "absolute", left: -10, top: -40, width: 300, height: 285, opacity: panOp, transform: "scale(" + panScale + ") rotate(-8deg)", transformOrigin: "50% 60%" }}>
      <path d="M150 112 L196 94" stroke={ink} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="96" cy="118" rx="74" ry="40" fill="#3A3A3A" stroke={ink} strokeWidth="6" />
      <ellipse cx="96" cy="112" rx="60" ry="30" fill="#5A5A5A" />
      <path d="M58 110 C 54 90, 86 82, 100 90 C 118 80, 146 94, 140 112 C 150 128, 118 140, 100 134 C 80 142, 54 130, 58 110 Z" fill={white} stroke={ink} strokeWidth="3" />
      <circle cx="100" cy="110" r="17" fill={yolk} stroke={ink} strokeWidth="3" />
      <circle cx="94" cy="104" r="4" fill="#FFF3C4" opacity={1 - burn} />
      {[0, 1, 2].map((i) => { const s = smoke(i); return <path key={i} d={"M" + (80 + i * 18) + " 84 c -10 -14 10 -20 0 -34 c -8 -12 8 -18 2 -30"} fill="none" stroke="#6B6B6B" strokeWidth="5" strokeLinecap="round" opacity={s.op} transform={"translate(0 " + s.rise + ")"} />; })}
    </svg>
    <svg viewBox="0 0 220 260" style={{ position: "absolute", left: 600, top: 50, width: 330, height: 390, opacity: p3.opacity }}>
      <defs>
        <linearGradient id="gld" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE38A" /><stop offset="0.6" stopColor={gold} /><stop offset="1" stopColor={goldDeep} /></linearGradient>
      </defs>
      <ellipse cx="106" cy="100" rx={74 * pool} ry={14 * pool} fill="url(#gld)" />
      <rect x="72" y="100" width="18" height={70 * drip1} rx="9" fill="url(#gld)" />
      <rect x="104" y="100" width="16" height={120 * drip2} rx="8" fill="url(#gld)" />
      <rect x="136" y="100" width="14" height={55 * drip3} rx="7" fill="url(#gld)" />
      <circle cx="112" cy={100 + 120 * drip2 + 6} r="10" fill={goldDeep} opacity={drip2} />
      <path d={"M98 " + (66 + dropY) + " q 10 " + (24 * pour) + " 14 " + (34 * pour)} stroke="url(#gld)" strokeWidth={16 * pour} strokeLinecap="round" fill="none" opacity={pour > 0 ? 1 : 0} />
      <g opacity={eggOp} transform={"translate(0 " + dropY + ")"}>
        <g transform={"translate(" + shellL.x + " " + shellL.y + ") rotate(" + shellL.r + " 96 66)"}>
          <path d="M72 66 C 72 30, 88 12, 104 12 C 112 12, 118 18, 122 28 L 112 44 L 100 32 L 92 52 L 80 46 L 76 66 Z" fill={paper} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        </g>
        <g transform={"translate(" + shellR.x + " " + shellR.y + ") rotate(" + shellR.r + " 110 66)"}>
          <path d="M76 66 L 80 46 L 92 52 L 100 32 L 112 44 L 122 28 C 130 38, 136 52, 136 66 C 136 88, 122 102, 106 102 C 90 102, 76 88, 76 66 Z" fill={paper} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        </g>
      </g>
      {[[36, 76], [192, 64], [172, 128], [52, 140]].map((p, i) => <path key={i} d={"M" + p[0] + " " + (p[1] - 12) + " l 4 8 l 8 4 l -8 4 l -4 8 l -4 -8 l -8 -4 l 8 -4 Z"} fill="#FFE38A" stroke={goldDeep} strokeWidth="1.5" opacity={spark(i)} />)}
    </svg>
    <svg viewBox="0 0 1000 34" style={{ position: "absolute", left: 0, top: 362, width: 1000, height: 34 }}><path d="M240 18 Q 420 4 600 16 T 760 10" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - draw)} /></svg>
  </div>;
};

export const JingleEggs = () => <Component item={{ props: { word1: 'COOKED', word2: 'OR', word3: 'CRACKED?', beat1: 6, beat2: 21, beat3: 28, accent: '#DF825F', gold: '#F2C14E' } }} />;
