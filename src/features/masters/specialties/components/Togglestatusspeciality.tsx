import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { Speciality } from "../components/SpecialitiesTable";

interface ToggleStatusSpecialityProps {
  speciality: Speciality;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ToggleStatusSpeciality({
  speciality,
  onConfirm,
  children,
}: ToggleStatusSpecialityProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const isActive = speciality.status === "active";

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: isActive
        ? t(
            "specialities.toast.deactivated",
            `"${speciality.name}" fue desactivada correctamente`,
          )
        : t(
            "specialities.toast.activated",
            `"${speciality.name}" fue activada correctamente`,
          ),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t(
        "specialities.toast.statusAborted",
        "Cambio de estado cancelado",
      ),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`toggle-status-speciality-${speciality.id}`}
      title={
        isActive
          ? t("specialities.modal.deactivateTitle", "Desactivar Especialidad")
          : t("specialities.modal.activateTitle", "Activar Especialidad")
      }
      description={
        isActive
          ? t(
              "specialities.modal.deactivateDescription",
              `¿Estás seguro de que deseas desactivar "${speciality.name}"? Los médicos no podrán asociarse a esta especialidad mientras esté inactiva.`,
            )
          : t(
              "specialities.modal.activateDescription",
              `¿Estás seguro de que deseas activar "${speciality.name}"? Estará disponible nuevamente para los médicos.`,
            )
      }
      trigger={children}
      variant={isActive ? "warning" : "decide"}
      size="smWide"
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={
        isActive
          ? t("table.deactivate", "Desactivar")
          : t("table.activate", "Activar")
      }
      secondaryText={t("table.cancel", "Cancelar")}
    >
      <></>
    </MCModalBase>
  );
}
