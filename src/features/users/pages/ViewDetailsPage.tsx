import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import VerificationProgressSidebar from "../components/viewDetails/VerificationProgressSidebar";
import AdminIdentificationCard from "../components/viewDetails/AdminIdentificationCard";
import DocumentsSection from "../components/viewDetails/DocumentsSection";
import AdminDoctorDocumentsView from "../components/viewDetails/AdminDoctorDocuments";
import type { VerificationStatus } from "../components/viewDetails/Verificationconstants";
import {
  useGetDoctorAdminDetail,
  resolveDocumentStatus,
  type DoctorDetailAdmin,
} from "../hooks/doctors/useDoctors";
import type { DoctorPersonalInfo } from "@/schema/verifyInfo.schema";

// ─── Mapper API → DoctorPersonalInfo ─────────────────────────────────────────
// ⚠️  El API devuelve "En revisión" (no "pendiente"), por eso mapeamos
//     cualquier valor no reconocido a "PENDING" como fallback.

const mapToDoctorPersonalInfo = (
  doctor: DoctorDetailAdmin,
): DoctorPersonalInfo => {
  const primaryEsp = doctor.especialidades.find((e) => e.es_principal);
  const secondaryEsp = doctor.especialidades.find((e) => !e.es_principal);

  const resolveStatus = (
    raw: string,
  ): DoctorPersonalInfo["verificationStatus"] => {
    const v = raw?.toLowerCase().trim();
    if (v === "aprobado" || v === "approved") return "APPROVED";
    if (v === "rechazado" || v === "rejected") return "REJECTED";
    // "En revisión", "Pendiente", o cualquier otro valor → PENDING
    return "PENDING";
  };

  return {
    firstName: doctor.nombre,
    lastName: doctor.apellido,
    gender: doctor.genero,
    email: doctor.usuario.email,
    nationality: doctor.nacionalidad,
    identificationNumber: doctor.numeroDocumentoIdentificacion,
    phone: doctor.usuario.telefono,
    address: doctor.ubicaciones[0]?.direccionCompleta ?? "",
    primarySpecialty: primaryEsp?.especialidades?.nombre ?? "-",
    secondarySpecialty: secondaryEsp?.especialidades?.nombre ?? "-",
    medicalLicense: doctor.exequatur,
    verificationStatus: resolveStatus(doctor.estadoVerificacion),
  };
};

// ─── Cálculo del progreso ─────────────────────────────────────────────────────

const getProgressData = (
  identificationStatus: VerificationStatus,
  docStatuses: VerificationStatus[],
) => {
  const identOk = identificationStatus === "APPROVED" ? 1 : 0;
  const docsApproved = docStatuses.filter((s) => s === "APPROVED").length;
  const totalSteps = 1 + docStatuses.length;
  const completedSteps = identOk + docsApproved;
  const percentage =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  return { completedSteps, totalSteps, percentage };
};

// ─── Page ─────────────────────────────────────────────────────────────────────

function ViewDetailsPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [activeTab, setActiveTab] = useState("identificacion");

  const id = doctorId ? parseInt(doctorId, 10) : null;
  const {
    data: doctorDetail,
    isLoading,
    refetch,
  } = useGetDoctorAdminDetail(id);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "documentos") {
      refetch();
    }
  };

  if (isLoading || !doctorDetail) {
    return (
      <MCDashboardContent mainWidth="w-[100%]" noBg>
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
          Cargando...
        </div>
      </MCDashboardContent>
    );
  }

  const doctorInfo = mapToDoctorPersonalInfo(doctorDetail);
  const currentStatus = doctorInfo.verificationStatus;

  const docStatuses = doctorDetail.documentos.map((doc) =>
    resolveDocumentStatus(doc.estadoRevision),
  );

  const documentsStatus: VerificationStatus = docStatuses.some(
    (s) => s === "REJECTED",
  )
    ? "REJECTED"
    : docStatuses.every((s) => s === "APPROVED") && docStatuses.length > 0
      ? "APPROVED"
      : "PENDING";

  const progress = getProgressData(currentStatus, docStatuses);

  return (
    <MCDashboardContent mainWidth="w-[100%]" noBg>
      <div className="min-h-screen w-full">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          <section className="flex flex-col gap-4 sm:grid sm:grid-cols-[3fr_7fr]">
            <VerificationProgressSidebar
              activeTab={activeTab}
              currentStatus={currentStatus}
              documentsStatus={documentsStatus}
              isDoctor={true}
              onTabChange={handleTabChange}
              progressPercentage={progress.percentage}
              completedSteps={progress.completedSteps}
              totalSteps={progress.totalSteps}
            />
            <main className="mt-4 sm:mt-0">
              {activeTab === "identificacion" && (
                <AdminIdentificationCard
                  isDoctor={true}
                  currentStatus={currentStatus}
                  currentInfo={doctorInfo}
                  doctorId={doctorDetail.usuarioId}
                />
              )}
              {activeTab === "documentos" && (
                <DocumentsSection
                  isDoctor={true}
                  currentStatus={documentsStatus}
                >
                  <AdminDoctorDocumentsView
                    documents={doctorDetail.documentos}
                    doctorId={doctorDetail.usuarioId}
                  />
                </DocumentsSection>
              )}
            </main>
          </section>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ViewDetailsPage;
