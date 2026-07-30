import { create } from 'zustand';
import type { ManacitraData } from './types';

export interface CamTarget {
  x: number; y: number; z: number;
}

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
  hoveredId: string | null;
  selectedId: string | null;
  hour: number;
  camTarget: CamTarget | null;
  camPos: CamTarget | null;
  isAnimating: boolean;
  introDone: boolean;
  viewMode: 'isometric' | 'inspecting';
  filters: Filters;
  visibleLayers: VisibleLayers;
  searchQuery: string;
  timelineIndex: number | null;
  reducedMotion: boolean;
  highContrast: boolean;
  audioMuted: boolean;
  audioAvailable: boolean;
  setData: (data: ManacitraData) => void;
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
  setHour: (hour: number) => void;
  flyTo: (pos: CamTarget, target: CamTarget) => void;
  flyHome: () => void;
  finishIntro: () => void;
  setFilters: (filters: Filters) => void;
  toggleLayer: (layer: keyof VisibleLayers) => void;
  setSearchQuery: (q: string) => void;
  setTimelineIndex: (idx: number | null) => void;
  setReducedMotion: (v: boolean) => void;
  setHighContrast: (v: boolean) => void;
  setAudioAvailable: (v: boolean) => void;
  toggleAudio: () => void;
}

const ls = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; }
};

const istHour = () => {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return ist.getHours() + ist.getMinutes() / 60;
};

export const useManacitraStore = create<ManacitraStore>((set, get) => ({
  data: null,
  hoveredId: null,
  selectedId: null,
  hour: istHour(),
  camTarget: null,
  camPos: null,
  isAnimating: false,
  introDone: false,
  viewMode: 'isometric',
  filters: { vm: [], status: [], type: [] },
  visibleLayers: { islands: true, floating: true, connections: true, labels: true },
  searchQuery: '',
  timelineIndex: null,
  reducedMotion: ls('manacitra_reducedMotion', false),
  highContrast: ls('manacitra_highContrast', false),
  audioMuted: ls('manacitra_audioMuted', true),
  audioAvailable: false,
  setData: data => set({ data }),
  setHovered: hoveredId => set({ hoveredId }),
  setSelected: selectedId => set({ selectedId }),
  setHour: hour => set({ hour }),
  flyTo: (pos, target) => set({ camPos: pos, camTarget: target, isAnimating: true, selectedId: null, introDone: true, viewMode: 'inspecting' }),
  flyHome: () => set({ camPos: null, camTarget: null, isAnimating: false, selectedId: null, viewMode: 'isometric' }),
  finishIntro: () => set({ introDone: true }),
  setFilters: filters => set({ filters }),
  toggleLayer: layer => set(s => ({ visibleLayers: { ...s.visibleLayers, [layer]: !s.visibleLayers[layer] } })),
  setSearchQuery: searchQuery => set({ searchQuery }),
  setTimelineIndex: timelineIndex => set({ timelineIndex }),
  setReducedMotion: v => { localStorage.setItem('manacitra_reducedMotion', JSON.stringify(v)); set({ reducedMotion: v }); },
  setHighContrast: v => { localStorage.setItem('manacitra_highContrast', JSON.stringify(v)); set({ highContrast: v }); },
  setAudioAvailable: v => set({ audioAvailable: v }),
  toggleAudio: () => { const v = !get().audioMuted; localStorage.setItem('manacitra_audioMuted', JSON.stringify(v)); set({ audioMuted: v }); },
}));
