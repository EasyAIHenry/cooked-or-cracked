# Pompette. concept site (Cooked or Cracked Ep2 build)

A 3D scroll site for Pompette, a soft-serve shop at Beauty World Centre #01-11B, Singapore, which has no website today (only Instagram @oui_pompette_). Built 26 Sep 2026 by Henry Chua as a concept. Not the official site.

## Run it
```
python3 -m http.server 5173 --directory "/Users/henrychua/Content Creation/pompette-site"
```
Open http://localhost:5173. Needs an internet connection for fonts, Three.js, GSAP and Lenis (all from CDNs).

## Direction
- **Idea:** the shop's own room becomes the page. Pastel-blue walls, the white cloud wall, sprinkles on the wall. One 3D object: their soft serve.
- **Signature moment:** scrolling pipes the swirl out of the cone, coil by coil. Then it changes colour through the seven flavours while the page tint follows.
- **Colour:** sampled from their logo. Teal `#26B1B4` (swirl line) and gold `#C9B636` (cone line), on sky `#CFEAF3`. Dark mode is "after hours": deep teal `#0B2A30`.
- **Type:** Bricolage Grotesque 800 for display, Figtree for body. Taste bans Instrument Serif and Fraunces as defaults, so neither is used.
- **Sections:** hero, facts strip, how it is made (pinned, pipes the swirl), the rotation (pinned, 7 flavours), menu, the maker, how to find the counter, footer.
- **Motion stack:** GSAP + ScrollTrigger, Lenis as the only smooth-scroll engine. Word-by-word heading reveals with accessible text. Reduced motion shows the finished swirl with no scrubbing and lists all flavours.
- **Visuals (v2, Higgsfield):** photoreal cones replace the hand-built 3D swirl. The hero opens on an empty cone and the swirl rises into it with a soft creamy edge. "How it is made" is a Kling 3.0 film of the swirl being piped, scrubbed frame by frame by scroll. The rotation crossfades between seven matched flavour renders. Sprinkles stay as one Three.js instanced mesh. The old procedural version is kept as `main-v1-threejs.js`.

## Content sources (checked 26 Sep 2026)
| Fact | Source |
|---|---|
| 4.9 stars, 378 reviews, address, phone, hours | Google Maps listing |
| Meiji milk base, handcrafted daily, closed Monday | Instagram bio and posts, @oui_pompette_ |
| Flavours: Original, Hojicha, Black sesame, Matcha, Yuzu, Pistachio, Hazelnut (National Day 2026) | Instagram posts, Memoirs of a Chocoholic (Mar 2026) |
| Two of four flavours rotate weekly | Lemon8 and review round-ups |
| Original about $3, flavours about $5, toppings +$1 to $1.50, no pork served | Memoirs of a Chocoholic (Mar 2026) |
| Directions (past I-Bread, past Victory Boat Noodles, next to level 1 washroom) | Memoirs of a Chocoholic, Pompette's own "how to get here" post |
| Maker photo `assets/maker.jpg` | Frame from Pompette's Instagram post, 18 Jul 2024, text cropped out |

## Confirm with the owner before this goes public
1. Permission to use the name, look and the maker photo.
2. Exact prices, toppings, and whether cup and cone cost the same.
3. This week's four flavours (edit `FLAVOURS` at the top of `main.js`).
4. Halal status (a 2024 post said certification was in progress; the 2026 review says no pork served).

## Nate's five tools, honestly
- **Taste:** its rules were applied (banned default serifs, no centred hero, hero copy under 20 words, one-line CTAs, dark mode, no raw scroll listeners).
- **img2threejs:** not run. The swirl was built by hand in Three.js, which is the kind of output img2threejs produces. On camera, run it on a photo of the real cone and compare.
- **Impeccable, Playwright CLI, Awesome Design:** not run yet. Good on-camera steps: `/impeccable audit index.html`, `playwright-cli open http://localhost:5173 --headed` then `screenshot`, and drop a DESIGN.md in to see what changes.

## Higgsfield assets (v2, 26 Sep 2026)
| File | Model | Notes |
|---|---|---|
| `assets/cones/original.*` | GPT Image 2.5, high, 2K, transparent | Master cone. Prompt in the session log; every other cone uses it as the reference |
| `assets/cones/{hojicha,black-sesame,matcha,yuzu,pistachio,hazelnut}.*` | GPT Image 2.5, reference = master | Same angle, light and scale, flavour changed. Pistachio edge halo trimmed |
| `assets/cones/empty.*`, `cup.webp` | GPT Image 2.5, reference = master | Empty cone for the piping start; cup for the menu |
| `assets/pipe.mp4` | Kling 3.0 pro, 5 s, 9:16, start = empty cone, end = master | Re-encoded with a keyframe every 2 frames so scroll scrubbing is smooth |
| `assets/gen/` | raw downloads, frames, previews | Not loaded by the page |

Cost: 10 images at 2.75 credits + 1 video at 8.75 credits = 36.25 credits (382.5 to 346.25).
All cones are aligned on one 760x1400 canvas, bottom-aligned, so crossfades line up. The rim sits at 51% of the height (`RIM` in `main.js`).
