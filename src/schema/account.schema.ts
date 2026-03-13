import { z } from "zod";
import type { TFunction } from "i18next";

export const changeEmailSchema = (t: TFunction) =>
  z.object({
    newEmail: z
      .string()
      .trim()
      .min(1, t("changeEmail.errors.required", "El correo es obligatorio"))
      .email(t("changeEmail.errors.invalid", "Correo inválido")),
    otp: z
      .string()
      .trim()
      .min(
        6,
        t("verifyEmail.errors.otpLength", "El código debe tener 6 dígitos"),
      )
      .max(
        6,
        t("verifyEmail.errors.otpLength", "El código debe tener 6 dígitos"),
      )
      .regex(
        /^\d+$/,
        t("verifyEmail.errors.otpNumeric", "El código debe ser numérico"),
      ),
  });

export const changePasswordSchema = (t: TFunction) =>
  z
    .object({
      newPassword: z
        .string()
        .min(
          8,
          t(
            "changePassword.errors.min",
            "La contraseña debe tener al menos 8 caracteres",
          ),
        )
        .max(
          64,
          t(
            "changePassword.errors.max",
            "La contraseña no puede superar 64 caracteres",
          ),
        ),
      confirmNewPassword: z
        .string()
        .min(
          1,
          t(
            "changePassword.errors.confirmRequired",
            "Debes confirmar la contraseña",
          ),
        ),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      path: ["confirmNewPassword"],
      message: t("changePassword.errors.match", "Las contraseñas no coinciden"),
    });

export const verifyAccountSchema = (t: TFunction) =>
  z.object({
    password: z
      .string()
      .min(
        1,
        t(
          "verifyIdentity.errors.passwordRequired",
          "La contraseña es obligatoria",
        ),
      ),
  });

export type ChangeEmailForm = z.infer<ReturnType<typeof changeEmailSchema>>;
export type ChangePasswordForm = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
export type VerifyAccountForm = z.infer<ReturnType<typeof verifyAccountSchema>>;
