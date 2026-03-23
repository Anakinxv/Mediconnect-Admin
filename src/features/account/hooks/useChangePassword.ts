import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios-client";

interface ChangePasswordPayload {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ["change-password-authenticated"],
    mutationFn: async ({
      passwordActual,
      nuevaPassword,
      confirmarPassword,
    }: ChangePasswordPayload) => {
      const { data } = await api.patch<ChangePasswordResponse>(
        "/auth/password/cambiar-autenticado",
        {
          passwordActual,
          nuevaPassword,
          confirmarPassword,
        },
      );

      return data;
    },
  });
};
