import { create } from "zustand";
import { type AuthSlice, createAuthSlice } from "./useAuthSlice";
import { type GlobalUISlice, createGlobalUISlice } from "./useGlobalUISlice";
export const useAppStore = create<GlobalUISlice & AuthSlice>((...a) => ({
  ...createGlobalUISlice(...a),
  ...createAuthSlice(...a),
}));
