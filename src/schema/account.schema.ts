import { z } from "zod";
import type { TFunction } from "i18next";

export const changeEmailSchema = (t: TFunction) =>
  z.object({
    newEmail: z
      .string()
      .trim()
      .min(1, t("changeEmail.errors.required"))
      .email(t("changeEmail.errors.invalid")),
    otp: z
      .string()
      .trim()
      .min(6, t("verifyEmail.errors.otpLength"))
      .max(6, t("verifyEmail.errors.otpLength"))
      .regex(/^\d+$/, t("verifyEmail.errors.otpNumeric")),
  });

export const changePasswordSchema = (t: TFunction) =>
  z
    .object({
      newPassword: z
        .string()
        .min(8, t("changePassword.errors.min"))
        .max(64, t("changePassword.errors.max")),
      confirmNewPassword: z
        .string()
        .min(1, t("changePassword.errors.confirmRequired")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      path: ["confirmNewPassword"],
      message: t("changePassword.errors.match"),
    });

export const verifyAccountSchema = (t: TFunction) =>
  z.object({
    password: z.string().min(1, t("verifyIdentity.errors.passwordRequired")),
  });

export type ChangeEmailForm = z.infer<ReturnType<typeof changeEmailSchema>>;
export type ChangePasswordForm = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
export type VerifyAccountForm = z.infer<ReturnType<typeof verifyAccountSchema>>;
