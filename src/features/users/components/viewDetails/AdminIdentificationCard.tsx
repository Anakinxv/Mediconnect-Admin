import { useMemo } from "react";
import { CircleCheck, CircleSlash } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import type {
  DoctorPersonalInfo,
  CenterPersonalInfo,
} from "@/schema/verifyInfo.schema";
import { type VerificationStatus, STATUS } from "./Verificationconstants";
import StatusBadge from "./StatusBadge";
import DoctorReadOnlyView from "./DoctorReadOnlyView";
import CenterReadOnlyView from "./CenterReadOnlyView";
import DeniedDoc from "./DeniedDoc";
import AcceptDoc from "./AcceptDoc";
import {
  useGetPendingAcciones,
  useRevisarAccion,
} from "../../hooks/doctors/useAcciones";
import {
  useGetCenterPendingAcciones,
  useRevisarAccionCenter,
} from "../../hooks/centers/useActions";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useTranslation } from "react-i18next";

const DOCUMENT_TIPOS = ["foto_documento", "titulo_academico", "certificacion"];
const CENTER_DOC_TIPOS = [
  "certificado_sanitario",
  "certificacion_sanitaria",
  "certificacion",
  "certificado",
];

const getAccionActorId = (a: any): number | null =>
  a?.usuarioId ??
  a?.centroId ??
  a?.doctorId ??
  a?.perfilEmisor?.usuarioId ??
  a?.emisor?.id ??
  null;

const isDoctorDocAction = (a: any) => {
  const tipo = (a?.tipoDocumento ?? "").toLowerCase();
  const revision = (a?.tipoRevision ?? "").toLowerCase();
  return DOCUMENT_TIPOS.includes(tipo) || revision === "documento";
};

const isCenterDocAction = (a: any) => {
  const tipo = (a?.tipoDocumento ?? "").toLowerCase();
  const revision = (a?.tipoRevision ?? "").toLowerCase();
  return CENTER_DOC_TIPOS.includes(tipo) || revision === "documento";
};

interface Props {
  isDoctor: boolean;
  currentStatus: VerificationStatus;
  currentInfo: DoctorPersonalInfo | CenterPersonalInfo;
  doctorId?: number;
  centerId?: number;
  centerActionId?: number | null;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

function DoctorIdentificationCard({
  currentStatus,
  currentInfo,
  doctorId,
}: {
  currentStatus: VerificationStatus;
  currentInfo: DoctorPersonalInfo;
  doctorId?: number;
}) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const revisarMutation = useRevisarAccion();
  const { data: acciones = [] } = useGetPendingAcciones({ limite: 100 });

  const identificacionAccionId = useMemo(() => {
    if (!doctorId) return null;

    const byDoctor = acciones.find(
      (a) => getAccionActorId(a) === doctorId && !isDoctorDocAction(a),
    );
    if (byDoctor?.id != null) return byDoctor.id;

    // sin fallback global para evitar aprobar/rechazar otra entidad
    return null;
  }, [acciones, doctorId]);

  const showActions = currentStatus === "PENDING";

