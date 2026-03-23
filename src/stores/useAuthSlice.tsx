import { type StateCreator } from "zustand";
import { type LoginSchemaType } from "@/schema/AuthSchema";
import { type ForgotPasswordSchemaType } from "@/schema/AuthSchema";
import { type ResetPasswordSchemaType } from "@/schema/AuthSchema";

interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  profilePicture?: string;
}

export interface AuthSlice {
  user: User | null;
  loginCredentials: LoginSchemaType;
  forgotPassword: ForgotPasswordSchemaType;
  otp: string;
  resetPassword: ResetPasswordSchemaType;
  accessToken: string | null;
  refreshToken: string | null;

  setUser: (user: User | null) => void;
  setLoginCredentials: (data: LoginSchemaType) => void;
  setForgotPassword: (data: ForgotPasswordSchemaType) => void;
  setOtp: (otp: string) => void;
  setResetPassword: (data: ResetPasswordSchemaType) => void;
  clearForgotPassword: () => void;
  clearAuth: () => void;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  reset: () => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setProfilePicture: (url: string) => void; // 👈 nuevo
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
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

  accessToken: null,
  refreshToken: null,

  setUser: (user) => set({ user }),
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
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      loginCredentials: { email: "", password: "" },
      forgotPassword: { email: "" },
      otp: "",
      resetPassword: { password: "", confirmPassword: "" },
    }),
  login: (accessToken, refreshToken) =>
    set({
      accessToken,
      refreshToken,
    }),
  logout: () =>
    set({
      accessToken: null,
      refreshToken: null,
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
  setProfilePicture: (url) =>
    set((state) => ({
      user: state.user ? { ...state.user, profilePicture: url } : null,
    })),
});
