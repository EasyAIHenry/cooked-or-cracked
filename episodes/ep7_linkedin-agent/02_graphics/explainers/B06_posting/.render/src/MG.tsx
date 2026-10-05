// @ts-nocheck
import React from 'react';
import { useCurrentFrame, interpolate, spring, Easing, interpolateColors, random, AbsoluteFill } from 'remotion';
// B06 "What it helped me to do is directly on my LinkedIn, it actually does help me do the posting
//      when I put one video, one photo and a poster inside."  Canvas 980x500, 231 frames. ChatCut MG (Remotion runtime).
// A paper Claude chat window pops ("What it helped me"), slides left ("directly") as a straight arrow shoots right,
// Henry's LinkedIn tile pops at its end ("LinkedIn"). Claude writes a post draft inside the chat ("actually does help me"),
// the draft flies along the arrow and lands as the live LinkedIn post while the "in" tile tucks onto it as its badge and a
// POSTED stamp slams on ("posting"). Then the chat shows what went in: Henry's message bubble opens ("put") and a video,
// a photo and a poster drop into it on each word; as the photo and the poster land, the same images in the live post flash
// and get a tick (input -> output). Final state (inputs -> Claude -> live post) holds still from f215.
const CB = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const OUT = Easing.out(Easing.cubic);
const INOUT = Easing.inOut(Easing.cubic);
const SHADOW = "4px 6px 0 rgba(23,20,17,0.22)";
const RAYS = [[0, 45], [31, 37], [62, 46], [92, 38], [121, 45], [152, 36], [182, 46], [211, 37], [242, 45], [271, 37], [302, 46], [331, 38]];
const POST_TEXT = "Lysander shot a sitcom alone on his sofa. AI replaced the set, the props and the cast.";
// layout
const CW = 460;            // chat window width
const CH = 430;            // chat window height
const CHAT_Y = 31;
const CARD_X = 596;        // live post (400x404 laid out, shown at 0.88)
const CARD_Y = 24;
const CARD_S = 0.88;
const DRAFT_S = 0.64;      // draft size inside the chat
const DRAFT_L = 60;        // draft position inside the chat window
const DRAFT_T = 76;
const TILE_X = 672;        // LinkedIn tile while it waits
const TILE_Y = 175;
// class photo as simple shapes: [cx, headY, r, body] body: 0 ink, 1 paper, 2 grey, 3 accent
const BACK = [[49.5, 49, 11, 2], [89, 45, 11, 0], [128.5, 48, 11, 1], [168, 45, 11, 2]];
const FRONT = [[30, 97, 13, 0], [69.5, 95, 13, 1], [109, 98, 13, 3], [148.5, 96, 13, 0], [188, 97, 13, 2]];

// overshoot pop, returns a style fragment
const popAt = (f, s, r0, r1, peak) => {
  const t = f - s;
  const pk = peak === undefined ? 1.08 : peak;
  const sc = interpolate(t, [0, 7, 12], [0.3, pk, 1], CB);
  const rt = interpolate(t, [0, 7, 12], [r0, r1 - (r0 - r1) * 0.08, r1], CB);
  return { opacity: interpolate(t, [0, 3], [0, 1], CB), transform: "rotate(" + rt + "deg) scale(" + sc + ")" };
};

const Spark = ({ size, color, sw, rot }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", transform: "rotate(" + rot + "deg)" }}>
    {RAYS.map(([a, L], i) => {
      const r = (a * Math.PI) / 180;
      return <line key={i} x1={50 + Math.cos(r) * 7} y1={50 + Math.sin(r) * 7} x2={50 + Math.cos(r) * L} y2={50 + Math.sin(r) * L} stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    })}
  </svg>
);

// The real poster, laid out at 140x190 (the post shows it 1:1, the chat a mini copy)
const PosterArt = ({ props }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 140, height: 190, backgroundColor: props.ink }}>
    <div style={{ position: "absolute", left: 12, top: 12, fontFamily: props.serif, fontWeight: 900, fontSize: 27, lineHeight: "27px", color: props.paper }}>The AI<br />Driving<br />License</div>
    <div style={{ position: "absolute", left: 12, top: 100, width: 84, height: 38, border: "2px solid rgba(255,254,250,0.4)", borderRadius: 3 }} />
    <div style={{ position: "absolute", left: 12, top: 144, fontFamily: props.serif, fontWeight: 900, fontSize: 23, lineHeight: "26px", color: props.gold, whiteSpace: "nowrap" }}>Mon 5 Oct</div>
    <div style={{ position: "absolute", left: 12, top: 176, width: 84, height: 4, borderRadius: 2, backgroundColor: "rgba(255,254,250,0.4)" }} />
  </div>
);

