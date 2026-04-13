import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface PatientFiltersProps {
  filters: {
    dateRange?: [Date, Date];
    status?: string;
  };
  onFiltersChange: (filters: Partial<PatientFiltersProps["filters"]>) => void;
}

function PatientFilters({ filters, onFiltersChange }: PatientFiltersProps) {
  const { t } = useTranslation("common");

  const statusOptions = [
    { value: "all", label: t("filters.all", "Todos") },
    { value: "Activo", label: t("filters.active", "Activo") },
    { value: "Inactivo", label: t("filters.inactive", "Inactivo") },
  ];

  const handleStatusChange = (value: string | string[]) => {
    onFiltersChange({ status: Array.isArray(value) ? value[0] : value });
  };

  return (
    <div className="flex flex-col gap-4">
      <MCFilterSelect
        name="status"
        label={t("table.status", "Estado")}
        value={filters.status || "all"}
        onChange={handleStatusChange}
        options={statusOptions}
        placeholder={t("table.status", "Estado")}
        size="small"
      />

      <MCFilterDates
        label={t("patients.filters.dateRangeLabel")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}

export default PatientFilters;
