import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { createInsuranceTypeFormSchema } from "@/schema/insuranceTypes.schema";
import type { InsuranceType } from "../InsuranceTypesTable";

interface CreateEditInsuranceTypeProps {
  insuranceType?: InsuranceType | null;
  onConfirm: (data: { name: string }) => void;
  children: React.ReactNode;
}

export default function CreateEditInsuranceType({
  insuranceType,
  onConfirm,
  children,
}: CreateEditInsuranceTypeProps) {
  const { t } = useTranslation("insuranceType");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isEdit = !!insuranceType;
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    submitRef.current?.click();
  };

  const handleSecondary = () => {
    setToast({
      message: t("insuranceTypes.toast.aborted"),
      type: "info",
      open: true,
    });
  };

  const onSubmit = (values: { name: string }) => {
    onConfirm(values);
    setToast({
      message: isEdit
        ? t("insuranceTypes.toast.editSuccess")
        : t("insuranceTypes.toast.createSuccess"),
      type: "success",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={
        isEdit
          ? `edit-insurance-type-${insuranceType?.id}`
          : "create-insurance-type"
      }
      title={
        isEdit
          ? t("insuranceTypes.modal.editTitle")
          : t("insuranceTypes.modal.createTitle")
      }
      description={
        isEdit
          ? t("insuranceTypes.modal.editDescription")
          : t("insuranceTypes.modal.createDescription")
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
        defaultValues={{ name: insuranceType?.name ?? "" }}
        schema={createInsuranceTypeFormSchema(t)}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <MCInput
          name="name"
          label={t("insuranceTypes.table.name")}
          placeholder={t("insuranceTypes.form.namePlaceholder")}
          required
        />
        <button ref={submitRef} type="submit" className="hidden" />
      </MCFormWrapper>
    </MCModalBase>
  );
}
