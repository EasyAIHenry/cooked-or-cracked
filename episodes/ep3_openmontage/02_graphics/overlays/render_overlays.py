#!/usr/bin/env python
"""Render the transparent overlay animations for the Ep3 reel.

Each overlay is rendered as Pillow RGBA frames (drawn at 2x and downsampled)
and piped into ffmpeg as ProRes 4444 with alpha (yuva444p10le), 30 fps.
After rendering, each .mov is decoded back with ffmpeg and a 1 fps strip on
mid-grey is written next to it so the real output can be eyeballed.

Overlays: the original four (styles-pick, install-loader, my-way-hero,
tips-icons) and the seven v2 pieces (install-loader-v2, my-way-hero-v2,
simplify-body, styles-strip, styles-selected, tips-icons-v2, comment-bubble).

Usage:
    render_overlays.py                 # render everything + strips
    render_overlays.py --v2            # render only the seven v2 overlays
    render_overlays.py styles-pick     # render one (names in OVERLAYS)
    render_overlays.py --strips-only   # only rebuild the strips from the .movs
"""
import math
import os
import random
import subprocess
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

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

    return _tear(pts, rng, amp, max_out)


def _tear(pts, rng, amp, max_out=None):
    """Displace a clockwise (y down) sampled polygon along its outward normal."""
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


def torn_path(path, seed, amp=2.0, step=10, max_out=None):
    """Torn version of an arbitrary closed polygon given in 1x px (clockwise,
    y down). Resampled every `step` px, returned in SS px."""
    rng = random.Random(seed)
    st = step * SS
    pts = []
    for i in range(len(path)):
        x0, y0 = path[i][0] * SS, path[i][1] * SS
        x1, y1 = path[(i + 1) % len(path)][0] * SS, path[(i + 1) % len(path)][1] * SS
        L = math.hypot(x1 - x0, y1 - y0)
        n = max(1, int(L / st))
        for k in range(n):
            t = k / n
            pts.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t))
    return _tear(pts, rng, amp, max_out)


def arc_pts(cx, cy, r, a0, a1, n=8):
    """Points along a circular arc (degrees, clockwise on screen)."""
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


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


_paper_base_cache = {}


def paper_sprite(w, h, seed, tilt=0.0, radius=0, amp=2.0, color=PAPER, ruled=True,
                 shadow=(0, 5, 7, 0.28), pad=28, draw_fn=None, max_out=None,
                 outline=None, anchor=None):
    """Torn-edge paper card (w x h in 1x px) with faint ruled lines, soft
    shadow and a tilt. draw_fn(img, P) draws contents at SS px offset P.
    Anchor is the centre of the paper unless `anchor` (1x px inside the w x h
    box) is given. `outline` (closed polygon, 1x px, clockwise) replaces the
    rectangle. The empty paper (shadow + sheet) is cached per geometry so
    per-frame contents only cost the drawing and the rotation."""
    P = pad * SS
    W, H = int(w * SS + 2 * P), int(h * SS + 2 * P)
    key = (w, h, seed, radius, amp, color, ruled, shadow, pad, max_out,
           None if outline is None else tuple(outline))
    base = _paper_base_cache.get(key)
    if base is None:
        if outline is None:
            raw = torn_outline(w, h, seed, radius, amp, max_out=max_out)
        else:
            raw = torn_path(outline, seed, amp, max_out=max_out)
        pts = [(x + P, y + P) for x, y in raw]
        mask = Image.new("L", (W, H), 0)
        ImageDraw.Draw(mask).polygon(pts, fill=255)

        base = Image.new("RGBA", (W, H), color + (0,))
        if shadow:
            dx, dy, blur, a = shadow
            sh = Image.new("L", (W, H), 0)
            sh.paste(mask, (int(round(dx * SS)), int(round(dy * SS))))
            sh = sh.filter(ImageFilter.GaussianBlur(blur * SS)).point(lambda v: int(v * a))
            sh_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            sh_img.putalpha(sh)
            base.alpha_composite(sh_img)

        paper = Image.new("RGBA", (W, H), color + (255,))
        if ruled:
            d = ImageDraw.Draw(paper)
            rule = mix(color, RULE, 0.32) + (255,)
            y = P + int(18 * SS)
            while y < P + h * SS:
                d.line([(0, y), (W, y)], fill=rule, width=SS)
                y += int(26 * SS)
        paper.putalpha(mask)
        base.alpha_composite(paper)
        if len(_paper_base_cache) > 96:
            _paper_base_cache.clear()
        _paper_base_cache[key] = base

    img = base.copy()
    if draw_fn:
        draw_fn(img, P)

    if anchor is None:
        ax, ay = P + w * SS / 2, P + h * SS / 2
    else:
        ax, ay = P + anchor[0] * SS, P + anchor[1] * SS
    img, ax, ay = rotate_spr(img, ax, ay, tilt)
    return Spr(img, ax, ay)


