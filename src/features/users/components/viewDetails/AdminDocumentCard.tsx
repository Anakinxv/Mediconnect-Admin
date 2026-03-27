import { useState } from "react";
import { Eye, CircleCheck, CircleSlash } from "lucide-react";
import type { UploadedFileWithStatus, UploadedFile } from "@/types/Documents";
import StatusBadge from "./StatusBadge";
import { type VerificationStatus, STATUS } from "./Verificationconstants";
import MCButton from "@/shared/components/forms/MCButton";
import DocumentIcon from "./DocumentIcon";
import { ImageCarouselModal } from "./ImageCarouselModal";
import PreviewDocumentsDialog from "./PreviewDocumentsDialog";
import DeniedDoc from "./DeniedDoc";
import AcceptDoc from "./AcceptDoc";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface AdminDocumentCardProps {
  title: string;
  document?: UploadedFileWithStatus;
  documents?: UploadedFile[];
  isArray?: boolean;
  arrayParentStatus?: VerificationStatus;
  arrayParentFeedback?: string;
  onApprove?: (doc: UploadedFile) => void;
  onReject?: (doc: UploadedFile | null, feedback: string) => void;
  onApproveAll?: () => void;
  onRejectAll?: (feedback: string) => void;
  docStatuses?: Record<string, VerificationStatus>;
  docFeedbacks?: Record<string, string>;
  approveVariant?: "decide" | "warning";
  showBulkActions?: boolean; // <- nuevo: activar "aprobar/rechazar todos"
  bulkActionsMinCount?: number; // <- nuevo: mínimo para mostrar acciones masivas
}

