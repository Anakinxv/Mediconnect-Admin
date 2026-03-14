import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface PatientFiltersProps {
  filters: {
    status: string;
    dateRange?: [Date, Date];
  };
  onFiltersChange: (filters: Partial<PatientFiltersProps["filters"]>) => void;
}

function PatientFilters({ filters, onFiltersChange }: PatientFiltersProps) {
  const { t } = useTranslation("common");

  const statusOptions = [
    { value: "all", label: t("patients.filters.status.all") },
    { value: "approved", label: t("patients.filters.status.approved") },
    { value: "pending", label: t("patients.filters.status.pending") },
    { value: "rejected", label: t("patients.filters.status.rejected") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <MCFilterSelect
        name="status"
        label={t("patients.filters.statusLabel")}
        options={statusOptions}
        value={filters.status}
        onChange={(value) => onFiltersChange({ status: value as string })}
        placeholder={t("patients.filters.statusPlaceholder")}
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
