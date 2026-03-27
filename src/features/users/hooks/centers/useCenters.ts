import api from "@/config/axios-client";
import { useQuery } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface DocumentoCentroAdmin {
  id_documento_centro: number;
  id_centro_salud: number;
  tipo_documento: string;
  url_archivo: string;
  nombre_original: string;
  tipo_mime: string;
  tamanio_bytes: string | null;
  descripcion: string | null;
  estado: string;
  creado_en: string;
  actualizado_en: string | null;
  estado_revision: string;
}

export interface CenterAdminListItem {
  usuarioId: number;
  nombreComercial: string;
  rnc: string;
  tipoCentroId: number;
  ubicacionId: number;
  estadoVerificacion: string;
  estado: string;
  creadoEn: string;
  actualizadoEn: string;
  sitio_web?: string;
  descripcion?: string;
  foto_perfil?: string | null;
  usuario: {
    id: number;
    email: string;
    telefono: string;
    fotoPerfil?: string | null;
    emailVerificado: boolean;
  };
  tipoCentro: {
    id: number;
    nombre: string;
  };
  ubicacion: {
    id: number;
    barrioId: number;
    direccion: string;
    codigoPostal?: string | null;
    estado: string;
    barrio: {
      id: number;
      nombre: string;
      seccionId: number;
      seccion: {
        id: number;
        nombre: string;
      };
    };
  };
  documentos_centros: DocumentoCentroAdmin[];
  idAccionRegistro?: number;
  comentarioVerificacion?: string | null;
  estadoAccionVerificacion?: string | null;
  fechaResolucionVerificacion?: string | null;
}

export interface CenterDetailAdmin {
  usuarioId: number;
  nombreComercial: string;
  rnc: string;
  tipoCentroId: number;
  ubicacionId: number;
  estadoVerificacion: string;
  estado: string;
  creadoEn: string;
  actualizadoEn: string;
  sitio_web?: string;
  descripcion?: string;
  foto_perfil?: string | null;
  usuario: {
    id: number;
    email: string;
    telefono: string | undefined;
    fotoPerfil?: string | null;
    emailVerificado: boolean;
  };
  tipoCentro: {
    id: number;
    nombre: string;
    estado?: string;
    creadoEn?: string;
  };
  ubicacion: {
    id: number;
    barrioId: number;
    direccion: string;
    codigoPostal?: string | null;
    estado: string;
    creadoEn: string;
    id_doctor?: number | null;
    nombre?: string | null;
    barrio: {
      id: number;
      seccionId: number;
      nombre: string;
      estado: string;
      creadoEn: string;
      seccion: {
        id: number;
        distritoMunicipalId?: number | null;
        nombre: string;
        estado: string;
        creadoEn: string;
        id_municipio?: number;
      };
    };
    latitud?: number;
    longitud?: number;
    barrioNombre?: string;
    municipioNombre?: string;
    provinciaNombre?: string;
    direccionCompleta?: string;
  };
  documentos_centros: DocumentoCentroAdmin[];
  certificacion_sanitaria?: string;
  id_documento_certificado?: number;
  estado_documento_certificado?: string;
  idAccionRegistro?: number;
  comentarioVerificacion?: string | null;
  estadoAccionVerificacion?: string | null;
  fechaResolucionVerificacion?: string | null;
}

export type GetCentersAdminParams = {
  nombre?: string;
  estado?: string;
  estadoVerificacion?: string;
  tipoCentroId?: number;
  pagina?: number;
  limite?: number;
  target?: string;
  source?: string;
  translate_fields?: string[];
};

// ─── Resolvers ────────────────────────────────────────────────────────────────

export const resolveVerificationStatus = (
  estadoVerificacion: string,
): "pending" | "approved" | "rejected" => {
  const v = estadoVerificacion?.toLowerCase().trim();
  if (v === "aprobado" || v === "approved") return "approved";
  if (v === "rechazado" || v === "rejected") return "rejected";
  return "pending";
};

export const resolveCenterVerificationStatus = resolveVerificationStatus;

export const mapCenterStatusToApi = (status: string): string | undefined => {
  if (status === "approved") return "Aprobado";
  if (status === "rejected") return "Rechazado";
  if (status === "pending") return "Pendiente";
  return undefined;
};

export const buildDireccionCompleta = (
  center: Pick<CenterAdminListItem, "ubicacion">,
): string => {
  const { ubicacion } = center;
  if (!ubicacion) return "-";
  const parts = [
    ubicacion.direccion,
    ubicacion.barrio?.nombre,
    ubicacion.barrio?.seccion?.nombre,
  ].filter(Boolean);
  return parts.join(", ") || "-";
};

// ✅ Keys exportados como constantes para consistencia
export const QUERY_KEY_LIST = "centersAdmin";
export const QUERY_KEY_DETAIL = "centerAdminDetail";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetCentersAdmin = (params?: GetCentersAdminParams) => {
  const language = useGlobalUIStore((s) => s.language);
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  const stableParams = {
    ...params,
    translate_fields: params?.translate_fields?.join(","),
    target: params?.target ?? (language !== "es" ? language : undefined),
    source: params?.source ?? (language !== "es" ? "es" : undefined),
  };

  return useQuery<CenterAdminListItem[]>({
    queryKey: [QUERY_KEY_LIST, language, stableParams],
    staleTime: 0,
    gcTime: 30_000,
    refetchInterval: 1000 * 30, // ✅ Polling cada 30 segundos
    refetchIntervalInBackground: false,
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/centros-salud/admin", {
          params: stableParams,
        });
        const list = data?.data ?? data;
        return Array.isArray(list) ? list : [];
      } finally {
        setIsLoading(false);
      }
    },
  });
};

export const useGetCenterAdminDetail = (id: number | null) => {
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  return useQuery<CenterDetailAdmin>({
    queryKey: [QUERY_KEY_DETAIL, id],
    enabled: !!id,
    staleTime: 0,
    gcTime: 30_000,

    refetchIntervalInBackground: false,
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/centros-salud/admin/${id}`);
        return (data?.data ?? data) as CenterDetailAdmin;
      } finally {
        setIsLoading(false);
      }
    },
  });
};
