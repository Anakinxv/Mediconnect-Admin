import { AuthSchema } from "../schema/AuthSchema";
import z from "zod";
export type AuthType = z.infer<typeof AuthSchema>;
