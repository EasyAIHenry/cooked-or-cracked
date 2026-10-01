// Effect counter — n/12 (Ep4 v8, 1 Oct 2026). Canvas 440x128, 60 s. ChatCut motion-graphic (Remotion runtime).
// Paper chip: Kalam label + big accent Fraunces number + "/total". Pops in at the first tick; the number pops at every tick, then holds.
// Props: ticks "0,78,208,..." (frames from item start, one per spoken line), total 12, label "effect", serif "Fraunces", hand "Kalam",
//        paper #FFFEFA, ink #171411, accent #DF825F.
// Placed: 220x64 at 72/528 (just under the top stamp zone, above the left scoreboard), from the first effect line to the save card.
// Why: Ep4 retro, so the showcase has something countable (Ep2's "five free tools" did this job).
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const ticks = String(props.ticks).split(",").map((s) => parseInt(s, 10)).filter((v) => !isNaN(v));
  let n = 0;
  let last = -1000;
  for (let i = 0; i < ticks.length; i++) {
    if (frame >= ticks[i]) { n = i + 1; last = ticks[i]; }
  }
  const first = ticks.length > 0 ? ticks[0] : 0;
  const since = frame - last;
  const chipOp = n > 0 ? interpolate(frame - first, [0, 4], [0, 1], clampBoth) : 0;
  const chipSc = n > 0 ? interpolate(frame - first, [0, 7, 13], [0.3, 1.08, 1], clampBoth) : 0.3;
  const numSc = interpolate(since, [0, 4, 9], [0.5, 1.2, 1], clampBoth);
  const tornClip = "polygon(0% 7%,18% 0%,36% 6%,55% 1%,74% 6%,100% 2%,98% 94%,80% 100%,62% 94%,44% 100%,26% 95%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "flex-start" };
  const chipStyle = { display: "flex", alignItems: "baseline", gap: 12, padding: "8px 30px 12px 26px", backgroundColor: props.paper, backgroundImage: ruled, clipPath: tornClip, opacity: chipOp, transform: "rotate(-2deg) scale(" + chipSc + ")", transformOrigin: "left center" };
  const labelStyle = { fontFamily: props.hand, fontWeight: 700, fontSize: 40, lineHeight: 1, color: props.ink };
  const numStyle = { fontFamily: props.serif, fontWeight: 900, fontSize: 80, lineHeight: 1, color: props.accent, display: "inline-block", minWidth: 50, textAlign: "right", transform: "scale(" + numSc + ")", transformOrigin: "center bottom" };
  const totStyle = { fontFamily: props.serif, fontWeight: 900, fontSize: 54, lineHeight: 1, color: props.ink };
  return <div style={rootStyle}>
    <div style={chipStyle}>
      <span style={labelStyle}>{props.label}</span>
      <span style={numStyle}>{n}</span>
      <span style={totStyle}>{"/" + props.total}</span>
    </div>
  </div>;
};