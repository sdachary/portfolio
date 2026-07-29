import { create } from 'zustand';
import type { ManacitraData } from './types';

interface ManacitraStore {
  data: ManacitraData | null;
  hoveredId: string | null;
  selectedId: string | null;
  hour: number;
  setData: (data: ManacitraData) => void;
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
  setHour: (hour: number) => void;
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
  setData: data => set({ data }),
  setHovered: hoveredId => set({ hoveredId }),
  setSelected: selectedId => set({ selectedId }),
  setHour: hour => set({ hour }),
}));
