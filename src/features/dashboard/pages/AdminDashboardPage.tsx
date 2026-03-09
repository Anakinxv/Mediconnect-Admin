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
type DataType = "All" | "Year" | "Monthly" | "ThreeMonths" | "Weekly";
interface ChartRow {
  label: string;
  consultas: number;
}

interface UsersChartRow {
  label: string;
  users: number;
}

function AdminDashboardPage() {
  const { t } = useTranslation("dashboard");

  const metricsData = [
    {
      id: 1,
      title: t("metrics.totalPatients"),
      icon: <User size={30} className="text-accent-foreground" />,
      value: 412,
      subtitle: t("metrics.patientsSubtitle"),
    },
    {
      id: 2,
      title: t("metrics.totalDoctors"),
      icon: <Stethoscope size={30} className="text-accent-foreground" />,
      value: 602,
      subtitle: t("metrics.doctorsSubtitle"),
    },
    {
      id: 3,
      title: t("metrics.totalHealthCenters"),
      icon: <Hospital size={30} className="text-accent-foreground" />,
      value: 100,
      subtitle: t("metrics.healthCentersSubtitle"),
    },
  ];

  const consultationsData: Record<DataType, ChartRow[]> = {
    Weekly: [
      { label: "Lun", consultas: 48 },
      { label: "Mar", consultas: 62 },
      { label: "Mié", consultas: 39 },
      { label: "Jue", consultas: 74 },
      { label: "Vie", consultas: 58 },
      { label: "Sáb", consultas: 31 },
      { label: "Dom", consultas: 19 },
    ],

    Monthly: [
      { label: "1", consultas: 28 },
      { label: "2", consultas: 35 },
      { label: "3", consultas: 42 },
      { label: "4", consultas: 38 },
      { label: "5", consultas: 46 },
      { label: "6", consultas: 52 },
      { label: "7", consultas: 40 },
      { label: "8", consultas: 55 },
      { label: "9", consultas: 60 },
      { label: "10", consultas: 48 },
      { label: "11", consultas: 63 },
      { label: "12", consultas: 58 },
      { label: "13", consultas: 66 },
      { label: "14", consultas: 70 },
      { label: "15", consultas: 62 },
      { label: "16", consultas: 68 },
      { label: "17", consultas: 74 },
      { label: "18", consultas: 59 },
      { label: "19", consultas: 65 },
      { label: "20", consultas: 72 },
      { label: "21", consultas: 78 },
      { label: "22", consultas: 69 },
      { label: "23", consultas: 75 },
      { label: "24", consultas: 82 },
      { label: "25", consultas: 77 },
      { label: "26", consultas: 85 },
      { label: "27", consultas: 80 },
      { label: "28", consultas: 88 },
      { label: "29", consultas: 83 },
      { label: "30", consultas: 90 },
    ],
    ThreeMonths: [
      { label: "Ene", consultas: 220 },
      { label: "Feb", consultas: 180 },
      { label: "Mar", consultas: 250 },
    ],

    Year: [
      { label: "Ene", consultas: 780 },
      { label: "Feb", consultas: 690 },
      { label: "Mar", consultas: 920 },
      { label: "Abr", consultas: 860 },
      { label: "May", consultas: 740 },
      { label: "Jun", consultas: 980 },
      { label: "Jul", consultas: 1020 },
      { label: "Ago", consultas: 950 },
      { label: "Sep", consultas: 870 },
      { label: "Oct", consultas: 920 },
      { label: "Nov", consultas: 990 },
      { label: "Dic", consultas: 1080 },
    ],

    All: [
      { label: "2016", consultas: 3200 },
      { label: "2017", consultas: 3600 },
      { label: "2018", consultas: 4100 },
      { label: "2019", consultas: 4500 },
      { label: "2020", consultas: 3900 },
      { label: "2021", consultas: 4800 },
      { label: "2022", consultas: 5200 },
      { label: "2023", consultas: 6100 },
      { label: "2024", consultas: 7400 },
      { label: "2025", consultas: 8200 },
    ],
  };

  const usersData: Record<DataType, UsersChartRow[]> = {
    Weekly: [
      { label: "Lun", users: 120 },
      { label: "Mar", users: 180 },
      { label: "Mié", users: 150 },
      { label: "Jue", users: 210 },
      { label: "Vie", users: 190 },
      { label: "Sáb", users: 90 },
      { label: "Dom", users: 70 },
    ],

    Monthly: [
      { label: "1", users: 120 },
      { label: "2", users: 135 },
      { label: "3", users: 150 },
      { label: "4", users: 142 },
      { label: "5", users: 168 },
      { label: "6", users: 180 },
      { label: "7", users: 160 },
      { label: "8", users: 175 },
      { label: "9", users: 185 },
      { label: "10", users: 170 },
      { label: "11", users: 190 },
      { label: "12", users: 200 },
      { label: "13", users: 210 },
      { label: "14", users: 220 },
      { label: "15", users: 205 },
      { label: "16", users: 215 },
      { label: "17", users: 230 },
      { label: "18", users: 195 },
      { label: "19", users: 205 },
      { label: "20", users: 220 },
      { label: "21", users: 235 },
      { label: "22", users: 225 },
      { label: "23", users: 240 },
      { label: "24", users: 255 },
      { label: "25", users: 245 },
      { label: "26", users: 260 },
      { label: "27", users: 250 },
      { label: "28", users: 270 },
      { label: "29", users: 265 },
      { label: "30", users: 280 },
    ],

    ThreeMonths: [
      { label: "Ene", users: 1200 },
      { label: "Feb", users: 980 },
      { label: "Mar", users: 1350 },
    ],

    Year: [
      { label: "Ene", users: 1200 },
      { label: "Feb", users: 1350 },
      { label: "Mar", users: 1500 },
      { label: "Abr", users: 1420 },
      { label: "May", users: 1680 },
      { label: "Jun", users: 1800 },
      { label: "Jul", users: 1750 },
      { label: "Ago", users: 1620 },
      { label: "Sep", users: 1580 },
      { label: "Oct", users: 1700 },
      { label: "Nov", users: 1850 },
      { label: "Dic", users: 2000 },
    ],

    All: [
      { label: "2016", users: 8200 },
      { label: "2017", users: 9100 },
      { label: "2018", users: 10400 },
      { label: "2019", users: 11800 },
      { label: "2020", users: 9600 },
      { label: "2021", users: 12500 },
      { label: "2022", users: 13800 },
      { label: "2023", users: 16200 },
      { label: "2024", users: 18900 },
      { label: "2025", users: 21500 },
    ],
  };

  const pieData1 = [
    { name: "Consulta médica", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Sesión física", value: 25, color: "hsl(var(--chart-2))" },
    { name: "Seguimiento", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Rehabilitación", value: 10, color: "hsl(var(--chart-4))" },
    { name: "Presión arterial", value: 6, color: "hsl(var(--chart-5))" },
    { name: "Ejercicios guiados", value: 4, color: "hsl(var(--chart-6))" },
  ];

  const pieData2 = [
    { name: "Consulta médica", value: 65, color: "hsl(var(--chart-1))" },
    { name: "TeleConsulta", value: 35, color: "hsl(var(--chart-4))" },
  ];

  const dataByPeriod: Record<
    string,
    { especialidad: string; rating: number }[]
  > = {
    "7d": [
      { especialidad: "Psicología", rating: 4.9 },
      { especialidad: "Medicina General", rating: 4.3 },
      { especialidad: "Nutrición", rating: 4.6 },
      { especialidad: "Pediatría", rating: 4.5 },
      { especialidad: "Cardiología", rating: 4.2 },
      { especialidad: "Dermatología", rating: 4.1 },
      { especialidad: "Ginecología", rating: 4.1 },
      { especialidad: "Traumatología", rating: 3.9 },
      { especialidad: "Oftalmología", rating: 3.8 },
      { especialidad: "Neurología", rating: 3.6 },
    ],
  };

  const [consultationsFilter, setConsultationsFilter] =
    useState<DataType>("Year");
  const [usersFilter, setUsersFilter] = useState<DataType>("Year");

  const filterOptions = [
    { label: t("filters.week"), value: "Weekly" },
    { label: t("filters.month"), value: "Monthly" },
    { label: t("filters.threeMonths"), value: "ThreeMonths" },
    { label: t("filters.year"), value: "Year" },
    { label: t("filters.all"), value: "All" },
  ];

  return (
    <motion.div
      {...fadeInUp}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full"
    >
      {/* Main content: 3/4 columns */}
      <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
        {/* KPIs */}
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
            <BarChart data={consultationsData[consultationsFilter]} />
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
            <AreaChart
              data={usersData[usersFilter].map(({ label, users }) => ({
                label,
                consultas: users,
              }))}
            />
          </div>
        </div>
      </div>

      {/* PieCharts: 1/4 column, charts split vertically */}
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-1">
          <PieChart
            data={pieData1}
            title={t("charts.services")}
            description={t("charts.servicesDescription")}
          />
        </div>
        <div className="flex-1">
          <PieChart
            data={pieData2}
            title={t("charts.consultations")}
            description={t("charts.consultationsDescription")}
          />
        </div>
        <div className="flex-1">
          <TopSpecialtiesChart
            data={dataByPeriod["7d"]}
            title={t("charts.topSpecialties")}
            description={t("charts.topSpecialtiesDescription")}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboardPage;
