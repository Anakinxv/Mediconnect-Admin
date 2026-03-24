import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import type { HealthCenterTypeInterface } from "../../hooks/useHealthCenterTypes";
import { resolveStatus } from "../../pages/HealthCenterTypesPage";

interface ToggleStatusHealthCenterTypeProps {
  healthCenterType: HealthCenterTypeInterface;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusHealthCenterType({
  healthCenterType,
  onConfirm,
  children,
}: ToggleStatusHealthCenterTypeProps) {
  const { t } = useTranslation("healthCenterType");
  const isActive = resolveStatus(healthCenterType) === "active";
  const displayName = healthCenterType?.nombre ?? "";

  return (
    <MCModalBase
      id={`toggle-status-health-center-type-${healthCenterType.id}`}
      title={
        isActive
          ? t(
              "healthCenterTypes.modal.deactivateTitle",
              "Desactivar Tipo de Centro",
            )
          : t("healthCenterTypes.modal.activateTitle", "Activar Tipo de Centro")
      }
      description={
        isActive
          ? t("healthCenterTypes.modal.deactivateDescription", {
              name: displayName,
              defaultValue:
                '¿Estás seguro de que deseas desactivar "{{name}}"? Los centros de salud no podrán asociarse a este tipo mientras esté inactivo.',
            })
          : t("healthCenterTypes.modal.activateDescription", {
              name: displayName,
              defaultValue:
                '¿Estás seguro de que deseas activar "{{name}}"? Estará disponible nuevamente para los centros de salud.',
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
