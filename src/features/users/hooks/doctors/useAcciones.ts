import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface AccionInterface {
  id: number;
  documentoId: number;
  doctorId: number;
  tipoDocumento: string;
  estado: string;
  creadoEn: string;
  doctor?: {
    nombre: string;
    apellido: string;
    email?: string;
  };
  documento?: {
    urlArchivo: string;
    nombreOriginal: string;
    tipoMime: string;
  };
}

export type RevisarAccionPayload = {
  accionId: number;
  decision: "Aprobada" | "Rechazada";
  comentario?: string;
};

const QUERY_KEY = "acciones";

export const useGetPendingAcciones = (params?: {
  tipoDocumento?: string;
  limite?: number;
}) => {
  return useQuery<AccionInterface[]>({
    queryKey: [QUERY_KEY, "pendientes", params],
    staleTime: 0,
    gcTime: 30_000,

    refetchIntervalInBackground: false,
    queryFn: async () => {
      const { data } = await api.get("/acciones/pendientes", { params });
      const list = data?.data ?? data?.acciones ?? data;
      return Array.isArray(list) ? list : [];
    },
  });
};

export const useRevisarAccion = () => {
  const queryClient = useQueryClient();
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  return useMutation({
    mutationFn: async ({
      accionId,
      decision,
      comentario,
    }: RevisarAccionPayload) => {
      const payload = {
        decision,
        comentario:
          comentario ||
          (decision === "Aprobada"
            ? "Documento verificado correctamente"
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
      // Invalida acciones pendientes
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      // ✅ Keys correctos de useDoctors.ts
      queryClient.invalidateQueries({ queryKey: ["doctorAdminDetail"] });
      queryClient.invalidateQueries({ queryKey: ["doctorsAdmin"] });
    },
  });
};
