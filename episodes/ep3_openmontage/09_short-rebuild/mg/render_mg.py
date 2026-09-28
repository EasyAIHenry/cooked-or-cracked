#!/usr/bin/env python
"""Render the four 9:16 motion-graphics scenes (mg3..mg6) for the Ep3 short.

Usage:
    /Users/henrychua/coc-ep3-test/OpenMontage/.venv/bin/python render_mg.py            # all four, in parallel
    /Users/henrychua/coc-ep3-test/OpenMontage/.venv/bin/python render_mg.py mg3 mg5    # a subset
    /Users/henrychua/coc-ep3-test/OpenMontage/.venv/bin/python render_mg.py --still mg3 4.5 out.png  # one frame

Frames are drawn with Pillow at 2x (2160x3840) for anti-aliasing, then the
slow camera push (1.00 -> 1.03) and the downsample to 1080x1920 happen in a
single LANCZOS resize, and raw RGB frames are piped into ffmpeg/libx264.
"""
import math
import os
import subprocess
import sys
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
S = 2                      # supersample factor
W2, H2 = W * S, H * S
OUT = os.path.dirname(os.path.abspath(__file__))
F_XB = "/Users/henrychua/Library/Fonts/Inter_18pt-ExtraBold.ttf"
F_B = "/Users/henrychua/Library/Fonts/Inter_18pt-Bold.ttf"

BG = (11, 13, 16)
GRID = (26, 30, 36)
CYAN = (110, 214, 231)
BRASS = (217, 164, 65)
CREAM = (243, 235, 221)
RED = (255, 75, 62)
WHITE = (255, 255, 255)

# ----------------------------------------------------------------- helpers

_fonts = {}


def font(path, size):
    key = (path, max(1, int(round(size * S))))
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(path, key[1])
    return _fonts[key]


def clamp01(x):
    return 0.0 if x < 0 else 1.0 if x > 1 else x


def prog(t, t0, d):
    return clamp01((t - t0) / d)


def eo(p):  # ease-out cubic (entrances)
    p = clamp01(p)
    return 1 - (1 - p) ** 3


def eio(p):  # ease-in-out cubic (moves)
    p = clamp01(p)
    return 4 * p * p * p if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2


def eob(p, s=0.6):  # ease-out back: tiny overshoot then settle
    p = clamp01(p)
    u = p - 1
    return 1 + (s + 1) * u ** 3 + s * u * u


def lerp(a, b, p):
    return a + (b - a) * p


def rgba(c, a=1.0):
    return (c[0], c[1], c[2], int(round(255 * clamp01(a))))


def make_bg():
    im = Image.new("RGBA", (W2, H2), BG + (255,))
    d = ImageDraw.Draw(im)
    pitch = 90 * S
    for x in range(0, W2 + 1, pitch):
        d.line([(x, 0), (x, H2)], fill=GRID + (255,), width=S)
    for y in range(0, H2 + 1, pitch):
        d.line([(0, y), (W2, y)], fill=GRID + (255,), width=S)
    return im


