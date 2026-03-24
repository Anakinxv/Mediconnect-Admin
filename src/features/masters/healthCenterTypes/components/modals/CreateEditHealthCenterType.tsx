import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import { createHealthCenterTypeFormSchema } from "@/schema/healthCenterTypes.schema";
import type { HealthCenterTypeInterface } from "../../hooks/useHealthCenterTypes";

interface CreateEditHealthCenterTypeProps {
  healthCenterType?: HealthCenterTypeInterface | null;
  onConfirm: (data: { name: string }) => void;
  children: React.ReactNode;
}

export default function CreateEditHealthCenterType({
  healthCenterType,
  onConfirm,
  children,
}: CreateEditHealthCenterTypeProps) {
  const { t } = useTranslation("healthCenterType");
  const isEdit = !!healthCenterType;
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <MCModalBase
      id={
        isEdit
          ? `edit-health-center-type-${healthCenterType?.id}`
          : "create-health-center-type"
      }
      title={
        isEdit
          ? t("healthCenterTypes.modal.editTitle", "Editar Tipo de Centro")
          : t("healthCenterTypes.modal.createTitle", "Nuevo Tipo de Centro")
      }
      description={
        isEdit
          ? t(
              "healthCenterTypes.modal.editDescription",
              "Modifica los datos del tipo de centro.",
            )
          : t(
              "healthCenterTypes.modal.createDescription",
              "Completa los datos para registrar un nuevo tipo de centro.",
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
        defaultValues={{ name: healthCenterType?.nombre ?? "" }}
        schema={createHealthCenterTypeFormSchema(t)}
        onSubmit={onConfirm}
        className="flex flex-col gap-4"
      >
        <MCInput
          name="name"
          label={t("healthCenterTypes.table.name", "Nombre")}
          placeholder={t(
            "healthCenterTypes.form.namePlaceholder",
            "Ej: Hospital",
          )}
          required
        />
        <button ref={submitRef} type="submit" className="hidden" />
      </MCFormWrapper>
    </MCModalBase>
  );
}
