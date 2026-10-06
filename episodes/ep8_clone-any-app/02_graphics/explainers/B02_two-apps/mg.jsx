// B02 "two apps" (Ep8, 7 Oct 2026). Canvas 980x500, 143 frames. ChatCut motion graphic (Remotion runtime).
// "So today I'm going to clone two apps, one is Loom and another is Buffer."
// Two empty dashed slots pop on "two" (land f37 and f39); on "Loom" the first slot fills with a recorder tile (screen + record dot,
// label "screen recorder") and a US$15 a month price tag swings in under it; on "Buffer" the second slot fills with
// a queue tile (calendar + clock, label "post scheduler") and a US$5 a month tag swings in. Palette-only icons,
// no brand marks. Both tags settle and everything holds.
const CB = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const SHADOW = "4px 6px 0 rgba(23,20,17,0.22)";
const TW = 400;
const TH = 292;
const TILES = [
  { x: 70, y: 34, rot: -1.5, slotT: 32, fillT: 64, tagT: 72, price: "US$15", label: "screen recorder" },
  { x: 510, y: 34, rot: 1.2, slotT: 34, fillT: 100, tagT: 106, price: "US$5", label: "post scheduler" },
];
const TAG_W = 236;
const TAG_H = 118;
const STRING = 16;

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };

  // damped pendulum: swings in from the side and is exactly still 26 frames after it drops
  const swing = (t) => {
    if (t < 0) return 0;
    const fade = interpolate(t, [18, 26], [1, 0], CB);
    return -52 * Math.exp(-t / 5.5) * Math.cos(0.45 * t) * fade;
  };

  const recorderIcon = (
    <svg viewBox="0 0 160 130" style={{ width: 196, height: 159 }}>
      <rect x="12" y="8" width="136" height="94" rx="10" fill={paper} stroke={ink} strokeWidth="4.5" />
      <path d="M12 30 H148" stroke={ink} strokeWidth="3" opacity="0.25" />
      <circle cx="26" cy="19" r="3.2" fill={ink} opacity="0.3" />
      <circle cx="37" cy="19" r="3.2" fill={ink} opacity="0.3" />
      <circle cx="80" cy="64" r="22" fill="none" stroke={ink} strokeWidth="4" />
      <circle cx="80" cy="64" r="12.5" fill={acc} />
      <path d="M64 102 L59 120 H101 L96 102" fill={paper} stroke={ink} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M44 121 H116" stroke={ink} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );

  const dayCells = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const i = r * 3 + c;
      const hot = i === 1;
      dayCells.push(<g key={i}>
        <rect x={24 + c * 28} y={54 + r * 28} width="20" height="20" rx="4" fill={hot ? acc : "none"} stroke={ink} strokeWidth="3" opacity={hot ? 1 : 0.45} />
        <text x={34 + c * 28} y={69 + r * 28} textAnchor="middle" fontFamily={props.sans} fontWeight="800" fontSize="11" fill={ink} opacity={hot ? 0.9 : 0.5}>{String(i + 1)}</text>
      </g>);
    }
  }
  const queueIcon = (
    <svg viewBox="0 0 160 130" style={{ width: 196, height: 159 }}>
      <rect x="10" y="18" width="108" height="98" rx="10" fill={paper} stroke={ink} strokeWidth="4.5" />
      <path d="M10 28 A10 10 0 0 1 20 18 H108 A10 10 0 0 1 118 28 V44 H10 Z" fill={ink} />
      <rect x="30" y="8" width="9" height="20" rx="4.5" fill={paper} stroke={ink} strokeWidth="3.5" />
      <rect x="89" y="8" width="9" height="20" rx="4.5" fill={paper} stroke={ink} strokeWidth="3.5" />
      {dayCells}
      <circle cx="124" cy="92" r="30" fill={paper} stroke={ink} strokeWidth="4.5" />
      <path d="M124 92 V72 M124 92 L138 100" stroke={acc} strokeWidth="5" strokeLinecap="round" />
      <circle cx="124" cy="92" r="4" fill={ink} />
    </svg>
  );

  const tiles = TILES.map((t, k) => {
    // dashed slot pops on "two" (f40)
    const sOp = frame >= t.slotT ? 1 : 0;
    const sSc = interpolate(frame, [t.slotT, t.slotT + 5, t.slotT + 9], [0.3, 1.08, 1], CB);
    const sRot = interpolate(frame, [t.slotT, t.slotT + 5, t.slotT + 9], [t.rot - 8, t.rot + 1, t.rot], CB);
    // tile fills the slot on its app word
    const fOp = frame >= t.fillT ? 1 : 0;
    const fSc = interpolate(frame, [t.fillT, t.fillT + 3, t.fillT + 7], [0.5, 1.06, 1], CB);
    const fRot = interpolate(frame, [t.fillT, t.fillT + 3, t.fillT + 7], [t.rot + 6, t.rot - 0.5, t.rot], CB);
    const lblOp = frame >= t.fillT + 2 ? 1 : 0;
    const lblSc = interpolate(frame, [t.fillT + 2, t.fillT + 6, t.fillT + 10], [0.4, 1.08, 1], CB);
    // price tag swings in under the tile
    const tt = frame - t.tagT;
    const tagOp = frame >= t.tagT ? 1 : 0;
    const tagAng = swing(tt);
    const tagDrop = interpolate(tt, [0, 6], [-26, 0], { ...CB, easing: Easing.out(Easing.cubic) });
    const px = t.x + TW / 2;
    const py = t.y + TH - 6;
    return <div key={k}>
      {/* dashed slot */}
      <div style={{ position: "absolute", left: t.x, top: t.y, width: TW, height: TH, boxSizing: "border-box", border: "3px dashed " + ink, borderRadius: 16, opacity: sOp * 0.45, transform: "rotate(" + sRot + "deg) scale(" + sSc + ")", transformOrigin: "50% 50%" }} />
      {/* price tag (behind the tile so the string starts under its edge) */}
      <div style={{ position: "absolute", left: px, top: py, width: 0, height: 0, opacity: tagOp, transform: "translateY(" + tagDrop + "px) rotate(" + tagAng + "deg)", transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: -1.5, top: 0, width: 3, height: STRING + 8, backgroundColor: ink }} />
        <div style={{ position: "absolute", left: -TAG_W / 2, top: STRING, width: TAG_W, height: TAG_H, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 12, boxShadow: SHADOW }}>
          <div style={{ position: "absolute", left: TAG_W / 2 - 11, top: 8, width: 22, height: 22, boxSizing: "border-box", borderRadius: 11, backgroundColor: gold, border: "3px solid " + ink }} />
          <div style={{ position: "absolute", left: 0, top: 26, width: TAG_W, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 54, lineHeight: "56px", color: ink }}>{t.price}</div>
          <div style={{ position: "absolute", left: 0, top: 78, width: TAG_W, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 32, lineHeight: "34px", color: acc }}>a month</div>
        </div>
      </div>
      {/* app tile */}
      <div style={{ position: "absolute", left: t.x, top: t.y, width: TW, height: TH, opacity: fOp, transform: "rotate(" + fRot + "deg) scale(" + fSc + ")", transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 16, boxShadow: SHADOW }} />
        <div style={{ position: "absolute", left: 18, top: 14, display: "flex", gap: 8 }}>
          {[0, 1, 2].map((d) => <div key={d} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: d === 0 ? acc : ink, opacity: d === 0 ? 1 : 0.25 }} />)}
        </div>
        <div style={{ position: "absolute", left: 0, top: 40, width: TW, display: "flex", justifyContent: "center" }}>{k === 0 ? recorderIcon : queueIcon}</div>
        <div style={{ position: "absolute", left: 0, top: TH - 78, width: TW, textAlign: "center", fontFamily: props.hand, fontWeight: 700, fontSize: 42, lineHeight: "48px", color: ink, opacity: lblOp, transform: "scale(" + lblSc + ")", transformOrigin: "50% 50%", whiteSpace: "nowrap" }}>{t.label}</div>
      </div>
    </div>;
  });

  return <div style={rootStyle}>{tiles}</div>;
};
