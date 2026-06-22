import { create } from 'zustand';
import type { Booth, Industry } from '@/types';
import { getIndustries, getBooths } from '@/data/seed';

interface ConfigState {
  industries: Industry[];
  booths: Booth[];
  loadConfig: () => void;
  getIndustryName: (id: string) => string;
  getBoothName: (id: string) => string;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  industries: [],
  booths: [],

  loadConfig: () => {
    set({
      industries: getIndustries(),
      booths: getBooths(),
    });
  },

  getIndustryName: (id: string) => {
    const industry = get().industries.find(i => i.id === id);
    return industry?.name || '未知行业';
  },

  getBoothName: (id: string) => {
    const booth = get().booths.find(b => b.id === id);
    return booth?.name || '未知展位';
  },
}));
