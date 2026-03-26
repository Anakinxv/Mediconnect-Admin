import { useMemo } from "react";
import DocumentCard from "./AdminDocumentCard";
import type { UploadedFileWithStatus, UploadedFile } from "@/types/Documents";
import type { VerificationStatus } from "./Verificationconstants";
import {
  useGetCenterPendingAcciones,
  useRevisarAccionCenter,
} from "../../hooks/centers/useActions";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useTranslation } from "react-i18next";

interface AdminCenterDocumentsViewProps {
  certificacionUrl: string;
  certStatus: VerificationStatus;
  centerId: number;
}

const CENTER_DOC_TIPOS = [
  "certificado_sanitario",
  "certificacion_sanitaria",
  "certificacion",
  "certificado",
];

/** Extrae el nombre del archivo desde una URL de Supabase. Nunca devuelve "". */
function extractFileName(url: string, fallback: string): string {
  try {
    const withoutQuery = url.split("?")[0];
    const segments = withoutQuery.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    return last && last.length > 0 ? last : fallback;
  } catch {
    return fallback;
  }
}

export default function AdminCenterDocumentsView({
  certificacionUrl,
  certStatus,
  centerId,
}: AdminCenterDocumentsViewProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const revisarMutation = useRevisarAccionCenter();

  const { data: acciones = [] } = useGetCenterPendingAcciones({ limite: 100 });

  const accionId = useMemo(() => {
    if (!centerId || acciones.length === 0) return null;

    // 1. Coincidencia exacta: entidad + tipo doc de centro
    const byEntityAndTipo = acciones.find(
      (a) =>
        (a.centroId === centerId ||
          a.doctorId === centerId ||
          (a as any).usuarioId === centerId) &&
        CENTER_DOC_TIPOS.includes((a.tipoDocumento ?? "").toLowerCase()),
    );
    if (byEntityAndTipo?.id != null) return byEntityAndTipo.id;

    // 2. Solo por entidad (cualquier tipo)
    const byEntity = acciones.find(
      (a) =>
        a.centroId === centerId ||
        a.doctorId === centerId ||
        (a as any).usuarioId === centerId,
    );
    if (byEntity?.id != null) return byEntity.id;

    // 3. Fallback: primer doc de tipo centro
    const byTipo = acciones.find((a) =>
      CENTER_DOC_TIPOS.includes((a.tipoDocumento ?? "").toLowerCase()),
    );
    return byTipo?.id ?? null;
  }, [acciones, centerId]);

  const getMimeFromUrl = (url: string): string => {
    if (/\.(jpg|jpeg)$/i.test(url)) return "image/jpeg";
    if (/\.png$/i.test(url)) return "image/png";
    if (/\.pdf$/i.test(url)) return "application/pdf";
    if (url.includes("certificado-sanitario.pdf")) return "application/pdf";
    if (url.includes("certificacion-sanitaria") && url.includes(".jpg"))
      return "image/jpeg";
    return "application/pdf";
  };

  // nombre nunca vacío → evita duplicate key "" en React
  const certName = extractFileName(
    certificacionUrl,
    `certificado-sanitario-${centerId}`,
  );
  const certMime = getMimeFromUrl(certificacionUrl);

  const certDocument: UploadedFileWithStatus = {
    url: certificacionUrl,
    name: certName,
    type: certMime,
    size: 0,
    uploadedAt: "",
    verificationStatus: certStatus,
    feedback: undefined,
  };

  const handleApprove = (_doc: UploadedFile) => {
    const safeId = Number(accionId);
    if (!safeId || Number.isNaN(safeId)) {
      setToast({
        message: t(
          "verification.approve.noAction",
          "No hay acción pendiente para este documento",
        ),
        type: "error",
        open: true,
      });
      return;
    }
    revisarMutation.mutate(
      {
        accionId: safeId,
        decision: "Aprobada",
        comentario: "Certificado sanitario verificado correctamente",
      },
      {
        onSuccess: () =>
          setToast({
            message: t(
              "verification.approve.success",
              "Documento aprobado exitosamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "verification.approve.error",
              "Error al aprobar el documento",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleReject = (_doc: UploadedFile | null, feedback: string) => {
    const safeId = Number(accionId);
    if (!safeId || Number.isNaN(safeId)) {
      setToast({
        message: t(
          "verification.reject.noAction",
          "No hay acción pendiente para este documento",
        ),
        type: "error",
        open: true,
      });
      return;
    }
    revisarMutation.mutate(
      { accionId: safeId, decision: "Rechazada", comentario: feedback },
      {
        onSuccess: () =>
          setToast({
            message: t("verification.reject.success", "Documento rechazado"),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "verification.reject.error",
              "Error al rechazar el documento",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  if (!certificacionUrl) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        {t("verification.documents.noDocs", "No hay documentos disponibles")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <DocumentCard
        title={t(
          "verification.documents.healthCertificate",
          "Certificado Sanitario",
        )}
        document={certDocument}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
