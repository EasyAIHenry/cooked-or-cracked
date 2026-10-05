const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const s = spring({ frame: frame - 5, fps: 30, config: { damping: 14 } });
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center" };
  return <div style={rootStyle}><div style={{ transform: "scale(" + s + ")", fontFamily: props.serif, fontWeight: 900, fontSize: 90, color: props.ink }}>30 DAYS <span style={{ fontFamily: props.hand, color: props.accent, fontSize: 60 }}>no fail</span></div></div>;
};
