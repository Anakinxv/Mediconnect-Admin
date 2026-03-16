import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { createAllergyFormSchema } from "@/schema/allergies.schema";
import type { Allergy } from "../AllergiesTable";

interface CreateEditAllergyProps {
  allergy?: Allergy | null;
  onConfirm: (data: { name: string; description: string }) => void;
  children: React.ReactNode;
}

export default function CreateEditAllergy({
  allergy,
  onConfirm,
  children,
}: CreateEditAllergyProps) {
  const { t } = useTranslation("allergies");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isEdit = !!allergy;
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => submitRef.current?.click();

  const handleSecondary = () => {
    setToast({
      message: t("allergies.toast.aborted"),
      type: "info",
      open: true,
    });
  };

  const onSubmit = (values: { name: string; description: string }) => {
    onConfirm(values);
    setToast({
      message: isEdit
        ? t("allergies.toast.editSuccess")
        : t("allergies.toast.createSuccess"),
      type: "success",
      open: true,
    });
  };

  return (
    <MCModalBase
      id={isEdit ? `edit-allergy-${allergy?.id}` : "create-allergy"}
      title={
        isEdit
          ? t("allergies.modal.editTitle")
          : t("allergies.modal.createTitle")
      }
      description={
        isEdit
          ? t("allergies.modal.editDescription")
          : t("allergies.modal.createDescription")
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
        defaultValues={{
          name: allergy?.name ?? "",
          description: allergy?.description ?? "",
        }}
        schema={createAllergyFormSchema(t)}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <MCInput
          name="name"
          label={t("allergies.table.name")}
          placeholder={t("allergies.form.namePlaceholder")}
          required
        />
        <MCTextArea
          name="description"
          label={t("allergies.table.description")}
          placeholder={t("allergies.form.descriptionPlaceholder")}
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
