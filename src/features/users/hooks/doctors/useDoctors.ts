import api from "@/config/axios-client";
import { useQuery } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface DoctorAdminListItem {
  id: number;
  usuarioId: number;
  nombre: string;
  apellido: string;
  genero: string;
  nacionalidad: string;
  exequatur: string;
  estadoVerificacion: string;
  estadoInfoPersonal: string; // ✅ nuevo: estado solo de la info personal
  estado: string;
  creadoEn: string;
  calificacionPromedio: number;
  anosExperiencia: number;
  especialidades: { nombre: string; es_principal: boolean }[];
  usuario?: {
    email: string;
    telefono: string;
    fotoPerfil?: string;
    emailVerificado: boolean;
  };
}

export interface DocumentoAdmin {
  id: number;
  doctorId: number;
  tipoDocumento: string;
  urlArchivo: string;
  nombreOriginal: string;
  tipoMime: string;
  estadoRevision: string;
  comentarioAdmin: string | null;
  estadoAccion: string | null;
  fechaResolucionAccion: string | null;
}

export interface EspecialidadAdmin {
  id_doctor: number;
  id_especialidad: number;
  es_principal: boolean;
  estado: string;
  especialidades: {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
  };
}

export interface DoctorDetailAdmin {
  usuarioId: number;
  nombre: string;
  apellido: string;
  tipoDocIdentificacion: string;
  numeroDocumentoIdentificacion: string;
  fechaNacimiento: string;
  genero: string;
  nacionalidad: string;
  exequatur: string;
  biografia: string;
  anosExperiencia: number;
  estadoVerificacion: string; // estado global (aprobado cuando info + docs OK)
  estadoInfoPersonal: string; // ✅ nuevo: estado de la información personal únicamente
  calificacionPromedio: number;
  estado: string;
  creadoEn: string;
  actualizadoEn: string;
  duracionCitaPromedio: number;
  tarifas: unknown;
  usuario: {
    email: string;
    telefono: string;
    fotoPerfil?: string;
    emailVerificado: boolean;
  };
  ubicaciones: {
    id: number;
    nombre: string;
    direccion: string;
    direccionCompleta: string;
    latitud: number;
    longitud: number;
    estado: string;
  }[];
  especialidades: EspecialidadAdmin[];
  documentos: DocumentoAdmin[];
  experiencias: {
    id: number;
    institucion: string;
    posicion: string;
    fechaInicio: string;
    fechaFinalizacion: string | null;
    trabajaActualmente: boolean;
  }[];
  formaciones: {
    id: number;
    nombre: string;
    universidadId: number;
    fecha_inicio: string;
    fecha_finalizacion: string | null;
    enCurso: boolean;
  }[];
  comentarioVerificacion: string | null;
  estadoAccionVerificacion: string | null;
  fechaResolucionVerificacion: string | null;
}

export type GetDoctorsAdminParams = {
  nombre?: string;
  apellido?: string;
  estado?: string;
  estadoVerificacion?: string;
  especialidadId?: number;
  pagina?: number;
  limite?: number;
  target?: string;
  source?: string;
  translate_fields?: string[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const resolveVerificationStatus = (
  estadoVerificacion: string,
): "pending" | "approved" | "rejected" => {
  const v = estadoVerificacion?.toLowerCase().trim();
  if (v === "aprobado" || v === "approved") return "approved";
  if (v === "rechazado" || v === "rejected") return "rejected";
  return "pending";
};

export const mapStatusToApi = (status: string): string | undefined => {
  if (status === "approved") return "Aprobado";
  if (status === "rejected") return "Rechazado";
  if (status === "pending") return "Pendiente";
  return undefined;
};

export const resolveDocumentStatus = (
  estadoRevision: string,
): "PENDING" | "APPROVED" | "REJECTED" => {
  const v = estadoRevision?.toLowerCase().trim();
  if (v === "aprobado" || v === "approved") return "APPROVED";
  if (v === "rechazado" || v === "rejected") return "REJECTED";
  return "PENDING";
};

// ✅ Keys exportados como constantes para consistencia
export const QUERY_KEY_LIST = "doctorsAdmin";
export const QUERY_KEY_DETAIL = "doctorAdminDetail";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetDoctorsAdmin = (params?: GetDoctorsAdminParams) => {
  const language = useGlobalUIStore((s) => s.language);
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  const stableParams = {
    ...params,
    translate_fields: params?.translate_fields?.join(","),
    target: params?.target ?? (language !== "es" ? language : undefined),
    source: params?.source ?? (language !== "es" ? "es" : undefined),
  };

  return useQuery<DoctorAdminListItem[]>({
    queryKey: [QUERY_KEY_LIST, language, stableParams],
    staleTime: 0,
    gcTime: 30_000,
    refetchIntervalInBackground: false,
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/doctores/admin", {
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

export const useGetDoctorAdminDetail = (id: number | null) => {
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  return useQuery<DoctorDetailAdmin>({
    queryKey: [QUERY_KEY_DETAIL, id],
    enabled: !!id,
    staleTime: 0,
    gcTime: 30_000,
    refetchInterval: 1000 * 20,
    refetchIntervalInBackground: false,
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/doctores/admin/${id}`);
        return (data?.data ?? data) as DoctorDetailAdmin;
      } finally {
        setIsLoading(false);
      }
    },
  });
};
