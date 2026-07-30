import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { FloatingApp } from './types';
import { useManacitraStore } from './store';

function healthColor(id: string, health: Record<string, { online: boolean }>): number {
  const h = health[id];
  if (!h) return 0x4466aa;
  return h.online ? 0x22c55e : 0xef4444;
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
        <meshStandardMaterial color={c} roughness={0.4} metalness={0.5} transparent opacity={0.3} envMapIntensity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.8, 16]} />
        <meshStandardMaterial color={c} roughness={0.3} metalness={0.6} transparent opacity={0.15} side={THREE.DoubleSide} envMapIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.175, 0]} castShadow>
        <boxGeometry args={[0.45, 0.35, 0.45]} />
        <meshStandardMaterial color={c} roughness={0.25} metalness={0.7} transparent opacity={0.95} envMapIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <boxGeometry args={[0.225, 0.05, 0.225]} />
        <meshStandardMaterial color={c.clone().offsetHSL(0, 0, 0.2)} roughness={0.2} metalness={0.8} envMapIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[0.15, 0.03, 0.15]} />
        <meshBasicMaterial
          color={hl}
          transparent
          opacity={hl === 0x22c55e ? 0.4 : hl === 0xef4444 ? 0.25 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Html position={[0, 0.55, 0]} center>
        <div style={{ color: '#fff', fontSize: 8, fontWeight: 500, textShadow: '0 2px 12px rgba(0,0,0,0.9)', background: 'rgba(4,6,14,0.6)', backdropFilter: 'blur(6px)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
          {app.name}
        </div>
      </Html>
    </group>
  );
}
