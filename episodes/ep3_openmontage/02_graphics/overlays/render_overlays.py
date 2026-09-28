#!/usr/bin/env python
"""Render the four transparent overlay animations for the Ep3 reel.

Each overlay is rendered as Pillow RGBA frames (drawn at 2x and downsampled)
and piped into ffmpeg as ProRes 4444 with alpha (yuva444p10le), 30 fps.
After rendering, each .mov is decoded back with ffmpeg and a 1 fps strip on
mid-grey is written next to it so the real output can be eyeballed.

Usage:
    render_overlays.py                 # render all four + strips
    render_overlays.py styles-pick     # render one (names below)
    render_overlays.py --strips-only   # only rebuild the strips from the .movs
"""
import math
import os
import random
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30
SS = 2  # supersample factor for all sprite drawing

PAPER = (255, 254, 250)
INK = (23, 20, 17)
ACCENT = (223, 130, 95)
GOLD = (242, 193, 78)  # confetti only; unused here on purpose
WHITE = (255, 255, 255)
RULE = (196, 206, 220)
GREY = (128, 128, 128)

FONT_XB = "/Users/henrychua/Library/Fonts/Inter_18pt-ExtraBold.ttf"
FONT_B = "/Users/henrychua/Library/Fonts/Inter_18pt-Bold.ttf"
STYLE_DIR = ("/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep3_OpenMontage"
             "/10_style-samples/airline")
STYLE_IMGS = ["1-flat-vector.png", "2-comedy-cartoon.png", "3-chibi-3d.png",
              "4-pulp-comic.png", "5-paper-cutout.png"]


# ----------------------------------------------------------------- helpers

def font(path, size):
    """Font at supersampled resolution; size given in 1x px."""
    return ImageFont.truetype(path, int(round(size * SS)))


def mix(a, b, t):
    return tuple(int(round(a[i] * (1 - t) + b[i] * t)) for i in range(3))


def clamp01(t):
    return max(0.0, min(1.0, t))


def ease_out_cubic(t):
    t = clamp01(t)
    return 1 - (1 - t) ** 3


def ease_in_cubic(t):
    t = clamp01(t)
    return t ** 3


def smooth(t):
    t = clamp01(t)
    return t * t * (3 - 2 * t)


def ease_in_out_cubic(t):
    t = clamp01(t)
    return 4 * t * t * t if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def ease_out_back(t, s=1.70158):
    t = clamp01(t)
    c3 = s + 1
    return 1 + c3 * (t - 1) ** 3 + s * (t - 1) ** 2


def pop(f, dur=13, peak=1.1, start=0.3):
    """Series entrance: scale start -> peak -> 1.0 over dur frames.
    f < 0 means not started (returns 0 = hidden). No fade, no jitter."""
    if f < 0:
        return 0.0
    if f >= dur:
        return 1.0
    a = int(round(dur * 0.6))
    if f <= a:
        return start + (peak - start) * ease_out_cubic(f / a)
    return peak + (1.0 - peak) * smooth((f - a) / (dur - a))


