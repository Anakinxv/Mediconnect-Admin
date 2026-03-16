import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { InsuranceType } from "../InsuranceTypesTable";

interface ToggleStatusInsuranceTypeProps {
  insuranceType: InsuranceType;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusInsuranceType({
  insuranceType,
  onConfirm,
  children,
}: ToggleStatusInsuranceTypeProps) {
  const { t } = useTranslation("insuranceType");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isActive = insuranceType.status === "active";

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: isActive
        ? t("insuranceTypes.toast.deactivated", { name: insuranceType.name })
        : t("insuranceTypes.toast.activated", { name: insuranceType.name }),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("insuranceTypes.toast.statusAborted"),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`toggle-status-insurance-type-${insuranceType.id}`}
      title={
        isActive
          ? t("insuranceTypes.modal.deactivateTitle")
          : t("insuranceTypes.modal.activateTitle")
      }
      description={
        isActive
          ? t("insuranceTypes.modal.deactivateDescription", {
              name: insuranceType.name,
            })
          : t("insuranceTypes.modal.activateDescription", {
              name: insuranceType.name,
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
