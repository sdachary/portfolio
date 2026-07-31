export interface WorldPos { x: number; y: number; z: number }

const GRID_SPACING = 1.6;
const RING_RADIUS = 5.5;
const ISLAND_Y = -0.2;

export function buildingOffset(index: number, total: number): { x: number; z: number } {
  const row = Math.floor(index / 5);
  const col = index % 5;
  return {
    x: (col - Math.min(total - 1, 4) / 2) * GRID_SPACING,
    z: row * GRID_SPACING,
  };
}

export function buildingBasePos(
  island: { x: number; z: number },
  index: number,
  total: number,
): WorldPos {
  const o = buildingOffset(index, total);
  return { x: island.x + o.x, y: ISLAND_Y, z: island.z + o.z };
}

export function buildingTopPos(
  island: { x: number; z: number },
  height: number,
  index: number,
  total: number,
): WorldPos {
  const base = buildingBasePos(island, index, total);
  return { x: base.x, y: base.y + height + 0.05, z: base.z };
}

export function floatingPos(index: number, total: number): WorldPos {
  const ang = (index / total) * Math.PI * 2;
  return {
    x: Math.cos(ang) * RING_RADIUS,
    y: 3.2 + Math.sin(index * 1.7) * 0.2,
    z: Math.sin(ang) * RING_RADIUS,
  };
}