class Layer:
    """One RGBA drawing layer in 1x coordinates (scaled by S internally).

    If `glow` is a colour, a blurred copy of the layer's alpha is composited
    underneath it in that colour at 30 percent.
    """

    def __init__(self, glow=None):
        self.im = Image.new("RGBA", (W2, H2), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)
        self.glow = glow

    @staticmethod
    def P(p):
        return (p[0] * S, p[1] * S)

    def line(self, p1, p2, color, w=4, a=1.0, caps=True):
        c = rgba(color, a)
        ws = w * S
        x1, y1 = self.P(p1)
        x2, y2 = self.P(p2)
        self.d.line([(x1, y1), (x2, y2)], fill=c, width=int(round(ws)))
        if caps:
            r = ws / 2
            for x, y in ((x1, y1), (x2, y2)):
                self.d.ellipse([x - r, y - r, x + r, y + r], fill=c)

    def polyline_trace(self, pts, p, color, w=4, a=1.0):
        """Draw the first fraction p of a polyline (draw-on effect)."""
        if p <= 0:
            return
        segs = []
        total = 0.0
        for i in range(len(pts) - 1):
            L = math.dist(pts[i], pts[i + 1])
            segs.append(L)
            total += L
        left = p * total
        for i, L in enumerate(segs):
            if left <= 0:
                break
            f = min(1.0, left / L) if L > 0 else 1.0
            x0, y0 = pts[i]
            x1, y1 = pts[i + 1]
            self.line((x0, y0), (lerp(x0, x1, f), lerp(y0, y1, f)), color, w, a)
            left -= L

    def dashed_line(self, p1, p2, color, w=3, a=1.0, dash=12, gap=10, p=1.0):
        if p <= 0:
            return
        L = math.dist(p1, p2)
        vis = L * p
        ux, uy = (p2[0] - p1[0]) / L, (p2[1] - p1[1]) / L
        s = 0.0
        while s < vis:
            e = min(s + dash, vis)
            self.line((p1[0] + ux * s, p1[1] + uy * s), (p1[0] + ux * e, p1[1] + uy * e), color, w, a)
            s += dash + gap

    def dot(self, c, r, color, a=1.0):
        if r <= 0:
            return
        x, y = self.P(c)
        rs = r * S
        self.d.ellipse([x - rs, y - rs, x + rs, y + rs], fill=rgba(color, a))

    def ring(self, c, r, color, w=4, a=1.0, start=-90, sweep=360, caps=True):
        """Stroke of width w centred on radius r. Sweep is clockwise from `start` degrees."""
        if sweep <= 0 or r <= 0:
            return
        x, y = self.P(c)
        ws = w * S
        ro = r * S + ws / 2
        col = rgba(color, a)
        box = [x - ro, y - ro, x + ro, y + ro]
        if sweep >= 360:
            self.d.ellipse(box, outline=col, width=int(round(ws)))
            return
        self.d.arc(box, start, start + sweep, fill=col, width=int(round(ws)))
        if caps:
            for ang in (start, start + sweep):
                ra = math.radians(ang)
                px, py = x + r * S * math.cos(ra), y + r * S * math.sin(ra)
                self.d.ellipse([px - ws / 2, py - ws / 2, px + ws / 2, py + ws / 2], fill=col)

    def dashed_ring(self, c, r, color, w=3, a=1.0, sweep=360, dash=6, gap=5, start=-90):
        if sweep <= 0:
            return
        x, y = self.P(c)
        ws = w * S
        ro = r * S + ws / 2
        col = rgba(color, a)
        box = [x - ro, y - ro, x + ro, y + ro]
        ang = 0.0
        while ang < sweep:
            a0 = start + ang
            a1 = start + min(ang + dash, sweep)
            self.d.arc(box, a0, a1, fill=col, width=int(round(ws)))
            ang += dash + gap

    def rrect(self, box, color, a=1.0, r=None, fill=True, w=4):
        x0, y0, x1, y1 = [v * S for v in box]
        if x1 - x0 < 1 or y1 - y0 < 1:
            return
        rr = (y1 - y0) / 2 if r is None else r * S
        rr = int(min(rr, (x1 - x0) / 2, (y1 - y0) / 2))
        col = rgba(color, a)
        if fill:
            self.d.rounded_rectangle([x0, y0, x1, y1], radius=rr, fill=col)
        else:
            self.d.rounded_rectangle([x0, y0, x1, y1], radius=rr, outline=col, width=int(round(w * S)))

    def paste(self, tmp, px, py):
        """alpha_composite tmp at (px, py) in 2x pixels, clipped to the layer."""
        px, py = int(round(px)), int(round(py))
        tw, th = tmp.size
        sx0, sy0 = max(0, -px), max(0, -py)
        sx1, sy1 = min(tw, W2 - px), min(th, H2 - py)
        if sx1 <= sx0 or sy1 <= sy0:
            return
        if (sx0, sy0, sx1, sy1) != (0, 0, tw, th):
            tmp = tmp.crop((sx0, sy0, sx1, sy1))
        self.im.alpha_composite(tmp, (px + sx0, py + sy0))

    @staticmethod
    def measure(s, fnt, size, tracking=0):
        f = font(fnt, size)
        return (sum(f.getlength(ch) for ch in s) + tracking * S * (len(s) - 1)) / S

    def text(self, s, fnt, size, xy, color, a=1.0, tracking=0, anchor="mm", reveal=1.0):
        """Letter-spaced text. anchor = horizontal (l/m/r) + vertical (t/m/b).
        reveal < 1 wipes the text on from the left with a soft edge."""
        if reveal <= 0 or a <= 0 or size <= 1:
            return 0
        f = font(fnt, size)
        tr = tracking * S
        widths = [f.getlength(ch) for ch in s]
        total = sum(widths) + tr * (len(s) - 1)
        bb = f.getbbox(s, anchor="ls")
        top, bot = bb[1], bb[3]
        h = bot - top
        pad = 6 * S
        tw, th = int(total + 2 * pad), int(h + 2 * pad)
        tmp = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
        td = ImageDraw.Draw(tmp)
        x = pad
        base = pad - top
        col = rgba(color, a)
        for ch, wd in zip(s, widths):
            td.text((x, base), ch, font=f, fill=col, anchor="ls")
            x += wd + tr
        if reveal < 1:
            arr = np.array(tmp)
            soft = 28 * S
            xs = np.arange(tw)
            edge = reveal * (tw + soft)
            m = np.clip((edge - xs) / soft, 0, 1)
            arr[..., 3] = (arr[..., 3] * m[None, :]).astype(np.uint8)
            tmp = Image.fromarray(arr)
        cx, cy = self.P(xy)
        ha, va = anchor[0], anchor[1]
        px = cx - (0 if ha == "l" else tw / 2 if ha == "m" else tw)
        py = cy - (0 if va == "t" else th / 2 if va == "m" else th)
        self.paste(tmp, px, py)
        return total / S


