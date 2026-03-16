import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { HealthCenterType } from "../HealthCenterTypesTable";

interface DeleteHealthCenterTypeProps {
  healthCenterType: HealthCenterType;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteHealthCenterType({
  healthCenterType,
  onConfirm,
  children,
}: DeleteHealthCenterTypeProps) {
  const { t } = useTranslation("healthCenterType");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: t("healthCenterTypes.toast.deleteSuccess", {
        name: healthCenterType.name,
      }),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("healthCenterTypes.toast.deleteAborted"),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`delete-health-center-type-${healthCenterType.id}`}
      title={t("healthCenterTypes.modal.deleteTitle")}
      description={t("healthCenterTypes.modal.deleteDescription", {
        name: healthCenterType.name,
      })}
      trigger={children}
      variant="warning"
      size="smWide"
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={t("table.delete")}
      secondaryText={t("table.cancel")}
    >
      <></>
    </MCModalBase>
  );
}
