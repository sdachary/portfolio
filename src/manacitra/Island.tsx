import { Html } from '@react-three/drei';
import type { Island as IslandType } from './types';
import Building from './Building';
import Scenery from './Scenery';

export default function Island({ island }: { island: IslandType }) {
  const sz = island.size;

  return (
    <group position={[island.x, -0.2, island.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[sz, 32]} />
        <meshStandardMaterial color="#faf8f3" roughness={1} metalness={0} transparent opacity={0.4} />
      </mesh>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05 + i * 0.02, 0]}>
          <ringGeometry args={[sz * (0.2 + i * 0.18), sz * (0.25 + i * 0.18), 32]} />
          <meshStandardMaterial color="#1c1c1a" roughness={1} metalness={0} transparent opacity={0.03 + i * 0.01} side={2} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <torusGeometry args={[sz + 0.3, 0.04, 8, 48]} />
        <meshStandardMaterial color="#1c1c1a" transparent opacity={0.1} />
      </mesh>
      <Scenery seed={island.x * 100 + island.z * 100} radius={sz} />
      <Html position={[0, 0.15, -sz - 1.5]} center>
        <div style={{ color: '#1c1c1a', fontSize: 11, fontWeight: 500, fontFamily: "'IBM Plex Mono','SF Mono',ui-monospace,monospace", letterSpacing: '0.06em', background: 'rgba(247,245,240,0.86)', padding: '4px 10px', borderRadius: 4, border: '1px solid rgba(28,28,26,0.10)' }}>
          {island.name}
        </div>
      </Html>
      {island.subtitle && (
        <Html position={[0, -0.35, -sz - 1.5]} center>
          <div style={{ color: 'rgba(28,28,26,0.55)', fontSize: 8, fontFamily: "'IBM Plex Mono','SF Mono',ui-monospace,monospace", letterSpacing: '0.04em', textAlign: 'center' }}>
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