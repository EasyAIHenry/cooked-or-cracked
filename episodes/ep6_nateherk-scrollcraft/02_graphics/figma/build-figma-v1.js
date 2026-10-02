// Ep6 Supersystems: Figma build script (use_figma). Replayable for a recorded take.
const created = [];
await Promise.all([
  figma.loadFontAsync({ family: "Space Grotesk", style: "Bold" }),
  figma.loadFontAsync({ family: "JetBrains Mono", style: "Medium" }),
  figma.loadFontAsync({ family: "JetBrains Mono", style: "Regular" }),
  figma.loadFontAsync({ family: "IBM Plex Sans", style: "Regular" }),
]);
const hex = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });

// ---- tokens
const tokens = { canvas: "#0A0B0D", "canvas-lit": "#0B131C", surface: "#14161A", line: "#262A31", ink: "#F3F2EF", "ink-soft": "#8B9099", accent: "#8FD8FF", "accent-ink": "#0A0B0D" };
const col = figma.variables.createVariableCollection("Supersystems tokens");
const modeId = col.modes[0].modeId;
const V = {};
for (const [k, v] of Object.entries(tokens)) {
  const vr = figma.variables.createVariable(`color/${k}`, col, "COLOR");
  vr.setValueForMode(modeId, hex(v));
  vr.scopes = ["ALL_FILLS", "STROKE_COLOR"];
  V[k] = vr;
}
const paint = k => figma.variables.setBoundVariableForPaint({ type: "SOLID", color: hex(tokens[k]) }, "color", V[k]);
const FONTS = { mono: { family: "JetBrains Mono", style: "Medium" }, monoR: { family: "JetBrains Mono", style: "Regular" }, display: { family: "Space Grotesk", style: "Bold" }, body: { family: "IBM Plex Sans", style: "Regular" } };
function txt(chars, o = {}) {
  const t = figma.createText();
  t.fontName = FONTS[o.font || "mono"]; t.fontSize = o.size || 13; t.characters = chars; t.fills = [paint(o.color || "ink")];
  if (o.lh) t.lineHeight = { unit: "PERCENT", value: o.lh };
  if (o.ls != null) t.letterSpacing = { unit: "PERCENT", value: o.ls };
  if (o.name) t.name = o.name;
  return t;
}
function AL(dir, name, o = {}) {
  const f = figma.createAutoLayout(dir, { name });
  f.fills = o.fill ? [paint(o.fill)] : [];
  if (o.gap != null) f.itemSpacing = o.gap;
  if (o.pad) { const [t, r, b, l] = o.pad; f.paddingTop = t; f.paddingRight = r; f.paddingBottom = b; f.paddingLeft = l; }
  return f;
}
function topRule(f, k = "line") { f.strokes = [paint(k)]; f.strokeTopWeight = 1; f.strokeBottomWeight = 0; f.strokeLeftWeight = 0; f.strokeRightWeight = 0; }
function bottomRule(f, k = "line") { f.strokes = [paint(k)]; f.strokeTopWeight = 0; f.strokeBottomWeight = 1; f.strokeLeftWeight = 0; f.strokeRightWeight = 0; }

// ---- component: Spec row (one schema for every label on the site)
const specRow = figma.createComponent();
specRow.name = "Spec row";
specRow.layoutMode = "HORIZONTAL"; specRow.itemSpacing = 16; specRow.paddingTop = 10; specRow.paddingBottom = 10;
specRow.resize(440, 40); specRow.primaryAxisSizingMode = "FIXED"; specRow.counterAxisSizingMode = "AUTO";
specRow.fills = []; topRule(specRow);
const kT = txt("CASE", { font: "mono", size: 12, color: "ink-soft", ls: 6, name: "Key" });
specRow.appendChild(kT); kT.resize(104, kT.height); kT.textAutoResize = "HEIGHT";
const vT = txt("HYTE Y60 Snow White", { font: "monoR", size: 13, name: "Value" });
specRow.appendChild(vT); vT.textAutoResize = "HEIGHT"; vT.layoutSizingHorizontal = "FILL";
const KEY = specRow.addComponentProperty("Key", "TEXT", "CASE");
const VAL = specRow.addComponentProperty("Value", "TEXT", "HYTE Y60 Snow White");
kT.componentPropertyReferences = { characters: KEY };
vT.componentPropertyReferences = { characters: VAL };
specRow.x = -640; specRow.y = 0; specRow.description = "One label schema for every build: KEY in mono caps, value in mono regular, hairline above.";
created.push(specRow.id);
function row(parent, k, v) { const i = specRow.createInstance(); i.setProperties({ [KEY]: k, [VAL]: v }); parent.appendChild(i); i.layoutSizingHorizontal = "FILL"; return i; }

