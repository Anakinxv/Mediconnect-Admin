import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const SpecialityStatusEnum = z.enum(["active", "inactive"]);
export type SpecialityStatus = z.infer<typeof SpecialityStatusEnum>;

// ─── Base Entity ──────────────────────────────────────────────────────────────

export const SpecialitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  status: SpecialityStatusEnum,
});

export type Speciality = z.infer<typeof SpecialitySchema>;

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateSpecialitySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .trim(),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(300, "La descripción no puede superar los 300 caracteres")
    .trim(),
});

export type CreateSpecialityDto = z.infer<typeof CreateSpecialitySchema>;

// ─── Edit ─────────────────────────────────────────────────────────────────────

export const EditSpecialitySchema = CreateSpecialitySchema;

export type EditSpecialityDto = z.infer<typeof EditSpecialitySchema>;

// ─── Toggle Status ────────────────────────────────────────────────────────────

export const ToggleSpecialityStatusSchema = z.object({
  id: z.string(),
  status: SpecialityStatusEnum,
});

export type ToggleSpecialityStatusDto = z.infer<
  typeof ToggleSpecialityStatusSchema
>;

// ─── Delete ───────────────────────────────────────────────────────────────────

export const DeleteSpecialitySchema = z.object({
  id: z.string(),
});

export type DeleteSpecialityDto = z.infer<typeof DeleteSpecialitySchema>;

// ─── Filters ──────────────────────────────────────────────────────────────────

export const SpecialityFiltersSchema = z.object({
  status: z.union([SpecialityStatusEnum, z.literal("all")]).default("all"),
  dateRange: z.tuple([z.date(), z.date()]).optional(),
  search: z.string().optional(),
});

export type SpecialityFilters = z.infer<typeof SpecialityFiltersSchema>;

// ─── Response (API) ───────────────────────────────────────────────────────────

export const SpecialityListResponseSchema = z.object({
  data: z.array(SpecialitySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type SpecialityListResponse = z.infer<
  typeof SpecialityListResponseSchema
>;

// ─── Form Schema Factory (i18n-aware) ────────────────────────────────────────

export const createSpecialityFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("specialities.validation.nameMin"))
      .max(100, t("specialities.validation.nameMax"))
      .trim(),
    description: z
      .string()
      .min(5, t("specialities.validation.descMin"))
      .max(300, t("specialities.validation.descMax"))
      .trim(),
  });
