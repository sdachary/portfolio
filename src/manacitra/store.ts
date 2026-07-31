import { create } from 'zustand';
import type { ManacitraData } from './types';

export interface Filters {
  vm: string[];
  status: ('online' | 'offline')[];
  type: string[];
}

export interface VisibleLayers {
  islands: boolean;
  floating: boolean;
  connections: boolean;
  labels: boolean;
}

interface ManacitraStore {
  data: ManacitraData | null;
  selectedId: string | null;
  filters: Filters;
  visibleLayers: VisibleLayers;
  searchQuery: string;
  reducedMotion: boolean;
  highContrast: boolean;
  audioMuted: boolean;
  audioAvailable: boolean;
  resetToken: number;
  setData: (data: ManacitraData) => void;
  setSelected: (id: string | null) => void;
  setFilters: (filters: Filters) => void;
  toggleLayer: (layer: keyof VisibleLayers) => void;
  setSearchQuery: (q: string) => void;
  setReducedMotion: (v: boolean) => void;
  setHighContrast: (v: boolean) => void;
  setAudioAvailable: (v: boolean) => void;
  toggleAudio: () => void;
  resetView: () => void;
}

const ls = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; }
};

export const useManacitraStore = create<ManacitraStore>((set, get) => ({
  data: null,
  selectedId: null,
  filters: { vm: [], status: [], type: [] },
  visibleLayers: { islands: true, floating: true, connections: true, labels: true },
  searchQuery: '',
  reducedMotion: ls('manacitra_reducedMotion', false),
  highContrast: ls('manacitra_highContrast', false),
  audioMuted: ls('manacitra_audioMuted', true),
  audioAvailable: false,
  resetToken: 0,
  setData: data => set({ data }),
  setSelected: selectedId => set({ selectedId }),
  setFilters: filters => set({ filters }),
  toggleLayer: layer => set(s => ({ visibleLayers: { ...s.visibleLayers, [layer]: !s.visibleLayers[layer] } })),
  setSearchQuery: searchQuery => set({ searchQuery }),
  setReducedMotion: v => { localStorage.setItem('manacitra_reducedMotion', JSON.stringify(v)); set({ reducedMotion: v }); },
  setHighContrast: v => { localStorage.setItem('manacitra_highContrast', JSON.stringify(v)); set({ highContrast: v }); },
  setAudioAvailable: v => set({ audioAvailable: v }),
  toggleAudio: () => { const v = !get().audioMuted; localStorage.setItem('manacitra_audioMuted', JSON.stringify(v)); set({ audioMuted: v }); },
  resetView: () => set(s => ({ resetToken: s.resetToken + 1 })),
}));
