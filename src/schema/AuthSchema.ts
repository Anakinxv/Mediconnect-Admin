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

// Type inferido del esquema de Login
export type LoginSchemaType = z.infer<ReturnType<typeof LoginSchema>>;
export type ForgotPasswordSchemaType = z.infer<
  ReturnType<typeof ForgotPasswordSchema>
>;
// ...existing code...
