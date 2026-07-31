import * as THREE from 'three';
import type { ReactNode } from 'react';
import { useManacitraStore } from './store';

function healthColor(id: string, health: Record<string, { online: boolean }>): string {
  const h = health[id];
  if (!h) return '#8a8577';
  return h.online ? '#2f6d4f' : '#b5472e';
}

function buildingTop(w: number, h: number, type: string, color: string): ReactNode {
  const mat = <meshStandardMaterial color={color} roughness={0.9} metalness={0} />;
  switch (type) {
    case 'database':
    case 'storage':
    case 'cache': {
      const r = w * 0.3;
      return (
        <>
          <mesh position={[0, h + r * 0.75, 0]} castShadow>
            <cylinderGeometry args={[r, r, r * 1.5, 12]} />
            {mat}
          </mesh>
          <mesh position={[0, h + r * 1.65, 0]} castShadow>
            <cylinderGeometry args={[r * 0.55, r, r * 0.2, 12]} />
            {mat}
          </mesh>
        </>
      );
    }
    case 'ai': {
      const dh = w * 0.75;
      return (
        <mesh position={[0, h + dh / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[w * 1.1, dh, w * 0.18]} />
          {mat}
        </mesh>
      );
    }
    case 'network':
    case 'proxy':
    case 'security': {
      return (
        <>
          <mesh position={[0, h + 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.6, 6]} />
            {mat}
          </mesh>
          <mesh position={[0, h + 0.68, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            {mat}
          </mesh>
        </>
      );
    }
    default:
      return (
        <mesh position={[0, h + 0.06, 0]} castShadow>
          <boxGeometry args={[w * 1.05, 0.1, w * 1.05]} />
          {mat}
        </mesh>
      );
  }
}

export default function Building({ building, index, total }: {
  building: { id: string; name: string; type: string; color: string; h?: number };
  index: number; total: number;
}) {
  const health = useManacitraStore(s => s.data?.health ?? {});
  const selectedId = useManacitraStore(s => s.selectedId);
  const setSelected = useManacitraStore(s => s.setSelected);
  const h = building.h || 1;
  const w = 0.55;
  const sp = 1.6;
  const row = Math.floor(index / 5);
  const col = index % 5;
  const ox = (col - Math.min(total - 1, 4) / 2) * sp;
  const oz = row * 1.6;
  const bc = new THREE.Color(building.color);
  const hl = healthColor(building.id, health);
  const isSelected = selectedId === building.id;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSelected(building.id);
  };

  const geo = new THREE.BoxGeometry(w, h, w);
  const edges = new THREE.EdgesGeometry(geo);

  return (
    <group position={[ox, 0, oz]} userData={{ id: building.id }}>
      <mesh position={[0, h / 2 + 0.05, 0]} castShadow onClick={handleClick}>
        <boxGeometry args={[w, h, w]} />
        <meshStandardMaterial color={bc} roughness={0.9} metalness={0} />
      </mesh>
      {buildingTop(w, h, building.type, bc.getStyle())}
      <lineSegments position={[0, h / 2 + 0.05, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edges.attributes.position.array as Float32Array, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1c1c1a" transparent opacity={0.25} />
      </lineSegments>
      {isSelected && (
        <lineSegments position={[0, h / 2 + 0.05, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[edges.attributes.position.array as Float32Array, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={hl} transparent opacity={0.5} />
        </lineSegments>
      )}
    </group>
  );
}