const formatFileSize = (bytes: number) => {
  if (!bytes || bytes === 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminDocumentCard({
  title,
  document,
  documents = [],
  isArray = false,
  arrayParentStatus,
  arrayParentFeedback,
  onApprove,
  onReject,
  onApproveAll,
  onRejectAll,
  docStatuses = {},
  docFeedbacks = {},
  approveVariant = "decide",
  showBulkActions = false,
  bulkActionsMinCount = 3, // "más de 2"
}: AdminDocumentCardProps) {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  function getDocStatus(doc: UploadedFile): VerificationStatus {
    return docStatuses[doc.name] ?? "PENDING";
  }

  function getDocFeedback(doc: UploadedFile): string | undefined {
    return docFeedbacks[doc.name];
  }

  const docStatusBorder: Record<VerificationStatus, string> = {
    APPROVED: "border-[#2E7D32]/40",
    PENDING: "border-[#C77A1F]/40",
    REJECTED: "border-[#C62828]/40",
  };

  const docStatusText: Record<VerificationStatus, string> = {
    APPROVED: "text-status-approved",
    PENDING: "text-status-pending",
    REJECTED: "text-status-rejected",
  };

  const derivedArrayStatus: VerificationStatus = isArray
    ? documents.length === 0
      ? (arrayParentStatus ?? "PENDING")
      : documents.some((d) => getDocStatus(d) === "REJECTED")
        ? "REJECTED"
        : documents.every((d) => getDocStatus(d) === "APPROVED")
          ? "APPROVED"
          : "PENDING"
    : "PENDING";

  const currentStatus: VerificationStatus = isArray
    ? derivedArrayStatus
    : (document?.verificationStatus ?? "PENDING");

  const borderColorByStatus: Record<VerificationStatus, string> = {
    APPROVED: "border-[#2E7D32]/40",
    PENDING: "border-[#C77A1F]/40",
    REJECTED: "border-[#C62828]/40",
  };

  const feedbackColorClass =
    currentStatus === "APPROVED"
      ? "text-status-approved"
      : currentStatus === "REJECTED"
        ? "text-status-rejected"
        : "text-status-pending";

  const imageDocuments = isArray
    ? documents.filter((d) => d.type.startsWith("image/") && !!d.url?.trim())
    : document?.type.startsWith("image/") && !!document.url?.trim()
      ? [document]
      : [];

  const getSafeDocKey = (doc: UploadedFile, index: number) =>
    `${doc.url?.trim() || "no-url"}-${doc.name?.trim() || "no-name"}-${index}`;

  const approvedCount = isArray
    ? documents.filter((d) => getDocStatus(d) === "APPROVED").length
    : 0;
  const rejectedCount = isArray
    ? documents.filter((d) => getDocStatus(d) === "REJECTED").length
    : 0;
  const pendingCount = isArray
    ? documents.filter((d) => getDocStatus(d) === "PENDING").length
    : 0;

  const showGlobalActions = currentStatus === "PENDING";
  const showSingleActions = !isArray && currentStatus === "PENDING";

  const showArrayBulkActions =
    isArray &&
    currentStatus === "PENDING" &&
    showBulkActions &&
    documents.length >= bulkActionsMinCount;

  const showActions = showSingleActions || showArrayBulkActions;

  return (
    <>
      <div
        className={`rounded-2xl md:rounded-3xl border ${borderColorByStatus[currentStatus]} p-3 md:p-5 space-y-3 md:space-y-4`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 md:gap-4">
          <div className="hidden md:block">
            <DocumentIcon status={currentStatus} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-foreground">
              {title}
            </h3>
            <div className="mt-2 mb-1 md:hidden">
              <StatusBadge
                label={STATUS[currentStatus].label}
                color={STATUS[currentStatus].color}
              />
            </div>

            {isArray ? (
              <>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("verification.adminCard.filesUploaded", {
                    count: documents.length,
                  })}
                  {documents.length > 0 && (
                    <span className="ml-2 text-xs">
                      {approvedCount > 0 && (
                        <span className="text-status-approved font-medium">
                          {t("verification.adminCard.approved", {
                            count: approvedCount,
                          })}
                        </span>
                      )}
                      {rejectedCount > 0 && (
                        <span
                          className={`text-status-rejected font-medium ${approvedCount > 0 ? " · " : ""}`}
                        >
                          {t("verification.adminCard.rejected", {
                            count: rejectedCount,
                          })}
                        </span>
                      )}
                      {pendingCount > 0 && (
                        <span
                          className={`text-status-pending font-medium ${approvedCount > 0 || rejectedCount > 0 ? " · " : ""}`}
                        >
                          {t("verification.adminCard.pending", {
                            count: pendingCount,
                          })}
                        </span>
                      )}
                    </span>
                  )}
                </p>
                {arrayParentFeedback && (
                  <p className={`text-sm mt-1.5 ${feedbackColorClass}`}>
                    {arrayParentFeedback}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {document?.name || "documento.pdf"}
                  <span className="mx-2">•</span>
                  {formatFileSize(document?.size || 0)}
                  <span className="mx-2">•</span>
                  {document?.uploadedAt || ""}
                </p>
                {document?.feedback && (
                  <p className={`text-sm mt-1.5 ${feedbackColorClass}`}>
                    {document.feedback}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex flex-shrink-0 items-center">
            <StatusBadge
              label={t(`verification.status.${currentStatus.toLowerCase()}`)}
              color={STATUS[currentStatus].color}
            />
          </div>
        </div>

        {/* Array of documents — individual approve/reject per doc */}
        {isArray && documents.length > 0 && (
          <div className="space-y-2 md:space-y-3">
            {documents.map((doc, index) => {
              const docStatus = getDocStatus(doc);
              const docFeedback = getDocFeedback(doc);

              return (
                <div
                  key={getSafeDocKey(doc, index)}
                  className={`rounded-lg md:rounded-xl border ${docStatusBorder[docStatus]} p-3 md:p-4 transition-colors`}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground truncate max-w-[160px] md:max-w-xs">
                          {doc.name}
                        </p>
                        <StatusBadge
                          label={STATUS[docStatus].label}
                          color={STATUS[docStatus].color}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatFileSize(doc.size)} • {doc.uploadedAt}
                      </p>

                      {docFeedback && (
                        <p
                          className={`text-xs mt-1 ${docStatusText[docStatus]}`}
                        >
                          {docFeedback}
                        </p>
                      )}

                      {/* ✅ Preview del documento — div en lugar de button para evitar nested button */}
                      {doc.type.startsWith("image/") ? (
                        // Imagen — abre el carrusel
                        <div
                          role="button"
                          tabIndex={0}
                          className="mt-2 w-fit cursor-pointer"
                          onClick={() => {
                            const idx = imageDocuments.findIndex(
                              (d) => d.url === doc.url,
                            );
                            setCarouselStartIndex(idx >= 0 ? idx : 0);
                            setCarouselOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              setCarouselOpen(true);
                          }}
                        >
                          <img
                            src={doc.url}
                            alt={doc.name}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover border hover:opacity-80 transition-opacity"
                          />
                        </div>
                      ) : (
                        // PDF u otro — abre el modal de preview
                        // ✅ trigger es un <div role="button">, NO un <button>
                        <PreviewDocumentsDialog
                          documentUrl={doc.url}
                          documentType={doc.type}
                          documentName={doc.name}
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            className="mt-2 flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-xs md:text-sm font-medium text-primary cursor-pointer w-fit"
                          >
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                            {t("verification.adminCard.viewDocument")}
                          </div>
                        </PreviewDocumentsDialog>
                      )}
                    </div>

                    {/* Acciones individuales — solo cuando pendiente */}
                    {docStatus === "PENDING" && (
                      <div className="flex flex-col justify-center gap-2 h-full">
                        <AcceptDoc
                          id={`approve-doc-${index}`}
                          documentTitle={doc.name}
                          variant={approveVariant}
                          onConfirmApprove={() => onApprove && onApprove(doc)}
                        >
                          {/* ✅ div en lugar de MCButton para evitar nested button */}
                          <div
                            role="button"
                            tabIndex={0}
                            className="flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium cursor-pointer hover:bg-primary/90 transition-colors"
                          >
                            <CircleCheck className="w-3.5 h-3.5" />
                            {t("verification.approve.approveButton")}
                          </div>
                        </AcceptDoc>

                        <DeniedDoc
                          id={`reject-doc-${index}`}
                          documentTitle={doc.name}
                          onConfirmReject={(reason) =>
                            onReject && onReject(doc, reason)
                          }
                        >
                          {/* ✅ div en lugar de MCButton */}
                          <div
                            role="button"
                            tabIndex={0}
                            className="flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg border border-destructive text-destructive text-xs font-medium cursor-pointer hover:bg-destructive/10 transition-colors"
                          >
                            <CircleSlash className="w-3.5 h-3.5" />
                            {t("verification.reject.rejectButton")}
                          </div>
                        </DeniedDoc>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Preview de documento singular */}
        {!isArray && document && (
          <div>
            {document.type.startsWith("image/") ? (
              // ✅ div en lugar de button
              <div
                role="button"
                tabIndex={0}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium text-primary cursor-pointer w-fit"
                onClick={() => setCarouselOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setCarouselOpen(true);
                }}
              >
                <Eye className="w-4 h-4" />
                {t("verification.adminCard.viewDocument")}
              </div>
            ) : (
              <PreviewDocumentsDialog
                documentUrl={document.url}
                documentType={document.type}
                documentName={document.name}
              >
                {/* ✅ div en lugar de button */}
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium text-primary cursor-pointer w-fit"
                >
                  <Eye className="w-4 h-4" />
                  {t("verification.adminCard.viewDocument")}
                </div>
              </PreviewDocumentsDialog>
            )}
          </div>
        )}

        {/* Acciones (single o masivas) */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-primary/10">
            <DeniedDoc
              id={`reject-all-${title}`}
              documentTitle={title}
              onConfirmReject={(reason) => {
                if (isArray) onRejectAll?.(reason);
                else onReject?.(null, reason);
              }}
            >
              <div
                role="button"
                tabIndex={0}
                className="flex-1 flex items-center gap-2 justify-center px-4 py-2 rounded-lg border border-destructive text-destructive text-sm font-medium cursor-pointer hover:bg-destructive/10 transition-colors"
              >
                <CircleSlash className="w-4 h-4" />
                {isArray
                  ? t("verification.reject.rejectAll")
                  : t("verification.reject.rejectButton")}
              </div>
            </DeniedDoc>

            <AcceptDoc
              id={`approve-all-${title}`}
              documentTitle={title}
              variant={approveVariant}
              onConfirmApprove={() => {
                if (isArray) onApproveAll?.();
                else onApprove && document && onApprove(document);
              }}
            >
              <div
                role="button"
                tabIndex={0}
                className="flex-1 flex items-center gap-2 justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <CircleCheck className="w-4 h-4" />
                {isArray
                  ? t("verification.approve.approveAll")
                  : t("verification.approve.approveButton")}
              </div>
            </AcceptDoc>
          </div>
        )}
      </div>

      {/* Carrusel de imágenes */}
      <ImageCarouselModal
        images={imageDocuments.map((d) => d.url).filter((u) => !!u?.trim())}
        open={carouselOpen}
        onClose={() => setCarouselOpen(false)}
        startIndex={carouselStartIndex}
      />
    </>
  );
}
