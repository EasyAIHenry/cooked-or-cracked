// Pompette. concept site: photoreal cones rendered with Higgsfield (GPT Image 2.5), WebGL sprinkles, GSAP + ScrollTrigger, Lenis as the only smooth-scroll engine.
import * as THREE from "three";

const FLAVOURS = [
  { id: "original", name: "Original", tag: "Always on", note: "Meiji milk and nothing covering it up. The one to start with.", color: "#FBF3E4" },
  { id: "hojicha", name: "Hojicha", tag: "Most asked for", note: "Roasted green tea. When it comes back, it goes first.", color: "#A9764E" },
  { id: "black-sesame", name: "Black sesame", tag: "Rotation", note: "Nutty and smooth, with no grit at all.", color: "#5F5A59" },
  { id: "matcha", name: "Matcha", tag: "Rotation", note: "Green tea, grassy and bright, not bitter.", color: "#A6C26A" },
  { id: "yuzu", name: "Yuzu", tag: "Rotation", note: "Japanese citrus. Sharp, clean, good on a hot day.", color: "#F2D867" },
  { id: "pistachio", name: "Pistachio", tag: "Guest", note: "Back for short runs. Follow Instagram for the dates.", color: "#AFC27A" },
  { id: "hazelnut", name: "Hazelnut", tag: "Newest", note: "Added for National Day 2026. Toasted and rich.", color: "#AE7A50" },
];

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.innerWidth <= 760;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

// ---------- scene state (written by ScrollTrigger, read by the render loop) ----------
const pose = { fx: 0.42, fy: 0, s: 1, spin: 0 };         // target pose: x/y as fractions of the half-viewport
const live = { fx: 0.42, fy: 0, s: 0.001, spin: 0 };     // eased pose actually rendered
const pipe = { v: reduce ? 1 : 0 };                       // 0 = empty cone, 1 = full swirl
const flav = { v: 0 };                                    // float index into FLAVOURS
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

// ---------- stage: photoreal cones (Higgsfield renders) + WebGL sprinkles ----------
const stageEl = document.querySelector(".stage");
const coneEl = document.querySelector(".cone");
const layers = Object.fromEntries([...document.querySelectorAll(".cone-layer")].map((i) => [i.dataset.flavour, i]));
const pipeLayer = document.querySelector(".cone-pipe");
const canvas = document.getElementById("scene");
let renderer, scene, camera, sprinkles, sprinkleData, rafId = 0, running = false, lastIdx = -1;
const dummy = new THREE.Object3D();

function webglOK() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); }
  catch { return false; }
}

function buildSprinkles(n) {
  const geo = new THREE.CapsuleGeometry(0.035, 0.17, 4, 10);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.45 });
  const mesh = new THREE.InstancedMesh(geo, mat, n);
  const palette = ["#3FAE5A", "#F2C230", "#F07C8C", "#8A7BD8", "#26B1B4"].map((h) => new THREE.Color(h));
  sprinkleData = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() < 0.8 ? 0.6 + Math.random() * 6.5 : -9 + Math.random() * 1.5;
    const y = (Math.random() * 2 - 1) * 4.5;
    sprinkleData.push({ x, y, z: -6 + Math.random() * 3.4, depth: 0.4 + Math.random() * 0.8, rx: Math.random() * 6, rz: Math.random() * 6, spin: (Math.random() - 0.5) * 0.5 });
    mesh.setColorAt(i, palette[i % palette.length]);
  }
  return mesh;
}

function initGL() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.35, 8.2);
  scene.add(new THREE.HemisphereLight(0xe8f7fb, 0xf3e3c7, 1.3));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.6); key.position.set(3, 5, 5); scene.add(key);
  sprinkles = buildSprinkles(isMobile() ? 14 : 26);
  scene.add(sprinkles);
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); canvas.style.display = "none"; });
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
  if (!renderer) return;
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// pipe: empty cone first, then the full cone is revealed bottom-up with a soft creamy edge.
// Rim sits at ~51% of the image height; 0-0.15 fills the cone body, 0.15-1 grows the swirl.
const RIM = 51;
function setPipe(p) {
  const top = p < 0.15 ? 100 - (p / 0.15) * (100 - RIM) : RIM * (1 - (p - 0.15) / 0.85);
  const m = p >= 0.999 ? "none" : `linear-gradient(to bottom, transparent ${(top - 2.5).toFixed(2)}%, #000 ${(top + 1.5).toFixed(2)}%)`;
  for (const k in layers) { layers[k].style.webkitMaskImage = m; layers[k].style.maskImage = m; }
  pipeLayer.style.opacity = p >= 0.999 ? 0 : 1;
}

function setFlavour(f) {
  const i = Math.min(FLAVOURS.length - 1, Math.floor(f));
  const j = Math.min(FLAVOURS.length - 1, i + 1);
  const t = f - i;
  FLAVOURS.forEach((fl, k) => {
    const el = layers[fl.id]; if (!el) return;
    el.style.opacity = k === i ? 1 : k === j ? t : 0;
  });
  const idx = Math.round(f);
  if (idx !== lastIdx) { lastIdx = idx; document.documentElement.style.setProperty("--tint", FLAVOURS[idx].color); }
}

