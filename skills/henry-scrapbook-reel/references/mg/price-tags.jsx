// Price tags — two torn paper tags. Canvas 1000x380, ~8.4 s. Ep2 super.
// Two paper price tags with string holes pop in on the spoken prices (p1, p2 frames), each with a Kalam note and orange underline. Second amount in accent.
// Props: serif "Fraunces", hand "Kalam", paper #FFFEFA, ink #171411, accent #DF825F, p1 50, p2 215 (frames), a1 "$1,000", n1 "the website", a2 "$250", n2 "/month upkeep"
// Placed: top zone. Mouse-click cue on each price.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const cb = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const tornClip = "polygon(8% 0%,100% 2%,99% 30%,100% 60%,98% 98%,60% 100%,30% 97%,8% 100%,0% 50%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const ink = props.ink;
  const acc = props.accent;
  const tagStyle = (d, rot, left) => {
    const t = frame - d;
    return { position: "absolute", left: left, top: 40, width: 440, height: 250, opacity: interpolate(t, [0, 4], [0, 1], cb), transform: "rotate(" + interpolate(t, [0, 7, 13], [rot * 6, -rot * 0.5, rot], cb) + "deg) scale(" + interpolate(t, [0, 7, 13], [0.3, 1.1, 1], cb) + ")" };
  };
  const draw = (d) => interpolate(frame, [d + 14, d + 30], [0, 1], cb);
  const Tag = (p) => <div style={tagStyle(p.d, p.rot, p.left)}>
    <div style={{ position: "absolute", inset: 0, backgroundColor: props.paper, backgroundImage: ruled, clipPath: tornClip, boxShadow: "4px 5px 0 rgba(23,20,17,0.3)" }} />
    <div style={{ position: "absolute", left: 22, top: 108, width: 22, height: 22, borderRadius: 11, border: "4px solid " + ink, boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: 60, right: 10, top: 26, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 110, lineHeight: 1, color: p.color }}>{p.amount}</div>
    <div style={{ position: "absolute", left: 60, right: 10, top: 150, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 42, color: ink }}>{p.note}</div>
    <svg viewBox="0 0 600 40" style={{ position: "absolute", left: 100, top: 196, width: 300, height: 24 }}>
      <path d="M18 24 Q160 8 300 20 T582 14" fill="none" stroke={acc} strokeWidth="13" strokeLinecap="round" strokeDasharray="640" strokeDashoffset={640 * (1 - draw(p.d))} />
    </svg>
  </div>;
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent" };
  return <div style={rootStyle}>
    <Tag d={props.p1} rot={-3} left={30} amount={props.a1} note={props.n1} color={ink} />
    <Tag d={props.p2} rot={3} left={530} amount={props.a2} note={props.n2} color={acc} />
  </div>;
};