const imgNodes = {};
function imgRect(name, w, h) { const r = figma.createRectangle(); r.name = name; r.resize(w, h); r.fills = [paint("surface")]; imgNodes[name] = r; return r; }

// ---- page wrapper
const page = AL("VERTICAL", "Home, desktop 1440", { fill: "canvas" });
page.resize(1440, 100); page.primaryAxisSizingMode = "AUTO"; page.counterAxisSizingMode = "FIXED";
page.x = 0; page.y = 0; created.push(page.id);

// nav: index of builds
const nav = AL("HORIZONTAL", "Nav, index of builds", { pad: [22, 48, 22, 48] });
page.appendChild(nav); nav.layoutSizingHorizontal = "FILL"; nav.counterAxisAlignItems = "CENTER"; nav.primaryAxisAlignItems = "SPACE_BETWEEN"; bottomRule(nav);
nav.appendChild(txt("SUPERSYSTEMS", { font: "display", size: 18, ls: 8, name: "Wordmark" }));
const idx = AL("HORIZONTAL", "Index", { gap: 22 });
for (let n = 1; n <= 8; n++) idx.appendChild(txt(String(n).padStart(3, "0"), { font: "mono", size: 12, color: n === 1 ? "ink" : "ink-soft", ls: 4 }));
nav.appendChild(idx);
function cta(label, small) {
  const b = AL("HORIZONTAL", "CTA, book a showroom slot", { fill: "accent", pad: small ? [9, 14, 9, 14] : [13, 22, 13, 22] });
  b.cornerRadius = 999; b.appendChild(txt(label, { font: "mono", size: small ? 11 : 13, color: "accent-ink" })); return b;
}
nav.appendChild(cta("Book a showroom slot"));

// hero: Build 001
const PARTS = [["CASE", "HYTE Y60 Snow White"], ["CPU", "Ryzen 7 9800X3D"], ["BOARD", "MSI B850 Gaming Plus WiFi"], ["MEMORY", "32 GB Klevv Cras V, 7200 MHz"], ["COOLER", "Thermalright Stream Vision 360"], ["GPU", "Zotac RTX 5070 Ti Solid Core, white"], ["POWER", "Thermalright 850 W Gold"], ["FANS", "8 ARGB, white custom sleeve"]];
function buildHero(name, lit) {
  const hero = AL("HORIZONTAL", name, { fill: lit ? "canvas-lit" : "canvas", pad: [0, 80, 0, 80], gap: 96 });
  hero.counterAxisAlignItems = "CENTER";
  const sheet = AL("VERTICAL", "Label sheet", { gap: 28 });
  hero.appendChild(sheet); sheet.resize(520, 10); sheet.counterAxisSizingMode = "FIXED"; sheet.primaryAxisSizingMode = "AUTO";
  const head = AL("VERTICAL", "Head", { gap: 14 }); sheet.appendChild(head); head.layoutSizingHorizontal = "FILL";
  head.appendChild(txt("BUILD 001", { font: "mono", size: 13, color: "accent", ls: 10 }));
  const nm = txt("HYTE Y60,\nSnow White", { font: "display", size: 68, lh: 98, ls: -2, name: "Build name" }); head.appendChild(nm);
  const rows = AL("VERTICAL", "Spec rows", {}); sheet.appendChild(rows); rows.layoutSizingHorizontal = "FILL";
  for (const [k, v] of PARTS) row(rows, k, v);
  const st = AL("VERTICAL", "Status, parts in", { gap: 10 }); sheet.appendChild(st); st.layoutSizingHorizontal = "FILL";
  const stl = AL("HORIZONTAL", "Status line", {}); st.appendChild(stl); stl.layoutSizingHorizontal = "FILL"; stl.primaryAxisAlignItems = "SPACE_BETWEEN";
  stl.appendChild(txt(lit ? "POWERED ON" : "PARTS IN", { font: "mono", size: 12, color: lit ? "accent" : "ink-soft", ls: 6 }));
  stl.appendChild(txt(lit ? "8 / 8" : "0 / 8", { font: "mono", size: 12, color: "ink", ls: 6 }));
  const bar = AL("HORIZONTAL", "Parts bar", { gap: 6 }); st.appendChild(bar);
  for (let i = 0; i < 8; i++) { const s = figma.createRectangle(); s.resize(59, 6); s.fills = [paint(lit ? "accent" : "line")]; s.name = `Part ${i + 1}`; bar.appendChild(s); }
  const stage = imgRect(lit ? "IMG hero lit" : "IMG hero", 645, 860); stage.name += ", Seedance clip reversed (scrub)"; hero.appendChild(stage);
  return hero;
}
const hero = buildHero("Build 001, hero (scroll 0%)", false);
page.appendChild(hero); hero.layoutSizingHorizontal = "FILL"; hero.layoutSizingVertical = "FIXED"; hero.resize(1440, 900); hero.layoutSizingHorizontal = "FILL";

