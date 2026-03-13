import { useEffect } from "react";
import { CircleCheck, CircleSlash, Eye } from "lucide-react";
import { useState } from "react";
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
import type { DoctorDocuments } from "@/types/Documents";

const initialDoctorDocuments: DoctorDocuments = {
  identityDocumentFile: {
    url: "#",
    name: "cedula-identificacion.pdf",
    type: "application/pdf",
    size: 1.8 * 1024 * 1024,
    uploadedAt: "Subido el 15 Oct 2025",
    verificationStatus: "PENDING",
    feedback: "En revisión",
  },
  academicTitle: {
    url: "#",
    name: "titulo-universitario.pdf",
    type: "application/pdf",
    size: 1.8 * 1024 * 1024,
    uploadedAt: "Subido el 15 Oct 2025",
    verificationStatus: "PENDING",
    feedback: "En revisión",
  },
  certifications: [
    {
      url: "#",
      name: "certificacion.pdf",
      type: "application/pdf",
      size: 1.8 * 1024 * 1024,
      uploadedAt: "Subido el 15 Oct 2025",
    },
  ],
  certificationsStatus: "PENDING",
  certificationsFeedback: "En revisión",
};

function AdminActionRow({
  onApprove,
  onRejectConfirm,
}: {
  onApprove: () => void;
  onRejectConfirm: (feedback: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 pt-3 mt-1 border-t border-primary/10">
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
          onClick={onApprove}
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
              onClick={() => {
                onRejectConfirm(feedback);
                setFeedback("");
                setOpen(false);
              }}
              className="w-full sm:w-auto"
            >
              Confirmar
            </MCButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminDoctorDocumentsView() {
  const { doctorDocuments, setDoctorDocuments } = useVerifyInfoStore();

  useEffect(() => {
    if (!doctorDocuments) setDoctorDocuments(initialDoctorDocuments);
  }, [doctorDocuments, setDoctorDocuments]);

  if (!doctorDocuments) return null;

  const approve = (field: "identityDocumentFile" | "academicTitle") =>
    setDoctorDocuments({
      ...doctorDocuments,
      [field]: {
        ...doctorDocuments[field]!,
        verificationStatus: "APPROVED",
        feedback: "Aprobado",
      },
    });

  const reject = (
    field: "identityDocumentFile" | "academicTitle",
    fb: string,
  ) =>
    setDoctorDocuments({
      ...doctorDocuments,
      [field]: {
        ...doctorDocuments[field]!,
        verificationStatus: "REJECTED",
        feedback: fb,
      },
    });

  return (
    <div className="space-y-4">
      {/* Reutiliza DocumentCard existente en modo lectura + acciones debajo */}
      <div>
        <DocumentCard
          title="Documento de Identidad"
          document={doctorDocuments.identityDocumentFile}
        />
        <AdminActionRow
          onApprove={() => approve("identityDocumentFile")}
          onRejectConfirm={(fb) => reject("identityDocumentFile", fb)}
        />
      </div>

      {doctorDocuments.academicTitle && (
        <div>
          <DocumentCard
            title="Título Académico"
            document={doctorDocuments.academicTitle}
          />
          <AdminActionRow
            onApprove={() => approve("academicTitle")}
            onRejectConfirm={(fb) => reject("academicTitle", fb)}
          />
        </div>
      )}

      <div>
        <DocumentCard
          title="Certificaciones Adicionales"
          documents={doctorDocuments.certifications || []}
          isArray
          arrayParentStatus={doctorDocuments.certificationsStatus || "PENDING"}
          arrayParentFeedback={doctorDocuments.certificationsFeedback}
        />
        <AdminActionRow
          onApprove={() =>
            setDoctorDocuments({
              ...doctorDocuments,
              certificationsStatus: "APPROVED",
              certificationsFeedback: "Aprobado",
            })
          }
          onRejectConfirm={(fb) =>
            setDoctorDocuments({
              ...doctorDocuments,
              certificationsStatus: "REJECTED",
              certificationsFeedback: fb,
            })
          }
        />
      </div>
    </div>
  );
}
