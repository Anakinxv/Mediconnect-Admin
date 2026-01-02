import MCMetricCard from "@/shared/components/MCMetricCard";
import { User, Stethoscope, Hospital } from "lucide-react";
import { useTranslation } from "react-i18next";

// Placeholder chart components
const PieChart = () => (
  <div className="bg-muted rounded-xl h-full mb-4 flex items-center justify-center bg-amber-500">
    Pie Chart
  </div>
);
const BarChart = () => (
  <div className="bg-muted rounded-xl h-64 mb-4 flex items-center justify-center bg-amber-500">
    Bar Chart
  </div>
);
const LineChart = () => (
  <div className="bg-muted rounded-xl h-64 mb-4 flex items-center justify-center bg-amber-500">
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

  return (
    <div className="flex gap-6">
      {/* Left column (70%) */}
      <div className="w-full md:w-[75%] flex flex-col gap-4">
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

      <div className="w-[25%] flex flex-col ">
        <PieChart />

        <PieChart />

        <PieChart />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
