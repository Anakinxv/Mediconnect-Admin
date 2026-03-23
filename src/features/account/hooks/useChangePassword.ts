import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios-client";
import { useAppStore } from "@/stores/useAppStore";

interface ChangePasswordPayload {
  nuevaPassword: string;
  confirmarPassword: string;
  recoveryToken?: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: async ({
      nuevaPassword,
      confirmarPassword,
      recoveryToken,
    }: ChangePasswordPayload) => {
      const tokenFromStore = useAppStore.getState().otp;
      const token =
        recoveryToken ||
        tokenFromStore ||
        localStorage.getItem("recoveryToken") ||
        localStorage.getItem("X-Recovery-Token") ||
        "";

      if (!token) {
        throw new Error("Recovery token is required");
      }

      const { data } = await api.post<ChangePasswordResponse>(
        "/auth/password/cambiar",
        {
          nuevaPassword,
          confirmarPassword,
        },
        {
          headers: {
            "X-Recovery-Token": token,
          },
        },
      );

      return data;
    },
  });
};
