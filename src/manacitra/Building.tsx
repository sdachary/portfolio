import * as THREE from 'three';
import type { Building as BuildingType } from './types';
import { useManacitraStore, type CamTarget } from './store';

function healthColor(id: string, health: Record<string, { online: boolean }>): number {
  const h = health[id];
  if (!h) return 0x4466aa;
  return h.online ? 0x22c55e : 0xef4444;
}

export default function Building({ building, index, total, islandX, islandZ }: { building: BuildingType; index: number; total: number; islandX: number; islandZ: number }) {
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
  const nWin = Math.floor(h * 2.5);
  const isSelected = selectedId === building.id;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSelected(building.id);
    const target: CamTarget = { x: islandX + ox, y: 0.5, z: islandZ + oz };
    const pos: CamTarget = { x: islandX + ox + 4, y: 4, z: islandZ + oz + 4 };
    flyTo(pos, target);
  };

  return (
    <group position={[ox, 0, oz]} userData={{ id: building.id }}>
      <mesh position={[0, h / 2 + 0.05, 0]} castShadow receiveShadow onClick={handleClick}>
        <boxGeometry args={[w, h, w]} />
        <meshStandardMaterial color={bc} roughness={0.25} metalness={0.7} transparent opacity={0.95} envMapIntensity={0.6} />
      </mesh>
      <mesh position={[0, h + 0.03, 0]}>
        <boxGeometry args={[w * 0.6, 0.08, w * 0.6]} />
        <meshStandardMaterial color={bc.clone().offsetHSL(0, 0, 0.2)} roughness={0.2} metalness={0.8} envMapIntensity={0.8} />
      </mesh>
      {h > 1.5 && (
        <mesh position={[0, h + 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.3, 4]} />
          <meshStandardMaterial color={0x8899bb} metalness={0.9} roughness={0.15} envMapIntensity={1.0} />
        </mesh>
      )}
      {Array.from({ length: nWin }).map((_, i) => {
        const wx = (Math.random() - 0.5) * w * 0.5;
        const wz = (Math.random() - 0.5) * w * 0.5;
        const wy = 0.1 + (i / nWin) * h * 0.85;
        const side = Math.floor(Math.random() * 4);
        const off = w / 2 + 0.005;
        const sides = [
          { pos: [off, wy, wz] as [number, number, number] },
          { pos: [-off, wy, wz] as [number, number, number] },
          { pos: [wx, wy, off] as [number, number, number] },
          { pos: [wx, wy, -off] as [number, number, number] },
        ];
        return (
          <mesh key={i} position={sides[side].pos}>
            <planeGeometry args={[0.07, 0.08]} />
            <meshBasicMaterial color={0xfbbf24} transparent opacity={0.15 + Math.random() * 0.2} />
          </mesh>
        );
      })}
      <mesh position={[0, h + 0.1, 0]}>
        <boxGeometry args={[w * 0.35, 0.04, w * 0.35]} />
        <meshBasicMaterial
          color={hl}
          transparent
          opacity={isSelected ? 0.7 : hl === 0x22c55e ? 0.4 : hl === 0xef4444 ? 0.25 : 0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {isSelected && (
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[w + 0.1, h + 0.1, w + 0.1]} />
          <meshBasicMaterial color={hl} transparent opacity={0.08} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
}