// collection rail
const COLL = [
  ["002", "Lian Li O11D EVO RGB Black", "Ryzen 7 9800X3D", "Zotac RTX 5080 AMP Extreme Infinity", "Arctic Liquid Freezer III 360"],
  ["003", "Lian Li O11 Vision Black", "Intel Core i7 14700K", "Zotac RTX 4080 Super AMP Extreme Airo", "NZXT Kraken Elite RGB 360"],
  ["004", "HYTE Y70 Touch Snow White", "Ryzen 7 7800X3D", "Asus ROG Strix RTX 4090, white", "Lian Li Hydroshift LCD 360R"],
  ["005", "Tecware VXL White", "Ryzen 7 7700X", "Zotac RTX 4070 Ti Trinity OC, white", "Lian Li Galahad II Trinity 360"],
  ["006", "HYTE Y60 Snow White, LCD kit", "Ryzen 7 7700", "Zotac RTX 5070 Solid OC", "Thermalright Warframe 360 Pro"],
  ["007", "Montech XR Black", "Ryzen 7 7700", "Zotac RTX 5060 Twin Edge OC", "Thermalright Peerless Assassin"],
  ["008", "Tecware Timber M Black", "Ryzen 5 5600GT", "Integrated Radeon Vega", "Stock cooler"],
];
const coll = AL("VERTICAL", "Collection, builds 002 to 008", { pad: [120, 0, 120, 80], gap: 40 });
page.appendChild(coll); coll.layoutSizingHorizontal = "FILL"; topRule(coll);
const ch = AL("HORIZONTAL", "Collection head", { gap: 24 }); coll.appendChild(ch); ch.counterAxisAlignItems = "BASELINE";
ch.appendChild(txt("THE COLLECTION", { font: "mono", size: 12, color: "accent", ls: 10 }));
ch.appendChild(txt("Builds delivered across Singapore, 2023 to 2025.", { font: "body", size: 17, color: "ink-soft" }));
const rail = AL("HORIZONTAL", "Rail (pans sideways on scroll)", { gap: 28 });
coll.appendChild(rail); rail.primaryAxisSizingMode = "FIXED"; rail.resize(1360, 10); rail.counterAxisSizingMode = "AUTO"; rail.clipsContent = true;
for (const [n, cs, cpu, gpu, cool] of COLL) {
  const card = AL("VERTICAL", `Build ${n}`, { gap: 18 }); rail.appendChild(card);
  card.appendChild(imgRect(`IMG ${n}`, 340, 425));
  const lab = AL("VERTICAL", "Label", { gap: 0 }); card.appendChild(lab); lab.resize(340, 10); lab.counterAxisSizingMode = "FIXED"; lab.primaryAxisSizingMode = "AUTO";
  const t = txt(`BUILD ${n}`, { font: "mono", size: 12, color: "accent", ls: 10 }); lab.appendChild(t); lab.itemSpacing = 0;
  const gapF = figma.createFrame(); gapF.resize(10, 12); gapF.fills = []; gapF.name = "gap"; lab.appendChild(gapF);
  row(lab, "CASE", cs); row(lab, "CPU", cpu); row(lab, "GPU", gpu); row(lab, "COOLING", cool);
}

// shop facts, set as labels
const FACTS = [["GOOGLE RATING, 523 REVIEWS", "5.0"], ["DELIVERY, ISLANDWIDE", "Same day"], ["ONSITE SUPPORT", "14 days"], ["TECH HOTLINE", "24 hours"], ["ASSEMBLY", "Free"], ["PARTS", "Local distributors"]];
const facts = AL("VERTICAL", "Shop facts", { pad: [120, 80, 120, 80], gap: 40 });
page.appendChild(facts); facts.layoutSizingHorizontal = "FILL"; topRule(facts);
facts.appendChild(txt("THE SHOP", { font: "mono", size: 12, color: "accent", ls: 10 }));
const grid = AL("HORIZONTAL", "Facts grid", { gap: 0 }); facts.appendChild(grid);
grid.layoutWrap = "WRAP"; grid.counterAxisSpacing = 48; grid.itemSpacing = 40; grid.primaryAxisSizingMode = "FIXED"; grid.resize(1280, 10); grid.counterAxisSizingMode = "AUTO";
for (const [k, v] of FACTS) {
  const f = AL("VERTICAL", `Fact, ${k.toLowerCase()}`, { gap: 12, pad: [16, 0, 0, 0] }); grid.appendChild(f);
  f.resize(400, 10); f.counterAxisSizingMode = "FIXED"; f.primaryAxisSizingMode = "AUTO"; topRule(f);
  f.appendChild(txt(k, { font: "mono", size: 12, color: "ink-soft", ls: 6 }));
  f.appendChild(txt(v, { font: "display", size: 44, ls: -1 }));
}

