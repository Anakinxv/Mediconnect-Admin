import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios-client";

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ["forgot-password-send-code"],
    mutationFn: async (payload: { email: string }) => {
      const { data } = await api.post<ForgotPasswordResponse>(
        "/auth/password/solicitar-codigo",
        payload,
      );
      return data;
    },
  });
};
