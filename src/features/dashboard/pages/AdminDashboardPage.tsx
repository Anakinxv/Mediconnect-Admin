import MCMetricCard from "@/shared/components/MCMetricCard";
import { User, Stethoscope, Hospital } from "lucide-react";
import { useTranslation } from "react-i18next";

function AdminDashboardPage() {
  const { t } = useTranslation("dashboard");

  const metricsData = [
    {
      id: 1,
      title: t("metrics.totalPatients"),
      icon: <User size={30} />,
      value: 412,
      subtitle: t("metrics.patientsSubtitle"),
    },
    {
      id: 2,
      title: t("metrics.totalDoctors"),
      icon: <Stethoscope size={30} />,
      value: 602,
      subtitle: t("metrics.doctorsSubtitle"),
    },
    {
      id: 3,
      title: t("metrics.totalHealthCenters"),
      icon: <Hospital size={30} />,
      value: 100,
      subtitle: t("metrics.healthCentersSubtitle"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
  );
}

export default AdminDashboardPage;
