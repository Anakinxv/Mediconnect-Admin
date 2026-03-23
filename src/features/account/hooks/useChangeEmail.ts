import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios-client";

interface ChangeEmailPayload {
  nuevoEmail: string;
  password: string;
}

interface ChangeEmailResponse {
  success: boolean;
  message: string;
}

export const useChangeEmail = () => {
  return useMutation({
    mutationKey: ["change-email"],
    mutationFn: async (payload: ChangeEmailPayload) => {
      const { data } = await api.patch<ChangeEmailResponse>(
        "/auth/cambiar-email",
        payload,
      );
      return data;
    },
  });
};
