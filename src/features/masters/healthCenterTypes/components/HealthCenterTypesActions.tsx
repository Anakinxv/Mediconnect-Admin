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
import type { HealthCenterTypeInterface } from "../hooks/useHealthCenterTypes";
import { resolveStatus } from "../pages/HealthCenterTypesPage";
import CreateEditHealthCenterType from "./modals/CreateEditHealthCenterType";
import ToggleStatusHealthCenterType from "./modals/ToggleStatusHealthCenterType";
import DeleteHealthCenterType from "./modals/DeleteHealthCenterType";

interface HealthCenterTypesActionsProps {
  healthCenterType: HealthCenterTypeInterface;
  onEdit?: (item: HealthCenterTypeInterface) => void;
  onDelete?: (item: HealthCenterTypeInterface) => void;
  onToggleStatus?: (item: HealthCenterTypeInterface) => void;
}

export default function HealthCenterTypesActions({
  healthCenterType,
  onEdit,
  onDelete,
  onToggleStatus,
}: HealthCenterTypesActionsProps) {
  const { t } = useTranslation("healthCenterType");
  const [open, setOpen] = useState(false);

  const isActive = resolveStatus(healthCenterType) === "active";
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
          <CreateEditHealthCenterType
            healthCenterType={healthCenterType}
            onConfirm={(data) => {
              onEdit?.({ ...healthCenterType, nombre: data.name });
              close();
            }}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-accent/70 dark:hover:text-background transition text-sm text-center flex items-center justify-center gap-2">
              <Pencil className="h-4 w-4" />
              {t("table.edit", "Editar")}
            </div>
          </CreateEditHealthCenterType>

          {/* Cambiar Estado */}
          <ToggleStatusHealthCenterType
            healthCenterType={healthCenterType}
            onConfirm={() => {
              onToggleStatus?.(healthCenterType);
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
              {isActive
                ? t("table.deactivate", "Desactivar")
                : t("table.activate", "Activar")}
            </div>
          </ToggleStatusHealthCenterType>

          {/* Eliminar */}
          <DeleteHealthCenterType
            healthCenterType={healthCenterType}
            onConfirm={() => {
              onDelete?.(healthCenterType);
              close();
            }}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-destructive/10 text-destructive transition text-sm text-center flex items-center justify-center gap-2">
              <Trash2 className="h-4 w-4" />
              {t("table.delete", "Eliminar")}
            </div>
          </DeleteHealthCenterType>
        </div>
      </PopoverContent>
    </Popover>
  );
}
