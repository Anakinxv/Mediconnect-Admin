import { type StateCreator } from "zustand";
import i18n from "../i18n/config";

export type GlobalUISlice = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
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
};

export const createGlobalUISlice: StateCreator<GlobalUISlice> = (set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
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
});
