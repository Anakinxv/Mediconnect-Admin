import MCMetricCard from "@/shared/components/MCMetricCard";
import { User, Stethoscope, Hospital } from "lucide-react";

const metricsData = [
  {
    id: 1,
    title: "Total de Pacientes",
    icon: <User size={30} />,
    value: 412,
    subtitle: "Cantidad total de pacientes registrados en la aplicación.",
  },
  {
    id: 2,
    title: "Total de Doctores",
    icon: <Stethoscope size={30} />,
    value: 602,
    subtitle: "Cantidad total de doctores registrados en la aplicación.",
  },
  {
    id: 3,
    title: "Total de Centros de salud",
    icon: <Hospital size={30} />,
    value: 100,
    subtitle:
      "Cantidad total de centros de salud registrados en la aplicación.",
  },
];

function AdminDashboardPage() {
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
