import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import type { Speciality } from "./SpecialitiesTable";
import { createSpecialityFormSchema } from "@/schema/specialities.schema";

interface CreateEditSpecialityProps {
  speciality?: Speciality | null;
  onConfirm: (data: { name: string; description: string }) => void;
  children: React.ReactNode;
}

export default function CreateEditSpeciality({
  speciality,
  onConfirm,
  children,
}: CreateEditSpecialityProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isEdit = !!speciality;
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    submitRef.current?.click();
  };

  const handleSecondary = () => {
    setToast({
      message: t("specialities.toast.aborted", "Operación cancelada"),
      type: "info",
      open: true,
    });
  };

  const onSubmit = (values: { name: string; description: string }) => {
    onConfirm(values);
    setToast({
      message: isEdit
        ? t(
            "specialities.toast.editSuccess",
            "Especialidad actualizada correctamente",
          )
        : t(
            "specialities.toast.createSuccess",
            "Especialidad creada correctamente",
          ),
      type: "success",
      open: true,
    });
  };

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
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={
        isEdit ? t("table.save", "Guardar Cambios") : t("table.create", "Crear")
      }
      secondaryText={t("table.cancel", "Cancelar")}
    >
      <MCFormWrapper
        defaultValues={{
          name: speciality?.name ?? "",
          description: speciality?.description ?? "",
        }}
        schema={createSpecialityFormSchema(t)}
        onSubmit={onSubmit}
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
