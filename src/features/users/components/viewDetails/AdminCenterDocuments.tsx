import { useEffect, useState } from "react";
import DocumentCard from "./AdminDocumentCard";
import { useVerifyInfoStore } from "@/stores/useVerifyInfoStore";
import type { DoctorDocuments, UploadedFile } from "@/types/Documents";
import type { VerificationStatus } from "./Verificationconstants";

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
    size: 2.3 * 1024 * 1024,
    uploadedAt: "Subido el 15 Oct 2025",
    verificationStatus: "PENDING",
    feedback: "En revisión",
  },
  certifications: [
    {
      url: "#",
      name: "certificacion-residencia-medica.pdf",
      type: "application/pdf",
      size: 1.8 * 1024 * 1024,
      uploadedAt: "Subido el 15 Oct 2025",
    },
    {
      url: "#",
      name: "certificacion-cardiologia-invasiva.pdf",
      type: "application/pdf",
      size: 2.1 * 1024 * 1024,
      uploadedAt: "Subido el 20 Nov 2025",
    },
    {
      url: "#",
      name: "certificacion-medicina-interna.pdf",
      type: "application/pdf",
      size: 1.5 * 1024 * 1024,
      uploadedAt: "Subido el 05 Dic 2025",
    },
    {
      url: "#",
      name: "certificacion-ultrasonido-cardiaco.pdf",
      type: "application/pdf",
      size: 3.2 * 1024 * 1024,
      uploadedAt: "Subido el 10 Dic 2025",
    },
    {
      url: "#",
      name: "certificacion-soporte-vital-avanzado.pdf",
      type: "application/pdf",
      size: 0.9 * 1024 * 1024,
      uploadedAt: "Subido el 22 Dic 2025",
    },
  ],
  certificationsStatus: "PENDING",
  certificationsFeedback: undefined,
};

export default function AdminDoctorDocumentsView() {
  const { doctorDocuments, setDoctorDocuments } = useVerifyInfoStore();

  // Per-certification individual statuses & feedbacks, keyed by doc.name
  const [certStatuses, setCertStatuses] = useState<
    Record<string, VerificationStatus>
  >({});
  const [certFeedbacks, setCertFeedbacks] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!doctorDocuments) setDoctorDocuments(initialDoctorDocuments);
  }, [doctorDocuments, setDoctorDocuments]);

  if (!doctorDocuments) return null;

  // ─── Identity document handlers ───────────────────────────────────────────
  const handleApproveIdentity = () => {
    setDoctorDocuments({
      ...doctorDocuments,
      identityDocumentFile: {
        ...doctorDocuments.identityDocumentFile,
        verificationStatus: "APPROVED",
        feedback: "Documento verificado correctamente.",
      },
    });
  };

  const handleRejectIdentity = (
    _doc: UploadedFile | null,
    feedback: string,
  ) => {
    setDoctorDocuments({
      ...doctorDocuments,
      identityDocumentFile: {
        ...doctorDocuments.identityDocumentFile,
        verificationStatus: "REJECTED",
        feedback,
      },
    });
  };

  // ─── Academic title handlers ───────────────────────────────────────────────
  const handleApproveTitle = () => {
    if (!doctorDocuments.academicTitle) return;
    setDoctorDocuments({
      ...doctorDocuments,
      academicTitle: {
        ...doctorDocuments.academicTitle,
        verificationStatus: "APPROVED",
        feedback: "Título verificado correctamente.",
      },
    });
  };

  const handleRejectTitle = (_doc: UploadedFile | null, feedback: string) => {
    if (!doctorDocuments.academicTitle) return;
    setDoctorDocuments({
      ...doctorDocuments,
      academicTitle: {
        ...doctorDocuments.academicTitle,
        verificationStatus: "REJECTED",
        feedback,
      },
    });
  };

  // ─── Certifications — individual handlers ─────────────────────────────────
  const handleApproveOneCert = (doc: UploadedFile) => {
    setCertStatuses((prev) => ({ ...prev, [doc.name]: "APPROVED" }));
    setCertFeedbacks((prev) => {
      const next = { ...prev };
      delete next[doc.name];
      return next;
    });
  };

  const handleRejectOneCert = (doc: UploadedFile | null, feedback: string) => {
    if (!doc) return;
    setCertStatuses((prev) => ({ ...prev, [doc.name]: "REJECTED" }));
    setCertFeedbacks((prev) => ({ ...prev, [doc.name]: feedback }));
  };

  // ─── Certifications — bulk handlers ───────────────────────────────────────
  const handleApproveAllCerts = () => {
    const allApproved: Record<string, VerificationStatus> = {};
    (doctorDocuments.certifications ?? []).forEach((d) => {
      allApproved[d.name] = "APPROVED";
    });
    setCertStatuses(allApproved);
    setDoctorDocuments({
      ...doctorDocuments,
      certificationsStatus: "APPROVED",
      certificationsFeedback: "Todas las certificaciones han sido aprobadas.",
    });
  };

  const handleRejectAllCerts = (feedback: string) => {
    const allRejected: Record<string, VerificationStatus> = {};
    const allFeedbacks: Record<string, string> = {};
    (doctorDocuments.certifications ?? []).forEach((d) => {
      allRejected[d.name] = "REJECTED";
      allFeedbacks[d.name] = feedback;
    });
    setCertStatuses(allRejected);
    setCertFeedbacks(allFeedbacks);
    setDoctorDocuments({
      ...doctorDocuments,
      certificationsStatus: "REJECTED",
      certificationsFeedback: feedback,
    });
  };

  return (
    <div className="space-y-4">
      {/* Identity document */}
      <DocumentCard
        title="Documento de Identidad"
        document={doctorDocuments.identityDocumentFile}
        onApprove={handleApproveIdentity}
        onReject={handleRejectIdentity}
      />

      {/* Academic title */}
      {doctorDocuments.academicTitle && (
        <DocumentCard
          title="Título Académico"
          document={doctorDocuments.academicTitle}
          onApprove={handleApproveTitle}
          onReject={handleRejectTitle}
        />
      )}

      {/* Certifications — individual approve/reject per cert */}
      <DocumentCard
        title="Certificaciones Adicionales"
        documents={doctorDocuments.certifications ?? []}
        isArray
        arrayParentStatus={doctorDocuments.certificationsStatus ?? "PENDING"}
        arrayParentFeedback={doctorDocuments.certificationsFeedback}
        onApprove={handleApproveOneCert}
        onReject={handleRejectOneCert}
        onApproveAll={handleApproveAllCerts}
        onRejectAll={handleRejectAllCerts}
        docStatuses={certStatuses}
        docFeedbacks={certFeedbacks}
      />
    </div>
  );
}
