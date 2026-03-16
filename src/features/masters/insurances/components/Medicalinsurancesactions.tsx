import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import { useTranslation } from "react-i18next";
import type { MedicalInsurance } from "../components/Medicalinsurancestable";
import type { InsuranceTypeOption } from "../components/Medicalinsurancesfilters";
import CreateEditMedicalInsurance from "../components/modals/Createeditmedicalinsurance";
import ToggleStatusMedicalInsurance from "../components/modals/Togglestatusmedicalinsurance";
import DeleteMedicalInsurance from "../components/modals/Deletemedicalinsurance";

interface MedicalInsurancesActionsProps {
  medicalInsurance: MedicalInsurance;
  insuranceTypeOptions: InsuranceTypeOption[];
  onEdit?: (medicalInsurance: MedicalInsurance) => void;
  onDelete?: (medicalInsurance: MedicalInsurance) => void;
  onToggleStatus?: (medicalInsurance: MedicalInsurance) => void;
}

export default function MedicalInsurancesActions({
  medicalInsurance,
  insuranceTypeOptions,
  onEdit,
  onDelete,
  onToggleStatus,
}: MedicalInsurancesActionsProps) {
  const { t } = useTranslation("medicalInsurance");
  const isActive = medicalInsurance.status === "active";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-bg-btn-secondary rounded-full transition-colors hover:bg-primary/10 active:bg-primary/20 group"
        >
          <MoreHorizontal className="h-4 w-4 text-primary group-hover:text-primary/80 group-active:text-primary/60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent isTablet placement="left">
        <div className="flex flex-col gap-1 p-2">
          {/* Editar */}
          <CreateEditMedicalInsurance
            medicalInsurance={medicalInsurance}
            insuranceTypeOptions={insuranceTypeOptions}
            onConfirm={(data) => onEdit?.({ ...medicalInsurance, ...data })}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-accent/70 dark:hover:text-background transition text-sm text-center flex items-center justify-center gap-2">
              <Pencil className="h-4 w-4" />
              {t("table.edit")}
            </div>
          </CreateEditMedicalInsurance>

          {/* Cambiar Estado */}
          <ToggleStatusMedicalInsurance
            medicalInsurance={medicalInsurance}
            onConfirm={() => onToggleStatus?.(medicalInsurance)}
          >
            <div
              className={`p-2 cursor-pointer rounded-lg transition text-sm text-center flex items-center justify-center gap-2 ${
                isActive
                  ? "hover:bg-amber-500/10 text-amber-600"
                  : "hover:bg-green-500/10 text-green-600"
              }`}
            >
              {isActive ? (
                <ToggleLeft className="h-4 w-4" />
              ) : (
                <ToggleRight className="h-4 w-4" />
              )}
              {isActive ? t("table.deactivate") : t("table.activate")}
            </div>
          </ToggleStatusMedicalInsurance>

          {/* Eliminar */}
          <DeleteMedicalInsurance
            medicalInsurance={medicalInsurance}
            onConfirm={() => onDelete?.(medicalInsurance)}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-destructive/10 text-destructive transition text-sm text-center flex items-center justify-center gap-2">
              <Trash2 className="h-4 w-4" />
              {t("table.delete")}
            </div>
          </DeleteMedicalInsurance>
        </div>
      </PopoverContent>
    </Popover>
  );
}
