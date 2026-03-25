import React from "react";
import { MCModalBase } from "@/shared/components/MCModalBase";

interface PreviewDocumentsDialogProps {
  children?: React.ReactNode;
  documentUrl?: string;
  documentType?: string;
  documentName?: string;
}

function PreviewDocumentsDialog({
  children,
  documentUrl,
  documentType,
  documentName,
}: PreviewDocumentsDialogProps) {
  const renderPreviewContent = () => {
    if (!documentUrl) {
      return (
        <div className="flex items-center justify-center h-[90vh] text-muted-foreground">
          <span>No hay documento para previsualizar</span>
        </div>
      );
    }

    const isImage =
      documentType?.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(documentUrl);

    if (isImage) {
      return (
        <div className="flex items-center justify-center max-h-[90vh] overflow-hidden">
          <img
            src={documentUrl}
            alt={documentName || "Vista previa del documento"}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      );
    }

    const isPdf =
      documentType === "application/pdf" || /\.pdf$/i.test(documentUrl);

    if (isPdf) {
      // Blob o file local — no previsualizable inline
      if (documentUrl.startsWith("blob:") || documentUrl.startsWith("file:")) {
        return (
          <div className="flex flex-col items-center justify-center h-[90vh] gap-4">
            <div className="text-6xl text-muted-foreground">📄</div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {documentName || "Documento PDF"}
              </h3>
              <p className="text-muted-foreground mb-4">
                Los archivos PDF subidos localmente no se pueden previsualizar
                aquí.
              </p>
              {/* ✅ <a> en lugar de <button> para evitar nested button */}
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Abrir PDF en nueva pestaña
              </a>
            </div>
          </div>
        );
      }

      // URL pública — iframe
      return (
        <div className="h-[90vh] w-full bg-transparent rounded-lg overflow-hidden">
          <iframe
            src={documentUrl}
            className="w-full h-full border-0 rounded-lg bg-transparent"
            title={documentName || "PDF Document"}
            style={{ background: "transparent" }}
          />
        </div>
      );
    }

    // Otros tipos
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] gap-4">
        <div className="text-6xl text-muted-foreground">📄</div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            {documentName || "Documento"}
          </h3>
          <p className="text-muted-foreground mb-4">
            Vista previa no disponible para este tipo de archivo
          </p>
          {/* ✅ <a> en lugar de <button> */}
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Abrir en nueva pestaña
          </a>
        </div>
      </div>
    );
  };

  return (
    <MCModalBase
      id="previewDocumentsDialog"
      title={documentName || "Vista previa del documento"}
      // ✅ El trigger debe ser un elemento NO-button para evitar
      // <button><button></button></button>. Si children ya es un <div>,
      // MCModalBase lo envolverá correctamente. Si es un <button>, convertirlo
      // en <div role="button"> en el sitio donde se use este componente.
      trigger={children}
      size="xl"
    >
      <div className="p-4">{renderPreviewContent()}</div>
    </MCModalBase>
  );
}

export default PreviewDocumentsDialog;
