import { z } from "zod";

export const profileSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  rol: z.string().min(1, "La especialidad es obligatoria"),
});
