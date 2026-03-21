import { type StateCreator } from "zustand";
import { type LoginSchemaType } from "@/schema/AuthSchema";
import { type ForgotPasswordSchemaType } from "@/schema/AuthSchema";
import { type ResetPasswordSchemaType } from "@/schema/AuthSchema";

export interface AuthSlice {
  loginCredentials: LoginSchemaType;
  forgotPassword: ForgotPasswordSchemaType;
  otp: string;
  resetPassword: ResetPasswordSchemaType;
  isAuthenticated: boolean;
  accessToken: string | null; // antes: token
  refreshToken: string | null;

  setLoginCredentials: (data: LoginSchemaType) => void;
  setForgotPassword: (data: ForgotPasswordSchemaType) => void;
  setOtp: (otp: string) => void;
  setResetPassword: (data: ResetPasswordSchemaType) => void;
  clearForgotPassword: () => void;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  reset: () => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  loginCredentials: {
    email: "",
    password: "",
  },
  forgotPassword: {
    email: "",
  },
  otp: "",
  resetPassword: {
    password: "",
    confirmPassword: "",
  },
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,

  setLoginCredentials: (data) => set({ loginCredentials: data }),
  setForgotPassword: (data) => set({ forgotPassword: data }),
  setOtp: (otp) => set({ otp }),
  setResetPassword: (data) => set({ resetPassword: data }),
  clearForgotPassword: () =>
    set({
      forgotPassword: { email: "" },
      otp: "",
      resetPassword: { password: "", confirmPassword: "" },
    }),
  login: (accessToken, refreshToken) =>
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loginCredentials: { email: "", password: "" },
      forgotPassword: { email: "" },
      otp: "",
      resetPassword: { password: "", confirmPassword: "" },
    }),
  reset: () =>
    set({
      forgotPassword: { email: "" },
      otp: "",
      resetPassword: { password: "", confirmPassword: "" },
    }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
});
