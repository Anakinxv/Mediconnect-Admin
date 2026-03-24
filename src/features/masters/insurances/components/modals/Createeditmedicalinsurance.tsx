import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCSelect from "@/shared/components/forms/MCSelect";
import MCProfileImageUploader from "@/shared/components/MCProfileImageUploader";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { createMedicalInsuranceFormSchema } from "@/schema/Medicalinsurances.schema";
import type { InsuranceInterface } from "../../hooks/useInsurance";
import { type InsuranceTypeInterface } from "@/features/masters/insuranceTypes/hooks/useInsuranceTypes";

interface CreateEditMedicalInsuranceProps {
  insurance?: InsuranceInterface | null;
  insuranceTypes: InsuranceTypeInterface[];
  onConfirm: (data: {
    nombre: string;
    urlImage?: string;
    tiposPermitidosIds: number[];
  }) => void;
  children: React.ReactNode;
}

export default function CreateEditMedicalInsurance({
  insurance,
  insuranceTypes,
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

  // IDs de tipos seleccionados (string[] para MCSelect, convertimos a number[] al submit)
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>(
    insurance?.tiposPermitidos?.map((t) => String(t.id)) ?? [],
  );

  useEffect(() => {
    setImagePreview(insurance?.urlImage ?? "");
    setSelectedTypeIds(
      insurance?.tiposPermitidos?.map((t) => String(t.id)) ?? [],
    );
  }, [insurance]);

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
    const payload = {
      nombre: values.name.trim(),
      urlImage: imagePreview || undefined,
      tiposPermitidosIds: selectedTypeIds.map(Number),
    };

    console.log("[CreateEditMedicalInsurance] submit payload =>", payload);
    onConfirm(payload);
  };

  const initials = (insurance?.nombre ?? "S")
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Opciones para el select múltiple — solo tipos Activos
  const typeOptions = insuranceTypes
    .filter((tp) => {
      const raw = (tp.estado ?? tp.status ?? "").toLowerCase();
      return raw === "activo" || raw === "active";
    })
    .map((tp) => ({ value: String(tp.id), label: tp.nombre }));

  return (
    <>
      <MCProfileImageUploader
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={tempImage}
        aspectRatio={1}
        isCircular
        onCropComplete={(cropped) => setImagePreview(cropped)}
        title={t("medicalInsures.form.cropTitle", "Recortar logo")}
      />

      <MCModalBase
        id={
          isEdit
            ? `edit-medical-insurance-${insurance?.id}`
            : "create-medical-insurance"
        }
        title={
          isEdit
            ? t("medicalInsures.modal.editTitle")
            : t("medicalInsures.modal.createTitle")
        }
        description={
          isEdit
            ? t("medicalInsures.modal.editDescription")
            : t("medicalInsures.modal.createDescription")
        }
        trigger={children}
        variant="decide"
        size="smWide"
        onConfirm={() => submitRef.current?.click()}
        confirmText={isEdit ? t("table.save") : t("table.create")}
        secondaryText={t("table.cancel")}
      >
        <MCFormWrapper
          defaultValues={{ name: insurance?.nombre ?? "" }}
          schema={createMedicalInsuranceFormSchema(t)}
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <span className="text-base text-primary">
              {t("medicalInsures.form.imageUrlLabel")}
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
                    {t("medicalInsures.form.changeLogo", "Cambiar")}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <MCInput
            name="name"
            label={t("medicalInsures.form.nameLabel")}
            placeholder={t("medicalInsures.form.namePlaceholder")}
            required
          />

          <div className="flex flex-col gap-2">
            <MCSelect
              name="tiposPermitidosIds"
              label={t(
                "medicalInsures.form.insuranceTypesLabel",
                "Tipos de seguro permitidos",
              )}
              placeholder={t(
                "medicalInsures.form.insuranceTypesPlaceholder",
                "Seleccionar tipos...",
              )}
              options={typeOptions}
              multiple
              searchable
              size="medium"
              value={selectedTypeIds}
              onChange={(value) => {
                const vals = Array.isArray(value) ? value : [value];
                setSelectedTypeIds(vals);
              }}
            />
          </div>

          <button ref={submitRef} type="submit" className="hidden" />
        </MCFormWrapper>
      </MCModalBase>
    </>
  );
}
