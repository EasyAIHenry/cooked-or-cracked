#!/usr/bin/env python
"""Render Henry's five-step workflow as a 9:16 paper-scrapbook motion graphic.

1080x1920, 30 fps, 24 s. Frames are drawn with Pillow and piped as raw RGB to
ffmpeg (libx264, crf 16). No drawtext / libass needed.

Run:
  /Users/henrychua/coc-ep3-test/OpenMontage/.venv/bin/python render_workflow.py
"""
import math
import os
import random
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ---------------------------------------------------------------- constants
W, H, FPS = 1080, 1920, 30
STEP = 135                     # frames per step (4.5 s)
TOTAL = 720                    # 24 s
N_STEPS = 5

PAPER = (255, 254, 250)
RULE = (232, 226, 214)
INK = (23, 20, 17)
INK_SOFT = (96, 90, 82)
ACC = (223, 130, 95)
TEAL = (110, 214, 231)
GREEN = (63, 174, 90)
CARD_EDGE = (226, 220, 208)
PHOTO_EDGE = (214, 206, 190)

FONT_EB = "/Users/henrychua/Library/Fonts/Inter_18pt-ExtraBold.ttf"
FONT_B = "/Users/henrychua/Library/Fonts/Inter_18pt-Bold.ttf"

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
IMG_CONTACT = os.path.join(PROJ, "12_runB-flight-attendant/stills/contact-sheet.jpg")
IMG_STRIP = os.path.join(PROJ, "12_runB-flight-attendant/clips/c3_strip.jpg")
IMG_FRAMES = os.path.join(PROJ, "12_runB-flight-attendant/clips/runB-v1-frames.jpg")
OUT_MP4 = os.path.join(HERE, "my-workflow-animated.mp4")

CW = 960                       # card width
PAD = 40                       # card inner padding
INNER = CW - 2 * PAD           # 880
COMPACT_H = 160
GAP = 40
STACK_TOP = 120
MARGIN = 48                    # card canvas margin for shadow / tape / tilt
POP_FRAMES = 13
SHRINK_FRAMES = 14

TILTS = [-1.4, 1.2, -1.0, 1.5, -1.2]
TAPE_COLOURS = [ACC, ACC, TEAL, ACC, ACC]

_fonts = {}


def font(path, size):
    size = max(6, int(round(size)))
    key = (path, size)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(path, size)
    return _fonts[key]


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def lerp(a, b, t):
    return a + (b - a) * t


def ease_out_cubic(t):
    t = clamp(t)
    return 1 - (1 - t) ** 3


def ease_in_out(t):
    t = clamp(t)
    return 3 * t * t - 2 * t * t * t


def pop_scale(r, dur=POP_FRAMES, start=0.3, over=1.08):
    """Overshoot pop: start -> over -> 1.0 over `dur` frames. None = not yet."""
    if r < 0:
        return None
    if r >= dur:
        return 1.0
    split = dur * 0.7
    if r < split:
        return lerp(start, over, ease_out_cubic(r / split))
    return lerp(over, 1.0, ease_in_out((r - split) / (dur - split)))


def stamp_scale(r, dur=9):
    """A stamp coming down: 1.7 -> 0.94 -> 1.0."""
    if r < 0:
        return None
    if r >= dur:
        return 1.0
    split = dur * 0.6
    if r < split:
        return lerp(1.7, 0.94, ease_out_cubic(r / split))
    return lerp(0.94, 1.0, ease_in_out((r - split) / (dur - split)))


# ---------------------------------------------------------------- helpers
def blit_scaled(dst, src, cx, cy, scale, angle=0.0):
    """Paste RGBA `src` onto RGBA `dst`, centred at (cx, cy), scaled/rotated."""
    if scale is None or scale <= 0:
        return
    img = src
    if angle:
        img = img.rotate(angle, resample=Image.BICUBIC, expand=True)
    if abs(scale - 1.0) > 1e-3:
        nw = max(1, int(round(img.width * scale)))
        nh = max(1, int(round(img.height * scale)))
        img = img.resize((nw, nh), Image.LANCZOS)
    x = int(round(cx - img.width / 2))
    y = int(round(cy - img.height / 2))
    dst.alpha_composite(img, (x, y))


