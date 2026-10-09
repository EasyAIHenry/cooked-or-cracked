# Ep9 script v4: ManyChat's comment-to-DM, free for life, step by step

Word for word, the way you'd tell a friend. Change any word that doesn't sound like you.
No names, no handles. "This reel", "this free repo".
Locked: setup 30 minutes, keyword CHAT, ManyChat US$54 a month, verdict CRACKED.
[Brackets] = one thing only you know. Fill it or cut the line.
As written: about 560 spoken words, roughly 3 min 20 s. The trim order at the bottom takes it to about 2 min 30 s.

---

## 1. Hook (0:00)

You can get ManyChat's comment-to-DM. Free, for life.

It runs on Meta's own API. So no ban risk.

No monthly fee. Nothing.

I'll take you through it, step by step.

> Screen: the final product first. Someone comments CHAT, the DM pops up, the button, the link opens. Fast cuts, 4 s. Sting at 0:04 over it. Title "ManyChat, free for life". Stamp FREE FOR LIFE.

## 2. The promise (0:08)

This reel said thirty minutes to set up.

I tried it. Thirty minutes. And it works.

> The reel muted in the window low-left. Timer stamp 00:30:00.

## 3. Will Meta ban you (0:13)

First, will Meta ban your account?

ManyChat uses Meta's official API. This uses the same one.

You never type your Instagram password into it. You log in on Instagram's own page.

So to Meta, it looks exactly like ManyChat.

> Meta developer page "Instagram API". Then the Instagram login screen. Stamp OFFICIAL API.

## 4. Step 1, scan it (0:22)

Step one. Before I install any free code, I scan it.

There's a free scanner called SkillSpector. It reads every file and flags anything shady.

It found one real problem. An old login library.

One command updated it.

> SkillSpector report, then the npm audit before and after: 32 issues to 13, critical 0. Step counter 1 / 8. Tag SCAN.

## 5. Step 2, your own copy on GitHub (0:32)

Step two. I made my own private copy on GitHub.

Private means nobody else can see your settings.

And it's your copy. If the original changes or disappears, yours keeps running.

> GitHub repo page with the "Private" badge. Step 2 / 8. Tag YOUR COPY.

## 6. Step 3, Neon, the memory (0:40)

Step three. Neon. It's a free database.

Think of it as the notebook.

It writes down every comment, every campaign, and every DM it sent.

So nobody gets the same DM twice.

> Neon dashboard, "Free plan". Then a DM log row. Tag MEMORY. Step 3 / 8.

## 7. Step 4, Redis, the waiting line (0:50)

Step four. Redis. It's the waiting line.

Instagram only lets you send 750 DMs an hour.

So if two thousand people comment at once, they don't get lost.

They wait in line, and get their DM in order.

The free plan is 30 megabytes. One waiting DM is tiny.

So 30 megabytes holds over ten thousand people in line.

> Redis "30MB" card. Animation: 2,000 comment bubbles queue into a line, 750 go through per hour stamp. Tag WAITING LINE. Step 4 / 8.

## 8. Step 5, Resend, the login email (1:05)

Step five. Resend. It sends emails.

Your dashboard has no password.

To log in, it emails you a link. Only your inbox gets in.

Free for 3,000 emails a month. You'll use maybe five.

One tip. Sign up with the same email you log in with. Or the email never comes.

> Login page, then the email arriving, then the dashboard. WATCH OUT stamp on the tip. Tag LOGIN. Step 5 / 8.

## 9. Free plans and the card question (1:17)

Everything here is on a free plan.

[Redis] asked me for a card. That's to stop fake sign-ups.

The free plan has a hard limit. When you hit it, it stops. It doesn't charge you.

And Meta's API is free. No fee per DM.

> Price tags: GitHub 0, Neon 0, Redis 0, Resend 0, Meta 0. Stamp CARD ON FILE, $0 CHARGED.

## 10. Step 6, Netlify, the dashboard online (1:27)

Step six. Netlify puts your dashboard online.

You get a free web address. No domain to buy.

I'm on Netlify's cheapest paid plan. The free plan works too.

This is the dashboard. Campaigns, every DM, every click.

> Netlify "Deploy is live". Then the OpenReply dashboard: campaigns list, DM logs, click count. Tag ONLINE. Step 6 / 8.

## 11. Step 7, the Meta app, the key (1:37)

