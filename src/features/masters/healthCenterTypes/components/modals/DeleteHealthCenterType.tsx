import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import type { HealthCenterTypeInterface } from "../../hooks/useHealthCenterTypes";

interface DeleteHealthCenterTypeProps {
  healthCenterType: HealthCenterTypeInterface;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteHealthCenterType({
  healthCenterType,
  onConfirm,
  children,
}: DeleteHealthCenterTypeProps) {
  const { t } = useTranslation("healthCenterType");

  return (
    <MCModalBase
      id={`delete-health-center-type-${healthCenterType.id}`}
      title={t(
        "healthCenterTypes.modal.deleteTitle",
        "Eliminar Tipo de Centro",
      )}
      description={t("healthCenterTypes.modal.deleteDescription", {
        name: healthCenterType.nombre,
        defaultValue:
          '¿Estás seguro de que deseas eliminar "{{name}}"? Esta acción no se puede deshacer.',
      })}
      trigger={children}
      variant="warning"
      size="smWide"
      onConfirm={onConfirm}
      confirmText={t("table.delete", "Eliminar")}
      secondaryText={t("table.cancel", "Cancelar")}
    >
      <></>
    </MCModalBase>
  );
}
