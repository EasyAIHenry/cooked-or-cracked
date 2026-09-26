# Shared MG building blocks (paste into every graphic)
const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const tornClip = "polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)";
const ruled = "repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)";
// pop-in: opacity 0→1 over 4f, scale 0.3→1.1→1 over 13f, rotate baseRot*6 → -baseRot/2 → baseRot
const pop = (delay, baseRot) => { const t = frame - delay;
  return { opacity: interpolate(t,[0,4],[0,1],clampBoth),
           transform: "rotate(" + interpolate(t,[0,7,13],[baseRot*6,-baseRot*0.5,baseRot],clampBoth) + "deg) scale(" + interpolate(t,[0,7,13],[0.3,1.1,1],clampBoth) + ")" }; };
// orange underline: <svg viewBox="0 0 600 40"><path d="M18 24 Q160 8 300 20 T582 14" stroke=accent strokeWidth=13 strokeLinecap=round strokeDasharray=640 strokeDashoffset={640*(1-draw)}/></svg>, draw over frames 20→38

# Assets in project "Cooked or Cracked — Ep1 v4 (Cindy passes)" to copy code from (inspect_asset includeCode:true):
- Paper stamp — v4 with icon badge (1000x400, props label/word/wordSize/wordColor/icon)
- Compare table — header (v4) / row (v4) (1000x130 / 1000x150, d1..d3 delays, winner)
- Pricing tiers card (1000x440)
- Scoreboard — Cooked / Cracked checkboxes (260x230, tickAt)
- Confetti burst — paper (1080x1920, 130f)
- Pill caption, Window frame, Higgsfield logo tag
Rule from the MG contract: no useVideoConfig on Desktop exports, no imports, root <div style={rootStyle}>, precompute values, props from item.props with no fallbacks.
