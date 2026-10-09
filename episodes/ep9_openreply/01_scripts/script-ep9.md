# Ep9 script v1: free ManyChat you host yourself, set up step by step

Pointers, not lines. Say each one your way, to a friend. **Bold** = the phrase to keep.
No names, no handles: say "this reel", "this free repo". Never name the reel's creator or the repo's author.
You talk to camera hands-off; I cut the screen receipts under each point. Pause about 1 s between points.
Numbers in [brackets] you fill or confirm; never say a number that is not on screen.

Target: this one teaches, so 90 to 110 s is fine. Trim order at the bottom.
Keyword: [REPLY] (your call; must not be a word your ManyChat already uses).

## The claim
The reel's caption: "It takes around 30 mins of setup." Comment-to-DM, free, open source.
Receipts (caption and pinned comment only, never spoken): 5,311 likes, 11K comments, checked 9 Oct 2026.

## Step by step

| # | You (pointer) | On screen |
|---|---|---|
| 1 | **This reel says you can get ManyChat for free.** Set up in **30 minutes**. | You full frame. The reel muted in the window low-left. |
| 2 | *(sting)* | Egg jingle title. Under it, your proof: the DM arriving on the test phone. Title "Free ManyChat, step by step". |
| 3 | **It took me [X hours].** So here's every step, so it takes you 30. | Timer stamp [X:XX]. |
| 4 | First, **will Meta ban you?** It uses **Meta's own API.** No password, no scraping. Same pipe ManyChat uses. | Meta developer page, "Instagram API" header. Stamp "OFFICIAL API". |
| 5 | **Step 1. Scan it, then copy it.** I scan every repo first. **One real problem, an old login library.** Updated in one command. Then a **private copy on GitHub.** | SkillSpector score card, then `npm audit` before/after (32 to 13, no critical). GitHub "Private" badge. |
| 6 | **Step 2. A database.** Neon, free. It **remembers your campaigns and every DM sent.** | Neon project page, "Free plan". Stamp "MEMORY". |
| 7 | **Step 3. A queue.** Redis Cloud, free. **Instagram lets you send 750 DMs an hour.** The queue **holds the rest in line.** | Redis "30MB" card. Stamp "750 / HOUR". |
| 8 | **Step 4. Login emails.** Resend, free. **Sign up with the same email you'll log in with.** Mine didn't, so **no email came.** | Resend API keys page. Login page with the error, then the email arriving. |
| 9 | **Step 5. Put it online.** Netlify, free. **You get a free web address.** No domain to buy. | Netlify deploy log "Deploy is live", the henry-openreply URL (blur if you want it private). |
| 10 | **Step 6. The Meta app. This is the slow part.** Five things: | Meta dashboard, one panel per item, quick cuts. |
| 10a | Pick **"Manage messaging and content on Instagram"**. | Use-case list, that row ticked. |
| 10b | **Check all four permissions are on.** Meta's "add all" button **skipped one** for me. | Permissions table, manage_comments showing "+ Add", then "Ready for testing". Circle it. |
| 10c | Add your account as a **tester, then accept it inside Instagram.** | Roles: Pending. Instagram: Tester invitations, Accept. |
| 10d | Paste your **webhook address** and verify. | Configure webhooks, green tick. |
| 10e | **Publish.** Until you do, **Instagram sends you nothing.** | Publish page, "Published". |
| 11 | **Step 7. The worker.** It's the part that **actually sends the DMs.** **Mine runs on my Mac for free.** Mac asleep, DMs wait. | Terminal "DM Worker Started". Stamp "WORKER". |
| 12 | **Comment [REPLY]** and I'll send you the step-by-step guide. | [REPLY] stamp (midpoint gate). |
| 13 | **Step 8. Build the campaign.** Pick the reel. Keyword cat. Thank-you DM. Follow message. Link. | Campaign builder, the phone preview filling in. |
| 14 | **Then I tested it from an account that doesn't follow me.** | Your screen recording: comment "Cat", public reply. |
| 15 | **DM in one second.** Tapped the button. **Follow message.** Tapped I'm following. **Link.** | Recording continues to the follow message, I'm following, the zerocontext page opening. DM log "SENT". |
| 16 | [Verdict, COOKED or CRACKED, score /10] | Scorecard builds. |
| 17 | **The catch.** That account **doesn't follow me, and it still got the link.** [On a starter Meta app, Instagram won't say who follows you. So the follow check lets everyone through.] | Recording frame "I'm following" with a red stamp "NOT FOLLOWING". DM log line. |
| 18 | **Who's this for?** **If you pay for ManyChat just for comment-to-DM,** this does that for **$0.** | Price tags: ManyChat [US$X a month], this repo $0. |
| 19 | **Who it's not for:** if you want **zero setup**, stay on ManyChat. | Your setup list, 8 steps, stamped "[X HOURS]". |
| 20 | **Comment [REPLY]** for the guide. **Screenshot this.** | Save frame: the free tools card (below) held 2 s, [REPLY] stamp. |

