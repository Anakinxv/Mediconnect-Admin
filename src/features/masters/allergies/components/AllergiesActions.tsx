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
import type { AllergyInterface } from "../hooks/useAllergies";
import { resolveStatus } from "../pages/AllergiesPage";
import CreateEditAllergy from "./modals/CreateEditAllergy";
import ToggleStatusAllergy from "./modals/ToggleStatusAllergy";
import DeleteAllergy from "./modals/DeleteAllergy";

interface AllergiesActionsProps {
  allergy: AllergyInterface;
  onEdit?: (item: AllergyInterface) => void;
  onDelete?: (item: AllergyInterface) => void;
  onToggleStatus?: (item: AllergyInterface) => void;
}

export default function AllergiesActions({
  allergy,
  onEdit,
  onDelete,
  onToggleStatus,
}: AllergiesActionsProps) {
  const { t } = useTranslation("allergies");
  const [open, setOpen] = useState(false);

  const isActive = resolveStatus(allergy) === "active";
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
          <CreateEditAllergy
            allergy={allergy}
            onConfirm={(data) => {
              onEdit?.({
                ...allergy,
                nombre: data.name,
                descripcion: data.description,
              });
              close();
            }}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-accent/70 dark:hover:text-background transition text-sm text-center flex items-center justify-center gap-2">
              <Pencil className="h-4 w-4" />
              {t("table.edit", "Editar")}
            </div>
          </CreateEditAllergy>

          {/* Cambiar Estado */}
          <ToggleStatusAllergy
            allergy={allergy}
            onConfirm={() => {
              onToggleStatus?.(allergy);
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
          </ToggleStatusAllergy>

          {/* Eliminar */}
          <DeleteAllergy
            allergy={allergy}
            onConfirm={() => {
              onDelete?.(allergy);
              close();
            }}
          >
            <div className="p-2 cursor-pointer rounded-lg hover:bg-destructive/10 text-destructive transition text-sm text-center flex items-center justify-center gap-2">
              <Trash2 className="h-4 w-4" />
              {t("table.delete", "Eliminar")}
            </div>
          </DeleteAllergy>
        </div>
      </PopoverContent>
    </Popover>
  );
}
