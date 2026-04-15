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
        forgotPassword: state.forgotPassword,
        otp: state.otp,
        resetPassword: state.resetPassword,
        user: state.user,
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          const stored = localStorage.getItem("auth-refresh");
          if (stored) {
            try {
              const { refreshToken } = JSON.parse(stored) as {
                refreshToken: string;
              };
              state.refreshToken = refreshToken;
            } catch {
              localStorage.removeItem("auth-refresh");
            }
          }
        }
      },
    },
  ),
);

useAppStore.subscribe((state, prev) => {
  if (state.refreshToken !== prev.refreshToken) {
    if (state.refreshToken) {
      localStorage.setItem(
        "auth-refresh",
        JSON.stringify({ refreshToken: state.refreshToken }),
      );
    } else {
      // logout → limpia localStorage también
      localStorage.removeItem("auth-refresh");
    }
  }
});
