import React from 'react';
import { interpolate, OffthreadVideo, staticFile } from 'remotion';
import { C, F, shadow } from './style';
import { Abs, Arrow, Bubble, Card, Cross, Hand, Sans, Serif, Stamp, Tick, Tile, pop, prog, slide } from './kit';

// Every explainer draws inside the top zone canvas (980x500). `f` = frame since the line started,
// `w(word)` = frame the word is spoken (first match, case-insensitive, punctuation ignored).
export type EP = { f: number; w: (word: string, nth?: number) => number; end: number };
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---------- icons (ink line drawings) ----------
const ChatIcon = ({ s = 70 }) => (
  <svg viewBox="0 0 48 48" width={s} height={s}><path d="M8 10 h32 a4 4 0 0 1 4 4 v16 a4 4 0 0 1 -4 4 H20 l-9 8 v-8 H8 a4 4 0 0 1 -4 -4 V14 a4 4 0 0 1 4 -4 z" fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" /><circle cx="16" cy="22" r="2.6" fill={C.ink} /><circle cx="24" cy="22" r="2.6" fill={C.ink} /><circle cx="32" cy="22" r="2.6" fill={C.ink} /></svg>
);
const Lock = ({ s = 90, open = 0 }) => (
  <svg viewBox="0 0 60 70" width={s} height={s * 70 / 60}><path d={`M16 32 V20 a14 14 0 0 1 28 0 V${32 - open * 14}`} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" transform={`rotate(${-open * 18} 44 32)`} /><rect x="8" y="30" width="44" height="34" rx="6" fill={C.paper} stroke={C.ink} strokeWidth={5} /><circle cx="30" cy="46" r="4" fill={C.ink} /></svg>
);
const Server = ({ s = 150 }) => (
  <svg viewBox="0 0 60 70" width={s} height={s * 70 / 60}>{[0, 1, 2].map((i) => (<g key={i}><rect x="6" y={6 + i * 20} width="48" height="16" rx="3" fill={C.paper} stroke={C.ink} strokeWidth={3} /><circle cx="14" cy={14 + i * 20} r="2.5" fill={C.acc} /><path d={`M24 ${14 + i * 20} h22`} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" /></g>))}</svg>
);
const Envelope = ({ s = 150, open = 0 }) => (
  <svg viewBox="0 0 60 44" width={s} height={s * 44 / 60}><rect x="3" y="8" width="54" height="34" rx="4" fill={C.paper} stroke={C.ink} strokeWidth={3} /><path d={`M3 ${10} L30 ${10 + 18 * (1 - open) - 16 * open} L57 10`} fill={C.paper} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" /></svg>
);
const Spark = ({ s = 80, color = C.acc }) => (
  <svg viewBox="0 0 40 40" width={s} height={s}>{[0, 30, 60, 90, 120, 150].map((r) => <rect key={r} x="18" y="3" width="4" height="34" rx="2" fill={color} transform={`rotate(${r} 20 20)`} />)}</svg>
);
const Phone: React.FC<{ x: number; y: number; w: number; h: number; tilt?: number; children?: React.ReactNode }> = ({ x, y, w, h, tilt = 0, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: C.ink, borderRadius: 34, padding: 10, boxShadow: shadow, transform: `rotate(${tilt}deg)`, boxSizing: 'border-box' }}>
    <div style={{ width: '100%', height: '100%', borderRadius: 26, overflow: 'hidden', background: '#fff', position: 'relative' }}>{children}</div>
  </div>
);
// A white-bordered tilted screen panel holding a proof clip
const Proof: React.FC<{ src: string; x: number; y: number; w: number; h: number; tilt?: number; from?: number; style?: React.CSSProperties }> = ({ src, x, y, w, h, tilt = 0, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: '#fff', padding: 8, border: `3px solid ${C.ink}`, borderRadius: 12, boxShadow: shadow, transform: `rotate(${tilt}deg)`, boxSizing: 'border-box', ...style }}>
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 6 }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 0%' }} />
    </div>
  </div>
);
const PriceTag: React.FC<{ x: number; y: number; text: string; sub?: string; tilt?: number; strike?: number }> = ({ x, y, text, sub, tilt = -6, strike = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${tilt}deg)` }}>
    <div style={{ background: C.gold, border: `3px solid ${C.ink}`, borderRadius: '10px 26px 26px 10px', padding: '10px 26px 12px 40px', boxShadow: shadow, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 12, top: '50%', width: 14, height: 14, marginTop: -7, borderRadius: 7, border: `3px solid ${C.ink}`, background: C.paper }} />
      <Serif size={64}>{text}</Serif>
      {sub ? <Hand size={28}>{sub}</Hand> : null}
      <svg style={{ position: 'absolute', left: -10, top: '42%', width: '110%', height: 24, overflow: 'visible' }} viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 6 L100 3" stroke={C.acc} strokeWidth={7} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - strike)} vectorEffect="non-scaling-stroke" /></svg>
    </div>
  </div>
);
const StepTab: React.FC<{ f: number; n: number }> = ({ f, n }) => (
  <Abs x={760} y={6} style={pop(f, 0, 3)}>
    <div style={{ background: C.ink, borderRadius: 12, padding: '8px 18px', boxShadow: shadow, display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <Sans size={26} color={C.gold}>STEP</Sans><Serif size={56} color={C.paper}>{n}</Serif><Sans size={26} color={C.paper}>/ 8</Sans>
    </div>
  </Abs>
);

// ---------- the beats ----------

// R01 (opener, sits low-left over the full-frame shot): the reel's claim as a phone window.
export const ReelClaim: React.FC<EP> = ({ f, w }) => (
  <>
    <Phone x={0} y={0} w={380} h={560} tilt={-3}>
      <Abs x={0} y={0} w={360} h={540} style={{ background: C.paper }}>
        <Abs x={20} y={24}><Sans size={22} color={C.grey}>this reel says</Sans></Abs>
        <Abs x={22} y={64} style={pop(f, w('60') - 2, -3)}><PriceTag x={0} y={0} text="$60" sub="a month" tilt={-4} /></Abs>
        <Abs x={0} y={0} style={slide(f, w('DM') - 2, -30, 0)}><Bubble x={24} y={250} text="LINK" me size={30} /></Abs>
        <Abs x={0} y={0} style={slide(f, w('link') - 2, 30, 0)}><Bubble x={150} y={340} text="here's my link →" size={24} /></Abs>
        <Abs x={24} y={450} style={slide(f, w('commented') - 2, 0, 20)}><Hand size={34} color={C.acc}>ManyChat does this</Hand></Abs>
      </Abs>
    </Phone>
  </>
);

// H01 "I'm gonna give you guys free ManyChat."
export const FreeManyChat: React.FC<EP> = ({ f, w }) => (
  <>
    <Card x={70} y={70} w={420} h={330} tilt={-2} style={pop(f, 0, -2)}>
      <Abs x={34} y={36} style={{ display: 'flex', alignItems: 'center', gap: 16 }}><ChatIcon s={70} /><Serif size={50}>ManyChat</Serif></Abs>
      <Abs x={34} y={140}><Bubble x={0} y={0} text="CHAT" me size={32} /></Abs>
      <Abs x={170} y={210}><Bubble x={0} y={0} text="sends the link ✓" size={26} /></Abs>
    </Card>
    <Abs x={560} y={90} style={pop(f, 4, 5)}><PriceTag x={0} y={0} text="$60" sub="a month" tilt={6} strike={prog(f, w('free') - 2, w('free') + 8)} /></Abs>
    <Stamp f={f} at={w('free') + 2} text="FREE" x={600} y={300} size={110} tilt={-6} />
  </>
);

// H02 "I have cracked the code itself."
export const CrackedCode: React.FC<EP> = ({ f, w }) => {
  const open = prog(f, w('cracked'), w('cracked') + 8);
  return (
    <>
      <Abs x={140} y={60} style={pop(f, 0, -3)}>
        <div style={{ width: 300, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock s={250} open={open} /></div>
      </Abs>
      <svg viewBox="0 0 300 300" style={{ position: 'absolute', left: 120, top: 40, width: 340, height: 340, opacity: open }}>{[[150, 30, 150, 0], [250, 120, 290, 100], [50, 120, 10, 100], [230, 240, 270, 270], [70, 240, 30, 270]].map((l, i) => <path key={i} d={`M${l[0]} ${l[1]} L${l[2]} ${l[3]}`} stroke={C.gold} strokeWidth={10} strokeLinecap="round" />)}</svg>
      <Abs x={520} y={90} style={slide(f, w('cracked'), 40, 0)}><Serif size={96}>cracked</Serif></Abs>
      <Abs x={520} y={210} style={slide(f, w('code') - 1, 40, 0)}><Serif size={96} color={C.acc}>the code</Serif></Abs>
      <Abs x={524} y={330} style={slide(f, w('itself') - 1, 0, 20)}><Hand size={40}>so you can copy it</Hand></Abs>
    </>
  );
};

// H03 "If you were to download the repo, you're not gonna be able to install everything."
export const RepoStuck: React.FC<EP> = ({ f, w }) => {
  const bar = interpolate(f, [w('install') - 4, w('install') + 10], [0, 0.42], CL);
  return (
    <>
      <Card x={40} y={60} w={430} h={330} tilt={-2} style={pop(f, w('download') - 3, -2)}>
        <Abs x={30} y={28}><Sans size={24} color={C.grey}>free repo</Sans></Abs>
        <Abs x={30} y={64}><Serif size={64}>OpenReply</Serif></Abs>
        <Abs x={30} y={150} style={{ display: 'flex', gap: 10 }}>{['open source', 'self-hosted'].map((t) => <div key={t} style={{ border: `2.5px solid ${C.ink}`, borderRadius: 20, padding: '4px 14px' }}><Sans size={22}>{t}</Sans></div>)}</Abs>
        <Abs x={30} y={220} style={{ display: 'flex', alignItems: 'center', gap: 12, ...slide(f, w('repo') - 2, 0, 20) }}>
          <svg viewBox="0 0 30 30" width={54} height={54}><path d="M15 4 v16 M8 14 l7 7 l7 -7 M6 26 h18" fill="none" stroke={C.acc} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
          <Hand size={38}>download</Hand>
        </Abs>
      </Card>
      <Card x={520} y={110} w={420} h={230} tilt={2} style={pop(f, w('install') - 4, 2)}>
        <Abs x={28} y={26}><Sans size={28}>installing…</Sans></Abs>
        <Abs x={28} y={84} w={360} h={44} style={{ border: `3px solid ${C.ink}`, borderRadius: 22, overflow: 'hidden', background: C.soft }}>
          <div style={{ width: `${bar * 100}%`, height: '100%', background: C.acc }} />
        </Abs>
        <Abs x={28} y={150} style={slide(f, w('everything') - 2, 0, 16)}><Hand size={40} color={C.acc}>no step-by-step</Hand></Abs>
        <Cross f={f} at={w('everything')} x={330} y={24} s={56} />
      </Card>
    </>
  );
};

// H04 "Shout out to him."
export const ShoutOut: React.FC<EP> = ({ f, w }) => (
  <>
    <Card x={40} y={60} w={430} h={330} tilt={-2}>
      <Abs x={30} y={28}><Sans size={24} color={C.grey}>free repo</Sans></Abs>
      <Abs x={30} y={64}><Serif size={64}>OpenReply</Serif></Abs>
      <Abs x={30} y={170}><Hand size={36}>built and shared</Hand><Hand size={36}>for free</Hand></Abs>
    </Card>
    <Abs x={530} y={40} style={pop(f, w('shout') - 2, 6)}>
      <svg viewBox="0 0 40 36" width={260} height={234}><path d="M20 34 C 8 25, 2 18, 2 11 a9 9 0 0 1 18 -3 a9 9 0 0 1 18 3 c0 7 -6 14 -18 23 z" fill={C.acc} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" /></svg>
    </Abs>
    <Abs x={560} y={300} style={slide(f, w('him') - 2, 0, 20)}><Serif size={72}>shout out</Serif></Abs>
  </>
);

// H05 "But what I've done is I have a step-by-step guide."
const STEPS = ['Scan it', 'Private copy', 'Neon', 'Redis', 'Resend', 'Netlify', 'Meta app', 'Worker'];
export const Guide: React.FC<EP> = ({ f, w }) => {
  const at = w('step-by-step') - 4;
  return (
    <>
      <Card x={30} y={14} w={600} h={472} tilt={-1.5} style={pop(f, w('done') - 2, -1.5)} torn>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 47px,#E4E1DB 48px,transparent 49px)' }} />
        <Abs x={34} y={26}><Serif size={44}>My step-by-step</Serif></Abs>
        {STEPS.map((s, i) => (
          <Abs key={s} x={34 + (i >= 4 ? 290 : 0)} y={104 + (i % 4) * 86} style={slide(f, at + i * 3, -20, 0, 7)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Serif size={32} color={C.paper}>{i + 1}</Serif></div>
              <Hand size={32}>{s}</Hand>
            </div>
          </Abs>
        ))}
      </Card>
      <Stamp f={f} at={w('guide') - 1} text="GUIDE" x={660} y={170} size={90} tilt={-5} />
    </>
  );
};

// HOLD: the series sting. The egg title is drawn by JingleEggs; this adds the episode title under it.
export const EpisodeTitle: React.FC<EP> = ({ f }) => (
  <Abs x={180} y={392} style={slide(f, 30, 0, 20)}>
    <div style={{ background: C.ink, padding: '10px 26px', borderRadius: 12, boxShadow: shadow }}><Serif size={48} color={C.paper}>Free ManyChat, step by step</Serif></div>
  </Abs>
);

// H07 "instant crack, bang."
export const InstantCrack: React.FC<EP> = ({ f, w }) => (
  <>
    <Stamp f={f} at={w('crack') - 2} text="CRACKED" x={150} y={140} size={130} tilt={-5} />
    {Array.from({ length: 16 }).map((_, i) => {
      const t = f - w('bang');
      const a = (i / 16) * Math.PI * 2;
      const r = interpolate(t, [0, 14], [40, 330], CL);
      return <div key={i} style={{ position: 'absolute', left: 480 + Math.cos(a) * r * 1.4, top: 240 + Math.sin(a) * r * 0.7, width: 18, height: 30, background: i % 2 ? C.gold : C.acc, transform: `rotate(${i * 37 + t * 9}deg)`, opacity: interpolate(t, [0, 2, 16, 22], [0, 1, 1, 0], CL), borderRadius: 3 }} />;
    })}
  </>
);

// H08 "Comment down below chat and you can have my whole workflow." (his real test plays)
export const CommentChat: React.FC<EP> = ({ f, w }) => (
  <>
    <Proof src="proof_comment.mp4" x={20} y={10} w={410} h={310} tilt={-2} style={pop(f, 0, -2)} />
    <Abs x={40} y={350} style={slide(f, w('comment'), 0, 20)}><Hand size={36}>comment the word</Hand></Abs>
    <Stamp f={f} at={w('chat') - 2} text="CHAT" x={90} y={392} size={70} tilt={-4} />
    <Arrow f={f} at={w('have') - 2} d="M10 40 C 60 0, 110 0, 150 40" w={170} h={70} x={425} y={150} len={220} color={C.acc} />
    <Proof src="proof_dm.mp4" x={580} y={30} w={380} h={300} tilt={2} style={pop(f, w('workflow') - 8, 2)} />
    <Abs x={600} y={350} style={slide(f, w('workflow') - 4, 0, 20)}><Hand size={36}>the DM in 1 second</Hand></Abs>
  </>
);

// H09 "Within 30 minutes, you're gonna get it done."
export const ThirtyMin: React.FC<EP> = ({ f, w }) => {
  const p = prog(f, w('30') - 2, w('minutes') + 12);
  const ang = p * 180; // 30 of 60 minutes
  const rad = (a: number) => ((a - 90) * Math.PI) / 180;
  return (
    <>
      <svg viewBox="0 0 220 220" style={{ position: 'absolute', left: 120, top: 40, width: 420, height: 420 }}>
        <circle cx="110" cy="110" r="96" fill={C.paper} stroke={C.ink} strokeWidth={6} />
        <path d={`M110 110 L110 14 A96 96 0 ${ang > 180 ? 1 : 0} 1 ${110 + 96 * Math.cos(rad(ang))} ${110 + 96 * Math.sin(rad(ang))} Z`} fill={C.acc} opacity={0.85} />
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M110 20 v12" stroke={C.ink} strokeWidth={4} transform={`rotate(${i * 30} 110 110)`} />)}
        <path d={`M110 110 L${110 + 70 * Math.cos(rad(ang))} ${110 + 70 * Math.sin(rad(ang))}`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        <circle cx="110" cy="110" r="8" fill={C.ink} />
      </svg>
      <Abs x={590} y={110} style={pop(f, w('30') - 2, 3)}><Serif size={150}>{Math.round(p * 30)}</Serif></Abs>
      <Abs x={600} y={270} style={slide(f, w('minutes'), 20, 0)}><Serif size={64} color={C.acc}>minutes</Serif></Abs>
      <Tick f={f} at={w('done') - 2} x={840} y={260} s={90} />
    </>
  );
};

// S00 "Will Meta ban you? No, it uses Meta's own API, same as ManyChat."
export const NoBan: React.FC<EP> = ({ f, w }) => {
  const no = w('No');
  return (
    <>
      <Abs x={330} y={20} style={pop(f, 2, -2)}>
        <div style={{ background: C.paper, border: `3px solid ${C.ink}`, borderRadius: 16, padding: '10px 26px', boxShadow: shadow }}><Serif size={70}>BANNED?</Serif></div>
      </Abs>
      <Cross f={f} at={no} x={430} y={0} s={150} sw={7} />
      <Tile x={60} y={250} s={150} label="ManyChat" style={slide(f, w('API') - 8, -40, 0)}><ChatIcon s={88} /></Tile>
      <Tile x={770} y={250} s={150} label="OpenReply" style={slide(f, w('API') - 8, 40, 0)}><Serif size={44}>OR</Serif></Tile>
      <Card x={330} y={250} w={320} h={150} fill={C.ink} style={pop(f, w('API') - 4, 0)}>
        <Abs x={0} y={22} w={320}><Sans size={26} color={C.gold} style={{ textAlign: 'center' }}>Meta's official</Sans></Abs>
        <Abs x={0} y={62} w={320}><Serif size={64} color={C.paper} style={{ textAlign: 'center' }}>API</Serif></Abs>
      </Card>
      <Arrow f={f} at={w('same')} d="M0 20 L110 20" w={120} h={40} x={215} y={305} len={120} color={C.acc} />
      <Arrow f={f} at={w('same') + 2} d="M120 20 L10 20" w={120} h={40} x={655} y={305} len={120} color={C.acc} />
      <Abs x={330} y={420} w={320} style={slide(f, w('same') + 2, 0, 16)}><Hand size={36} color={C.acc} style={{ textAlign: 'center' }}>same door</Hand></Abs>
    </>
  );
};

// S01 "Step one, scan the code that I have for you guys."
export const Scan: React.FC<EP> = ({ f, w }) => {
  const sweep = prog(f, w('scan') - 2, w('scan') + 22);
  return (
    <>
      <StepTab f={f} n={1} />
      <Card x={60} y={60} w={520} h={400} tilt={-1.5} fill="#1B1A19" style={pop(f, 0, -1.5)}>
        {[0.7, 0.5, 0.82, 0.4, 0.66, 0.55, 0.74].map((l, i) => <div key={i} style={{ position: 'absolute', left: 34, top: 40 + i * 48, width: 440 * l, height: 18, borderRadius: 9, background: i === 3 ? (f > w('code') + 6 ? C.acc : '#5C5955') : '#5C5955' }} />)}
        <Abs x={34 + 440 * 0.4 + 16} y={174} style={slide(f, w('code') + 6, 10, 0)}><Hand size={30} color={C.acc}>1 old file</Hand></Abs>
      </Card>
      <Abs x={60 + sweep * 380} y={90 + Math.sin(sweep * 6) * 30} style={{ opacity: sweep > 0 ? 1 : 0 }}>
        <svg viewBox="0 0 60 60" width={170} height={170}><circle cx="24" cy="24" r="17" fill="rgba(255,254,250,0.25)" stroke={C.gold} strokeWidth={5} /><path d="M37 37 L54 54" stroke={C.gold} strokeWidth={7} strokeLinecap="round" /></svg>
      </Abs>
      <Abs x={640} y={140} style={slide(f, w('scan'), 30, 0)}><Serif size={96}>scan</Serif></Abs>
      <Abs x={640} y={260} style={slide(f, w('code') + 10, 30, 0)}><Hand size={44}>1 command fixed it</Hand></Abs>
      <Tick f={f} at={w('guys')} x={860} y={250} s={70} />
    </>
  );
};

// S02 "Step two, make it your own private copy on GitHub."
export const PrivateCopy: React.FC<EP> = ({ f, w }) => {
  const cp = prog(f, w('copy') - 4, w('copy') + 8);
  return (
    <>
      <StepTab f={f} n={2} />
      <Card x={60} y={110} w={340} h={250} tilt={-2} style={pop(f, 0, -2)}>
        <Abs x={26} y={24}><Sans size={22} color={C.grey}>the original</Sans></Abs>
        <Abs x={26} y={60}><Serif size={50}>OpenReply</Serif></Abs>
        <Abs x={26} y={150}><Hand size={34}>public</Hand></Abs>
      </Card>
      <Card x={60 + cp * 440} y={110 + cp * 10} w={340} h={250} tilt={-2 + cp * 4} style={{ opacity: cp > 0 ? 1 : 0, border: `4px solid ${C.acc}` }}>
        <Abs x={26} y={24}><Sans size={22} color={C.acc}>your copy</Sans></Abs>
        <Abs x={26} y={60}><Serif size={50}>OpenReply</Serif></Abs>
        <Abs x={26} y={150} style={{ display: 'flex', alignItems: 'center', gap: 10, ...pop(f, w('private') + 6, 0) }}><Lock s={44} /><Hand size={34}>private</Hand></Abs>
      </Card>
      <Abs x={520} y={392} style={slide(f, w('GitHub') - 2, 0, 16)}><div style={{ background: C.ink, borderRadius: 10, padding: '6px 18px' }}><Sans size={30} color={C.paper}>on GitHub</Sans></div></Abs>
    </>
  );
};

// S03 "Step three, Neon, it's a free database. It remembers every DM, so nobody gets two."
const ROWS = ['@sam', '@lee', '@priya'];
export const Notebook: React.FC<EP> = ({ f, w }) => (
  <>
    <StepTab f={f} n={3} />
    <Abs x={60} y={70} style={pop(f, w('neon') - 3, -2)}>
      <Serif size={92}>Neon</Serif>
      <Hand size={40} color={C.acc} style={{ marginTop: 6 }}>the notebook</Hand>
      <div style={{ marginTop: 18, display: 'inline-block', border: `3px solid ${C.ink}`, borderRadius: 20, padding: '4px 16px', ...pop(f, w('free') - 2, 0) }}><Sans size={26}>free database</Sans></div>
    </Abs>
    <Card x={420} y={84} w={500} h={410} tilt={1.5} style={pop(f, w('remembers') - 4, 1.5)} torn>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 59px,#E4E1DB 60px,transparent 61px)' }} />
      {ROWS.map((r, i) => (
        <Abs key={r} x={40} y={40 + i * 86} style={slide(f, w('every') + i * 4 - 4, -20, 0)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}><Hand size={44}>{r}</Hand><Sans size={26} color={C.grey}>DM sent</Sans></div>
        </Abs>
      ))}
      {ROWS.map((r, i) => <Tick key={r} f={f} at={w('every') + i * 4} x={380} y={38 + i * 86} s={50} />)}
      <Abs x={40} y={300} style={slide(f, w('nobody') - 2, -20, 0)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: 0.55 }}><Hand size={44}>@sam</Hand><Sans size={26} color={C.grey}>again?</Sans></div>
      </Abs>
      <Cross f={f} at={w('two') - 2} x={70} y={288} s={74} />
    </Card>
  </>
);

// S04 "Step four, Redis, a free waiting line. Instagram allows 750 DMs an hour. The rest actually wait for their turn."
export const WaitingLine: React.FC<EP> = ({ f, w }) => {
  const flow = interpolate(f, [w('750') - 2, w('turn') + 10], [0, 1], CL);
  return (
    <>
      <StepTab f={f} n={4} />
      <Abs x={60} y={20} style={pop(f, w('Redis') - 3, -2)}>
        <Serif size={84}>Redis</Serif>
        <Hand size={40} color={C.acc}>the waiting line</Hand>
      </Abs>
      {/* the gate */}
      <Abs x={640} y={170} style={pop(f, w('Instagram') - 2, 0)}>
        <div style={{ width: 120, height: 230, border: `5px solid ${C.ink}`, borderBottom: 'none', borderRadius: '60px 60px 0 0', background: C.soft }} />
      </Abs>
      <Abs x={560} y={60} style={pop(f, w('750') - 2, 3)}>
        <div style={{ background: C.ink, borderRadius: 14, padding: '8px 18px', boxShadow: shadow }}><Serif size={56} color={C.gold}>750</Serif><Sans size={22} color={C.paper}>DMs an hour</Sans></div>
      </Abs>
      {/* the line of DMs */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 70 + i * 66 + flow * 260;
        const through = x > 680;
        return (
          <div key={i} style={{ position: 'absolute', left: through ? 680 + (x - 680) * 1.6 : x, top: 300 - (through ? (x - 680) * 0.6 : 0), opacity: interpolate(f, [w('Instagram') + i * 2, w('Instagram') + i * 2 + 4], [0, 1], CL) * (x > 920 ? 0 : 1) }}>
            <div style={{ width: 52, height: 40, borderRadius: 12, background: through ? C.acc : C.paper, border: `3px solid ${C.ink}` }} />
          </div>
        );
      })}
      <Abs x={70} y={392} style={slide(f, w('wait') - 2, 0, 16)}><Hand size={42}>the rest wait their turn</Hand></Abs>
      <Abs x={0} y={0} style={{ opacity: 0 }}>{w('rest')}</Abs>
    </>
  );
};

// S05 "Step five, Resend, it emails you a login link."
export const LoginEmail: React.FC<EP> = ({ f, w }) => {
  const open = prog(f, w('login') - 2, w('login') + 8);
  return (
    <>
      <StepTab f={f} n={5} />
      <Abs x={60} y={60} style={pop(f, w('Resend') - 3, -2)}>
        <Serif size={84}>Resend</Serif>
        <Hand size={40} color={C.acc}>the login email</Hand>
      </Abs>
      <Abs x={110 + prog(f, w('emails') - 4, w('emails') + 8) * 330} y={250} style={{ opacity: prog(f, w('emails') - 6, w('emails') - 2) }}><Envelope s={200} open={open} /></Abs>
      <Abs x={560} y={160} style={pop(f, w('link') - 2, 2)}>
        <div style={{ background: C.ink, borderRadius: 40, padding: '18px 40px', boxShadow: shadow }}><Serif size={56} color={C.paper}>Log in →</Serif></div>
      </Abs>
      <Abs x={580} y={300} style={slide(f, w('link') + 6, 0, 16)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Hand size={40}>no password</Hand></div>
      </Abs>
    </>
  );
};

// S06 "Step six, Netlify, it puts your dashboard online for free."
export const Online: React.FC<EP> = ({ f, w }) => {
  const url = 'yourname.netlify.app';
  const n = Math.round(interpolate(f, [w('online') - 6, w('online') + 14], [0, url.length], CL));
  return (
    <>
      <StepTab f={f} n={6} />
      <Abs x={60} y={50} style={pop(f, w('Netlify') - 3, -2)}>
        <Serif size={84}>Netlify</Serif>
        <Hand size={40} color={C.acc}>puts it online</Hand>
      </Abs>
      <Card x={440} y={60} w={500} h={380} tilt={1.5} style={pop(f, w('dashboard') - 4, 1.5)}>
        <div style={{ height: 56, background: C.soft, borderBottom: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: C.ink, opacity: 0.4 }} />)}
          <div style={{ marginLeft: 10, background: C.paper, border: `2px solid ${C.ink}`, borderRadius: 14, padding: '2px 14px', flex: 1 }}><Sans size={22}>{url.slice(0, n)}</Sans></div>
        </div>
        <Abs x={26} y={84}><Sans size={26}>Campaigns</Sans></Abs>
        {[0.8, 0.55, 0.9].map((l, i) => <div key={i} style={{ position: 'absolute', left: 26, top: 140 + i * 66, width: 440 * l * prog(f, w('dashboard') + i * 3, w('dashboard') + i * 3 + 10), height: 40, borderRadius: 10, background: i === 1 ? C.acc : C.ink, opacity: i === 1 ? 1 : 0.8 }} />)}
      </Card>
      <Stamp f={f} at={w('free') - 2} text="FREE" x={40} y={300} size={80} tilt={-6} />
    </>
  );
};

// S07 "Step seven, the Meta app, everything connects to it. Tick all four permissions, you add yourself as a tester, and then publish."
const NODES: [string, number, number][] = [['Neon', 40, 30], ['Redis', 40, 330], ['Resend', 300, 380], ['Netlify', 300, -10], ['Google', 40, 180]];
export const MetaHub: React.FC<EP> = ({ f, w }) => {
  const at = w('everything') - 4;
  const items: [string, string][] = [['4 permissions', 'permissions'], ['you as tester', 'tester'], ['publish', 'publish']];
  return (
    <>
      <StepTab f={f} n={7} />
      <svg viewBox="0 0 980 500" style={{ position: 'absolute', left: 0, top: 0, width: 980, height: 500 }}>
        {NODES.map(([n, x, y], i) => <path key={n} d={`M${x + 70} ${y + 50} L 390 250`} stroke={C.acc} strokeWidth={4} strokeDasharray="600" strokeDashoffset={600 * (1 - prog(f, at + i * 3, at + i * 3 + 9))} />)}
      </svg>
      {NODES.map(([n, x, y], i) => (
        <Abs key={n} x={x} y={y} style={pop(f, at + i * 3 - 3, 0)}>
          <div style={{ background: C.paper, border: `3px solid ${C.ink}`, borderRadius: 14, padding: '10px 18px', boxShadow: shadow }}><Sans size={28}>{n}</Sans></div>
        </Abs>
      ))}
      <Card x={270} y={170} w={240} h={160} fill={C.ink} style={pop(f, w('Meta') - 3, 0)}>
        <Abs x={0} y={26} w={240}><Sans size={26} color={C.gold} style={{ textAlign: 'center' }}>the key</Sans></Abs>
        <Abs x={0} y={64} w={240}><Serif size={50} color={C.paper} style={{ textAlign: 'center' }}>Meta app</Serif></Abs>
      </Card>
      <Card x={560} y={80} w={390} h={340} tilt={1.5} style={pop(f, w('Take') - 4, 1.5)} torn>
        {items.map(([t, k], i) => (
          <Abs key={t} x={36} y={50 + i * 92}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, border: `4px solid ${C.ink}`, borderRadius: 8, position: 'relative' }}><Tick f={f} at={w(k) - 1} x={-4} y={-14} s={58} /></div>
              <Hand size={40}>{t}</Hand>
            </div>
          </Abs>
        ))}
      </Card>
    </>
  );
};

// S08 "Step eight, the worker. So we put the worker on a free Google server, it sends the DM for you every day."
export const Worker: React.FC<EP> = ({ f, w }) => (
  <>
    <StepTab f={f} n={8} />
    <Abs x={60} y={40} style={pop(f, w('worker') - 3, -2)}>
      <Serif size={84}>Worker</Serif>
      <Hand size={40} color={C.acc}>sends the DMs</Hand>
    </Abs>
    <Abs x={120} y={230} style={pop(f, w('Google') - 3, 0)}>
      <Server s={180} />
    </Abs>
    <Abs x={330} y={330} style={slide(f, w('Google'), 20, 0)}>
      <div style={{ background: C.ink, borderRadius: 10, padding: '6px 16px' }}><Sans size={28} color={C.paper}>Google Cloud · free</Sans></div>
    </Abs>
    {[0, 1, 2].map((i) => {
      const t = prog(f, w('sends') + i * 5, w('sends') + i * 5 + 14);
      return <div key={i} style={{ position: 'absolute', left: 330 + t * (360 + i * 40), top: 250 - t * (60 - i * 40), opacity: t > 0 ? 1 : 0 }}><Bubble x={0} y={0} text="DM" me size={26} /></div>;
    })}
    <Abs x={720} y={340} style={pop(f, w('every') - 2, 3)}>
      <div style={{ background: C.gold, border: `3px solid ${C.ink}`, borderRadius: 14, padding: '6px 18px', boxShadow: shadow }}><Serif size={54}>24/7</Serif></div>
    </Abs>
    <Abs x={600} y={440} style={slide(f, w('day') - 2, 0, 10)}><Hand size={34}>laptop can be off</Hand></Abs>
  </>
);

// S09 "What's crazy is that all these steps above are free."
const TAGS = ['Scan', 'GitHub', 'Neon', 'Redis', 'Resend', 'Netlify', 'Meta', 'Google'];
export const AllFree: React.FC<EP> = ({ f, w }) => (
  <>
    {TAGS.map((t, i) => (
      <Abs key={t} x={40 + (i % 4) * 232} y={30 + Math.floor(i / 4) * 170} style={pop(f, w('steps') - 8 + i * 2, i % 2 ? 3 : -3)}>
        <div style={{ background: C.paper, border: `3px solid ${C.ink}`, borderRadius: 14, padding: '10px 18px', boxShadow: shadow, width: 196, boxSizing: 'border-box' }}>
          <Sans size={26} color={C.grey}>{t}</Sans>
          <Serif size={58}>$0</Serif>
        </div>
      </Abs>
    ))}
    <Stamp f={f} at={w('free') - 2} text="ALL FREE" x={250} y={360} size={92} tilt={-4} />
  </>
);

// S10 "You just need to have Claude."
export const NeedClaude: React.FC<EP> = ({ f, w }) => (
  <>
    <Tile x={330} y={60} s={200} style={pop(f, w('Claude') - 3, -3)}><Spark s={130} /></Tile>
    <Abs x={580} y={110} style={slide(f, w('Claude'), 20, 0)}><Serif size={80}>+ Claude</Serif></Abs>
    <Abs x={584} y={220} style={slide(f, w('Claude') + 4, 20, 0)}><Hand size={36} color={C.acc}>to set it up (paid plan)</Hand></Abs>
  </>
);

// C01 "Comment chat and I'll send you my guide."
export const Cta: React.FC<EP> = ({ f, w }) => (
  <>
    <Stamp f={f} at={0} text="CHAT" x={90} y={70} size={170} tilt={-5} />
    <Abs x={150} y={330} style={slide(f, 4, 0, 16)}><Hand size={44}>comment it</Hand></Abs>
    <Arrow f={f} at={w('send') - 2} d="M10 50 C 70 0, 140 0, 190 50" w={210} h={80} x={450} y={160} len={260} color={C.acc} />
    <Card x={680} y={70} w={260} h={340} tilt={3} style={pop(f, w('guide') - 4, 3)} torn>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 39px,#E4E1DB 40px,transparent 41px)' }} />
      <Abs x={26} y={30}><Serif size={44}>My guide</Serif></Abs>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: 'absolute', left: 26, top: 110 + i * 40, width: 160 - (i % 2) * 40, height: 12, borderRadius: 6, background: i === 0 ? C.acc : C.ink, opacity: 0.8 }} />)}
    </Card>
  </>
);

export const BEATS: Record<string, React.FC<EP>> = {
  H01: FreeManyChat, H02: CrackedCode, H03: RepoStuck, H04: ShoutOut, H05: Guide, HOLD: EpisodeTitle,
  H07: InstantCrack, H08: CommentChat, H09: ThirtyMin, S00: NoBan, S01: Scan, S02: PrivateCopy, S03: Notebook,
  S04: WaitingLine, S05: LoginEmail, S06: Online, S07: MetaHub, S08b: Worker, S09: AllFree, S10: NeedClaude, C01: Cta,
};
