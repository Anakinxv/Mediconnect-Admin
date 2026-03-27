import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import VerificationProgressSidebar from "../components/viewDetails/VerificationProgressSidebar";
import AdminIdentificationCard from "../components/viewDetails/AdminIdentificationCard";
import DocumentsSection from "../components/viewDetails/DocumentsSection";
import AdminDoctorDocumentsView from "../components/viewDetails/AdminDoctorDocuments";
import AdminCenterDocumentsView from "../components/viewDetails/AdminCenterDocuments";
import type { VerificationStatus } from "../components/viewDetails/Verificationconstants";
import {
  useGetDoctorAdminDetail,
  resolveDocumentStatus,
  type DoctorDetailAdmin,
} from "../hooks/doctors/useDoctors";
import {
  useGetCenterAdminDetail,
  type CenterDetailAdmin,
} from "../hooks/centers/useCenters";
import type {
  DoctorPersonalInfo,
  CenterPersonalInfo,
} from "@/schema/verifyInfo.schema";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ViewDetailsPageProps {
  isDoctor?: boolean;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

const resolveVerifStatus = (raw: string): VerificationStatus => {
  const v = raw?.toLowerCase().trim();
  if (v === "aprobado" || v === "approved") return "APPROVED";
  if (v === "rechazado" || v === "rejected") return "REJECTED";
  return "PENDING";
};

const mapToDoctorPersonalInfo = (
  doctor: DoctorDetailAdmin,
): DoctorPersonalInfo => {
  const primaryEsp = doctor.especialidades.find((e) => e.es_principal);
  const secondaryEsp = doctor.especialidades.find((e) => !e.es_principal);
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
    verificationStatus: resolveVerifStatus(doctor.estadoVerificacion),
  };
};

const mapToCenterPersonalInfo = (
  center: CenterDetailAdmin,
): CenterPersonalInfo => {
  const location = center.ubicacion as Partial<{
    direccion: string;
    direccionCompleta: string;
    provincia: string;
    municipio: string;
    latitud: number;
    longitud: number;
  }>;

  return {
    name: center.nombreComercial,
    centerType: center.tipoCentro?.nombre ?? "-",
    description: center.descripcion ?? "",
    address: location.direccionCompleta ?? location.direccion ?? "-",
    province: location.provincia ?? "-",
    municipality: location.municipio ?? "-",
    email: center.usuario.email,
    // telefono puede ser undefined en la API → fallback a "-"
    phone: center.usuario.telefono ?? "-",
    website: center.sitio_web ?? "",
    rnc: center.rnc,
    coordinates: {
      latitude: location.latitud ?? 18.4861,
      longitude: location.longitud ?? -69.9312,
    },
    verificationStatus: resolveVerifStatus(center.estadoVerificacion),
  };
};

// ─── Progreso ─────────────────────────────────────────────────────────────────

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

// ─── DoctorView ───────────────────────────────────────────────────────────────

function DoctorView({ doctorId }: { doctorId: number }) {
  const [activeTab, setActiveTab] = useState("identificacion");
  const { data, refetch } = useGetDoctorAdminDetail(doctorId);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "documentos") refetch();
  };

  if (!data) return null;

  const doctorInfo = mapToDoctorPersonalInfo(data);
  const currentStatus = doctorInfo.verificationStatus;

  const docStatuses = data.documentos.map((doc) =>
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
            doctorId={data.usuarioId}
          />
        )}
        {activeTab === "documentos" && (
          <DocumentsSection isDoctor={true} currentStatus={documentsStatus}>
            <AdminDoctorDocumentsView
              documents={data.documentos}
              doctorId={data.usuarioId}
            />
          </DocumentsSection>
        )}
      </main>
    </section>
  );
}

// ─── CenterView ───────────────────────────────────────────────────────────────

function CenterView({ centerId }: { centerId: number }) {
  const [activeTab, setActiveTab] = useState("identificacion");
  const { data, refetch } = useGetCenterAdminDetail(centerId);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "documentos") refetch();
  };

  if (!data) return null;

  const centerInfo = mapToCenterPersonalInfo(data);
  const currentStatus = centerInfo.verificationStatus;

  // Derivar estado del documento desde documentos_centros (más preciso que estadoVerificacion)
  const docActivo = data.documentos_centros?.find(
    (d) => d.estado !== "Eliminado",
  );
  const certStatus: VerificationStatus = docActivo
    ? docActivo.estado_revision?.toLowerCase() === "aprobado"
      ? "APPROVED"
      : docActivo.estado_revision?.toLowerCase() === "rechazado"
        ? "REJECTED"
        : "PENDING"
    : currentStatus;

  const docStatuses: VerificationStatus[] = data.certificacion_sanitaria
    ? [certStatus]
    : [];

  const documentsStatus: VerificationStatus =
    docStatuses.length === 0
      ? "PENDING"
      : docStatuses.every((s) => s === "APPROVED")
        ? "APPROVED"
        : docStatuses.some((s) => s === "REJECTED")
          ? "REJECTED"
          : "PENDING";

  const progress = getProgressData(currentStatus, docStatuses);

  return (
    <section className="flex flex-col gap-4 sm:grid sm:grid-cols-[3fr_7fr]">
      <VerificationProgressSidebar
        activeTab={activeTab}
        currentStatus={currentStatus}
        documentsStatus={documentsStatus}
        isDoctor={false}
        onTabChange={handleTabChange}
        progressPercentage={progress.percentage}
        completedSteps={progress.completedSteps}
        totalSteps={progress.totalSteps}
      />
      <main className="mt-4 sm:mt-0">
        {activeTab === "identificacion" && (
          <AdminIdentificationCard
            isDoctor={false}
            currentStatus={currentStatus}
            currentInfo={centerInfo}
            centerId={data.usuarioId}
          />
        )}
        {activeTab === "documentos" && (
          <DocumentsSection isDoctor={false} currentStatus={documentsStatus}>
            <AdminCenterDocumentsView
              certificacionUrl={data.certificacion_sanitaria ?? ""}
              certStatus={certStatus}
              centerId={data.usuarioId}
              documentosCentro={data.documentos_centros}
            />
          </DocumentsSection>
        )}
      </main>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ViewDetailsPage({ isDoctor = true }: ViewDetailsPageProps) {
  const { doctorId, centerId } = useParams<{
    doctorId?: string;
    centerId?: string;
  }>();

  const effectiveIsDoctor = doctorId ? true : centerId ? false : isDoctor;

  const parsedId = effectiveIsDoctor
    ? doctorId
      ? parseInt(doctorId, 10)
      : null
    : centerId
      ? parseInt(centerId, 10)
      : null;

  return (
    <MCDashboardContent mainWidth="w-[100%]" noBg>
      <div className="min-h-screen w-full">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          {effectiveIsDoctor && parsedId ? (
            <DoctorView doctorId={parsedId} />
          ) : !effectiveIsDoctor && parsedId ? (
            <CenterView centerId={parsedId} />
          ) : (
            <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
              ID no encontrado
            </div>
          )}
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ViewDetailsPage;
