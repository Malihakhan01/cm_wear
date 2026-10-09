import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreMode } from "@/types";

interface StoreModeState {
  mode: StoreMode;
  setMode: (mode: StoreMode) => void;
  toggleMode: () => void;
}

export const useStoreModeStore = create<StoreModeState>()(
  persist(
    (set) => ({
      mode: "wholesale", // Default to Wholesale/B2B for primary manufacturing exporter audience
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "wholesale" ? "retail" : "wholesale",
        })),
    }),
    {
      name: "tawfiq-industry-store-mode",
    }
  )
);
