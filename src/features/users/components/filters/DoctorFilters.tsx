import React from "react";
import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

interface DoctorFiltersProps {
  filters: {
    status: string;
    specialty: string;
    dateRange?: [Date, Date];
  };
  onFiltersChange: (newFilters: Partial<DoctorFiltersProps["filters"]>) => void;
}

const specialties = [
  { value: "cardiologia", label: "Cardiología" },
  { value: "dermatologia", label: "Dermatología" },
  { value: "neurologia", label: "Neurología" },
  { value: "pediatria", label: "Pediatría" },
  { value: "psiquiatria", label: "Psiquiatría" },
  { value: "traumatologia", label: "Traumatología" },
  { value: "ginecologia", label: "Ginecología" },
  { value: "oftalmologia", label: "Oftalmología" },
  { value: "otorrinolaringologia", label: "Otorrinolaringología" },
  { value: "urologia", label: "Urología" },
];

export default function DoctorFilters({
  filters,
  onFiltersChange,
}: DoctorFiltersProps) {
  const { t } = useTranslation("doctor");

  const statusOptions = [
    { value: "all", label: t("doctors.filters.allStatus") },
    { value: "approved", label: t("doctors.status.approved") },
    { value: "pending", label: t("doctors.status.pending") },
    { value: "rejected", label: t("doctors.status.rejected") },
  ];

  const specialtyOptions = [
    { value: "all", label: t("doctors.filters.allSpecialties") },
    ...specialties,
  ];

  // Handle string values only
  const handleStatusChange = (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    onFiltersChange({ status: stringValue });
  };

  const handleSpecialtyChange = (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    onFiltersChange({ specialty: stringValue });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Estado */}
      <MCFilterSelect
        name="status"
        label={t("doctors.filters.status")}
        value={filters.status}
        onChange={handleStatusChange}
        options={statusOptions}
        placeholder={t("doctors.filters.selectStatus")}
        size="small"
      />

      {/* Especialidad */}
      <MCFilterSelect
        name="specialty"
        label={t("doctors.filters.specialty")}
        value={filters.specialty}
        onChange={handleSpecialtyChange}
        options={specialtyOptions}
        placeholder={t("doctors.filters.selectSpecialty")}
        size="small"
      />

      {/* Rango de fechas */}
      <MCFilterDates
        label={t("doctors.filters.dateRange")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
