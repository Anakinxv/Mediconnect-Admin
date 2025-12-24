import { create } from "zustand";
import { createLandingSlice } from "./useLandingSlice";
import { type LandingSlice } from "./useLandingSlice";
import { type GlobalUISlice, createGlobalUISlice } from "./useGlobalUISlice";
export const useAppStore = create<LandingSlice & GlobalUISlice>((...a) => ({
  ...createLandingSlice(...a),
  ...createGlobalUISlice(...a),
}));
