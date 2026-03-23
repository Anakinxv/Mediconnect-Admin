// DeleteSpeciality.tsx
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import type { SpecialityInterface } from "../hooks/useSpecialities";

interface DeleteSpecialityProps {
  speciality: SpecialityInterface;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteSpeciality({
  speciality,
  onConfirm,
  children,
}: DeleteSpecialityProps) {
  const { t } = useTranslation("specialties");

  return (
    <MCModalBase
      id={`delete-speciality-${speciality.id}`}
      title={t("specialties.modal.deleteTitle", "Eliminar Especialidad")}
      description={t("specialties.modal.deleteDescription", {
        name: speciality.nombre,
        defaultValue:
          '¿Estás seguro de que deseas eliminar "{{name}}"? Esta acción no se puede deshacer.',
      })}
      trigger={children}
      variant="warning"
      size="smWide"
      onConfirm={onConfirm}
      confirmText={t("table.delete", "Eliminar")}
      secondaryText={t("table.cancel", "Cancelar")}
    >
      <></>
    </MCModalBase>
  );
}
