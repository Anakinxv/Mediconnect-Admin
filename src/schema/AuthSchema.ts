import z from "zod";

export function LoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    password: z.string().min(6, t("validation.passwordMin")),
  });
}

export function ForgotPasswordSchema(t: (key: string) => string) {
  return LoginSchema(t).pick({ email: true });
}

export function OtpSchema(t: (key: string) => string) {
  return z.object({
    otp: z
      .string()
      .length(4, t("validation.otpLength"))
      .regex(/^\d+$/, t("validation.otpNumeric")),
  });
}

export function ResetPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      password: z.string().min(6, t("validation.passwordMin")),
      confirmPassword: z.string().min(6, t("validation.passwordMin")),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.passwordsMustMatch"),
          path: ["confirmPassword"],
        });
      }
    });
}

// Type inferido del esquema de Login
export type LoginSchemaType = z.infer<ReturnType<typeof LoginSchema>>;
export type ForgotPasswordSchemaType = z.infer<
  ReturnType<typeof ForgotPasswordSchema>
>;
export type OtpSchemaType = z.infer<ReturnType<typeof OtpSchema>>;
export type ResetPasswordSchemaType = z.infer<
  ReturnType<typeof ResetPasswordSchema>
>;