Trim order if it runs past 110 s: fold 6 and 7 into one line ("a free database and a free queue"), then cut 19, then cut 10c to the stamp only.

## The free tools, and why I use each (save frame + your pointers if asked "why")

- **GitHub (private repo)**: Netlify builds from it. **Private, so your settings never go public.**
- **Netlify**: **free web address**, hosts your dashboard and the address Instagram talks to. **Daily jobs keep your Instagram login alive** (it expires every 60 days).
- **Neon**: **free database.** 0.5 GB holds [100,000+] DMs. **Sleeps when nobody's using it**, so the free hours last.
- **Redis Cloud**: **free queue, 30 MB.** Keeps you under Meta's **750 DMs an hour**, and nothing gets dropped.
- **Resend**: **free login emails, 3,000 a month.** No password to leak.
- **Meta developer app**: **free, official.** **No ban risk,** no password shared. **No App Review** when it's only your account.
- **Your own computer**: **free worker.** The catch: **it only sends while it's awake.** Free 24/7 option: a Google Cloud free server.
- **SkillSpector**: **free scanner.** I run it **before I install any repo.**

Honest line if you mention Claude: **Claude did the setup with me. That part is on my plan, not free.**

## Scorecard (save frame)

| | The reel says | My setup |
|---|---|---|
| Setup time | 30 min | [X hours] (8 steps, 6 services) |
| Cost | free | $0 (Claude not counted) |
| Ban risk | | official API, no password |
| Comment to DM | works | DM in 1 s |
| Follow check | works | [lets non-followers through on a starter app] |

## New supers for this episode (template kept)
1. **Step counter**: a paper tab "STEP 3 / 8" that ticks on each step. Props: step, total.
2. **Service tag**: the tool's logo on a kraft tag with one word under it (MEMORY, QUEUE, LOGIN, ONLINE, WORKER). Props: logo, word.
3. **Gotcha stamp**: a red "WATCH OUT" stamp that slaps over the screen on 8, 10b, 10e and 17. Props: text.
4. **Permission checklist**: four rows with ticks, one row flips from "+ Add" to a tick. Props: rows, which one flips.
5. **Price tags**: ManyChat [US$X] crossed out, $0 beside it. Props: two values.

## What to censor in the edit (blur or box every time it shows)
- **Emails**: your Gmail, the Zero Context email, the Facebook contact email on Meta's settings page.
- **Every secret**: app secrets, API keys (Resend, Meta), the webhook verify token, database and Redis addresses and passwords, the encryption key. **The terminal import table prints all of them in full; never show that table.**
- **IDs**: Meta app ID, Instagram app ID, Instagram user IDs in logs, the Neon project ID.
- **Accounts list**: Business Suite portfolio names, the "Apps and websites" list (ManyChat, OpusClip and other connected apps), your Netlify team name.
- **The test account**: its username and the old messages above the test DM (the balloons thread).
- **Optional**: the henry-openreply web address, if you want nobody poking at your login page (the login is locked to your email anyway).

## Receipts on file (dated, for the cut)
- Proof video: `~/Downloads/ScreenRecording_10-09-2026 07-49-42_1.MP4` (92 s, test account that does not follow you). Move it into `04_raw-footage/` before the edit.
- DM log: comment matched "cat" and the first DM was sent [under 5 s] later; both button taps completed (worker log).
- Scan: SkillSpector 100/100 CRITICAL; the real item was the login library (@auth/core 0.41.2), fixed by `npm audit fix`, 32 to 13 issues, 0 critical.
- Meta "add all permissions" skipped instagram_business_manage_comments (screenshot from the permissions page).
- Resend test sender only delivers to the email the Resend account was made with.
- Follow check: [confirm from the worker log after your next "I'm following" tap].
- ManyChat price: [check manychat.com/pricing on the day].
