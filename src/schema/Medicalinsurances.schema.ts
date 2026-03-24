import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const MedicalInsuranceStatusEnum = z.enum(["active", "inactive"]);
export type MedicalInsuranceStatus = z.infer<typeof MedicalInsuranceStatusEnum>;

// ─── Base Entity (alineada con API real) ──────────────────────────────────────

export const MedicalInsuranceSchema = z.object({
  id: z.number(), // API devuelve number
  nombre: z.string(), // campo real API
  urlImage: z.string().optional(), // campo real API
  estado: z.string().optional(), // "Activo" | "Inactivo"
  status: MedicalInsuranceStatusEnum.optional(), // optimistic local
  creadoEn: z.string(), // campo real API
});

export type MedicalInsurance = z.infer<typeof MedicalInsuranceSchema>;

// ─── Create / Edit ────────────────────────────────────────────────────────────

export const CreateMedicalInsuranceSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .trim(),
  urlImage: z.string().optional().or(z.literal("")),
});

export type CreateMedicalInsuranceDto = z.infer<
  typeof CreateMedicalInsuranceSchema
>;
export const EditMedicalInsuranceSchema = CreateMedicalInsuranceSchema;
export type EditMedicalInsuranceDto = z.infer<
  typeof EditMedicalInsuranceSchema
>;

// ─── Toggle Status ────────────────────────────────────────────────────────────

export const ToggleMedicalInsuranceStatusSchema = z.object({
  id: z.number(),
  estado: z.string(), // "Activo" | "Inactivo"
});

export type ToggleMedicalInsuranceStatusDto = z.infer<
  typeof ToggleMedicalInsuranceStatusSchema
>;

// ─── Delete ───────────────────────────────────────────────────────────────────

export const DeleteMedicalInsuranceSchema = z.object({
  id: z.number(),
});

export type DeleteMedicalInsuranceDto = z.infer<
  typeof DeleteMedicalInsuranceSchema
>;

// ─── Filters ──────────────────────────────────────────────────────────────────

export const MedicalInsuranceFiltersSchema = z.object({
  status: z
    .union([MedicalInsuranceStatusEnum, z.literal("all")])
    .default("all"),
  dateRange: z.tuple([z.date(), z.date()]).optional(),
  search: z.string().optional(),
});

export type MedicalInsuranceFilters = z.infer<
  typeof MedicalInsuranceFiltersSchema
>;

// ─── Form Schema Factory (i18n-aware) ─────────────────────────────────────────
// Solo valida los campos del formulario (name → nombre en el submit)

export const createMedicalInsuranceFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("medicalInsurances.validation.nameMin"))
      .max(100, t("medicalInsurances.validation.nameMax"))
      .trim(),
  });
