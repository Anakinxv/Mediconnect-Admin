import { useState } from "react";
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
import type { InsuranceInterface } from "../hooks/useInsurance";
import type { InsuranceTypeInterface } from "../../insuranceTypes/hooks/useInsuranceTypes";
import { resolveStatus } from "../pages/Medicalinsurancespage";
import CreateEditMedicalInsurance from "./modals/Createeditmedicalinsurance";
import ToggleStatusMedicalInsurance from "./modals/Togglestatusmedicalinsurance";
import DeleteMedicalInsurance from "./modals/Deletemedicalinsurance";

interface MedicalInsurancesActionsProps {
  insurance: InsuranceInterface;
  insuranceTypes: InsuranceTypeInterface[];
  onEdit?: (insurance: InsuranceInterface) => void;
  onDelete?: (insurance: InsuranceInterface) => void;
  onToggleStatus?: (insurance: InsuranceInterface) => void;
}

export default function MedicalInsurancesActions({
  insurance,
  insuranceTypes,
  onEdit,
  onDelete,
  onToggleStatus,
}: MedicalInsurancesActionsProps) {
  const { t } = useTranslation("medicalInsurance");
  const [open, setOpen] = useState(false);
  const isActive = resolveStatus(insurance) === "active";
  const close = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            insurance={insurance}
            insuranceTypes={insuranceTypes}
            onConfirm={(data) => {
              onEdit?.({
                ...insurance,
                nombre: data.nombre,
                urlImage: data.urlImage,
                tiposPermitidos: data.tiposPermitidosIds.map((id) => {
                  const found = insuranceTypes.find((tp) => tp.id === id);
                  return {
                    id,
                    nombre: found?.nombre ?? String(id),
                    estado: found?.estado ?? "Activo",
                  };
                }),
              });
              close();
            }}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-accent/70 dark:hover:text-background transition text-sm text-center flex items-center justify-center gap-2">
              <Pencil className="h-4 w-4" />
              {t("table.edit")}
            </div>
          </CreateEditMedicalInsurance>

          {/* Cambiar Estado */}
          <ToggleStatusMedicalInsurance
            insurance={insurance}
            onConfirm={() => {
              onToggleStatus?.(insurance);
              close();
            }}
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
            insurance={insurance}
            onConfirm={() => {
              onDelete?.(insurance);
              close();
            }}
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
