import React from 'react';
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, Easing } from 'remotion';
import { C, CARD, F, FPS, ZONE, ruled, s2f, shadow, tornClip } from './style';
import { SEGS, TOTAL } from './cutData';
import { BEATS, ReelClaim } from './Explainers';
import { JingleEggs } from './JingleEggs';
import { Tick } from './kit';

const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const DURATION = s2f(TOTAL) + 6;

// ---------- words: fix Whisper's bunched starts by spreading them to the next distinct time ----------
type W = { w: string; t: number; e: number };
const ALL: { id: string; start: number; end: number; words: W[] }[] = SEGS.map((s) => {
  const ws = s.words.map(([w, t, e]) => ({ w, t, e }));
  for (let i = 0; i < ws.length; ) {
    let j = i;
    while (j + 1 < ws.length && Math.abs(ws[j + 1].t - ws[i].t) < 0.02) j++;
    if (j > i) {
      const nextT = j + 1 < ws.length ? ws[j + 1].t : Math.max(ws[j].e, ws[i].t + 0.25 * (j - i + 1));
      const step = (nextT - ws[i].t) / (j - i + 1);
      for (let k = i; k <= j; k++) ws[k].t = ws[i].t + step * (k - i);
    }
    i = j + 1;
  }
  return { id: s.id, start: s.start, end: s.end, words: ws };
});
const seg = (id: string) => ALL.find((s) => s.id === id)!;

// Display fixes for captions (what he actually says)
const FIX: Record<string, string> = { many: 'Many', chat: 'chat', meta: 'Meta', on: "own", neon: 'Neon', take: 'Tick', you: 'you' };
const KEY = new Set(['FREE', 'MANYCHAT', 'CRACKED', 'CRACK', 'CHAT', 'META', 'API', 'NEON', 'REDIS', 'RESEND', 'NETLIFY', 'GITHUB', 'GOOGLE', '750', '30', 'CLAUDE', 'PRIVATE', 'WORKER', 'PUBLISH', 'TESTER', 'GUIDE', 'BANG', 'SCAN', 'DATABASE', 'DASHBOARD', 'PERMISSIONS', 'WORKFLOW', 'REPO', 'LINK', 'ONLINE', '60']);

type Strip = { s: number; e: number; words: string[]; k: number };
const STRIPS: Strip[] = (() => {
  const out: Strip[] = [];
  for (const sg of ALL) {
    if (sg.id === 'HOLD') continue;
    let cur: { w: string; t: number; e: number }[] = [];
    const flush = () => {
      if (!cur.length) return;
      // merge "many chat" -> ManyChat in display
      const words: string[] = [];
      for (let i = 0; i < cur.length; i++) {
        const raw = cur[i].w.replace(/[.,?!]/g, '');
        const nxt = cur[i + 1]?.w.replace(/[.,?!]/g, '').toLowerCase();
        if ((raw.toLowerCase() === 'many' || (sg.id === 'R01' && raw.toLowerCase() === 'you' && i === 0)) && nxt === 'chat') { words.push('ManyChat'); i++; continue; }
        if (raw.toLowerCase() === 'on' && sg.id === 'S00') { words.push("own"); continue; }
        if (raw.toLowerCase() === 'meta') { words.push('Meta'); continue; }
        if (raw.toLowerCase() === 'neon') { words.push('Neon'); continue; }
        if (raw === 'Take') { words.push('Tick'); continue; }
        words.push(raw);
      }
      let k = words.findIndex((x) => KEY.has(x.toUpperCase()));
      out.push({ s: cur[0].t, e: cur[cur.length - 1].e, words, k });
      cur = [];
    };
    for (const w of sg.words) {
      cur.push(w);
      const len = cur.map((x) => x.w).join(' ').length;
      if (/[.,?!]$/.test(w.w) || cur.length >= 3 || len > 16) flush();
    }
    flush();
  }
  // each strip holds until the next one starts (max 0.6 s past its last word)
  for (let i = 0; i < out.length; i++) out[i].e = Math.min(out[i + 1] ? out[i + 1].s : out[i].e + 0.6, out[i].e + 0.6);
  return out;
})();

