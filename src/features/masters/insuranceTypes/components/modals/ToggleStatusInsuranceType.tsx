import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
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
  const raw = (
    insuranceType.status ??
    insuranceType.estado ??
    ""
  ).toLowerCase();
  const isActive = raw === "active" || raw === "activo";

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
              name: insuranceType.nombre,
            })
          : t("insuranceTypes.modal.activateDescription", {
              name: insuranceType.nombre,
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
