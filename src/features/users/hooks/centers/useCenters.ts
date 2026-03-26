import api from "@/config/axios-client";
import { useQuery } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface CenterAdminListItem {
  usuarioId: number;
  nombreComercial: string;
  rnc: string;
  tipoCentroId: number;
  ubicacionId: number;
  estadoVerificacion: string; // "En revisión" | "Aprobado" | "Rechazado"
  estado: string;
  creadoEn: string;
  actualizadoEn: string;
  certificacion_sanitaria: string;
  sitio_web: string | null;
  descripcion: string;
  foto_perfil: string | null;
  usuario: {
    id: number;
    email: string;
    telefono: string;
    fotoPerfil: string | null;
    emailVerificado: boolean;
  };
  tipoCentro: {
    id: number;
    nombre: string;
  };
  ubicacion: {
    id: number;
    direccion: string;
    nombre: string | null;
    barrioNombre?: string;
    municipioNombre?: string;
    provinciaNombre?: string;
    direccionCompleta?: string;
    latitud?: number | null;
    longitud?: number | null;
    barrio?: {
      nombre: string;
      seccion?: { nombre: string };
    };
  };
}

export interface CenterDetailAdmin extends CenterAdminListItem {
  // El detalle devuelve los mismos campos que la lista
  // pero con ubicacion más completa (incluye latitud/longitud/direccionCompleta)
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const resolveCenterVerificationStatus = (
  estadoVerificacion: string,
): "pending" | "approved" | "rejected" => {
  const v = estadoVerificacion?.toLowerCase().trim();
  if (v === "aprobado" || v === "approved") return "approved";
  if (v === "rechazado" || v === "rejected") return "rejected";
  // "En revisión", "Pendiente", cualquier otro valor
  return "pending";
};

export const mapCenterStatusToApi = (status: string): string | undefined => {
  if (status === "approved") return "Aprobado";
  if (status === "rejected") return "Rechazado";
  if (status === "pending") return "En revisión";
  return undefined;
};

/** Construye la dirección completa desde los campos disponibles */
export const buildDireccionCompleta = (
  ubicacion: CenterAdminListItem["ubicacion"],
): string => {
  if (ubicacion.direccionCompleta) return ubicacion.direccionCompleta;
  const parts = [
    ubicacion.direccion,
    ubicacion.barrioNombre ?? ubicacion.barrio?.nombre,
    ubicacion.municipioNombre,
    ubicacion.provinciaNombre,
  ].filter(Boolean);
  return parts.join(", ");
};

const QUERY_KEY_LIST = "centersAdmin";
const QUERY_KEY_DETAIL = "centerAdminDetail";

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
    // ✅ URLs de Supabase firmadas expiran — no cachear
    staleTime: 0,
    gcTime: 30_000,
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
