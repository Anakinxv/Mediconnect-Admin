import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { HealthCenterType } from "../HealthCenterTypesTable";

interface ToggleStatusHealthCenterTypeProps {
  healthCenterType: HealthCenterType;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusHealthCenterType({
  healthCenterType,
  onConfirm,
  children,
}: ToggleStatusHealthCenterTypeProps) {
  const { t } = useTranslation("healthCenterType");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isActive = healthCenterType.status === "active";

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: isActive
        ? t("healthCenterTypes.toast.deactivated", {
            name: healthCenterType.name,
          })
        : t("healthCenterTypes.toast.activated", {
            name: healthCenterType.name,
          }),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("healthCenterTypes.toast.statusAborted"),
      type: "info",
      open: true,
    });
  };

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
              name: healthCenterType.name,
            })
          : t("healthCenterTypes.modal.activateDescription", {
              name: healthCenterType.name,
            })
      }
      trigger={children}
      variant={isActive ? "warning" : "decide"}
      size="smWide"
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={isActive ? t("table.deactivate") : t("table.activate")}
      secondaryText={t("table.cancel")}
    >
      <></>
    </MCModalBase>
  );
}
