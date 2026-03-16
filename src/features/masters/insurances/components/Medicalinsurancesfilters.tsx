import { useTranslation } from "react-i18next";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";

export interface InsuranceTypeOption {
  value: string;
  label: string;
}

interface MedicalInsurancesFiltersProps {
  filters: {
    status: string;
    insuranceTypeId: string;
    dateRange?: [Date, Date];
  };
  insuranceTypeOptions: InsuranceTypeOption[];
  onFiltersChange: (
    newFilters: Partial<MedicalInsurancesFiltersProps["filters"]>,
  ) => void;
}

export default function MedicalInsurancesFilters({
  filters,
  insuranceTypeOptions,
  onFiltersChange,
}: MedicalInsurancesFiltersProps) {
  const { t } = useTranslation("medicalInsurance");

  const statusOptions = [
    { value: "all", label: t("medicalInsurances.filters.allStatus") },
    { value: "active", label: t("medicalInsurances.status.active") },
    { value: "inactive", label: t("medicalInsurances.status.inactive") },
  ];

  const typeOptions = [
    { value: "all", label: t("medicalInsurances.filters.allTypes") },
    ...insuranceTypeOptions,
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
      <MCFilterSelect
        name="insuranceTypeId"
        label={t("medicalInsurances.table.insuranceType")}
        value={filters.insuranceTypeId}
        onChange={(value) =>
          onFiltersChange({
            insuranceTypeId: Array.isArray(value) ? value[0] : value,
          })
        }
        options={typeOptions}
        placeholder={t("medicalInsurances.filters.selectType")}
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
