# Pass 2 v4: 2:00 cut with picture-in-picture (applied 27 Sep 2026)

Henry's notes on the first pass-2 preview: keep him on screen in a small window while the recording plays, cut what doesn't need emphasis, cut the long pauses, land at 2:00. Length now 2:00.7.

Cut from the previous version: "I have installed the five repos that he have given" (the five GitHub cards now play under "with the five connectors he has suggested"), "I actually wanted it to be 3D", "And we can cycle through seven different flavors". Pauses are about 0.28 s after a sentence and 0.16 s inside one. Four joins that had no natural gap got a muted 6 to 7 frame breath of the same shot.

| Time | Henry says | Full frame | Window |
|---|---|---|---|
| 0:00 | (Nate: "You can now turn Claude into an insane AI designer with five free tools") | Henry, chin on hand, muted | Nate's reel, his audio |
| 0:03 | I mean, is it for real? ... Well, let's test it out. | Henry | |
| 0:08 | (sting) | Kling piping clip 2x + COOKED / OR / CRACKED? | |
| 0:11 | I've actually found a shop in Singapore ... It's called Pompette. | Paper: five-shop sheet, Maps listing, Pompette logo | Henry |
| 0:18 | I will actually put it into Claude | Paper: the prompt being typed | Henry typing |
| 0:21 | with the five connectors that he has suggested to us. | Paper: the five GitHub pages, 0.7 s each | Henry |
| 0:24 | Not bad. It did the wireframing nicely. | v1 site scrolling | Henry |
| 0:28 | Why not? Let's put in Higgsfield. | Paper: Higgsfield widget, generating, then the cones | Henry |
| 0:30 | It's crazy. Like, I can't believe it created this website for me. | Henry | |
| 0:34 | And oh my God, the ice cream swirls perfectly. | Site hero, the swirl fills the cone | Henry |
| 0:38 | What Higgsfield does is it takes a video. | Raw Kling clip | Henry |
| 0:41 | It splices it up into different frames | Paper: 8-frame grid | Henry |
| 0:43 | so when you scroll through each frame, it's like a 3D rendering. | Scrolling into the piping film | Henry |
| 0:48 | If I tell Claude to create a 2 to 3 million dollar website and it comes up with something like this, | Paper: desktop site | Henry |
| 0:53 | I think it's amazing for small business owners. And I'll say this skill is definitely cracked. | Henry | |
| 0:59 | And now if I go to the order platform ... I just wish there'd be more toppings ... | Order page: home, Original, cup, toppings | Henry |
| 1:10 | it's amazing for an order system to connect to your POS system. | Add to order, "You're number 45" | Henry |
| 1:14 | And it's great for the website ... their opening hours, | Menu, then visit + hours | Henry |
| 1:20 | something basic. I could really imagine a business ... through to the CTA | Henry | |
| 1:53 | Well, I give this a 7 out of 10. Definite cracked. | Henry, 1.3x punch-in (take 1) | |
| 1:57 | Comment down DESIGN and I'll send you my entire workflow. | Henry | |

Window: Henry's own take, muted copy, 390x693 low-left with the white frame. Paper cards sit in the top zone (centre y 500, max height 700) so they never touch the window.

Build script: `scratchpad/p2/rebuild_v4.py` in the session scratchpad (copied to `01_scripts/rebuild_v4.py`). It computes every start and end from the audio, so a re-cut is one run plus one edit_item batch.

Next: Pass 3 animation (stamps, prompt card, price stamps, 60/80/100 bar, scoreboard, confetti, save frame), then Pass 4 sound and sound effects, then colour.
