import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface AccionInterface {
  id: number;
  documentoId: number;
  doctorId: number;
  tipoDocumento: string;
  estado: string; // "Pendiente" | "Aprobada" | "Rechazada"
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

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetPendingAcciones = (params?: {
  tipoDocumento?: string;
  limite?: number;
}) => {
  return useQuery<AccionInterface[]>({
    queryKey: [QUERY_KEY, "pendientes", params],
    queryFn: async () => {
      const { data } = await api.get("/acciones/pendientes", { params });
      // Asegúrate de retornar el arreglo dependiendo de cómo venga estructurado (ej. data.data o data)
      return data.data || data;
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
      setIsLoading(true);

      const payload = {
        decision,
        comentario:
          comentario ||
          (decision === "Aprobada"
            ? "Documento verificado correctamente"
            : "Rechazado por el administrador"),
      };

      // accionId viaja estrictamente en la URL, payload viaja en el body
      const { data } = await api.patch(
        `/acciones/${accionId}/revisar`,
        payload,
      );
      return data;
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      // Refrescamos las acciones pendientes y los datos del doctor
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["doctores"] });
    },
  });
};
