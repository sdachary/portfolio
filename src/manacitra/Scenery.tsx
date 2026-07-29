import { useGLTF, Clone } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { treeModels, rockModels, bushModels, modelUrl } from './models';

function seededRand(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

interface Item { scene: THREE.Group; x: number; z: number; rot: number; scale: number; }

function useScenes() {
  const t0 = useGLTF(modelUrl(treeModels[0]));
  const t1 = useGLTF(modelUrl(treeModels[1]));
  const t2 = useGLTF(modelUrl(treeModels[2]));
  const t3 = useGLTF(modelUrl(treeModels[3]));
  const t4 = useGLTF(modelUrl(treeModels[4]));
  const t5 = useGLTF(modelUrl(treeModels[5]));
  const r0 = useGLTF(modelUrl(rockModels[0]));
  const r1 = useGLTF(modelUrl(rockModels[1]));
  const r2 = useGLTF(modelUrl(rockModels[2]));
  const r3 = useGLTF(modelUrl(rockModels[3]));
  const b0 = useGLTF(modelUrl(bushModels[0]));
  const b1 = useGLTF(modelUrl(bushModels[1]));
  const b2 = useGLTF(modelUrl(bushModels[2]));
  return useMemo(() => ({
    trees: [t0.scene, t1.scene, t2.scene, t3.scene, t4.scene, t5.scene],
    rocks: [r0.scene, r1.scene, r2.scene, r3.scene],
    bushes: [b0.scene, b1.scene, b2.scene],
  }), []);
}

export default function Scenery({ seed, radius }: { seed: number; radius: number }) {
  const scenes = useScenes();

  const items = useMemo(() => {
    const rand = seededRand(seed);
    const out: Item[] = [];
    for (let i = 0; i < 5; i++) {
      const scene = scenes.trees[Math.floor(rand() * scenes.trees.length)];
      const ang = rand() * Math.PI * 2;
      const dist = radius * 0.2 + rand() * radius * 0.6;
      out.push({ scene, x: Math.cos(ang) * dist, z: Math.sin(ang) * dist, rot: rand() * Math.PI * 2, scale: 0.3 + rand() * 0.35 });
    }
    for (let i = 0; i < 3; i++) {
      const scene = scenes.rocks[Math.floor(rand() * scenes.rocks.length)];
      const ang = rand() * Math.PI * 2;
      const dist = radius * 0.1 + rand() * radius * 0.4;
      out.push({ scene, x: Math.cos(ang) * dist, z: Math.sin(ang) * dist, rot: rand() * Math.PI * 2, scale: 0.3 + rand() * 0.3 });
    }
    for (let i = 0; i < 2; i++) {
      const scene = scenes.bushes[Math.floor(rand() * scenes.bushes.length)];
      const ang = rand() * Math.PI * 2;
      const dist = radius * 0.1 + rand() * radius * 0.3;
      out.push({ scene, x: Math.cos(ang) * dist, z: Math.sin(ang) * dist, rot: rand() * Math.PI * 2, scale: 0.3 + rand() * 0.3 });
    }
    return out;
  }, [seed, radius, scenes]);

  return (
    <group position={[0, -0.05, 0]}>
      {items.map((it, i) => (
        <Clone key={i} object={it.scene} position={[it.x, 0, it.z]} rotation={[0, it.rot, 0]} scale={it.scale} castShadow />
      ))}
    </group>
  );
}
