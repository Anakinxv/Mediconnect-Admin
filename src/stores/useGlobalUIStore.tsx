import { create } from "zustand";
import { createGlobalUISlice, type GlobalUISlice } from "./useGlobalUISlice";

export const useGlobalUIStore = create<GlobalUISlice>()((...a) => ({
  ...createGlobalUISlice(...a),
}));
