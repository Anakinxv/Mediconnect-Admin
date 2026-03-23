// ToggleStatusSpeciality.tsx
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import type { SpecialityInterface } from "../hooks/useSpecialities";
import { resolveStatus } from "../pages/SpecialitiesPage";

interface ToggleStatusSpecialityProps {
  speciality: SpecialityInterface;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusSpeciality({
  speciality,
  onConfirm,
  children,
}: ToggleStatusSpecialityProps) {
  const { t } = useTranslation("specialties");

  const isActive = resolveStatus(speciality) === "active";
  const displayName = speciality?.nombre ?? "";

  return (
    <MCModalBase
      id={`toggle-status-speciality-${speciality.id}`}
      title={
        isActive
          ? t("specialities.modal.deactivateTitle", "Desactivar Especialidad")
          : t("specialities.modal.activateTitle", "Activar Especialidad")
      }
      description={
        isActive
          ? t("specialities.modal.deactivateDescription", {
              name: displayName,
              defaultValue:
                '¿Estás seguro de que deseas desactivar "{{name}}"? Los médicos no podrán asociarse a esta especialidad mientras esté inactiva.',
            })
          : t("specialities.modal.activateDescription", {
              name: displayName,
              defaultValue:
                '¿Estás seguro de que deseas activar "{{name}}"? Estará disponible nuevamente para los médicos.',
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