const Captions: React.FC<{ y: number }> = ({ y }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = STRIPS.findIndex((c) => t >= c.s && t < c.e);
  if (idx < 0) return null;
  const c = STRIPS[idx];
  const local = frame - Math.round(c.s * FPS);
  const sc = interpolate(local, [0, 3], [0.92, 1], CL);
  const chars = c.words.join(' ').length;
  const size = Math.min(60, Math.floor(600 / (chars * 0.62)));
  return (
    <div style={{ position: 'absolute', left: 220, width: 640, top: y, display: 'flex', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.serif, fontWeight: 900, fontSize: size, letterSpacing: 1, lineHeight: 1.1, textTransform: 'uppercase', color: C.ink, background: C.paper, padding: '8px 30px 10px', clipPath: tornClip, filter: 'drop-shadow(4px 5px 0 rgba(23,20,17,0.30))', transform: `rotate(${idx % 2 ? 1 : -1.2}deg) scale(${sc})`, whiteSpace: 'nowrap' }}>
        {c.words.map((w, i) => <span key={i} style={{ color: i === c.k ? C.acc : C.ink }}>{w}{i < c.words.length - 1 ? ' ' : ''}</span>)}
      </div>
    </div>
  );
};

// Beats: which explainer plays over which lines (a beat can span several cut segments)
const GROUPS: { beat: string; ids: string[] }[] = [
  { beat: 'H01', ids: ['H01'] }, { beat: 'H02', ids: ['H02'] }, { beat: 'H03', ids: ['H03'] }, { beat: 'H04', ids: ['H04'] },
  { beat: 'H05', ids: ['H05'] }, { beat: 'HOLD', ids: ['HOLD'] }, { beat: 'H07', ids: ['H07'] }, { beat: 'H08', ids: ['H08'] },
  { beat: 'H09', ids: ['H09'] }, { beat: 'S00', ids: ['S00'] }, { beat: 'S01', ids: ['S01'] }, { beat: 'S02', ids: ['S02'] },
  { beat: 'S03', ids: ['S03'] }, { beat: 'S04', ids: ['S04'] }, { beat: 'S05', ids: ['S05'] }, { beat: 'S06', ids: ['S06'] },
  { beat: 'S07', ids: ['S07'] }, { beat: 'S08b', ids: ['S08a', 'S08b'] }, { beat: 'S09', ids: ['S09'] }, { beat: 'S10', ids: ['S10'] },
  { beat: 'C01', ids: ['C01'] },
];
const OPEN_END = seg('H01').start; // full-frame opener ends when Henry starts talking
const HOLD = seg('HOLD');
const CRACK_T = seg('H07').words.find((w) => w.w.toLowerCase().startsWith('crack'))!.t;

const BeatLayer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {GROUPS.map((g, gi) => {
        const segs = g.ids.map(seg);
        const start = segs[0].start;
        const next = GROUPS[gi + 1] ? seg(GROUPS[gi + 1].ids[0]).start : TOTAL + 0.2;
        const from = s2f(start) - 2; // land 2 frames before the first word
        const dur = s2f(next) - from;
        const words = segs.flatMap((s) => s.words);
        const Beat = BEATS[g.beat];
        if (!Beat) return null;
        const w = (word: string, nth = 0) => {
          const m = words.filter((x) => x.w.toLowerCase().replace(/[.,?!]/g, '') === word.toLowerCase());
          const hit = m[nth] ?? m[0];
          return hit ? s2f(hit.t) - from : 0;
        };
        return (
          <Sequence key={g.beat} from={from} durationInFrames={dur} layout="none">
            <BeatFrame w={w} end={dur} Beat={Beat} />
          </Sequence>
        );
      })}
    </>
  );
};
const BeatFrame: React.FC<{ w: (s: string, n?: number) => number; end: number; Beat: React.FC<any> }> = ({ w, end, Beat }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: ZONE.left, top: ZONE.top, width: ZONE.width, height: ZONE.height }}>
      <Beat f={f} w={w} end={end} />
    </div>
  );
};

