import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { FloatingApp } from './types';
import { useManacitraStore } from './store';

function healthColor(id: string, health: Record<string, { online: boolean }>): string {
  const h = health[id];
  if (!h) return '#8a8577';
  return h.online ? '#2f6d4f' : '#b5472e';
}

export default function FloatingIsland({ app, index, total }: { app: FloatingApp; index: number; total: number }) {
  const health = useManacitraStore(s => s.data?.health ?? {});
  const ang = (index / total) * Math.PI * 2;
  const r = 5.5;
  const x = Math.cos(ang) * r;
  const z = Math.sin(ang) * r;
  const yBase = 3.2 + Math.sin(index * 1.7) * 0.2;
  const c = new THREE.Color(app.color);
  const hl = healthColor(app.id, health);

  return (
    <group position={[x, yBase, z]} rotation={[Math.sin(index * 1.9) * 0.03, 0, Math.sin(index * 2.3) * 0.03]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <circleGeometry args={[0.7, 12]} />
        <meshStandardMaterial color="#faf8f3" roughness={1} metalness={0} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.8, 16]} />
        <meshStandardMaterial color="#1c1c1a" roughness={1} metalness={0} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.175, 0]} castShadow>
        <boxGeometry args={[0.45, 0.35, 0.45]} />
        <meshStandardMaterial color={c} roughness={0.9} metalness={0} />
      </mesh>
      <group position={[0, 0.03, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.08, 12]} />
          <meshBasicMaterial color={hl} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <circleGeometry args={[0.035, 8]} />
          <meshBasicMaterial color={hl} transparent opacity={0.4} />
        </mesh>
      </group>
      <Html position={[0, 0.55, 0]} center>
        <div style={{ color: '#1c1c1a', fontSize: 8, fontWeight: 500, fontFamily: "'IBM Plex Mono','SF Mono',ui-monospace,monospace", letterSpacing: '0.04em', background: 'rgba(247,245,240,0.86)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', border: '1px solid rgba(28,28,26,0.08)' }}>
          {app.name}
        </div>
      </Html>
    </group>
  );
}