// The class group photo, laid out at 218x190 (same art in the post and in the chat)
const ClassPhoto = ({ props }) => {
  const ink = props.ink;
  const paper = props.paper;
  const fills = [ink, paper, "rgba(23,20,17,0.42)", props.accent];
  const people = (list, bw, k) => list.map(([cx, hy, r, b], i) => <g key={k + i}>
    <rect x={cx - bw / 2} y={hy + r - 4} width={bw} height={200 - hy} rx={bw * 0.34} fill={paper} />
    <rect x={cx - bw / 2} y={hy + r - 4} width={bw} height={200 - hy} rx={bw * 0.34} fill={fills[b]} stroke={ink} strokeWidth="2" />
    <circle cx={cx} cy={hy} r={r} fill={ink} />
  </g>);
  return <div style={{ position: "absolute", left: 0, top: 0, width: 218, height: 190, backgroundColor: "rgba(23,20,17,0.1)" }}>
    <svg width="218" height="190" viewBox="0 0 218 190" style={{ position: "absolute", left: 0, top: 0 }}>
      {people(BACK, 30, "b")}
      {people(FRONT, 40, "f")}
    </svg>
  </div>;
};

// Input -> output link: accent outline + tick flash on a post image when the same file lands in the chat
const Hilite = ({ t, props }) => {
  if (t < 0) return null;
  const bw = interpolate(t, [0, 6], [10, 4], { ...CB, easing: OUT });
  const flash = interpolate(t, [0, 1, 7], [0, 0.6, 0], CB);
  return <>
    <div style={{ position: "absolute", inset: 0, backgroundColor: props.paper, opacity: flash }} />
    <div style={{ position: "absolute", inset: 0, border: bw + "px solid " + props.accent, borderRadius: 4, boxSizing: "border-box", opacity: interpolate(t, [0, 2], [0, 1], CB) }} />
  </>;
};
// tick badge that sits on the top edge of a post image
const Tick = ({ t, x, y, props }) => {
  if (t < 0) return null;
  const tk = popAt(t, 0, -40, 0, 1.18);
  return <div style={{ position: "absolute", left: x - 17, top: y - 17, width: 34, height: 34, ...tk }}>
    <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15" fill={props.accent} stroke={props.ink} strokeWidth="2.5" /><path d="M10 17.5 L15 22.5 L24 11.5" fill="none" stroke={props.ink} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>;
};

