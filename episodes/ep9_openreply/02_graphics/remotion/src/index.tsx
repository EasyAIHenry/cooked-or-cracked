import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Reel, DURATION } from './Reel';

const Root: React.FC = () => (
  <Composition id="Ep9" component={Reel} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
