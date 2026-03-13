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
  const [feedback, setFeedback] = useState("");
  const { setDoctorInfo, setCenterInfo } = useVerifyInfoStore();

  const handleApprove = () => {
    const updated = { ...currentInfo, verificationStatus: "APPROVED" as const };
    isDoctor
      ? setDoctorInfo(updated as DoctorPersonalInfo)
      : setCenterInfo(updated as CenterPersonalInfo);
  };

  const handleConfirmReject = () => {
    const updated = { ...currentInfo, verificationStatus: "REJECTED" as const };
    isDoctor
      ? setDoctorInfo(updated as DoctorPersonalInfo)
      : setCenterInfo(updated as CenterPersonalInfo);
    setFeedback("");
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

          <div
            className={`p-3 w-full rounded-lg mt-2 flex items-center gap-2 ${STATUS_DETAILS[currentStatus].bg}`}
          >
            <span className="flex-shrink-0">{STATUS[currentStatus].icon}</span>
            <p
              className={`text-sm font-normal ${STATUS_DETAILS[currentStatus].text}`}
            >
              {STATUS_DETAILS[currentStatus].message}
            </p>
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
            <MCButton
              variant="outlineDelete"
              size="sm"
              onClick={() => setRejectOpen(true)}
              className="w-full sm:w-auto flex items-center gap-2 justify-center"
            >
              <CircleSlash className="w-4 h-4" />
              Rechazar Información
            </MCButton>
            <MCButton
              size="sm"
              onClick={handleApprove}
              className="w-full sm:w-auto flex items-center gap-2 justify-center"
            >
              <CircleCheck className="w-4 h-4" />
              Aprobar Información
            </MCButton>
          </div>
        </CardContent>
      </Card>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <CircleSlash className="w-5 h-5" />
              Rechazar Información
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Escribe el motivo. El {isDoctor ? "médico" : "centro"} lo
              recibirá.
            </p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Motivo del rechazo..."
              className="min-h-[100px] resize-none"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <MCButton
              variant="outline"
              size="sm"
              onClick={() => setRejectOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </MCButton>
            <MCButton
              variant="outlineDelete"
              size="sm"
              onClick={handleConfirmReject}
              disabled={!feedback.trim()}
              className="w-full sm:w-auto"
            >
              Confirmar Rechazo
            </MCButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminIdentificationCard;
