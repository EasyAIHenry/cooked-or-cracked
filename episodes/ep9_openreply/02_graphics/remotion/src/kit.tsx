import React from 'react';
import { Easing, interpolate } from 'remotion';
import { C, F, shadow, tornClip } from './style';

const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Pop with overshoot, caused by a word at frame `at`.
export const pop = (f: number, at: number, rot = 0) => {
  const t = f - at;
  return {
    opacity: interpolate(t, [0, 3], [0, 1], CL),
    transform: `rotate(${interpolate(t, [0, 7, 12], [rot * 4, -rot * 0.4, rot], CL)}deg) scale(${interpolate(t, [0, 7, 12], [0.3, 1.08, 1], CL)})`,
  };
};

// Slide in from an offset, ease out.
export const slide = (f: number, at: number, dx = 0, dy = 40, dur = 9) => {
  const t = interpolate(f - at, [0, dur], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return { opacity: Math.min(1, t * 3), transform: `translate(${dx * (1 - t)}px, ${dy * (1 - t)}px)` };
};

export const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });

export const Abs: React.FC<{ x: number; y: number; w?: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...style }}>{children}</div>
);

// Paper cut-out card
export const Card: React.FC<{ x: number; y: number; w: number; h: number; tilt?: number; fill?: string; torn?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, tilt = 0, fill = C.paper, torn, style, children }) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: w, height: h, background: fill,
      border: torn ? undefined : `3px solid ${C.ink}`, borderRadius: torn ? 0 : 14,
      clipPath: torn ? tornClip : undefined, boxShadow: torn ? undefined : shadow,
      filter: torn ? 'drop-shadow(4px 6px 0 rgba(23,20,17,0.22))' : undefined,
      transform: `rotate(${tilt}deg)`, boxSizing: 'border-box', overflow: 'hidden', ...style,
    }}
  >
    {children}
  </div>
);

export const Serif: React.FC<{ size: number; color?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ size, color = C.ink, style, children }) => (
  <div style={{ fontFamily: F.serif, fontWeight: 900, fontSize: size, color, lineHeight: 1, letterSpacing: -1, whiteSpace: 'nowrap', ...style }}>{children}</div>
);
export const Hand: React.FC<{ size: number; color?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ size, color = C.ink, style, children }) => (
  <div style={{ fontFamily: F.hand, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, whiteSpace: 'nowrap', ...style }}>{children}</div>
);
export const Sans: React.FC<{ size: number; color?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ size, color = C.ink, style, children }) => (
  <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: size, color, lineHeight: 1.1, whiteSpace: 'nowrap', ...style }}>{children}</div>
);

// Rubber stamp: accent slab, torn edge, slams in at `at`.
export const Stamp: React.FC<{ f: number; at: number; text: string; x: number; y: number; size?: number; tilt?: number; fill?: string; color?: string }> = ({ f, at, text, x, y, size = 84, tilt = -4, fill = C.acc, color = C.paper }) => {
  const t = f - at;
  const sc = interpolate(t, [0, 5, 10], [2.2, 0.94, 1], CL);
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: interpolate(t, [0, 2], [0, 1], CL), transform: `rotate(${tilt}deg) scale(${sc})`, transformOrigin: '50% 50%' }}>
      <div style={{ background: fill, clipPath: tornClip, padding: `${size * 0.16}px ${size * 0.36}px ${size * 0.2}px`, filter: 'drop-shadow(5px 6px 0 rgba(23,20,17,0.28))' }}>
        <Serif size={size} color={color} style={{ letterSpacing: 1 }}>{text}</Serif>
      </div>
    </div>
  );
};

// Hand-drawn tick / cross / arrow (stroke draws on)
export const Tick: React.FC<{ f: number; at: number; x: number; y: number; s?: number; color?: string }> = ({ f, at, x, y, s = 60, color = C.acc }) => {
  const d = interpolate(f - at, [0, 8], [1, 0], CL);
  return (
    <svg viewBox="0 0 40 40" style={{ position: 'absolute', left: x, top: y, width: s, height: s, overflow: 'visible' }}>
      <path d="M6 22 L16 32 L35 8" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * d} />
    </svg>
  );
};
export const Cross: React.FC<{ f: number; at: number; x: number; y: number; s?: number; color?: string; sw?: number }> = ({ f, at, x, y, s = 60, color = C.acc, sw = 6 }) => {
  const a = interpolate(f - at, [0, 5], [1, 0], CL);
  const b = interpolate(f - at, [4, 9], [1, 0], CL);
  return (
    <svg viewBox="0 0 40 40" style={{ position: 'absolute', left: x, top: y, width: s, height: s, overflow: 'visible' }}>
      <path d="M6 6 L34 34" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={50} strokeDashoffset={50 * a} />
      <path d="M34 6 L6 34" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={50} strokeDashoffset={50 * b} />
    </svg>
  );
};
export const Arrow: React.FC<{ f: number; at: number; d: string; w: number; h: number; x: number; y: number; len?: number; color?: string; dash?: boolean }> = ({ f, at, d, w, h, x, y, len = 400, color = C.ink, dash }) => {
  const p = interpolate(f - at, [0, 10], [1, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? '2 12' : len} strokeDashoffset={dash ? 0 : len * p} opacity={dash ? 1 - p : 1} />
    </svg>
  );
};

// Small tool tile: a paper square with a line icon and a label under it.
export const Tile: React.FC<{ x: number; y: number; s?: number; label?: string; fill?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, s = 120, label, fill = C.paper, children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: s, ...style }}>
    <div style={{ width: s, height: s, background: fill, border: `3px solid ${C.ink}`, borderRadius: 18, boxShadow: shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>{children}</div>
    {label ? <Hand size={30} style={{ textAlign: 'center', marginTop: 8 }}>{label}</Hand> : null}
  </div>
);

// Speech/DM bubble
export const Bubble: React.FC<{ x: number; y: number; text: string; me?: boolean; size?: number; style?: React.CSSProperties }> = ({ x, y, text, me, size = 34, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, background: me ? C.acc : C.paper, color: me ? C.paper : C.ink, border: `3px solid ${C.ink}`, borderRadius: 26, borderBottomLeftRadius: me ? 26 : 6, borderBottomRightRadius: me ? 6 : 26, padding: '12px 22px', boxShadow: shadow, ...style }}>
    <Sans size={size} color={me ? C.paper : C.ink}>{text}</Sans>
  </div>
);
