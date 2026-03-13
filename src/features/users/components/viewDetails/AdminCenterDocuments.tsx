import { useEffect, useState } from "react";
import { CircleCheck, CircleSlash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";
import MCButton from "@/shared/components/forms/MCButton";
import DocumentCard from "./AdminDocumentCard";
import { useVerifyInfoStore } from "@/stores/useVerifyInfoStore";
import type { CenterDocuments } from "@/types/Documents";

const initialCenterDocuments: CenterDocuments = {
  healthCertificateFile: {
    url: "#",
    name: "certificado-salud.pdf",
    type: "application/pdf",
    size: 2.1 * 1024 * 1024,
    uploadedAt: "Subido el 20 Oct 2025",
    verificationStatus: "PENDING",
    feedback: "En revisión",
  },
};

export default function AdminCenterDocumentsView() {
  const { centerDocuments, setCenterDocuments } = useVerifyInfoStore();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!centerDocuments) setCenterDocuments(initialCenterDocuments);
  }, [centerDocuments, setCenterDocuments]);

  if (!centerDocuments) return null;

  const handleApprove = () =>
    setCenterDocuments({
      healthCertificateFile: {
        ...centerDocuments.healthCertificateFile!,
        verificationStatus: "APPROVED",
        feedback: "Aprobado",
      },
    });

  const handleReject = () => {
    setCenterDocuments({
      healthCertificateFile: {
        ...centerDocuments.healthCertificateFile!,
        verificationStatus: "REJECTED",
        feedback,
      },
    });
    setFeedback("");
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <DocumentCard
        title="Certificado de Salud"
        document={centerDocuments.healthCertificateFile}
      />

      <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-primary/10">
        <MCButton
          variant="outlineDelete"
          size="sm"
          className="flex-1 flex items-center gap-2 justify-center"
          onClick={() => setOpen(true)}
        >
          <CircleSlash className="w-4 h-4" /> Rechazar
        </MCButton>
        <MCButton
          size="sm"
          className="flex-1 flex items-center gap-2 justify-center"
          onClick={handleApprove}
        >
          <CircleCheck className="w-4 h-4" /> Aprobar
        </MCButton>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <CircleSlash className="w-5 h-5" /> Rechazar Documento
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Motivo del rechazo..."
            className="min-h-[100px] resize-none"
          />
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <MCButton
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </MCButton>
            <MCButton
              variant="outlineDelete"
              size="sm"
              disabled={!feedback.trim()}
              onClick={handleReject}
              className="w-full sm:w-auto"
            >
              Confirmar
            </MCButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
