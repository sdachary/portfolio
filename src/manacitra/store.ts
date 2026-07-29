import { create } from 'zustand';
import type { ManacitraData } from './types';

interface ManacitraStore {
  data: ManacitraData | null;
  hoveredId: string | null;
  selectedId: string | null;
  setData: (data: ManacitraData) => void;
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
}

export const useManacitraStore = create<ManacitraStore>(set => ({
  data: null,
  hoveredId: null,
  selectedId: null,
  setData: data => set({ data }),
  setHovered: hoveredId => set({ hoveredId }),
  setSelected: selectedId => set({ selectedId }),
}));