def torn_outline(w, h, seed, radius=0, amp=2.0, step=10, max_out=None):
    """Polygon points (SS px) of a torn-edged (optionally rounded) w x h rect.
    Deterministic per seed so the edge never jitters between frames."""
    rng = random.Random(seed)
    W, H = w * SS, h * SS
    R = min(radius * SS, W / 2, H / 2)
    st = step * SS
    pts = []

    def line(x0, y0, x1, y1):
        L = math.hypot(x1 - x0, y1 - y0)
        n = max(1, int(L / st))
        for i in range(n):
            t = i / n
            pts.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t))

    def arc(cx, cy, a0, a1):
        L = math.radians(abs(a1 - a0)) * R
        n = max(2, int(L / st))
        for i in range(n):
            a = math.radians(a0 + (a1 - a0) * i / n)
            pts.append((cx + R * math.cos(a), cy + R * math.sin(a)))

    if R > 0:
        line(R, 0, W - R, 0)
        arc(W - R, R, -90, 0)
        line(W, R, W, H - R)
        arc(W - R, H - R, 0, 90)
        line(W - R, H, R, H)
        arc(R, H - R, 90, 180)
        line(0, H - R, 0, R)
        arc(R, R, 180, 270)
    else:
        line(0, 0, W, 0)
        line(W, 0, W, H)
        line(W, H, 0, H)
        line(0, H, 0, 0)

    n = len(pts)
    phase = rng.random() * 6.28
    k = rng.uniform(0.02, 0.05)
    out = []
    for i, (x, y) in enumerate(pts):
        xp, yp = pts[i - 1]
        xn, yn = pts[(i + 1) % n]
        tx, ty = xn - xp, yn - yp
        L = math.hypot(tx, ty) or 1.0
        nx, ny = ty / L, -tx / L  # outward normal (clockwise walk, y down)
        d = rng.gauss(0, amp * SS) + 0.6 * amp * SS * math.sin(i * k * 6.28 + phase)
        if rng.random() < 0.06:
            d -= rng.uniform(1.5, 3.5) * amp * SS  # small nick inward
        if max_out is not None:
            d = min(d, max_out * SS)  # cap how far the tear reaches outward
        out.append((x + nx * d, y + ny * d))
    return out


class Spr:
    """An RGBA sprite at SS resolution with an anchor point (SS px)."""

    def __init__(self, img, ax, ay):
        self.img, self.ax, self.ay = img, ax, ay
        self._cache = {}

    def scaled(self, w, h):
        key = (w, h)
        if key not in self._cache:
            if len(self._cache) > 12:
                self._cache.clear()
            self._cache[key] = self.img.resize((w, h), Image.LANCZOS)
        return self._cache[key]


def rotate_spr(img, ax, ay, angle):
    """Rotate (counter-clockwise, degrees) with expand and track the anchor."""
    if abs(angle) < 1e-6:
        return img, ax, ay
    W, H = img.size
    out = img.rotate(angle, resample=Image.BICUBIC, expand=True)
    W2, H2 = out.size
    th = math.radians(angle)
    dx, dy = ax - W / 2, ay - H / 2
    nx = math.cos(th) * dx + math.sin(th) * dy
    ny = -math.sin(th) * dx + math.cos(th) * dy
    return out, W2 / 2 + nx, H2 / 2 + ny


def paper_sprite(w, h, seed, tilt=0.0, radius=0, amp=2.0, color=PAPER, ruled=True,
                 shadow=(0, 5, 7, 0.28), pad=28, draw_fn=None, max_out=None):
    """Torn-edge paper card (w x h in 1x px) with faint ruled lines, soft
    shadow and a tilt. draw_fn(img, P) draws contents at SS px offset P.
    Anchor is the centre of the paper."""
    P = pad * SS
    W, H = int(w * SS + 2 * P), int(h * SS + 2 * P)
    pts = [(x + P, y + P) for x, y in torn_outline(w, h, seed, radius, amp, max_out=max_out)]
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).polygon(pts, fill=255)

    img = Image.new("RGBA", (W, H), color + (0,))
    if shadow:
        dx, dy, blur, a = shadow
        sh = Image.new("L", (W, H), 0)
        sh.paste(mask, (int(round(dx * SS)), int(round(dy * SS))))
        sh = sh.filter(ImageFilter.GaussianBlur(blur * SS)).point(lambda v: int(v * a))
        sh_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sh_img.putalpha(sh)
        img.alpha_composite(sh_img)

    paper = Image.new("RGBA", (W, H), color + (255,))
    if ruled:
        d = ImageDraw.Draw(paper)
        rule = mix(color, RULE, 0.32) + (255,)
        y = P + int(18 * SS)
        while y < P + h * SS:
            d.line([(0, y), (W, y)], fill=rule, width=SS)
            y += int(26 * SS)
    paper.putalpha(mask)
    img.alpha_composite(paper)

    if draw_fn:
        draw_fn(img, P)

    ax, ay = P + w * SS / 2, P + h * SS / 2
    img, ax, ay = rotate_spr(img, ax, ay, tilt)
    return Spr(img, ax, ay)


