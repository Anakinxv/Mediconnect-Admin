import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { Allergy } from "../AllergiesTable";

interface ToggleStatusAllergyProps {
  allergy: Allergy;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusAllergy({
  allergy,
  onConfirm,
  children,
}: ToggleStatusAllergyProps) {
  const { t } = useTranslation("allergies");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isActive = allergy.status === "active";

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: isActive
        ? t("allergies.toast.deactivated", { name: allergy.name })
        : t("allergies.toast.activated", { name: allergy.name }),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("allergies.toast.statusAborted"),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`toggle-status-allergy-${allergy.id}`}
      title={
        isActive
          ? t("allergies.modal.deactivateTitle")
          : t("allergies.modal.activateTitle")
      }
      description={
        isActive
          ? t("allergies.modal.deactivateDescription", { name: allergy.name })
          : t("allergies.modal.activateDescription", { name: allergy.name })
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
