import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Service } from './types';
import { logoFor } from './logos';

const texCache = new Map<string, THREE.CanvasTexture>();

export function logoTexture(key: string): THREE.CanvasTexture {
  let tex = texCache.get(key);
  if (tex) return tex;
  const def = logoFor(key);
  const [minX, minY, vw, vh] = def.vb.split(' ').map(Number);
  const size = 128;
  const pad = 6;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = (size - pad * 2) / Math.max(vw, vh);
  ctx.setTransform(scale, 0, 0, scale, (size - vw * scale) / 2 - minX * scale, (size - vh * scale) / 2 - minY * scale);
  const path = new Path2D(def.d);
  ctx.fillStyle = def.color;
  ctx.fill(path);
  tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  texCache.set(key, tex);
  return tex;
}

export default function ServiceBlock({
  service,
  zoneColor,
  position,
  onHover,
  onSelect,
}: {
  service: Service;
  zoneColor: string;
  position: [number, number, number];
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const mesh = useRef<THREE.Mesh>(null!);
  const logo = useMemo(() => logoTexture(service.logo), [service.logo]);
  const h = service.h ?? 1.5;
  const w = 1.1;
  const d = 1.1;

  useFrame(() => {
    const t = hovered ? 1 : 0;
    mesh.current.scale.set(1 + t * 0.06, 1 + t * 0.06, 1 + t * 0.06);
    mesh.current.position.y = position[1] + t * 0.15;
  });

  const handleHover = (v: boolean) => {
    setHovered(v);
    onHover(v ? service.id : null);
  };

  return (
    <group
      position={position}
      onClick={e => {
        e.stopPropagation();
        onSelect(service.id);
      }}
      onPointerOver={e => {
        e.stopPropagation();
        handleHover(true);
        document.body.style.cursor = service.url ? 'pointer' : 'default';
      }}
      onPointerOut={() => {
        handleHover(false);
        document.body.style.cursor = 'default';
      }}
    >
      <mesh ref={mesh} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : '#f1f2f0'}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, h / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.78, 0.78]} />
        <meshBasicMaterial map={logo} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, h / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.41, 0.45, 32]} />
        <meshBasicMaterial color={zoneColor} transparent opacity={hovered ? 0.9 : 0.45} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