def text_sprite(text, fnt, color=INK):
    """Anti-aliased text as an RGBA sprite anchored at its visual centre."""
    l, t, r, b = fnt.getbbox(text)
    pad = 4 * SS
    w, h = r - l + 2 * pad, b - t + 2 * pad
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).text((pad - l, pad - t), text, font=fnt, fill=255)
    img = Image.new("RGBA", (w, h), color + (255,))
    img.putalpha(mask)
    return Spr(img, w / 2, h / 2)


def paste_clipped(canvas, im, x0, y0):
    W, H = canvas.size
    w, h = im.size
    sx0, sy0 = max(0, -x0), max(0, -y0)
    sx1, sy1 = min(w, W - x0), min(h, H - y0)
    if sx1 <= sx0 or sy1 <= sy0:
        return
    part = im if (sx0, sy0, sx1, sy1) == (0, 0, w, h) else im.crop((sx0, sy0, sx1, sy1))
    canvas.alpha_composite(part, dest=(x0 + sx0, y0 + sy0))


def blit(canvas, spr, x, y, scale=1.0, ss=1, alpha=1.0):
    """Draw sprite with its anchor at (x, y) in the canvas' own px (ss = canvas
    supersample: 1 for the output frame, SS for a sprite being drawn into
    another 2x sprite)."""
    if scale <= 0.002:
        return
    k = scale * ss / SS
    w = max(1, int(round(spr.img.width * k)))
    h = max(1, int(round(spr.img.height * k)))
    im = spr.img if (w, h) == spr.img.size else spr.scaled(w, h)
    if alpha < 1.0:
        im = im.copy()
        im.putalpha(im.getchannel("A").point(lambda v: int(v * alpha)))
    paste_clipped(canvas, im, int(round(x - spr.ax * k)), int(round(y - spr.ay * k)))


def stroke(d, pts, lw, color, closed=False):
    """Polyline with round joints and caps."""
    pts = list(pts)
    if closed:
        pts.append(pts[0])
    d.line(pts, fill=color, width=int(lw), joint="curve")
    r = lw / 2
    for (x, y) in pts:
        d.ellipse((x - r, y - r, x + r, y + r), fill=color)


def partial(pts, p):
    """Prefix of a polyline covering fraction p of its length."""
    if p <= 0:
        return []
    if p >= 1:
        return list(pts)
    segs = [math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
            for i in range(len(pts) - 1)]
    target = sum(segs) * p
    out = [pts[0]]
    run = 0.0
    for i, L in enumerate(segs):
        if run + L >= target:
            t = (target - run) / L if L else 0
            out.append((pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t,
                        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t))
            return out
        run += L
        out.append(pts[i + 1])
    return out


def tick_badge(r, tilt=-8, seed=99):
    """Accent circle with a paper tick, soft shadow, small tilt."""
    def contents(img, P):
        d = ImageDraw.Draw(img)
        u = r / 26.0
        pts = [(P + 0.62 * r * SS, P + 1.02 * r * SS),
               (P + 0.90 * r * SS, P + 1.34 * r * SS),
               (P + 1.44 * r * SS, P + 0.66 * r * SS)]
        stroke(d, pts, 5.5 * u * SS, PAPER + (255,))
    return paper_sprite(2 * r, 2 * r, seed, tilt=tilt, radius=r, amp=0.6, color=ACCENT,
                        ruled=False, shadow=(0, 3, 5, 0.3), pad=14, draw_fn=contents)


def new_canvas(W, H):
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def shift_canvas(canvas, dx, dy):
    out = new_canvas(*canvas.size)
    paste_clipped(out, canvas, dx, dy)
    return out


# ------------------------------------------------------------ 1 styles-pick

_photo_cache = {}


