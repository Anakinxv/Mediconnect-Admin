import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCSelect from "@/shared/components/forms/MCSelect";
import MCProfileImageUploader from "@/shared/components/MCProfileImageUploader";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { createMedicalInsuranceFormSchema } from "@/schema/Medicalinsurances.schema";
import type { MedicalInsurance } from "../Medicalinsurancestable";
import type { InsuranceTypeOption } from "../Medicalinsurancesfilters";

interface CreateEditMedicalInsuranceProps {
  medicalInsurance?: MedicalInsurance | null;
  insuranceTypeOptions: InsuranceTypeOption[];
  onConfirm: (data: {
    name: string;
    insuranceTypeId: string;
    insuranceTypeName: string;
    imageUrl?: string;
  }) => void;
  children: React.ReactNode;
}

export default function CreateEditMedicalInsurance({
  medicalInsurance,
  insuranceTypeOptions,
  onConfirm,
  children,
}: CreateEditMedicalInsuranceProps) {
  const { t } = useTranslation("medicalInsurance");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const isEdit = !!medicalInsurance;
  const submitRef = useRef<HTMLButtonElement>(null);

  // ── Image crop state ───────────────────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState<string>(
    medicalInsurance?.imageUrl ?? "",
  );
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTempImage(ev.target?.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = (croppedImage: string) => {
    setImagePreview(croppedImage);
  };

  // ── Form ──────────────────────────────────────────────────────────────────
  const handleConfirm = () => submitRef.current?.click();

  const handleSecondary = () => {
    setToast({
      message: t("medicalInsurances.toast.aborted"),
      type: "info",
      open: true,
    });
  };

  const onSubmit = (values: { name: string; insuranceTypeId: string }) => {
    const selectedType = insuranceTypeOptions.find(
      (opt) => opt.value === values.insuranceTypeId,
    );
    onConfirm({
      ...values,
      insuranceTypeName: selectedType?.label ?? "",
      imageUrl: imagePreview,
    });
    setToast({
      message: isEdit
        ? t("medicalInsurances.toast.editSuccess")
        : t("medicalInsurances.toast.createSuccess"),
      type: "success",
      open: true,
    });
  };

  const initials = (medicalInsurance?.name ?? "S")
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      {/* Crop modal — fuera del MCModalBase para evitar z-index conflicts */}
      <MCProfileImageUploader
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={tempImage}
        aspectRatio={1}
        isCircular
        onCropComplete={handleCropComplete}
        title={t("medicalInsurances.form.cropTitle", "Recortar logo")}
      />

      <MCModalBase
        id={
          isEdit
            ? `edit-medical-insurance-${medicalInsurance?.id}`
            : "create-medical-insurance"
        }
        title={
          isEdit
            ? t("medicalInsurances.modal.editTitle")
            : t("medicalInsurances.modal.createTitle")
        }
        description={
          isEdit
            ? t("medicalInsurances.modal.editDescription")
            : t("medicalInsurances.modal.createDescription")
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
            name: medicalInsurance?.name ?? "",
            insuranceTypeId: medicalInsurance?.insuranceTypeId ?? "",
          }}
          schema={createMedicalInsuranceFormSchema(t)}
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
        >
          {/* Logo uploader */}
          <div className="flex flex-col gap-2">
            <span className="text-base text-primary">
              {t("medicalInsurances.form.imageUrlLabel")}
            </span>
            <div className="flex items-center gap-4">
              <label className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group shrink-0">
                <Avatar className="w-20 h-20 rounded-full bg-muted border border-primary/10">
                  {imagePreview ? (
                    <AvatarImage
                      src={imagePreview}
                      alt="logo"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* input oculto — el label lo activa nativamente */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <span className="text-white font-semibold text-xs text-center px-1">
                    {t("medicalInsurances.form.changeLogo", "Cambiar")}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Nombre */}
          <MCInput
            name="name"
            label={t("medicalInsurances.form.nameLabel")}
            placeholder={t("medicalInsurances.form.namePlaceholder")}
            required
          />

          {/* Tipo de Seguro */}
          <MCSelect
            name="insuranceTypeId"
            label={t("medicalInsurances.form.insuranceTypeLabel")}
            placeholder={t("medicalInsurances.form.insuranceTypePlaceholder")}
            options={insuranceTypeOptions}
            required
            searchable
            size="medium"
          />

          <button ref={submitRef} type="submit" className="hidden" />
        </MCFormWrapper>
      </MCModalBase>
    </>
  );
}
