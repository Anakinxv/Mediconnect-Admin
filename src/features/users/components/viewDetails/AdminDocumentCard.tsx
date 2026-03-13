import { useState } from "react";
import { Eye, CircleCheck, CircleSlash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";
import type { UploadedFileWithStatus, UploadedFile } from "@/types/Documents";
import StatusBadge from "./StatusBadge";
import { type VerificationStatus, STATUS } from "./Verificationconstants";
import MCButton from "@/shared/components/forms/MCButton";
import DocumentIcon from "./DocumentIcon";
import { ImageCarouselModal } from "./ImageCarouselModal";
import PreviewDocumentsDialog from "./PreviewDocumentsDialog";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface AdminDocumentCardProps {
  title: string;
  document?: UploadedFileWithStatus;
  documents?: UploadedFile[];
  isArray?: boolean;
  arrayParentStatus?: VerificationStatus;
  arrayParentFeedback?: string;
  onApprove?: () => void;
  onReject?: (feedback: string) => void;
  onApproveAll?: () => void;
  onRejectAll?: (feedback: string) => void;
}

const formatFileSize = (bytes: number) => {
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
}: AdminDocumentCardProps) {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  const currentStatus: VerificationStatus = isArray
    ? arrayParentStatus || "PENDING"
    : document?.verificationStatus || "PENDING";

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
    ? documents.filter((d) => d.type.startsWith("image/"))
    : document?.type.startsWith("image/")
      ? [document]
      : [];

  const handleConfirmReject = () => {
    if (isArray) onRejectAll?.(feedback);
    else onReject?.(feedback);
    setFeedback("");
    setRejectOpen(false);
  };

  return (
    <>
      <div
        className={`rounded-2xl md:rounded-3xl border ${borderColorByStatus[currentStatus]} p-3 md:p-5 space-y-3 md:space-y-4`}
      >
        {/* Encabezado */}
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
                  {documents.length} archivo(s) subido(s)
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

        {/* Lista de documentos en arrays */}
        {isArray && documents.length > 0 && (
          <div className="space-y-2 md:space-y-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="rounded-lg md:rounded-xl border border-primary/15 p-3 md:p-4"
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(doc.size)} • {doc.uploadedAt}
                    </p>

                    {doc.type.startsWith("image/") ? (
                      <img
                        src={doc.url}
                        alt={doc.name}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover cursor-pointer border mt-2"
                        onClick={() => {
                          setCarouselStartIndex(
                            imageDocuments.findIndex((d) => d.url === doc.url),
                          );
                          setCarouselOpen(true);
                        }}
                      />
                    ) : (
                      <PreviewDocumentsDialog
                        documentUrl={doc.url}
                        documentType={doc.type}
                        documentName={doc.name}
                      >
                        <button className="mt-2 flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-xs md:text-sm font-medium text-primary">
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          Ver documento
                        </button>
                      </PreviewDocumentsDialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ver documento individual */}
        {!isArray && document && (
          <div>
            {document.type.startsWith("image/") ? (
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium text-primary"
                onClick={() => setCarouselOpen(true)}
              >
                <Eye className="w-4 h-4" />
                Ver documento
              </button>
            ) : (
              <PreviewDocumentsDialog
                documentUrl={document.url}
                documentType={document.type}
                documentName={document.name}
              >
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium text-primary">
                  <Eye className="w-4 h-4" />
                  Ver documento
                </button>
              </PreviewDocumentsDialog>
            )}
          </div>
        )}

        {/* Acciones del admin */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-primary/10">
          <MCButton
            variant="outlineDelete"
            size={isMobile ? "sm" : "sm"}
            onClick={() => setRejectOpen(true)}
            className="flex-1 flex items-center gap-2 justify-center"
          >
            <CircleSlash className="w-4 h-4" />
            Rechazar
          </MCButton>
          <MCButton
            size={isMobile ? "sm" : "sm"}
            onClick={isArray ? onApproveAll : onApprove}
            className="flex-1 flex items-center gap-2 justify-center"
          >
            <CircleCheck className="w-4 h-4" />
            Aprobar
          </MCButton>
        </div>
      </div>

      {/* Carousel de imágenes */}
      <ImageCarouselModal
        images={imageDocuments.map((d) => d.url)}
        open={carouselOpen}
        onClose={() => setCarouselOpen(false)}
        startIndex={carouselStartIndex}
      />

      {/* Modal de rechazo */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <CircleSlash className="w-5 h-5" />
              Rechazar {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Indica el motivo del rechazo. El usuario recibirá este mensaje.
            </p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Escribe el motivo del rechazo..."
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
