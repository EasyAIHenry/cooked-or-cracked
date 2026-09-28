// Work split bar — 60 / 20 / 20. Canvas 1000x360, ~15.8 s. Ep2 super ("who does the work?").
// Torn paper card with a bar that fills in three segments on three frames (d1, d2, d3), each with a popped Kalam label and a big Fraunces number.
// Props: serif "Fraunces", hand "Kalam", paper #FFFEFA, ink #171411, accent #DF825F, d1 17, d2 150, d3 321 (frames), l1 "CLAUDE", l2 "HIGGSFIELD", l3 "YOU + OWNER"
// The 60/20/20 split and the "who does the work?" title are in the code; change them there for another split.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const cb = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const tornClip = "polygon(0% 3%,15% 0%,29% 3%,43% 1%,58% 3%,72% 0%,87% 2%,100% 1%,99% 98%,83% 100%,70% 97%,55% 100%,41% 97%,25% 99%,10% 97%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const ink = props.ink;
  const acc = props.accent;
  const opCard = interpolate(frame, [0, 4], [0, 1], cb);
  const scCard = interpolate(frame, [0, 7, 13], [0.3, 1.06, 1], cb);
  const rtCard = interpolate(frame, [0, 7, 13], [6, -1, 1], cb);
  const W = 880;
  const w1 = W * 0.6 * interpolate(frame, [props.d1, props.d1 + 14], [0, 1], cb);
  const w2 = W * 0.2 * interpolate(frame, [props.d2, props.d2 + 10], [0, 1], cb);
  const w3 = W * 0.2 * interpolate(frame, [props.d3, props.d3 + 10], [0, 1], cb);
  const tag = (d, rot) => { const t = frame - d; return { opacity: interpolate(t, [4, 8], [0, 1], cb), transform: "rotate(" + interpolate(t, [4, 11, 17], [rot * 6, -rot * 0.5, rot], cb) + "deg) scale(" + interpolate(t, [4, 11, 17], [0.3, 1.1, 1], cb) + ")" }; };
  const pct = (d, target) => Math.round(target * interpolate(frame, [d, d + 14], [0, 1], cb));
  const t1 = tag(props.d1, -2);
  const t2 = tag(props.d2, 2);
  const t3 = tag(props.d3, -2);
  const segLabel = { position: "absolute", top: 212, fontFamily: props.hand, fontWeight: 700, fontSize: 38, color: ink, whiteSpace: "nowrap", lineHeight: 1.1, textAlign: "center" };
  const bigNum = { fontFamily: props.serif, fontWeight: 900, fontSize: 44, lineHeight: 1 };
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent" };
  const card = { position: "absolute", left: 20, top: 10, width: 960, height: 330, backgroundColor: props.paper, backgroundImage: ruled, clipPath: tornClip, opacity: opCard, transform: "rotate(" + rtCard + "deg) scale(" + scCard + ")" };
  return <div style={rootStyle}>
    <div style={card}>
      <div style={{ position: "absolute", left: 40, top: 22, fontFamily: props.hand, fontWeight: 700, fontSize: 46, color: ink }}>who does the work?</div>
      <div style={{ position: "absolute", left: 40, top: 96, width: W, height: 100, border: "5px solid " + ink, borderRadius: 14, boxSizing: "border-box", overflow: "hidden", backgroundColor: "#F3EFE8" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w1, backgroundColor: ink }} />
        <div style={{ position: "absolute", left: W * 0.6, top: 0, bottom: 0, width: w2, backgroundColor: acc }} />
        <div style={{ position: "absolute", left: W * 0.8, top: 0, bottom: 0, width: w3, backgroundImage: "repeating-linear-gradient(45deg," + ink + " 0px," + ink + " 8px,transparent 8px,transparent 18px)" }} />
        <div style={{ position: "absolute", left: 24, top: 18, color: props.paper, ...bigNum, opacity: t1.opacity }}>{pct(props.d1, 60)}%</div>
        <div style={{ position: "absolute", left: W * 0.6 + 16, top: 18, color: ink, ...bigNum, opacity: t2.opacity }}>+{pct(props.d2, 20)}</div>
        <div style={{ position: "absolute", left: W * 0.8 + 16, top: 18, color: ink, ...bigNum, opacity: t3.opacity, backgroundColor: props.paper, padding: "0 6px" }}>{pct(props.d3, 20)}</div>
      </div>
      <div style={{ ...segLabel, left: 40, width: W * 0.6, ...t1 }}>{props.l1}</div>
      <div style={{ ...segLabel, left: 40 + W * 0.6 - 60, width: W * 0.2 + 120, color: acc, ...t2 }}>{props.l2}</div>
      <div style={{ ...segLabel, top: 258, left: 40 + W * 0.8 - 80, width: W * 0.2 + 80, ...t3 }}>{props.l3}</div>
    </div>
  </div>;
};
