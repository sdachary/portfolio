import { create } from 'zustand';
import type { ManacitraData } from './types';

export interface CamTarget {
  x: number; y: number; z: number;
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
  setData: (data: ManacitraData) => void;
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
  setHour: (hour: number) => void;
  flyTo: (pos: CamTarget, target: CamTarget) => void;
  flyHome: () => void;
  finishIntro: () => void;
}

const istHour = () => {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return ist.getHours() + ist.getMinutes() / 60;
};

export const useManacitraStore = create<ManacitraStore>(set => ({
  data: null,
  hoveredId: null,
  selectedId: null,
  hour: istHour(),
  camTarget: null,
  camPos: null,
  isAnimating: false,
  introDone: false,
  setData: data => set({ data }),
  setHovered: hoveredId => set({ hoveredId }),
  setSelected: selectedId => set({ selectedId }),
  setHour: hour => set({ hour }),
  flyTo: (pos, target) => set({ camPos: pos, camTarget: target, isAnimating: true, selectedId: null, introDone: true }),
  flyHome: () => set({ camPos: null, camTarget: null, isAnimating: false, selectedId: null }),
  finishIntro: () => set({ introDone: true }),
}));
