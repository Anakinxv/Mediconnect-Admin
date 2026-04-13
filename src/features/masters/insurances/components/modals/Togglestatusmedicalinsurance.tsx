import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import type { InsuranceInterface } from "../../hooks/useInsurance";
import { resolveStatus } from "../../pages/MedicalInsurancesPage";

interface ToggleStatusMedicalInsuranceProps {
  insurance: InsuranceInterface;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusMedicalInsurance({
  insurance,
  onConfirm,
  children,
}: ToggleStatusMedicalInsuranceProps) {
  const { t } = useTranslation("medicalInsurance");
  const isActive = resolveStatus(insurance) === "active";

  return (
    <MCModalBase
      id={`toggle-status-medical-insurance-${insurance.id}`}
      title={
        isActive
          ? t("medicalInsurances.modal.deactivateTitle")
          : t("medicalInsurances.modal.activateTitle")
      }
      description={
        isActive
          ? t("medicalInsurances.modal.deactivateDescription", {
              name: insurance.nombre,
            })
          : t("medicalInsurances.modal.activateDescription", {
              name: insurance.nombre,
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
