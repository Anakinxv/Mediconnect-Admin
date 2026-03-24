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
          ? t("healthCenterTypes.modal.deactivateTitle")
          : t("healthCenterTypes.modal.activateTitle")
      }
      description={
        isActive
          ? t("healthCenterTypes.modal.deactivateDescription", {
              name: displayName,
            })
          : t("healthCenterTypes.modal.activateDescription", {
              name: displayName,
            })
      }
      trigger={children}
      variant={isActive ? "warning" : "decide"}
      size="smWide"
      onConfirm={onConfirm}
      confirmText={isActive ? t("table.deactivate") : t("table.activate")}
      secondaryText={t("table.cancel")}
    >
      <></>
    </MCModalBase>
  );
}
