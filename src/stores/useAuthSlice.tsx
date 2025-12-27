import { type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type LoginSchemaType } from "@/schema/AuthSchema";
import { type ForgotPasswordSchemaType } from "@/schema/AuthSchema";
import { type ResetPasswordSchemaType } from "@/schema/AuthSchema";

export interface AuthSlice {
  loginCredentials: LoginSchemaType;
  forgotPassword: ForgotPasswordSchemaType;
  otp: string;
  resetPassword: ResetPasswordSchemaType;
  isAuthenticated: boolean;
  token: string | null;

  setLoginCredentials: (data: LoginSchemaType) => void;
  setForgotPassword: (data: ForgotPasswordSchemaType) => void;
  setOtp: (otp: string) => void;
  setResetPassword: (data: ResetPasswordSchemaType) => void;
  clearForgotPassword: () => void;
  login: (token: string) => void;
  logout: () => void;
  reset: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [["zustand/persist", unknown]]
> = persist(
  (set) => ({
    // Variables
    loginCredentials: {
      email: "",
      password: "",
    } as LoginSchemaType,
    forgotPassword: {
      email: "",
    } as ForgotPasswordSchemaType,
    otp: "",
    resetPassword: {
      password: "",
      confirmPassword: "",
    } as ResetPasswordSchemaType,
    isAuthenticated: false,
    token: null,

    // Funciones
    setLoginCredentials: (data: LoginSchemaType) =>
      set({ loginCredentials: data }),
    setForgotPassword: (data: ForgotPasswordSchemaType) =>
      set({ forgotPassword: data }),
    setOtp: (otp: string) => set({ otp }),
    setResetPassword: (data: ResetPasswordSchemaType) =>
      set({ resetPassword: data }),
    clearForgotPassword: () =>
      set({
        forgotPassword: {
          email: "",
        } as ForgotPasswordSchemaType,
      }),
    login: (token: string) =>
      set({
        token,
        isAuthenticated: true,
      }),
    logout: () =>
      set({
        token: null,
        isAuthenticated: false,
        loginCredentials: {
          email: "",
          password: "",
        } as LoginSchemaType,
        forgotPassword: {
          email: "",
        } as ForgotPasswordSchemaType,
        otp: "",
        resetPassword: {
          password: "",
          confirmPassword: "",
        } as ResetPasswordSchemaType,
      }),
    reset: () =>
      set({
        forgotPassword: {
          email: "",
        } as ForgotPasswordSchemaType,
        otp: "",
        resetPassword: {
          password: "",
          confirmPassword: "",
        } as ResetPasswordSchemaType,
      }),
  }),
  {
    name: "auth-storage",
    storage: createJSONStorage(() => sessionStorage),
  }
);
