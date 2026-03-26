// src/features/users/hooks/patients/usePatients.ts
import api from "@/config/axios-client";
import { useQuery } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface PatientAdminListItem {
  id: number;
  usuarioId: number;
  nombre: string;
  apellido: string;
  tipoDocIdentificacion: string;
  numeroDocumentoIdentificacion: string;
  fechaNacimiento: string;
  genero: string;
  altura: number | null;
  peso: number | null;
  tipoSangre: string | null;
  ubicacionId: number | null;
  estado: string;
  creadoEn: string;
  actualizadoEn: string | null;
  email: string;
  telefono: string | null;
  fotoPerfil: string | null;
  banner: string | null;
  rol: string;
  ubicacion: any | null;
}

export interface PatientDetailAdmin extends PatientAdminListItem {
  // En tu API actual, el detalle devuelve la misma estructura base
}

export type GetPatientsAdminParams = {
  nombre?: string;
  apellido?: string;
  estado?: string;
  genero?: string;
  tipoSangre?: string;
  pagina?: number;
  limite?: number;
  target?: string;
  source?: string;
  translate_fields?: string; // string separado por comas
};

const QUERY_KEY_LIST = "patientsAdmin";
const QUERY_KEY_DETAIL = "patientAdminDetail";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const calculateAge = (birthDateString: string): string => {
  if (!birthDateString) return "—";
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
};

export const mapGender = (genero: string): string => {
  if (genero === "M") return "Masculino";
  if (genero === "F") return "Femenino";
  return genero;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetPatientsAdmin = (params?: GetPatientsAdminParams) => {
  const language = useGlobalUIStore((s) => s.language);
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  const stableParams = {
    ...params,
    target: params?.target ?? (language !== "es" ? language : undefined),
    source: params?.source ?? (language !== "es" ? "es" : undefined),
    translate_fields: params?.translate_fields ?? "nombre,apellido",
  };

  return useQuery<PatientAdminListItem[]>({
    queryKey: [QUERY_KEY_LIST, language, stableParams],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/pacientes/admin", {
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

export const useGetPatientAdminDetail = (id: number | null | string) => {
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  return useQuery<PatientDetailAdmin>({
    queryKey: [QUERY_KEY_DETAIL, id],
    enabled: !!id,
    staleTime: 0,
    gcTime: 30_000,
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/pacientes/admin/${id}`);
        return (data?.data ?? data) as PatientDetailAdmin;
      } finally {
        setIsLoading(false);
      }
    },
  });
};
