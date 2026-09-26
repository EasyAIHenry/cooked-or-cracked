# Ep2 recording brief: to-do and what to say (30 minutes of screen)

You record the screen while you test. The talking-head verdict is filmed after, from the scorecard. Say the lines below out loud while the screen shows the thing. Short sentences. Say the number when it is on screen.

## Before you press record (5 min, not recorded)
- [ ] Fresh folder: `mkdir -p ~/coc-ep2-test/{a-plain,b-taste,c-impeccable,d-designmd,e-3d} && cd ~/coc-ep2-test`
- [ ] Terminal font 18 pt or bigger, window 1440x900, light or dark but the same for the whole session.
- [ ] Browser: one clean window, no bookmarks bar, no personal tabs.
- [ ] Photo for the 3D test on the Desktop (one object, plain background).
- [ ] Nate's reel open in a phone-sized window for the reaction shot (03_reference/nateherk-reel-DdT_OwyFeoj.mp4).
- [ ] Timer app visible in a corner (you will point at it).
- [ ] Record at 1080p or better, 30 fps. Mac: QuickTime or ScreenFlow. Mic on, you narrate live.

## Segment 1, install (0:00 to 0:06 of recording)
Do:
```
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
npx impeccable install
npm install -g @playwright/cli@latest && playwright-cli install --skills -g
git clone https://github.com/img2threejs/img2threejs.git ~/.claude/skills/img2threejs
ls ~/.claude/skills | grep -E "taste|impeccable|img2threejs|playwright"
```
Say: "Five tools. Five install lines. Timer starts now." Then read each name as it installs: "Taste. Impeccable. Playwright. Awesome Design is just one file, I will grab it later. And the 3D one is called img2threejs, not image twenty-three." (Keep this. It is your first receipt: he misread the name.)

## Segment 2, the control test (0:06 to 0:16)
Do: open three terminals or run one after another. Same prompt in a-plain, b-taste, c-impeccable:
```
Build a one-page landing site for a Singapore coffee cart called Kopi Lah. Hero, three menu items with prices, opening hours, one button to order on WhatsApp. Single index.html, no framework.
```
In c-impeccable, after the page exists: `/impeccable init` then `/impeccable polish index.html`.
Say while A builds: "Plain Claude, no skills. This is the baseline everybody complains about."
Say while B builds: "Same prompt. Taste is on. Watch the fonts."
Say while C builds: "Same prompt, then Impeccable polish. He says it has a live editor. Let's see."
Open all three in the browser side by side. Say what you actually see, one sentence each. Examples of the shape, not the words: "A is Inter and three cards in a row." "B changed the font and the layout." "C fixed the spacing and the button." If B or C looks the same as A, say that. That is the video.

## Segment 3, Playwright as tester (0:16 to 0:21)
Do: in c-impeccable, delete the WhatsApp link target so the button goes nowhere. Then:
```
Use playwright-cli to open index.html, click every link and button, screenshot each state, and tell me what is broken.
```
Say: "I broke the order button on purpose. Does Claude catch it." Then read the answer: "It found it" or "It missed it." Point at the screenshot it saved.

## Segment 4, DESIGN.md (0:21 to 0:25)
Do: in d-designmd:
```
curl -o DESIGN.md https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/linear.app/DESIGN.md
```
(Open the repo folder in the browser first to confirm the path.) Run the same Kopi Lah prompt. Do not mention the design file in the prompt.
Say: "One file in the folder. I did not tell Claude about it. Does the page come out looking like Linear." Open it. Say yes or no and the one thing that proves it (colour, font, button shape).

## Segment 5, the 3D claim (0:25 to 0:30, plus waiting)
Do: in e-3d, drop the photo in, then:
```
/img2threejs Rebuild this object as a Three.js model, keep the proportions, angles and colours.
```
Say: "His demo was a bike. Mine is [object]. Timer says [time]." Let it run. Cut away, come back. When it renders or when you stop it: "[N] minutes. It looks like [what it looks like]." Then run `/cost` and read the number: "That is what 'completely free' cost me in tokens."

## Segment 6, scorecard (last 2 min)
Do: open `01_scripts/script-ep2.md`, fill the five ticks and the overall score on screen.
Say: "Five tools. [N] I would keep. [Name] is the one that surprised me. [Name] is the one I would skip."
Stop recording.

## Then film the talking head (10 min)
Use `script-ep2.md`. One take per beat, say the number, look at the lens. Phone at eye level, DJI mic, same spot as Ep1.
