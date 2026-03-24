import api from "@/config/axios-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export interface InsuranceInterface {
  id: number;
  nombre: string;
  urlImage?: string;
  status?: string;
  estado?: string;
  creadoEn: string;
}

export type GetInsurancesParams = {
  target?: string;
  source?: string;
  translate_fields?: string[];
  estado?: string;
  pagina?: number;
  limite?: number;
};

type CreateInsurancePayload = {
  nombre: string;
  urlImage?: string;
  estado?: string;
};

type UpdateInsurancePayload = {
  id: number;
  nombre?: string;
  urlImage?: string;
  estado?: string;
};

const QUERY_KEY = "insurances";

const cleanParams = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""),
  );

const sanitizeImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("data:")) return undefined;
  return url;
};

const normalizeInsurances = (input: unknown): InsuranceInterface[] => {
  if (Array.isArray(input)) return input as InsuranceInterface[];
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    for (const c of [obj.data, obj.items, obj.message]) {
      if (Array.isArray(c)) return c as InsuranceInterface[];
    }
  }
  return [];
};

const useGetInsurances = (params?: GetInsurancesParams) => {
  const language = useGlobalUIStore((s) => s.language);

  return useQuery<InsuranceInterface[]>({
    queryKey: [QUERY_KEY, language, params],
    queryFn: async () => {
      const rawParams = {
        ...params,
        translate_fields: params?.translate_fields?.join(","),
        target: language !== "es" ? language : undefined,
        source: language !== "es" ? "es" : undefined,
      };
      const { data } = await api.get("/seguros", {
        params: cleanParams(rawParams as Record<string, unknown>),
      });
      return normalizeInsurances(data?.data ?? data?.message ?? data);
    },
  });
};

const useCreateInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateInsurancePayload) => {
      const { data } = await api.post(
        "/seguros",
        cleanParams({
          nombre: payload.nombre,
          urlImage: sanitizeImageUrl(payload.urlImage),
          estado: payload.estado,
        }),
      );
      return (data?.message ?? data) as InsuranceInterface;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

const useUpdateInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateInsurancePayload) => {
      const { data } = await api.patch(
        `/seguros/${id}`,
        cleanParams({
          nombre: payload.nombre,
          urlImage: sanitizeImageUrl(payload.urlImage),
          estado: payload.estado,
        }),
      );
      return (data?.message ?? data) as InsuranceInterface;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

const useDeleteInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/seguros/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

const useToggleInsuranceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: number; estado: string }) => {
      const { data } = await api.patch(`/seguros/${id}`, { estado });
      return (data?.message ?? data) as InsuranceInterface;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export {
  useGetInsurances,
  useCreateInsurance,
  useUpdateInsurance,
  useDeleteInsurance,
  useToggleInsuranceStatus,
};