  const handleApprove = () => {
    const accionIdSeguro = Number(identificacionAccionId);
    if (!accionIdSeguro || Number.isNaN(accionIdSeguro)) {
      setToast({
        message: t(
          "verification.approve.noAction",
          "No hay acción pendiente para la identificación",
        ),
        type: "error",
        open: true,
      });
      return;
    }
    revisarMutation.mutate(
      {
        accionId: accionIdSeguro,
        decision: "Aprobada",
        comentario: t("verification.identification.personalComment"),
      },
      {
        onSuccess: () =>
          setToast({
            message: t(
              "verification.approve.success",
              "Información aprobada exitosamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "verification.approve.error",
              "Error al aprobar la información",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleConfirmReject = (reason: string) => {
    const accionIdSeguro = Number(identificacionAccionId);
    if (!accionIdSeguro || Number.isNaN(accionIdSeguro)) {
      setToast({
        message: t(
          "verification.reject.noAction",
          "No hay acción pendiente para la identificación",
        ),
        type: "error",
        open: true,
      });
      return;
    }
    revisarMutation.mutate(
      { accionId: accionIdSeguro, decision: "Rechazada", comentario: reason },
      {
        onSuccess: () =>
          setToast({
            message: t(
              "verification.reject.success",
              "Información rechazada exitosamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "verification.reject.error",
              "Error al rechazar la información",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  return (
    <>
      <DoctorReadOnlyView data={currentInfo} />
      {showActions && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-4 border-t border-primary/10">
          <DeniedDoc
            id="reject-info-doctor"
            documentTitle={t("verification.identification.personalTitle")}
            onConfirmReject={handleConfirmReject}
          >
            <div
              role="button"
              tabIndex={0}
              style={{
                pointerEvents: revisarMutation.isPending ? "none" : undefined,
                opacity: revisarMutation.isPending ? 0.5 : 1,
              }}
              className="w-full sm:w-auto flex items-center gap-2 justify-center px-4 py-2 rounded-lg border border-destructive text-destructive text-sm font-medium cursor-pointer hover:bg-destructive/10 transition-colors"
            >
              <CircleSlash className="w-4 h-4" />
              {t("verification.identification.rejectInfo")}
            </div>
          </DeniedDoc>

          <AcceptDoc
            id="approve-info-doctor"
            documentTitle={t("verification.identification.personalTitle")}
            onConfirmApprove={handleApprove}
          >
            <div
              role="button"
              tabIndex={0}
              style={{
                pointerEvents: revisarMutation.isPending ? "none" : undefined,
                opacity: revisarMutation.isPending ? 0.5 : 1,
              }}
              className="w-full sm:w-auto flex items-center gap-2 justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <CircleCheck className="w-4 h-4" />
              {t("verification.approve.approveButton")}
            </div>
          </AcceptDoc>
        </div>
      )}
    </>
  );
}

// ─── Centro ───────────────────────────────────────────────────────────────────

function CenterIdentificationCard({
  currentStatus,
  currentInfo,
  centerId,
  centerActionId,
}: {
  currentStatus: VerificationStatus;
  currentInfo: CenterPersonalInfo;
  centerId?: number;
  centerActionId?: number | null;
}) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const revisarMutation = useRevisarAccionCenter();
  const { data: acciones = [] } = useGetCenterPendingAcciones({ limite: 100 });

  const identificacionAccionId = useMemo(() => {
    if (centerActionId) return centerActionId;
    if (!centerId) return null;

    const byCenter = acciones.find(
      (a) => getAccionActorId(a) === centerId && !isCenterDocAction(a),
    );
    if (byCenter?.id != null) return byCenter.id;

    // sin fallback global para evitar cruces
    return null;
  }, [acciones, centerId, centerActionId]);

  const showActions = currentStatus === "PENDING";

  const handleApprove = () => {
    const accionIdSeguro = Number(identificacionAccionId);
    if (!accionIdSeguro || Number.isNaN(accionIdSeguro)) {
      setToast({
        message: t(
          "verification.approve.noAction",
          "No hay acción pendiente para la información del centro",
        ),
        type: "error",
        open: true,
      });
      return;
    }
    revisarMutation.mutate(
      {
        accionId: accionIdSeguro,
        decision: "Aprobada",
        comentario: t("verification.identification.centerComment"),
      },
      {
        onSuccess: () =>
          setToast({
            message: t(
              "verification.approve.success",
              "Información aprobada exitosamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "verification.approve.error",
              "Error al aprobar la información",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleConfirmReject = (reason: string) => {
    const accionIdSeguro = Number(identificacionAccionId);
    if (!accionIdSeguro || Number.isNaN(accionIdSeguro)) {
      setToast({
        message: t(
          "verification.reject.noAction",
          "No hay acción pendiente para la información del centro",
        ),
        type: "error",
        open: true,
      });
      return;
    }
    revisarMutation.mutate(
      { accionId: accionIdSeguro, decision: "Rechazada", comentario: reason },
      {
        onSuccess: () =>
          setToast({
            message: t(
              "verification.reject.success",
              "Información rechazada exitosamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "verification.reject.error",
              "Error al rechazar la información",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  return (
    <>
      <CenterReadOnlyView data={currentInfo} />
      {showActions && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-4 border-t border-primary/10">
          <DeniedDoc
            id="reject-info-center"
            documentTitle={t("verification.identification.centerTitle")}
            onConfirmReject={handleConfirmReject}
          >
            <div
              role="button"
              tabIndex={0}
              style={{
                pointerEvents: revisarMutation.isPending ? "none" : undefined,
                opacity: revisarMutation.isPending ? 0.5 : 1,
              }}
              className="w-full sm:w-auto flex items-center gap-2 justify-center px-4 py-2 rounded-lg border border-destructive text-destructive text-sm font-medium cursor-pointer hover:bg-destructive/10 transition-colors"
            >
              <CircleSlash className="w-4 h-4" />
              {t("verification.identification.rejectInfo")}
            </div>
          </DeniedDoc>

          <AcceptDoc
            id="approve-info-center"
            documentTitle={t("verification.identification.centerTitle")}
            onConfirmApprove={handleApprove}
          >
            <div
              role="button"
              tabIndex={0}
              style={{
                pointerEvents: revisarMutation.isPending ? "none" : undefined,
                opacity: revisarMutation.isPending ? 0.5 : 1,
              }}
              className="w-full sm:w-auto flex items-center gap-2 justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <CircleCheck className="w-4 h-4" />
              {t("verification.approve.approveButton")}
            </div>
          </AcceptDoc>
        </div>
      )}
    </>
  );
}

// ─── Principal ────────────────────────────────────────────────────────────────

function AdminIdentificationCard({
  isDoctor,
  currentStatus,
  currentInfo,
  doctorId,
  centerId,
  centerActionId,
}: Props) {
  const { t } = useTranslation("common");

  return (
    <Card className="rounded-4xl h-fit">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
          <h2 className="text-lg sm:text-xl font-semibold">
            {isDoctor
              ? t("verification.identification.personalTitle")
              : t("verification.identification.centerTitle")}
          </h2>
          <StatusBadge
            label={t(
              `verification.status.${currentStatus.toLowerCase()}`,
              currentStatus,
            )}
            color={STATUS[currentStatus].color}
          />
        </div>
        <Separator className="my-4" />
        {isDoctor ? (
          <DoctorIdentificationCard
            currentStatus={currentStatus}
            currentInfo={currentInfo as DoctorPersonalInfo}
            doctorId={doctorId}
          />
        ) : (
          <CenterIdentificationCard
            currentStatus={currentStatus}
            currentInfo={currentInfo as CenterPersonalInfo}
            centerId={centerId}
            centerActionId={centerActionId}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default AdminIdentificationCard;
