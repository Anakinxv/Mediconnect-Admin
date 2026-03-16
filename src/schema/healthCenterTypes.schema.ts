import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const HealthCenterTypeStatusEnum = z.enum(["active", "inactive"]);
export type HealthCenterTypeStatus = z.infer<typeof HealthCenterTypeStatusEnum>;

// ─── Base Entity ──────────────────────────────────────────────────────────────

export const HealthCenterTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  status: HealthCenterTypeStatusEnum,
});

export type HealthCenterType = z.infer<typeof HealthCenterTypeSchema>;

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateHealthCenterTypeSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .trim(),
});

export type CreateHealthCenterTypeDto = z.infer<
  typeof CreateHealthCenterTypeSchema
>;

// ─── Edit ─────────────────────────────────────────────────────────────────────

export const EditHealthCenterTypeSchema = CreateHealthCenterTypeSchema;
export type EditHealthCenterTypeDto = z.infer<
  typeof EditHealthCenterTypeSchema
>;

// ─── Toggle Status ────────────────────────────────────────────────────────────

export const ToggleHealthCenterTypeStatusSchema = z.object({
  id: z.string(),
  status: HealthCenterTypeStatusEnum,
});

export type ToggleHealthCenterTypeStatusDto = z.infer<
  typeof ToggleHealthCenterTypeStatusSchema
>;

// ─── Delete ───────────────────────────────────────────────────────────────────

export const DeleteHealthCenterTypeSchema = z.object({
  id: z.string(),
});

export type DeleteHealthCenterTypeDto = z.infer<
  typeof DeleteHealthCenterTypeSchema
>;

// ─── Filters ──────────────────────────────────────────────────────────────────

export const HealthCenterTypeFiltersSchema = z.object({
  status: z
    .union([HealthCenterTypeStatusEnum, z.literal("all")])
    .default("all"),
  dateRange: z.tuple([z.date(), z.date()]).optional(),
  search: z.string().optional(),
});

export type HealthCenterTypeFilters = z.infer<
  typeof HealthCenterTypeFiltersSchema
>;

// ─── Response (API) ───────────────────────────────────────────────────────────

export const HealthCenterTypeListResponseSchema = z.object({
  data: z.array(HealthCenterTypeSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type HealthCenterTypeListResponse = z.infer<
  typeof HealthCenterTypeListResponseSchema
>;

// ─── Form Schema Factory (i18n-aware) ────────────────────────────────────────

export const createHealthCenterTypeFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("healthCenterTypes.validation.nameMin"))
      .max(100, t("healthCenterTypes.validation.nameMax"))
      .trim(),
  });
