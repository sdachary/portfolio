export interface HealthEntry {
  online: boolean;
  checked_at: string;
}

export interface Building {
  id: string;
  name: string;
  type: string;
  h: number;
  color: string;
  desc: string;
}

export interface Island {
  id: string;
  name: string;
  label: string;
  subtitle: string;
  x: number;
  z: number;
  color: string;
  size: number;
  buildings: Building[];
}

export interface FloatingApp {
  id: string;
  name: string;
  type: string;
  color: string;
  url: string;
  desc: string;
}

export interface Connection {
  from: string;
  to: string;
  label: string;
}

export interface Stats {
  total_services: number;
  online: number;
  islands: number;
  floating: number;
  connections: number;
  total: number;
}

export interface ManacitraData {
  islands: Island[];
  floating: FloatingApp[];
  connections: Connection[];
  health: Record<string, HealthEntry>;
  stats: Stats;
  generated_at: string;
}
