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
import type { InsuranceType } from "../InsuranceTypesTable";
import CreateEditInsuranceType from "./CreateEditInsuranceType";
import ToggleStatusInsuranceType from "./ToggleStatusInsuranceType";
import DeleteInsuranceType from "./DeleteInsuranceType";

interface InsuranceTypesActionsProps {
  insuranceType: InsuranceType;
  onEdit?: (insuranceType: InsuranceType) => void;
  onDelete?: (insuranceType: InsuranceType) => void;
  onToggleStatus?: (insuranceType: InsuranceType) => void;
}

export default function InsuranceTypesActions({
  insuranceType,
  onEdit,
  onDelete,
  onToggleStatus,
}: InsuranceTypesActionsProps) {
  const { t } = useTranslation("insuranceType");
  const raw = (
    insuranceType.status ??
    insuranceType.estado ??
    ""
  ).toLowerCase();
  const isActive = raw === "active" || raw === "activo";

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
          <CreateEditInsuranceType
            insuranceType={insuranceType}
            onConfirm={(data) =>
              onEdit?.({
                ...insuranceType,
                nombre: data.name,
                descripcion:
                  data.description ?? insuranceType.descripcion ?? null,
              })
            }
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-accent/70 dark:hover:text-background transition text-sm text-center flex items-center justify-center gap-2">
              <Pencil className="h-4 w-4" />
              {t("table.edit")}
            </div>
          </CreateEditInsuranceType>

          <ToggleStatusInsuranceType
            insuranceType={insuranceType}
            onConfirm={() => onToggleStatus?.(insuranceType)}
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
          </ToggleStatusInsuranceType>

          <DeleteInsuranceType
            insuranceType={insuranceType}
            onConfirm={() => onDelete?.(insuranceType)}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-destructive/10 text-destructive transition text-sm text-center flex items-center justify-center gap-2">
              <Trash2 className="h-4 w-4" />
              {t("table.delete")}
            </div>
          </DeleteInsuranceType>
        </div>
      </PopoverContent>
    </Popover>
  );
}
