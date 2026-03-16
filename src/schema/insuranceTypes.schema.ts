import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const InsuranceTypeStatusEnum = z.enum(["active", "inactive"]);
export type InsuranceTypeStatus = z.infer<typeof InsuranceTypeStatusEnum>;

// ─── Base Entity ──────────────────────────────────────────────────────────────

export const InsuranceTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  status: InsuranceTypeStatusEnum,
});

export type InsuranceType = z.infer<typeof InsuranceTypeSchema>;

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateInsuranceTypeSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .trim(),
});

export type CreateInsuranceTypeDto = z.infer<typeof CreateInsuranceTypeSchema>;

// ─── Edit ─────────────────────────────────────────────────────────────────────

export const EditInsuranceTypeSchema = CreateInsuranceTypeSchema;
export type EditInsuranceTypeDto = z.infer<typeof EditInsuranceTypeSchema>;

// ─── Toggle Status ────────────────────────────────────────────────────────────

export const ToggleInsuranceTypeStatusSchema = z.object({
  id: z.string(),
  status: InsuranceTypeStatusEnum,
});

export type ToggleInsuranceTypeStatusDto = z.infer<
  typeof ToggleInsuranceTypeStatusSchema
>;

// ─── Delete ───────────────────────────────────────────────────────────────────

export const DeleteInsuranceTypeSchema = z.object({
  id: z.string(),
});

export type DeleteInsuranceTypeDto = z.infer<typeof DeleteInsuranceTypeSchema>;

// ─── Filters ──────────────────────────────────────────────────────────────────

export const InsuranceTypeFiltersSchema = z.object({
  status: z.union([InsuranceTypeStatusEnum, z.literal("all")]).default("all"),
  dateRange: z.tuple([z.date(), z.date()]).optional(),
  search: z.string().optional(),
});

export type InsuranceTypeFilters = z.infer<typeof InsuranceTypeFiltersSchema>;

// ─── Response (API) ───────────────────────────────────────────────────────────

export const InsuranceTypeListResponseSchema = z.object({
  data: z.array(InsuranceTypeSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type InsuranceTypeListResponse = z.infer<
  typeof InsuranceTypeListResponseSchema
>;

// ─── Form Schema Factory (i18n-aware) ────────────────────────────────────────

export const createInsuranceTypeFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("insuranceTypes.validation.nameMin"))
      .max(100, t("insuranceTypes.validation.nameMax"))
      .trim(),
  });