const clock = new THREE.Clock();
function frame() {
  if (!running) return;
  rafId = requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  const k = reduce ? 1 : 1 - Math.pow(0.0015, dt);
  live.fx += (pose.fx - live.fx) * k;
  live.fy += (pose.fy - live.fy) * k;
  live.s += (pose.s - live.s) * k;
  live.spin += (pose.spin - live.spin) * k;
  pointer.x += (pointer.tx - pointer.x) * k * 0.6;
  pointer.y += (pointer.ty - pointer.y) * k * 0.6;

  const w = window.innerWidth, h = window.innerHeight, mob = isMobile();
  const x = mob ? 0 : live.fx * w * 0.5;
  const y = mob ? -h * 0.2 : -live.fy * h * 0.5;
  const bob = reduce ? 0 : Math.sin(t * 1.3) * 8;
  const ry = reduce ? 0 : pointer.x * 10 + Math.sin(t * 0.6 + live.spin) * 4;
  const rx = reduce ? 0 : -pointer.y * 6;
  const rz = reduce ? 0 : Math.sin(t * 0.8) * 1.5 + pointer.x * 2;
  coneEl.style.transform =
    `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${(y + bob).toFixed(1)}px), 0) scale(${live.s.toFixed(4)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotate(${rz.toFixed(2)}deg)`;
  coneEl.style.opacity = Math.min(1, live.s * 1.4).toFixed(3);

  setPipe(pipe.v);
  setFlavour(flav.v);

  if (renderer && sprinkles) {
    const sy = (window.scrollY || 0) * 0.0016;
    for (let i = 0; i < sprinkleData.length; i++) {
      const d = sprinkleData[i];
      let yy = d.y + sy * d.depth;
      yy = ((((yy + 4.5) % 9) + 9) % 9) - 4.5;
      dummy.position.set(d.x, yy, d.z);
      dummy.rotation.set(d.rx + t * d.spin, 0, d.rz + t * d.spin * 0.7);
      dummy.scale.setScalar(yy > 2.6 ? Math.max(0, 1 - (yy - 2.6) / 0.4) : 1);   // keep the nav band clear
      dummy.updateMatrix();
      sprinkles.setMatrixAt(i, dummy.matrix);
    }
    sprinkles.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }
}
function start() { if (running) return; running = true; clock.getDelta(); frame(); }
function stop() { running = false; cancelAnimationFrame(rafId); }

export function destroy() {
  stop();
  window.removeEventListener("resize", resize);
  window.removeEventListener("pointermove", onPointer);
  scene?.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
  renderer?.dispose();
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


  // the piping film: scroll scrubs the Kling clip frame by frame
  const film = document.getElementById("pipe-film");
  const filmBox = film?.closest(".film");
  if (film) {
    const seek = (p) => {
      if (!film.duration || film.readyState < 1) return;
      const t = Math.min(film.duration - 0.04, Math.max(0, p * film.duration));
      if (Math.abs(film.currentTime - t) > 0.01) film.currentTime = t;
      filmBox.classList.toggle("is-done", p > 0.98);
    };
    if (reduce) {
      film.addEventListener("loadedmetadata", () => { film.currentTime = film.duration - 0.04; filmBox.classList.add("is-done"); });
    } else {
      const filmST = ScrollTrigger.create({
        trigger: "#made", start: "top top", end: "bottom bottom",
        onUpdate: (st) => seek(st.progress),
      });
      film.addEventListener("loadedmetadata", () => seek(filmST.progress));
    }
  }

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
    ["#made",     { fx: 0.42, fy: 1.7,   s: 0.7,  spin: Math.PI * 2 }],
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

  // hero intro
  const heroWords = splitWords(document.getElementById("hero-title"));
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from(".nav", { y: -20, opacity: 0, duration: 0.7, ease: "power3.out" }, 0)
    .from(".kicker", { y: 14, opacity: 0, duration: 0.6, ease: "power3.out" }, 0.1)
    .from(heroWords, { yPercent: 115, duration: 0.95, ease: "power4.out", stagger: 0.06 }, 0.15)
    .from([".lede", ".ctas"], { y: 18, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.55)
    .fromTo(live, { s: 0.001 }, { s: 1, duration: 1.3, ease: "back.out(1.4)" }, 0.2)
    .fromTo(pipe, { v: 0 }, { v: 1, duration: 2.4, ease: "power2.inOut" }, 0.7);

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
  if (webglOK()) { try { initGL(); } catch (err) { console.warn("WebGL sprinkles off", err); } }
  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });
  stageEl.classList.add("is-live");
  if (reduce) { live.s = pose.s; }
  initMotion();
  start();
}
if (document.readyState === "complete") boot(); else window.addEventListener("load", boot);
