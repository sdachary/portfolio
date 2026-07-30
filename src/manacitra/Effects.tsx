import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.1} luminanceThreshold={0.6} luminanceSmoothing={0.3} />
    </EffectComposer>
  );
}
