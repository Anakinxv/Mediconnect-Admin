import { z } from "zod";

export const verificationStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

// Doctor personal info
export const doctorPersonalInfoBaseSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  email: z.string(),
  nationality: z.string(),
  identificationNumber: z.string(),
  phone: z.string(),
  address: z.string(),
  primarySpecialty: z.string(),
  secondarySpecialty: z.string().optional(),
  medicalLicense: z.string(),
  verificationStatus: verificationStatusEnum,
});
export type DoctorPersonalInfo = z.infer<typeof doctorPersonalInfoBaseSchema>;

export function doctorPersonalInfoSchema(t: (key: string) => string) {
  return doctorPersonalInfoBaseSchema.extend({
    firstName: z
      .string()
      .min(1, { message: t("validation.firstNameRequired") }),
    lastName: z.string().min(1, { message: t("validation.lastNameRequired") }),
    gender: z.string().min(1, { message: t("validation.genderRequired") }),
    email: z.string().email({ message: t("validation.emailInvalid") }),
    nationality: z
      .string()
      .min(1, { message: t("validation.nationalityRequired") }),
    identificationNumber: z
      .string()
      .min(1, { message: t("validation.identificationNumberRequired") })
      .regex(/^[A-Za-z0-9-]+$/, {
        message: t("validation.identificationNumberInvalid"),
      }),
    phone: z.string().min(1, { message: t("validation.phoneRequired") }),
    address: z.string().min(1, { message: t("validation.addressRequired") }),
    primarySpecialty: z
      .string()
      .min(1, { message: t("validation.primarySpecialtyRequired") }),
    secondarySpecialty: z.string().optional(),
    medicalLicense: z
      .string()
      .min(1, { message: t("validation.medicalLicenseRequired") }),
    verificationStatus: verificationStatusEnum,
  });
}

// Center personal info
export const centerPersonalInfoBaseSchema = z.object({
  name: z.string(),
  description: z.string(),
  website: z.string().optional(),
  address: z.string(),
  province: z.string(),
  municipality: z.string(),
  rnc: z.string(),
  centerType: z.string(),
  phone: z.string(),
  email: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  verificationStatus: verificationStatusEnum,
});
export type CenterPersonalInfo = z.infer<typeof centerPersonalInfoBaseSchema>;

export function centerPersonalInfoSchema(t: (key: string) => string) {
  return centerPersonalInfoBaseSchema.extend({
    name: z.string().min(1, { message: t("validation.centerNameRequired") }),
    description: z
      .string()
      .min(1, { message: t("validation.centerDescriptionRequired") }),
    website: z
      .string()
      .url({ message: t("validation.urlInvalid") })
      .optional()
      .or(z.literal("")),
    address: z.string().min(1, { message: t("validation.addressRequired") }),
    province: z.string().min(1, { message: t("validation.provinceRequired") }),
    municipality: z
      .string()
      .min(1, { message: t("validation.municipalityRequired") }),
    rnc: z
      .string()
      .min(1, { message: t("validation.rncRequired") })
      .refine((val) => /^\d{9}$/.test(val), {
        message: t("validation.rncInvalid"),
      }),
    centerType: z
      .string()
      .min(1, { message: t("validation.centerTypeRequired") }),
    phone: z.string().min(1, { message: t("validation.phoneRequired") }),
    email: z.string().email({ message: t("validation.emailInvalid") }),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    verificationStatus: verificationStatusEnum,
  });
}

// Files
export const uploadedFileBaseSchema = z.object({
  url: z.string(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
  uploadedAt: z.string(),
});
export type UploadedFile = z.infer<typeof uploadedFileBaseSchema>;

export const uploadedFileWithStatusBaseSchema = uploadedFileBaseSchema.extend({
  verificationStatus: verificationStatusEnum,
  feedback: z.string().optional(),
});
export type UploadedFileWithStatus = z.infer<
  typeof uploadedFileWithStatusBaseSchema
>;

export const centerDocumentsBaseSchema = z.object({
  healthCertificateFile: uploadedFileWithStatusBaseSchema,
});
export type CenterDocuments = z.infer<typeof centerDocumentsBaseSchema>;

export const doctorDocumentsBaseSchema = z.object({
  identityDocumentFile: uploadedFileWithStatusBaseSchema,
  academicTitle: uploadedFileWithStatusBaseSchema.optional(),
  certifications: z.array(uploadedFileBaseSchema).optional(),
  certificationsStatus: verificationStatusEnum.optional(),
  certificationsFeedback: z.string().optional(),
});
export type DoctorDocuments = z.infer<typeof doctorDocumentsBaseSchema>;

export function centerDocumentsSchema() {
  return centerDocumentsBaseSchema;
}
export function doctorDocumentsSchema() {
  return doctorDocumentsBaseSchema;
}
