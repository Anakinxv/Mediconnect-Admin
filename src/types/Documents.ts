import { z } from "zod";
import { verificationStatusEnum } from "@/schema/verifyInfo.schema";

export type {
  UploadedFile,
  UploadedFileWithStatus,
  DoctorDocuments,
  CenterDocuments,
  DoctorPersonalInfo,
  CenterPersonalInfo,
} from "@/schema/verifyInfo.schema";

export type { verificationStatusEnum as VerificationStatusEnum } from "@/schema/verifyInfo.schema";
export type VerificationStatus = z.infer<typeof verificationStatusEnum>;
