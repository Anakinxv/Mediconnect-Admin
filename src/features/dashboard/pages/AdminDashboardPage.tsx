import MCMetricCard from "@/shared/components/MCMetricCard";
import { User, Stethoscope, Hospital } from "lucide-react";
import { useTranslation } from "react-i18next";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import AreaChart from "../components/AreaChart";
import TopSpecialtiesChart from "../components/TopSpecialtiesChart";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/commonAnimations";
import {
  type DataType,
  useResumen,
  useConsultas,
  useUsuarios,
  useServicios,
  useTipoConsulta,
  useTopEspecialidades,
} from "../hooks/useDashboard";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Formatea el porcentaje de cambio como string para el subtítulo del KPI */
function formatCambio(cambioPorcentaje: number): string {
  if (cambioPorcentaje === 0) return "0%";
  const sign = cambioPorcentaje > 0 ? "+" : "";
  return `${sign}${cambioPorcentaje.toFixed(1)}%`;
}

// ─── Component ────────────────────────────────────────────────────────────────

function AdminDashboardPage() {
  const { t } = useTranslation("dashboard");

  // ── Filter state ─────────────────────────────────────────────────────────
  const [kpiPeriod, setKpiPeriod] = useState<DataType>("Monthly");
  const [consultationsFilter, setConsultationsFilter] =
    useState<DataType>("Year");
  const [usersFilter, setUsersFilter] = useState<DataType>("Year");

  // La torta de servicios y tipo-consulta comparten el filtro de consultas
  const pieFilter = consultationsFilter;

  // ── API data ─────────────────────────────────────────────────────────────
  const { data: resumen, isLoading: resumenLoading } = useResumen(kpiPeriod);
  const { data: consultasData = [], isLoading: consultasLoading } =
    useConsultas(consultationsFilter);
  const { data: usuariosData = [], isLoading: usuariosLoading } =
    useUsuarios(usersFilter);
  const { data: serviciosData = [], isLoading: serviciosLoading } =
    useServicios(pieFilter);
  const { data: tipoConsultaData = [], isLoading: tipoConsultaLoading } =
    useTipoConsulta(pieFilter);
  const { data: topEspecialidadesData = [], isLoading: topEspLoading } =
    useTopEspecialidades();

  // ── Metrics cards ─────────────────────────────────────────────────────────
  const metricsData = [
    {
      id: 1,
      title: t("metrics.totalPatients"),
      icon: <User size={30} className="text-accent-foreground" />,
      value: resumen?.pacientes.total ?? 0,
      subtitle: resumenLoading
        ? "..."
        : `${formatCambio(resumen?.pacientes.cambioPorcentaje ?? 0)} ${t("metrics.patientsSubtitle")}`,
    },
    {
      id: 2,
      title: t("metrics.totalDoctors"),
      icon: <Stethoscope size={30} className="text-accent-foreground" />,
      value: resumen?.doctores.total ?? 0,
      subtitle: resumenLoading
        ? "..."
        : `${formatCambio(resumen?.doctores.cambioPorcentaje ?? 0)} ${t("metrics.doctorsSubtitle")}`,
    },
    {
      id: 3,
      title: t("metrics.totalHealthCenters"),
      icon: <Hospital size={30} className="text-accent-foreground" />,
      value: resumen?.centrosSalud.total ?? 0,
      subtitle: resumenLoading
        ? "..."
        : `${formatCambio(resumen?.centrosSalud.cambioPorcentaje ?? 0)} ${t("metrics.healthCentersSubtitle")}`,
    },
  ];

  // ── Filter options ────────────────────────────────────────────────────────
  const filterOptions = [
    { label: t("filters.week"), value: "Weekly" },
    { label: t("filters.month"), value: "Monthly" },
    { label: t("filters.threeMonths"), value: "ThreeMonths" },
    { label: t("filters.year"), value: "Year" },
    { label: t("filters.all"), value: "All" },
  ];

  const kpiFilterOptions = [
    { label: t("filters.week"), value: "Weekly" },
    { label: t("filters.month"), value: "Monthly" },
    { label: t("filters.threeMonths"), value: "ThreeMonths" },
    { label: t("filters.year"), value: "Year" },
  ];

  // ── Users data normalization (AreaChart expects { label, consultas }) ─────
  const usuariosNormalized = usuariosData.map(({ label, users }) => ({
    label,
    consultas: users,
  }));

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      {...fadeInUp}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full"
    >
      {/* Main content: 3/4 columns */}
      <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
        {/* KPIs */}
        <div className="bg-background rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
          <h2 className="text-2xl font-medium text-muted-foreground">
            {t("filters.filterBy")}
          </h2>
          <div className="w-full sm:w-40">
            <MCFilterSelect
              name="kpiPeriod"
              options={kpiFilterOptions}
              value={kpiPeriod}
              onChange={(value) => setKpiPeriod(value as DataType)}
              placeholder={t("filters.filterBy")}
              size="small"
              className="mb-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metricsData.map((metric) => (
            <MCMetricCard
              key={metric.id}
              title={metric.title}
              icon={metric.icon}
              value={metric.value}
              subtitle={metric.subtitle}
            />
          ))}
        </div>

        {/* Consultations BarChart */}
        <div className="bg-background rounded-3xl p-4 flex flex-col shadow-sm gap-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold">
              {t("charts.consultationsTitle")}
            </h2>
            <div className="w-full sm:w-40">
              <MCFilterSelect
                name="consultationsFilter"
                options={filterOptions}
                value={consultationsFilter}
                onChange={(value) => setConsultationsFilter(value as DataType)}
                placeholder={t("filters.filterBy")}
                size="small"
                className="mb-0"
              />
            </div>
          </div>
          <div className="h-[350px] w-full">
            {consultasLoading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                {t("common.loading", "Cargando...")}
              </div>
            ) : (
              <BarChart data={consultasData} />
            )}
          </div>
        </div>

        {/* Users AreaChart */}
        <div className="bg-background rounded-3xl p-4 flex flex-col gap-4 w-full shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold">{t("charts.usersTitle")}</h2>
            <div className="w-full sm:w-40">
              <MCFilterSelect
                name="usersFilter"
                options={filterOptions}
                value={usersFilter}
                onChange={(value) => setUsersFilter(value as DataType)}
                placeholder={t("filters.filterBy")}
                size="small"
                className="mb-0"
              />
            </div>
          </div>
          <div className="h-[350px] w-full">
            {usuariosLoading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                {t("common.loading", "Cargando...")}
              </div>
            ) : (
              <AreaChart data={usuariosNormalized} />
            )}
          </div>
        </div>
      </div>

      {/* PieCharts: 1/4 column, charts split vertically */}
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-1">
          {serviciosLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              {t("common.loading", "Cargando...")}
            </div>
          ) : (
            <PieChart
              data={serviciosData}
              title={t("charts.services")}
              description={t("charts.servicesDescription")}
            />
          )}
        </div>
        <div className="flex-1">
          {tipoConsultaLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              {t("common.loading", "Cargando...")}
            </div>
          ) : (
            <PieChart
              data={tipoConsultaData}
              title={t("charts.consultations")}
              description={t("charts.consultationsDescription")}
            />
          )}
        </div>
        <div className="flex-1">
          {topEspLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              {t("common.loading", "Cargando...")}
            </div>
          ) : (
            <TopSpecialtiesChart
              data={topEspecialidadesData}
              title={t("charts.topSpecialties")}
              description={t("charts.topSpecialtiesDescription")}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboardPage;
