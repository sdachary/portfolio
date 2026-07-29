import { useMemo } from 'react';
import * as THREE from 'three';

const n = 2000;
const positions = new Float32Array(n * 3);
const sizes = new Float32Array(n);
for (let i = 0; i < n; i++) {
  const r = 30 + Math.random() * 40;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = Math.abs(r * Math.cos(phi));
  positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  sizes[i] = 0.3 + Math.random() * 0.7;
}

export default function Stars() {
  const ref = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return g;
  }, []);

  return (
    <points geometry={ref}>
      <pointsMaterial
        color={0x8899cc}
        size={0.12}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
