import api from "@/config/axios-client";
import { useQuery } from "@tanstack/react-query";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

export type DataType = "All" | "Year" | "Monthly" | "ThreeMonths" | "Weekly";

export const PERIOD_MAP: Record<DataType, string> = {
  Weekly: "semana",
  Monthly: "mes",
  ThreeMonths: "3meses",
  Year: "año",
  All: "todo",
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface KpiItem {
  total: number;
  totalPeriodoAnterior: number;
  cambioPorcentaje: number;
}

export interface DashboardResumen {
  pacientes: KpiItem;
  doctores: KpiItem;
  centrosSalud: KpiItem;
}

export interface ChartRow {
  label: string;
  consultas: number;
}

export interface UsersChartRow {
  label: string;
  users: number;
}

export interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export interface TopSpecialtyItem {
  especialidad: string;
  rating: number;
  totalResenas?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

type RawDatoItem = { etiqueta: string; total: number };

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * KPIs principales: totales de pacientes, doctores y centros de salud
 * con % de cambio respecto al periodo anterior.
 */
export const useResumen = (periodo: DataType) => {
  return useQuery<DashboardResumen>({
    queryKey: ["dashboard-resumen", periodo],
    queryFn: async () => {
      const { data } = await api.get("/admin/estadisticas/resumen", {
        params: { periodo: PERIOD_MAP[periodo] },
      });
      return data.data as DashboardResumen;
    },
  });
};

/**
 * Citas agrupadas por periodo para el gráfico de barras.
 * La granularidad es adaptativa según el periodo seleccionado.
 */
export const useConsultas = (periodo: DataType) => {
  return useQuery<ChartRow[]>({
    queryKey: ["dashboard-consultas", periodo],
    queryFn: async () => {
      const { data } = await api.get("/admin/estadisticas/consultas", {
        params: { periodo: PERIOD_MAP[periodo] },
      });
      return (data.data.datos as RawDatoItem[]).map((d) => ({
        label: d.etiqueta,
        consultas: d.total,
      }));
    },
  });
};

/**
 * Usuarios registrados por periodo para el gráfico de área.
 */
export const useUsuarios = (periodo: DataType) => {
  return useQuery<UsersChartRow[]>({
    queryKey: ["dashboard-usuarios", periodo],
    queryFn: async () => {
      const { data } = await api.get("/admin/estadisticas/usuarios", {
        params: { periodo: PERIOD_MAP[periodo] },
      });
      return (data.data.datos as RawDatoItem[]).map((d) => ({
        label: d.etiqueta,
        users: d.total,
      }));
    },
  });
};

/**
 * Distribución de servicios en citas para el gráfico de torta.
 * Soporta traducción automática del campo `nombre`.
 */
export const useServicios = (periodo: DataType) => {
  const language = useGlobalUIStore((s) => s.language);

  return useQuery<PieDataItem[]>({
    queryKey: ["dashboard-servicios", periodo, language],
    queryFn: async () => {
      const { data } = await api.get("/admin/estadisticas/servicios", {
        params: {
          periodo: PERIOD_MAP[periodo],
          limite: 8,
          ...(language !== "es" && {
            target: language,
            source: "es",
            translate_fields: "nombre",
          }),
        },
      });
      return (data.data.datos as { nombre: string; porcentaje: number }[]).map(
        (d, i) => ({
          name: d.nombre,
          value: d.porcentaje,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }),
      );
    },
  });
};

/**
 * Presencial vs Teleconsulta para el segundo gráfico de torta.
 */
export const useTipoConsulta = (periodo: DataType) => {
  return useQuery<PieDataItem[]>({
    queryKey: ["dashboard-tipo-consulta", periodo],
    queryFn: async () => {
      const { data } = await api.get("/admin/estadisticas/tipo-consulta", {
        params: { periodo: PERIOD_MAP[periodo] },
      });
      const d = data.data;
      return [
        {
          name: "Presencial",
          value: d.porcentajePresencial,
          color: "hsl(var(--chart-1))",
        },
        {
          name: "TeleConsulta",
          value: d.porcentajeTeleconsulta,
          color: "hsl(var(--chart-4))",
        },
      ];
    },
  });
};

/**
 * Top especialidades por calificación promedio para el panel lateral.
 * Soporta traducción automática del campo `nombre`.
 */
export const useTopEspecialidades = () => {
  const language = useGlobalUIStore((s) => s.language);

  return useQuery<TopSpecialtyItem[]>({
    queryKey: ["dashboard-top-especialidades", language],
    queryFn: async () => {
      const { data } = await api.get("/admin/estadisticas/top-especialidades", {
        params: {
          limite: 10,
          ...(language !== "es" && {
            target: language,
            source: "es",
            translate_fields: "nombre",
          }),
        },
      });
      return (
        data.data.datos as {
          nombre: string;
          calificacionPromedio: number;
          totalResenas: number;
        }[]
      ).map((d) => ({
        especialidad: d.nombre,
        rating: d.calificacionPromedio,
        totalResenas: d.totalResenas,
      }));
    },
  });
};
