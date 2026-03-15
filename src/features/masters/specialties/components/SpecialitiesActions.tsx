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
import type { Speciality } from "./SpecialitiesTable";
import CreateEditSpeciality from "./Createeditspeciality";
import ToggleStatusSpeciality from "./Togglestatusspeciality";
import DeleteSpeciality from "./Deletespeciality";

interface SpecialitiesActionsProps {
  speciality: Speciality;
  onEdit?: (speciality: Speciality) => void;
  onDelete?: (speciality: Speciality) => void;
  onToggleStatus?: (speciality: Speciality) => void;
}

export default function SpecialitiesActions({
  speciality,
  onEdit,
  onDelete,
  onToggleStatus,
}: SpecialitiesActionsProps) {
  const { t } = useTranslation("common");
  const isActive = speciality.status === "active";

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
          <CreateEditSpeciality
            speciality={speciality}
            onConfirm={(data) => onEdit?.({ ...speciality, ...data })}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-accent/70 dark:hover:text-background transition text-sm text-center flex items-center justify-center gap-2">
              <Pencil className="h-4 w-4" />
              {t("table.edit", "Editar")}
            </div>
          </CreateEditSpeciality>

          {/* Cambiar Estado */}
          <ToggleStatusSpeciality
            speciality={speciality}
            onConfirm={() => onToggleStatus?.(speciality)}
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
          </ToggleStatusSpeciality>

          {/* Eliminar */}
          <DeleteSpeciality
            speciality={speciality}
            onConfirm={() => onDelete?.(speciality)}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-destructive/10 text-destructive transition text-sm text-center flex items-center justify-center gap-2">
              <Trash2 className="h-4 w-4" />
              {t("table.delete", "Eliminar")}
            </div>
          </DeleteSpeciality>
        </div>
      </PopoverContent>
    </Popover>
  );
}