def style_card(idx, k=1.0, tilt=0.0):
    """180x322 (x k) torn white card, photo fit inside an 8k px border,
    numbered paper tag top-left."""
    w, h, b = 180 * k, 322 * k, 8 * k
    key = (idx, round(k, 4))
    if key not in _photo_cache:
        im = Image.open(os.path.join(STYLE_DIR, STYLE_IMGS[idx])).convert("RGBA")
        iw, ih = w - 2 * b, h - 2 * b
        s = min(iw / im.width, ih / im.height)
        pw, ph = int(round(im.width * s * SS)), int(round(im.height * s * SS))
        _photo_cache[key] = im.resize((pw, ph), Image.LANCZOS)
    photo = _photo_cache[key]
    f_tag = font(FONT_B, 15 * k)
    tag_txt = text_sprite(str(idx + 1), f_tag, INK)

    def contents(img, P):
        x = int(round(P + (w * SS - photo.width) / 2))
        y = int(round(P + (h * SS - photo.height) / 2))
        img.alpha_composite(photo, (x, y))
        tag = paper_sprite(28 * k, 24 * k, 300 + idx, tilt=-6, amp=1.0, ruled=False,
                           shadow=(0, 2, 3, 0.3), pad=8,
                           draw_fn=lambda im, Q: blit(im, tag_txt, Q + 14 * k * SS,
                                                      Q + 12 * k * SS, 1.0, ss=SS))
        blit(img, tag, P + 19 * k * SS, P + 18 * k * SS, 1.0, ss=SS)

    shadow = (0, 5, 6, 0.28) if k <= 1.0 else (0, 3, 5, 0.28)
    return paper_sprite(w, h, 100 + idx, tilt=tilt, amp=1.4, color=WHITE, ruled=False,
                        shadow=shadow, draw_fn=contents, max_out=2.4)


def render_styles_pick():
    W, H, N = 1000, 420, int(10.0 * FPS)
    tilts = [0.6, -2.4, 1.6, -1.8, 0.6]
    # Chosen card grows to 222x397 (9:16). 230x412 + tilt + torn edge + shadow
    # cannot fit inside the 420 px box, so it is trimmed to stay inside.
    K5 = 222 / 180
    FINAL_Y = 205
    cards = [style_card(i, 1.0, tilts[i]) for i in range(4)] + [style_card(4, K5, tilts[4])]
    badge = tick_badge(26, tilt=-8)
    ROW_Y = 190
    for f in range(N):
        c = new_canvas(W, H)
        for i in range(5):
            # peak 1.04: at 1.1 the outer cards would leave the 1000 px box
            s = pop(f - (6 + 6 * i), peak=1.04)
            x, y = 100 + 200 * i, ROW_Y
            if i < 4:
                d0 = 108 + 5 * i          # 3.6 s, 5 frames apart
                if f >= d0:
                    t = (f - d0) / 12
                    if t >= 1:
                        continue
                    e = ease_in_cubic(t)
                    s *= (1 - e)
                    y += 60 * e            # drops but stays inside the box
            else:
                g0 = 114                   # card 5 grows + slides
                base = 1 / K5
                if f >= g0:
                    t = ease_out_back((f - g0) / 20, s=0.5)
                    s *= base + (1 - base) * t
                    x = 900 + (500 - 900) * t
                    y = ROW_Y + (FINAL_Y - ROW_Y) * t
                else:
                    s *= base
            if s > 0:
                blit(c, cards[i], x, y, s)
        bs = pop(f - int(5.2 * FPS))
        if bs > 0:
            blit(c, badge, 598, 34, bs)
        yield c


# --------------------------------------------------------- 2 install-loader

