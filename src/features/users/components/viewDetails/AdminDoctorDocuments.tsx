import { useMemo } from "react";
import DocumentCard from "./AdminDocumentCard";
import type { UploadedFileWithStatus, UploadedFile } from "@/types/Documents";
import type { VerificationStatus } from "./Verificationconstants";
import {
  useGetPendingAcciones,
  useRevisarAccion,
} from "../../hooks/doctors/useAcciones";
import {
  resolveDocumentStatus,
  type DocumentoAdmin,
} from "../../hooks/doctors/useDoctors";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { useTranslation } from "react-i18next";

interface AdminDoctorDocumentsViewProps {
  documents: DocumentoAdmin[];
  doctorId: number;
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

const mapDocumentoToUploadedFile = (
  doc: DocumentoAdmin,
): UploadedFileWithStatus => ({
  url: doc.urlArchivo,
  name: doc.nombreOriginal,
  type: doc.tipoMime,
  size: 0,
  uploadedAt: doc.estadoRevision === "Pendiente" ? "Pendiente de revisión" : "",
  verificationStatus: resolveDocumentStatus(doc.estadoRevision),
  feedback: doc.comentarioAdmin ?? undefined,
});

const groupDocuments = (docs: DocumentoAdmin[]) => {
  const certificaciones = docs.filter(
    (d) => d.tipoDocumento === "certificacion",
  );
  const identityDoc = docs.find((d) => d.tipoDocumento === "foto_documento");
  const titleDoc = docs.find((d) => d.tipoDocumento === "titulo_academico");

  const otherDocs = docs.filter(
    (d) =>
      d.tipoDocumento !== "certificacion" &&
      d.tipoDocumento !== "foto_documento" &&
      d.tipoDocumento !== "titulo_academico",
  );

  return { certificaciones, identityDoc, titleDoc, otherDocs };
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function AdminDoctorDocumentsView({
  documents,
  doctorId,
}: AdminDoctorDocumentsViewProps) {
  const { t } = useTranslation("common");
  const setToast = useGlobalUIStore((s) => s.setToast);
  const revisarMutation = useRevisarAccion();

  const { data: acciones = [] } = useGetPendingAcciones({ limite: 100 });

  // ── Mapa documentoId → accionId ──────────────────────────────────────────
  const { accionByDocumentoId, accionByTipoDocumento } = useMemo(() => {
    const documentIds = new Set(documents.map((d) => d.id));
    const documentTipos = new Set(documents.map((d) => d.tipoDocumento));

    const byDocFiltered: Record<number, number> = {};
    const byTipoFiltered: Record<string, number> = {};
    const byDocFallback: Record<number, number> = {};
    const byTipoFallback: Record<string, number> = {};

    acciones.forEach((accion) => {
      // Filtrado por doctor (ideal)
      if (accion.doctorId === doctorId) {
        if (documentIds.has(accion.documentoId)) {
          byDocFiltered[accion.documentoId] = accion.id;
        }
        if (documentTipos.has(accion.tipoDocumento)) {
          byTipoFiltered[accion.tipoDocumento] = accion.id;
        }
      }

      // Fallback global
      if (documentIds.has(accion.documentoId)) {
        byDocFallback[accion.documentoId] = accion.id;
      }
      if (documentTipos.has(accion.tipoDocumento)) {
        byTipoFallback[accion.tipoDocumento] = accion.id;
      }
    });

    const finalByDoc =
      Object.keys(byDocFiltered).length > 0 ? byDocFiltered : byDocFallback;
    const finalByTipo =
      Object.keys(byTipoFiltered).length > 0 ? byTipoFiltered : byTipoFallback;

    return {
      accionByDocumentoId: finalByDoc,
      accionByTipoDocumento: finalByTipo,
    };
  }, [acciones, doctorId, documents]);

  const getAccionIdSeguro = (doc: DocumentoAdmin): number | null => {
    const idCrudo =
      accionByDocumentoId[doc.id] ?? accionByTipoDocumento[doc.tipoDocumento];
    const accionIdSeguro = Number(idCrudo);

    if (!accionIdSeguro || Number.isNaN(accionIdSeguro)) return null;
    return accionIdSeguro;
  };

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleApprove = (doc: DocumentoAdmin) => {
    const accionIdSeguro = getAccionIdSeguro(doc);

    if (!accionIdSeguro) {
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
        accionId: accionIdSeguro,
        decision: "Aprobada",
        comentario: "Documento verificado correctamente",
      },
      {
        onSuccess: () => {
          setToast({
            message: t("verification.approve.success", "Documento aprobado"),
            type: "success",
            open: true,
          });
        },
        onError: () => {
          setToast({
            message: t(
              "verification.approve.error",
              "Error al aprobar el documento",
            ),
            type: "error",
            open: true,
          });
        },
      },
    );
  };

  const handleReject = (doc: DocumentoAdmin | null, feedback: string) => {
    if (!doc) return;

    const accionIdSeguro = getAccionIdSeguro(doc);

    if (!accionIdSeguro) {
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
      { accionId: accionIdSeguro, decision: "Rechazada", comentario: feedback },
      {
        onSuccess: () =>
          setToast({
            message: t("verification.reject.success", "Documento rechazado"),
            type: "success",
            open: true,
          }),
        onError: () => {
          setToast({
            message: t(
              "verification.reject.error",
              "Error al rechazar el documento",
            ),
            type: "error",
            open: true,
          });
        },
      },
    );
  };

  const makeApproveHandler =
    (docAdminRef: DocumentoAdmin) => (_uploadedFile: UploadedFile) => {
      handleApprove(docAdminRef);
    };

  const makeRejectHandler =
    (docAdminRef: DocumentoAdmin | null) =>
    (_uploadedFile: UploadedFile | null, reason: string) => {
      handleReject(docAdminRef, reason);
    };

  const handleApproveAllCertificaciones = (certDocs: DocumentoAdmin[]) => {
    certDocs.forEach((doc) => handleApprove(doc));
  };

  const handleRejectAllCertificaciones = (
    certDocs: DocumentoAdmin[],
    reason: string,
  ) => {
    certDocs.forEach((doc) => handleReject(doc, reason));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const { certificaciones, identityDoc, titleDoc, otherDocs } =
    groupDocuments(documents);

  // Mapeos para el bloque masivo de certificaciones (solo se usará si hay > 1)
  const certMapped: UploadedFile[] = certificaciones.map((d) => ({
    url: d.urlArchivo,
    name: d.nombreOriginal,
    type: d.tipoMime,
    size: 0,
    uploadedAt: "",
  }));

  const certDocStatuses: Record<string, VerificationStatus> = {};
  const certDocFeedbacks: Record<string, string> = {};

  certificaciones.forEach((d) => {
    certDocStatuses[d.nombreOriginal] = resolveDocumentStatus(d.estadoRevision);
    if (d.comentarioAdmin)
      certDocFeedbacks[d.nombreOriginal] = d.comentarioAdmin;
  });

  const certParentStatus: VerificationStatus = certificaciones.some(
    (d) => resolveDocumentStatus(d.estadoRevision) === "REJECTED",
  )
    ? "REJECTED"
    : certificaciones.every(
          (d) => resolveDocumentStatus(d.estadoRevision) === "APPROVED",
        ) && certificaciones.length > 0
      ? "APPROVED"
      : "PENDING";

  return (
    <div className="space-y-4">
      {/* Documento de Identidad (individual) */}
      {identityDoc && (
        <DocumentCard
          title={t("verification.documents.identity", "Documento de Identidad")}
          document={mapDocumentoToUploadedFile(identityDoc)}
          onApprove={makeApproveHandler(identityDoc)}
          onReject={makeRejectHandler(identityDoc)}
        />
      )}

      {/* Título Académico (individual) */}
      {titleDoc && (
        <DocumentCard
          title={t("verification.documents.academicTitle", "Título Académico")}
          document={mapDocumentoToUploadedFile(titleDoc)}
          onApprove={makeApproveHandler(titleDoc)}
          onReject={makeRejectHandler(titleDoc)}
        />
      )}

      {/* Certificaciones (Individual si solo hay 1) */}
      {certificaciones.length === 1 && (
        <DocumentCard
          title={t("verification.documents.certifications", "Certificaciones")}
          document={mapDocumentoToUploadedFile(certificaciones[0])}
          onApprove={makeApproveHandler(certificaciones[0])}
          onReject={makeRejectHandler(certificaciones[0])}
        />
      )}

      {/* Certificaciones (Bloque masivo/array si hay más de 1) */}
      {certificaciones.length > 1 && (
        <DocumentCard
          title={t("verification.documents.certifications", "Certificaciones")}
          documents={certMapped}
          isArray
          arrayParentStatus={certParentStatus}
          docStatuses={certDocStatuses}
          docFeedbacks={certDocFeedbacks}
          onApprove={(uploadedFile) => {
            const match = certificaciones.find(
              (d) => d.nombreOriginal === uploadedFile.name,
            );
            if (match) handleApprove(match);
          }}
          onReject={(uploadedFile, reason) => {
            const match = uploadedFile
              ? certificaciones.find(
                  (d) => d.nombreOriginal === uploadedFile.name,
                )
              : null;
            if (match) handleReject(match, reason);
          }}
          onApproveAll={() => handleApproveAllCertificaciones(certificaciones)}
          onRejectAll={(reason) =>
            handleRejectAllCertificaciones(certificaciones, reason)
          }
        />
      )}

      {/* Otros Documentos */}
      {otherDocs.map((doc) => (
        <DocumentCard
          key={doc.id}
          title={doc.tipoDocumento.replace(/_/g, " ")}
          document={mapDocumentoToUploadedFile(doc)}
          onApprove={makeApproveHandler(doc)}
          onReject={makeRejectHandler(doc)}
        />
      ))}

      {documents.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          {t("verification.documents.noDocs", "No hay documentos disponibles")}
        </p>
      )}
    </div>
  );
}
