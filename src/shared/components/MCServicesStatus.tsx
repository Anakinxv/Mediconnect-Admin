import { Badge } from "@/shared/ui/badge";
import { useTranslation } from "react-i18next";

interface MCServicesStatusProps {
  status: "active" | "inactive";
  variant?: "default" | "card";
  className?: string;
}

function MCServicesStatus({
  status,
  variant = "card",
  className = "",
}: MCServicesStatusProps) {
  const { t } = useTranslation("doctor");

  const statusMap: Record<
    MCServicesStatusProps["status"],
    { label: string; color: string }
  > = {
    active: {
      label: t("services.status.active", "Activo"),
      color:
        variant === "card"
          ? "bg-[#2E7D32]/40 text-white"
          : "bg-[#2E7D32]/10 dark:bg-[#2E7D32]/20 text-[#2E7D32]",
    },
    inactive: {
      label: t("services.status.inactive", "Inactivo"),
      color:
        variant === "card"
          ? "bg-gray-500/80 text-white dark:bg-gray-700/80 dark:text-gray-300"
          : "bg-[#9E9E9E]/10 text-[#9E9E9E]  dark:bg-[#616161]/20 dark:text-[#BDBDBD]",
    },
  };

  const { label, color } = statusMap[status] || {
    label: status,
    color: "bg-muted text-muted-foreground",
  };

  const sizeClass =
    variant === "card"
      ? "px-4 py-1 text-sm font-medium"
      : "px-3 py-1 text-xs font-medium";

  return (
    <Badge
      className={`rounded-full ${sizeClass} ${color} ${className} ${
        variant === "card"
          ? " backdrop-blur-xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,2.2)]"
          : ""
      }`}
    >
      {label}
    </Badge>
  );
}

export default MCServicesStatus;