Step seven. The Meta app. This is the key.

Everything links to it.

The Meta app tells Instagram: when someone comments, tell my dashboard.

Four things to tick.

Pick "Manage messaging and content on Instagram".

Check all four permissions are on. Meta's "add all" button skipped one for me.

Add yourself as a tester. Then accept it inside Instagram.

Then publish. Until you publish, Instagram sends you nothing.

> Diagram first: Instagram, then Meta app, then Netlify, then Neon and Redis, then your Mac, arrows lighting up in that order. Then quick cuts: use-case row, permissions table (manage_comments flips to a tick, WATCH OUT), tester Pending then Accept, "Published" (WATCH OUT). Step 7 / 8.

## 12. Midpoint gate (1:57)

Comment CHAT and I'll send you every step.

> CHAT stamp.

## 13. Step 8, the worker on my Mac (2:00)

Step eight. The worker. It's the part that actually sends the DMs.

Mine runs on my Mac. For free.

I just keep my Mac on.

> Terminal "DM Worker Started". MacBook open on the desk. Tag WORKER. Step 8 / 8.

## 14. The test (2:07)

Then I built the campaign, and tested it with an account that doesn't follow me.

It commented "cat". DM in one second.

I tapped "I'm following" without following. It held the link back.

Followed. Tapped again. Link.

> Campaign builder with the phone preview. Then your screen recording: comment, DM, follow message, NOT FOLLOWING stamp on the blocked tap, then the link opening.

## 15. Good side, downside (2:20)

The good side. Free. Official API. Works like ManyChat.

The downside. My Mac has to stay on, or the DMs wait.

And it's thirty minutes of setup. ManyChat is five.

> Two columns, ticks and crosses: FREE, OFFICIAL, WORKS / MAC ON, 30 MIN SETUP.

## 16. Compare and verdict (2:28)

ManyChat is fifty-four dollars a month. This is zero.

Cracked.

> Price tags: ManyChat US$54 a month crossed out, $0. Verdict stamp CRACKED.

## 17. End (2:34)

Comment CHAT for the step-by-step.

Screenshot this.

> Save frame held 2 s: the "What each tool does" card below, CHAT stamp.

---

## Save frame: what each tool does

| Tool | What it does, in one line | Cost |
|---|---|---|
| SkillSpector | Scans free code before you install it | Free |
| GitHub (private) | Your own copy. Nobody sees your settings | Free |
| Neon | The notebook. Remembers every comment and DM | Free |
| Redis | The waiting line. Keeps you under 750 DMs an hour | Free |
| Resend | Emails you a login link. No password | Free |
| Netlify | Puts your dashboard online | Free plan works |
| Meta app | The key. Connects Instagram to everything | Free |
| Your Mac | Sends the DMs. Keep it on | Free |

## Scorecard

| | ManyChat | This |
|---|---|---|
| Price | US$54 a month | $0 |
| Ban risk | Official API | Same official API |
| Setup | About 5 min | 30 min |
| Follow check | Yes | Yes |
| Catch | | Mac stays on |

## Fact check notes (do not say, for you and the cut)
- "Free for life" holds while the free plans exist. If you want to be safe in the pinned comment: "free plans as of Oct 2026".
- 30 MB: Redis used about 2 MB empty. One waiting DM is about 2 KB. So roughly 14,000 fit. "Over ten thousand" is safe.
- Hard limits: Netlify's free plan pauses the site when credits run out, no overage. Neon's free plan suspends compute at the limit. Redis says it notifies you before limiting the free database.
- [Redis] on the card line: replace with whichever service actually asked you for a card. If none did, cut section 9's second and third lines and keep "Everything here is on a free plan. And Meta's API is free."
- Netlify: your team is on the Pro plan. Say "cheapest paid plan" only if that is what you pay for; otherwise say "I'm on a paid plan".

## Trim order (to get to about 2 min 30 s)
1. Section 3: cut "So to Meta, it looks exactly like ManyChat."
2. Section 7: cut the last two lines (30 MB), keep it in the save frame.
3. Section 9: keep only "Everything here is on a free plan. And Meta's API is free."
4. Section 11: cut the four ticks to one line: "Four settings. I'll put them in the guide."

## Censor in the edit
Emails, every key and password, the terminal import table, app and user IDs, portfolio names, the connected-apps list, the test account's name and its old DM thread. Full list in `script-ep9.md`.
