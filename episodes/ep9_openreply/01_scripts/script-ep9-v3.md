# Ep9 script v3: free ManyChat you host yourself, step by step

Word for word, the way you'd tell a friend. Change any word that doesn't sound like you.
No names, no handles. "This reel", "this free repo".
Pause about 1 s at each blank line. As written it's about 365 spoken words, roughly 2 minutes. For a 100 s cut, apply the trim order at the bottom.
Locked with Henry (9 Oct 2026): setup took 30 minutes, keyword CHAT, ManyChat US$54 a month, verdict CRACKED.

---

## 1. Hook (0:00)

This reel says you can get ManyChat for free.

Set up in thirty minutes.

> Screen: you full frame, the reel muted in the window low-left. Sting at 0:03 over your first graphic: the DM arriving on the test phone. Title "Free ManyChat, step by step".

## 2. The promise (0:05)

I tried it. It took me thirty minutes.

And it works. So here's every step.

> Timer stamp 00:30:00. Step counter "0 / 8".

## 3. Will Meta ban you (0:10)

First thing everyone asks. Will Meta ban your account?

No. It uses Meta's own API. Same as ManyChat.

You never give it your password.

> Meta developer page. Stamp OFFICIAL API.

## 4. Step 1, scan and copy (0:18)

Step one. Before I install any repo, I scan it.

This one had one real problem. An old login library.

One command fixed it.

Then I made a private copy on GitHub.

> SkillSpector card, then npm audit 32 to 13, 0 critical. GitHub "Private" badge. Step 1 / 8.

## 5. Steps 2 and 3, database and queue (0:28)

Step two. A free database, Neon.

It remembers your campaigns and every DM you send.

Step three. A free queue, Redis.

Instagram lets you send 750 DMs an hour. The queue holds the rest in line.

> Neon page, tag MEMORY. Redis 30 MB card, tag QUEUE, stamp 750 / HOUR. Steps 2 and 3 / 8.

## 6. Step 4, login emails (0:38)

Step four. Login emails, with Resend. Also free.

Sign up with the same email you log in with.

I didn't. So no email came.

> Resend page, tag LOGIN. Login error page, red WATCH OUT stamp. Step 4 / 8.

## 7. Step 5, put it online (0:45)

Step five. Put it online with Netlify.

You get a free web address. No domain to buy.

> Netlify "Deploy is live". Tag ONLINE. Step 5 / 8.

## 8. Step 6, the Meta app (0:50)

Step six. The Meta app. This is the slow part.

Pick "Manage messaging and content on Instagram".

Check all four permissions are on. Meta's "add all" button skipped one for me.

Add yourself as a tester. Then accept it inside Instagram.

Paste your webhook. And publish.

Until you publish, Instagram sends you nothing.

> Quick cuts: use-case row ticked; permissions table with manage_comments flipping to a tick (WATCH OUT); Roles "Pending" then Instagram "Accept"; webhook green tick; "Published" (WATCH OUT). Step 6 / 8.

## 9. Step 7, the worker (1:05)

Step seven. The worker. That's the part that actually sends the DMs.

Mine runs on my Mac, for free.

If my Mac sleeps, the DMs just wait.

> Terminal "DM Worker Started". Tag WORKER. Step 7 / 8.

## 10. Midpoint gate (1:12)

Comment CHAT and I'll send you this whole setup, step by step.

> CHAT stamp.

## 11. Step 8, the campaign and the test (1:15)

Step eight. The campaign.

My reel. Keyword "cat". A thank-you DM. A follow check. Then the link.

So I tested it from an account that doesn't follow me.

DM in one second.

I tapped "I'm following" without following. Nothing.

Followed. Tapped again. Link.

> Campaign builder with the phone preview. Then your screen recording: comment "Cat", public reply, DM, follow message. Stamp NOT FOLLOWING on the blocked tap. Then the link opening. Step 8 / 8.

## 12. The catch (1:30)

One catch.

If Instagram doesn't answer in time, it sends the link anyway.

So your real followers never get stuck.

> DM log line. Small stamp FAILS OPEN.

## 13. Verdict (1:35)

Cracked.

Free, official, thirty minutes. And it works.

> Scorecard builds, verdict stamp.

## 14. Who it's for (1:40)

ManyChat is fifty-four dollars a month. If you pay that just for comment-to-DM, this does it for zero.

If you want zero setup, stay on ManyChat.

> Price tags: ManyChat US$54 a month crossed out, $0 beside it.

## 15. End (1:46)

Comment CHAT for the step-by-step.

Screenshot this.

> Save frame held 2 s: the free tools card below, CHAT stamp.

---

## Save frame: the free tools, and why

| Tool | Why I use it |
|---|---|
| GitHub (private) | Netlify builds from it. Private keeps your settings hidden. |
| Neon | Free database. Sleeps when idle, so the free hours last. |
| Redis Cloud | Free queue. Keeps you under 750 DMs an hour. |
| Resend | Free login emails. No password to leak. |
| Netlify | Free web address. Keeps your Instagram login alive. |
| Meta app | Free and official. No ban risk. No review for your own account. |
| Your computer | Free worker. Only sends while it's awake. |
| SkillSpector | Free scan before you install anything. |

If anyone asks about Claude in the comments: Claude did the setup with me, and that's on my paid plan.

## Scorecard

| | The reel says | My setup |
|---|---|---|
| Setup time | 30 min | 30 min, 8 steps |
| Cost | free | $0 (ManyChat US$54 a month) |
| Ban risk | | Official API, no password |
| Comment to DM | works | DM in 1 s |
| Follow check | works | Blocks non-followers. Sends anyway if Instagram doesn't answer |

## Trim order if it runs long
1. Cut section 12 (the catch) to one line: "If Instagram doesn't answer, it sends anyway."
2. Merge 7 into 6: "Then put it online with Netlify. Free web address."
3. Drop the second line of section 3.

## Censor in the edit
Same list as v1 (`script-ep9.md`): emails, every key and password, the terminal import table, app and user IDs, portfolio names, the connected-apps list, the test account's name and its old DM thread.
