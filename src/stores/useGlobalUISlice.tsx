import { type StateCreator } from "zustand";
import i18n from "../i18n/config";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export type GlobalUISlice = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  isloading: boolean;
  setIsLoading: (loading: boolean) => void;
  toast: {
    message: string;
    type: "success" | "error" | "info";
    open: boolean;
  };
  PasswordVisibility: boolean;
  SetPasswordVisibility: (visibility: boolean) => void;
  setToast: (toast: {
    message: string;
    type: "success" | "error" | "info";
    open: boolean;
  }) => void;
  canAccessPage: boolean;
  allowedPages: string[];
  setAccessPage: (canAccess: boolean, pages: string[]) => void;
  modalOpen: boolean;
};

export const createGlobalUISlice: StateCreator<GlobalUISlice> = (set, get) => ({
  theme: "light",
  resolvedTheme: getSystemTheme(),
  setTheme: (theme) => {
    set({ theme });
    if (theme === "system") {
      set({ resolvedTheme: getSystemTheme() });
    } else {
      set({ resolvedTheme: theme as ResolvedTheme });
    }
  },
  toggleTheme: () => {
    const current = get().theme;
    let nextTheme: Theme;
    if (current === "light") nextTheme = "dark";
    else if (current === "dark") nextTheme = "system";
    else nextTheme = "light";
    get().setTheme(nextTheme);
  },
  language: "es",
  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
  isloading: false,
  setIsLoading: (loading: boolean) => set({ isloading: loading }),
  PasswordVisibility: false,
  SetPasswordVisibility: (visibility: boolean) =>
    set({ PasswordVisibility: visibility }),
  toast: {
    message: "",
    type: "info",
    open: false,
  },
  setToast: (toast) => set({ toast }),
  canAccessPage: false,
  allowedPages: [],
  setAccessPage: (canAccess, pages) =>
    set({ canAccessPage: canAccess, allowedPages: pages }),
  modalOpen: false,
});
