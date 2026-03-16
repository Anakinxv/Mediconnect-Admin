import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { createHealthCenterTypeFormSchema } from "@/schema/healthCenterTypes.schema";
import type { HealthCenterType } from "../HealthCenterTypesTable";

interface CreateEditHealthCenterTypeProps {
  healthCenterType?: HealthCenterType | null;
  onConfirm: (data: { name: string }) => void;
  children: React.ReactNode;
}

export default function CreateEditHealthCenterType({
  healthCenterType,
  onConfirm,
  children,
}: CreateEditHealthCenterTypeProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isEdit = !!healthCenterType;
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => submitRef.current?.click();

  const handleSecondary = () => {
    setToast({
      message: t("healthCenterTypes.toast.aborted"),
      type: "info",
      open: true,
    });
  };

  const onSubmit = (values: { name: string }) => {
    onConfirm(values);
    setToast({
      message: isEdit
        ? t("healthCenterTypes.toast.editSuccess")
        : t("healthCenterTypes.toast.createSuccess"),
      type: "success",
      open: true,
    });
  };

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
      onConfirm={handleConfirm}
      onSecondary={handleSecondary}
      confirmText={isEdit ? t("table.save") : t("table.create")}
      secondaryText={t("table.cancel")}
    >
      <MCFormWrapper
        defaultValues={{ name: healthCenterType?.name ?? "" }}
        schema={createHealthCenterTypeFormSchema(t)}
        onSubmit={onSubmit}
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
