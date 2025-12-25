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
