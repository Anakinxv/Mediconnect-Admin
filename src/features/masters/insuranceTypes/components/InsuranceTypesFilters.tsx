import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface InsuranceTypesFiltersProps {
  filters: {
    status: string;
    dateRange?: [Date, Date];
  };
  onFiltersChange: (
    newFilters: Partial<InsuranceTypesFiltersProps["filters"]>,
  ) => void;
}

export default function InsuranceTypesFilters({
  filters,
  onFiltersChange,
}: InsuranceTypesFiltersProps) {
  const { t } = useTranslation("insuranceType");

  const statusOptions = [
    { value: "all", label: t("insuranceTypes.filters.allStatus") },
    { value: "active", label: t("insuranceTypes.status.active") },
    { value: "inactive", label: t("insuranceTypes.status.inactive") },
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
        placeholder={t("insuranceTypes.filters.selectStatus")}
        size="small"
      />
      <MCFilterDates
        label={t("insuranceTypes.table.createdAt")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
