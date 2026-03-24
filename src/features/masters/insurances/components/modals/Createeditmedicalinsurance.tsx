import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCProfileImageUploader from "@/shared/components/MCProfileImageUploader";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { createMedicalInsuranceFormSchema } from "@/schema/Medicalinsurances.schema";
import type { InsuranceInterface } from "../../hooks/useInsurance";

interface CreateEditMedicalInsuranceProps {
  insurance?: InsuranceInterface | null;
  onConfirm: (data: { nombre: string; urlImage?: string }) => void;
  children: React.ReactNode;
}

export default function CreateEditMedicalInsurance({
  insurance,
  onConfirm,
  children,
}: CreateEditMedicalInsuranceProps) {
  const { t } = useTranslation("medicalInsurance");
  const isEdit = !!insurance;
  const submitRef = useRef<HTMLButtonElement>(null);

  const [imagePreview, setImagePreview] = useState<string>(
    insurance?.urlImage ?? "",
  );
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState("");

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

  const onSubmit = (values: { name: string }) => {
    onConfirm({ nombre: values.name, urlImage: imagePreview || undefined });
  };

  const initials = (insurance?.nombre ?? "S")
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      <MCProfileImageUploader
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={tempImage}
        aspectRatio={1}
        isCircular
        onCropComplete={(cropped) => setImagePreview(cropped)}
        title={t("medicalInsurances.form.cropTitle", "Recortar logo")}
      />

      <MCModalBase
        id={
          isEdit
            ? `edit-medical-insurance-${insurance?.id}`
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
        onConfirm={() => submitRef.current?.click()}
        confirmText={isEdit ? t("table.save") : t("table.create")}
        secondaryText={t("table.cancel")}
      >
        <MCFormWrapper
          defaultValues={{
            name: insurance?.nombre ?? "",
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
                  <AvatarImage
                    src={imagePreview}
                    alt="logo"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <input
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

          <button ref={submitRef} type="submit" className="hidden" />
        </MCFormWrapper>
      </MCModalBase>
    </>
  );
}
