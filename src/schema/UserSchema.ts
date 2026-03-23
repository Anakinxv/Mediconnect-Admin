import { z } from "zod";

export const profileSchema = (t: (key: string) => string) =>
  z.object({
    profilePicture: z.string().optional(),
  });
