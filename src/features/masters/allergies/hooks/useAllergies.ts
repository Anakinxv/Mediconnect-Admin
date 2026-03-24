import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface AllergyInterface {
  id: number;
  nombre: string;
  descripcion: string;
  tipo?: string; // siempre "Alergia" para admin
  status?: string; // optimistic local
  estado?: string; // real API field: "Activa" | "Inactiva"
  creadoEn: string;
}

export type GetAllergiesParams = {
  target?: string;
  source?: string;
  translate_fields?: string[];
  nombre?: string;
  estado?: string;
  pagina?: number;
  limite?: number;
};

type CreateAllergyPayload = {
  nombre: string;
  descripcion: string;
};

type UpdateAllergyPayload = {
  id: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
};

const QUERY_KEY = "allergies";

const normalizeAllergies = (input: unknown): AllergyInterface[] => {
  if (Array.isArray(input)) return input as AllergyInterface[];
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    for (const c of [obj.data, obj.items, obj.condiciones]) {
      if (Array.isArray(c)) return c as AllergyInterface[];
    }
  }
  return [];
};

export const useGetAllergies = (params?: GetAllergiesParams) => {
  const language = useGlobalUIStore((s) => s.language);

  const stableParams = {
    ...params,
    translate_fields: params?.translate_fields?.join(","),
    target: params?.target ?? (language !== "es" ? language : undefined),
    source: params?.source ?? (language !== "es" ? "es" : undefined),
  };

  return useQuery<AllergyInterface[]>({
    queryKey: [QUERY_KEY, language, stableParams],
    queryFn: async () => {
      const { data } = await api.get("/condiciones-medicas", {
        params: stableParams,
      });
      return normalizeAllergies(data);
    },
  });
};

export const useCreateAllergy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAllergyPayload) => {
      const { data } = await api.post("/condiciones-medicas", payload);
      // API returns { success: true, message: { id, nombre, descripcion, tipo, estado, creadoEn } }
      return (data?.message ?? data) as AllergyInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateAllergy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateAllergyPayload) => {
      const { data } = await api.patch(`/condiciones-medicas/${id}`, payload);
      return (data?.message ?? data) as AllergyInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useDeleteAllergy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/condiciones-medicas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useToggleAllergyStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: string }) => {
      const { data } = await api.patch(`/condiciones-medicas/${id}`, {
        estado,
      });
      return (data?.message ?? data) as AllergyInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
