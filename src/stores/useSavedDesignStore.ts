import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SavedDesign } from "@/types";

interface SavedDesignState {
  designs: SavedDesign[];
  saveDesign: (design: SavedDesign) => void;
  removeDesign: (id: string) => void;
  getDesign: (id: string) => SavedDesign | undefined;
  clearDesigns: () => void;
}

export const useSavedDesignStore = create<SavedDesignState>()(
  persist(
    (set, get) => ({
      designs: [],
      saveDesign: (design) => {
        set((state) => {
          const index = state.designs.findIndex((d) => d.id === design.id);
          if (index > -1) {
            const updated = [...state.designs];
            updated[index] = design;
            return { designs: updated };
          }
          return { designs: [design, ...state.designs] };
        });
      },
      removeDesign: (id) =>
        set((state) => ({
          designs: state.designs.filter((d) => d.id !== id),
        })),
      getDesign: (id) => get().designs.find((d) => d.id === id),
      clearDesigns: () => set({ designs: [] }),
    }),
    {
      name: "tawfiq-industry-saved-designs",
    }
  )
);