// close: inquiry plate typeset like a label
const close = AL("VERTICAL", "Close, build 0__ plate", { pad: [140, 80, 120, 80], gap: 28 });
page.appendChild(close); close.layoutSizingHorizontal = "FILL"; topRule(close);
close.appendChild(txt("BUILD 0__", { font: "mono", size: 13, color: "accent", ls: 10 }));
close.appendChild(txt("Yours.", { font: "display", size: 96, lh: 95, ls: -3 }));
const crow = AL("VERTICAL", "Booking rows", {}); close.appendChild(crow); crow.resize(640, 10); crow.counterAxisSizingMode = "FIXED"; crow.primaryAxisSizingMode = "AUTO";
row(crow, "SHOWROOM", "1 Chencharu Link, near Khatib MRT"); row(crow, "HOURS", "Daily, 1 pm to 12 am"); row(crow, "BOOKING", "By appointment"); row(crow, "WHATSAPP", "+65 9321 7199");
close.appendChild(cta("Book a showroom slot"));
const foot = AL("HORIZONTAL", "Footer", { pad: [28, 80, 28, 80] }); page.appendChild(foot); foot.layoutSizingHorizontal = "FILL"; topRule(foot);
foot.appendChild(txt("Supersystems, Singapore. Concept site by Henry Chua. Not affiliated, not live.", { font: "mono", size: 11, color: "ink-soft" }));

// end state (scroll 100%, powered on)
const lit = buildHero("Build 001, end state (scroll 100%, powered on)", true);
lit.resize(1440, 900); lit.x = 1600; lit.y = 73; created.push(lit.id);

// storyboard of the scrub
const sb = AL("VERTICAL", "Scroll keyframes, reverse build (annotation)", { fill: "surface", pad: [40, 40, 40, 40], gap: 24 });
sb.x = 1600; sb.y = 1060; created.push(sb.id);
sb.appendChild(txt("SEEDANCE 2.5: TEARDOWN FROM THE REAL PHOTO, PLAYED BACKWARDS UNDER THE SCROLL", { font: "mono", size: 12, color: "accent", ls: 6 }));
const sbr = AL("HORIZONTAL", "Keyframes", { gap: 24 }); sb.appendChild(sbr);
for (const [p, c] of [["0%", "Empty case"], ["35%", "Board, CPU, memory, cooler"], ["70%", "GPU, power, fans"], ["100%", "Powered on (the real photo)"]]) {
  const k = AL("VERTICAL", `Keyframe ${p}`, { gap: 12 }); sbr.appendChild(k);
  k.appendChild(imgRect(`IMG key ${p}`, 300, 400));
  k.appendChild(txt(`${p}  ${c}`, { font: "mono", size: 12, color: "ink" }));
}

// mobile hero
const m = AL("VERTICAL", "Home, mobile 390 (hero)", { fill: "canvas", gap: 0 });
m.resize(390, 100); m.primaryAxisSizingMode = "AUTO"; m.counterAxisSizingMode = "FIXED"; m.x = 3200; m.y = 0; created.push(m.id);
const mn = AL("HORIZONTAL", "Nav", { pad: [16, 20, 16, 20] }); m.appendChild(mn); mn.layoutSizingHorizontal = "FILL"; mn.primaryAxisAlignItems = "SPACE_BETWEEN"; mn.counterAxisAlignItems = "CENTER"; bottomRule(mn);
mn.appendChild(txt("SUPERSYSTEMS", { font: "display", size: 15, ls: 8 })); mn.appendChild(cta("Book a slot", true));
m.appendChild(imgRect("IMG mobile", 390, 520));
const ms = AL("VERTICAL", "Label sheet", { pad: [24, 20, 32, 20], gap: 18 }); m.appendChild(ms); ms.layoutSizingHorizontal = "FILL";
ms.appendChild(txt("BUILD 001", { font: "mono", size: 12, color: "accent", ls: 10 }));
ms.appendChild(txt("HYTE Y60, Snow White", { font: "display", size: 34, lh: 100, ls: -1 }));
const mr = AL("VERTICAL", "Spec rows", {}); ms.appendChild(mr); mr.layoutSizingHorizontal = "FILL";
for (const [k, v] of PARTS.slice(0, 4)) row(mr, k, v);

return { created, page: page.id, lit: lit.id, storyboard: sb.id, mobile: m.id, specRow: specRow.id, imgs: Object.fromEntries(Object.entries(imgNodes).map(([k, v]) => [k, v.id])) };
