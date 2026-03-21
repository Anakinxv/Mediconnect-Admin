import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createGlobalUISlice, type GlobalUISlice } from "./useGlobalUISlice";

export const useGlobalUIStore = create<GlobalUISlice>()(
  persist(
    (...a) => ({
      ...createGlobalUISlice(...a),
    }),
    {
      name: "global-ui-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // GlobalUISlice
        theme: state.theme,
        language: state.language,
      }),
    },
  ),
);
