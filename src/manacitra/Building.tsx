import * as THREE from 'three';
import { useManacitraStore, type CamTarget } from './store';

function healthColor(id: string, health: Record<string, { online: boolean }>): string {
  const h = health[id];
  if (!h) return '#8a8577';
  return h.online ? '#2f6d4f' : '#b5472e';
}

export default function Building({ building, index, total, islandX, islandZ }: {
  building: { id: string; name: string; color: string; h?: number };
  index: number; total: number; islandX: number; islandZ: number;
}) {
  const health = useManacitraStore(s => s.data?.health ?? {});
  const selectedId = useManacitraStore(s => s.selectedId);
  const setSelected = useManacitraStore(s => s.setSelected);
  const flyTo = useManacitraStore(s => s.flyTo);
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
    const target: CamTarget = { x: islandX + ox, y: 0.5, z: islandZ + oz };
    const pos: CamTarget = { x: islandX + ox + 4, y: 4, z: islandZ + oz + 4 };
    flyTo(pos, target);
  };

  const geo = new THREE.BoxGeometry(w, h, w);
  const edges = new THREE.EdgesGeometry(geo);

  return (
    <group position={[ox, 0, oz]} userData={{ id: building.id }}>
      <mesh position={[0, h / 2 + 0.05, 0]} castShadow onClick={handleClick}>
        <boxGeometry args={[w, h, w]} />
        <meshStandardMaterial color={bc} roughness={0.9} metalness={0} />
      </mesh>
      <lineSegments position={[0, h / 2 + 0.05, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edges.attributes.position.array as Float32Array, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1c1c1a" transparent opacity={0.25} />
      </lineSegments>
      <group position={[0, 0.05, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.08, 12]} />
          <meshBasicMaterial color={hl} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <circleGeometry args={[0.035, 8]} />
          <meshBasicMaterial color={hl} transparent opacity={0.4} />
        </mesh>
      </group>
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