def image_sprite(path, size, radius=0, shadow=(0, 5, 7, 0.28), pad=24):
    """A logo/image as a size x size sprite (LANCZOS at SS), optional rounded
    corners and the same soft paper shadow as the cards. Centre anchor."""
    im = Image.open(path).convert("RGBA")
    S = int(size * SS)
    im = im.resize((S, S), Image.LANCZOS)
    if radius:
        m = Image.new("L", (S, S), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, S - 1, S - 1), radius=int(radius * SS), fill=255)
        im.putalpha(ImageChops.multiply(im.getchannel("A"), m))
    P = pad * SS
    W = S + 2 * P
    out = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    if shadow:
        dx, dy, blur, a = shadow
        sh = Image.new("L", (W, W), 0)
        sh.paste(im.getchannel("A"), (P + int(round(dx * SS)), P + int(round(dy * SS))))
        sh = sh.filter(ImageFilter.GaussianBlur(blur * SS)).point(lambda v: int(v * a))
        sh_img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
        sh_img.putalpha(sh)
        out.alpha_composite(sh_img)
    out.alpha_composite(im, (P, P))
    return Spr(out, W / 2, W / 2)


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


def _icon_magnifier(d, cx, cy):
    lw = 5 * SS
    ink = INK + (255,)
    Q = lambda x, y: (cx + x * SS, cy + y * SS)
    d.ellipse(Q(-38, -38) + Q(16, 16), outline=ink, width=lw)
    stroke(d, [Q(8, 8), Q(38, 38)], lw * 1.5, ink)
    d.arc(Q(-28, -28) + Q(6, 6), start=200, end=250, fill=ink, width=int(lw * 0.6))


def _icon_script(d, cx, cy):
    lw = 5 * SS
    ink = INK + (255,)
    Q = lambda x, y: (cx + x * SS, cy + y * SS)
    # document with a folded corner
    stroke(d, [Q(-36, -40), Q(8, -40), Q(22, -26), Q(22, 40), Q(-36, 40)], lw, ink, closed=True)
    stroke(d, [Q(8, -40), Q(8, -26), Q(22, -26)], lw * 0.8, ink)
    stroke(d, [Q(-22, -12), Q(8, -12)], lw, ink)
    stroke(d, [Q(-22, 2), Q(8, 2)], lw, ink)
    stroke(d, [Q(-22, 16), Q(-6, 16)], lw, ink)
    # pen lying across the lower-right corner
    stroke(d, [Q(12, 6), Q(40, 34)], lw * 2.2, ink)
    stroke(d, [Q(40, 34), Q(46, 46)], lw * 0.9, ink)
    stroke(d, [Q(12, 6), Q(8, 2)], lw * 0.9, ink)


def render_tips_icons():
    names = ["VOICE", "STILLS", "ANIMATE", "CUT", "RECEIPT"]
    icons = [_icon_mic, _icon_photo, _icon_clapper, _icon_scissors, _icon_receipt]
    return _render_tips(names, icons)


def render_tips_icons_v2():
    names = ["RESEARCH", "SCRIPT", "CUT", "ANIMATE", "VOICE"]
    icons = [_icon_magnifier, _icon_script, _icon_scissors, _icon_clapper, _icon_mic]
    return _render_tips(names, icons)


def _render_tips(names, icons):
    W, H, N = 1000, 420, int(12.0 * FPS)
    f_lab = font(FONT_B, 30)
    f_ban = font(FONT_B, 36)
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


# ------------------------------------------------------ 5 install-loader-v2

