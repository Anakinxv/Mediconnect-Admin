import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { MedicalInsurance } from "../Medicalinsurancestable";

interface DeleteMedicalInsuranceProps {
  medicalInsurance: MedicalInsurance;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteMedicalInsurance({
  medicalInsurance,
  onConfirm,
  children,
}: DeleteMedicalInsuranceProps) {
  const { t } = useTranslation("medicalInsurance");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: t("medicalInsurances.toast.deleteSuccess", {
        name: medicalInsurance.name,
      }),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("medicalInsurances.toast.deleteAborted"),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`delete-medical-insurance-${medicalInsurance.id}`}
      title={t("medicalInsurances.modal.deleteTitle")}
      description={t("medicalInsurances.modal.deleteDescription", {
        name: medicalInsurance.name,
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
