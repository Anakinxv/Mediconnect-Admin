import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type AuthSlice, createAuthSlice } from "./useAuthSlice";

type AppStore = AuthSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // AuthSlice

        forgotPassword: state.forgotPassword,
        otp: state.otp,
        resetPassword: state.resetPassword,
      }),
    },
  ),
);