def render_install_loader_v2():
    W, H, N = 900, 440, int(9.0 * FPS)
    cw, ch, tilt = 780, 340, 1.4
    f_b = font(FONT_B, 34)
    f_xb = font(FONT_XB, 52)
    f_cmd = font(FONT_B, 30)
    f_chip = font(FONT_B, 24)
    installed = text_sprite("installed", f_b, INK)
    ready = text_sprite("12 agents ready", f_cmd, ACCENT)
    badge = tick_badge(24, tilt=-6, seed=98)
    F0, F1 = int(0.3 * FPS), int(2.6 * FPS)
    BADGE_F = int(2.7 * FPS)
    BX0, BY0, BX1, BY1, R = 40, 132, 740, 166, 17
    CMD = "$ openmontage run"
    T0, T1 = int(4.4 * FPS), int(5.4 * FPS)
    CHIP0 = int(5.6 * FPS)
    chip_starts = [CHIP0 + int(round(0.35 * FPS * i)) for i in range(4)]
    READY_F = int(7.2 * FPS)
    CMD_Y, CHIP_Y = 258, 308
    asc, _ = f_cmd.getmetrics()
    cur_h = asc / SS  # block cursor height (1x)
    cur_w = f_cmd.getlength("M") / SS * 0.9

    names = ["RESEARCH", "SCRIPT", "ASSETS", "RENDER"]
    chip_tilts = [1.2, -1.5, 1.0, -1.2]
    chips, cxs, cws = [], [], []
    x = 40
    for i, n in enumerate(names):
        t = text_sprite(n, f_chip, INK)
        w = int(t.img.width / SS + 26)
        chips.append(paper_sprite(w, 42, 60 + i, tilt=chip_tilts[i], amp=1.2, ruled=False,
                                  shadow=(0, 2, 3, 0.28), pad=10,
                                  draw_fn=lambda img, P, t=t, w=w: blit(img, t, P + w / 2 * SS,
                                                                        P + 21 * SS, 1.0, ss=SS)))
        cxs.append(x + w / 2)
        cws.append(w)
        x += w + 34

    def arrow(d, X, x0, y, s):
        """Small accent arrow -> centred at (x0, y), length 18 * s."""
        if s <= 0:
            return
        L = 9 * s
        col = ACCENT + (255,)
        stroke(d, [(X(x0 - L), X(y)), (X(x0 + L), X(y))], 3 * SS, col)
        stroke(d, [(X(x0 + L - 6 * s), X(y - 5 * s)), (X(x0 + L), X(y)),
                   (X(x0 + L - 6 * s), X(y + 5 * s))], 3 * SS, col)

    for f in range(N):
        ft = ease_in_out_cubic((f - F0) / (F1 - F0))
        pct = int(round(100 * ft))
        nch = 0 if f < T0 else min(len(CMD), int(len(CMD) * (f - T0 + 1) / (T1 - T0)))
        typing = T0 <= f < T1
        blink_on = typing or ((f - T1) // 8) % 2 == 0
        rs = pop(f - READY_F, dur=10)

        def contents(img, P, ft=ft, pct=pct, f=f, nch=nch, blink_on=blink_on, rs=rs):
            d = ImageDraw.Draw(img)
            X = lambda v: P + v * SS
            # stage 1: terminal line, percent, bar, tick, "installed"
            d.text((X(40), X(52)), "$", font=f_b, fill=ACCENT + (255,), anchor="ls")
            d.text((X(40) + f_b.getlength("$ "), X(52)), "make setup", font=f_b,
                   fill=INK + (255,), anchor="ls")
            d.text((X(BX1), X(118)), f"{pct}%", font=f_xb, fill=INK + (255,), anchor="rs")
            d.rounded_rectangle((X(BX0), X(BY0), X(BX1), X(BY1)), radius=R * SS,
                                outline=INK + (255,), width=3 * SS)
            if ft > 0:
                inset = 4
                x0, y0 = X(BX0 + inset), X(BY0 + inset)
                y1 = X(BY1 - inset)
                x1 = X(BX0 + inset + (BX1 - BX0 - 2 * inset) * ft)
                rr = min((R - inset) * SS, (x1 - x0) / 2)
                if x1 - x0 >= 2:
                    d.rounded_rectangle((x0, y0, x1, y1), radius=rr, fill=ACCENT + (255,))
            bs = pop(f - BADGE_F)
            if bs > 0:
                blit(img, badge, X(BX1), X((BY0 + BY1) / 2), bs, ss=SS)
                blit(img, installed, X(40) + installed.ax, X(200), bs, ss=SS)
            # stage 2: typed command line with block cursor
            if f >= T0:
                shown = CMD[:nch]
                cx = X(40)
                if shown:
                    d.text((cx, X(CMD_Y)), "$", font=f_cmd, fill=ACCENT + (255,), anchor="ls")
                    d.text((cx + f_cmd.getlength("$"), X(CMD_Y)), shown[1:], font=f_cmd,
                           fill=INK + (255,), anchor="ls")
                    cx += f_cmd.getlength(shown)
                if rs > 0:
                    gap = f_cmd.getlength("  ")
                    blit(img, ready, cx + gap + ready.ax, X(CMD_Y) - asc / 2, rs, ss=SS)
                    cx += gap + ready.img.width
                if blink_on:
                    d.rectangle((cx + 3 * SS, X(CMD_Y - cur_h), cx + (3 + cur_w) * SS, X(CMD_Y)),
                                fill=INK + (255,))
            # stage 3: pipeline chips with arrows
            for i in range(4):
                s = pop(f - chip_starts[i])
                if s > 0:
                    blit(img, chips[i], X(cxs[i]), X(CHIP_Y), s, ss=SS)
                    if i > 0:
                        arrow(d, X, (cxs[i - 1] + cws[i - 1] / 2 + cxs[i] - cws[i] / 2) / 2,
                              CHIP_Y, min(1.0, s))

        card = paper_sprite(cw, ch, 7, tilt=tilt, draw_fn=contents)
        c = new_canvas(W, H)
        blit(c, card, 450, 220, pop(f))
        yield c


# --------------------------------------------------------- 6 my-way-hero-v2

LOGO_DIR = ("/Users/henrychua/Content Creation/DRIVE_Cooked-or-Cracked_Ep3_OpenMontage"
            "/02_graphics/logos")


def plus_badge(r=32, seed=97):
    def contents(img, P):
        d = ImageDraw.Draw(img)
        col = PAPER + (255,)
        a = 0.46 * r
        stroke(d, [(P + (r - a) * SS, P + r * SS), (P + (r + a) * SS, P + r * SS)], 0.2 * r * SS, col)
        stroke(d, [(P + r * SS, P + (r - a) * SS), (P + r * SS, P + (r + a) * SS)], 0.2 * r * SS, col)
    return paper_sprite(2 * r, 2 * r, seed, tilt=-6, radius=r, amp=0.6, color=ACCENT,
                        ruled=False, shadow=(0, 3, 5, 0.3), pad=14, draw_fn=contents)


def render_my_way_hero_v2():
    W, H, N = 1000, 460, int(14.0 * FPS)
    WORD = "CLAUDE + HIGGSFIELD"
    LOGO = 140
    LY = 90
    CX_CL, CX_HG, CX = 385, 615, 500
    claude = image_sprite(os.path.join(LOGO_DIR, "claude-color.png"), LOGO, radius=0)
    higgs = image_sprite(os.path.join(LOGO_DIR, "higgsfield-icon.png"), LOGO, radius=31)
    badge = plus_badge(32)

    cw, ch, tilt = 924, 216, -1.2
    CARD_X, CARD_Y = 500, 316
    f_lab = font(FONT_B, 40)
    size = 140
    while True:
        f_w = font(FONT_XB, size)
        if f_w.getlength(WORD) <= 880 * SS or size <= 10:
            break
        size -= 1
    asc_w, _ = f_w.getmetrics()
    WORD_BASE, LAB_BASE, UL_Y = 170, 46, 190
    word_w = f_w.getlength(WORD) / SS
    wx0 = (cw - word_w) / 2
    letters = []  # (sprite, cx, cy) in 1x card coords
    k = 0
    for i, chr_ in enumerate(WORD):
        if chr_ == " ":
            continue
        l, t, r, b = f_w.getbbox(chr_)
        lx = wx0 + f_w.getlength(WORD[:i]) / SS
        cx = lx + (l + r) / 2 / SS
        cy = WORD_BASE - asc_w / SS + (t + b) / 2 / SS
        letters.append((text_sprite(chr_, f_w, INK), cx, cy, k))
        k += 1
    ux0, ux1 = wx0 - 4, wx0 + word_w + 4
    upts = [(ux0 + (ux1 - ux0) * i / 40, UL_Y + 1.4 * math.sin(i * 0.8 + 0.4)) for i in range(41)]

    SLIDE_D = 18
    BADGE0 = int(0.5 * FPS)
    CARD0 = int(0.8 * FPS)
    LET0, LET_D = CARD0 + 2, 10
    UL0, UL_D = int(1.6 * FPS), 16
    BNC0, BNC_D = int(2.0 * FPS), 10
    STATIC_F = max(UL0 + UL_D, LET0 + len(letters) + LET_D) + 1
    rays = [math.radians(22.5 + 45 * i) for i in range(8)]
    R0, R1 = 38, 54

    static_card = None
    settled = None
    for f in range(N):
        if settled is not None:
            yield settled
            continue
        c = new_canvas(W, H)

        # rays behind everything: burst out, then settle to 0.35 opacity
        if f >= BADGE0:
            t = ease_out_back((f - BADGE0) / 10, s=1.2)
            op = 1.0 if f < BADGE0 + 8 else 1.0 - 0.65 * smooth((f - BADGE0 - 8) / 6)
            box = 2 * (R1 + 6)
            lay = Image.new("RGBA", (box * SS, box * SS), ACCENT + (0,))
            d = ImageDraw.Draw(lay)
            for a in rays:
                length = R0 + (R1 - R0) * t
                if length <= R0 + 0.5:
                    continue
                ux, uy = math.cos(a), math.sin(a)
                p0 = (box / 2 + R0 * ux, box / 2 + R0 * uy)
                p1 = (box / 2 + length * ux, box / 2 + length * uy)
                stroke(d, [(p0[0] * SS, p0[1] * SS), (p1[0] * SS, p1[1] * SS)], 3.5 * SS,
                       ACCENT + (255,))
            lay = lay.resize((box, box), Image.LANCZOS)
            lay.putalpha(lay.getchannel("A").point(lambda v: int(v * op)))
            c.alpha_composite(lay, (CX - box // 2, LY - box // 2))

        # logos slide in from the edges, later a single settle-bounce
        st = ease_out_back(f / SLIDE_D, s=1.0)
        bs = 1.0 if f < BNC0 else pop(f - BNC0, dur=BNC_D, peak=1.08, start=1.0)
        xl = -90 + (CX_CL + 90) * st
        xr = 1090 + (CX_HG - 1090) * st
        blit(c, claude, xl, LY, bs)
        blit(c, higgs, xr, LY, bs)

        pb = pop(f - BADGE0)
        if pb > 0:
            blit(c, badge, CX, LY, pb)

        cs = pop(f - CARD0, dur=8, peak=1.03)
        if cs > 0:
            if f >= STATIC_F and static_card is not None:
                card = static_card
            else:
                p_ul = ease_out_cubic((f - UL0) / UL_D)

                def contents(img, P, f=f, p_ul=p_ul):
                    d = ImageDraw.Draw(img)
                    X = lambda v: P + v * SS
                    d.text((X(cw / 2), X(LAB_BASE)), "my way", font=f_lab, fill=INK + (255,),
                           anchor="ms")
                    for spr, cx, cy, k in letters:
                        ls = pop(f - (LET0 + k), dur=LET_D, peak=1.15)
                        if ls > 0:
                            blit(img, spr, X(cx), X(cy), ls, ss=SS)
                    seg = partial(upts, p_ul)
                    if len(seg) >= 2:
                        stroke(d, [(X(x), X(y)) for x, y in seg], 8 * SS, ACCENT + (255,))

                card = paper_sprite(cw, ch, 11, tilt=tilt, draw_fn=contents)
                if f >= STATIC_F:
                    static_card = card
            blit(c, card, CARD_X, CARD_Y, cs)

        if f >= max(STATIC_F, BNC0 + BNC_D, BADGE0 + 16, SLIDE_D) + 1:
            settled = c
        yield c


# ---------------------------------------------------------- 7 simplify-body

def render_simplify_body():
    W, H, N = 900, 420, int(6.0 * FPS)
    XS = [170, 450, 730]
    CY, LAB_Y = 172, 322
    CARD = 220
    f_lab = font(FONT_B, 26)
    names = ["simplify", "no download", "no steps"]
    labels = [text_sprite(n, f_lab, INK) for n in names]
    starts = [int(0.3 * FPS), int(round(1.83 * FPS)), int(5.2 * FPS)]
    tilts = [-1.6, 1.4, -1.2]
    POP_D, UNT_D, CROSS_D = 13, 12, 8
    cx0 = cy0 = CARD / 2

    # scribble: tangled loops -> straight line, same point count
    n_pts = 140
    tangled, straight = [], []
    for i in range(n_pts):
        t = i / (n_pts - 1)
        tangled.append((cx0 - 72 + 144 * t + 20 * math.cos(2 * math.pi * 3.5 * t + 0.3),
                        cy0 + 30 * math.sin(2 * math.pi * 3.5 * t) + 10 * math.sin(2 * math.pi * 1.3 * t + 1)))
        straight.append((cx0 - 72 + 144 * t, cy0))

    def scribble(d, P, u):
        e = smooth(u)
        col = mix(INK, ACCENT, e) + (255,)
        pts = [(P + (a[0] + (b[0] - a[0]) * e) * SS, P + (a[1] + (b[1] - a[1]) * e) * SS)
               for a, b in zip(tangled, straight)]
        stroke(d, pts, 6 * SS, col)

    def download(d, P):
        Q = lambda x, y: (P + (cx0 + x) * SS, P + (cy0 + y) * SS)
        lw, ink = 6 * SS, INK + (255,)
        stroke(d, [Q(0, -62), Q(0, 8)], lw, ink)
        stroke(d, [Q(-26, -18), Q(0, 8), Q(26, -18)], lw, ink)
        stroke(d, [Q(-52, 18), Q(-52, 50), Q(52, 50), Q(52, 18)], lw, ink)

    def stairs(d, P):
        Q = lambda x, y: (P + (cx0 + x) * SS, P + (cy0 + y) * SS)
        lw, ink = 6 * SS, INK + (255,)
        x0, y0, sw, sh = -64, 54, 25.6, 21.6
        pts = [Q(x0, y0)]
        for k in range(5):
            pts.append(Q(x0 + (k + 1) * sw, y0 - k * sh))
            pts.append(Q(x0 + (k + 1) * sw, y0 - (k + 1) * sh))
        stroke(d, pts, lw, ink)

    def cross(d, P, p):
        Q = lambda x, y: (P + (cx0 + x) * SS, P + (cy0 + y) * SS)
        col = ACCENT + (255,)
        a = partial([Q(-64, -64), Q(64, 64)], clamp01(p * 2))
        b = partial([Q(64, -64), Q(-64, 64)], clamp01(p * 2 - 1))
        for seg in (a, b):
            if len(seg) >= 2:
                stroke(d, seg, 9 * SS, col)

    cache = {}

    def card(i, q):
        key = (i, q)
        if key not in cache:
            def contents(img, P):
                d = ImageDraw.Draw(img)
                if i == 0:
                    scribble(d, P, q)
                elif i == 1:
                    download(d, P)
                    cross(d, P, q)
                else:
                    stairs(d, P)
                    cross(d, P, q)
            cache[key] = paper_sprite(CARD, CARD, 70 + i, tilt=tilts[i], radius=20, amp=1.6,
                                      draw_fn=contents)
        return cache[key]

    for f in range(N):
        c = new_canvas(W, H)
        for i in range(3):
            s = pop(f - starts[i], dur=POP_D)
            if s <= 0:
                continue
            a0 = starts[i] + POP_D
            D = UNT_D if i == 0 else CROSS_D
            q = clamp01((f - a0) / D)
            q = round(q * D) / D
            blit(c, card(i, q), XS[i], CY, s)
            blit(c, labels[i], XS[i], LAB_Y, s)
        yield c


# ----------------------------------------------------------- 8 styles-strip

def pointer_sprite(height=46):
    """Classic arrow cursor, ink with a white outline and a slight shadow.
    Anchor at the tip."""
    base = [(0, 0), (0, 16.5), (4, 12.5), (6.5, 18.5), (9, 17.5), (6.5, 11.5), (11.5, 11.5)]
    k = height / 18.5
    P = 12 * SS
    pts = [(P + x * k * SS, P + y * k * SS) for x, y in base]
    W = int(P * 2 + 12 * k * SS)
    Hh = int(P * 2 + 19 * k * SS)
    body = Image.new("RGBA", (W, Hh), (0, 0, 0, 0))
    d = ImageDraw.Draw(body)
    d.polygon(pts, fill=INK + (255,), outline=WHITE + (255,), width=int(2.4 * SS))
    out = Image.new("RGBA", (W, Hh), (0, 0, 0, 0))
    sh = Image.new("L", (W, Hh), 0)
    sh.paste(body.getchannel("A"), (int(2 * SS), int(3 * SS)))
    sh = sh.filter(ImageFilter.GaussianBlur(3 * SS)).point(lambda v: int(v * 0.3))
    sh_img = Image.new("RGBA", (W, Hh), (0, 0, 0, 0))
    sh_img.putalpha(sh)
    out.alpha_composite(sh_img)
    out.alpha_composite(body)
    return Spr(out, P, P)


_photo_cache2 = {}


def style_card2(idx, tilt=0.0, border=WHITE, tag_size=30):
    """180x322 torn card with the photo inset 8 px (border colour = card
    colour) and a numbered paper tag top-left with a legible number."""
    w, h, b = 180, 322, 8
    if idx not in _photo_cache2:
        im = Image.open(os.path.join(STYLE_DIR, STYLE_IMGS[idx])).convert("RGBA")
        iw, ih = w - 2 * b, h - 2 * b
        s = min(iw / im.width, ih / im.height)
        pw, ph = int(round(im.width * s * SS)), int(round(im.height * s * SS))
        _photo_cache2[idx] = im.resize((pw, ph), Image.LANCZOS)
    photo = _photo_cache2[idx]
    tag_txt = text_sprite(str(idx + 1), font(FONT_B, tag_size), INK)
    tw, th = 46, 42

    def contents(img, P):
        x = int(round(P + (w * SS - photo.width) / 2))
        y = int(round(P + (h * SS - photo.height) / 2))
        img.alpha_composite(photo, (x, y))
        tag = paper_sprite(tw, th, 300 + idx, tilt=-6, amp=1.0, ruled=False,
                           shadow=(0, 2, 3, 0.3), pad=8,
                           draw_fn=lambda im, Q: blit(im, tag_txt, Q + tw / 2 * SS,
                                                      Q + th / 2 * SS, 1.0, ss=SS))
        blit(img, tag, P + 28 * SS, P + 27 * SS, 1.0, ss=SS)

    # shadow kept tight: the outer cards sit 10 px from the box edge
    return paper_sprite(w, h, 100 + idx, tilt=tilt, amp=1.4, color=border, ruled=False,
                        shadow=(0, 3, 3, 0.26), draw_fn=contents, max_out=2.4)


def glow_sprite(w, h, blur=4, alpha=0.5, grow=2):
    P = 40 * SS
    W, H = int(w * SS + 2 * P), int(h * SS + 2 * P)
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).rounded_rectangle((P - grow * SS, P - grow * SS, W - P + grow * SS,
                                         H - P + grow * SS), radius=12 * SS, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(blur * SS)).point(lambda v: int(v * alpha))
    img = Image.new("RGBA", (W, H), ACCENT + (0,))
    img.putalpha(m)
    return Spr(img, W / 2, H / 2)


def render_styles_strip():
    W, H, N = 1000, 420, int(10.0 * FPS)
    XS = [100, 300, 500, 700, 900]
    ROW_Y = 201
    tilts = [0.6, -2.4, 1.6, -1.8, 0.6]
    pointer = pointer_sprite(46)
    glow = glow_sprite(180, 322)
    badge = tick_badge(22, tilt=-8)
    HQ = 5  # hover quantisation steps (5-frame ramp)
    variants = {}

    def card(i, hq, gq):
        key = (i, hq, gq)
        if key not in variants:
            border = mix(WHITE, ACCENT, hq / HQ)
            col = style_card2(i, tilts[i], border)
            if gq > 0:
                grey = ImageOps.grayscale(col.img.convert("RGB")).convert("RGBA")
                grey.putalpha(col.img.getchannel("A"))
                im = Image.blend(col.img, grey, gq / 15)
                col = Spr(im, col.ax, col.ay)
            variants[key] = col
        return variants[key]

    # pointer timeline (tip position)
    ENTER = int(1.8 * FPS)
    arrivals = [68, 92, 115, 139, 162]  # card 5 reached at 5.4 s
    PAUSE = int(round(0.45 * FPS))
    CLICK = int(5.9 * FPS)
    LEAVE = CLICK + int(0.5 * FPS)
    LEAVE_D = 14
    P_START = (-24, 444)
    P_END = (960, 480)

    def pointer_pos(f):
        if f < ENTER or f >= LEAVE + LEAVE_D:
            return None
        if f < arrivals[0]:
            t = ease_out_cubic((f - ENTER) / (arrivals[0] - ENTER))
            return (P_START[0] + (XS[0] - P_START[0]) * t, P_START[1] + (ROW_Y - P_START[1]) * t)
        if f >= LEAVE:
            t = ease_in_cubic((f - LEAVE) / LEAVE_D)
            return (XS[4] + (P_END[0] - XS[4]) * t, ROW_Y + (P_END[1] - ROW_Y) * t)
        for i in range(4):
            a, nxt = arrivals[i], arrivals[i + 1]
            if f < a + PAUSE:
                return (XS[i], ROW_Y)
            if f < nxt:
                t = ease_in_out_cubic((f - a - PAUSE) / (nxt - a - PAUSE))
                return (XS[i] + (XS[i + 1] - XS[i]) * t, ROW_Y)
        return (XS[4], ROW_Y)

    hover = [0.0] * 5
    for f in range(N):
        c = new_canvas(W, H)
        pp = pointer_pos(f)
        clicked = f >= CLICK
        for i in range(5):
            over = pp is not None and abs(pp[0] - XS[i]) <= 92 and abs(pp[1] - ROW_Y) <= 163
            target = 1.0 if (over or (i == 4 and clicked)) else 0.0
            hover[i] += max(-1.0 / HQ, min(1.0 / HQ, target - hover[i]))
        for i in range(5):
            s = pop(f - (6 + 6 * i), peak=1.03)  # 1.04+ pushes the outer shadows out of the box
            if s <= 0:
                continue
            h = hover[i]
            hq = int(round(h * HQ))
            gq = 0
            alpha = 1.0
            if i < 4 and clicked:
                gq = min(15, f - CLICK + 1)
                alpha = 1.0 - 0.45 * gq / 15
            y = ROW_Y - 6 * h
            if i == 4 and clicked:
                dt = f - CLICK
                s *= 0.96 if dt < 3 else (1.04 if dt < 5 else 1.0)
            if h > 0:
                blit(c, glow, XS[i], y, 1.0, alpha=h)  # halo does not scale with the press
            blit(c, card(i, hq, gq), XS[i], y, s, alpha=alpha)
        bs = pop(f - (CLICK + 3))
        if bs > 0:
            blit(c, badge, 962, 58, bs)
        if pp is not None:
            blit(c, pointer, pp[0], pp[1])
        yield c


# -------------------------------------------------------- 9 styles-selected

def render_styles_selected():
    W, H, N = 600, 470, int(4.0 * FPS)
    # 250x445 with a 2 degree tilt and the 1.06 overshoot needs ~480 px of
    # height, so the card is 232x412 (still 9:16) to stay inside the box.
    cw, ch, b, tilt = 232, 412, 8, 2.0
    CX, CY = 300, 226
    f_rib = font(FONT_B, 24)
    im = Image.open(os.path.join(STYLE_DIR, STYLE_IMGS[4])).convert("RGBA")
    s = min((cw - 2 * b) / im.width, (ch - 2 * b) / im.height)
    photo = im.resize((int(round(im.width * s * SS)), int(round(im.height * s * SS))), Image.LANCZOS)
    rib_txt = text_sprite("paper cut-out", f_rib, PAPER)
    rw, rh = int(rib_txt.img.width / SS + 32), 40
    ribbon = paper_sprite(rw, rh, 81, tilt=-1.5, amp=1.0, color=ACCENT, ruled=False,
                          shadow=(0, 2, 3, 0.3), pad=10,
                          draw_fn=lambda img, P: blit(img, rib_txt, P + rw / 2 * SS, P + rh / 2 * SS,
                                                      1.0, ss=SS))

    def contents(img, P):
        x = int(round(P + (cw * SS - photo.width) / 2))
        y = int(round(P + (ch * SS - photo.height) / 2))
        img.alpha_composite(photo, (x, y))
        blit(img, ribbon, P + cw / 2 * SS, P + (ch - 26) * SS, 1.0, ss=SS)

    card = paper_sprite(cw, ch, 104, tilt=tilt, amp=1.4, color=WHITE, ruled=False,
                        shadow=(0, 5, 6, 0.28), draw_fn=contents, max_out=2.4)
    badge = tick_badge(24, tilt=-8)
    BADGE0 = int(0.4 * FPS)
    settled = None
    for f in range(N):
        if settled is not None:
            yield settled
            continue
        c = new_canvas(W, H)
        t = ease_out_back(f / 14, s=1.56)   # 0.3 -> 1.06 -> 1.0
        blit(c, card, CX, CY, 0.3 + 0.7 * t)
        bs = pop(f - BADGE0)
        if bs > 0:
            blit(c, badge, CX + cw / 2 - 6, CY - ch / 2 + 10, bs)
        if f >= max(14, BADGE0 + 13):
            settled = c
        yield c


# --------------------------------------------------------- 10 comment-bubble

def bubble_outline(w, h, r, tail_x0, tail_x1, tip):
    """Clockwise rounded rect with a triangular tail on the bottom edge."""
    pts = [(r, 0), (w - r, 0)]
    pts += arc_pts(w - r, r, r, -90, 0)[1:]
    pts += [(w, h - r)]
    pts += arc_pts(w - r, h - r, r, 0, 90)[1:]
    pts += [(tail_x1, h), tip, (tail_x0, h), (r, h)]
    pts += arc_pts(r, h - r, r, 90, 180)[1:]
    pts += [(0, r)]
    pts += arc_pts(r, r, r, 180, 270)[1:]
    return pts


def render_comment_bubble():
    W, H, N = 460, 420, int(6.0 * FPS)
    # 422x292 at x 24..446: at the 1.04 pop peak about the tail tip the far
    # edges (and their shadow) still stay inside the 460x420 box
    bw, bh, r = 422, 292, 28
    TIP = (376, 336)
    outline = bubble_outline(bw, bh, r, 318, 378, TIP)
    TIP_X, TIP_Y = 400, 356
    f_lab = font(FONT_B, 34)
    f_big = font(FONT_XB, 120)

    def contents(img, P):
        d = ImageDraw.Draw(img)
        X = lambda v: P + v * SS
        d.text((X(bw / 2), X(92)), "comment", font=f_lab, fill=INK + (255,), anchor="ms")
        d.text((X(bw / 2), X(226)), "PAPER", font=f_big, fill=ACCENT + (255,), anchor="ms")

    bubble = paper_sprite(bw, TIP[1], 55, tilt=0.0, amp=1.8, shadow=(0, 4, 5, 0.28),
                          max_out=2.5, outline=outline, anchor=TIP, draw_fn=contents)

    # accent arrow pointing down-right, 40 px long, anchored at its centre
    AW = 40
    P = 10 * SS
    aimg = Image.new("RGBA", ((AW + 20) * SS, (AW + 20) * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(aimg)
    Q = lambda x, y: (P + x * SS, P + y * SS)
    u = AW / math.sqrt(2)
    stroke(d, [Q(0, 0), Q(u, u)], 5 * SS, ACCENT + (255,))
    stroke(d, [Q(u - 13, u), Q(u, u), Q(u, u - 13)], 5 * SS, ACCENT + (255,))
    arrow = Spr(aimg, P + u / 2 * SS, P + u / 2 * SS)
    AX, AY = TIP_X + 22, TIP_Y + 30
    ARROW0 = 10
    B1, B2, BD = int(0.6 * FPS), int(1.2 * FPS), 8

    settled = None
    for f in range(N):
        if settled is not None:
            yield settled
            continue
        c = new_canvas(W, H)
        blit(c, bubble, TIP_X, TIP_Y, pop(f, peak=1.04))
        a = pop(f - ARROW0, dur=8)
        if a > 0:
            off = 0.0
            for b0 in (B1, B2):
                if b0 <= f < b0 + BD:
                    off = 6 * math.sin(math.pi * (f - b0) / BD)
            blit(c, arrow, AX + off / math.sqrt(2), AY + off / math.sqrt(2), a)
        if f >= B2 + BD:
            settled = c
        yield c


# ------------------------------------------------------------- encode/verify

OVERLAYS = {
    "styles-pick": (render_styles_pick, 1000, 420, 10.0),
    "install-loader": (render_install_loader, 900, 330, 4.0),
    "my-way-hero": (render_my_way_hero, 1000, 400, 14.0),
    "tips-icons": (render_tips_icons, 1000, 420, 12.0),
    "install-loader-v2": (render_install_loader_v2, 900, 440, 9.0),
    "my-way-hero-v2": (render_my_way_hero_v2, 1000, 460, 14.0),
    "simplify-body": (render_simplify_body, 900, 420, 6.0),
    "styles-strip": (render_styles_strip, 1000, 420, 10.0),
    "styles-selected": (render_styles_selected, 600, 470, 4.0),
    "tips-icons-v2": (render_tips_icons_v2, 1000, 420, 12.0),
    "comment-bubble": (render_comment_bubble, 460, 420, 6.0),
}
V2_NAMES = ["install-loader-v2", "my-way-hero-v2", "simplify-body", "styles-strip",
            "styles-selected", "tips-icons-v2", "comment-bubble"]


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
    names = [a for a in argv if not a.startswith("--")]
    if "--v2" in argv:
        names = names or V2_NAMES
    names = names or list(OVERLAYS)
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
