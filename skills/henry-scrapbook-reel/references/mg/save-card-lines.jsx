// Save card — 12 lines, 12 effects (Ep4 v8, 1 Oct 2026). Canvas 940x430, 10 s. ChatCut motion-graphic (Remotion runtime).
// Save frame: torn ruled paper card, Fraunces title with an orange underline, Kalam receipt line, the lines in two numbered columns
// (Inter 700), Kalam footer "screenshot this · send it to your editor". The card pops in, rows pop in 2 frames apart, then it holds.
// Props: title, sub (receipt), lines ("a|b|c..."), footerA, footerB, serif "Fraunces", hand "Kalam", sans "Inter", paper, ink, accent.
// Placed: 940x430 at 70/220 for about 4 s before the verdict stamp (replaces a reaction stamp). Bubble pop on entrance.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const lines = String(props.lines).split("|");
  const half = Math.ceil(lines.length / 2);
  const cardOp = interpolate(frame, [0, 4], [0, 1], clampBoth);
  const cardSc = interpolate(frame, [0, 7, 13], [0.3, 1.06, 1], clampBoth);
  const cardRt = interpolate(frame, [0, 7, 13], [6, -2, -1], clampBoth);
  const draw = interpolate(frame, [10, 26], [0, 1], clampBoth);
  const dash = 560 * (1 - draw);
  const footSc = interpolate(frame, [36, 42, 48], [0.4, 1.08, 1], clampBoth);
  const footOp = interpolate(frame, [36, 39], [0, 1], clampBoth);
  const tornClip = "polygon(0% 2%,12% 0%,27% 2%,41% 0%,57% 2%,72% 0%,87% 2%,100% 0%,99% 98%,85% 100%,70% 98%,54% 100%,39% 98%,23% 100%,9% 98%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 33px,#E2DFDA 34px,transparent 35px)";
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center" };
  const cardStyle = { width: 900, padding: "22px 34px 20px 34px", backgroundColor: props.paper, backgroundImage: ruled, clipPath: tornClip, opacity: cardOp, transform: "rotate(" + cardRt + "deg) scale(" + cardSc + ")", display: "flex", flexDirection: "column", alignItems: "flex-start" };
  const titleStyle = { fontFamily: props.serif, fontWeight: 900, fontSize: 54, lineHeight: 1.04, letterSpacing: 1, color: props.ink };
  const subStyle = { fontFamily: props.hand, fontWeight: 700, fontSize: 32, lineHeight: 1.15, color: props.accent, marginTop: 2 };
  const gridStyle = { display: "flex", flexDirection: "row", width: "100%", marginTop: 10, gap: 20 };
  const colStyle = { display: "flex", flexDirection: "column", flex: 1 };
  const footStyle = { fontFamily: props.hand, fontWeight: 700, fontSize: 32, lineHeight: 1.15, color: props.ink, marginTop: 10, opacity: footOp, transform: "scale(" + footSc + ")", transformOrigin: "left center" };
  const accentSpan = { color: props.accent };
  const row = (text, idx) => {
    const t0 = 12 + idx * 2;
    const sc = interpolate(frame, [t0, t0 + 5, t0 + 9], [0.5, 1.06, 1], clampBoth);
    const op = interpolate(frame, [t0, t0 + 3], [0, 1], clampBoth);
    const rowStyle = { display: "flex", alignItems: "baseline", gap: 12, height: 36, opacity: op, transform: "scale(" + sc + ")", transformOrigin: "left center" };
    const numStyle = { fontFamily: props.serif, fontWeight: 900, fontSize: 28, color: props.accent, width: 38, textAlign: "right" };
    const txtStyle = { fontFamily: props.sans, fontWeight: 700, fontSize: 26, color: props.ink, whiteSpace: "nowrap" };
    return <div key={idx} style={rowStyle}><span style={numStyle}>{idx + 1}</span><span style={txtStyle}>{text}</span></div>;
  };
  const left = lines.slice(0, half).map((t, i) => row(t, i));
  const right = lines.slice(half).map((t, i) => row(t, i + half));
  return <div style={rootStyle}>
    <div style={cardStyle}>
      <div style={titleStyle}>{props.title}</div>
      <svg viewBox="0 0 560 22" style={{ width: 560, height: 22 }}>
        <path d="M8 14 Q150 4 280 12 T552 9" fill="none" stroke={props.accent} strokeWidth="9" strokeLinecap="round" strokeDasharray="560" strokeDashoffset={dash} />
      </svg>
      <div style={subStyle}>{props.sub}</div>
      <div style={gridStyle}>
        <div style={colStyle}>{left}</div>
        <div style={colStyle}>{right}</div>
      </div>
      <div style={footStyle}>{props.footerA}<span style={accentSpan}>{" · " + props.footerB}</span></div>
    </div>
  </div>;
};