import { useTranslation } from "react-i18next";
import MCFilterDates from "@/shared/components/filters/MCFilterDates";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface PatientFiltersProps {
  filters: {
    dateRange?: [Date, Date];
    status?: string;
  };
  onFiltersChange: (filters: Partial<PatientFiltersProps["filters"]>) => void;
}

function PatientFilters({ filters, onFiltersChange }: PatientFiltersProps) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-primary">
          {t("table.status", "Estado")}
        </Label>
        <Select
          value={filters.status || "all"}
          onValueChange={(val) => onFiltersChange({ status: val })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("table.status", "Estado")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all", "Todos")}</SelectItem>
            <SelectItem value="Activo">
              {t("filters.active", "Activo")}
            </SelectItem>
            <SelectItem value="Inactivo">
              {t("filters.inactive", "Inactivo")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

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
