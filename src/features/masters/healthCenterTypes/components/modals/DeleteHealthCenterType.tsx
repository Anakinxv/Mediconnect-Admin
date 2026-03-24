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
      title={t("healthCenterTypes.modal.deleteTitle")}
      description={t("healthCenterTypes.modal.deleteDescription", {
        name: healthCenterType.nombre,
      })}
      trigger={children}
      variant="warning"
      size="smWide"
      onConfirm={onConfirm}
      confirmText={t("table.delete")}
      secondaryText={t("table.cancel")}
    >
      <></>
    </MCModalBase>
  );
}
