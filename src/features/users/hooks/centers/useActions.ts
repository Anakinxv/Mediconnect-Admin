import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface AccionCenterInterface {
  id: number;
  documentoId: number;
  centroId?: number;
  doctorId?: number;
  usuarioId?: number;
  tipoDocumento: string;
  estado: string;
  creadoEn: string;

  // compat UI actual
  doctor?: { nombre: string; apellido: string; email?: string };
  documento?: {
    id?: number;
    tipoDocumento?: string;
    urlArchivo: string;
    nombreOriginal: string;
    tipoMime?: string;
    descripcion?: string;
    creadoEn?: string;
  };

  // nuevo contrato backend /acciones/pendientes
  detalle?: string;
  fechaEmision?: string;
  tipoRevision?: string;
  emisor?: {
    id: number;
    email: string;
    rol: string;
    fotoPerfil?: string | null;
  };
  perfilEmisor?: {
    usuarioId: number;
    nombre?: string;
    apellido?: string;
    exequatur?: string;
    nombreComercial?: string;
    estadoVerificacion?: string;
  };
}

export type RevisarAccionCenterPayload = {
  accionId: number;
  decision: "Aprobada" | "Rechazada";
  comentario?: string;
};

const QUERY_KEY = "accionesCenters";

type RawAccion = Record<string, any>;

const normalizeAccion = (item: RawAccion): AccionCenterInterface => {
  const perfilEmisor = item?.perfilEmisor;
  const emisor = item?.emisor;
  const documento = item?.documento;

  return {
    id: item?.id,
    documentoId: item?.documentoId ?? documento?.id ?? 0,
    centroId: item?.centroId,
    doctorId: item?.doctorId ?? perfilEmisor?.usuarioId,
    usuarioId: item?.usuarioId ?? emisor?.id ?? perfilEmisor?.usuarioId,
    tipoDocumento:
      item?.tipoDocumento ?? documento?.tipoDocumento ?? item?.detalle ?? "",
    estado: item?.estado ?? "Pendiente",
    creadoEn: item?.creadoEn ?? item?.fechaEmision ?? new Date().toISOString(),

    // compat UI actual
    doctor: item?.doctor ?? {
      nombre: perfilEmisor?.nombre ?? "",
      apellido: perfilEmisor?.apellido ?? "",
      email: emisor?.email,
    },
    documento: documento
      ? {
          id: documento?.id,
          tipoDocumento: documento?.tipoDocumento,
          urlArchivo: documento?.urlArchivo ?? "",
          nombreOriginal: documento?.nombreOriginal ?? "",
          tipoMime: documento?.tipoMime,
          descripcion: documento?.descripcion,
          creadoEn: documento?.creadoEn,
        }
      : item?.documento,

    // nuevo contrato backend
    detalle: item?.detalle,
    fechaEmision: item?.fechaEmision,
    tipoRevision: item?.tipoRevision,
    emisor,
    perfilEmisor,
  };
};

export const useGetCenterPendingAcciones = (params?: {
  tipoDocumento?: string;
  limite?: number;
}) => {
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  const stableParams = {
    ...params,
    limite: params?.limite ?? 50,
  };

  return useQuery<AccionCenterInterface[]>({
    queryKey: [QUERY_KEY, "pendientes", stableParams],
    staleTime: 0,
    gcTime: 30_000,
    refetchIntervalInBackground: false,
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/acciones/pendientes", {
          params: stableParams,
        });

        const list = data?.data ?? data?.acciones ?? data;
        if (!Array.isArray(list)) return [];
        return list.map(normalizeAccion);
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
          comentario?.trim() ||
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["acciones"] });

      // centers
      queryClient.invalidateQueries({ queryKey: ["centerAdminDetail"] });
      queryClient.invalidateQueries({ queryKey: ["centersAdmin"] });

      // doctores (si existen en tu app)
      queryClient.invalidateQueries({ queryKey: ["doctorAdminDetail"] });
      queryClient.invalidateQueries({ queryKey: ["doctorsAdmin"] });
    },
  });
};
