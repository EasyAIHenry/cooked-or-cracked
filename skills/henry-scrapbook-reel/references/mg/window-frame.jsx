// Window frame — white border + shadow. Portrait canvas 640x1107; the landscape twin is the same code on a 640x360 canvas. Duration 100000000 (extend before a long stretch).
// Transparent centre, thick white rounded border, soft drop shadow. Sits over the reviewed-reel window and every screen-recording window. One continuous item per window position.
// Props: border 12 (4-30; landscape default 14), radius 28 (0-80; landscape 30), paper #FFFFFF
// Sizing rule: the frame box is the video plus 12 to 14 px on every side; border prop = wanted border px / (frame width / 640).
//   300x533 window -> 324x557 frame, border 24, radius 59.   380x676 opener reel -> 408x704 frame, border 22, radius 53.
// Moving or resizing the item can wipe propertyOverrides; re-set them and check with inspect_item.
const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const props = item.props || {};
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const op = interpolate(frame, [0, 4], [0, 1], clampBoth);
  const sc = interpolate(frame, [0, 7, 13], [0.6, 1.03, 1], clampBoth);
  const rootStyle = { position: "absolute", inset: 0, backgroundColor: "transparent", opacity: op, transform: "scale(" + sc + ")" };
  const frameStyle = { position: "absolute", inset: 0, boxSizing: "border-box", border: props.border + "px solid " + props.paper, borderRadius: props.radius, boxShadow: "0 24px 60px rgba(0,0,0,0.35)" };
  return <div style={rootStyle}><div style={frameStyle} /></div>;
};
