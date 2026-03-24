import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface InsuranceTypeInterface {
  id: number;
  nombre: string;
  descripcion?: string | null;
  status?: string; // optimistic local
  estado?: string; // API field: "Activo" | "Inactivo"
  creadoEn: string;
}

export type GetInsuranceTypesParams = {
  target?: string;
  source?: string;
  translate_fields?: string[];
  estado?: string;
  busqueda?: string;
  pagina?: number;
  limite?: number;
};

type CreateInsuranceTypePayload = {
  nombre: string;
  descripcion: string;
};

type UpdateInsuranceTypePayload = {
  id: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
};

const QUERY_KEY = "insuranceTypes";

const normalizeInsuranceTypes = (input: unknown): InsuranceTypeInterface[] => {
  if (Array.isArray(input)) return input as InsuranceTypeInterface[];
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    for (const c of [obj.data, obj.items, obj.insuranceTypes, obj.message]) {
      if (Array.isArray(c)) return c as InsuranceTypeInterface[];
    }
  }
  return [];
};

const useGetInsuranceTypes = (params?: GetInsuranceTypesParams) => {
  const language = useGlobalUIStore((s) => s.language);

  const stableParams = {
    ...params,
    translate_fields: params?.translate_fields?.join(","),
    target: params?.target ?? (language !== "es" ? language : undefined),
    source: params?.source ?? (language !== "es" ? "es" : undefined),
  };

  return useQuery<InsuranceTypeInterface[]>({
    queryKey: [QUERY_KEY, language, stableParams],
    queryFn: async () => {
      const { data } = await api.get("/tipos-seguros", {
        params: stableParams,
      });
      return normalizeInsuranceTypes(data);
    },
  });
};

const useCreateInsuranceType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateInsuranceTypePayload) => {
      const { data } = await api.post("/tipos-seguros", payload);
      return (data?.message ?? data) as InsuranceTypeInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const useUpdateInsuranceType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateInsuranceTypePayload) => {
      const { data } = await api.patch(`/tipos-seguros/${id}`, payload);
      return (data?.message ?? data) as InsuranceTypeInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const useDeleteInsuranceType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tipos-seguros/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const useToggleInsuranceTypeStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: string }) => {
      const { data } = await api.patch(`/tipos-seguros/${id}`, { estado });
      return (data?.message ?? data) as InsuranceTypeInterface;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export {
  useGetInsuranceTypes,
  useCreateInsuranceType,
  useUpdateInsuranceType,
  useDeleteInsuranceType,
  useToggleInsuranceTypeStatus,
};
