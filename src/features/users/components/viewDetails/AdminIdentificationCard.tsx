import { useMemo } from "react";
import { CircleCheck, CircleSlash } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import MCButton from "@/shared/components/forms/MCButton";
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

// Tipos que corresponden a documentos adjuntos (no a identificación del registro)
const DOCUMENT_TIPOS = [
  "foto_documento",
  "titulo_academico",
  "certificacion",
  "certificado_sanitario",
  "certificacion_sanitaria",
];

interface Props {
  isDoctor: boolean;
  currentStatus: VerificationStatus;
  currentInfo: DoctorPersonalInfo | CenterPersonalInfo;
  /** usuarioId del doctor */
  doctorId?: number;
  /** usuarioId del centro */
  centerId?: number;
}

function AdminIdentificationCard({
  isDoctor,
  currentStatus,
  currentInfo,
  doctorId,
  centerId,
}: Props) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);

  // ── Hooks de acciones (doctor o centro) ──────────────────────────────────
  const revisarDoctorMutation = useRevisarAccion();
  const revisarCenterMutation = useRevisarAccionCenter();
  const revisarMutation = isDoctor
    ? revisarDoctorMutation
    : revisarCenterMutation;

  const { data: doctorAcciones = [] } = useGetPendingAcciones({ limite: 100 });
  const { data: centerAcciones = [] } = useGetCenterPendingAcciones({
    limite: 100,
  });
  const acciones = isDoctor ? doctorAcciones : centerAcciones;

  const entityId = isDoctor ? doctorId : centerId;

  // Buscamos la acción de verificación de identificación (no de documentos)
  const identificacionAccionId = useMemo(() => {
    if (!entityId) return null;

    const byEntity = acciones.find(
      (a) =>
        (a.doctorId === entityId ||
          (a as any).centroId === entityId ||
          (a as any).usuarioId === entityId) &&
        !DOCUMENT_TIPOS.includes(a.tipoDocumento),
    );
    if (byEntity?.id != null) return byEntity.id;

    // Fallback: cualquier acción que no sea de documento
    const fallback = acciones.find(
      (a) => !DOCUMENT_TIPOS.includes(a.tipoDocumento),
    );
    return fallback?.id ?? null;
  }, [acciones, entityId]);

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
        comentario: isDoctor
          ? "Información personal verificada correctamente"
          : "Información del centro verificada correctamente",
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
        onError: (error: any) =>
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

        {isDoctor ? (
          <DoctorReadOnlyView data={currentInfo as DoctorPersonalInfo} />
        ) : (
          <CenterReadOnlyView data={currentInfo as CenterPersonalInfo} />
        )}

        {showActions && (
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-4 border-t border-primary/10">
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
                className="w-full sm:w-auto flex items-center gap-2 justify-center"
                disabled={revisarMutation.isPending}
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
                disabled={revisarMutation.isPending}
              >
                <CircleCheck className="w-4 h-4" />
                Aprobar
              </MCButton>
            </AcceptDoc>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminIdentificationCard;
