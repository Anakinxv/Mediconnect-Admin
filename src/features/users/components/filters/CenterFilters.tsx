import React from "react";
import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface CenterFiltersProps {
  filters: {
    status: string;
    centerType: string;
    dateRange?: [Date, Date];
  };
  onFiltersChange: (newFilters: Partial<CenterFiltersProps["filters"]>) => void;
}

export default function CenterFilters({
  filters,
  onFiltersChange,
}: CenterFiltersProps) {
  const { t } = useTranslation("common");

  const centerTypeValues = [
    "hospital",
    "clinica",
    "centro_especializado",
    "laboratorio",
    "centro_diagnostico",
    "farmacia",
    "centro_rehabilitacion",
    "centro_emergencia",
    "centro_dialisis",
    "centro_oncologico",
  ];

  const statusOptions = [
    { value: "all", label: t("centers.filters.allStatus") },
    { value: "approved", label: t("centers.status.approved") },
    { value: "pending", label: t("centers.status.pending") },
    { value: "rejected", label: t("centers.status.rejected") },
  ];

  const centerTypeOptions = [
    { value: "all", label: t("centers.filters.allTypes") },
    ...centerTypeValues.map((value) => ({
      value,
      label: t(`centers.centerTypes.${value}`),
    })),
  ];

  const handleStatusChange = (value: string | string[]) => {
    onFiltersChange({ status: Array.isArray(value) ? value[0] : value });
  };

  const handleCenterTypeChange = (value: string | string[]) => {
    onFiltersChange({ centerType: Array.isArray(value) ? value[0] : value });
  };

  return (
    <div className="flex flex-col gap-4">
      <MCFilterSelect
        name="status"
        label={t("centers.filters.status")}
        value={filters.status}
        onChange={handleStatusChange}
        options={statusOptions}
        placeholder={t("centers.filters.selectStatus")}
        size="small"
      />
      <MCFilterSelect
        name="centerType"
        label={t("centers.filters.centerType")}
        value={filters.centerType}
        onChange={handleCenterTypeChange}
        options={centerTypeOptions}
        placeholder={t("centers.filters.selectCenterType")}
        size="small"
      />
      <MCFilterDates
        label={t("centers.filters.dateRange")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
