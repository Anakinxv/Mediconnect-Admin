import { useMemo } from "react";
import DocumentCard from "./AdminDocumentCard";
import type { UploadedFileWithStatus, UploadedFile } from "@/types/Documents";
import type { VerificationStatus } from "./Verificationconstants";
import {
  useGetCenterPendingAcciones,
  useRevisarAccionCenter,
} from "../../hooks/centers/useActions";
import type { DocumentoCentroAdmin } from "../../hooks/centers/useCenters";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useTranslation } from "react-i18next";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AdminCenterDocumentsViewProps {
  /** URL firmada del certificado sanitario activo */
  certificacionUrl: string;
  /** Estado derivado del documento */
  certStatus: VerificationStatus;
  /** usuarioId del centro */
  centerId: number;
  /**
   * Lista completa de documentos_centros del detalle del centro.
   * Permite hacer match preciso por id_documento_centro con las acciones.
   */
  documentosCentro?: DocumentoCentroAdmin[];
}

// ─── Constantes ───────────────────────────────────────────────────────────────

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

const isCenterDocAction = (a: any) => {
  const tipo = (a?.tipoDocumento ?? "").toLowerCase();
  const revision = (a?.tipoRevision ?? "").toLowerCase();
  return CENTER_DOC_TIPOS.includes(tipo) || revision === "documento";
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function getMimeFromUrl(url: string): string {
  if (/\.(jpg|jpeg)$/i.test(url)) return "image/jpeg";
  if (/\.png$/i.test(url)) return "image/png";
  if (/\.pdf$/i.test(url)) return "application/pdf";
  if (url.includes("certificado-sanitario.pdf")) return "application/pdf";
  if (url.includes("certificacion-sanitaria") && url.includes(".jpg"))
    return "image/jpeg";
  return "application/pdf";
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AdminCenterDocumentsView({
  certificacionUrl,
  certStatus,
  centerId,
  documentosCentro = [],
}: AdminCenterDocumentsViewProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const revisarMutation = useRevisarAccionCenter();

  const { data: acciones = [] } = useGetCenterPendingAcciones({ limite: 100 });

  /**
   * Estrategia de matching (de más a menos precisa):
   * 1. documentoId === id_documento_centro del doc activo
   * 2. entidad + tipo de documento de centro
   * 3. solo entidad
   * 4. fallback: primer doc de tipo centro
   */
  const accionId = useMemo(() => {
    if (!centerId || acciones.length === 0) return null;

    const docActivo = documentosCentro.find(
      (d) =>
        d.estado !== "Eliminado" &&
        CENTER_DOC_TIPOS.includes(d.tipo_documento.toLowerCase()),
    );

    // 1) Match exacto por documentoId
    if (docActivo) {
      const byDocId = acciones.find(
        (a) => a.documentoId === docActivo.id_documento_centro,
      );
      if (byDocId?.id != null) return byDocId.id;
    }

    // 2) Match por entidad + acción de documento
    const byEntityAndDoc = acciones.find(
      (a) => getAccionActorId(a) === centerId && isCenterDocAction(a),
    );
    if (byEntityAndDoc?.id != null) return byEntityAndDoc.id;

    // sin fallback global para evitar cruzar acciones de otro usuario
    return null;
  }, [acciones, centerId, documentosCentro]);

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
