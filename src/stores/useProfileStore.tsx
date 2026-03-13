import { create } from "zustand";

type ChangeEmailData = {
  newEmail: string;
  otp: string;
};

type ChangePasswordData = {
  newPassword: string;
  confirmNewPassword: string;
};

type VerifyAccountPassword = {
  password: string;
};

type ProfileStore = {
  changeEmailData: ChangeEmailData;
  setChangeEmailData: (data: ChangeEmailData) => void;

  changePasswordData: ChangePasswordData;
  setChangePasswordData: (data: ChangePasswordData) => void;

  verifyAccountPassword: VerifyAccountPassword;
  setVerifyAccountPassword: (data: VerifyAccountPassword) => void;

  resetProfileFlow: () => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  changeEmailData: {
    newEmail: "",
    otp: "",
  },
  setChangeEmailData: (data) => set({ changeEmailData: data }),

  changePasswordData: {
    newPassword: "",
    confirmNewPassword: "",
  },
  setChangePasswordData: (data) => set({ changePasswordData: data }),

  verifyAccountPassword: {
    password: "",
  },
  setVerifyAccountPassword: (data) => set({ verifyAccountPassword: data }),

  resetProfileFlow: () =>
    set({
      changeEmailData: { newEmail: "", otp: "" },
      changePasswordData: { newPassword: "", confirmNewPassword: "" },
      verifyAccountPassword: { password: "" },
    }),
}));
