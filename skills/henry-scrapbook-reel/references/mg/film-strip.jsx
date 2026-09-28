// Film strip — video → frames → 3D scroll. Canvas 560x330, ~6.4 s. Ep2 super, explains the scroll-scrubbed clip.
// "one video → frames" chip, then six numbered film frames of a cone being piped pop in one by one, an orange scroll highlight runs across them, then "= 3D SCROLL" tag.
// Props: serif "Fraunces", hand "Kalam", paper #FFFEFA, ink #171411, accent #DF825F, cellsAt 14, scrollAt 80, tagAt 150 (frames)
// The cone drawing inside each cell is in the code; swap the SVG for another product.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const cb = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const tornClip = "polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const ink = props.ink;
  const acc = props.accent;
  const opC = interpolate(frame, [0, 4], [0, 1], cb);
  const scC = interpolate(frame, [0, 7, 13], [0.3, 1.1, 1], cb);
  const stripOp = interpolate(frame, [props.cellsAt - 6, props.cellsAt], [0, 1], cb);
  const stripSc = interpolate(frame, [props.cellsAt - 6, props.cellsAt + 2, props.cellsAt + 8], [0.6, 1.04, 1], cb);
  const cellW = 78;
  const cells = [0, 1, 2, 3, 4, 5].map((i) => {
    const t = frame - (props.cellsAt + i * 8);
    const op = interpolate(t, [0, 3], [0, 1], cb);
    const sc = interpolate(t, [0, 5, 10], [0.3, 1.12, 1], cb);
    const fill = (i + 1) / 6;
    const swirlH = 34 * fill;
    return <div key={i} style={{ position: "absolute", left: 22 + i * (cellW + 6), top: 22, width: cellW, height: 118, backgroundColor: "#EAF3F8", borderRadius: 4, opacity: op, transform: "scale(" + sc + ")", overflow: "hidden" }}>
      <svg viewBox="0 0 78 118" style={{ width: 78, height: 118 }}>
        <path d={"M39 0 V" + (60 - swirlH)} stroke="#F1E9DA" strokeWidth="5" />
        <ellipse cx="39" cy={62 - swirlH / 2} rx={6 + 12 * fill} ry={swirlH / 2 + 2} fill="#FFF9EE" stroke="#E9DCC6" strokeWidth="1.5" />
        <path d="M24 62 L39 104 L54 62 Z" fill="#E0A45B" stroke="#B87A34" strokeWidth="1.5" />
        <path d="M28 70 L50 70 M31 79 L47 79 M34 88 L44 88" stroke="#B87A34" strokeWidth="1.2" />
      </svg>
      <div style={{ position: "absolute", left: 4, bottom: 2, fontFamily: props.serif, fontWeight: 900, fontSize: 16, color: ink }}>{"0" + (i + 1)}</div>
    </div>;
  });
  const holes = [];
  for (let k = 0; k < 17; k++) {
    holes.push(<div key={"t" + k} style={{ position: "absolute", left: 14 + k * 30, top: 6, width: 16, height: 9, borderRadius: 2, backgroundColor: props.paper }} />);
    holes.push(<div key={"b" + k} style={{ position: "absolute", left: 14 + k * 30, top: 147, width: 16, height: 9, borderRadius: 2, backgroundColor: props.paper }} />);
  }
  const sp = interpolate(frame, [props.scrollAt, props.scrollAt + 60], [0, 5], cb);
  const hlOp = interpolate(frame, [props.scrollAt - 2, props.scrollAt + 2], [0, 1], cb);
  const hlLeft = 22 + sp * (cellW + 6) - 5;
  const tg = frame - props.tagAt;
  const opT = interpolate(tg, [0, 4], [0, 1], cb);
  const scT = interpolate(tg, [0, 7, 13], [0.2, 1.1, 1], cb);
  const rtT = interpolate(tg, [0, 7, 13], [-12, 1, -2], cb);
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent" };
  return <div style={rootStyle}>
    <div style={{ position: "absolute", left: 10, top: 0, fontFamily: props.hand, fontWeight: 700, fontSize: 38, lineHeight: 1.2, color: ink, backgroundColor: props.paper, padding: "2px 20px", clipPath: tornClip, opacity: opC, transform: "rotate(-2deg) scale(" + scC + ")", transformOrigin: "left center" }}>one video <span style={{ color: acc }}>{"→"}</span> frames</div>
    <div style={{ position: "absolute", left: 10, top: 64, width: 540, height: 162, backgroundColor: ink, borderRadius: 8, opacity: stripOp, transform: "rotate(1deg) scale(" + stripSc + ")", boxShadow: "4px 5px 0 rgba(23,20,17,0.3)" }}>
      {holes}
      {cells}
      <div style={{ position: "absolute", left: hlLeft, top: 17, width: cellW + 10, height: 128, border: "5px solid " + acc, borderRadius: 6, opacity: hlOp, boxSizing: "border-box" }} />
    </div>
    <div style={{ position: "absolute", right: 14, top: 236, fontFamily: props.serif, fontWeight: 900, fontSize: 62, lineHeight: 1.1, color: ink, backgroundColor: props.paper, backgroundImage: ruled, padding: "0px 26px", clipPath: tornClip, whiteSpace: "nowrap", opacity: opT, transform: "rotate(" + rtT + "deg) scale(" + scT + ")" }}>= 3D <span style={{ color: acc }}>SCROLL</span></div>
  </div>;
};
