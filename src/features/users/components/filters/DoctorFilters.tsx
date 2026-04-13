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

export default function DoctorFilters({
  filters,
  onFiltersChange,
}: DoctorFiltersProps) {
  const { t } = useTranslation("common");

  const specialtyValues = [
    "cardiologia",
    "dermatologia",
    "neurologia",
    "pediatria",
    "psiquiatria",
    "traumatologia",
    "ginecologia",
    "oftalmologia",
    "otorrinolaringologia",
    "urologia",
  ];

  const statusOptions = [
    { value: "all", label: t("doctors.filters.allStatus") },
    { value: "approved", label: t("doctors.status.approved") },
    { value: "pending", label: t("doctors.status.pending") },
    { value: "rejected", label: t("doctors.status.rejected") },
  ];

  const specialtyOptions = [
    { value: "all", label: t("doctors.filters.allSpecialties") },
    ...specialtyValues.map((value) => ({
      value,
      label: t(`doctors.specialties.${value}`),
    })),
  ];

  const handleStatusChange = (value: string | string[]) => {
    onFiltersChange({ status: Array.isArray(value) ? value[0] : value });
  };

  const handleSpecialtyChange = (value: string | string[]) => {
    onFiltersChange({ specialty: Array.isArray(value) ? value[0] : value });
  };

  return (
    <div className="flex flex-col gap-4">
      <MCFilterSelect
        name="status"
        label={t("doctors.filters.status")}
        value={filters.status}
        onChange={handleStatusChange}
        options={statusOptions}
        placeholder={t("doctors.filters.selectStatus")}
        size="small"
      />
      <MCFilterSelect
        name="specialty"
        label={t("doctors.filters.specialty")}
        value={filters.specialty}
        onChange={handleSpecialtyChange}
        options={specialtyOptions}
        placeholder={t("doctors.filters.selectSpecialty")}
        size="small"
      />
      <MCFilterDates
        label={t("doctors.filters.dateRange")}
        value={filters.dateRange}
        onChange={(dateRange) => onFiltersChange({ dateRange })}
        size="small"
      />
    </div>
  );
}
