import * as THREE from 'three';
import { Line } from '@react-three/drei';
import type { Island, FloatingApp } from './types';

function findPos(id: string, islands: Island[], floating: FloatingApp[]) {
  for (const isl of islands) {
    for (const b of isl.buildings) {
      if (b.id === id) {
        const ix = isl.buildings.indexOf(b);
        const sp = 1.6;
        const row = Math.floor(ix / 5), col = ix % 5;
        const ox = (col - Math.min(isl.buildings.length - 1, 4) / 2) * sp;
        const oz = row * 1.6;
        return { x: isl.x + ox, y: 0.3, z: isl.z + oz };
      }
    }
  }
  for (const f of floating) {
    if (f.id === id) {
      const idx = floating.indexOf(f);
      const ang = (idx / floating.length) * Math.PI * 2;
      return { x: Math.cos(ang) * 5.5, y: 3.4, z: Math.sin(ang) * 5.5 };
    }
  }
  return null;
}

export default function Connections({ islands, floating, connections }: {
  islands: Island[]; floating: FloatingApp[]; connections: { from: string; to: string; label: string }[];
}) {
  return (
    <group>
      {connections.map((c, i) => {
        const fp = findPos(c.from, islands, floating);
        const tp = findPos(c.to, islands, floating);
        if (!fp || !tp) return null;

        const midX = (fp.x + tp.x) / 2;
        const midZ = (fp.z + tp.z) / 2;
        const dy = Math.abs(tp.y - fp.y);
        const midY = Math.max(fp.y, tp.y) + dy * 0.3 + 0.5;

        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(fp.x, fp.y + 0.1, fp.z),
          new THREE.Vector3(midX, midY, midZ),
          new THREE.Vector3(tp.x, tp.y + 0.1, tp.z),
        );
        const pts = curve.getPoints(40).map(p => [p.x, p.y, p.z] as [number, number, number]);

        return (
          <group key={`${c.from}-${c.to}-${i}`}>
            <Line points={pts} color="#3b82f6" opacity={0.08} transparent />
          </group>
        );
      })}
    </group>
  );
}
