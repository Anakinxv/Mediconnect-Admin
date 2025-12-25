import { type StateCreator } from "zustand";

import type { AuthType } from "../types/AuthTypes";

export interface AuthSlice {
  loginCredentials: AuthType;
  setloginCredentials: (loginCredentials: AuthType) => void;

  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  loginCredentials: {
    email: "",
    password: "",
  },
  setloginCredentials: (loginCredentials: AuthType) =>
    set(() => ({
      loginCredentials,
    })),

  isAuthenticated: false,
  token: null,
  login: (token: string) =>
    set(() => ({
      isAuthenticated: true,
      token,
    })),
  logout: () =>
    set(() => ({
      isAuthenticated: false,
      token: null,
      loginCredentials: { email: "", password: "" },
    })),
});
