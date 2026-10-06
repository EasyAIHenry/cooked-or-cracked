// B09 COOKED (Ep8, 7 Oct 2026). Canvas 980x500, 344 frames. ChatCut motion graphic (Remotion runtime).
// "Overall, I think this is cooked. So it is not going to work if you are going to rely on the internet to actually
//  do streaming or any storage of any cloud data."
// A (f1-150): "the verdict" hand tag pops on "Overall"; the series COOKED stamp slams down on "cooked" (lands f43),
//    ink dust kicks out, the orange underline draws. Holds still.
// B (f150-158, "rely"): the stamp group shrinks to the left. On "internet" a cloud pops at the right with two tags
//    hanging under it, "streaming" and "storage"; each tag is struck through on its word (f223, f269); on "cloud"
//    a no-entry ring and slash draw over the cloud itself. Final state still from f302.
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const EO = Easing.out(Easing.cubic);
const EI = Easing.in(Easing.cubic);
const EIO = Easing.inOut(Easing.cubic);
const pop = (f, t0, d) => {
  const dd = d || 12;
  return {
    s: interpolate(f, [t0, t0 + dd * 0.58, t0 + dd], [0.3, 1.08, 1], { ...CL, easing: EO }),
    o: interpolate(f, [t0, t0 + 3], [0, 1], CL),
  };
};
const prog = (f, a, b, e) => interpolate(f, [a, b], [0, 1], { ...CL, easing: e || EO });
const TORN = "polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)";
const TORN2 = "polygon(0% 6%,14% 0%,30% 5%,46% 1%,61% 6%,77% 0%,90% 4%,100% 1%,99% 95%,86% 100%,71% 95%,55% 100%,39% 96%,24% 100%,9% 95%,0% 99%)";
const SHADOW = "4px 6px 0 rgba(23,20,17,0.22)";
const RULED = "repeating-linear-gradient(0deg,transparent,transparent 11px,#D9D6D1 12px,transparent 13px)";
// cloud silhouette: circles + a flat base; drawn twice (stroked, then paper fill) so inner lines vanish
const CLOUD = [[64, 86, 34], [112, 58, 44], [162, 82, 36]];
const DUST = [[-0.5, -0.42, -1.2, -0.9], [0.52, -0.46, 1.3, -0.8], [-0.56, 0.44, -1.25, 0.9], [0.5, 0.46, 1.2, 1], [0, -0.55, 0.15, -1.3], [0.05, 0.56, -0.1, 1.3]];

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const acc = props.accent;
  const paper = props.paper;
  const gold = props.gold;
  const serif = props.serif;
  const hand = props.hand;
  const sans = props.sans;
  const f = frame;

  // ---------- timings ----------
  const tTag = 1;        // "Overall" (4)
  const tStamp = 37;     // "cooked" (45): slam lands f43
  const tLine = 47;      // underline draws after the slam
  const tMove = 150;     // "rely" (154): group shrinks left
  const tCloud = 174;    // "internet" (178)
  const tTagA = 184;     // tags hang under the cloud
  const tTagB = 189;
  const tX1 = 219;       // "streaming" (223)
  const tX2 = 265;       // "storage" (269)
  const tNo = 289;       // "cloud" (293)

  // ---------- A: tag + stamp ----------
  const tag = pop(f, tTag, 12);
  const tagR = interpolate(f, [tTag, tTag + 7, tTag + 12], [8, -3, -2], CL);
  const tagTxt = prog(f, tTag + 3, tTag + 13);

  const stO = interpolate(f, [tStamp, tStamp + 1], [0, 1], CL);
  const stS = interpolate(f, [tStamp, tStamp + 6, tStamp + 10], [1.15, 0.96, 1], { ...CL, easing: EI });
  const stR = interpolate(f, [tStamp, tStamp + 6, tStamp + 10], [-5, -1.4, -2], { ...CL, easing: EI });
  const stLift = interpolate(f, [tStamp, tStamp + 6], [16, 0], { ...CL, easing: EI });
  const shX = 4 + stLift;
  const shY = 6 + stLift * 1.4;
  const shO = 0.24 - stLift * 0.008;
  const dust = prog(f, tStamp + 5, tStamp + 15);
  const dustO = interpolate(f, [tStamp + 5, tStamp + 8, tStamp + 15], [0, 1, 0], CL);
  const line = prog(f, tLine, tLine + 14);

  // ---------- B: shrink left, cloud, tags, strikes ----------
  const mv = prog(f, tMove, tMove + 8, EIO);
  const grpS = 1 - 0.42 * mv;
  const grpX = -228 * mv;
  const grpY = -22 * mv;

  const cloud = pop(f, tCloud, 12);
  const cloudR = interpolate(f, [tCloud, tCloud + 7, tCloud + 12], [-6, 1.5, 1], CL);
  const tA = pop(f, tTagA, 11);
  const tB = pop(f, tTagB, 11);
  const strA = prog(f, tX1, tX1 + 6);
  const strB = prog(f, tX2, tX2 + 6);
  const bumpA = interpolate(f, [tX1, tX1 + 3, tX1 + 8], [1, 1.06, 1], CL);
  const bumpB = interpolate(f, [tX2, tX2 + 3, tX2 + 8], [1, 1.06, 1], CL);
  const ring = prog(f, tNo, tNo + 8);
  const slash = prog(f, tNo + 5, tNo + 11);
  const cloudDim = interpolate(f, [tNo + 4, tNo + 12], [1, 0.45], CL);
  const shake = interpolate(f, [tNo + 4, tNo + 6, tNo + 8, tNo + 10, tNo + 12], [0, -4, 3, -2, 0], CL);

  // ---------- styles ----------
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const abs = { position: "absolute" };
  const svgFull = { position: "absolute", left: 0, top: 0, width: 980, height: 500, overflow: "visible" };

  const group = { ...abs, left: 0, top: 0, width: 980, height: 500, transform: "translate(" + grpX + "px, " + grpY + "px) scale(" + grpS + ")", transformOrigin: "490px 250px" };

  const tagWrap = { ...abs, left: 74, top: 44, filter: "drop-shadow(" + SHADOW + ")", opacity: tag.o, transform: "rotate(" + tagR + "deg) scale(" + tag.s + ")", transformOrigin: "20% 80%" };
  const tagEdge = { backgroundColor: "rgba(23,20,17,0.2)", clipPath: TORN2, padding: 1.5 };
  const tagPaper = { backgroundColor: paper, clipPath: TORN2, padding: "6px 22px 6px 18px" };
  const tagText = { fontFamily: hand, fontWeight: 700, fontSize: 44, lineHeight: 1.2, color: ink, whiteSpace: "nowrap", clipPath: "inset(0 " + (100 - tagTxt * 100) + "% 0 0)" };

  const stampWrap = { ...abs, left: 80, top: 162, width: 820, height: 200, opacity: stO, transform: "rotate(" + stR + "deg) scale(" + stS + ")", transformOrigin: "50% 50%" };
  const stampInner = { position: "absolute", inset: 0 };
  const stampEdge = { ...abs, inset: -2, backgroundColor: "rgba(23,20,17,0.26)", clipPath: TORN };
  const stampPaper = { ...abs, inset: 0, backgroundColor: paper, backgroundImage: RULED, clipPath: TORN, display: "flex", alignItems: "center", justifyContent: "center" };
  const stampShadow = { ...abs, inset: 0, backgroundColor: "rgba(23,20,17," + shO + ")", clipPath: TORN, transform: "translate(" + shX + "px, " + shY + "px)" };
  const word = { fontFamily: serif, fontWeight: 900, fontSize: 140, lineHeight: 1, letterSpacing: 2, color: ink, whiteSpace: "nowrap", marginTop: -6 };

  const cloudWrap = { ...abs, left: 538, top: 50, width: 304, height: 200, opacity: cloud.o, transform: "rotate(" + cloudR + "deg) scale(" + cloud.s + ") translate(" + shake + "px, 0)", transformOrigin: "50% 60%" };

  const hangTag = (p, left, top, rot, bump) => ({ ...abs, left: left, top: top, filter: "drop-shadow(" + SHADOW + ")", opacity: p.o, transform: "rotate(" + rot + "deg) scale(" + (p.s * bump) + ")", transformOrigin: "50% 0%" });
  const hangPaper = { backgroundColor: paper, clipPath: TORN2, padding: "6px 22px 6px 20px" };
  const hangText = { fontFamily: hand, fontWeight: 700, fontSize: 42, lineHeight: 1.2, color: ink, whiteSpace: "nowrap" };
  const strike = (p) => <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ ...abs, left: -6, top: "38%", width: "calc(100% + 12px)", height: 22, overflow: "visible" }}>
    <path d="M2 12 L98 7" fill="none" stroke={acc} strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} vectorEffect="non-scaling-stroke" />
    <path d="M6 15 L94 11" fill="none" stroke={acc} strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, p * 1.15 - 0.15)} opacity={p > 0.1 ? 0.8 : 0} vectorEffect="non-scaling-stroke" />
  </svg>;

  const cloudSvg = <svg viewBox="0 0 220 140" style={{ width: 304, height: 193, overflow: "visible", opacity: cloudDim }}>
    <g stroke={ink} strokeWidth="9" fill={paper} strokeLinejoin="round">
      {CLOUD.map((c, i) => <circle key={"s" + i} cx={c[0]} cy={c[1]} r={c[2]} />)}
      <rect x="62" y="84" width="138" height="38" rx="16" />
    </g>
    <g fill={paper}>
      {CLOUD.map((c, i) => <circle key={"f" + i} cx={c[0]} cy={c[1]} r={c[2]} />)}
      <rect x="62" y="84" width="138" height="38" rx="16" />
    </g>
    {/* data dots inside the cloud */}
    <g fill={ink} opacity="0.35">
      <circle cx="92" cy="92" r="5" /><circle cx="114" cy="92" r="5" /><circle cx="136" cy="92" r="5" />
    </g>
    <path d="M86 70 C96 58 128 58 138 70" fill="none" stroke={acc} strokeWidth="6" strokeLinecap="round" />
  </svg>;

  return <div style={rootStyle}>
    {/* A: verdict tag + COOKED stamp (grouped so the whole thing shrinks left on "rely") */}
    <div style={group}>
      <div style={tagWrap}>
        <div style={tagEdge}><div style={tagPaper}><div style={tagText}>the verdict</div></div></div>
      </div>
      <div style={stampWrap}>
        <div style={stampInner}>
          <div style={stampShadow} />
          <div style={stampEdge} />
          <div style={stampPaper}><div style={word}>COOKED</div></div>
        </div>
      </div>
      {/* ink dust at impact */}
      <svg viewBox="0 0 980 500" style={svgFull}>
        {DUST.map((d, i) => <circle key={i} cx={490 + d[0] * 820 + d[2] * 30 * dust} cy={262 + d[1] * 200 + d[3] * 26 * dust} r={6 - 3 * dust} fill={i % 2 ? gold : ink} opacity={dustO} />)}
        <path d="M166 396 Q330 376 490 394 T814 384" fill="none" stroke={acc} strokeWidth="13" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - line} opacity={line > 0 ? 1 : 0} />
      </svg>
    </div>

    {/* B: cloud with hanging tags */}
    <div style={cloudWrap}>{cloudSvg}</div>
    <div style={hangTag(tA, 468, 324, -2, bumpA)}>
      <div style={tagEdge}><div style={hangPaper}><div style={hangText}>streaming</div></div></div>
      {strike(strA)}
    </div>
    <div style={hangTag(tB, 752, 332, 2.5, bumpB)}>
      <div style={tagEdge}><div style={hangPaper}><div style={hangText}>storage</div></div></div>
      {strike(strB)}
    </div>
    {/* strings from the cloud to the tags */}
    <svg viewBox="0 0 980 500" style={svgFull}>
      <path d="M640 236 L600 326" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity={0.5 * tA.o} strokeDasharray="6 7" />
      <path d="M742 236 L850 334" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity={0.5 * tB.o} strokeDasharray="6 7" />
      {/* no-entry ring and slash over the cloud on "cloud" */}
      <g transform={"translate(" + shake + " 0)"}>
        <circle cx="690" cy="150" r="124" fill="none" stroke={acc} strokeWidth="12" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - ring} opacity={ring > 0 ? 1 : 0} transform="rotate(-120 690 150)" />
        <path d="M602 62 L778 238" fill="none" stroke={acc} strokeWidth="12" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - slash} opacity={slash > 0 ? 1 : 0} />
      </g>
    </svg>
  </div>;
};
