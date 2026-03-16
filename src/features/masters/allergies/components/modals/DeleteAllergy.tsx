import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { Allergy } from "../AllergiesTable";

interface DeleteAllergyProps {
  allergy: Allergy;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteAllergy({
  allergy,
  onConfirm,
  children,
}: DeleteAllergyProps) {
  const { t } = useTranslation("allergies");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: t("allergies.toast.deleteSuccess", { name: allergy.name }),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("allergies.toast.deleteAborted"),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`delete-allergy-${allergy.id}`}
      title={t("allergies.modal.deleteTitle")}
      description={t("allergies.modal.deleteDescription", {
        name: allergy.name,
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
