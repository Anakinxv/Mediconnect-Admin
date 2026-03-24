import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import type { InsuranceInterface } from "../../hooks/useInsurance";

interface DeleteMedicalInsuranceProps {
  insurance: InsuranceInterface;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteMedicalInsurance({
  insurance,
  onConfirm,
  children,
}: DeleteMedicalInsuranceProps) {
  const { t } = useTranslation("medicalInsurance");

  return (
    <MCModalBase
      id={`delete-medical-insurance-${insurance.id}`}
      title={t("medicalInsurances.modal.deleteTitle")}
      description={t("medicalInsurances.modal.deleteDescription", {
        name: insurance.nombre,
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
