import { type StateCreator } from "zustand";
import i18n from "../i18n/config";

export type GlobalUISlice = {
  canAccessPage: boolean;
  allowedPages: string[];
  setAccessPage: (canAccess: boolean, pages: string[]) => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
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
  passwordVisibility: boolean;
  setPasswordVisibility: (visibility: boolean) => void;
};

export const createGlobalUISlice: StateCreator<GlobalUISlice> = (set) => ({
  canAccessPage: false,
  allowedPages: [],
  setAccessPage: (canAccess, pages) =>
    set({ canAccessPage: canAccess, allowedPages: pages }),

  isDarkMode: false,
  language: "es",
  isLoading: false,
  toast: {
    message: "",
    type: "info",
    open: false,
  },
  modalOpen: false,
  passwordVisibility: false,

  // Funciones
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setToast: (toast) => set({ toast }),
  setModalOpen: (open: boolean) => set({ modalOpen: open }),
  setPasswordVisibility: (visibility: boolean) =>
    set({ passwordVisibility: visibility }),
});
