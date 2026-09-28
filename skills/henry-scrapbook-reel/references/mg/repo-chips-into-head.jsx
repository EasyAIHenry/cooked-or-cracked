// Repo chips → into head → DESIGN TEST (v2). Canvas 1080x700, place at 0/220. ~4.8 s. Ep2 super.
// Five repo-name paper chips pop in above the head, fly into the head (hx/hy) and vanish, then a label + word stamp pops in above the hair with the orange underline.
// Props: serif "Fraunces", hand "Kalam", paper #FFFEFA, ink #171411, accent #DF825F, fly 62, stamp 95 (frames), hx 565, hy 560 (head centre in canvas px), label "5 repos → 1 experiment", word "DESIGN TEST"
// The chip names are in the code (names array); change them there for another episode. Spell repo names exactly as GitHub does.
// The earlier v1 (canvas 1000x440, chips fly together instead of into the head) is the same idea with pos/rots arrays and no hx/hy.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const cb = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const tornClip = "polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const names = ["taste-skill", "impeccable", "playwright-cli", "awesome-design-md", "img2threejs"];
  const pos = [[300, 58], [720, 52], [310, 145], [540, 232], [760, 140]];
  const rots = [-4, 3, -3, 4, -3];
  const fly = props.fly;
  const st = props.stamp;
  const chips = names.map((n, i) => {
    const t = frame - i * 5;
    const op = interpolate(t, [0, 4], [0, 1], cb);
    const sc = interpolate(t, [0, 7, 13], [0.3, 1.1, 1], cb);
    const a = fly + i * 3;
    const f = interpolate(frame, [a, a + 16], [0, 1], cb);
    const e = f * f;
    const x = pos[i][0] + (props.hx - pos[i][0]) * e;
    const y = pos[i][1] + (props.hy - pos[i][1]) * e;
    const s2 = 1 - 0.92 * e;
    const gone = interpolate(frame, [a + 13, a + 16], [1, 0], cb);
    const style = { position: "absolute", left: x, top: y, transform: "translate(-50%,-50%) rotate(" + (rots[i] + 25 * e) + "deg) scale(" + (sc * s2) + ")", opacity: op * gone, fontFamily: props.hand, fontWeight: 700, fontSize: 54, lineHeight: 1.15, color: props.ink, backgroundColor: props.paper, backgroundImage: ruled, padding: "6px 24px", clipPath: tornClip, whiteSpace: "nowrap", boxShadow: "3px 4px 0 rgba(23,20,17,0.3)" };
    return <div key={n} style={style}><span style={{ color: props.accent }}>#</span>{n}</div>;
  });
  const tl = frame - st;
  const opL = interpolate(tl, [0, 4], [0, 1], cb);
  const scL = interpolate(tl, [0, 7, 13], [0.3, 1.08, 1], cb);
  const rtL = interpolate(tl, [0, 7, 13], [10, -1, 2], cb);
  const opW = interpolate(tl, [5, 9], [0, 1], cb);
  const scW = interpolate(tl, [5, 13, 20], [0.2, 1.1, 1], cb);
  const rtW = interpolate(tl, [5, 13, 20], [-14, 1, -2], cb);
  const draw = interpolate(tl, [18, 36], [0, 1], cb);
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent" };
  const stampWrap = { position: "absolute", left: 0, right: 0, top: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 };
  const labelStyle = { fontFamily: props.hand, fontSize: 50, fontWeight: 700, lineHeight: 1.2, color: props.ink, backgroundColor: props.paper, padding: "2px 24px", clipPath: tornClip, opacity: opL, transform: "rotate(" + rtL + "deg) scale(" + scL + ")" };
  const wordStyle = { fontFamily: props.serif, fontSize: 112, fontWeight: 900, lineHeight: 1.05, letterSpacing: 2, color: props.ink, backgroundColor: props.paper, backgroundImage: ruled, padding: "0px 34px", whiteSpace: "nowrap", clipPath: tornClip, opacity: opW, transform: "rotate(" + rtW + "deg) scale(" + scW + ")" };
  return <div style={rootStyle}>
    {chips}
    <div style={stampWrap}>
      <div style={labelStyle}>{props.label}</div>
      <div style={wordStyle}>{props.word}</div>
      <svg viewBox="0 0 600 40" style={{ width: 560, height: 34 }}>
        <path d="M18 24 Q160 8 300 20 T582 14" fill="none" stroke={props.accent} strokeWidth="13" strokeLinecap="round" strokeDasharray="640" strokeDashoffset={640 * (1 - draw)} />
      </svg>
    </div>
  </div>;
};
