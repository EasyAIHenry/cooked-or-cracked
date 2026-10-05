// @ts-nocheck
import React from 'react';
import { Composition, registerRoot, AbsoluteFill, staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
import MG from './MG';
loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-normal-900.woff2'), weight: '900' });
loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-normal-900.woff2'), weight: '700' });
loadFont({ family: 'Kalam', url: staticFile('fonts/Kalam-normal-700.woff2'), weight: '700' });
loadFont({ family: 'Kalam', url: staticFile('fonts/Kalam-normal-700.woff2'), weight: '400' });
for (const w of ['400','500','600','700','800','900']) loadFont({ family: 'Inter', url: staticFile('fonts/Inter_24pt-ExtraBold.ttf'), weight: w });
const PROPS = {"serif": "Fraunces", "hand": "Kalam", "sans": "Inter", "paper": "#FFFEFA", "ink": "#171411", "accent": "#DF825F", "gold": "#F2C14E"};
const PAPER = { backgroundColor: '#FFFEFA', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,#E4E1DC 40px,transparent 41px)' };
const Solo = () => <AbsoluteFill style={PAPER}><MG item={{ props: PROPS }} /></AbsoluteFill>;
const Context = () => (
  <AbsoluteFill style={PAPER}>
    <div style={{ position: 'absolute', left: 213, top: 748, width: 654, height: 1144, background: '#fff', borderRadius: 26, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }} />
    <div style={{ position: 'absolute', left: 225, top: 760, width: 630, height: 1120, borderRadius: 16, background: 'linear-gradient(#8a8f8c,#3d4a5e)' }}>
      <div style={{ position: 'absolute', left: 215, top: 120, width: 200, height: 260, borderRadius: 100, background: '#c9a48a' }} />
      <div style={{ position: 'absolute', left: 20, top: 670, width: 590, height: 120, borderRadius: 12, background: '#FFFEFA', color: '#171411', fontFamily: 'Fraunces', fontWeight: 900, fontSize: 52, textAlign: 'center', lineHeight: '120px' }}>caption here</div>
    </div>
    <div style={{ position: 'absolute', left: 70, top: 735, width: 300, height: 265, color: '#171411', fontFamily: 'Fraunces', fontWeight: 900, fontSize: 30 }}>[ ] COOKED<br/>[ ] CRACKED</div>
    <div style={{ position: 'absolute', left: 130, top: 236, width: 820, height: 420 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 820, height: 420, transform: 'scale(1.000000, 1.000000)', transformOrigin: '0 0' }}><MG item={{ props: PROPS }} /></div>
    </div>
    <div style={{ position: 'absolute', left: 45, top: 230, width: 985, height: 1395, border: '3px dashed rgba(255,0,0,0.35)' }} />
  </AbsoluteFill>
);
const Root = () => (<>
  <Composition id="Solo" component={Solo} durationInFrames={77} fps={30} width={820} height={420} />
  <Composition id="Context" component={Context} durationInFrames={77} fps={30} width={1080} height={1920} />
</>);
registerRoot(Root);
