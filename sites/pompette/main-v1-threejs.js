// Pompette. concept site: one Three.js object (a hand-piped soft serve), GSAP + ScrollTrigger, Lenis as the only smooth-scroll engine.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const FLAVOURS = [
  { name: "Original", tag: "Always on", note: "Meiji milk and nothing covering it up. The one to start with.", color: "#FBF3E4" },
  { name: "Hojicha", tag: "Most asked for", note: "Roasted green tea. When it comes back, it goes first.", color: "#A9764E" },
  { name: "Black sesame", tag: "Rotation", note: "Nutty and smooth, with no grit at all.", color: "#5F5A59" },
  { name: "Matcha", tag: "Rotation", note: "Green tea, grassy and bright, not bitter.", color: "#A6C26A" },
  { name: "Yuzu", tag: "Rotation", note: "Japanese citrus. Sharp, clean, good on a hot day.", color: "#F2D867" },
  { name: "Pistachio", tag: "Guest", note: "Back for short runs. Follow Instagram for the dates.", color: "#AFC27A" },
  { name: "Hazelnut", tag: "Newest", note: "Added for National Day 2026. Toasted and rich.", color: "#AE7A50" },
];

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.innerWidth <= 760;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

// ---------- scene state (written by ScrollTrigger, read by the render loop) ----------
const pose = { fx: 0.42, fy: 0, s: 1, spin: 0 };         // target pose, in fractions of the half-viewport
const live = { fx: 0.42, fy: 0, s: 0.001, spin: 0 };     // eased pose actually rendered
const pipe = { v: reduce ? 1 : 0 };                       // 0 = empty cone, 1 = full swirl
const flav = { v: 0 };                                    // float index into FLAVOURS
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

// ---------- WebGL ----------
const stageEl = document.querySelector(".stage");
const canvas = document.getElementById("scene");
let renderer, scene, camera, group, swirl, swirlMat, blob, sprinkles, sprinkleData, pmrem, envRT;
let rafId = 0, running = false, curve, TUB = 720, RAD = 28, lastIdx = -1;
const tmpV = new THREE.Vector3(), tmpC = new THREE.Color(), tmpC2 = new THREE.Color(), dummy = new THREE.Object3D();

function webglOK() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); }
  catch { return false; }
}

// Soft-serve path: a spiral that tightens and climbs, finishing in a curled tip.
class SwirlCurve extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const turns = 3.1;
    const ang = t * turns * Math.PI * 2 + 0.4;
    const R = 0.46 * Math.pow(1 - t, 1.05) + 0.015;
    const tip = t > 0.86 ? Math.pow((t - 0.86) / 0.14, 2) * 0.24 : 0;
    const y = 0.02 + 1.18 * (1 - Math.pow(1 - t, 1.35)) + tip;
    return target.set(Math.cos(ang) * R, y, Math.sin(ang) * R);
  }
}
const tubeR = (t) => 0.245 * Math.pow(1 - t, 0.8) + 0.022;

function buildSwirl() {
  curve = new SwirlCurve();
  const geo = new THREE.TubeGeometry(curve, TUB, 1, RAD, false);
  const pos = geo.attributes.position;
  const P = new THREE.Vector3(), d = new THREE.Vector3();
  for (let j = 0; j <= TUB; j++) {
    const u = j / TUB;
    const t = curve.getUtoTmapping(u);
    curve.getPointAt(u, P);
    const r = tubeR(t);
    for (let i = 0; i <= RAD; i++) {
      const k = j * (RAD + 1) + i;
      d.fromBufferAttribute(pos, k).sub(P).normalize();
      const v = (i / RAD) * Math.PI * 2;
      const ridge = 1 + 0.085 * Math.cos(v * 8 + u * 38);   // star-nozzle ridges that twist along the pipe
      pos.setXYZ(k, P.x + d.x * r * ridge, P.y + d.y * r * ridge, P.z + d.z * r * ridge);
    }
  }
  geo.computeVertexNormals();
  swirlMat = new THREE.MeshPhysicalMaterial({
    color: FLAVOURS[0].color, roughness: 0.46, sheen: 0.7, sheenRoughness: 0.4, sheenColor: 0xffffff,
    clearcoat: 0.22, clearcoatRoughness: 0.45,
  });
  swirl = new THREE.Mesh(geo, swirlMat);

  // the nozzle bead that leads the pipe while it is being drawn
  blob = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), swirlMat);
  // soft fill that closes the first coil into the cone
  const base = new THREE.Mesh(new THREE.SphereGeometry(0.5, 40, 24), swirlMat);
  base.scale.set(1, 0.38, 1);
  base.position.y = 0.02;
  return [swirl, blob, base];
}

function waffleTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#D9A75E"; g.fillRect(0, 0, 512, 512);
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "rgba(255,230,170,.25)"); grad.addColorStop(1, "rgba(120,70,20,.18)");
  g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
  g.lineCap = "round";
  for (const [w, col] of [[18, "rgba(122,72,24,.55)"], [6, "rgba(255,226,160,.35)"]]) {
    g.lineWidth = w; g.strokeStyle = col;
    for (let k = -512; k <= 1024; k += 85) {
      g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 512, 512); g.stroke();
      g.beginPath(); g.moveTo(k + 512, 0); g.lineTo(k, 512); g.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function buildCone() {
  const pts = [
    new THREE.Vector2(0.001, -1.6), new THREE.Vector2(0.2, -1.1), new THREE.Vector2(0.55, -0.14),
    new THREE.Vector2(0.6, -0.1), new THREE.Vector2(0.62, 0.0), new THREE.Vector2(0.57, 0.03),
  ];
  const tex = waffleTexture();
  const mat = new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 2.2, roughness: 0.72, metalness: 0 });
  return new THREE.Mesh(new THREE.LatheGeometry(pts, 72), mat);
}

function buildSprinkles(n) {
  const geo = new THREE.CapsuleGeometry(0.035, 0.17, 4, 10);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.45 });
  const mesh = new THREE.InstancedMesh(geo, mat, n);
  const palette = ["#3FAE5A", "#F2C230", "#F07C8C", "#8A7BD8", "#26B1B4"].map((h) => new THREE.Color(h));
  sprinkleData = [];
  for (let i = 0; i < n; i++) {
    // keep sprinkles off the copy column (left) and away from the cone: right side and far edges only
    const x = Math.random() < 0.8 ? 0.6 + Math.random() * 6.5 : -9 + Math.random() * 1.5;
    const y = (Math.random() * 2 - 1) * 4.5;
    sprinkleData.push({
      x, y, z: -6 + Math.random() * 3.4, depth: 0.4 + Math.random() * 0.8,
      rx: Math.random() * 6, rz: Math.random() * 6, spin: (Math.random() - 0.5) * 0.5,
    });
    mesh.setColorAt(i, palette[i % palette.length]);
  }
  return mesh;
}

function initGL() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  scene = new THREE.Scene();
  pmrem = new THREE.PMREMGenerator(renderer);
  envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.55;

  camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.35, 8.2);

  const key = new THREE.DirectionalLight(0xfff4e6, 1.9); key.position.set(3, 5, 5);
  const rim = new THREE.DirectionalLight(0xbfeaff, 1.4); rim.position.set(-4, 2.5, -4);
  const hemi = new THREE.HemisphereLight(0xe8f7fb, 0xf3e3c7, 0.7);
  scene.add(key, rim, hemi);

  group = new THREE.Group();
  const cone = buildCone();
  const [s, b, base] = buildSwirl();
  group.add(cone, base, s, b);
  group.position.y = 0.15;
  scene.add(group);

  sprinkles = buildSprinkles(isMobile() ? 14 : 26);
  scene.add(sprinkles);

  resize();
  window.addEventListener("resize", resize);
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); stop(); stageEl.classList.remove("is-live"); });
  canvas.addEventListener("webglcontextrestored", () => { start(); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });

  renderer.render(scene, camera);
  stageEl.classList.add("is-live");
  start();
}

let pointerQueued = false;
function onPointer(e) {
  if (e.pointerType !== "mouse" || pointerQueued) return;
  pointerQueued = true;
  requestAnimationFrame(() => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    pointerQueued = false;
  });
}

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function viewHalf() {
  const dist = camera.position.z;
  const hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
  return { hw: hh * camera.aspect, hh };
}

function setPipe(p) {
  const segs = Math.max(1, Math.floor(p * TUB));
  swirl.geometry.setDrawRange(0, segs * RAD * 6);
  if (p >= 0.995) { blob.visible = false; return; }
  blob.visible = p > 0.002;
  const u = segs / TUB;
  curve.getPointAt(u, tmpV);
  blob.position.copy(tmpV);
  blob.scale.setScalar(tubeR(curve.getUtoTmapping(u)) * 1.04);
}

function setFlavourColour(f) {
  const i = Math.min(FLAVOURS.length - 1, Math.floor(f));
  const j = Math.min(FLAVOURS.length - 1, i + 1);
  tmpC.set(FLAVOURS[i].color); tmpC2.set(FLAVOURS[j].color);
  tmpC.lerp(tmpC2, f - i);
  swirlMat.color.copy(tmpC);
  const idx = Math.round(f);
  if (idx !== lastIdx) {
    lastIdx = idx;
    document.documentElement.style.setProperty("--tint", FLAVOURS[idx].color);
  }
}

