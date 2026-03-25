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
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useTranslation } from "react-i18next";

// ─── Tipos de documento que corresponden a documentos (no a identificación) ──
// Si el backend usa un tipoDocumento distinto para la acción de identificación,
// simplemente NO estará en esta lista y será recogida por el fallback.
const DOCUMENT_TIPOS = ["foto_documento", "titulo_academico", "certificacion"];

interface Props {
  isDoctor: boolean;
  currentStatus: VerificationStatus;
  currentInfo: DoctorPersonalInfo | CenterPersonalInfo;
  /** usuarioId del doctor — necesario para encontrar su acción de verificación */
  doctorId?: number;
}

function AdminIdentificationCard({
  isDoctor,
  currentStatus,
  currentInfo,
  doctorId,
}: Props) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const revisarMutation = useRevisarAccion();

  // ── Buscamos la acción de verificación de identidad de este doctor ────────
  // Es la acción cuyo tipoDocumento NO es uno de los documentos conocidos,
  // o bien la que tenga el tipoDocumento que el backend use para identificación.
  const { data: acciones = [] } = useGetPendingAcciones({ limite: 100 });

  const identificacionAccionId = useMemo(() => {
    if (!doctorId) return null;

    // 1) Intento ideal: doctorId + tipo de identificación (no documento)
    const byDoctor = acciones.find(
      (a) =>
        a.doctorId === doctorId && !DOCUMENT_TIPOS.includes(a.tipoDocumento),
    );
    if (byDoctor?.id != null) return byDoctor.id;

    // 2) Fallback: cualquier acción de identificación pendiente
    const fallback = acciones.find(
      (a) => !DOCUMENT_TIPOS.includes(a.tipoDocumento),
    );
    return fallback?.id ?? null;
  }, [acciones, doctorId]);

  // Solo se muestran acciones cuando el estado es PENDING
  const showActions = currentStatus === "PENDING";

  const handleApprove = () => {
    const accionIdSeguro = Number(identificacionAccionId);
    console.log(
      `[approve-identificacion] raw=${identificacionAccionId} -> seguro=${accionIdSeguro}`,
    );

    if (!accionIdSeguro || Number.isNaN(accionIdSeguro)) {
      console.error("No se encontró un accionId válido para identificación");
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
        comentario: "Información personal verificada correctamente",
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
        onError: (error: any) => {
          console.error(
            "El backend rechazó la petición:",
            error?.response?.data?.message ??
              error?.response?.data ??
              error?.message ??
              error,
          );
          setToast({
            message: t(
              "verification.approve.error",
              "Error al aprobar la información",
            ),
            type: "error",
            open: true,
          });
        },
      },
    );
  };

  const handleConfirmReject = (reason: string) => {
    const accionIdSeguro = Number(identificacionAccionId);
    console.log(
      `[reject-identificacion] raw=${identificacionAccionId} -> seguro=${accionIdSeguro}`,
    );

    if (!accionIdSeguro || Number.isNaN(accionIdSeguro)) {
      console.error("No se encontró un accionId válido para identificación");
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
      {
        accionId: accionIdSeguro,
        decision: "Rechazada",
        comentario: reason,
      },
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
        onError: (error: any) => {
          console.error(
            "El backend rechazó la petición:",
            error?.response?.data?.message ??
              error?.response?.data ??
              error?.message ??
              error,
          );
          setToast({
            message: t(
              "verification.reject.error",
              "Error al rechazar la información",
            ),
            type: "error",
            open: true,
          });
        },
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

        {/* Acciones — solo cuando PENDING */}
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
