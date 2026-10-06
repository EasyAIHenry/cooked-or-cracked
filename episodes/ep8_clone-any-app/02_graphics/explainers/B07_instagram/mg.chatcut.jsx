const Component = ({ item }) => {
// B07 Instagram: "and you're gonna find it as a hassle to connect your Instagram to this. Let's not talk about Instagram
// banning third-party apps that are not even allowed." (Ep8, 273 frames, 980x500). ChatCut motion graphic (Remotion runtime).
// Phase A: the post-queue clone tile pops (f0); a camera tile pops on "find" (f31); a wobbly cable tries to reach it on
// "hassle" (f52) and a padlock slams onto the camera tile's left edge on "connect" (f68), the plug bumps into it and recoils. On the first "Instagram"
// (f103) the plain-text label writes under the camera tile and a "developer app / REVIEW" form card slides in.
// Phase B (f148..158): clone, cable and form leave; the camera tile slides right; a generic "third-party app" card pops
// before the second "Instagram" (f157). On "banning" (f174) a cross draws over it; on "not even allowed" (f236) it drops and dims.
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EO = Easing.out(Easing.cubic);
const EI = Easing.in(Easing.cubic);
const EIO = Easing.inOut(Easing.cubic);
const popS = (t) => interpolate(t, [0, 7, 12], [0.3, 1.08, 1], CL);
const popO = (t) => interpolate(t, [0, 3], [0, 1], CL);
const popR = (t, r) => interpolate(t, [0, 7, 12], [r * 5, -r * 0.6, r], CL);
// wobbly cable from the clone tile's right edge to the camera tile's left edge (a polyline so a point along it is cheap)
const CABLE = [];
for (let i = 0; i <= 28; i++) {
  const x = 244 + (i * 168) / 28;
  const y = 222 + 24 * Math.sin((i / 28) * Math.PI * 3) * (i < 2 || i > 26 ? 0.2 : 1);
  CABLE.push([x, y]);
}
const cableLen = (() => {
  let L = 0;
  const acc = [0];
  for (let i = 1; i < CABLE.length; i++) {
    L += Math.hypot(CABLE[i][0] - CABLE[i - 1][0], CABLE[i][1] - CABLE[i - 1][1]);
    acc.push(L);
  }
  return { L, acc };
})();
const CABLE_D = CABLE.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
const ptAt = (p) => {
  const d = p * cableLen.L;
  for (let i = 1; i < CABLE.length; i++) {
    if (cableLen.acc[i] >= d) {
      const t = (d - cableLen.acc[i - 1]) / (cableLen.acc[i] - cableLen.acc[i - 1]);
      return [CABLE[i - 1][0] + (CABLE[i][0] - CABLE[i - 1][0]) * t, CABLE[i - 1][1] + (CABLE[i][1] - CABLE[i - 1][1]) * t];
    }
  }
  return CABLE[CABLE.length - 1];
};

const __Inner = ({ item }) => {
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
  // and f0 / you're f11 / find f34 / hassle f55 / connect f71 / your f88 / Instagram f106 / this f128 / Let's f133 /
  // talk f143 / about f151 / Instagram f160 / banning f178 / third-party f197 / apps f210 / not f232 / even f237 / allowed f244
  const tClone = 0;      // and: the clone's post-queue tile
  const tCam = 31;       // find: the camera tile
  const tCable = 52;     // hassle: a wobbly cable tries to reach it
  const tLock = 68;      // connect: padlock, the plug recoils
  const tLabel = 103;    // Instagram: the label writes
  const tForm = 106;     // Instagram: developer app / review form slides in
  const tExit = 148;     // talk about: phase change
  const tCard = 157;     // Instagram (2nd): a generic third-party app card
  const tX = 174;        // banning: the cross
  const tRej = 236;      // not even allowed: the card drops and dims

  // ---------- phase A ----------
  const cloneT = frame - tClone;
  const camT = frame - tCam;
  const cab = interpolate(frame, [tCable, tCable + 14], [0, 1], { ...CL, easing: EO });
  const recoil = interpolate(frame, [tLock, tLock + 4, tLock + 10], [0, 0.11, 0.06], { ...CL, easing: EO });
  const cabShown = cab * (1 - recoil);
  const plugPt = ptAt(cabShown);
  const plugO = interpolate(frame, [tCable + 2, tCable + 5], [0, 1], CL);
  const lockT = frame - tLock;
  const shackle = interpolate(frame, [tLock + 6, tLock + 11], [-16, 0], { ...CL, easing: EI });
  const lockRot = interpolate(frame, [tLock + 11, tLock + 13, tLock + 16], [-6, -2, -5], CL);
  const labelW = interpolate(frame, [tLabel, tLabel + 10], [0, 1], { ...CL, easing: EO });
  const formX = interpolate(frame, [tForm, tForm + 12], [1010, 700], { ...CL, easing: EO });
  const fieldO = (i) => interpolate(frame, [tForm + 8 + i * 4, tForm + 11 + i * 4], [0, 1], CL);
  const pillT = frame - (tForm + 20);
  // exit
  const exitS = interpolate(frame, [tExit, tExit + 8], [1, 0], { ...CL, easing: EI });
  const exitO = interpolate(frame, [tExit, tExit + 7], [1, 0], CL);
  const formOut = interpolate(frame, [tExit, tExit + 8], [0, 320], { ...CL, easing: EI });
  const camShift = interpolate(frame, [tExit, tExit + 10], [0, 250], { ...CL, easing: EIO });

  // ---------- phase B ----------
  const cardT = frame - tCard;
  const x1 = interpolate(frame, [tX, tX + 5], [0, 1], { ...CL, easing: EO });
  const x2 = interpolate(frame, [tX + 3, tX + 8], [0, 1], { ...CL, easing: EO });
  const xO = interpolate(frame, [tX, tX + 1], [0, 1], CL);
  const shake = frame >= tX + 4 && frame <= tX + 12 ? Math.sin((frame - tX - 4) * 2.2) * 7 * (1 - (frame - tX - 4) / 8) : 0;
  const rej = interpolate(frame, [tRej, tRej + 10], [0, 1], { ...CL, easing: EO });
  const cardDim = 1 - 0.5 * rej;
  const cardTf = "translate(" + shake + "px, " + 14 * rej + "px) rotate(" + (-1.2 - 3 * rej) + "deg) scale(" + popS(cardT) + ")";

  // ---------- pieces ----------
  const tile = { position: "absolute", width: 200, height: 200, boxSizing: "border-box", backgroundColor: paper, border: "3.5px solid " + ink, borderRadius: 44, boxShadow: shadow };

  const cloneTile = (
    <div style={{ ...tile, left: 40, top: 120, opacity: popO(cloneT) * exitO, transform: "rotate(" + popR(cloneT, -1.5) + "deg) scale(" + popS(cloneT) * exitS + ")" }}>
      <svg viewBox="0 0 200 200" width="193" height="193" style={{ position: "absolute", left: 0, top: 0 }}>
        <g fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="38" y="44" width="110" height="98" rx="12" fill={paper} />
          <path d="M38 76 H148 M64 32 V56 M122 32 V56" />
        </g>
        <rect x="56" y="92" width="18" height="16" rx="3" fill={ink} />
        <rect x="84" y="92" width="18" height="16" rx="3" fill={acc} />
        <rect x="112" y="92" width="18" height="16" rx="3" fill={ink} opacity="0.3" />
        <rect x="56" y="116" width="18" height="16" rx="3" fill={ink} opacity="0.3" />
        <rect x="84" y="116" width="18" height="16" rx="3" fill={ink} opacity="0.3" />
        <circle cx="146" cy="142" r="30" fill={paper} stroke={ink} strokeWidth="6" />
        <path d="M146 126 V142 L158 150" fill="none" stroke={acc} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  const cable = (
    <svg viewBox="0 0 980 500" width="980" height="500" style={{ position: "absolute", left: 0, top: 0, opacity: exitO, transform: "scale(" + exitS + ")", transformOrigin: "300px 222px" }}>
      <path d={CABLE_D} fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - cabShown} opacity={cab > 0.001 ? 1 : 0} />
      <g transform={"translate(" + plugPt[0].toFixed(1) + " " + plugPt[1].toFixed(1) + ")"} opacity={plugO}>
        <rect x="-6" y="-17" width="30" height="34" rx="7" fill={acc} stroke={ink} strokeWidth="4" />
        <path d="M24 -8 H38 M24 8 H38" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );

  const camGroup = (
    <div style={{ position: "absolute", left: camShift, top: 0, width: 980, height: 500 }}>
      <div style={{ ...tile, left: 480, top: 120, opacity: popO(camT), transform: "rotate(" + popR(camT, 1.5) + "deg) scale(" + popS(camT) + ")" }}>
        <svg viewBox="0 0 200 200" width="193" height="193" style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x="40" y="40" width="120" height="120" rx="34" fill="none" stroke={ink} strokeWidth="7" />
          <circle cx="100" cy="100" r="34" fill="none" stroke={ink} strokeWidth="7" />
          <circle cx="100" cy="100" r="19" fill={acc} />
          <circle cx="136" cy="64" r="8" fill={acc} />
        </svg>
      </div>
      {/* padlock on the tile's left edge, where the plug arrives */}
      <div style={{ position: "absolute", left: 444, top: 170, width: 80, height: 96, opacity: popO(lockT), transform: "rotate(" + lockRot + "deg) scale(" + popS(lockT) + ")", transformOrigin: "50% 60%", filter: "drop-shadow(3px 4px 0 rgba(23,20,17,0.22))" }}>
        <svg viewBox="0 0 80 96" width="80" height="96" style={{ overflow: "visible" }}>
          <path d="M20 48 V30 A20 20 0 0 1 60 30 V48" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" transform={"translate(0 " + shackle + ")"} />
          <rect x="6" y="44" width="68" height="50" rx="11" fill={acc} stroke={ink} strokeWidth="4.5" />
          <circle cx="40" cy="64" r="7" fill={ink} />
          <path d="M40 66 V80" stroke={ink} strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
      {/* plain-text label, said out loud */}
      <div style={{ position: "absolute", left: 420, top: 332, width: 320, textAlign: "center", fontFamily: hand, fontWeight: 700, fontSize: 48, lineHeight: "56px", color: ink, clipPath: "inset(-10px " + (100 - labelW * 100) + "% -10px -10px)" }}>Instagram</div>
    </div>
  );

  const field = (i, top, w) => (
    <div key={"fd" + i} style={{ position: "absolute", left: 20, top, width: 216, opacity: fieldO(i) }}>
      <div style={{ width: w, height: 8, borderRadius: 4, backgroundColor: ink, opacity: 0.28 }} />
      <div style={{ marginTop: 8, width: 216, height: 30, boxSizing: "border-box", border: "2.5px solid " + ink, borderRadius: 7, opacity: 0.55 }} />
    </div>
  );

  const formCard = (
    <div style={{ position: "absolute", left: formX + formOut, top: 84, width: 260, height: 324, boxSizing: "border-box", backgroundColor: paper, border: "3px solid " + ink, borderRadius: 16, boxShadow: shadow, transform: "rotate(1.5deg)" }}>
      <div style={{ position: "absolute", left: 20, top: 12, fontFamily: hand, fontWeight: 700, fontSize: 34, lineHeight: "42px", color: ink, whiteSpace: "nowrap" }}>developer app</div>
      {field(0, 68, 90)}
      {field(1, 130, 120)}
      {field(2, 192, 70)}
      <div style={{ position: "absolute", left: 20, top: 258, display: "flex", alignItems: "center", gap: 8, boxSizing: "border-box", border: "3px solid " + acc, borderRadius: 24, padding: "4px 16px 4px 12px", opacity: popO(pillT), transform: "rotate(" + popR(pillT, -2) + "deg) scale(" + popS(pillT) + ")", transformOrigin: "0% 50%" }}>
        <svg viewBox="0 0 24 24" width="28" height="28">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke={acc} strokeWidth="2.6" />
          <path d="M12 7 V12 L15.5 14.5" fill="none" stroke={acc} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: sans, fontWeight: 800, fontSize: 30, lineHeight: "34px", letterSpacing: 2, color: acc }}>REVIEW</span>
      </div>
    </div>
  );

  const thirdCard = (
    <>
      <div style={{ position: "absolute", left: 130, top: 90, width: 420, height: 320, boxSizing: "border-box", backgroundColor: paper, border: "3.5px solid " + ink, borderRadius: 26, boxShadow: shadow, opacity: popO(cardT) * cardDim, transform: cardTf }}>
        <div style={{ position: "absolute", left: 150, top: 28, width: 120, height: 120, boxSizing: "border-box", border: "3.5px dashed " + ink, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 60 60" width="66" height="66">
            <g fill="none" stroke={ink} strokeWidth="4" strokeLinejoin="round">
              <rect x="6" y="6" width="20" height="20" rx="5" />
              <rect x="34" y="6" width="20" height="20" rx="5" />
              <rect x="6" y="34" width="20" height="20" rx="5" />
            </g>
            <rect x="34" y="34" width="20" height="20" rx="5" fill={acc} stroke={ink} strokeWidth="4" />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, top: 166, width: 414, textAlign: "center", fontFamily: serif, fontWeight: 900, fontSize: 46, lineHeight: "54px", color: ink }}>third-party app</div>
        <div style={{ position: "absolute", left: 107, top: 240, width: 200, height: 10, borderRadius: 5, backgroundColor: ink, opacity: 0.22 }} />
        <div style={{ position: "absolute", left: 147, top: 262, width: 120, height: 10, borderRadius: 5, backgroundColor: ink, opacity: 0.22 }} />
      </div>
      {/* the cross keeps full ink while the card dims */}
      <div style={{ position: "absolute", left: 130, top: 90, width: 420, height: 320, opacity: xO, transform: cardTf }}>
        <svg viewBox="0 0 420 320" width="420" height="320" style={{ overflow: "visible" }}>
          <g strokeLinecap="round" fill="none">
            <path d="M56 44 L364 276" stroke={ink} strokeWidth="26" strokeDasharray="390" strokeDashoffset={390 * (1 - x1)} />
            <path d="M364 44 L56 276" stroke={ink} strokeWidth="26" strokeDasharray="390" strokeDashoffset={390 * (1 - x2)} />
            <path d="M56 44 L364 276" stroke={acc} strokeWidth="16" strokeDasharray="390" strokeDashoffset={390 * (1 - x1)} />
            <path d="M364 44 L56 276" stroke={acc} strokeWidth="16" strokeDasharray="390" strokeDashoffset={390 * (1 - x2)} />
          </g>
        </svg>
      </div>
    </>
  );

  return (
    <div style={rootStyle}>
      {frame < tExit + 9 ? cloneTile : null}
      {frame >= tCable && frame < tExit + 9 ? cable : null}
      {frame < tExit + 9 ? formCard : null}
      {frame >= tCard ? thirdCard : null}
      {camGroup}
    </div>
  );
};

return __Inner({ item });
};
