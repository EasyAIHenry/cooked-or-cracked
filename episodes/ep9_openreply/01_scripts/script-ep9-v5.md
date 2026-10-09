# Ep9 script v5: ManyChat's comment-to-DM, free for life, set up live

Word for word, the way you'd tell a friend. Change any word that doesn't sound like you.
No names, no handles. "This reel", "this free repo".
Locked: setup 30 minutes, keyword CHAT, ManyChat US$54 a month, verdict CRACKED.
v5 changes: new hook, no "it works" before the test (the suspense is you trying it live), worker on a free Google Cloud server so the Mac can be off.
As written: about 520 spoken words, roughly 3 min 5 s. The trim order at the bottom takes it to about 2 min 20 s.

---

## 1. Hook (0:00)

ManyChat charges fifty-four dollars a month to auto-DM your comments.

This reel says you can build the same thing. Free, for life. Thirty minutes.

So I'm trying it. Timer's on. Follow along.

> Screen: ManyChat pricing page, US$54 circled. Then the reel muted in the window low-left. Timer starts 00:00 and keeps running in the corner through every step. Sting at 0:06 on "Timer's on". Title "Free ManyChat, set up live".

## 2. Will Meta ban you (0:08)

First, will Meta ban your account?

ManyChat uses Meta's official API. This uses the same one.

You never type your Instagram password into it. You log in on Instagram's own page.

> Meta developer page "Instagram API". Then the Instagram login screen. Stamp OFFICIAL API.

## 3. Step 1, scan it (0:16)

Step one. Before I install any free code, I scan it.

There's a free scanner called SkillSpector. It reads every file and flags anything shady.

It found one real problem. An old login library.

One command updated it.

> SkillSpector report, then the npm audit before and after: 32 issues to 13, critical 0. Step counter 1 / 8. Tag SCAN.

## 4. Step 2, your own copy on GitHub (0:26)

Step two. I made my own private copy on GitHub.

Private means nobody else can see your settings.

And it's your copy. If the original disappears, yours keeps running.

> GitHub repo page with the "Private" badge. Step 2 / 8. Tag YOUR COPY.

## 5. Step 3, Neon, the notebook (0:34)

Step three. Neon. It's a free database.

Think of it as the notebook.

It writes down every comment, every campaign, and every DM it sent.

So nobody gets the same DM twice.

> Neon dashboard, "Free plan". Then a DM log row. Tag NOTEBOOK. Step 3 / 8.

## 6. Step 4, Redis, the waiting line (0:43)

Step four. Redis. It's the waiting line.

Instagram only lets you send 750 DMs an hour.

So if two thousand people comment at once, they don't get lost.

They wait in line, and get their DM in order.

The free plan is 30 megabytes. One waiting DM is tiny.

So 30 megabytes holds over ten thousand people in line.

> Redis "30MB" card. Animation: 2,000 comment bubbles queue into a line, a 750 / HOUR gate lets them through. Tag WAITING LINE. Step 4 / 8.

## 7. Step 5, Resend, the login email (0:57)

Step five. Resend. It sends emails.

Your dashboard has no password.

To log in, it emails you a link. Only your inbox gets in.

Free for 3,000 emails a month. You'll use maybe five.

One tip. Sign up with the same email you log in with. Or the email never comes.

> Login page, then the email arriving, then the dashboard. WATCH OUT stamp on the tip. Tag LOGIN. Step 5 / 8.

## 8. Step 6, Netlify, the dashboard online (1:09)

Step six. Netlify puts your dashboard online.

You get a free web address. No domain to buy.

I'm on Netlify's paid plan. The free plan works too.

This is the dashboard. Campaigns, every DM, every click.

> Netlify "Deploy is live". Then the dashboard: campaigns list, DM logs, click count. Tag ONLINE. Step 6 / 8.

## 9. Step 7, the Meta app, the key (1:19)

Step seven. The Meta app. This is the key.

Everything links to it.

The Meta app tells Instagram: when someone comments, tell my dashboard.

Four things to tick.

Pick "Manage messaging and content on Instagram".

Check all four permissions are on. Meta's "add all" button skipped one for me.

Add yourself as a tester. Then accept it inside Instagram.

Then publish. Until you publish, Instagram sends you nothing.

