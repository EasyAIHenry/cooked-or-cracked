// Pill caption — Cooked or Cracked?. Canvas 700x150, 6 s.
// White rounded pill, Inter 800 ink text, pops with a small overshoot and holds. Reaction opener only, top centre, until the reviewed-reel window closes.
// Props: text "Cooked or Cracked?", ink #171411, paper #FFFFFF
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const op = interpolate(frame, [0, 4], [0, 1], clampBoth);
  const sc = interpolate(frame, [0, 7, 13], [0.3, 1.08, 1], clampBoth);
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center" };
  const pillStyle = { backgroundColor: props.paper, color: props.ink, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontWeight: 800, fontSize: 54, lineHeight: 1, padding: "26px 44px", borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,0.25)", whiteSpace: "nowrap", opacity: op, transform: "scale(" + sc + ")" };
  return <div style={rootStyle}><div style={pillStyle}>{props.text}</div></div>;
};
