import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Island as IslandType } from './types';
import Building from './Building';
import Scenery from './Scenery';

export default function Island({ island }: { island: IslandType }) {
  const sz = island.size;
  const c = new THREE.Color(island.color);

  return (
    <group position={[island.x, -0.2, island.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[sz, 32]} />
        <meshStandardMaterial color={c} roughness={0.9} metalness={0.1} transparent opacity={0.15} />
      </mesh>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05 + i * 0.02, 0]}>
          <ringGeometry args={[sz * (0.2 + i * 0.18), sz * (0.25 + i * 0.18), 32]} />
          <meshStandardMaterial color={c} roughness={0.6} metalness={0.3} transparent opacity={0.04 + i * 0.015} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <torusGeometry args={[sz + 0.3, 0.06, 8, 48]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15} transparent opacity={0.2} />
      </mesh>
      <Scenery seed={island.x * 100 + island.z * 100} radius={sz} />
      <Html position={[0, 0.15, -sz - 1.5]} center>
        <div style={{ color: '#fff', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textShadow: '0 4px 20px rgba(0,0,0,0.9)', background: 'rgba(4,6,14,0.6)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: 8, border: `1px solid ${island.color}33` }}>
          {island.name}
        </div>
      </Html>
      {island.subtitle && (
        <Html position={[0, -0.35, -sz - 1.5]} center>
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, letterSpacing: '0.05em', textAlign: 'center' }}>
            {island.subtitle}
          </div>
        </Html>
      )}
      {island.buildings.map((b, i) => (
        <Building key={b.id} building={b} index={i} total={island.buildings.length} />
      ))}
    </group>
  );
}
