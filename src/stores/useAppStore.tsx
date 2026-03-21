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
        loginCredentials: state.loginCredentials,
        forgotPassword: state.forgotPassword,
        otp: state.otp,
        resetPassword: state.resetPassword,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

export const getAuthState = () => useAppStore.getState();
