import { useGLTF } from '@react-three/drei';

const BASE = '/manacitra/models/';

export interface ModelDef {
  path: string;
  scale: number;
  label: string;
}

export const treeModels: ModelDef[] = [
  { path: 'tree_pineRoundA.glb', scale: 0.8, label: 'pine-round' },
  { path: 'tree_default.glb', scale: 0.7, label: 'default' },
  { path: 'tree_oak.glb', scale: 0.6, label: 'oak' },
  { path: 'tree_small.glb', scale: 0.5, label: 'small' },
  { path: 'tree_tall.glb', scale: 0.6, label: 'tall' },
  { path: 'tree_palm.glb', scale: 0.5, label: 'palm' },
];

export const rockModels: ModelDef[] = [
  { path: 'rock_smallA.glb', scale: 0.4, label: 'rockA' },
  { path: 'rock_smallB.glb', scale: 0.35, label: 'rockB' },
  { path: 'rock_largeA.glb', scale: 0.5, label: 'rockC' },
  { path: 'rock_largeC.glb', scale: 0.45, label: 'rockD' },
];

export const bushModels: ModelDef[] = [
  { path: 'plant_bush.glb', scale: 0.5, label: 'bush' },
  { path: 'plant_bushSmall.glb', scale: 0.4, label: 'bush-sm' },
  { path: 'plant_bushLarge.glb', scale: 0.6, label: 'bush-lg' },
];

export const grassModels: ModelDef[] = [
  { path: 'grass.glb', scale: 0.4, label: 'grass' },
  { path: 'grass_leafs.glb', scale: 0.35, label: 'grass-leaf' },
];

const allModels = [...treeModels, ...rockModels, ...bushModels, ...grassModels];

export function preloadModels() {
  allModels.forEach(m => useGLTF.preload(BASE + m.path));
}

export function modelUrl(def: ModelDef) {
  return BASE + def.path;
}