// Henry: full frame for the opener, then shrinks into the card.
const Henry: React.FC = () => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [s2f(OPEN_END) - 6, s2f(OPEN_END) + 4], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const L = interpolate(k, [0, 1], [0, CARD.left + 12]);
  const T = interpolate(k, [0, 1], [0, CARD.top + 12]);
  const W = interpolate(k, [0, 1], [1080, CARD.width - 24]);
  const H = interpolate(k, [0, 1], [1920, CARD.height - 24]);
  return (
    <>
      <div style={{ position: 'absolute', left: CARD.left, top: CARD.top, width: CARD.width, height: CARD.height, background: '#fff', borderRadius: 26, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', opacity: k }} />
      <div style={{ position: 'absolute', left: L, top: T, width: W, height: H, borderRadius: 16 * k, overflow: 'hidden' }}>
        <OffthreadVideo src={staticFile('henry_cut.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + 0.12 * k})`, transformOrigin: '50% 30%' }} />
      </div>
    </>
  );
};

const Scoreboard: React.FC = () => {
  const frame = useCurrentFrame();
  const show = interpolate(frame, [s2f(OPEN_END), s2f(OPEN_END) + 8], [0, 1], CL);
  const tickAt = s2f(CRACK_T) - 2;
  const bump = interpolate(frame - tickAt, [0, 6, 14], [1, 1.12, 1], CL);
  const row = (label: string, ticked: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, transform: ticked ? `scale(${bump})` : undefined, transformOrigin: '20% 50%' }}>
      <div style={{ width: 38, height: 38, border: `4px solid ${C.ink}`, borderRadius: 6, background: C.paper, position: 'relative' }}>{ticked ? <Tick f={frame} at={tickAt} x={-6} y={-14} s={50} /> : null}</div>
      <div style={{ fontFamily: F.serif, fontWeight: 900, fontSize: 25, color: C.ink }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 52, top: 770, opacity: show, transform: `rotate(-2deg) scale(${interpolate(show, [0, 1], [0.6, 1])})` }}>
      <div style={{ width: 210, padding: '12px 12px', background: C.paper, clipPath: tornClip, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 9px,#D9D6D1 10px,transparent 11px)', display: 'flex', flexDirection: 'column', gap: 10, filter: 'drop-shadow(4px 5px 0 rgba(23,20,17,0.25))' }}>
        {row('COOKED', false)}
        {row('CRACKED', true)}
      </div>
    </div>
  );
};

// Sound: series sting on the hold, a pop on each stamp word.
const POPS = ['free', 'crack', 'chat', 'guide', 'free'];
export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const inHold = frame >= s2f(HOLD.start) && frame < s2f(HOLD.end);
  const stampTimes: number[] = [];
  const find = (id: string, word: string) => seg(id).words.find((w) => w.w.toLowerCase().replace(/[.,?!]/g, '') === word)?.t;
  [['H01', 'free'], ['H05', 'guide'], ['H08', 'chat'], ['S06', 'free'], ['S09', 'free']].forEach(([id, wd]) => { const t = find(id, wd); if (t) stampTimes.push(t); });
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, backgroundImage: ruled }}>
      <Henry />
      {frame < s2f(OPEN_END) + 2 ? (
        <div style={{ position: 'absolute', left: 60, top: 960, transform: `scale(${interpolate(frame, [0, 8], [0.6, 0.86], CL)})`, opacity: interpolate(frame, [s2f(OPEN_END) - 6, s2f(OPEN_END)], [1, 0], CL), transformOrigin: '0% 100%' }}>
          <ReelClaim f={frame} end={s2f(OPEN_END)} w={(word) => { const m = seg('R01').words.find((x) => x.w.toLowerCase().replace(/[.,?!]/g, '') === word.toLowerCase()); return m ? s2f(m.t) : 0; }} />
        </div>
      ) : null}
      <Scoreboard />
      <BeatLayer />
      {inHold ? (
        <div style={{ position: 'absolute', left: 40, top: 230, width: 1000, height: 400 }}>
          <Sequence from={s2f(HOLD.start)} layout="none"><JingleEggs /></Sequence>
        </div>
      ) : null}
      {frame >= s2f(OPEN_END) - 2 ? <Captions y={1440} /> : <Captions y={1540} />}
      <Sequence from={s2f(HOLD.start)} durationInFrames={s2f(2.6)}><Audio src={staticFile('sfx/sting.wav')} volume={0.8} /></Sequence>
      {stampTimes.map((t, i) => (
        <Sequence key={i} from={s2f(t)} durationInFrames={15}><Audio src={staticFile('sfx/bubble-pop.mp3')} volume={0.22} /></Sequence>
      ))}
      <Sequence from={s2f(CRACK_T)} durationInFrames={15}><Audio src={staticFile('sfx/bubble-pop.mp3')} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};