def render_install_loader():
    W, H, N = 900, 330, int(4.0 * FPS)
    cw, ch, tilt = 780, 250, 1.4
    f_b = font(FONT_B, 34)
    f_xb = font(FONT_XB, 52)
    installed = text_sprite("installed", f_b, INK)
    badge = tick_badge(24, tilt=-6, seed=98)
    F0, F1 = int(0.3 * FPS), int(2.6 * FPS)
    BADGE_F = int(2.7 * FPS)
    BX0, BY0, BX1, BY1, R = 40, 140, 740, 174, 17

    for f in range(N):
        ft = ease_in_out_cubic((f - F0) / (F1 - F0))
        pct = int(round(100 * ft))

        def contents(img, P, ft=ft, pct=pct, f=f):
            d = ImageDraw.Draw(img)
            X = lambda v: P + v * SS
            # terminal line
            d.text((X(40), X(60) - P), "$", font=f_b, fill=ACCENT + (255,), anchor="ls")
            d.text((X(40) + f_b.getlength("$ "), X(60) - P), "make setup", font=f_b,
                   fill=INK + (255,), anchor="ls")
            # percent above the bar's right end
            d.text((X(BX1), X(126) - P), f"{pct}%", font=f_xb, fill=INK + (255,), anchor="rs")
            # progress bar
            d.rounded_rectangle((X(BX0), X(BY0) - P, X(BX1), X(BY1) - P), radius=R * SS,
                                outline=INK + (255,), width=3 * SS)
            if ft > 0:
                inset = 4
                x0, y0 = X(BX0 + inset), X(BY0 + inset) - P
                y1 = X(BY1 - inset) - P
                x1 = X(BX0 + inset + (BX1 - BX0 - 2 * inset) * ft)
                rr = min((R - inset) * SS, (x1 - x0) / 2)
                if x1 - x0 >= 2:
                    d.rounded_rectangle((x0, y0, x1, y1), radius=rr, fill=ACCENT + (255,))
            bs = pop(f - BADGE_F)
            if bs > 0:
                blit(img, badge, X(BX1), X((BY0 + BY1) / 2) - P, bs, ss=SS)
            ls = pop(f - BADGE_F)
            if ls > 0:
                blit(img, installed, X(40) + installed.ax, X(212) - P, ls, ss=SS)

        card = paper_sprite(cw, ch, 7, tilt=tilt, draw_fn=contents)
        c = new_canvas(W, H)
        blit(c, card, 450, 165, pop(f))
        yield c


# ----------------------------------------------------------- 3 my-way-hero

def render_my_way_hero():
    W, H, N = 1000, 400, int(14.0 * FPS)
    WORD = "CLAUDE + HIGGSFIELD"
    cw, ch, tilt = 924, 178, -1.5
    f_lab = font(FONT_B, 44)
    size = 140
    while True:
        f_w = font(FONT_XB, size)
        if f_w.getlength(WORD) <= 900 * SS or size <= 10:
            break
        size -= 1
    word_w = f_w.getlength(WORD) / SS
    ux0 = (cw - word_w) / 2 - 4
    ux1 = ux0 + word_w + 8
    upts = [(ux0 + (ux1 - ux0) * i / 40, 144 + 1.4 * math.sin(i * 0.8 + 0.4)) for i in range(41)]
    border_col = mix(PAPER, INK, 0.5) + (255,)

    SLAM0, SLAM_D = int(0.15 * FPS), 10
    LAND = SLAM0 + 6
    UL0, UL_D = SLAM0 + SLAM_D, 16
    CX, CY = 500, 200
    rays = []
    for k in range(8):
        a = math.radians(22.5 + 45 * k)
        L = min(478 / max(abs(math.cos(a)), 1e-6), 178 / max(abs(math.sin(a)), 1e-6)) * 0.95
        rays.append((a, L))
    R0 = 60

    settled = None
    for f in range(N):
        if settled is not None:
            yield settled
            continue
        c = new_canvas(W, H)
        # rays: burst out over 12 frames with a small settle, then hold at 0.35
        t = ease_out_back(f / 12, s=1.2)
        lay = Image.new("RGBA", (W * SS, H * SS), ACCENT + (0,))
        d = ImageDraw.Draw(lay)
        for a, L in rays:
            length = R0 + (L - R0) * t
            if length <= R0 + 1:
                continue
            ux, uy = math.cos(a), math.sin(a)
            nx, ny = -uy, ux
            p0 = (CX + R0 * ux, CY + R0 * uy)
            p1 = (CX + length * ux, CY + length * uy)
            hw0, hw1 = 5.0, 2.2
            poly = [(p0[0] + hw0 * nx, p0[1] + hw0 * ny), (p1[0] + hw1 * nx, p1[1] + hw1 * ny),
                    (p1[0] - hw1 * nx, p1[1] - hw1 * ny), (p0[0] - hw0 * nx, p0[1] - hw0 * ny)]
            d.polygon([(x * SS, y * SS) for x, y in poly], fill=ACCENT + (255,))
            d.ellipse(((p1[0] - hw1) * SS, (p1[1] - hw1) * SS, (p1[0] + hw1) * SS,
                       (p1[1] + hw1) * SS), fill=ACCENT + (255,))
        lay = lay.resize((W, H), Image.LANCZOS)
        lay.putalpha(lay.getchannel("A").point(lambda v: int(v * 0.35)))
        c.alpha_composite(lay)

        s = pop(f - SLAM0, dur=SLAM_D, peak=1.04, start=0.3)
        if s > 0:
            p_ul = ease_out_cubic((f - UL0) / UL_D)

            def contents(img, P, p_ul=p_ul):
                d = ImageDraw.Draw(img)
                X = lambda v: P + v * SS
                d.rounded_rectangle((X(10), X(10), X(cw - 10), X(ch - 10)), radius=3 * SS,
                                    outline=border_col, width=int(1.5 * SS))
                d.text((X(cw / 2), X(58)), "my way", font=f_lab, fill=INK + (255,), anchor="ms")
                d.text((X(cw / 2), X(128)), WORD, font=f_w, fill=INK + (255,), anchor="ms")
                seg = partial(upts, p_ul)
                if len(seg) >= 2:
                    stroke(d, [(X(x), X(y)) for x, y in seg], 8 * SS, ACCENT + (255,))

            card = paper_sprite(cw, ch, 11, tilt=tilt, draw_fn=contents)
            blit(c, card, CX, CY, s)
        if f == LAND:
            c = shift_canvas(c, 2, -2)  # 1-frame, 2 px camera shake on the slam
        if f >= max(12, UL0 + UL_D) and s >= 1.0 and f != LAND:
            settled = c  # everything has settled: hold this exact frame
        yield c


