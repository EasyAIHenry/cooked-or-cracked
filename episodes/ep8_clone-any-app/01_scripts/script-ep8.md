# Ep8 script v1: "clone any app with Claude", tested on Loom in one hour

Pointers in your words, beat for beat against the reference reel so the shape matches. Bold = the phrase to keep. No names, no handles: say "this reel", "the repo", "these free skills".
You talk to camera hands-off; I cut the screen receipts under each point. Pause about 1 s between points.
Target 65 to 75 s. Keyword CLONE (Henry, 7 Oct 2026; same word as the reel, his choice). Numbers in [brackets] come from your hour; do not say a number that is not on screen.

## Beat for beat

| # | The reel (what he says, at) | You (pointer) | On screen |
|---|---|---|---|
| 1 | 0:00 "You can now clone any app with Claude. So you never have to pay for a subscription again." | *(silent, you watching the reel on your phone; his line plays with his audio, 3 s)* | You full frame. Reel in the window low-left. |
| 2 | *(sting)* | *(silent, sting at 0:03)* | Egg jingle title top band. Under it, your result: your own recorder playing a share link. Episode title "Clone any app with Claude". |
| 3 | 0:03 "It's called the replica skill and it's completely free." | **This reel says I can clone any app** with Claude, for free, and stop paying subscriptions. **I pay for Loom. So I gave it one hour.** | Loom pricing card, US$15 a month. Timer starts 00:00. |
| 4 | 0:05 "It's not one skill either, it's 11 of them." | It's a free repo. **11 skills. That part is true.** | Terminal: `ls ~/.claude/skills` shows the 11. Stamp "11 skills" |
| 5 | *(no equivalent; our safety beat)* | **Before I install any repo I scan it.** This one came back **HIGH**. So I read the finding. It's a list of words like "free" and "best" inside a lint tool. **False alarm.** Installed. | SkillSpector report 60/100 HIGH, then the regex line circled, then the install log (under 1 s). |
| 6 | 0:08 "One reverse-engineers the app you want to clone." | First I asked it to size **Canva**, the app in the reel's own hook. | Reel frame: Canva logo being scanned. Then recon output. |
| 7 | 0:13 "so you get a perfect clone of any app every time." | It said **[XL. Rescope it.]** Its own page says a booking tool is weeks. **Perfect clone every time? Its own page says no guarantee.** | README lines highlighted: "No guarantee of a perfect clone", "A booking tool is weeks". |
| 8 | 0:10 "another rebuilds it" | So I picked **one job: record my screen, get a link.** [12] minutes of recon and planning. Then it built. | Recon table, screens and flows count. Architect: stack in one line. Timer running. |
| 9 | 0:11 "then one tests it for bugs" | **[38] minutes in, I'm recording this on my own tool and sending the link.** | Full frame: your clone recording, share page playing. Timer frozen at [00:38]. |
| 10 | 0:15 "But the craziest part is the entrepreneur skill. It goes and performs research on the app you cloned, then it reads user feedback." | **The entrepreneur skill.** The reel says it does the research. **The skill says: copy the reviews into a spreadsheet yourself.** By hand. | SKILL.md line "copy rows into the sheet" highlighted. |
| 11 | 0:19 "to find missing features, unsolved problems, and things that people hate." | I pulled **[50] reviews from Apple's feed** instead. Top complaint: **[the five minute cap on free]**. It wrote that into my build plan. | Terminal: curl, then feedback.md with the theme count. Stamp with the complaint. |
| 12 | 0:23 "Then solves all of those problems in your app, so you have an actual app you can go and sell." | Sell it? There's a rebrand skill, a launch skill, and a line that says **talk to a lawyer**. **Not in one hour.** | brand SKILL.md "talk to a lawyer" line. Parity score card: [62]. |
| 13 | *(midpoint gate)* | **Comment CLONE** and I'll send you my version. | CLONE stamp |
| 14 | *(verdict)* | [COOKED or CRACKED]. [score] out of 10. | Scorecard builds, stamp. |
| 15 | *(real-life beat)* | **If you pay for one tool and use one feature, this gets you that feature in an hour.** A whole Canva, no. Loom's recorder, yes. | Split: Canva XL card vs your recorder playing. |
| 16 | *(price)* | **The skills are free. Claude is [your plan].** Hosting is free at zero users. Loom was US$15 a month. | Price cards: skills 0, Claude [X], Loom 15. |
| 17 | *(risk)* | Two things. **Scan every repo first.** And **it rebuilds what an app does, not what it owns.** No logos, no copy, no catalogue. The repo says that itself. | SkillSpector card. README fine print "never what it owns". |
| 18 | 0:27 "To set it up, just paste this link inside of Claude and say install skill." | [His install line: it [worked / did nothing] in the Claude app. The clone route took one second.] | Claude app with the pasted URL, then the terminal. |
| 19 | 0:29 "comment CLONE and I'll shoot..." | **Comment CLONE** and I'll send you my version, the one-hour way. **Screenshot this.** | Save frame: scorecard held 2 s, CLONE stamp. |

Trim order if it runs past 75 s: drop 18 (fold the install result into 5), then 12, then shorten 7 to the README line only.

## Scorecard (save frame)
| | The reel says | My hour |
|---|---|---|
| Clone any app | yes | one feature of one app. Canva: [XL] |
| Perfect clone | every time | parity [62] of 100 |
| Free | completely | skills free. Claude [plan]. Hosting free at zero users |
| Entrepreneur research | automatic | you copy reviews by hand, or pull Apple's feed |
| Install | paste a link | [result]. Scan first: HIGH was a false alarm |
| Time to a working recorder | | [38] min |

## New supers for this episode (design list, template kept)
1. **Timer stamp**: paper stamp with a running mm:ss, freezes on the result beat. Props: start frame, freeze value.
2. **Size card**: S / M / L / XL tiles, the chosen one fills red, with the repo's own word under it ("rescope it"). Props: size, caption.
3. **Scan verdict card**: SkillSpector 60/100 HIGH with the regex line sliding in and "false alarm" stamped over it. Props: score, severity, finding text.
4. **Reel vs repo line**: two torn-paper strips, top "the reel says", bottom "the repo says", words typed in. Props: top text, bottom text. Used on 7, 10, 17.
5. **Complaint stamp**: review count plus the top theme in one line, with a tiny star row. Props: count, theme, stars.
6. **Price row**: three paper tags, 0, [X], 15, US$ and "a month". Props: three values and labels.

## Receipts to have before the cut (dated)
- Reel stats at 3 days: 608,746 plays, 9,529 comments (6 Oct 2026). Caption only, never spoken.
- SkillSpector 60/100 HIGH; finding = `replica-launch/listing.py:33` word regex. `06_research/skillspector-scan.txt`.
- README lines: "No guarantee of a perfect clone", "A booking tool is weeks. A spreadsheet engine is not.", "It rebuilds what an app does, never what it owns.", "You cannot clone its catalogue."
- Entrepreneur SKILL.md: "Reading, not scraping. Read review pages the way a person does, in the browser, and copy rows into the sheet."
- Brand SKILL.md: "talk to a lawyer before launch if there is money on the line."
- Loom pricing: Business US$15 a month per creator billed yearly [check loom.com/pricing on the day].
- Your hour: timer reads, parity score, review count, top theme, `/cost`.
