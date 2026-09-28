// Jingle title — compact top (COOKED or CRACKED?). Canvas 1000x400, 2.5 s (75 frames).
// Two-row series title for the top safe zone: COOKED paper card, small OR ink badge, CRACKED? coral card, ink underline. Pops word by word on the sung sting beats.
// Props: word1 "COOKED", word2 "OR", word3 "CRACKED?", beat1 4, beat2 18, beat3 30 (frames), accent #DF825F
// Placed: top, y 140 (Ep1 v8) or 900x360 at 90/225 with beats 6/21/28 (Ep2), over the 2.6 s sting. Never on the face.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const paper = "#FFFEFA";
  const ink = "#171411";
  const tornClip = "polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const pop = (delay, baseRot) => {
    const t = frame - delay;
    return {
      opacity: interpolate(t, [0, 4], [0, 1], clampBoth),
      transform: "rotate(" + interpolate(t, [0, 7, 13], [baseRot * 6, -baseRot * 0.5, baseRot], clampBoth) + "deg) scale(" + interpolate(t, [0, 7, 13], [0.3, 1.1, 1], clampBoth) + ")",
    };
  };
  const p1 = pop(props.beat1, -2);
  const p2 = pop(props.beat2, 3);
  const p3 = pop(props.beat3, -1.5);
  const drawT = frame - (props.beat3 + 6);
  const draw = interpolate(drawT, [0, 16], [0, 1], clampBoth);
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent" };
  const cardBase = { position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", clipPath: tornClip, backgroundImage: ruled };
  const c1 = { ...cardBase, left: 60, top: 16, width: 560, height: 160, backgroundColor: paper, opacity: p1.opacity, transform: p1.transform };
  const c2 = { ...cardBase, left: 650, top: 44, width: 150, height: 104, backgroundColor: ink, backgroundImage: "none", opacity: p2.opacity, transform: p2.transform };
  const c3 = { ...cardBase, left: 120, top: 196, width: 800, height: 164, backgroundColor: props.accent, backgroundImage: "none", opacity: p3.opacity, transform: p3.transform };
  const word = (size, color) => ({ fontFamily: "Fraunces, Georgia, serif", fontWeight: 900, fontSize: size, color, letterSpacing: -2, lineHeight: 1, whiteSpace: "nowrap" });
  const svgStyle = { position: "absolute", left: 0, top: 362, width: 1000, height: 34 };
  return <div style={rootStyle}>
    <div style={c1}><div style={word(124, ink)}>{props.word1}</div></div>
    <div style={c2}><div style={word(78, paper)}>{props.word2}</div></div>
    <div style={c3}><div style={word(124, paper)}>{props.word3}</div></div>
    <svg viewBox="0 0 1000 34" style={svgStyle}><path d="M200 18 Q 420 4 640 16 T 860 10" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - draw)} /></svg>
  </div>;
};
