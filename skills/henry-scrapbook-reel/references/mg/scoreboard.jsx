// Scoreboard — Cooked / Cracked checkboxes. Canvas 260x230, duration 100000000 (extend the asset before placing it on the whole video).
// Vertical paper card, two checkbox rows. Pops in, holds. At tickAt (frames from the item's start) a hand-drawn orange check draws into the chosen box and the row bumps.
// Props: serif "Fraunces", paper #FFFEFA, ink #171411, accent #DF825F, top "COOKED", bottom "CRACKED", tickAt 2000 (0-6000), tickTop false
// Placed: left wall for the whole video. Ep2: 220x195 at 40/790. Ep1: at 30/640. tickAt = verdict frame minus item start frame.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const op = interpolate(frame, [0, 4], [0, 1], clampBoth);
  const sc = interpolate(frame, [0, 8, 15], [0.4, 1.08, 1], clampBoth);
  const rt = interpolate(frame, [0, 8, 15], [-10, 1, -2], clampBoth);
  const t = frame - props.tickAt;
  const draw = interpolate(t, [0, 14], [0, 1], clampBoth);
  const dash = 60 * (1 - draw);
  const bump = interpolate(t, [0, 6, 14], [1, 1.12, 1], clampBoth);
  const tornClip = "polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center" };
  const cardStyle = { width: 250, padding: "14px 10px", backgroundColor: props.paper, backgroundImage: ruled, clipPath: tornClip, display: "flex", flexDirection: "column", gap: 12, opacity: op, transform: "rotate(" + rt + "deg) scale(" + sc + ")" };
  const rowBase = { display: "flex", alignItems: "center", gap: 10 };
  const topRow = { ...rowBase, transform: props.tickTop ? "scale(" + bump + ")" : "none" };
  const bottomRow = { ...rowBase, transform: props.tickTop ? "none" : "scale(" + bump + ")" };
  const boxStyle = { width: 40, height: 40, flexShrink: 0, border: "4px solid " + props.ink, borderRadius: 6, backgroundColor: props.paper, position: "relative" };
  const txtStyle = { fontFamily: props.serif, fontSize: 27, fontWeight: 900, letterSpacing: 0.5, color: props.ink, lineHeight: 1, whiteSpace: "nowrap" };
  const checkSvg = { position: "absolute", left: -6, top: -14, width: 52, height: 52 };
  const topDash = props.tickTop ? dash : 60;
  const botDash = props.tickTop ? 60 : dash;
  return <div style={rootStyle}>
    <div style={cardStyle}>
      <div style={topRow}><div style={boxStyle}><svg viewBox="0 0 40 40" style={checkSvg}><path d="M8 22 L17 31 L34 9" fill="none" stroke={props.accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={topDash} /></svg></div><div style={txtStyle}>{props.top}</div></div>
      <div style={bottomRow}><div style={boxStyle}><svg viewBox="0 0 40 40" style={checkSvg}><path d="M8 22 L17 31 L34 9" fill="none" stroke={props.accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={botDash} /></svg></div><div style={txtStyle}>{props.bottom}</div></div>
    </div>
  </div>;
};
