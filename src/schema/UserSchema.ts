import { z } from "zod";

export const profileSchema = (t: (key: string) => string) =>
  z.object({
    nombre: z.string().min(1, t("userSchema.nameRequired")),
    email: z.string().email(t("userSchema.invalidEmail")),
    telefono: z.string().min(1, t("userSchema.phoneRequired")),
    rol: z.string().min(1, t("userSchema.roleRequired")),
  });
