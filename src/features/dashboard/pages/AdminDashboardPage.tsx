import MCMetricCard from "@/shared/components/MCMetricCard";
import { User, Stethoscope, Hospital } from "lucide-react";
import { useTranslation } from "react-i18next";
import PieChart from "../components/PieChart";

const BarChart = () => (
  <div className="bg-muted rounded-xl h-64 flex items-center justify-center bg-amber-500">
    Bar Chart
  </div>
);
const LineChart = () => (
  <div className="bg-muted rounded-xl h-64 flex items-center justify-center bg-amber-500">
    Line Chart
  </div>
);

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

  const pieData1 = [
    { name: "Consulta médica", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Sesión física", value: 25, color: "hsl(var(--chart-2))" },
    { name: "Seguimiento", value: 20, color: "hsl(var(--chart-3))" }, // Changed from chart-2
    { name: "Rehabilitación", value: 10, color: "hsl(var(--chart-4))" },
    { name: "Presión arterial", value: 6, color: "hsl(var(--chart-5))" }, // Changed from chart-6
    { name: "Ejercicios guiados", value: 4, color: "hsl(var(--chart-6))" }, // Changed from chart-5
  ];

  const pieData2 = [
    { name: "Consulta médica", value: 65, color: "hsl(var(--chart-1))" },
    { name: "TeleConsulta", value: 35, color: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[80vh] bg-red-500">
      {/* Main content: 3/4 columns */}
      <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
        <BarChart />
        <LineChart />
      </div>

      {/* PieCharts: 1/4 column, charts split vertically */}
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-1">
          <PieChart
            data={pieData1}
            title="Servicios"
            description="Distribución de servicios"
          />
        </div>
        <div className="flex-1">
          <PieChart
            data={pieData2}
            title="Consultas"
            description="Tipo de consulta"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
