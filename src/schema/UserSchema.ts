import { z } from "zod";

export const profileSchema = (_t: (key: string) => string) =>
  z.object({
    profilePicture: z.string().optional(),
  });
