import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import { createAllergyFormSchema } from "@/schema/allergies.schema";
import type { AllergyInterface } from "../../hooks/useAllergies";

interface CreateEditAllergyProps {
  allergy?: AllergyInterface | null;
  onConfirm: (data: { name: string; description: string }) => void;
  children: React.ReactNode;
}

export default function CreateEditAllergy({
  allergy,
  onConfirm,
  children,
}: CreateEditAllergyProps) {
  const { t } = useTranslation("allergies");
  const isEdit = !!allergy;
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <MCModalBase
      id={isEdit ? `edit-allergy-${allergy?.id}` : "create-allergy"}
      title={
        isEdit
          ? t("allergies.modal.editTitle", "Editar Alergia")
          : t("allergies.modal.createTitle", "Nueva Alergia")
      }
      description={
        isEdit
          ? t(
              "allergies.modal.editDescription",
              "Modifica los datos de la alergia.",
            )
          : t(
              "allergies.modal.createDescription",
              "Completa los datos para registrar una nueva alergia.",
            )
      }
      trigger={children}
      variant="decide"
      size="smWide"
      onConfirm={() => submitRef.current?.click()}
      confirmText={
        isEdit ? t("table.save", "Guardar Cambios") : t("table.create", "Crear")
      }
      secondaryText={t("table.cancel", "Cancelar")}
    >
      <MCFormWrapper
        defaultValues={{
          name: allergy?.nombre ?? "",
          description: allergy?.descripcion ?? "",
        }}
        schema={createAllergyFormSchema(t)}
        onSubmit={onConfirm}
        className="flex flex-col gap-4"
      >
        <MCInput
          name="name"
          label={t("allergies.table.name", "Nombre")}
          placeholder={t(
            "allergies.form.namePlaceholder",
            "Ej: Alergia al Polen",
          )}
          required
        />
        <MCTextArea
          name="description"
          label={t("allergies.table.description", "Descripción")}
          placeholder={t(
            "allergies.form.descriptionPlaceholder",
            "Describe brevemente la alergia...",
          )}
          required
          charLimit={300}
          showCharCount
          rows={3}
          maxRows={8}
        />
        <button ref={submitRef} type="submit" className="hidden" />
      </MCFormWrapper>
    </MCModalBase>
  );
}
