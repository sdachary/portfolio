import { Suspense } from 'react';
import Lights from './Lights';
import Island from './Island';
import FloatingIsland from './FloatingIsland';
import DiagramOverlay from './DiagramOverlay';
import IsometricCameraRig from './IsometricCameraRig';
import type { ManacitraData } from './types';

export default function Scene({ data }: { data: ManacitraData }) {
  return (
    <>
      <color attach="background" args={[0xf4f5f7]} />
      <DiagramOverlay data={data} />
      <Lights />
      <Suspense fallback={null}>
        {data.islands.map(isl => (
          <Island key={isl.id} island={isl} />
        ))}
        <group>
          {data.floating.map((f, i) => (
            <FloatingIsland key={f.id} app={f} index={i} total={data.floating.length} />
          ))}
        </group>
      </Suspense>
      <IsometricCameraRig />
    </>
  );
}