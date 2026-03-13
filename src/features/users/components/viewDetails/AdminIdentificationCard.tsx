import { useState } from "react";
import { CircleCheck, CircleSlash } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";
import MCButton from "@/shared/components/forms/MCButton";
import { useVerifyInfoStore } from "@/stores/useVerifyInfoStore";
import type {
  DoctorPersonalInfo,
  CenterPersonalInfo,
} from "@/schema/verifyInfo.schema";
import {
  type VerificationStatus,
  STATUS,
  STATUS_DETAILS,
} from "./Verificationconstants";
import StatusBadge from "./StatusBadge";
import DoctorReadOnlyView from "./DoctorReadOnlyView";
import CenterReadOnlyView from "./CenterReadOnlyView";
import DeniedDoc from "./DeniedDoc";
import AcceptDoc from "./AcceptDoc";

interface Props {
  isDoctor: boolean;
  currentStatus: VerificationStatus;
  currentInfo: DoctorPersonalInfo | CenterPersonalInfo;
}

function AdminIdentificationCard({
  isDoctor,
  currentStatus,
  currentInfo,
}: Props) {
  const [rejectOpen, setRejectOpen] = useState(false);

  const { setDoctorInfo, setCenterInfo } = useVerifyInfoStore();

  const handleApprove = () => {
    const updated = { ...currentInfo, verificationStatus: "APPROVED" as const };
    isDoctor
      ? setDoctorInfo(updated as DoctorPersonalInfo)
      : setCenterInfo(updated as CenterPersonalInfo);
  };

  const handleConfirmReject = (reason: string) => {
    const updated = {
      ...currentInfo,
      verificationStatus: "REJECTED" as const,
      feedback: reason,
    };
    isDoctor
      ? setDoctorInfo(updated as DoctorPersonalInfo)
      : setCenterInfo(updated as CenterPersonalInfo);
    setRejectOpen(false);
  };

  return (
    <>
      <Card className="rounded-4xl h-fit">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              {isDoctor ? "Identificación Personal" : "Información del Centro"}
            </h2>
            <StatusBadge
              label={currentStatus}
              color={STATUS[currentStatus].color}
            />
          </div>

          <Separator className="my-4" />

          {/* READ ONLY — componentes existentes sin tocar */}
          {isDoctor ? (
            <DoctorReadOnlyView data={currentInfo as DoctorPersonalInfo} />
          ) : (
            <CenterReadOnlyView data={currentInfo as CenterPersonalInfo} />
          )}

          {/* Acciones admin */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
            <DeniedDoc
              id={`reject-info-${isDoctor ? "doctor" : "center"}`}
              documentTitle={
                isDoctor ? "Identificación Personal" : "Información del Centro"
              }
              onConfirmReject={handleConfirmReject}
            >
              <MCButton
                variant="outlineDelete"
                size="sm"
                onClick={() => setRejectOpen(true)}
                className="w-full sm:w-auto flex items-center gap-2 justify-center"
              >
                <CircleSlash className="w-4 h-4" />
                Rechazar Información
              </MCButton>
            </DeniedDoc>
            <AcceptDoc
              id={`approve-info-${isDoctor ? "doctor" : "center"}`}
              documentTitle={
                isDoctor ? "Identificación Personal" : "Información del Centro"
              }
              onConfirmApprove={handleApprove}
            >
              <MCButton
                size="sm"
                className="w-full sm:w-auto flex items-center gap-2 justify-center"
              >
                <CircleCheck className="w-4 h-4" />
                Aprobar Información
              </MCButton>
            </AcceptDoc>
          </div>
        </CardContent>
      </Card>
      {/* Elimina el Dialog antiguo */}
    </>
  );
}

export default AdminIdentificationCard;