// The LinkedIn post, laid out at full size 400x404 (scaled by its parent).
const PostCard = ({ props, chars, caret, head, skel, poster, photo, foot, hiPoster, hiPhoto }) => {
  const ink = props.ink;
  const acc = props.accent;
  const grey = "rgba(23,20,17,0.45)";
  return <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: 404 }}>
    {/* header */}
    <div style={{ position: "absolute", left: 18, top: 18, width: 52, height: 52, borderRadius: 26, backgroundColor: acc, border: "3px solid " + ink, boxSizing: "border-box", overflow: "hidden", ...head }}>
      <svg width="46" height="46" viewBox="0 0 46 46" style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx="23" cy="18" r="8.5" fill={ink} />
        <path d="M5 48 Q23 22 41 48 Z" fill={ink} />
      </svg>
    </div>
    <div style={{ position: "absolute", left: 82, top: 18, fontFamily: props.sans, fontWeight: 800, fontSize: 21, lineHeight: "28px", color: ink, whiteSpace: "nowrap", ...head }}>Henry Chua</div>
    <div style={{ position: "absolute", left: 82, top: 46, display: "flex", alignItems: "center", gap: 6, fontFamily: props.sans, fontWeight: 800, fontSize: 15, lineHeight: "20px", color: grey, whiteSpace: "nowrap", ...head }}>
      <span>now ·</span>
      <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="none" stroke={grey} strokeWidth="2" /><path d="M1.5 8 H14.5 M8 1.5 Q4 8 8 14.5 Q12 8 8 1.5" fill="none" stroke={grey} strokeWidth="1.6" /></svg>
    </div>
    {/* post text, typed while Claude writes */}
    <div style={{ position: "absolute", left: 18, top: 82, width: 364, fontFamily: props.sans, fontWeight: 800, fontSize: 16, lineHeight: "22px", color: "rgba(23,20,17,0.8)" }}>{POST_TEXT.slice(0, chars)}<span style={{ display: "inline-block", width: 4, height: 18, marginLeft: 2, verticalAlign: -3, backgroundColor: acc, opacity: caret }} /></div>
    {/* media skeletons while the draft is being written */}
    <div style={{ position: "absolute", left: 18, top: 158, width: 140, height: 190, borderRadius: 4, backgroundColor: "rgba(23,20,17,0.1)", opacity: skel }} />
    <div style={{ position: "absolute", left: 164, top: 158, width: 218, height: 190, borderRadius: 4, backgroundColor: "rgba(23,20,17,0.1)", opacity: skel }} />
    {/* poster thumbnail: The AI Driving License */}
    <div style={{ position: "absolute", left: 18, top: 158, width: 140, height: 190, borderRadius: 4, overflow: "hidden", transformOrigin: "50% 60%", ...poster }}>
      <PosterArt props={props} />
      <Hilite t={hiPoster} props={props} />
    </div>
    {/* class photo thumbnail */}
    <div style={{ position: "absolute", left: 164, top: 158, width: 218, height: 190, borderRadius: 4, overflow: "hidden", transformOrigin: "50% 60%", ...photo }}>
      <ClassPhoto props={props} />
      <Hilite t={hiPhoto} props={props} />
    </div>
    <Tick t={hiPoster} x={136} y={152} props={props} />
    <Tick t={hiPhoto} x={360} y={152} props={props} />
    {/* action bar */}
    <div style={{ position: "absolute", left: 18, top: 358, width: 364, height: 2, backgroundColor: "rgba(23,20,17,0.12)", opacity: foot }} />
    <div style={{ position: "absolute", left: 18, top: 368, width: 320, display: "flex", justifyContent: "space-between", fontFamily: props.sans, fontWeight: 800, fontSize: 14, lineHeight: "20px", color: grey, opacity: foot }}>
      <span>Like</span><span>Comment</span><span>Repost</span><span>Send</span>
    </div>
  </div>;
};

// File card that drops into Henry's message bubble on its word (short drop, lands lifted then presses down)
const dropAt = (f, s, r0, r1, dist) => {
  const t = f - s;
  const sp = spring({ frame: t, fps: 30, config: { damping: 14, stiffness: 190, mass: 0.8 } });
  const y = -dist * (1 - sp);
  const rt = r0 + (r1 - r0) * sp;
  const sc = 1 + 0.1 * (1 - sp);
  const lift = interpolate(t, [0, 6], [1, 0], CB);
  return {
    opacity: interpolate(t, [0, 3], [0, 1], CB),
    transform: "translateY(" + y + "px) rotate(" + rt + "deg) scale(" + sc + ")",
    boxShadow: (4 + 7 * lift) + "px " + (6 + 10 * lift) + "px 0 rgba(23,20,17," + (0.22 - 0.06 * lift) + ")",
  };
};

// Handwritten label that writes on left to right
const writeOn = (f, s) => {
  const p = interpolate(f - s, [0, 4], [0, 1], { ...CB, easing: OUT });
  return { opacity: p > 0 ? 1 : 0, clipPath: p >= 1 ? "none" : "inset(-10px " + (100 - p * 100) + "% -10px -10px)" };
};

