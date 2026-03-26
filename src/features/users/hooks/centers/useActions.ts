// hooks/centers/useActions.ts
import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface AccionCenterInterface {
  id: number;
  documentoId: number;
  // El backend devuelve el propietario en doctorId aunque sea un centro
  // porque ambos comparten la tabla de usuarios y el mismo endpoint
  centroId?: number;
  doctorId?: number;
  usuarioId?: number;
  tipoDocumento: string;
  estado: string; // "Pendiente" | "Aprobada" | "Rechazada"
  creadoEn: string;
  doctor?: { nombre: string; apellido: string; email?: string };
  documento?: {
    urlArchivo: string;
    nombreOriginal: string;
    tipoMime: string;
  };
}

export type RevisarAccionCenterPayload = {
  accionId: number;
  decision: "Aprobada" | "Rechazada";
  comentario?: string;
};

const QUERY_KEY = "accionesCenters";

export const useGetCenterPendingAcciones = (params?: {
  tipoDocumento?: string;
  limite?: number;
}) => {
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  return useQuery<AccionCenterInterface[]>({
    queryKey: [QUERY_KEY, "pendientes", params],
    // Sin caché — las URLs firmadas de Supabase expiran
    staleTime: 0,
    gcTime: 30_000,
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/acciones/pendientes", { params });
        const list = data?.data ?? data?.acciones ?? data;
        return Array.isArray(list) ? list : [];
      } finally {
        setIsLoading(false);
      }
    },
  });
};

export const useRevisarAccionCenter = () => {
  const queryClient = useQueryClient();
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  return useMutation({
    mutationFn: async ({
      accionId,
      decision,
      comentario,
    }: RevisarAccionCenterPayload) => {
      const payload = {
        decision,
        comentario:
          comentario ||
          (decision === "Aprobada"
            ? "Certificado sanitario verificado correctamente"
            : "Rechazado por el administrador"),
      };

      const { data } = await api.patch(
        `/acciones/${accionId}/revisar`,
        payload,
      );
      return data;
    },
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: () => {
      // Invalida acciones de centros y doctores (mismo endpoint)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["acciones"] });
      // Invalida el detalle y la lista de centros
      queryClient.invalidateQueries({ queryKey: ["centerAdminDetail"] });
      queryClient.invalidateQueries({ queryKey: ["centersAdmin"] });
    },
  });
};
