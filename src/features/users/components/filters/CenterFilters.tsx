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

const centerTypes = [
  { value: "hospital", label: "Hospital" },
  { value: "clinica", label: "Clínica" },
  { value: "centro_especializado", label: "Centro Especializado" },
  { value: "laboratorio", label: "Laboratorio" },
  { value: "centro_diagnostico", label: "Centro de Diagnóstico" },
  { value: "farmacia", label: "Farmacia" },
  { value: "centro_rehabilitacion", label: "Centro de Rehabilitación" },
  { value: "centro_emergencia", label: "Centro de Emergencia" },
  { value: "centro_dialisis", label: "Centro de Diálisis" },
  { value: "centro_oncologico", label: "Centro Oncológico" },
];

export default function CenterFilters({
  filters,
  onFiltersChange,
}: CenterFiltersProps) {
  const { t } = useTranslation("center");

  const statusOptions = [
    { value: "all", label: t("centers.filters.allStatus") },
    { value: "approved", label: t("centers.status.approved") },
    { value: "pending", label: t("centers.status.pending") },
    { value: "rejected", label: t("centers.status.rejected") },
  ];

  const centerTypeOptions = [
    { value: "all", label: t("centers.filters.allTypes") },
    ...centerTypes,
  ];

  // Handle string values only
  const handleStatusChange = (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    onFiltersChange({ status: stringValue });
  };

  const handleCenterTypeChange = (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    onFiltersChange({ centerType: stringValue });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Estado */}
      <MCFilterSelect
        name="status"
        label={t("centers.filters.status")}
        value={filters.status}
        onChange={handleStatusChange}
        options={statusOptions}
        placeholder={t("centers.filters.selectStatus")}
        size="small"
      />

      {/* Tipo de Centro */}
      <MCFilterSelect
        name="centerType"
        label={t("centers.filters.centerType")}
        value={filters.centerType}
        onChange={handleCenterTypeChange}
        options={centerTypeOptions}
        placeholder={t("centers.filters.selectCenterType")}
        size="small"
      />

      {/* Rango de fechas */}
      <MCFilterDates
        label={t("centers.filters.dateRange")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
