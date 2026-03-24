import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { InsuranceType } from "../InsuranceTypesTable";

interface DeleteInsuranceTypeProps {
  insuranceType: InsuranceType;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteInsuranceType({
  insuranceType,
  onConfirm,
  children,
}: DeleteInsuranceTypeProps) {
  const { t } = useTranslation("insuranceType");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: t("insuranceTypes.toast.deleteSuccess", {
        name: insuranceType.nombre,
      }),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("insuranceTypes.toast.deleteAborted"),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`delete-insurance-type-${insuranceType.id}`}
      title={t("insuranceTypes.modal.deleteTitle")}
      description={t("insuranceTypes.modal.deleteDescription", {
        name: insuranceType.nombre,
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
