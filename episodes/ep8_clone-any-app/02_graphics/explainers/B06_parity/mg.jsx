// B06 parity: "But it does look like Buffer" (Ep8, 61 frames, 980x500). ChatCut motion graphic (Remotion runtime).
// A paper results card pops on "But" (f0) and the gauge track draws. On "look like" (f23..33) the arc fills to 66 / 100
// while the counter rolls. Then "5 of 8 must-haves" pops (f34) and the scoring tool's own words "not shippable yet"
// slam as a stamp just before "Buffer" (f39). Still from f48 to the cut.
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EO = Easing.out(Easing.cubic);
const popS = (t) => interpolate(t, [0, 7, 12], [0.3, 1.08, 1], CL);
const popO = (t) => interpolate(t, [0, 3], [0, 1], CL);
const popR = (t, r) => interpolate(t, [0, 7, 12], [r * 5, -r * 0.6, r], CL);
const GR = 150;
const ARC = Math.PI * GR;
const CARD_W = 900;
const CARD_H = 440;

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;
  const serif = props.serif;
  const hand = props.hand;
  const sans = props.sans;
  const shadow = "4px 6px 0 rgba(23,20,17,0.22)";
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };

  // ---------- timings (frames relative to MG start) ----------
  // But f0 / it f9 / does f13 / look f23 / like f33 / buffer f43
  const tCard = 0;        // But: the results card
  const tTrack = 6;       // it: the gauge track draws
  const tTag = 10;        // does: PARITY tag
  const tFill = 21;       // look like: the arc fills to 66 and the counter rolls
  const tFive = 34;       // right after "like": 5 of 8 must-haves
  const tStamp = 39;      // Buffer: "not shippable yet" lands before the word

  // ---------- card ----------
  const cardT = frame - tCard;
  const cardS = popS(cardT);
  const cardO = popO(cardT);

  // ---------- gauge ----------
  const track = interpolate(frame, [tTrack, tTrack + 12], [0, 1], { ...CL, easing: EO });
  const fillP = interpolate(frame, [tFill, tFill + 13], [0, 1], { ...CL, easing: EO });
  const pct = 0.66 * fillP;
  const theta = Math.PI * (1 - pct);
  const dotX = 200 + GR * Math.cos(theta);
  const dotY = 200 - GR * Math.sin(theta);
  const dotS = interpolate(frame, [tFill, tFill + 4], [0, 1], CL);
  const count = Math.round(66 * fillP);
  const numO = interpolate(frame, [tFill, tFill + 3], [0, 1], CL);
  const numS = interpolate(frame, [tFill, tFill + 7, tFill + 12], [0.7, 1.04, 1], CL);
  const tagT = frame - tTag;

  // ---------- 5 of 8 ----------
  const fiveT = frame - tFive;
  const mustT = frame - tFive - 2;

  // ---------- stamp ----------
  const stT = frame - tStamp;
  const stS = interpolate(stT, [0, 5, 9], [1.4, 0.95, 1], CL);
  const stO = interpolate(stT, [0, 2], [0, 1], CL);
  const stR = interpolate(stT, [0, 5], [-9, -4], { ...CL, easing: EO });

  const tick = (p) => {
    const a = Math.PI * (1 - p);
    const x1 = 200 + (GR + 26) * Math.cos(a);
    const y1 = 200 - (GR + 26) * Math.sin(a);
    const x2 = 200 + (GR + 34) * Math.cos(a);
    const y2 = 200 - (GR + 34) * Math.sin(a);
    return <path key={"tk" + p} d={"M" + x1.toFixed(1) + " " + y1.toFixed(1) + " L" + x2.toFixed(1) + " " + y2.toFixed(1)} stroke={ink} strokeWidth="4" strokeLinecap="round" opacity={0.28 * track} />;
  };

  return (
    <div style={rootStyle}>
      <div style={{ position: "absolute", left: 40, top: 30, width: CARD_W, height: CARD_H, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 16, boxShadow: shadow, opacity: cardO, transform: "rotate(-0.6deg) scale(" + cardS + ")", transformOrigin: "50% 40%" }}>
        {/* PARITY tag */}
        <div style={{ position: "absolute", left: 54, top: 22, fontFamily: sans, fontWeight: 800, fontSize: 24, lineHeight: "30px", letterSpacing: 4, color: ink, opacity: 0.6 * popO(tagT), transform: "scale(" + popS(tagT) + ")", transformOrigin: "0% 50%" }}>PARITY</div>
        {/* gauge */}
        <svg viewBox="0 0 400 250" width="400" height="250" style={{ position: "absolute", left: 30, top: 54, overflow: "visible" }}>
          {[0.25, 0.5, 0.75].map(tick)}
          <path d="M50 200 A150 150 0 0 1 350 200" fill="none" stroke={ink} strokeWidth="30" strokeLinecap="round" opacity="0.12" strokeDasharray={ARC + 2} strokeDashoffset={(ARC + 2) * (1 - track)} />
          <path d="M50 200 A150 150 0 0 1 350 200" fill="none" stroke={ink} strokeWidth="36" strokeLinecap="round" opacity={track > 0.98 ? 1 : 0} strokeDasharray={ARC + 2} strokeDashoffset={(ARC + 2) * (1 - pct)} />
          <path d="M50 200 A150 150 0 0 1 350 200" fill="none" stroke={acc} strokeWidth="28" strokeLinecap="round" opacity={track > 0.98 ? 1 : 0} strokeDasharray={ARC + 2} strokeDashoffset={(ARC + 2) * (1 - pct)} />
          <circle cx={dotX} cy={dotY} r={18 * dotS} fill={gold} stroke={ink} strokeWidth="4" />
          <path d="M46 212 L354 212" stroke={ink} strokeWidth="4" strokeLinecap="round" opacity={0.5 * track} />
        </svg>
        {/* 66 / 100 */}
        <div style={{ position: "absolute", left: 80, top: 150, width: 300, textAlign: "center", fontFamily: serif, fontWeight: 900, fontSize: 108, lineHeight: "108px", color: ink, opacity: numO, transform: "scale(" + numS + ")", transformOrigin: "50% 80%" }}>{count}</div>
        <div style={{ position: "absolute", left: 80, top: 282, width: 300, textAlign: "center", fontFamily: sans, fontWeight: 800, fontSize: 28, lineHeight: "32px", letterSpacing: 2, color: ink, opacity: 0.6 * numO }}>/ 100</div>
        {/* 5 of 8 must-haves */}
        <div style={{ position: "absolute", left: 500, top: 56, display: "flex", alignItems: "baseline", gap: 14, opacity: popO(fiveT), transform: "rotate(" + popR(fiveT, -1.5) + "deg) scale(" + popS(fiveT) + ")", transformOrigin: "10% 70%" }}>
          <span style={{ fontFamily: serif, fontWeight: 900, fontSize: 118, lineHeight: "118px", color: acc }}>5</span>
          <span style={{ fontFamily: hand, fontWeight: 700, fontSize: 52, lineHeight: "60px", color: ink }}>of</span>
          <span style={{ fontFamily: serif, fontWeight: 900, fontSize: 118, lineHeight: "118px", color: ink }}>8</span>
        </div>
        <div style={{ position: "absolute", left: 504, top: 184, fontFamily: hand, fontWeight: 700, fontSize: 50, lineHeight: "58px", color: ink, opacity: popO(mustT), transform: "rotate(" + popR(mustT, 1) + "deg) scale(" + popS(mustT) + ")", transformOrigin: "10% 50%" }}>must-haves</div>
        {/* the scoring tool's own words */}
        <div style={{ position: "absolute", left: 606, top: 336, width: 0, height: 0, opacity: stO }}>
          <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%) rotate(" + stR + "deg) scale(" + stS + ")", backgroundColor: paper, border: "6px double " + acc, borderRadius: 12, padding: "6px 18px 2px 18px", boxShadow: shadow, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 54, lineHeight: "60px", color: acc }}>not shippable yet</div>
          </div>
        </div>
      </div>
    </div>
  );
};