const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const ink = props.ink;
  const paper = props.paper;
  const acc = props.accent;

  // ---- chat window: pops centred ("What it helped me"), slides left on "directly"
  const chatPop = popAt(frame, 0, -5, -1, 1.04);
  const slide = interpolate(frame, [33, 44], [0, 1], { ...CB, easing: OUT });
  const chatX = (980 - CW) / 2 + (22 - (980 - CW) / 2) * slide;
  const chatY = CHAT_Y;
  const sparkRot = interpolate(frame, [8, 22], [-120, 0], { ...CB, easing: OUT });
  const sparkSc = interpolate(frame, [8, 15, 20], [0.4, 1.15, 1], CB);
  const greet = interpolate(frame, [8, 16], [0, 1], CB) * interpolate(frame, [75, 80], [1, 0], CB);

  // ---- arrow ("directly") and LinkedIn tile ("my LinkedIn")
  const draw = interpolate(frame, [38, 48], [0, 1], { ...CB, easing: OUT });
  const headOp = interpolate(frame, [46, 48], [0, 1], CB);
  const tileIn = popAt(frame, 57, 14, 3);
  const tileFly = interpolate(frame, [119, 130], [0, 1], { ...CB, easing: INOUT });
  const tEndX = CARD_X + 336 * CARD_S;
  const tEndY = CARD_Y + 18 * CARD_S;
  const tEndS = (46 * CARD_S) / 150;
  const tileX = TILE_X + (tEndX - TILE_X) * tileFly;
  const tileY = TILE_Y + (tEndY - TILE_Y) * tileFly;
  const tileS = 1 + (tEndS - 1) * tileFly;
  const tileR = 3 * (1 - tileFly);

  // ---- Claude writes the post ("it actually does help me")
  const draftPop = interpolate(frame, [81, 88, 93], [0.3, 1.06, 1], CB);
  const draftOp = interpolate(frame, [81, 84], [0, 1], CB);
  const avatar = popAt(frame, 81, -40, 0);
  const caret = frame >= 89 && frame < 116 ? 1 : 0;
  const avatarOut = interpolate(frame, [119, 123], [1, 0], CB);
  const head = popAt(frame, 85, 0, 0);
  const chars = Math.round(interpolate(frame, [89, 112], [0, POST_TEXT.length], CB));
  const posterS = popAt(frame, 108, -6, 0);
  const photoS = popAt(frame, 113, 6, 0);
  const foot = interpolate(frame, [116, 120], [0, 1], CB);
  const skel = interpolate(frame, [85, 89], [0, 1], CB) * interpolate(frame, [114, 119], [1, 0], CB);

  // ---- "posting": the draft flies along the arrow and lands as the live post
  const fly = interpolate(frame, [119, 131], [0, 1], { ...CB, easing: INOUT });
  const popOff = 1 - draftPop; // keep the draft's pop centred on itself
  const dX = chatX + 3 + DRAFT_L + popOff * 200 * DRAFT_S;
  const dY = chatY + 3 + DRAFT_T + popOff * 202 * DRAFT_S;
  const cardX = dX + (CARD_X - dX) * fly;
  const cardY = dY + (CARD_Y - dY) * fly - Math.sin(Math.PI * fly) * 46;
  const cardS = (DRAFT_S + (CARD_S - DRAFT_S) * fly) * interpolate(frame, [129, 133, 138], [1, 1.02, 1], CB) * draftPop;
  const cardR = interpolate(frame, [119, 125, 131, 136], [-1, 3, -0.6, 0], CB);
  const lift = Math.sin(Math.PI * fly);
  const cardShadow = (4 + 8 * lift) + "px " + (6 + 12 * lift) + "px 0 rgba(23,20,17," + (0.22 - 0.06 * lift) + ")";
  // POSTED stamp: hard slam, fully opaque on its first frame, presses down then settles
  const stampT = frame - 131;
  const stampSc = interpolate(stampT, [0, 4, 8], [1.1, 0.97, 1], CB);
  const stampRt = interpolate(stampT, [0, 4, 8], [-6, -3.5, -4], CB);
  const sLift = interpolate(stampT, [0, 4, 8], [1, -0.6, 0], CB);
  const stampShadow = (4 + 3 * sLift) + "px " + (6 + 4 * sLift) + "px 0 rgba(23,20,17,0.22)";
  const posted = interpolate(frame, [130, 137], [0, 1], { ...CB, easing: OUT });

  // ---- "when I put one video, one photo and a poster inside"
  const bubble = interpolate(frame, [152, 158, 162], [0.6, 1.03, 1], CB);
  const bubbleOp = interpolate(frame, [152, 155], [0, 1], CB);
  const vid = dropAt(frame, 159, -14, -3, 60);
  const pho = dropAt(frame, 180, 12, 2, 56);
  const pos = dropAt(frame, 198, -10, -2, 44);
  const lblV = writeOn(frame, 164);
  const lblP = writeOn(frame, 184);
  const lblS = writeOn(frame, 202);
  const hiPhoto = frame - 185;
  const hiPoster = frame - 203;

  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", overflow: "hidden" };
  const lbl = { position: "absolute", top: 158, transform: "translateX(-50%)", padding: "0 6px", fontFamily: props.hand, fontWeight: 700, fontSize: 34, lineHeight: "40px", color: ink, whiteSpace: "nowrap" };

  return <div style={rootStyle}>
    {/* arrow: Claude -> LinkedIn, straight ("directly") */}
    <svg width="980" height="500" viewBox="0 0 980 500" style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M500 250 H566" fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round" strokeDasharray="72" strokeDashoffset={72 * (1 - draw)} />
      <path d="M550 234 L570 250 L550 266" fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity={headOp} />
    </svg>

    {/* Claude chat window */}
    <div style={{ position: "absolute", left: chatX, top: chatY, width: CW, height: CH, opacity: chatPop.opacity, transform: chatPop.transform }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: paper, border: "3px solid " + ink, borderRadius: 22, boxSizing: "border-box", boxShadow: SHADOW }}>
        {/* header */}
        <div style={{ position: "absolute", left: 16, top: 13, width: 36, height: 36, transform: "scale(" + sparkSc + ")" }}><Spark size={36} color={acc} sw={11} rot={sparkRot} /></div>
        <div style={{ position: "absolute", left: 60, top: 14, fontFamily: props.sans, fontWeight: 800, fontSize: 24, lineHeight: "34px", color: ink }}>Claude</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 2.5, backgroundColor: "rgba(23,20,17,0.14)" }} />
        {/* empty-chat greeting */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 178, textAlign: "center", fontFamily: props.serif, fontWeight: 900, fontSize: 28, lineHeight: "34px", color: "rgba(23,20,17,0.55)", opacity: greet }}>How can I help<br />you today?</div>
        {/* Claude avatar beside the draft */}
        <div style={{ position: "absolute", left: 16, top: 80, width: 32, height: 32, opacity: avatar.opacity * avatarOut, transform: avatar.transform }}><Spark size={32} color={acc} sw={11} rot={0} /></div>
        {/* Henry's message: the three files */}
        <div style={{ position: "absolute", left: 14, top: 72, width: 426, height: 208, borderRadius: 18, backgroundColor: "rgba(23,20,17,0.06)", transformOrigin: "100% 0%", opacity: bubbleOp, transform: "scale(" + bubble + ")" }}>
          {/* video */}
          <div style={{ position: "absolute", left: 11, top: 48, width: 145, height: 107, borderRadius: 12, backgroundColor: ink, overflow: "hidden", ...vid }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 122, height: 90, transformOrigin: "0% 0%", transform: "scale(" + (145 / 122) + ")" }}>
              {[0, 1, 2, 3, 4, 5].map((i) => <div key={"t" + i} style={{ position: "absolute", left: 9 + i * 19, top: 6, width: 10, height: 7, borderRadius: 2, backgroundColor: "rgba(255,254,250,0.8)" }} />)}
              {[0, 1, 2, 3, 4, 5].map((i) => <div key={"u" + i} style={{ position: "absolute", left: 9 + i * 19, top: 77, width: 10, height: 7, borderRadius: 2, backgroundColor: "rgba(255,254,250,0.8)" }} />)}
              <svg width="122" height="90" viewBox="0 0 122 90" style={{ position: "absolute", left: 0, top: 0 }}>
                <circle cx="61" cy="45" r="21" fill={acc} />
                <path d="M54 34 L71 45 L54 56 Z" fill={paper} stroke={paper} strokeWidth="3" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ ...lbl, left: 83.5, ...lblV }}>video</div>
          {/* photo: mini copy of the class photo in the post */}
          <div style={{ position: "absolute", left: 168, top: 39, width: 132, height: 116, borderRadius: 8, backgroundColor: paper, border: "3px solid " + ink, boxSizing: "border-box", overflow: "hidden", ...pho }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 218, height: 190, transformOrigin: "0% 0%", transform: "scale(" + (126 / 218) + ")" }}><ClassPhoto props={props} /></div>
          </div>
          <div style={{ ...lbl, left: 234, ...lblP }}>photo</div>
          {/* poster: mini copy of the real poster in the post */}
          <div style={{ position: "absolute", left: 312, top: 14, width: 104, height: 141, borderRadius: 6, backgroundColor: ink, overflow: "hidden", ...pos }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 140, height: 190, transformOrigin: "0% 0%", transform: "scale(" + (104 / 140) + ")" }}><PosterArt props={props} /></div>
          </div>
          <div style={{ ...lbl, left: 364, ...lblS }}>poster</div>
        </div>
        {/* Claude's reply after posting */}
        <div style={{ position: "absolute", left: 16, top: 296, display: "flex", alignItems: "center", gap: 10, opacity: posted, transform: "translateY(" + (10 * (1 - posted)) + "px)" }}>
          <Spark size={32} color={acc} sw={11} rot={0} />
          <span style={{ fontFamily: props.sans, fontWeight: 800, fontSize: 20, lineHeight: "28px", color: ink, whiteSpace: "nowrap" }}>Posted to LinkedIn</span>
          <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill={acc} stroke={ink} strokeWidth="2.5" /><path d="M8 14.5 L12.3 18.5 L20 9.8" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        {/* composer */}
        <div style={{ position: "absolute", left: 14, top: 356, width: 426, height: 50, border: "2.5px solid rgba(23,20,17,0.3)", borderRadius: 16, boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 16, top: 10, fontFamily: props.sans, fontWeight: 800, fontSize: 16, lineHeight: "24px", color: "rgba(23,20,17,0.35)" }}>Message Claude</div>
          <svg width="34" height="34" viewBox="0 0 34 34" style={{ position: "absolute", right: 6, top: 5 }}><circle cx="17" cy="17" r="16" fill={acc} /><path d="M17 25 V10 M11 15.5 L17 9.5 L23 15.5" fill="none" stroke={paper} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>

    {/* the post: a draft inside the chat, then live on LinkedIn */}
    <div style={{ position: "absolute", left: cardX, top: cardY, width: 400, height: 404, transformOrigin: "0% 0%", opacity: draftOp, transform: "rotate(" + cardR + "deg) scale(" + cardS + ")" }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: paper, border: "3px solid " + ink, borderRadius: 16, boxSizing: "border-box", boxShadow: cardShadow }} />
      <PostCard props={props} chars={chars} caret={caret} head={head} skel={skel} poster={posterS} photo={photoS} foot={foot} hiPoster={hiPoster} hiPhoto={hiPhoto} />
    </div>

    {/* LinkedIn tile: waits big, then tucks onto the post as its badge */}
    <div style={{ position: "absolute", left: tileX, top: tileY, width: 150, height: 150, transformOrigin: "0% 0%", transform: "scale(" + tileS + ")" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, backgroundColor: ink, boxShadow: SHADOW, opacity: tileIn.opacity, transform: tileIn.transform + " rotate(" + (tileR - 3) + "deg)" }}>
        <div style={{ position: "absolute", right: 18, bottom: 6, fontFamily: props.sans, fontWeight: 800, fontSize: 98, lineHeight: 1, letterSpacing: -3, color: paper }}>in</div>
      </div>
    </div>

    {/* POSTED stamp */}
    <div style={{ position: "absolute", left: 528, top: 337, width: 400, height: 106, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: paper, border: "5px solid " + acc, borderRadius: 12, boxSizing: "border-box", boxShadow: stampShadow, transformOrigin: "50% 50%", opacity: stampT >= 0 ? 1 : 0, transform: "rotate(" + stampRt + "deg) scale(" + stampSc + ")" }}>
      <div style={{ position: "absolute", left: 5, top: 5, right: 5, bottom: 5, border: "2.5px solid " + acc, borderRadius: 6 }} />
      <span style={{ fontFamily: props.serif, fontWeight: 900, fontSize: 80, lineHeight: "80px", letterSpacing: 3, color: acc, marginTop: 4 }}>POSTED</span>
    </div>
  </div>;
};

export default Component;
