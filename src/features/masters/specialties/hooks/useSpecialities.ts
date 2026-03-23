import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

interface SpecialityInterface {
  id: number;
  nombre: string;
  descripcion: string;
  status?: string; // optimistic local
  estado?: string; // real API field: "Activo" | "Inactivo"
  creadoEn: string;
}

type GetSpecialitiesParams = {
  target?: string;
  source?: string;
  translate_fields?: string[];
  nombre?: string;
  estado?: string;
  pagina?: number;
  limite?: number;
};

type CreateSpecialityPayload = {
  nombre: string;
  descripcion: string;
  estado?: string;
};

type UpdateSpecialityPayload = {
  id: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
};

const QUERY_KEY = "specialities";

const normalizeSpecialities = (input: unknown): SpecialityInterface[] => {
  if (Array.isArray(input)) return input as SpecialityInterface[];
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    for (const c of [obj.data, obj.items, obj.specialities]) {
      if (Array.isArray(c)) return c as SpecialityInterface[];
    }
  }
  return [];
};

const useGetSpecialities = (params?: GetSpecialitiesParams) => {
  const language = useGlobalUIStore((s) => s.language);

  const stableParams = {
    ...params,
    translate_fields: params?.translate_fields?.join(","),
    target: params?.target ?? (language !== "es" ? language : undefined),
    source: params?.source ?? (language !== "es" ? "es" : undefined),
  };

  return useQuery<SpecialityInterface[]>({
    queryKey: [QUERY_KEY, language, stableParams],
    queryFn: async () => {
      const { data } = await api.get("/especialidades", {
        params: stableParams,
      });
      return normalizeSpecialities(data);
    },
  });
};

const useCreateSpeciality = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSpecialityPayload) => {
      const { data } = await api.post("/especialidades", payload);
      // API returns { success, message: { id, nombre, ... } }
      return (data?.message ?? data) as SpecialityInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const useUpdateSpeciality = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateSpecialityPayload) => {
      const { data } = await api.patch(`/especialidades/${id}`, payload);
      return (data?.message ?? data) as SpecialityInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const useDeleteSpeciality = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/especialidades/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const useToggleSpecialityStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: string }) => {
      const { data } = await api.patch(`/especialidades/${id}`, { estado });
      return (data?.message ?? data) as SpecialityInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export {
  useGetSpecialities,
  useCreateSpeciality,
  useUpdateSpeciality,
  useDeleteSpeciality,
  useToggleSpecialityStatus,
  type SpecialityInterface,
  type GetSpecialitiesParams,
};
