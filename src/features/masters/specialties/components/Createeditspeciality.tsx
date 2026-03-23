// CreateEditSpeciality.tsx
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import type { SpecialityInterface } from "../hooks/useSpecialities";
import { createSpecialityFormSchema } from "@/schema/specialities.schema";

interface CreateEditSpecialityProps {
  speciality?: SpecialityInterface | null;
  onConfirm: (data: { name: string; description: string }) => void;
  children: React.ReactNode;
}

export default function CreateEditSpeciality({
  speciality,
  onConfirm,
  children,
}: CreateEditSpecialityProps) {
  const { t } = useTranslation("specialties");
  const isEdit = !!speciality;
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <MCModalBase
      id={isEdit ? `edit-speciality-${speciality?.id}` : "create-speciality"}
      title={
        isEdit
          ? t("specialities.modal.editTitle", "Editar Especialidad")
          : t("specialities.modal.createTitle", "Nueva Especialidad")
      }
      description={
        isEdit
          ? t(
              "specialities.modal.editDescription",
              "Modifica los datos de la especialidad.",
            )
          : t(
              "specialities.modal.createDescription",
              "Completa los datos para registrar una nueva especialidad.",
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
          name: speciality?.nombre ?? "",
          description: speciality?.descripcion ?? "",
        }}
        schema={createSpecialityFormSchema(t)}
        onSubmit={onConfirm}
        className="flex flex-col gap-4"
      >
        <MCInput
          name="name"
          label={t("specialities.table.name", "Nombre")}
          placeholder={t(
            "specialities.form.namePlaceholder",
            "Ej: Cardiología",
          )}
          required
        />
        <MCTextArea
          name="description"
          label={t("specialities.table.description", "Descripción")}
          placeholder={t(
            "specialities.form.descriptionPlaceholder",
            "Describe brevemente la especialidad...",
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
