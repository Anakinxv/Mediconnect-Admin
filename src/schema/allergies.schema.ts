import { z } from "zod";

export const AllergyStatusEnum = z.enum(["active", "inactive"]);
export type AllergyStatus = z.infer<typeof AllergyStatusEnum>;

export const AllergySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  status: AllergyStatusEnum,
});
export type Allergy = z.infer<typeof AllergySchema>;

export const CreateAllergySchema = z.object({
  name: z.string().min(2).max(100).trim(),
  description: z.string().min(5).max(300).trim(),
});
export type CreateAllergyDto = z.infer<typeof CreateAllergySchema>;

export const EditAllergySchema = CreateAllergySchema;
export type EditAllergyDto = z.infer<typeof EditAllergySchema>;

export const ToggleAllergyStatusSchema = z.object({
  id: z.string(),
  status: AllergyStatusEnum,
});
export type ToggleAllergyStatusDto = z.infer<typeof ToggleAllergyStatusSchema>;

export const DeleteAllergySchema = z.object({ id: z.string() });
export type DeleteAllergyDto = z.infer<typeof DeleteAllergySchema>;

export const AllergyFiltersSchema = z.object({
  status: z.union([AllergyStatusEnum, z.literal("all")]).default("all"),
  dateRange: z.tuple([z.date(), z.date()]).optional(),
  search: z.string().optional(),
});
export type AllergyFilters = z.infer<typeof AllergyFiltersSchema>;

export const AllergyListResponseSchema = z.object({
  data: z.array(AllergySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});
export type AllergyListResponse = z.infer<typeof AllergyListResponseSchema>;

export const createAllergyFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("allergies.validation.nameMin"))
      .max(100, t("allergies.validation.nameMax"))
      .trim(),
    description: z
      .string()
      .min(5, t("allergies.validation.descMin"))
      .max(300, t("allergies.validation.descMax"))
      .trim(),
  });
