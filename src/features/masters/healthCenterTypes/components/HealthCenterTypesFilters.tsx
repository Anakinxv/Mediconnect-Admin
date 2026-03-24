import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface HealthCenterTypesFiltersProps {
  filters: {
    status: string;
    dateRange?: [Date, Date];
  };
  onFiltersChange: (
    newFilters: Partial<HealthCenterTypesFiltersProps["filters"]>,
  ) => void;
}

export default function HealthCenterTypesFilters({
  filters,
  onFiltersChange,
}: HealthCenterTypesFiltersProps) {
  const { t } = useTranslation("healthCenterType");

  const statusOptions = [
    {
      value: "all",
      label: t("healthCenterTypes.filters.allStatus", "Todos los estados"),
    },
    {
      value: "active",
      label: t("healthCenterTypes.status.active", "Activo"),
    },
    {
      value: "inactive",
      label: t("healthCenterTypes.status.inactive", "Inactivo"),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <MCFilterSelect
        name="status"
        label={t("table.status", "Estado")}
        value={filters.status}
        onChange={(value) =>
          onFiltersChange({ status: Array.isArray(value) ? value[0] : value })
        }
        options={statusOptions}
        placeholder={t(
          "healthCenterTypes.filters.selectStatus",
          "Seleccionar estado",
        )}
        size="small"
      />
      <MCFilterDates
        label={t("healthCenterTypes.table.createdAt", "Fecha de Creación")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
