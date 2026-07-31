import * as THREE from 'three';
import type { FloatingApp } from './types';
import { useManacitraStore } from './store';

function healthColor(id: string, health: Record<string, { online: boolean }>): string {
  const h = health[id];
  if (!h) return '#8a8577';
  return h.online ? '#2f6d4f' : '#b5472e';
}

export default function FloatingIsland({ app, index, total }: { app: FloatingApp; index: number; total: number }) {
  const health = useManacitraStore(s => s.data?.health ?? {});
  const selectedId = useManacitraStore(s => s.selectedId);
  const setSelected = useManacitraStore(s => s.setSelected);
  const ang = (index / total) * Math.PI * 2;
  const r = 5.5;
  const x = Math.cos(ang) * r;
  const z = Math.sin(ang) * r;
  const yBase = 3.2 + Math.sin(index * 1.7) * 0.2;
  const c = new THREE.Color(app.color);
  const hl = healthColor(app.id, health);
  const isSelected = selectedId === app.id;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSelected(app.id);
  };

  return (
    <group position={[x, yBase, z]} rotation={[Math.sin(index * 1.9) * 0.03, 0, Math.sin(index * 2.3) * 0.03]} onClick={handleClick}>
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
      <mesh position={[0, 0.39, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color={c} roughness={0.9} metalness={0} />
      </mesh>
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <ringGeometry args={[0.55, 0.85, 16]} />
          <meshBasicMaterial color={hl} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}