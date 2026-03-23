import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios-client";

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async ({
      token,
      nuevaPassword,
      confirmarPassword,
    }: ResetPasswordPayload) => {
      const { data } = await api.post<ResetPasswordResponse>(
        "/auth/password/cambiar",
        { nuevaPassword, confirmarPassword },
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
