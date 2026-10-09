import { create } from "zustand";

interface HeaderStore {
  isVisible: boolean;
  isHeroActive: boolean;
  setHeaderVisible: (visible: boolean) => void;
  setIsHeroActive: (active: boolean) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  isVisible: true,
  isHeroActive: true,
  setHeaderVisible: (visible) => set({ isVisible: visible }),
  setIsHeroActive: (active) => set({ isHeroActive: active }),
}));
