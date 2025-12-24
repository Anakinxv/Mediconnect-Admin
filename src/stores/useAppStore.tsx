import { create } from "zustand";

import { type GlobalUISlice, createGlobalUISlice } from "./useGlobalUISlice";
export const useAppStore = create<GlobalUISlice>((...a) => ({
  ...createGlobalUISlice(...a),
}));
