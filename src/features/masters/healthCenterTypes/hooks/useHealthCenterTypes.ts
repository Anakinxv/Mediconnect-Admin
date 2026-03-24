import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface HealthCenterTypeInterface {
  id: number;
  nombre: string;
  status?: string; // optimistic local
  estado?: string; // real API field: "Activo" | "Inactivo"
  creadoEn: string;
}

export type GetHealthCenterTypesParams = {
  target?: string;
  source?: string;
  translate_fields?: string[];
  nombre?: string;
  estado?: string;
  pagina?: number;
  limite?: number;
};

type CreateHealthCenterTypePayload = {
  nombre: string;
  estado?: string;
};

type UpdateHealthCenterTypePayload = {
  id: number;
  nombre?: string;
  estado?: string;
};

const QUERY_KEY = "healthCenterTypes";

const normalizeHealthCenterTypes = (
  input: unknown,
): HealthCenterTypeInterface[] => {
  if (Array.isArray(input)) return input as HealthCenterTypeInterface[];
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    for (const c of [obj.data, obj.items, obj.tipos]) {
      if (Array.isArray(c)) return c as HealthCenterTypeInterface[];
    }
  }
  return [];
};

export const useGetHealthCenterTypes = (
  params?: GetHealthCenterTypesParams,
) => {
  const language = useGlobalUIStore((s) => s.language);

  const stableParams = {
    ...params,
    translate_fields: params?.translate_fields?.join(","),
    target: params?.target ?? (language !== "es" ? language : undefined),
    source: params?.source ?? (language !== "es" ? "es" : undefined),
  };

  return useQuery<HealthCenterTypeInterface[]>({
    queryKey: [QUERY_KEY, language, stableParams],
    queryFn: async () => {
      const { data } = await api.get("/tipos-centros-salud", {
        params: stableParams,
      });
      return normalizeHealthCenterTypes(data);
    },
  });
};

export const useCreateHealthCenterType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateHealthCenterTypePayload) => {
      const { data } = await api.post("/tipos-centros-salud", payload);
      // API returns { success: true, message: { id, nombre, estado, creadoEn } }
      return (data?.message ?? data) as HealthCenterTypeInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateHealthCenterType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateHealthCenterTypePayload) => {
      const { data } = await api.put(`/tipos-centros-salud/${id}`, payload);
      return (data?.message ?? data) as HealthCenterTypeInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useDeleteHealthCenterType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tipos-centros-salud/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useToggleHealthCenterTypeStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: string }) => {
      const { data } = await api.put(`/tipos-centros-salud/${id}`, { estado });
      return (data?.message ?? data) as HealthCenterTypeInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
