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
          ? t("healthCenterTypes.modal.editTitle")
          : t("healthCenterTypes.modal.createTitle")
      }
      description={
        isEdit
          ? t("healthCenterTypes.modal.editDescription")
          : t("healthCenterTypes.modal.createDescription")
      }
      trigger={children}
      variant="decide"
      size="smWide"
      onConfirm={() => submitRef.current?.click()}
      confirmText={isEdit ? t("table.save") : t("table.create")}
      secondaryText={t("table.cancel")}
    >
      <MCFormWrapper
        defaultValues={{ name: healthCenterType?.nombre ?? "" }}
        schema={createHealthCenterTypeFormSchema(t)}
        onSubmit={onConfirm}
        className="flex flex-col gap-4"
      >
        <MCInput
          name="name"
          label={t("healthCenterTypes.table.name")}
          placeholder={t("healthCenterTypes.form.namePlaceholder")}
          required
        />
        <button ref={submitRef} type="submit" className="hidden" />
      </MCFormWrapper>
    </MCModalBase>
  );
}