# ----------------------------------------------------------- 4 tips-icons

def _icon_mic(d, cx, cy):
    lw = 5 * SS
    ink = INK + (255,)
    Q = lambda x, y: (cx + x * SS, cy + y * SS)
    d.rounded_rectangle(Q(-13, -40) + Q(13, 4), radius=13 * SS, outline=ink, width=lw)
    d.arc(Q(-26, -22) + Q(26, 26), start=0, end=180, fill=ink, width=lw)
    for (x, y) in (Q(-26, 2), Q(26, 2)):
        d.ellipse((x - lw / 2, y - lw / 2, x + lw / 2, y + lw / 2), fill=ink)
    stroke(d, [Q(0, 26), Q(0, 40)], lw, ink)
    stroke(d, [Q(-16, 40), Q(16, 40)], lw, ink)


def _icon_photo(d, cx, cy):
    lw = 5 * SS
    ink = INK + (255,)
    Q = lambda x, y: (cx + x * SS, cy + y * SS)
    d.rounded_rectangle(Q(-40, -30) + Q(40, 30), radius=6 * SS, outline=ink, width=lw)
    d.ellipse(Q(12, -19) + Q(26, -5), outline=ink, width=lw)
    stroke(d, [Q(-30, 20), Q(-12, -2), Q(0, 12), Q(10, 2), Q(30, 20)], lw, ink)


def _icon_clapper(d, cx, cy):
    lw = 5 * SS
    ink = INK + (255,)
    Q = lambda x, y: (cx + x * SS, cy + y * SS)
    d.rounded_rectangle(Q(-40, -6) + Q(40, 34), radius=4 * SS, outline=ink, width=lw)
    ang = math.radians(20)
    ux, uy = math.cos(ang), -math.sin(ang)
    nx, ny = -math.sin(ang), -math.cos(ang)
    A = (-40, -6)
    B = (A[0] + 78 * ux, A[1] + 78 * uy)
    Cc = (B[0] + 17 * nx, B[1] + 17 * ny)
    D = (A[0] + 17 * nx, A[1] + 17 * ny)
    stroke(d, [Q(*A), Q(*B), Q(*Cc), Q(*D)], lw, ink, closed=True)
    for t in (0.28, 0.52, 0.76):
        p = (A[0] + 78 * ux * t, A[1] + 78 * uy * t)
        q = (p[0] + 17 * nx, p[1] + 17 * ny)
        stroke(d, [Q(*p), Q(*q)], lw * 0.8, ink)


