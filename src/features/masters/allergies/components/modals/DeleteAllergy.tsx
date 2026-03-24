import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import type { AllergyInterface } from "../../hooks/useAllergies";

interface DeleteAllergyProps {
  allergy: AllergyInterface;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteAllergy({
  allergy,
  onConfirm,
  children,
}: DeleteAllergyProps) {
  const { t } = useTranslation("allergies");

  return (
    <MCModalBase
      id={`delete-allergy-${allergy.id}`}
      title={t("allergies.modal.deleteTitle", "Eliminar Alergia")}
      description={t("allergies.modal.deleteDescription", {
        name: allergy.nombre,
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
