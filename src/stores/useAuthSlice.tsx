import { type StateCreator } from "zustand";
import { type LoginSchemaType } from "@/schema/AuthSchema";
import { type ForgotPasswordSchemaType } from "@/schema/AuthSchema";

export interface AuthSlice {
  loginCredentials: LoginSchemaType;
  setLoginCredentials: (data: LoginSchemaType) => void;
  forgotPassword: ForgotPasswordSchemaType;
  setForgotPassword: (data: ForgotPasswordSchemaType) => void;
  clearForgotPassword: () => void;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  loginCredentials: {
    email: "",
    password: "",
  } as LoginSchemaType,
  isAuthenticated: false,
  token: null,
  forgotPassword: {
    email: "",
  } as ForgotPasswordSchemaType,
  setForgotPassword: (data) => set({ forgotPassword: data }),
  clearForgotPassword: () =>
    set({
      forgotPassword: {
        email: "",
      } as ForgotPasswordSchemaType,
    }),
  setLoginCredentials: (data) => set({ loginCredentials: data }),
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
    }),
});
