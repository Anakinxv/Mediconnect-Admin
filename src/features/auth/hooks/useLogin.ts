import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/stores/useAppStore";
import api from "@/config/axios-client";

interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: number;
    email: string;
    rol: string;
  };
}

export const useLogin = () => {
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const setRefreshToken = useAppStore((state) => state.setRefreshToken);
  const setUser = useAppStore((state) => state.setUser);

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (Credential: { email: string; password: string }) => {
      const { data } = await api.post<LoginResponse>("/auth/login", Credential);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser({
        id: data.usuario.id,
        email: data.usuario.email,
        name: data.usuario.email.split("@")[0],
        rol: data.usuario.rol,
      });
      return data;
    },
  });
};
