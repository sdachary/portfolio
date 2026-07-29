import * as THREE from 'three';
import type { Building as BuildingType } from './types';
import { useManacitraStore } from './store';

function healthColor(id: string, health: Record<string, { online: boolean }>): number {
  const h = health[id];
  if (!h) return 0x4466aa;
  return h.online ? 0x22c55e : 0xef4444;
}

export default function Building({ building, index, total }: { building: BuildingType; index: number; total: number }) {
  const health = useManacitraStore(s => s.data?.health ?? {});
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

  return (
    <group position={[ox, 0, oz]} userData={{ id: building.id, name: building.name, type: building.type, desc: building.desc, color: building.color }}>
      <mesh position={[0, h / 2 + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, w]} />
        <meshStandardMaterial color={bc} roughness={0.5} metalness={0.4} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, h + 0.03, 0]}>
        <boxGeometry args={[w * 0.6, 0.08, w * 0.6]} />
        <meshStandardMaterial color={bc.clone().offsetHSL(0, 0, 0.15)} roughness={0.3} metalness={0.6} />
      </mesh>
      {h > 1.5 && (
        <mesh position={[0, h + 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.3, 4]} />
          <meshStandardMaterial color={0x8899bb} metalness={0.8} roughness={0.2} />
        </mesh>
      )}
      {Array.from({ length: nWin }).map((_, i) => {
        const wx = (Math.random() - 0.5) * w * 0.5;
        const wz = (Math.random() - 0.5) * w * 0.5;
        const wy = 0.1 + (i / nWin) * h * 0.85;
        const side = Math.floor(Math.random() * 4);
        const off = w / 2 + 0.005;
        const sides = [
          { pos: [off, wy, wz], look: [1, 0, 0] },
          { pos: [-off, wy, wz], look: [-1, 0, 0] },
          { pos: [wx, wy, off], look: [0, 0, 1] },
          { pos: [wx, wy, -off], look: [0, 0, -1] },
        ];
        return (
          <mesh key={i} position={sides[side].pos as [number, number, number]}>
            <planeGeometry args={[0.07, 0.08]} />
            <meshBasicMaterial color={0xfbbf24} transparent opacity={0.1 + Math.random() * 0.15} />
          </mesh>
        );
      })}
      <mesh position={[0, h + 0.1, 0]}>
        <boxGeometry args={[w * 0.35, 0.04, w * 0.35]} />
        <meshBasicMaterial
          color={hl}
          transparent
          opacity={hl === 0x22c55e ? 0.4 : hl === 0xef4444 ? 0.25 : 0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
