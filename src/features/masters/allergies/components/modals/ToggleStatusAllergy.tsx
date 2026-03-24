import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import type { AllergyInterface } from "../../hooks/useAllergies";
import { resolveStatus } from "../../pages/AllergiesPage";

interface ToggleStatusAllergyProps {
  allergy: AllergyInterface;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusAllergy({
  allergy,
  onConfirm,
  children,
}: ToggleStatusAllergyProps) {
  const { t } = useTranslation("allergies");
  const isActive = resolveStatus(allergy) === "active";
  const displayName = allergy?.nombre ?? "";

  return (
    <MCModalBase
      id={`toggle-status-allergy-${allergy.id}`}
      title={
        isActive
          ? t("allergies.modal.deactivateTitle", "Desactivar Alergia")
          : t("allergies.modal.activateTitle", "Activar Alergia")
      }
      description={
        isActive
          ? t("allergies.modal.deactivateDescription", {
              name: displayName,
              defaultValue:
                '¿Estás seguro de que deseas desactivar "{{name}}"? No estará disponible en el catálogo mientras esté inactiva.',
            })
          : t("allergies.modal.activateDescription", {
              name: displayName,
              defaultValue:
                '¿Estás seguro de que deseas activar "{{name}}"? Estará disponible nuevamente en el catálogo.',
            })
      }
      trigger={children}
      variant={isActive ? "warning" : "decide"}
      size="smWide"
      onConfirm={onConfirm}
      confirmText={
        isActive
          ? t("table.deactivate", "Desactivar")
          : t("table.activate", "Activar")
      }
      secondaryText={t("table.cancel", "Cancelar")}
    >
      <></>
    </MCModalBase>
  );
}
