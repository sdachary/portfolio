import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 300;

export default function Particles() {
  const meshRef = useRef<THREE.Points>(null!);

  const [positions, sizes, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const siz = new Float32Array(COUNT);
    const spd = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 14;
      pos[i * 3] = Math.cos(ang) * r;
      pos[i * 3 + 1] = Math.random() * 8 - 1;
      pos[i * 3 + 2] = Math.sin(ang) * r;
      siz[i] = 0.02 + Math.random() * 0.04;
      spd[i] = 0.02 + Math.random() * 0.04;
    }
    return [pos, siz, spd];
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);

  useFrame((_, delta) => {
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * delta;
      if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -1;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        color={0x8888cc}
        size={0.04}
        transparent
        opacity={0.25}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
