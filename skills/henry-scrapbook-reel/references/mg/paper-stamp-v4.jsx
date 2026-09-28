// Paper stamp — v4 with icon badge. Canvas 1000x400, 10 s. ChatCut motion-graphic (Remotion runtime).
// Key-word stamp: Kalam label + big Fraunces word on torn ruled paper, orange underline draws in, round paper icon badge top-left.
// Props: serif "Fraunces", hand "Kalam", paper #FFFEFA, ink #171411, accent #DF825F, wordColor #171411,
//        label "five free", word "DESIGN TOOLS", wordSize 150 (70-200), icon: api|table|money|image|video|calendar|trophy|check|comment|person|plugin|rocket|none
// Placed: top zone 820x328 at 130/228, or bottom zone 760x304 at 120/1130 while a table is up. Bubble pop on entrance.
// Create with create_motion_graphic_from_code (width 1000, height 400, duration 10000000) and the property list above.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const op1 = interpolate(frame, [0, 4], [0, 1], clampBoth);
  const sc1 = interpolate(frame, [0, 7, 13], [0.3, 1.08, 1], clampBoth);
  const rt1 = interpolate(frame, [0, 7, 13], [10, -1, 2], clampBoth);
  const op2 = interpolate(frame, [6, 10], [0, 1], clampBoth);
  const sc2 = interpolate(frame, [6, 14, 21], [0.2, 1.08, 1], clampBoth);
  const rt2 = interpolate(frame, [6, 14, 21], [-14, 1, -2], clampBoth);
  const draw = interpolate(frame, [20, 38], [0, 1], clampBoth);
  const dash = 640 * (1 - draw);
  const opB = interpolate(frame, [4, 8], [0, 1], clampBoth);
  const scB = interpolate(frame, [4, 12, 20], [0.2, 1.1, 1], clampBoth);
  const rtB = interpolate(frame, [4, 12, 20], [-30, 5, -6], clampBoth);
  const tornClip = "polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)";
  const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
  const icon = props.icon;
  const ink = props.ink;
  const acc = props.accent;
  const sw = 2.2;
  const wordText = String(props.word);
  const fitSize = Math.min(props.wordSize, Math.floor(840 / (Math.max(wordText.length, 1) * 0.74)));
  let glyph = null;
  if (icon === "api") glyph = <path d="M13 2 L5 13 H11 L10 22 L19 10 H13 Z" fill={acc} stroke={ink} strokeWidth={sw} strokeLinejoin="round" />;
  else if (icon === "table") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 10 H21 M3 15 H21 M9 4 V20 M15 4 V20" /></g>;
  else if (icon === "money") glyph = <g><circle cx="12" cy="12" r="9" fill={acc} stroke={ink} strokeWidth={sw} /><text x="12" y="16.5" textAnchor="middle" fontFamily={props.serif} fontWeight="900" fontSize="13" fill={ink}>$</text></g>;
  else if (icon === "image") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.8" fill={acc} stroke="none" /><path d="M4 18 L10 12 L14 15.5 L17 13 L20 16" /></g>;
  else if (icon === "video") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><rect x="3" y="9" width="18" height="11" rx="1.5" /><path d="M3 9 L5 4 L21 6 L20 9" /><path d="M8 4.5 L10 8 M13 5 L15 8.5" /><path d="M10 12 L15 14.5 L10 17 Z" fill={acc} stroke="none" /></g>;
  else if (icon === "calendar") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10 H21 M8 3 V7 M16 3 V7" /><rect x="6" y="13" width="4" height="3" fill={acc} stroke="none" /><rect x="13" y="13" width="4" height="3" fill={ink} stroke="none" /></g>;
  else if (icon === "trophy") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><path d="M7 3 H17 V9 A5 5 0 0 1 7 9 Z" fill={acc} /><path d="M7 5 H4 V7 A3 3 0 0 0 7 10 M17 5 H20 V7 A3 3 0 0 1 17 10" /><path d="M12 14 V17 M8 20 H16 M9 17 H15 V20 H9 Z" /></g>;
  else if (icon === "check") glyph = <g><circle cx="12" cy="12" r="9" fill={acc} stroke={ink} strokeWidth={sw} /><path d="M7 12.5 L10.5 16 L17 8.5" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
  else if (icon === "comment") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><path d="M4 5 H20 V16 H11 L7 20 V16 H4 Z" fill={props.paper} /><circle cx="8.5" cy="10.5" r="1.2" fill={ink} stroke="none" /><circle cx="12" cy="10.5" r="1.2" fill={ink} stroke="none" /><circle cx="15.5" cy="10.5" r="1.2" fill={acc} stroke="none" /></g>;
  else if (icon === "person") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><circle cx="12" cy="8" r="4" fill={acc} /><path d="M4 21 A8 8 0 0 1 20 21 Z" /></g>;
  else if (icon === "plugin") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><path d="M5 9 H9 A2.5 2.5 0 1 1 13 9 H17 V13 A2.5 2.5 0 1 0 17 17 V21 H5 Z" fill={acc} /></g>;
  else if (icon === "rocket") glyph = <g stroke={ink} strokeWidth={sw} fill="none"><path d="M12 2 C16 5 17 11 15 16 H9 C7 11 8 5 12 2 Z" fill={props.paper} /><circle cx="12" cy="9" r="1.8" fill={acc} stroke="none" /><path d="M9 14 L5 18 L9 17 M15 14 L19 18 L15 17 M10.5 16 L12 21 L13.5 16" /></g>;
  const showBadge = icon !== "none";
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 8 };
  const labelStyle = { fontFamily: props.hand, fontSize: 60, fontWeight: 700, lineHeight: 1.2, color: props.ink, backgroundColor: props.paper, padding: "4px 26px", clipPath: tornClip, opacity: op1, transform: "rotate(" + rt1 + "deg) scale(" + sc1 + ")" };
  const wordStyle = { fontFamily: props.serif, fontSize: fitSize, fontWeight: 900, lineHeight: 1.05, letterSpacing: 2, color: props.wordColor, backgroundColor: props.paper, backgroundImage: ruled, padding: "0px 36px", maxWidth: 940, textAlign: "center", whiteSpace: "nowrap", clipPath: tornClip, opacity: op2, transform: "rotate(" + rt2 + "deg) scale(" + sc2 + ")" };
  const ruleStyle = { width: 640, height: 40, marginTop: 0 };
  const badgeStyle = { position: "absolute", left: 16, top: 8, width: 96, height: 96, borderRadius: 48, backgroundColor: props.paper, boxShadow: "4px 5px 0 rgba(23,20,17,0.35)", display: showBadge ? "flex" : "none", alignItems: "center", justifyContent: "center", opacity: opB, transform: "rotate(" + rtB + "deg) scale(" + scB + ")" };
  const svgStyle = { width: 64, height: 64 };
  return <div style={rootStyle}>
    <div style={labelStyle}>{props.label}</div>
    <div style={wordStyle}>{props.word}</div>
    <svg viewBox="0 0 600 40" style={ruleStyle}>
      <path d="M18 24 Q160 8 300 20 T582 14" fill="none" stroke={props.accent} strokeWidth="13" strokeLinecap="round" strokeDasharray="640" strokeDashoffset={dash} />
    </svg>
    <div style={badgeStyle}><svg viewBox="0 0 24 24" style={svgStyle}>{glyph}</svg></div>
  </div>;
};
