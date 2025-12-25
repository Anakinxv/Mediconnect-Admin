import { type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type LoginSchemaType } from "@/schema/AuthSchema";
import { type ForgotPasswordSchemaType } from "@/schema/AuthSchema";

export interface AuthSlice {
  loginCredentials: LoginSchemaType;
  setLoginCredentials: (data: LoginSchemaType) => void;
  forgotPassword: ForgotPasswordSchemaType;
  otp: string;
  setOtp: (otp: string) => void;
  setForgotPassword: (data: ForgotPasswordSchemaType) => void;
  clearForgotPassword: () => void;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Si tienes una interfaz llamada AuthStateInterface, usa esa en vez de AuthSlice
export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [["zustand/persist", unknown]]
> = persist(
  (set) => ({
    loginCredentials: {
      email: "",
      password: "",
    } as LoginSchemaType,
    isAuthenticated: false,
    token: null,
    forgotPassword: {
      email: "",
    } as ForgotPasswordSchemaType,
    otp: "",

    setForgotPassword: (data) => set({ forgotPassword: data }),
    clearForgotPassword: () =>
      set({
        forgotPassword: {
          email: "",
        } as ForgotPasswordSchemaType,
      }),
    setLoginCredentials: (data: LoginSchemaType) =>
      set({ loginCredentials: data }),
    login: (token) =>
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
      }),
    setOtp: (otp) => set({ otp }),
  }),
  {
    name: "auth-storage",
    storage: createJSONStorage(() => sessionStorage),
  }
);