const clock = new THREE.Clock();
function frame() {
  if (!running) return;
  rafId = requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  const k = reduce ? 1 : 1 - Math.pow(0.0015, dt);          // frame-rate independent easing

  live.fx += (pose.fx - live.fx) * k;
  live.fy += (pose.fy - live.fy) * k;
  live.s += (pose.s - live.s) * k;
  live.spin += (pose.spin - live.spin) * k;
  pointer.x += (pointer.tx - pointer.x) * k * 0.6;
  pointer.y += (pointer.ty - pointer.y) * k * 0.6;

  const { hw, hh } = viewHalf();
  const mob = isMobile();
  const base = mob ? 0.54 : Math.min(1, hh / 2.4);
  group.position.x = mob ? 0 : live.fx * hw;
  group.position.y = 0.15 + (mob ? hh * 0.42 : live.fy * hh);
  group.scale.setScalar(live.s * base);
  const idle = reduce ? 0 : t * 0.35;
  group.rotation.y = idle + live.spin + pointer.x * 0.35;
  group.rotation.x = 0.08 + pointer.y * 0.12;
  group.rotation.z = reduce ? 0 : Math.sin(t * 0.8) * 0.03;

  setPipe(pipe.v);
  setFlavourColour(flav.v);

  const sy = (window.scrollY || 0) * 0.0016;
  for (let i = 0; i < sprinkleData.length; i++) {
    const d = sprinkleData[i];
    let y = d.y + sy * d.depth;
    y = ((((y + 4.5) % 9) + 9) % 9) - 4.5;                      // wrap vertically
    dummy.position.set(d.x, y, d.z);
    dummy.rotation.set(d.rx + t * d.spin, 0, d.rz + t * d.spin * 0.7);
    dummy.updateMatrix();
    sprinkles.setMatrixAt(i, dummy.matrix);
  }
  sprinkles.instanceMatrix.needsUpdate = true;

  renderer.render(scene, camera);
}
function start() { if (running || !renderer) return; running = true; clock.getDelta(); frame(); }
function stop() { running = false; cancelAnimationFrame(rafId); }

export function destroy() {
  stop();
  window.removeEventListener("resize", resize);
  window.removeEventListener("pointermove", onPointer);
  scene?.traverse((o) => {
    o.geometry?.dispose();
    const m = o.material; if (m) { (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose(); x.dispose(); }); }
  });
  envRT?.dispose(); pmrem?.dispose(); renderer?.dispose();
  window.__lenis?.destroy();
  window.ScrollTrigger?.getAll().forEach((s) => s.kill());
}

// ---------- DOM: split headings (accessible) ----------
function splitWords(el) {
  const text = el.textContent.trim();
  el.innerHTML = `<span class="sr-only">${text}</span><span aria-hidden="true">${text
    .split(/\s+/).map((w) => `<span class="w"><span class="wi">${w}</span></span>`).join(" ")}</span>`;
  return el.querySelectorAll(".wi");
}

// ---------- flavour card ----------
const fName = document.getElementById("flav-name");
const fTag = document.getElementById("flav-tag");
const fNote = document.getElementById("flav-note");
const fI = document.getElementById("flav-i");
document.getElementById("flav-n").textContent = String(FLAVOURS.length).padStart(2, "0");
let shownIdx = 0;
function showFlavour(i) {
  if (i === shownIdx) return;
  shownIdx = i;
  const f = FLAVOURS[i];
  const swap = () => { fName.textContent = f.name; fTag.textContent = f.tag; fNote.textContent = f.note; fI.textContent = String(i + 1).padStart(2, "0"); };
  if (reduce || !window.gsap) return swap();
  gsap.timeline()
    .to([fName, fTag, fNote], { yPercent: -30, opacity: 0, duration: 0.18, ease: "power2.in", stagger: 0.03 })
    .add(swap)
    .fromTo([fName, fTag, fNote], { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.42, ease: "power3.out", stagger: 0.05 });
}

