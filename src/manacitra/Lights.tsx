import { useMemo } from 'react';
import { useManacitraStore } from './store';

export default function Lights() {
  const hour = useManacitraStore(s => s.hour);
  const isNight = hour < 6 || hour >= 18;

  const sunAngle = useMemo(() => {
    const r = ((hour - 6) / 12) * Math.PI;
    return { x: Math.cos(r) * 24, y: Math.sin(r) * 20 + 2 };
  }, [hour]);

  return (
    <>
      <ambientLight color={isNight ? 0x112244 : 0x223355} intensity={isNight ? 0.3 : 0.6} />
      <directionalLight
        color={isNight ? 0x4466aa : 0xffeedd}
        intensity={isNight ? 0.5 : 2.0}
        position={[sunAngle.x, sunAngle.y, 8]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {isNight && (
        <directionalLight color={0x4488ff} intensity={0.3} position={[0, -4, 12]} />
      )}
    </>
  );
}
