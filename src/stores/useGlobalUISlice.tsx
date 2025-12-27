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
  setToast: (toast: {
    message: string;
    type: "success" | "error" | "info";
    open: boolean;
  }) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  PasswordVisibility: boolean;
  SetPasswordVisibility: (visibility: boolean) => void;
};

export const createGlobalUISlice: StateCreator<GlobalUISlice> = (set) => ({
  // Variables
  isDarkMode: false,
  language: "es",
  isloading: false,
  toast: {
    message: "",
    type: "info",
    open: false,
  },
  modalOpen: false,
  PasswordVisibility: false,

  // Funciones
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
  setIsLoading: (loading: boolean) => set({ isloading: loading }),
  setToast: (toast) => set({ toast }),
  setModalOpen: (open: boolean) => set({ modalOpen: open }),
  SetPasswordVisibility: (visibility: boolean) =>
    set({ PasswordVisibility: visibility }),
});
