// Pompette. scan-and-order menu (design preview; no backend).
// Edit ON_TAP each week. Prices and toppings are samples until the owner confirms them.

const FLAVOURS = [
  { id: "original", name: "Original", note: "Meiji milk and nothing covering it up.", price: 3, color: "#FBF3E4", tag: "Always on" },
  { id: "hojicha", name: "Hojicha", note: "Roasted green tea. Goes first when it's back.", price: 5, color: "#C79A74", tag: "Most asked for" },
  { id: "black-sesame", name: "Black sesame", note: "Nutty and smooth, no grit.", price: 5, color: "#9B9695", tag: "Rotation" },
  { id: "matcha", name: "Matcha", note: "Bright green tea, not bitter.", price: 5, color: "#B7CE82", tag: "Rotation" },
  { id: "yuzu", name: "Yuzu", note: "Japanese citrus. Sharp and clean.", price: 5, color: "#F4DF7E", tag: "Rotation" },
  { id: "pistachio", name: "Pistachio", note: "Short runs only.", price: 5, color: "#C4D29C", tag: "Guest" },
  { id: "hazelnut", name: "Hazelnut", note: "Toasted and rich. Our newest.", price: 5, color: "#D2AC86", tag: "Newest" },
];
const ON_TAP = ["original", "hojicha", "black-sesame", "hazelnut"];
const TOPPINGS = [
  { id: "sprinkles", name: "Rainbow sprinkles", price: 1 },
  { id: "cornflake", name: "Cornflake crunch", price: 1 },
  { id: "caramel", name: "Sea salt caramel", price: 1 },
  { id: "crumble", name: "Chocolate crumble", price: 1 },
  { id: "mochi", name: "Mochi bites", price: 1.5 },
];

const $ = (s) => document.querySelector(s);
const money = (n) => `$${n.toFixed(2)}`;
const img = (id) => `assets/${id}-sm.webp`;
const byId = (id) => FLAVOURS.find((f) => f.id === id);

// ---------- table + hours ----------
const table = new URLSearchParams(location.search).get("table");
if (table && /^[\w-]{1,6}$/.test(table)) $("#table-chip").textContent = `Table ${table}`;

function openStatus() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Singapore", weekday: "short", hour: "numeric", minute: "numeric", hour12: false })
    .formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = get("weekday"); const mins = Number(get("hour")) * 60 + Number(get("minute"));
  const opens = day === "Mon" ? null : (day === "Sat" || day === "Sun") ? 11 * 60 : 12 * 60;
  const closes = 21 * 60;
  if (opens !== null && mins >= opens && mins < closes) return { open: true, text: "Open now, until 9pm" };
  if (day === "Mon") return { open: false, text: "Closed on Mondays. Back Tuesday at noon." };
  if (opens !== null && mins < opens) return { open: false, text: `Opens today at ${opens === 660 ? "11am" : "noon"}` };
  return { open: false, text: "Closed for today. Opens tomorrow." };
}
const st = openStatus();
$("#open-text").textContent = st.text;
$("#open-dot").classList.toggle("open", st.open);

// ---------- render lists ----------
const rail = $("#ontap-rail");
ON_TAP.map(byId).forEach((f) => {
  const li = document.createElement("li");
  li.innerHTML = `<button class="tap-card" type="button" style="--f:${f.color}" data-id="${f.id}" aria-label="${f.name}, ${money(f.price)}">
      <span class="tap-badge">${f.tag}</span>
      <img src="${img(f.id)}" alt="" width="82" height="150" loading="lazy">
      <span class="tap-name">${f.name}</span>
      <span class="tap-price">${money(f.price)}</span>
    </button>`;
  rail.append(li);
});

