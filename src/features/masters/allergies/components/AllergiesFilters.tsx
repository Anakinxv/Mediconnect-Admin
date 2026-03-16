import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface AllergiesFiltersProps {
  filters: { status: string; dateRange?: [Date, Date] };
  onFiltersChange: (
    newFilters: Partial<AllergiesFiltersProps["filters"]>,
  ) => void;
}

export default function AllergiesFilters({
  filters,
  onFiltersChange,
}: AllergiesFiltersProps) {
  const { t } = useTranslation("allergies");

  const statusOptions = [
    { value: "all", label: t("allergies.filters.allStatus") },
    { value: "active", label: t("allergies.status.active") },
    { value: "inactive", label: t("allergies.status.inactive") },
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
        placeholder={t("allergies.filters.selectStatus")}
        size="small"
      />
      <MCFilterDates
        label={t("allergies.table.createdAt")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
