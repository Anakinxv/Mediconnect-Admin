import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { MedicalInsurance } from "../Medicalinsurancestable";

interface ToggleStatusMedicalInsuranceProps {
  medicalInsurance: MedicalInsurance;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusMedicalInsurance({
  medicalInsurance,
  onConfirm,
  children,
}: ToggleStatusMedicalInsuranceProps) {
  const { t } = useTranslation("medicalInsurance");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isActive = medicalInsurance.status === "active";

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: isActive
        ? t("medicalInsurances.toast.deactivated", {
            name: medicalInsurance.name,
          })
        : t("medicalInsurances.toast.activated", {
            name: medicalInsurance.name,
          }),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("medicalInsurances.toast.statusAborted"),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`toggle-status-medical-insurance-${medicalInsurance.id}`}
      title={
        isActive
          ? t("medicalInsurances.modal.deactivateTitle")
          : t("medicalInsurances.modal.activateTitle")
      }
      description={
        isActive
          ? t("medicalInsurances.modal.deactivateDescription", {
              name: medicalInsurance.name,
            })
          : t("medicalInsurances.modal.activateDescription", {
              name: medicalInsurance.name,
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
