import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const MedicalInsuranceStatusEnum = z.enum(["active", "inactive"]);
export type MedicalInsuranceStatus = z.infer<typeof MedicalInsuranceStatusEnum>;

// ─── Base Entity ──────────────────────────────────────────────────────────────

export const MedicalInsuranceSchema = z.object({
  id: z.string(),
  name: z.string(),
  insuranceTypeId: z.string(),
  insuranceTypeName: z.string(),
  imageUrl: z.string().optional(),
  createdAt: z.string(),
  status: MedicalInsuranceStatusEnum,
});

export type MedicalInsurance = z.infer<typeof MedicalInsuranceSchema>;

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateMedicalInsuranceSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .trim(),
  insuranceTypeId: z.string().min(1, "Debes seleccionar un tipo de seguro"),
  imageUrl: z
    .string()
    .url("La URL de la imagen no es válida")
    .optional()
    .or(z.literal("")),
});

export type CreateMedicalInsuranceDto = z.infer<
  typeof CreateMedicalInsuranceSchema
>;

// ─── Edit ─────────────────────────────────────────────────────────────────────

export const EditMedicalInsuranceSchema = CreateMedicalInsuranceSchema;
export type EditMedicalInsuranceDto = z.infer<
  typeof EditMedicalInsuranceSchema
>;

// ─── Toggle Status ────────────────────────────────────────────────────────────

export const ToggleMedicalInsuranceStatusSchema = z.object({
  id: z.string(),
  status: MedicalInsuranceStatusEnum,
});

export type ToggleMedicalInsuranceStatusDto = z.infer<
  typeof ToggleMedicalInsuranceStatusSchema
>;

// ─── Delete ───────────────────────────────────────────────────────────────────

export const DeleteMedicalInsuranceSchema = z.object({
  id: z.string(),
});

export type DeleteMedicalInsuranceDto = z.infer<
  typeof DeleteMedicalInsuranceSchema
>;

// ─── Filters ──────────────────────────────────────────────────────────────────

export const MedicalInsuranceFiltersSchema = z.object({
  status: z
    .union([MedicalInsuranceStatusEnum, z.literal("all")])
    .default("all"),
  insuranceTypeId: z.string().default("all"),
  dateRange: z.tuple([z.date(), z.date()]).optional(),
  search: z.string().optional(),
});

export type MedicalInsuranceFilters = z.infer<
  typeof MedicalInsuranceFiltersSchema
>;

// ─── Response (API) ───────────────────────────────────────────────────────────

export const MedicalInsuranceListResponseSchema = z.object({
  data: z.array(MedicalInsuranceSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type MedicalInsuranceListResponse = z.infer<
  typeof MedicalInsuranceListResponseSchema
>;

// ─── Form Schema Factory (i18n-aware) ────────────────────────────────────────

export const createMedicalInsuranceFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("medicalInsurances.validation.nameMin"))
      .max(100, t("medicalInsurances.validation.nameMax"))
      .trim(),
    insuranceTypeId: z
      .string()
      .min(1, t("medicalInsurances.validation.insuranceTypeRequired")),
    imageUrl: z
      .string()
      .url(t("medicalInsurances.validation.imageUrlInvalid"))
      .optional()
      .or(z.literal("")),
  });
