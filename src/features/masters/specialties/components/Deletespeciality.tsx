import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { Speciality } from "../components/SpecialitiesTable";

interface DeleteSpecialityProps {
  speciality: Speciality;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteSpeciality({
  speciality,
  onConfirm,
  children,
}: DeleteSpecialityProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);

  const handleConfirm = () => {
    onConfirm();
    setToast({
      message: t(
        "specialities.toast.deleteSuccess",
        `"${speciality.name}" fue eliminada correctamente`,
      ),
      type: "success",
      open: true,
    });
  };

  const handleSecondary = () => {
    setToast({
      message: t("specialities.toast.deleteAborted", "Eliminación cancelada"),
      type: "info",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={`delete-speciality-${speciality.id}`}
      title={t("specialities.modal.deleteTitle", "Eliminar Especialidad")}
      description={t(
        "specialities.modal.deleteDescription",
        `¿Estás seguro de que deseas eliminar "${speciality.name}"? Esta acción no se puede deshacer.`,
      )}
      trigger={children}
      variant="warning"
      size="smWide"
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={t("table.delete", "Eliminar")}
      secondaryText={t("table.cancel", "Cancelar")}
    >
      <></>
    </MCModalBase>
  );
}