def _icon_scissors(d, cx, cy):
    lw = 5 * SS
    ink = INK + (255,)
    Q = lambda x, y: (cx + x * SS, cy + y * SS)
    d.ellipse(Q(-27, 14) + Q(-5, 36), outline=ink, width=lw)
    d.ellipse(Q(5, 14) + Q(27, 36), outline=ink, width=lw)
    stroke(d, [Q(-9, 15), Q(22, -38)], lw, ink)
    stroke(d, [Q(9, 15), Q(-22, -38)], lw, ink)


def _icon_receipt(d, cx, cy):
    lw = 5 * SS
    ink = INK + (255,)
    Q = lambda x, y: (cx + x * SS, cy + y * SS)
    pts = [Q(-28, -40), Q(28, -40)]
    for i, x in enumerate(range(28, -29, -7)):
        pts.append(Q(x, 34 if i % 2 == 0 else 42))
    stroke(d, pts, lw, ink, closed=True)
    stroke(d, [Q(-15, -22), Q(15, -22)], lw, ink)
    stroke(d, [Q(-15, -8), Q(15, -8)], lw, ink)
    stroke(d, [Q(-15, 6), Q(3, 6)], lw, ink)


def render_tips_icons():
    W, H, N = 1000, 420, int(12.0 * FPS)
    f_lab = font(FONT_B, 30)
    f_ban = font(FONT_B, 36)
    names = ["VOICE", "STILLS", "ANIMATE", "CUT", "RECEIPT"]
    icons = [_icon_mic, _icon_photo, _icon_clapper, _icon_scissors, _icon_receipt]
    tilts = [1.5, -2.2, 1.0, -1.6, 2.4]
    chips = []
    for i in range(5):
        fn = icons[i]
        chips.append(paper_sprite(160, 160, 20 + i, tilt=tilts[i], radius=22, amp=1.6,
                                  draw_fn=lambda img, P, fn=fn: fn(ImageDraw.Draw(img),
                                                                   P + 80 * SS, P + 80 * SS)))
    labels = [text_sprite(n, f_lab, INK) for n in names]
    ban_txt = text_sprite("5 steps, one harness", f_ban, INK)
    bw = int(ban_txt.img.width / SS) + 48
    banner = paper_sprite(bw, 60, 40, tilt=-1.5, amp=1.8,
                          draw_fn=lambda img, P: blit(img, ban_txt, P + bw / 2 * SS,
                                                      P + 30 * SS, 1.0, ss=SS))
    starts = [int(0.3 * FPS) + int(round(0.55 * FPS * i)) for i in range(5)]
    UL0, UL_D = int(3.6 * FPS), 20
    BAN0 = int(4.4 * FPS)
    CHIP_Y, LAB_Y, UL_Y = 215, 318, 352
    upts = [(40 + 920 * i / 60, UL_Y + 1.8 * math.sin(i * 0.7 + 1.0)) for i in range(61)]
    ul_cache = {}

    def underline_layer(p):
        key = round(p, 4)
        if key not in ul_cache:
            y0 = UL_Y - 14
            lay = Image.new("RGBA", (W * SS, 28 * SS), ACCENT + (0,))
            seg = partial(upts, p)
            if len(seg) >= 2:
                stroke(ImageDraw.Draw(lay), [(x * SS, (y - y0) * SS) for x, y in seg],
                       8 * SS, ACCENT + (255,))
            if len(ul_cache) > 4:
                ul_cache.clear()
            ul_cache[key] = (lay.resize((W, 28), Image.LANCZOS), y0)
        return ul_cache[key]

    for f in range(N):
        c = new_canvas(W, H)
        for i in range(5):
            s = pop(f - starts[i])
            if s > 0:
                blit(c, chips[i], 100 + 200 * i, CHIP_Y, s)
                blit(c, labels[i], 100 + 200 * i, LAB_Y, s)
        p = ease_in_out_cubic((f - UL0) / UL_D)
        if p > 0:
            lay, y0 = underline_layer(p)
            c.alpha_composite(lay, (0, y0))
        bs = pop(f - BAN0)
        if bs > 0:
            blit(c, banner, 500, 62, bs)
        yield c


