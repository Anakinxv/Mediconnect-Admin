import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios-client";

interface VerifyCodeResponse {
  success: boolean;
  message: string;
}

export const useVerifyRecoveryCode = () => {
  return useMutation({
    mutationKey: ["verify-recovery-code"],
    mutationFn: async (payload: { email: string; codigo: string }) => {
      const { data } = await api.post<VerifyCodeResponse>(
        "/auth/password/verificar-codigo",
        payload,
      );
      return data;
    },
  });
};
