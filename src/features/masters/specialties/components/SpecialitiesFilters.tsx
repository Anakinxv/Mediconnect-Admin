import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface SpecialitiesFiltersProps {
  filters: {
    status: string;
    dateRange?: [Date, Date];
  };
  onFiltersChange: (
    newFilters: Partial<SpecialitiesFiltersProps["filters"]>,
  ) => void;
}

export default function SpecialitiesFilters({
  filters,
  onFiltersChange,
}: SpecialitiesFiltersProps) {
  const { t } = useTranslation("specialties");

  const statusOptions = [
    {
      value: "all",
      label: t("specialities.filters.allStatus", "Todos los estados"),
    },
    { value: "active", label: t("specialities.status.active", "Activo") },
    { value: "inactive", label: t("specialities.status.inactive", "Inactivo") },
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
          "specialities.filters.selectStatus",
          "Seleccionar estado",
        )}
        size="small"
      />
      <MCFilterDates
        label={t("table.registrationDate", "Fecha de Creación")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
