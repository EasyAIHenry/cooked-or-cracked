// Confetti burst — paper. Canvas 1080x1920 (full frame), 130 frames (4.33 s).
// 90 paper pieces in ink, accent, paper and gold burst up from the bottom centre, tumble under gravity, fade in the last 20 frames. Transparent background.
// Props: paper #FFFEFA, ink #171411, accent #DF825F, extra #F2C14E (the only place gold is used), count 90 (20-160)
// Placed: full frame, only when the verdict is CRACKED or a winner is declared. Table clears first. On a green-matte export it needs its own pass.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const fade = interpolate(frame, [105, 128], [1, 0], clampBoth);
  const colors = [props.ink, props.accent, props.paper, props.extra];
  const pieces = [];
  const n = props.count;
  for (let i = 0; i < n; i++) {
    const r1 = random("a" + i); const r2 = random("b" + i); const r3 = random("c" + i); const r4 = random("d" + i); const r5 = random("e" + i);
    const angle = -Math.PI / 2 + (r1 - 0.5) * 1.9;
    const speed = 26 + r2 * 30;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const delay = Math.floor(r5 * 10);
    const t = Math.max(0, frame - delay);
    const x = 540 + vx * t;
    const y = 1750 + vy * t + 0.55 * t * t;
    const rot = r3 * 360 + t * (6 + r4 * 10) * (r1 > 0.5 ? 1 : -1);
    const w = 16 + r4 * 18; const h = 10 + r2 * 22;
    const col = colors[i % 4];
    const isRound = r3 > 0.7;
    const st = { position: "absolute", left: x, top: y, width: w, height: h, backgroundColor: col, borderRadius: isRound ? w : 2, transform: "rotate(" + rot + "deg) scaleX(" + Math.cos(t * 0.25 + r2 * 6) + ")", opacity: t === 0 ? 0 : 1 };
    pieces.push(<div key={i} style={st} />);
  }
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden", opacity: fade };
  return <div style={rootStyle}>{pieces}</div>;
};
