import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios-client";

interface VerifyIdentityPayload {
  password: string;
}

interface VerifyIdentityResponse {
  success: boolean;
  verificado: boolean;
  message?: string;
}

export const useConfirmaPassword = () => {
  return useMutation({
    mutationKey: ["verify-identity"],
    mutationFn: async (payload: VerifyIdentityPayload) => {
      const { data } = await api.post<VerifyIdentityResponse>(
        "/auth/verificar-identidad",
        payload,
      );
      return data;
    },
  });
};