const items = $("#items");
[...FLAVOURS].sort((a, b) => ON_TAP.includes(b.id) - ON_TAP.includes(a.id)).forEach((f) => {
  const on = ON_TAP.includes(f.id);
  const li = document.createElement("li");
  li.innerHTML = `<button class="item ${on ? "" : "off"}" type="button" data-id="${f.id}" ${on ? "" : 'aria-disabled="true"'}
      aria-label="${f.name}, ${money(f.price)}${on ? "" : ", not on tap this week"}">
      <span class="thumb" style="--f:${f.color}"><img src="${img(f.id)}" alt="" width="52" height="96" loading="lazy"></span>
      <span>
        <span class="item-name">${f.name}</span>
        <span class="item-note">${f.note}</span>
        <span class="item-meta"><span class="price">${money(f.price)}</span>${on && f.tag !== "Rotation" ? `<span class="pill">${f.tag}</span>` : ""}</span>
      </span>
      <span class="add" aria-hidden="true">${on ? "+" : "Back soon"}</span>
    </button>`;
  items.append(li);
});

$("#topping-list").innerHTML = TOPPINGS.map((t) => `<li class="topping"><span>${t.name}</span><span>+${money(t.price)}</span></li>`).join("");
$("#sheet-toppings").innerHTML = TOPPINGS.map((t) =>
  `<label class="chip"><input type="checkbox" name="top" value="${t.id}"><span>${t.name} <small>+${money(t.price)}</small></span></label>`).join("");

// ---------- order state ----------
let order = [];
try { order = JSON.parse(sessionStorage.getItem("pompette-order") || "[]"); } catch { order = []; }
const save = () => { try { sessionStorage.setItem("pompette-order", JSON.stringify(order)); } catch {} };
const lineTotal = (l) => (byId(l.id).price + l.tops.reduce((s, t) => s + TOPPINGS.find((x) => x.id === t).price, 0)) * l.qty;
const total = () => order.reduce((s, l) => s + lineTotal(l), 0);

function renderBar(bump) {
  const n = order.reduce((s, l) => s + l.qty, 0);
  $("#bar").hidden = n === 0;
  $("#bar-count").textContent = n;
  $("#bar-total").textContent = money(total());
  if (bump) { const c = $("#bar-count"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
}
renderBar();

// ---------- item sheet ----------
const sheet = $("#item-sheet");
let current = null, qty = 1;
function price() {
  const tops = [...document.querySelectorAll('#sheet-toppings input:checked')].map((i) => i.value);
  return (current.price + tops.reduce((s, t) => s + TOPPINGS.find((x) => x.id === t).price, 0)) * qty;
}
function refreshSheet() {
  $("#qty-val").textContent = qty;
  $("#qty-minus").disabled = qty <= 1;
  $("#add-price").textContent = money(price());
  const cup = document.querySelector('input[name="vessel"]:checked').value === "Cup";
  $("#sheet-hero").classList.toggle("is-cup", cup);
  $("#sheet-img").src = cup && current.id === "original" ? "assets/cup-sm.webp" : img(current.id);
}
function openItem(id) {
  const f = byId(id);
  if (!f || !ON_TAP.includes(id)) return;
  current = f; qty = 1;
  $("#item-form").reset();
  $("#sheet-hero").style.setProperty("--f", f.color);
  $("#sheet-img").alt = `${f.name} soft serve`;
  $("#sheet-tag").textContent = f.tag;
  $("#sheet-name").textContent = f.name;
  $("#sheet-note").textContent = f.note;
  refreshSheet();
  sheet.showModal();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-id]");
  if (b) openItem(b.dataset.id);
});
$("#item-form").addEventListener("change", refreshSheet);
$("#qty-minus").addEventListener("click", () => { qty = Math.max(1, qty - 1); refreshSheet(); });
$("#qty-plus").addEventListener("click", () => { qty = Math.min(9, qty + 1); refreshSheet(); });
sheet.addEventListener("close", () => {
  if (sheet.returnValue !== "add" || !current) return;
  const tops = [...document.querySelectorAll('#sheet-toppings input:checked')].map((i) => i.value);
  const vessel = document.querySelector('input[name="vessel"]:checked').value;
  const same = order.find((l) => l.id === current.id && l.vessel === vessel && l.tops.join() === tops.join());
  if (same) same.qty += qty; else order.push({ id: current.id, vessel, tops, qty });
  save(); renderBar(true);
  $("#live").textContent = `Added ${qty} ${current.name}. Order total ${money(total())}.`;
});
// tap outside a sheet closes it
document.querySelectorAll("dialog").forEach((d) =>
  d.addEventListener("click", (e) => { if (e.target === d) d.close("cancel"); }));

