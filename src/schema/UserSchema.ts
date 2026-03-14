import { z } from "zod";

export const profileSchema = (t: (key: string) => string) =>
  z.object({
    profilePicture: z.string().optional(),
    nombre: z.string().min(1, t("userSchema.nameRequired")),
    email: z.string().email(t("userSchema.invalidEmail")),
  });
