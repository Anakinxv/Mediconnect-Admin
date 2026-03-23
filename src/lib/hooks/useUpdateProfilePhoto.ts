import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios-client";

interface UpdateProfilePhotoPayload {
  file?: File;
  remove?: boolean;
}

interface UpdateProfilePhotoResponse {
  success: boolean;
  message?: string;
  fotoPerfil?: string | null;
  usuario?: {
    fotoPerfil?: string | null;
  };
}

export const useUpdateProfilePhoto = () => {
  return useMutation({
    mutationKey: ["update-profile-photo"],
    mutationFn: async (payload: UpdateProfilePhotoPayload) => {
      // Quitar imagen
      if (payload.remove) {
        const { data } = await api.patch<UpdateProfilePhotoResponse>(
          "/auth/foto-perfil",
          { fotoPerfil: "" },
        );
        return data;
      }

      // Subir imagen
      if (!payload.file) {
        throw new Error("No file provided");
      }

      const formData = new FormData();
      formData.append("fotoPerfil", payload.file);

      const { data } = await api.patch<UpdateProfilePhotoResponse>(
        "/auth/foto-perfil",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data;
    },
  });
};