> Diagram first: Instagram, then Meta app, then Netlify, then Neon and Redis, then the Google server, arrows lighting up in order. Then quick cuts: use-case row, permissions table (manage_comments flips to a tick, WATCH OUT), tester Pending then Accept, "Published" (WATCH OUT). Step 7 / 8.

## 10. Midpoint gate (1:39)

Comment CHAT and I'll send you every step.

> CHAT stamp.

## 11. Step 8, the worker, on a free Google server (1:42)

Step eight. The worker. It's the part that actually sends the DMs.

I put it on a free Google Cloud server.

So it runs all day. My laptop can be off.

> Google Cloud console: the e2-micro server "Running" (blur the project ID). Then the dashboard health "worker healthy". Tag WORKER. Step 8 / 8.

## 12. The card question (1:50)

Google asked me for a card. That's to check you're a real person.

This server is in Google's always-free tier. And I set an alert at two dollars.

Everything else here, no card at all.

> Google billing page with the budget alert "SGD 2" (blur the account ID). Price tags: Neon 0, Redis 0, Resend 0, Meta 0, Google 0. Stamp CARD ON FILE, $0 CHARGED.

## 13. The live test (1:59)

Timer stops. Thirty minutes.

Now the test. An account that doesn't follow me comments "cat".

DM in one second.

I tap "I'm following" without following. It holds the link back.

Follow. Tap again. Link.

> Timer freezes at 30:00. Then your screen recording: comment, DM, follow message, NOT FOLLOWING stamp on the blocked tap, then the link opening. This is the first time the viewer sees it work.

## 14. Good side, downside (2:14)

The good side. Free. Official API. Runs all day. Works like ManyChat.

The downside. Thirty minutes of setup. ManyChat is five.

> Two columns, ticks and crosses: FREE, OFFICIAL, RUNS 24/7, WORKS / 30 MIN SETUP.

## 15. Compare and verdict (2:22)

ManyChat is fifty-four dollars a month. This is zero.

Cracked.

> Price tags: ManyChat US$54 a month crossed out, $0. Verdict stamp CRACKED.

## 16. End (2:28)

Comment CHAT for the step-by-step.

Screenshot this.

> Save frame held 2 s: the "What each tool does" card below, CHAT stamp.

---

## Save frame: what each tool does

| Tool | What it does, in one line | Cost |
|---|---|---|
| SkillSpector | Scans free code before you install it | Free |
| GitHub (private) | Your own copy. Nobody sees your settings | Free |
| Neon | The notebook. Remembers every comment and DM | Free, no card |
| Redis | The waiting line. Keeps you under 750 DMs an hour | Free |
| Resend | Emails you a login link. No password | Free, no card |
| Netlify | Puts your dashboard online | Free plan works |
| Meta app | The key. Connects Instagram to everything | Free |
| Google Cloud | Runs the worker all day | Always-free server |

## Scorecard

| | ManyChat | This |
|---|---|---|
| Price | US$54 a month | $0 |
| Ban risk | Official API | Same official API |
| Setup | About 5 min | 30 min |
| Follow check | Yes | Yes |
| Runs when your laptop is off | Yes | Yes |

## Fact check notes (do not say, for you and the cut)
- "Free for life" holds while the free plans exist. Pinned comment: "free plans as of Oct 2026".
- 30 MB: Redis used about 2 MB empty, one waiting DM is about 2 KB, so roughly 14,000 fit. "Over ten thousand" is safe.
- Google's free tier: one e2-micro in us-central1, 30 GB standard disk, 1 GB outbound a month. Google's price list: the server's public address is free for the first 744 hours a month, which is a full month.
- The worker's measured idle traffic is about 0.25 GB a month after my change, against the free 1 GB.
- Budget alert is SGD 2 because your billing account is in Singapore dollars. Say "two dollars".
- Netlify: your team is on Pro, a paid plan, so "I'm on Netlify's paid plan" is accurate.

## Trim order (to get to about 2 min 20 s)
1. Section 2: cut the third line (the Instagram login page).
2. Section 6: cut the last two lines (30 MB), keep it in the save frame.
3. Section 9: cut the four ticks to one line: "Four settings. I'll put them in the guide."
4. Section 12: keep only "Google asked for a card. The server is always-free, and I set an alert at two dollars."

## Censor in the edit
Emails, every key and password, the terminal import table, app and user IDs, the Google project and billing account IDs, the server's IP address, portfolio names, the connected-apps list, the test account's name and its old DM thread. Full list in `script-ep9.md`.
