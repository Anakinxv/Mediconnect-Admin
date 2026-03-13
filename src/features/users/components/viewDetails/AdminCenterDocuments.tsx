import { useEffect } from "react";
import DocumentCard from "./AdminDocumentCard";
import { useVerifyInfoStore } from "@/stores/useVerifyInfoStore";
import type { CenterDocuments, UploadedFile } from "@/types/Documents";

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

  useEffect(() => {
    if (!centerDocuments) setCenterDocuments(initialCenterDocuments);
  }, [centerDocuments, setCenterDocuments]);

  if (!centerDocuments) return null;

  const handleApproveHealthCertificate = (_doc: UploadedFile) => {
    setCenterDocuments({
      ...centerDocuments,
      healthCertificateFile: {
        ...centerDocuments.healthCertificateFile,
        verificationStatus: "APPROVED",
        feedback: "Documento verificado correctamente.",
      },
    });
  };

  const handleRejectHealthCertificate = (
    _doc: UploadedFile | null,
    feedback: string,
  ) => {
    setCenterDocuments({
      ...centerDocuments,
      healthCertificateFile: {
        ...centerDocuments.healthCertificateFile,
        verificationStatus: "REJECTED",
        feedback,
      },
    });
  };

  return (
    <div className="space-y-4">
      <DocumentCard
        title="Certificado de Salud"
        document={centerDocuments.healthCertificateFile}
        onApprove={handleApproveHealthCertificate}
        onReject={handleRejectHealthCertificate}
      />
    </div>
  );
}
