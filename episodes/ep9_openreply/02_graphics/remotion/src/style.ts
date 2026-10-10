import { staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';

// Henry's scrapbook constants (henry-scrapbook-reel skill): never restyle.
export const C = {
  paper: '#FFFEFA',
  ink: '#171411',
  acc: '#DF825F',
  gold: '#F2C14E',
  rule: '#E4E1DB',
  grey: 'rgba(23,20,17,0.45)',
  soft: 'rgba(23,20,17,0.10)',
};

export const F = { serif: 'Fraunces', hand: 'Kalam', sans: 'InterXB' };

loadFont({ family: 'Fraunces', url: staticFile('fonts/Fraunces-normal-900.woff2'), weight: '900' });
loadFont({ family: 'Kalam', url: staticFile('fonts/Kalam-normal-700.woff2'), weight: '700' });
loadFont({ family: 'InterXB', url: staticFile('fonts/Inter_24pt-ExtraBold.ttf'), weight: '800' });

export const FPS = 30;
export const s2f = (s: number) => Math.round(s * FPS);

export const ruled = 'repeating-linear-gradient(0deg,transparent,transparent 43px,#E4E1DB 44px,transparent 45px)';
export const tornClip =
  'polygon(0% 4%,15% 0%,29% 4%,43% 1%,58% 4%,72% 0%,87% 3%,100% 1%,99% 97%,83% 100%,70% 96%,55% 100%,41% 96%,25% 99%,10% 97%,0% 100%)';
export const shadow = '4px 6px 0 rgba(23,20,17,0.22)';

// Ep7 v9 layout: Henry in a framed card on the bottom half, explainer in the top zone.
// Henry's Reels safe area: graphics inside x 45..1030, y 230..1625, nothing right of x 880 below y 960.
export const ZONE = { left: 50, top: 234, width: 980, height: 500 };
export const CARD = { left: 213, top: 748, width: 654, height: 1144 };