# ------------------------------------------------------------- encode/verify

OVERLAYS = {
    "styles-pick": (render_styles_pick, 1000, 420, 10.0),
    "install-loader": (render_install_loader, 900, 330, 4.0),
    "my-way-hero": (render_my_way_hero, 1000, 400, 14.0),
    "tips-icons": (render_tips_icons, 1000, 420, 12.0),
}


def encode(name, gen, W, H, dur):
    out = os.path.join(HERE, name + ".mov")
    cmd = ["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgba",
           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le",
           "-vendor", "apl0", out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = 0
    for frame in gen():
        assert frame.size == (W, H), frame.size
        p.stdin.write(frame.tobytes())
        n += 1
    p.stdin.close()
    p.wait()
    assert p.returncode == 0, f"ffmpeg failed for {name}"
    assert n == int(dur * FPS), (n, dur)
    return out


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,"
                        "nb_frames,duration", "-of", "default=nw=1", path],
                       capture_output=True, text=True)
    return r.stdout.strip()


def make_strip(name, W, H, dur, per_row=4):
    """Decode the real .mov back and tile 1 fps frames (plus the last frame)
    over mid-grey."""
    mov = os.path.join(HERE, name + ".mov")
    png = os.path.join(HERE, name + "_strip.png")
    N = int(dur * FPS)
    want = sorted(set(list(range(0, N, FPS)) + [N - 1]))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", mov, "-f", "rawvideo",
                          "-pix_fmt", "rgba", "-"], stdout=subprocess.PIPE)
    frames, fsz, i = [], W * H * 4, 0
    while True:
        buf = p.stdout.read(fsz)
        if len(buf) < fsz:
            break
        if i in want:
            frames.append((i, Image.frombytes("RGBA", (W, H), buf)))
        i += 1
    p.wait()
    assert i == N, f"decoded {i} frames, expected {N}"
    lab = ImageFont.truetype(FONT_B, 18)
    pad, lh = 8, 26
    cols = min(per_row, len(frames))
    rows = math.ceil(len(frames) / cols)
    strip = Image.new("RGB", (cols * (W + pad) + pad, rows * (H + lh + pad) + pad), GREY)
    d = ImageDraw.Draw(strip)
    for j, (fi, fr) in enumerate(frames):
        bg = Image.new("RGBA", (W, H), GREY + (255,))
        bg.alpha_composite(fr)
        x = pad + (j % cols) * (W + pad)
        y = pad + (j // cols) * (H + lh + pad)
        strip.paste(bg.convert("RGB"), (x, y))
        d.rectangle((x, y, x + W - 1, y + H - 1), outline=(96, 96, 96))
        d.text((x + 4, y + H + 4), f"t={fi / FPS:.2f}s  frame {fi}", font=lab, fill=(20, 20, 20))
    strip.save(png)
    return png, len(frames)


def main(argv):
    strips_only = "--strips-only" in argv
    names = [a for a in argv if not a.startswith("--")] or list(OVERLAYS)
    for name in names:
        gen, W, H, dur = OVERLAYS[name]
        if not strips_only:
            out = encode(name, gen, W, H, dur)
            print(f"[{name}] wrote {out}")
        print(probe(os.path.join(HERE, name + ".mov")))
        png, n = make_strip(name, W, H, dur)
        print(f"[{name}] strip {png} ({n} frames)\n")


if __name__ == "__main__":
    main(sys.argv[1:])