// ---------- motion ----------
function initMotion() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  if (!reduce && window.Lenis) {
    const lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: 0, duration: 1.4 }); }
      })
    );
  }

  // solid nav once the page moves (ScrollTrigger, not a raw scroll listener)
  ScrollTrigger.create({ start: 40, end: "max", toggleClass: { targets: ".nav", className: "is-scrolled" } });

  // step highlight inside "How it is made" (works in reduced motion too: plain class toggle)
  const steps = [...document.querySelectorAll(".step")];
  ScrollTrigger.create({
    trigger: "#made", start: "top top", end: "bottom bottom",
    onUpdate: (st) => {
      const a = Math.min(steps.length - 1, Math.floor(st.progress * steps.length));
      steps.forEach((s, i) => s.classList.toggle("is-active", i === a));
    },
  });

  // flavour index (colour holds on each flavour, then blends to the next)
  ScrollTrigger.create({
    trigger: "#flavours", start: "top top", end: "bottom bottom",
    onUpdate: (st) => {
      const raw = st.progress * (FLAVOURS.length - 1);
      const i = Math.floor(raw), frac = raw - i;
      flav.v = Math.min(FLAVOURS.length - 1, i + smooth(clamp01((frac - 0.55) / 0.45)));
      showFlavour(Math.round(flav.v));
    },
    onLeaveBack: () => { flav.v = 0; showFlavour(0); },
  });

  // object choreography between sections
  const poses = [
    ["#made",     { fx: 0.4,  fy: -0.02, s: 1.18, spin: Math.PI * 2 }],
    ["#flavours", { fx: 0.42, fy: 0,     s: 1.05, spin: Math.PI * 2 }],
    ["#menu",     { fx: -0.46, fy: -0.02, s: 0.9, spin: Math.PI * 3 }],
    [".maker",    { fx: 0.62, fy: 1.5,   s: 0.6,  spin: Math.PI * 3.5 }],
    ["#visit",    { fx: 0.52, fy: -0.04, s: 0.78, spin: Math.PI * 4 }],
  ];
  let prev = { fx: 0.42, fy: 0, s: 1, spin: 0 };
  poses.forEach(([sel, to]) => {
    const from = { ...prev };
    gsap.fromTo(pose, from, {
      ...to, ease: "none", immediateRender: false,
      scrollTrigger: { trigger: sel, start: "top bottom", end: "top 20%", scrub: true },
    });
    prev = to;
  });

  if (reduce) return;

  // pipe the swirl across the hero exit and the "made" section
  gsap.fromTo(pipe, { v: 0.45 }, {
    v: 1, ease: "none", immediateRender: false,
    scrollTrigger: { trigger: "#made", start: "top bottom", end: "70% bottom", scrub: 0.6 },
  });

  // hero intro
  const heroWords = splitWords(document.getElementById("hero-title"));
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from(".nav", { y: -20, opacity: 0, duration: 0.7, ease: "power3.out" }, 0)
    .from(".kicker", { y: 14, opacity: 0, duration: 0.6, ease: "power3.out" }, 0.1)
    .from(heroWords, { yPercent: 115, duration: 0.95, ease: "power4.out", stagger: 0.06 }, 0.15)
    .from([".lede", ".ctas"], { y: 18, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.55)
    .fromTo(live, { s: 0.001 }, { s: 1, duration: 1.3, ease: "back.out(1.4)" }, 0.2)
    .fromTo(pipe, { v: 0 }, { v: 0.45, duration: 1.8, ease: "power2.inOut" }, 0.6);

  // section headings: word-by-word reveal
  document.querySelectorAll("h2.split").forEach((h) => {
    const words = splitWords(h);
    gsap.from(words, { yPercent: 115, duration: 0.9, ease: "power4.out", stagger: 0.045,
      scrollTrigger: { trigger: h, start: "top 85%" } });
  });
  gsap.utils.toArray([".facts > div", ".prices li", ".route li", ".maker-copy p", ".visit-grid > *"]).forEach((el, i) => {
    gsap.from(el, { y: 22, opacity: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%" } });
  });
  gsap.from(".maker-photo img", { scale: 1.15, ease: "none",
    scrollTrigger: { trigger: ".maker-photo", start: "top bottom", end: "bottom top", scrub: true } });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

// ---------- boot ----------
function boot() {
  if (webglOK()) {
    try { initGL(); } catch (err) { console.warn("WebGL unavailable, showing poster", err); }
  }
  if (new URLSearchParams(location.search).has("poster")) {        // poster capture mode: final state, no motion, no sprinkles
    pipe.v = 1; live.s = pose.s = 1.15; live.fx = pose.fx = 0; live.fy = pose.fy = -0.05;
    if (sprinkles) sprinkles.visible = false;
    document.body.style.background = "transparent";
    document.querySelectorAll("main, .nav, .footer").forEach((e) => (e.style.visibility = "hidden"));
    return;
  }
  if (reduce) { live.s = pose.s; }
  initMotion();
}
if (document.readyState === "complete") boot(); else window.addEventListener("load", boot);
