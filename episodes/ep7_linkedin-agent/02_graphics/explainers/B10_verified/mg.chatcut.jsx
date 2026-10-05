const Component = ({ item }) => {
// B10 "So always please check for your third-party apps if it's LinkedIn verified" (Ep7, 123 frames, 980x500).
// Two third-party app cards (a sketchy unnamed auto-poster, and Buffer). On "your" your LinkedIn "in" tile pops at the top,
// on "third-party" plug cables draw from it into both apps. A magnifier checks them: it studies the broken robot, hops to
// the auto-poster's "?" (X, "not verified"), then to Buffer's "?", where a LinkedIn shield is found on "LinkedIn".
// On "verified" the shield fills orange, grows, gets a tick, and a VERIFIED stamp slams down on Buffer.
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const popScale = (f, t0, d) => interpolate(f, [t0, t0 + d * 0.55, t0 + d], [0.3, 1.08, 1], CL);
const fadeIn = (f, t0, d) => interpolate(f, [t0, t0 + d], [0, 1], CL);
const seg = (f, a, b, v0, v1, ease) => interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const SHIELD = "M50 4 L94 18 V54 C94 84 76 102 50 112 C24 102 6 84 6 54 V18 Z";


const __Inner = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;
  const gold = props.gold;
  const grey = ink + "70";
  const shadow = "4px 6px 0 rgba(23,20,17,0.22)";
  const outC = Easing.out(Easing.cubic);

  // ---------- timings (frames relative to MG start) ----------
  // So f1 / always f4 / please f14 / check f23 / for f32 / your f36 / third-party f48 / apps f59 / if f67 / it's f71 / LinkedIn f80 / verified f99
  const tCardA = 0, tCardB = 4;          // So / always: the two apps
  const tSlotA = 10, tSlotB = 12;        // please: a "?" on each
  const tTile = 32;                      // your: your LinkedIn
  const tCable = 44;                     // third-party: both apps plug into it
  const tX = 53;                         // apps: the auto-poster fails
  const tTag = 66;                       // if it's: "not verified"
  const tShield = 76;                    // LinkedIn: shield found on Buffer
  const tStamp = 93, tGrow = 95;         // verified

  // ---------- cards ----------
  const aS = popScale(frame, tCardA, 11);
  const aO = fadeIn(frame, tCardA, 3);
  const bS = popScale(frame, tCardB, 11);
  const bO = fadeIn(frame, tCardB, 3);
  const rej = interpolate(frame, [tX + 4, tX + 12], [0, 1], { ...CL, easing: outC });
  const aDim = 1 - 0.55 * rej;
  const aRot = -1.5 - 2 * rej;
  const aDrop = 10 * rej;
  const win = interpolate(frame, [tStamp + 5, tStamp + 9], [0, 1], CL);
  const bBorder = interpolateColors(win, [0, 1], [ink, acc]);

  // ---------- LinkedIn tile + plug cables ----------
  const tileS = popScale(frame, tTile, 11);
  const tileO = fadeIn(frame, tTile, 3);
  const cab = interpolate(frame, [tCable, tCable + 5], [0, 1], { ...CL, easing: outC });
  const plugO = fadeIn(frame, tCable + 3, 2);
  const plugY = interpolate(frame, [tCable + 3, tCable + 7], [-7, 0], { ...CL, easing: outC });

  // ---------- slots ----------
  const qA = popScale(frame, tSlotA, 10) * interpolate(frame, [tX, tX + 4], [1, 0], CL);
  const qAo = fadeIn(frame, tSlotA, 3) * interpolate(frame, [tX, tX + 3], [1, 0], CL);
  const xS = interpolate(frame, [tX, tX + 5, tX + 9], [0.3, 1.12, 1], CL);
  const xO = fadeIn(frame, tX, 2);
  const x1 = interpolate(frame, [tX + 2, tX + 6], [0, 1], { ...CL, easing: outC });
  const x2 = interpolate(frame, [tX + 5, tX + 9], [0, 1], { ...CL, easing: outC });
  const shake = frame >= tX + 4 && frame <= tX + 12 ? Math.sin((frame - tX - 4) * 2.2) * 6 * (1 - (frame - tX - 4) / 8) : 0;
  const tagW = interpolate(frame, [tTag, tTag + 6], [0, 1], { ...CL, easing: outC });

  const qB = popScale(frame, tSlotB, 10) * interpolate(frame, [tShield, tShield + 4], [1, 0], CL);
  const qBo = fadeIn(frame, tSlotB, 3) * interpolate(frame, [tShield, tShield + 3], [1, 0], CL);
  const shPop = popScale(frame, tShield, 10);
  const shO = fadeIn(frame, tShield, 2);
  const shGrow = interpolate(frame, [tGrow, tGrow + 5, tGrow + 10], [1, 1.72, 1.5], CL);
  const fillP = interpolate(frame, [tGrow + 1, tGrow + 5], [0, 1], { ...CL, easing: outC });
  const tickS = interpolate(frame, [tGrow + 5, tGrow + 10, tGrow + 14], [0, 1.15, 1], CL);
  const tickDraw = interpolate(frame, [tGrow + 8, tGrow + 13], [0, 1], { ...CL, easing: outC });
  const burst = interpolate(frame, [tGrow + 6, tGrow + 13], [0, 1], { ...CL, easing: outC });

  // ---------- stamp ----------
  const stS = interpolate(frame, [tStamp, tStamp + 4, tStamp + 8], [1.12, 0.96, 1], CL);
  const stO = fadeIn(frame, tStamp, 2);
  const stR = interpolate(frame, [tStamp, tStamp + 4], [-8, -5], { ...CL, easing: outC });

  // ---------- magnifier path (lens centre) + handle angle ----------
  const SA = { x: 384, y: 122 };
  const SB = { x: 870, y: 122 };
  const P0 = { x: 400, y: 330 };   // swings in from lower right (the hand holding it)
  const PR = { x: 238, y: 178 };   // parks on the broken robot (check / for your)
  const PA = { x: 384, y: 129 };   // the auto-poster's "?"
  const PB = { x: 870, y: 126 };   // Buffer's "?"
  let lx, ly;
  if (frame < 44) { lx = seg(frame, 17, 23, P0.x, PR.x, outC); ly = seg(frame, 17, 23, P0.y, PR.y, outC); }
  else if (frame < 63) { lx = seg(frame, 44, 52, PR.x, PA.x, outC); ly = seg(frame, 44, 52, PR.y, PA.y, outC); }
  else { lx = seg(frame, 63, 71, PA.x, PB.x, outC); ly = seg(frame, 63, 71, PA.y, PB.y, outC); }
  // handle points down-right: along the empty strip right of the robot, then down the inside of each card, clear of icons and names
  const hA = frame < 44 ? 20 : seg(frame, 44, 52, 20, 80, outC);
  const mIn = interpolate(frame, [17, 23, 28], [0.3, 1.08, 1], CL);
  const mOut = interpolate(frame, [86, 89, 93], [1, 1.1, 0], CL);
  const mS = mIn * mOut;
  const mO = fadeIn(frame, 17, 3) * interpolate(frame, [91, 93], [1, 0], CL);
  const mR = interpolate(frame, [17, 24, 29], [-26, 5, 0], CL) + interpolate(frame, [86, 93], [0, 22], CL);
  const mLift = interpolate(frame, [86, 93], [0, -26], CL);
  const R = 66;
  const K = 1.45;

  // ---------- icons ----------
  const robot = <svg viewBox="0 0 24 24" style={{ width: 74, height: 74 }}>
    <g fill="none" stroke={ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7.5 V4.6" />
      <circle cx="12" cy="3.6" r="1.1" fill={ink} />
      <rect x="5" y="7.5" width="14" height="11.5" rx="2.6" />
      <path d="M3.4 11.5 V15 M20.6 11.5 V15" />
      <path d="M9 15.9 L10.2 15.1 L11.4 15.9 L12.6 15.1 L13.8 15.9 L15 15.1" />
    </g>
    <circle cx="9" cy="11.7" r="1.35" fill={ink} />
    <path d="M14 10.6 L16.2 12.8 M16.2 10.6 L14 12.8" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
  // Buffer mark: the same 3-layer stack as B08/B11 (viewBox 48), inverted to paper on the ink tile
  const layers = <svg viewBox="0 0 48 48" style={{ width: 70, height: 70 }}>
    <path d="M24 5 L43 14.5 L24 24 L5 14.5 Z" fill={paper} stroke={paper} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M5 23.5 L24 33 L43 23.5" fill="none" stroke={paper} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 32.5 L24 42 L43 32.5" fill="none" stroke={paper} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

  // ---------- styles ----------
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const cardBase = { position: "absolute", top: 96, width: 400, height: 316, backgroundColor: paper, borderRadius: 24, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 24 };
  const cardATf = "translateY(" + aDrop + "px) rotate(" + aRot + "deg) scale(" + aS + ")";
  const cardA = { ...cardBase, left: 40, border: "3px solid " + ink, boxShadow: shadow, opacity: aO * aDim, transform: cardATf };
  const cardB = { ...cardBase, left: 526, border: "3.5px solid " + bBorder, boxShadow: shadow, opacity: bO, transform: "rotate(1.2deg) scale(" + bS + ")" };
  const iconA = { width: 110, height: 110, borderRadius: 28, border: "3.5px dashed " + ink, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: paper };
  const iconB = { width: 110, height: 110, borderRadius: 28, backgroundColor: ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 4px 0 rgba(23,20,17,0.22)" };
  const nameSt = { fontFamily: props.serif, fontWeight: 900, fontSize: 46, lineHeight: 1, letterSpacing: 0, color: ink, marginTop: 24 };
  const subSt = { fontFamily: props.sans, fontWeight: 800, fontSize: 21, lineHeight: 1, color: grey, marginTop: 10, letterSpacing: 0.3 };
  const slotBase = { position: "absolute", width: 84, height: 84, marginLeft: -42, marginTop: -42, borderRadius: 42, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: paper };
  const qSt = { fontFamily: props.sans, fontWeight: 800, fontSize: 40, lineHeight: 1, color: grey };

  // plug head drawn at a cable end (x, y = top of the plug body); prongs end at the card's top edge
  const plugHead = (x, y, fill) => <g transform={"translate(" + x + " " + y + ")"} opacity={plugO}>
    <path d="M-5 17 V28 M5 17 V28" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
    <rect x="-13" y="0" width="26" height="18" rx="4" fill={fill} stroke={ink} strokeWidth="3" />
  </g>;

  const scene = (k) => {
    const yA = 68 + plugY + aDrop;
    const yB = 68 + plugY;
    const cabB = interpolateColors(win, [0, 1], [ink, acc]);
    return <>
      {/* plug cables: your LinkedIn -> both third-party apps */}
      <svg viewBox="0 0 980 500" style={{ position: "absolute", left: 0, top: 0, width: 980, height: 500, overflow: "visible" }}>
        <g opacity={aDim}>
          <path d={"M456 49 H276 C256 49 240 55 240 " + yA} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - cab} />
          {plugHead(240, yA, rej > 0.4 ? paper : acc)}
        </g>
        <path d={"M510 49 H690 C710 49 726 55 726 " + yB} fill="none" stroke={cabB} strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - cab} />
        {plugHead(726, yB, acc)}
      </svg>
      <div style={{ position: "absolute", left: 455, top: 21, width: 56, height: 56, borderRadius: 13, backgroundColor: ink, boxShadow: "3px 4px 0 rgba(23,20,17,0.22)", opacity: tileO, transform: "rotate(-2deg) scale(" + tileS + ")" }}>
        <div style={{ position: "absolute", right: 8, bottom: 5, fontFamily: props.sans, fontWeight: 800, fontSize: 36, lineHeight: 1, letterSpacing: -1, color: paper }}>in</div>
      </div>
      <div style={cardA}>
        <div style={iconA}>{robot}</div>
        <div style={nameSt}>auto-poster</div>
        <div style={subSt}>UNKNOWN DEVELOPER</div>
      </div>
      {/* "not verified" note written on the auto-poster card (full ink, not dimmed) */}
      <div style={{ position: "absolute", left: 40, top: 96, width: 400, height: 316, transform: cardATf }}>
        <div style={{ position: "absolute", left: 0, top: 257, width: 400, textAlign: "center" }}>
          <span style={{ display: "inline-block", fontFamily: props.hand, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: ink, transform: "rotate(-3deg)", clipPath: "inset(-12px " + (100 - 100 * tagW) + "% -12px -12px)" }}>not verified</span>
        </div>
      </div>
      <div style={cardB}>
        <div style={iconB}>{layers}</div>
        <div style={nameSt}>Buffer</div>
        <div style={{ ...subSt, opacity: interpolate(frame, [tStamp + 1, tStamp + 3], [1, 0], CL) }}>POST SCHEDULER</div>
      </div>
      {/* slot A: ? then X */}
      <div style={{ ...slotBase, left: SA.x, top: SA.y + aDrop, border: "3px dashed " + grey, opacity: qAo, transform: "scale(" + qA + ")" }}><span style={qSt}>?</span></div>
      <div style={{ ...slotBase, left: SA.x + shake, top: SA.y + aDrop, border: "4px solid " + ink, boxShadow: "3px 4px 0 rgba(23,20,17,0.22)", opacity: xO, transform: "scale(" + xS + ")" }}>
        <svg viewBox="0 0 84 84" style={{ position: "absolute", left: -4, top: -4, width: 84, height: 84 }}>
          <path d="M27 27 L57 57" stroke={ink} strokeWidth="8" strokeLinecap="round" strokeDasharray="43" strokeDashoffset={43 * (1 - x1)} />
          <path d="M57 27 L27 57" stroke={ink} strokeWidth="8" strokeLinecap="round" strokeDasharray="43" strokeDashoffset={43 * (1 - x2)} />
        </svg>
      </div>
      {/* slot B: ? then LinkedIn shield */}
      <div style={{ ...slotBase, left: SB.x, top: SB.y, border: "3px dashed " + grey, opacity: qBo, transform: "scale(" + qB + ")" }}><span style={qSt}>?</span></div>
      <div style={{ position: "absolute", left: SB.x - 50, top: SB.y - 58, width: 100, height: 116, opacity: shO, transform: "scale(" + shPop * shGrow + ")", transformOrigin: "50% 50%" }}>
        <svg viewBox="-30 -30 160 176" style={{ position: "absolute", left: -30, top: -30, width: 160, height: 176, overflow: "visible" }}>
          <defs><clipPath id={"shfill-" + k}><rect x="-30" y={112 - 110 * fillP} width="160" height="200" /></clipPath></defs>
          <g stroke={gold} strokeWidth="4" strokeLinecap="round" opacity={burst > 0 ? 1 : 0}>
            <path d={"M-4 28 L" + (-4 - 16 * burst) + " " + (28 - 9 * burst)} />
            <path d={"M14 6 L" + (14 - 8 * burst) + " " + (6 - 13 * burst)} />
          </g>
          <path d={SHIELD} fill={paper} />
          <path d={SHIELD} fill={acc} clipPath={"url(#shfill-" + k + ")"} />
          <path d={SHIELD} fill="none" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
          <g transform={"translate(86 98) scale(" + tickS + ")"}>
            <circle cx="0" cy="0" r="17" fill={ink} stroke={paper} strokeWidth="3" />
            <path d="M-8 0.5 L-2.5 6 L8.5 -6" fill="none" stroke={paper} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="26" strokeDashoffset={26 * (1 - tickDraw)} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 0, top: 30, width: 100, textAlign: "center", fontFamily: props.sans, fontWeight: 800, fontSize: 46, lineHeight: 1, letterSpacing: -1, color: ink }}>in</div>
      </div>
    </>;
  };

  // ---------- magnifier ----------
  const handleLen = 104;
  const magnifier = <div style={{ position: "absolute", left: lx, top: ly + mLift, width: 0, height: 0, opacity: mO, transform: "rotate(" + mR + "deg) scale(" + mS + ")", transformOrigin: "0 0" }}>
    <div style={{ position: "absolute", left: 0, top: -11, width: R + handleLen, height: 22, transformOrigin: "0 50%", transform: "rotate(" + hA + "deg)" }}>
      <div style={{ position: "absolute", left: R + 2, top: 4, width: 26, height: 14, backgroundColor: ink }} />
      <div style={{ position: "absolute", left: R + 24, top: 0, width: handleLen - 24, height: 22, borderRadius: 11, backgroundColor: acc, border: "3.5px solid " + ink, boxSizing: "border-box", boxShadow: "3px 4px 0 rgba(23,20,17,0.22)" }} />
    </div>
    <div style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: R, overflow: "hidden", backgroundColor: paper, boxShadow: shadow }}>
      <div style={{ position: "absolute", left: -(lx - R), top: -(ly + mLift - R), width: 980, height: 500, transform: "scale(" + K + ")", transformOrigin: lx + "px " + (ly + mLift) + "px" }}>{scene("lens")}</div>
      <div style={{ position: "absolute", inset: 0, borderRadius: R, backgroundColor: "rgba(255,254,250,0.10)" }} />
    </div>
    <svg viewBox={"0 0 " + 2 * R + " " + 2 * R} style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, overflow: "visible" }}>
      <circle cx={R} cy={R} r={R - 4} fill="none" stroke={ink} strokeWidth="9" />
      <path d={"M" + (R - 40) + " " + (R - 16) + " A44 44 0 0 1 " + (R - 14) + " " + (R - 42)} fill="none" stroke={paper} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
    </svg>
  </div>;

  // ---------- stamp ----------
  const STX = 700, STY = 378;
  const stamp = <div style={{ position: "absolute", left: STX, top: STY, width: 0, height: 0, opacity: stO }}>
    <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%) rotate(" + stR + "deg) scale(" + stS + ")", backgroundColor: paper, border: "6px double " + acc, borderRadius: 12, padding: "5px 15px 1px 15px", boxShadow: shadow, whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: props.serif, fontWeight: 900, fontSize: 80, lineHeight: 1, letterSpacing: 0, color: acc }}>VERIFIED</div>
    </div>
  </div>;

  return <div style={rootStyle}>
    {scene("main")}
    {frame >= 17 && frame <= 93 ? magnifier : null}
    {frame >= tStamp ? stamp : null}
  </div>;
};

return __Inner({ item });
};
