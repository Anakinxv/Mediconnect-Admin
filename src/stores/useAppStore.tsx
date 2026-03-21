import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type AuthSlice, createAuthSlice } from "./useAuthSlice";
import { type GlobalUISlice, createGlobalUISlice } from "./useGlobalUISlice";

type AppStore = GlobalUISlice & AuthSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createGlobalUISlice(...a),
      ...createAuthSlice(...a),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // AuthSlice
        loginCredentials: state.loginCredentials, // LoginSchemaType
        forgotPassword: state.forgotPassword, // ForgotPasswordSchemaType
        otp: state.otp, // string
        resetPassword: state.resetPassword, // ResetPasswordSchemaType
        isAuthenticated: state.isAuthenticated, // boolean
        token: state.token, // string | null
        // GlobalUISlice
        theme: state.theme,
        language: state.language,
      }),
    },
  ),
);
