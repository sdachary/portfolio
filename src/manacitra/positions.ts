import type { Zone } from './types';

export interface WorldPos { x: number; y: number; z: number }

const SPACING = 1.9;
const BLOCK_Y = 0;

export function serviceGridPos(index: number, total: number): { x: number; z: number } {
  const cols = Math.max(1, Math.ceil(Math.sqrt(total)));
  const rows = Math.ceil(total / cols);
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: (col - (cols - 1) / 2) * SPACING,
    z: (row - (rows - 1) / 2) * SPACING,
  };
}

export function serviceBasePos(zone: Zone, index: number, total: number): WorldPos {
  const o = serviceGridPos(index, total);
  return { x: zone.x + o.x, y: BLOCK_Y, z: zone.z + o.z };
}

export function serviceTopPos(zone: Zone, height: number, index: number, total: number): WorldPos {
  const base = serviceBasePos(zone, index, total);
  return { x: base.x, y: base.y + height + 0.05, z: base.z };
}

export function zoneCenterPos(zone: Zone): WorldPos {
  return { x: zone.x, y: 0, z: zone.z };
}

export function zoneCorner(zone: Zone): { x: number; z: number } {
  const half = zone.size / 2;
  return { x: zone.x - half, z: zone.z - half };
}