// ---------- order sheet ----------
const orderSheet = $("#order-sheet");
function renderLines() {
  $("#lines").innerHTML = order.map((l, i) => {
    const f = byId(l.id);
    const tops = l.tops.map((t) => TOPPINGS.find((x) => x.id === t).name).join(", ");
    return `<li class="line">
      <span class="thumb" style="--f:${f.color}"><img src="${img(f.id)}" alt="" width="32" height="58"></span>
      <span><p class="line-name">${l.qty} × ${f.name}</p><p class="line-sub">${l.vessel}${tops ? ` · ${tops}` : ""}</p></span>
      <span class="line-right"><span class="line-price">${money(lineTotal(l))}</span><br><button type="button" class="line-remove" data-rm="${i}">Remove</button></span>
    </li>`;
  }).join("");
  $("#order-total").textContent = money(total());
  $("#place-btn").disabled = order.length === 0;
}
$("#bar-btn").addEventListener("click", () => { renderLines(); orderSheet.showModal(); });
$("#lines").addEventListener("click", (e) => {
  const i = e.target.dataset.rm; if (i === undefined) return;
  order.splice(Number(i), 1); save(); renderBar(); renderLines();
  if (!order.length) orderSheet.close("cancel");
});
$("#place-btn").addEventListener("click", (e) => {
  const name = $("#pickup-name");
  if (!name.value.trim()) { e.preventDefault(); name.setAttribute("aria-invalid", "true"); name.focus(); return; }
  name.removeAttribute("aria-invalid");
});
orderSheet.addEventListener("close", () => {
  if (orderSheet.returnValue !== "place") return;
  const who = $("#pickup-name").value.trim();
  $("#done-no").textContent = String(10 + Math.floor(Math.random() * 90));
  $("#done-note").textContent = `Thanks, ${who}. We'll call your name when it's piped. Pay ${money(total())} at the counter.`;
  order = []; save(); renderBar();
  $("#done-sheet").showModal();
});
$("#done-close").addEventListener("click", () => $("#done-sheet").close());

// ---------- tabs follow the scroll ----------
const tabs = [...document.querySelectorAll(".tab")];
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) tabs.forEach((t) => t.classList.toggle("is-active", t.getAttribute("href") === `#${en.target.id}`));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll(".list-sec").forEach((s) => io.observe(s));

// ---------- capture hooks for the guide: ?demo=item | order | done ----------
const demo = new URLSearchParams(location.search).get("demo");
if (demo) {
  setTimeout(() => {
    if (demo === "item") { openItem("hojicha"); document.querySelectorAll('#sheet-toppings input')[4].checked = true; refreshSheet(); }
    if (demo === "order" || demo === "done") {
      order = [{ id: "hojicha", vessel: "Cup", tops: ["mochi"], qty: 1 }, { id: "original", vessel: "Cone", tops: [], qty: 2 }];
      renderBar();
      if (demo === "order") { renderLines(); $("#pickup-name").value = "Alex"; orderSheet.showModal(); }
      else { $("#done-no").textContent = "17"; $("#done-note").textContent = "Thanks, Alex. We'll call your name when it's piped. Pay $12.50 at the counter."; $("#done-sheet").showModal(); }
    }
  }, 300);
}
