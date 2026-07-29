import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useManacitraStore } from './store';
import { useMemo } from 'react';

export default function Effects() {
  const hour = useManacitraStore(s => s.hour);
  const isNight = hour < 6 || hour >= 18;

  const bloomIntensity = useMemo(() => isNight ? 0.6 : 0.3, [isNight]);

  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={bloomIntensity}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.2}
      />
      <Vignette eskil={false} offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}
