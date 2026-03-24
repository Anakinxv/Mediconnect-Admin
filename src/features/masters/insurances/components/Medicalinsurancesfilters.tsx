import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface MedicalInsurancesFiltersProps {
  filters: {
    status: string;
    dateRange?: [Date, Date];
  };
  onFiltersChange: (
    newFilters: Partial<MedicalInsurancesFiltersProps["filters"]>,
  ) => void;
}

export default function MedicalInsurancesFilters({
  filters,
  onFiltersChange,
}: MedicalInsurancesFiltersProps) {
  const { t } = useTranslation("medicalInsurance");

  const statusOptions = [
    { value: "all", label: t("medicalInsurances.filters.allStatus") },
    { value: "active", label: t("medicalInsurances.status.active") },
    { value: "inactive", label: t("medicalInsurances.status.inactive") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <MCFilterSelect
        name="status"
        label={t("table.status")}
        value={filters.status}
        onChange={(value) =>
          onFiltersChange({ status: Array.isArray(value) ? value[0] : value })
        }
        options={statusOptions}
        placeholder={t("medicalInsurances.filters.selectStatus")}
        size="small"
      />
      <MCFilterDates
        label={t("medicalInsurances.table.createdAt")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