def compose(bg, layers, t, T):
    fr = bg.copy()
    for L in layers:
        if L.glow is not None:
            a = L.im.getchannel("A").resize((W2 // 4, H2 // 4), Image.BILINEAR)
            a = a.filter(ImageFilter.GaussianBlur(11)).point(lambda v: int(v * 0.3))
            g = Image.new("RGBA", (W2 // 4, H2 // 4), L.glow + (0,))
            g.putalpha(a)
            fr.alpha_composite(g.resize((W2, H2), Image.BILINEAR))
        fr.alpha_composite(L.im)
    # slow camera push: 1.00 -> 1.03 across the scene
    s = 1.0 + 0.03 * clamp01(t / T)
    cw, ch = W2 / s, H2 / s
    x0, y0 = (W2 - cw) / 2, (H2 - ch) / 2
    return fr.convert("RGB").resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch))


# ------------------------------------------------------------------ scenes


def mg3(t):
    """10.00 MM numeral -> range bar 9.97..10.03 -> PIN big, HOLE small -> 0 GAP."""
    base = Layer()               # band, ticks, nominal, small labels
    pinL = Layer(glow=BRASS)     # brass pin bar
    main = Layer(glow=CYAN)      # numeral + hole bar
    top = Layer(glow=RED)        # red flash + 0 GAP
    NX, BY = 540, 820
    # --- numeral ------------------------------------------------------
    rv = eo(prog(t, 0.2, 0.7))
    mv = eio(prog(t, 2.0, 0.7))
    size = lerp(210, 64, mv)
    ny = lerp(700, 560, mv) - (1 - rv) * 24
    trk = lerp(-4, -1, mv)
    if rv > 0:
        nw = main.measure("10.00", F_XB, size, trk)
        main.text("10.00", F_XB, size, (NX, ny), CYAN, tracking=trk, reveal=rv)
        # MM label: below numeral at first, then tucked to its right
        mmsz = lerp(40, 22, mv)
        mmw = main.measure("MM", F_B, mmsz, 6)
        p1 = (NX, ny + size * 0.36 + 52)
        p2 = (NX + nw / 2 + 18 + mmw / 2, ny + size * 0.1)
        mmp = (lerp(p1[0], p2[0], mv), lerp(p1[1], p2[1], mv))
        main.text("MM", F_B, mmsz, mmp, CYAN, a=0.85, tracking=6, reveal=eo(prog(t, 0.6, 0.5)))
    # --- range band ---------------------------------------------------
    bp = eo(prog(t, 2.2, 0.8))
    half = 340 * bp
    if half > 4:
        base.rrect((NX - half, BY - 28, NX + half, BY + 28), CREAM, a=0.12, r=10)
        base.rrect((NX - half, BY - 28, NX + half, BY + 28), CREAM, a=0.7, r=10, fill=False, w=4)
    # nominal dashed vertical
    base.dashed_line((NX, 615), (NX, 1000), CREAM, w=3, a=0.5, p=eo(prog(t, 2.4, 0.6)))
    # ticks + end numerals
    tp = eo(prog(t, 2.8, 0.4))
    for x in (NX - 340, NX, NX + 340):
        if tp > 0:
            base.line((x, BY + 36), (x, BY + 36 + 26 * tp), CREAM, w=4, a=0.8)
    lr = eo(prog(t, 3.0, 0.5))
    base.text("9.97", F_XB, 56, (NX - 340, 920), WHITE, tracking=-1, reveal=lr)
    base.text("10.03", F_XB, 56, (NX + 340, 920), WHITE, tracking=-1, reveal=lr)
    # --- convergence (8.4) ---------------------------------------------
    cp = eio(prog(t, 8.4, 0.6))
    # --- PIN bar (4.2) ---------------------------------------------------
    sp = eo(prog(t, 4.2, 0.7))
    gp = eio(prog(t, 5.0, 0.6))
    if sp > 0:
        y = lerp(700, BY, cp)
        off = -(1 - sp) * 520
        x0, x1 = 200 + off, lerp(NX, 585, gp) + off
        pinL.rrect((x0, y - 20, x1, y + 20), BRASS, r=20)
        base.text("PIN", F_B, 30, (x0 + 2, y - 44), BRASS, a=0.95, tracking=5, anchor="lm",
                  reveal=eo(prog(t, 4.7, 0.4)))
    # --- HOLE bar (6.6) --------------------------------------------------
    sp2 = eo(prog(t, 6.6, 0.7))
    gp2 = eio(prog(t, 7.4, 0.6))
    if sp2 > 0:
        y = lerp(940, BY, cp)
        off = (1 - sp2) * 520
        x0, x1 = lerp(NX, 495, gp2) + off, 880 + off
        main.rrect((x0, y - 20, x1, y + 20), CYAN, r=20, fill=False, w=4)
        base.text("HOLE", F_B, 30, (x1 - 2, y + 46), CYAN, a=0.95, tracking=5, anchor="rm",
                  reveal=eo(prog(t, 7.1, 0.4)))
    # --- overlap flash + 0 GAP -------------------------------------------
    def pulse(t0):
        u = t - t0
        if u < 0:
            return 0.0
        if u < 0.08:
            return eo(u / 0.08)
        if u < 0.14:
            return 1.0
        return 1 - eio((u - 0.14) / 0.3)
    f = max(pulse(9.0), pulse(9.5))
    hold = 0.55 * eo(prog(t, 9.8, 0.4))
    f = max(f, hold)
    if f > 0:
        top.rrect((495, BY - 20, 585, BY + 20), RED, a=0.9 * f, r=20)
        top.rrect((489, BY - 26, 591, BY + 26), RED, a=f, r=26, fill=False, w=4)
    top.text("0 GAP", F_XB, 120, (NX, 1090), RED, tracking=2, reveal=eo(prog(t, 9.1, 0.6)))
    return [base, pinL, main, top]


def mg4(t):
    """Nominal line, five brass pins scatter around it, cyan TOLERANCE band."""
    pins = Layer(glow=BRASS)
    band = Layer(glow=CYAN)
    ui = Layer()
    NY = 640
    # pins drop in one after another
    xs = [180, 325, 470, 615, 760]
    offs = [-34, 22, -8, 40, -18]
    for i, (x, off) in enumerate(zip(xs, offs)):
        p = prog(t, 0.4 + i * 0.3, 0.6)
        if p <= 0:
            continue
        e = eob(p, 0.6)
        ytop = lerp(-720, NY + off, e)
        L = 1240 - (NY + off)
        pins.rrect((x - 36, ytop, x + 36, ytop + L), BRASS, r=36)
    # nominal line + label (drawn over the pins)
    lp = eo(prog(t, 0.2, 0.6))
    if lp > 0:
        ui.line((90, NY), (90 + 750 * lp, NY), CREAM, w=4, a=0.9)
    ui.text("10.00", F_XB, 48, (1000, NY), CREAM, tracking=-1, anchor="rm", reveal=eo(prog(t, 0.7, 0.5)))
    # tolerance band (2.0) with a gentle breath
    bp = eo(prog(t, 2.0, 0.7))
    if bp > 0:
        br = 1 + 0.025 * math.sin(2 * math.pi * 0.5 * (t - 2.7)) * clamp01((t - 2.7) / 0.6)
        hh = 50 * br
        hw = 375 * bp
        cx = 465
        band.rrect((cx - hw, NY - hh, cx + hw, NY + hh), CYAN, a=0.14, r=10)
        band.rrect((cx - hw, NY - hh, cx + hw, NY + hh), CYAN, a=0.9, r=10, fill=False, w=4)
        # bracket at the left edge
        kp = eo(prog(t, 2.5, 0.45))
        if kp > 0:
            bx = 52
            ui.polyline_trace([(bx + 18, NY - hh), (bx, NY - hh), (bx, NY + hh), (bx + 18, NY + hh)], kp, CYAN, 4, 0.9)
        ui.text("TOLERANCE", F_B, 40, (90, NY - hh - 42), CYAN, tracking=8, anchor="lm",
                reveal=eo(prog(t, 2.7, 0.5)))
    return [pins, band, ui]


def mg5(t):
    """Bore circle, pin with an even ring of clearance, two separated tolerance bands."""
    bore = Layer(glow=CYAN)
    pin = Layer(glow=BRASS)
    ui = Layer()
    C = (540, 760)
    bore.ring(C, 300, CYAN, w=4, sweep=360 * eo(prog(t, 0.2, 0.9)))
    # pin eases in at the centre (scales up, never crosses the bore wall)
    pp = eo(prog(t, 1.0, 0.8))
    if pp > 0:
        pin.dot(C, lerp(60, 230, pp), BRASS)
    # clearance ring + label (1.8)
    ui.dashed_ring(C, 265, CYAN, w=3, a=0.9, sweep=360 * eo(prog(t, 1.8, 0.6)))
    ui.text("CLEARANCE", F_B, 44, (540, 1130), CYAN, tracking=10, reveal=eo(prog(t, 2.0, 0.5)))
    # two tolerance bands with a clear gap (3.2)
    by = 1290
    b1 = eo(prog(t, 3.2, 0.6))
    if b1 > 0:
        pin.rrect((200, by - 18, 200 + 270 * b1, by + 18), BRASS, r=18)
    b2 = eo(prog(t, 3.4, 0.6))
    if b2 > 0:
        bore.rrect((880 - 270 * b2, by - 18, 880, by + 18), CYAN, r=18)
    gp = eo(prog(t, 3.9, 0.5))
    if gp > 0:
        ui.line((540 - 62 * gp, by), (540 + 62 * gp, by), CREAM, w=4)
        if gp > 0.95:
            for x in (478, 602):
                ui.line((x, by - 10), (x, by + 10), CREAM, w=4)
    ui.text("PIN", F_B, 26, (335, 1345), BRASS, a=0.9, tracking=5, reveal=eo(prog(t, 3.7, 0.4)))
    ui.text("HOLE", F_B, 26, (745, 1345), CYAN, a=0.9, tracking=5, reveal=eo(prog(t, 3.9, 0.4)))
    return [bore, pin, ui]


def mg6(t):
    """Three identical bores: clearance (spins), transition (seats), interference (pressed)."""
    frames = Layer()
    bores = Layer(glow=CYAN)
    pinsL = Layer(glow=BRASS)
    fx = Layer(glow=RED)
    ui = Layer()
    CX = [220, 540, 860]
    CY, HALF, RB = 700, 140, 100
    for i, x in enumerate(CX):
        sq = eo(prog(t, 0.0 + i * 0.1, 0.5))
        pts = [(x - HALF, CY - HALF), (x + HALF, CY - HALF), (x + HALF, CY + HALF), (x - HALF, CY + HALF), (x - HALF, CY - HALF)]
        frames.polyline_trace(pts, sq, CREAM, 4, 0.5)
        bores.ring((x, CY), RB, CYAN, w=4, sweep=360 * eo(prog(t, 0.15 + i * 0.1, 0.5)))
    # --- left: clearance, loose pin that spins ---------------------------
    p = prog(t, 0.2, 0.6)
    if p > 0:
        y = lerp(CY - 440, CY + 6, eo(p))
        pinsL.dot((CX[0], y), 80, BRASS)
        ang = math.radians(-90 + 300 * (t - 0.2))
        ca, sa = math.cos(ang), math.sin(ang)
        pinsL.line((CX[0] + 30 * ca, y + 30 * sa), (CX[0] + 60 * ca, y + 60 * sa), BG, w=5)
    ui.text("CLEARANCE", F_B, 28, (CX[0], 900), CYAN, tracking=4, reveal=eo(prog(t, 1.0, 0.5)))
    # --- middle: transition, seats flush with a tiny settle -------------
    p = prog(t, 2.4, 0.7)
    if p > 0:
        y = lerp(CY - 440, CY, eob(p, 0.6))
        pinsL.dot((CX[1], y), RB, BRASS)
    ui.text("TRANSITION", F_B, 28, (CX[1], 900), CYAN, tracking=4, reveal=eo(prog(t, 3.4, 0.5)))
    # --- right: interference, pressed in by a bar, red stress ring ------
    p = prog(t, 5.6, 0.7)
    if p > 0:
        dp = eio(p)
        y = lerp(CY - 480, CY, dp)
        RP = 106
        pinsL.dot((CX[2], y), RP, BRASS)
        # press bar: rides on the pin, then retracts upward
        rp = eio(prog(t, 6.5, 0.6))
        bar_bot = y - RP - 8 - rp * 700
        pinsL.rrect((CX[2] - 75, bar_bot - 44, CX[2] + 75, bar_bot), CREAM, a=0.9, r=8)
        pinsL.rrect((CX[2] - 20, -80, CX[2] + 20, bar_bot - 44 + 2), CREAM, a=0.9, r=6)
    if t >= 6.2:
        u = t - 6.2
        pulse = 0.5 - 0.5 * math.cos(2 * math.pi * 1.4 * u)
        pulse *= clamp01(u / 0.3)
        fx.ring((CX[2], CY), 118 + 10 * pulse, RED, w=4, a=0.35 + 0.65 * pulse)
        fx.ring((CX[2], CY), 134 + 14 * pulse, RED, w=3, a=0.12 + 0.3 * pulse)
    ui.text("INTERFERENCE", F_B, 26, (CX[2], 900), RED, tracking=3, reveal=eo(prog(t, 6.6, 0.5)))
    # --- bracket + SAME GEOMETRY (8.6) ------------------------------------
    bp = eo(prog(t, 8.6, 0.7))
    if bp > 0:
        hw = 460 * bp
        ui.line((540 - hw, 1000), (540 + hw, 1000), CREAM, w=4, a=0.9)
        tp = eo(prog(t, 9.1, 0.3))
        if tp > 0:
            for x in (80, 1000):
                ui.line((x, 1000), (x, 1000 - 22 * tp), CREAM, w=4, a=0.9)
            ui.line((540, 1000), (540, 1000 + 22 * tp), CREAM, w=4, a=0.9)
    ui.text("SAME GEOMETRY", F_XB, 54, (540, 1082), CREAM, tracking=6, reveal=eo(prog(t, 9.2, 0.6)))
    return [frames, bores, pinsL, fx, ui]


SCENES = {
    "mg3": (11.0, mg3),
    "mg4": (6.0, mg4),
    "mg5": (6.0, mg5),
    "mg6": (12.0, mg6),
}


# ------------------------------------------------------------------ render


def render(name):
    T, fn = SCENES[name]
    n = int(round(T * FPS))
    path = os.path.join(OUT, f"{name}.mp4")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    bg = make_bg()
    for i in range(n):
        t = i / FPS
        p.stdin.write(compose(bg, fn(t), t, T).tobytes())
    p.stdin.close()
    p.wait()
    return f"{name}: {n} frames -> {path}"


def still(name, t, out):
    T, fn = SCENES[name]
    compose(make_bg(), fn(float(t)), float(t), T).save(out)
    return out


if __name__ == "__main__":
    args = sys.argv[1:]
    if args and args[0] == "--still":
        print(still(args[1], args[2], args[3]))
        sys.exit(0)
    names = args or list(SCENES)
    with Pool(min(4, len(names))) as pool:
        for line in pool.imap_unordered(render, names):
            print(line, flush=True)