def soft_shadow(size, polygon_or_box, offset=(0, 10), blur=14, alpha=70):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if isinstance(polygon_or_box, list):
        pts = [(x + offset[0], y + offset[1]) for x, y in polygon_or_box]
        d.polygon(pts, fill=(0, 0, 0, alpha))
    else:
        x0, y0, x1, y1 = polygon_or_box
        d.ellipse((x0 + offset[0], y0 + offset[1], x1 + offset[0], y1 + offset[1]),
                  fill=(0, 0, 0, alpha))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def torn_polygon(w, h, seed, amp=3.0, n=36, ox=0, oy=0):
    rnd = random.Random(seed)
    jit = [[rnd.uniform(-amp, amp) for _ in range(n + 1)] for _ in range(4)]
    pts = []
    for i in range(n):
        t = i / n
        pts.append((ox + t * w, oy + jit[0][i]))
    for i in range(n):
        t = i / n
        pts.append((ox + w + jit[1][i], oy + t * h))
    for i in range(n):
        t = i / n
        pts.append((ox + w - t * w, oy + h + jit[2][i]))
    for i in range(n):
        t = i / n
        pts.append((ox + jit[3][i], oy + h - t * h))
    return pts


def tape(colour, w=150, h=38, angle=-4.0, alpha=215):
    img = Image.new("RGBA", (w + 20, h + 20), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle((10, 10, 10 + w, 10 + h), fill=colour + (alpha,))
    # tiny torn ends
    d.polygon([(10, 10), (14, 14), (10, 18), (15, 24), (10, 30), (14, 36), (10, 10 + h)],
              fill=(0, 0, 0, 0))
    return img.rotate(angle, resample=Image.BICUBIC, expand=True)


def tick_badge(d_px, colour, stroke=None):
    img = Image.new("RGBA", (d_px + 8, d_px + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse((4, 4, 4 + d_px, 4 + d_px), fill=colour + (255,))
    s = stroke or max(4, int(d_px * 0.1))
    c = 4 + d_px / 2
    r = d_px * 0.5
    pts = [(c - r * 0.45, c + r * 0.02), (c - r * 0.12, c + r * 0.36), (c + r * 0.48, c - r * 0.36)]
    d.line(pts, fill=(255, 255, 255, 255), width=s, joint="curve")
    return img


def fit_image(src_img, box_w, box_h):
    """Scale to fit inside box, letterbox on paper colour with a thin edge."""
    scale = min(box_w / src_img.width, box_h / src_img.height)
    nw, nh = int(round(src_img.width * scale)), int(round(src_img.height * scale))
    out = Image.new("RGBA", (box_w, box_h), PAPER + (255,))
    im = src_img.convert("RGB").resize((nw, nh), Image.LANCZOS)
    x, y = (box_w - nw) // 2, (box_h - nh) // 2
    out.paste(im, (x, y))
    ImageDraw.Draw(out).rectangle((x, y, x + nw - 1, y + nh - 1), outline=PHOTO_EDGE, width=2)
    return out


# ---------------------------------------------------------------- card content
class Card:
    def __init__(self, idx, title_lines, caption, content_w, content_h, static_after):
        self.idx = idx
        self.title_lines = title_lines
        self.caption = caption
        self.cw = content_w
        self.ch = content_h
        self.static_after = static_after

    def full_height(self):
        n = len(self.title_lines)
        return 52 + n * 84 + 24 + self.ch + 24 + 48 + 36

    def content(self, t):
        raise NotImplementedError


class VoiceCard(Card):
    NAMES = ["Elodie", "Juno", "Soraya", "Nadine", "Elodie 2"]

    def __init__(self):
        super().__init__(0, ["PICK THE VOICE"], "5 samples, Gemini ranks, I choose", INNER, 200, 48)
        self.chips = []
        d = 156
        for name in self.NAMES:
            img = Image.new("RGBA", (d + 24, d + 24), (0, 0, 0, 0))
            img.alpha_composite(soft_shadow(img.size, (12, 12, 12 + d, 12 + d), offset=(0, 5), blur=6, alpha=55))
            dr = ImageDraw.Draw(img)
            dr.ellipse((12, 12, 12 + d, 12 + d), fill=(255, 255, 255, 255), outline=CARD_EDGE, width=3)
            dr.text((12 + d / 2, 12 + d / 2), name, font=font(FONT_B, 32), fill=INK, anchor="mm")
            self.chips.append(img)
        ring = Image.new("RGBA", (d + 40, d + 40), (0, 0, 0, 0))
        ImageDraw.Draw(ring).ellipse((6, 6, d + 34, d + 34), outline=ACC + (255,), width=7)
        self.ring = ring
        self.badge = tick_badge(50, ACC)

    def content(self, t):
        img = Image.new("RGBA", (self.cw, self.ch), (0, 0, 0, 0))
        d = 156
        gap = (INNER - 5 * d) / 4
        for i, chip in enumerate(self.chips):
            cx = d / 2 + i * (d + gap)
            cy = self.ch / 2
            s = pop_scale(t - (4 + 4 * i), dur=10)
            blit_scaled(img, chip, cx, cy, s)
            if i == 3:
                rs = pop_scale(t - 34, dur=10, start=0.6, over=1.1)
                blit_scaled(img, self.ring, cx, cy, rs)
                bs = pop_scale(t - 36, dur=10)
                blit_scaled(img, self.badge, cx + d * 0.36, cy - d * 0.36, bs)
        return img


class StillsCard(Card):
    def __init__(self):
        super().__init__(1, ["APPROVE THE STILLS"], "9 stills, one style lock, all accepted", INNER, 312, 42)
        src = Image.open(IMG_CONTACT)
        top = src.crop((0, 0, src.width, src.height // 2))      # top row of five
        self.base = fit_image(top, self.cw, self.ch)
        # green tick stamp
        d = 190
        st = Image.new("RGBA", (d + 20, d + 20), (0, 0, 0, 0))
        dr = ImageDraw.Draw(st)
        dr.ellipse((10, 10, 10 + d, 10 + d), fill=GREEN + (235,))
        dr.ellipse((22, 22, d - 2, d - 2), outline=(255, 255, 255, 235), width=5)
        c = 10 + d / 2
        r = d / 2
        dr.line([(c - r * 0.42, c + r * 0.02), (c - r * 0.12, c + r * 0.34), (c + r * 0.45, c - r * 0.34)],
                fill=(255, 255, 255, 255), width=18, joint="curve")
        self.stamp = st.rotate(-10, resample=Image.BICUBIC, expand=True)

    def content(self, t):
        img = self.base.copy()
        s = stamp_scale(t - 30)
        blit_scaled(img, self.stamp, self.cw - 150, self.ch / 2 + 6, s)
        return img


class ClipsCard(Card):
    def __init__(self):
        super().__init__(2, ["ANIMATE ONLY", "WHAT MOVES"], "9 clips, Kling 3.0, steady camera", INNER, 315, 26)
        src = Image.open(IMG_STRIP).crop((0, 0, 1000, 358))     # drop the black pad
        self.strip = fit_image(src, self.cw, self.ch)

    def content(self, t):
        img = Image.new("RGBA", (self.cw, self.ch), PAPER + (255,))
        ImageDraw.Draw(img).rectangle((0, 0, self.cw - 1, self.ch - 1), outline=PHOTO_EDGE, width=2)
        x = int(round(lerp(-self.cw, 0, ease_out_cubic(t / 22))))
        if x < 0:
            img.alpha_composite(self.strip.crop((-x, 0, self.cw, self.ch)), (0, 0))
        else:
            img.alpha_composite(self.strip, (0, 0))
        return img


class CutCard(Card):
    def __init__(self):
        super().__init__(3, ["CUT IT"], "takes fitted to clips, captions, music, title", INNER, 223, 52)
        src = Image.open(IMG_FRAMES)
        top = src.crop((0, 0, src.width, src.height // 2))      # top row of six
        self.base = fit_image(top, self.cw, self.ch)
        mark = Image.new("RGBA", (28, self.ch + 24), (0, 0, 0, 0))
        dr = ImageDraw.Draw(mark)
        dr.rectangle((11, 12, 16, 12 + self.ch), fill=ACC + (255,))
        dr.polygon([(2, 0), (26, 0), (14, 16)], fill=ACC + (255,))
        dr.polygon([(2, self.ch + 24), (26, self.ch + 24), (14, self.ch + 8)], fill=ACC + (255,))
        self.mark = mark

    def content(self, t):
        img = self.base.copy()
        for i in range(1, 6):
            x = self.cw * i / 6
            s = pop_scale(t - (8 + 6 * (i - 1)), dur=8)
            blit_scaled(img, self.mark, x, self.ch / 2, s)
        return img


class ReceiptCard(Card):
    ROWS = [("Time", "1 h 38 min", "25 min"),
            ("Money", "$0.12", "about $2"),
            ("Voice", "robot", "chosen"),
            ("Style held", "no", "yes"),
            ("Gates", "12", "2")]

    def __init__(self):
        super().__init__(4, ["RECEIPT"], "same topic, same style lock", INNER, 360, 64)
        self.cols = (0, 190, 610, INNER)
        self.header_h = 64
        self.row_h = 58
        base = Image.new("RGBA", (self.cw, self.ch), (0, 0, 0, 0))
        d = ImageDraw.Draw(base)
        f_h = font(FONT_EB, 34)
        f_b = font(FONT_B, 34)
        # teal highlight behind "my way" header (the one teal touch on this card)
        hw = f_h.getlength("my way")
        d.rectangle((self.cols[2] + 10, 14, self.cols[2] + 22 + hw, 50), fill=TEAL + (150,))
        d.text((self.cols[1] + 16, self.header_h / 2), "one prompt", font=f_h, fill=INK, anchor="lm")
        d.text((self.cols[2] + 16, self.header_h / 2), "my way", font=f_h, fill=INK, anchor="lm")
        d.line((0, self.header_h, self.cw, self.header_h), fill=INK + (255,), width=3)
        for i, (label, a, _b) in enumerate(self.ROWS):
            y = self.header_h + i * self.row_h
            cy = y + self.row_h / 2
            d.text((self.cols[0] + 4, cy), label, font=f_b, fill=INK, anchor="lm")
            d.text((self.cols[1] + 16, cy), a, font=f_b, fill=INK_SOFT, anchor="lm")
            if i < len(self.ROWS) - 1:
                d.line((0, y + self.row_h, self.cw, y + self.row_h), fill=PHOTO_EDGE + (255,), width=2)
        d.line((self.cols[1], 0, self.cols[1], self.ch), fill=PHOTO_EDGE + (255,), width=2)
        d.line((self.cols[2], 0, self.cols[2], self.ch), fill=PHOTO_EDGE + (255,), width=2)
        self.base = base
        self.values = []
        for _label, _a, b in self.ROWS:
            w = int(f_h.getlength(b)) + 16
            im = Image.new("RGBA", (w, 52), (0, 0, 0, 0))
            ImageDraw.Draw(im).text((8, 26), b, font=f_h, fill=ACC, anchor="lm")
            self.values.append(im)

    def content(self, t):
        img = self.base.copy()
        for i, im in enumerate(self.values):
            cy = self.header_h + i * self.row_h + self.row_h / 2
            s = pop_scale(t - (10 + 10 * i), dur=10)
            blit_scaled(img, im, self.cols[2] + 16 + im.width / 2, cy, s)
        return img


# ---------------------------------------------------------------- card rendering
_card_cache = {}


def render_card(card, e, t):
    """Render card `card` at expansion e (1 full, 0 compact) and content time t.
    Returns an RGBA image already tilted, plus (cx, cy) of the card body centre
    inside that image."""
    t = int(clamp(t, 0, card.static_after))
    key = (card.idx, round(e, 4), t)
    if key in _card_cache:
        return _card_cache[key]

    n = len(card.title_lines)
    h_full = card.full_height()
    h = lerp(COMPACT_H, h_full, e)
    cw_img, ch_img = CW + 2 * MARGIN, int(round(h)) + 2 * MARGIN
    img = Image.new("RGBA", (cw_img, ch_img), (0, 0, 0, 0))

    poly = torn_polygon(CW, h, seed=card.idx * 7 + 3, ox=MARGIN, oy=MARGIN)
    img.alpha_composite(soft_shadow(img.size, poly))
    d = ImageDraw.Draw(img)
    d.polygon(poly, fill=(255, 255, 255, 255), outline=CARD_EDGE, width=2)

    # ---- number badge
    bd = lerp(52, 72, e)
    bx = lerp(MARGIN + 32, MARGIN + PAD, e)
    by = lerp(MARGIN + COMPACT_H / 2 - bd / 2, MARGIN + 52 + 42 - bd / 2, e)
    d.ellipse((bx, by, bx + bd, by + bd), fill=ACC)
    d.text((bx + bd / 2, by + bd / 2 + 1), str(card.idx + 1), font=font(FONT_EB, bd * 0.56),
           fill=(255, 255, 255), anchor="mm")

    # ---- title
    ts = lerp(42, 72, e)
    lh = lerp(48, 84, e)                          # line pitch
    tx = bx + bd + lerp(16, 20, e)
    # centre of the first title line: compact = centred in the strip, full = fixed row
    ty0 = lerp(MARGIN + COMPACT_H / 2 - (n - 1) * lh / 2, MARGIN + 52 + 42, e)
    f_t = font(FONT_EB, ts)
    for i, line in enumerate(card.title_lines):
        d.text((tx, ty0 + i * lh), line, font=f_t, fill=INK, anchor="lm")

    # ---- content
    s_min = min(260 / card.cw, 110 / card.ch)
    s = lerp(s_min, 1.0, e)
    cx_full = MARGIN + PAD + card.cw / 2
    cy_full = MARGIN + 52 + n * 84 + 24 + card.ch / 2
    cx_comp = MARGIN + CW - 32 - 130
    cy_comp = MARGIN + COMPACT_H / 2
    cx, cy = lerp(cx_comp, cx_full, e), lerp(cy_comp, cy_full, e)
    blit_scaled(img, card.content(t), cx, cy, s)

    # ---- caption (fades out with the shrink; never fades in)
    if e > 0.02:
        cap_y = MARGIN + 52 + n * 84 + 24 + card.ch + 24 + 24
        a = int(255 * e * e)
        f_c = font(FONT_B, 40)
        cap = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(cap).text((MARGIN + PAD, cap_y), card.caption, font=f_c, fill=INK_SOFT + (a,), anchor="lm")
        img.alpha_composite(cap)

    # ---- tape
    tp = tape(TAPE_COLOURS[card.idx], angle=-4.0 if card.idx % 2 == 0 else 3.5)
    img.alpha_composite(tp, (int(MARGIN + CW / 2 - tp.width / 2), int(MARGIN - tp.height / 2 + 4)))

    # ---- tilt
    tilt = TILTS[card.idx]
    rot = img.rotate(tilt, resample=Image.BICUBIC, expand=True)
    _card_cache[key] = rot
    return rot


# ---------------------------------------------------------------- timeline
def step_start(k):
    return k * STEP


def pop_start(k):
    return step_start(k) + (6 if k == 0 else SHRINK_FRAMES)


def land(k):
    return pop_start(k) + POP_FRAMES


def expansion(k, f):
    if k == N_STEPS - 1:
        return 1.0
    s = step_start(k + 1)
    if f < s:
        return 1.0
    return 1.0 - ease_in_out((f - s) / SHRINK_FRAMES)


def make_background():
    bg = Image.new("RGBA", (W, H), PAPER + (255,))
    d = ImageDraw.Draw(bg)
    for y in range(64, H, 64):
        d.line((0, y, W, y), fill=RULE + (255,), width=2)
    return bg


def render_frame(f, cards, bg):
    frame = bg.copy()
    y = STACK_TOP
    for k, card in enumerate(cards):
        ps = pop_scale(f - pop_start(k))
        if ps is None:
            break
        e = expansion(k, f)
        h = lerp(COMPACT_H, card.full_height(), e)
        t = f - land(k)
        img = render_card(card, e, t)
        cx = W / 2
        cy = y + h / 2
        blit_scaled(frame, img, cx, cy, ps)
        y += h + GAP
    return frame


def main():
    cards = [VoiceCard(), StillsCard(), ClipsCard(), CutCard(), ReceiptCard()]
    bg = make_background()

    # layout sanity: bottom 200 px must stay clear at every step
    for k in range(N_STEPS):
        total = STACK_TOP + sum(COMPACT_H + GAP for _ in range(k)) + cards[k].full_height() + MARGIN
        assert total <= H - 200, f"stack overflows at step {k}: {total}"

    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT_MP4]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(TOTAL):
        frame = render_frame(f, cards, bg)
        proc.stdin.write(frame.convert("RGB").tobytes())
        if f % 60 == 0:
            print(f"frame {f}/{TOTAL}", file=sys.stderr, flush=True)
    proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        sys.exit(f"ffmpeg failed with {proc.returncode}")
    print(OUT_MP4)


if __name__ == "__main__":
    main()
