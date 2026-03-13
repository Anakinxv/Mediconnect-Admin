import React, { useState } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import { useVerifyInfoStore } from "@/stores/useVerifyInfoStore";
import { mockDoctorData, mockCenterData } from "@/data/verifyInfoMock";
import VerificationProgressSidebar from "../components/viewDetails/VerificationProgressSidebar";
import AdminIdentificationCard from "../components/viewDetails/AdminIdentificationCard";
import DocumentsSection from "../components/viewDetails/DocumentsSection";
import AdminDoctorDocumentsView from "../components/viewDetails/AdminDoctorDocuments";
import AdminCenterDocumentsView from "../components/viewDetails/AdminCenterDocuments";
import type { VerificationStatus } from "../components/viewDetails/Verificationconstants";

function ViewDetailsPage({ isDoctor = true }: { isDoctor?: boolean }) {
  const [activeTab, setActiveTab] = useState("identificacion");
  const { doctorInfo, centerInfo, doctorDocuments, centerDocuments } =
    useVerifyInfoStore();

  const currentInfo = isDoctor
    ? doctorInfo || mockDoctorData
    : centerInfo || mockCenterData;

  const currentStatus: VerificationStatus = currentInfo.verificationStatus;

  const getDocumentsStatus = (): VerificationStatus => {
    if (isDoctor && doctorDocuments) {
      const statuses = [
        doctorDocuments.identityDocumentFile?.verificationStatus,
        doctorDocuments.academicTitle?.verificationStatus,
        doctorDocuments.certificationsStatus,
      ].filter(Boolean) as VerificationStatus[];
      if (!statuses.length) return "PENDING";
      if (statuses.some((s) => s === "REJECTED")) return "REJECTED";
      if (statuses.every((s) => s === "APPROVED")) return "APPROVED";
    }
    if (!isDoctor && centerDocuments) {
      return (
        centerDocuments.healthCertificateFile?.verificationStatus || "PENDING"
      );
    }
    return "PENDING";
  };

  const documentsStatus = getDocumentsStatus();

  const getProgressData = () => {
    const identificationApproved = currentStatus === "APPROVED" ? 1 : 0;

    if (isDoctor) {
      const docStatuses: VerificationStatus[] = [
        doctorDocuments?.identityDocumentFile?.verificationStatus ?? "PENDING",
        doctorDocuments?.academicTitle?.verificationStatus ?? "PENDING",
        doctorDocuments?.certificationsStatus ?? "PENDING",
      ];
      const docsApproved = docStatuses.filter((s) => s === "APPROVED").length;
      const totalSteps = 1 + docStatuses.length; // identificación + 3 docs
      const completedSteps = identificationApproved + docsApproved;
      const percentage = Math.round((completedSteps / totalSteps) * 100);

      return { completedSteps, totalSteps, percentage };
    }

    const centerDocApproved =
      centerDocuments?.healthCertificateFile?.verificationStatus === "APPROVED"
        ? 1
        : 0;
    const totalSteps = 2; // identificación + documento del centro
    const completedSteps = identificationApproved + centerDocApproved;
    const percentage = Math.round((completedSteps / totalSteps) * 100);

    return { completedSteps, totalSteps, percentage };
  };

  const progress = getProgressData();

  return (
    <MCDashboardContent mainWidth="w-[100%]" noBg>
      <div className="min-h-screen w-full">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          <section className="flex flex-col gap-4 sm:grid sm:grid-cols-[3fr_7fr]">
            <VerificationProgressSidebar
              activeTab={activeTab}
              currentStatus={currentStatus}
              documentsStatus={documentsStatus}
              isDoctor={isDoctor}
              onTabChange={setActiveTab}
              progressPercentage={progress.percentage}
              completedSteps={progress.completedSteps}
              totalSteps={progress.totalSteps}
            />
            <main className="mt-4 sm:mt-0">
              {activeTab === "identificacion" && (
                <AdminIdentificationCard
                  isDoctor={isDoctor}
                  currentStatus={currentStatus}
                  currentInfo={currentInfo}
                />
              )}
              {activeTab === "documentos" && (
                <DocumentsSection
                  isDoctor={isDoctor}
                  currentStatus={documentsStatus}
                >
                  {isDoctor ? (
                    <AdminDoctorDocumentsView />
                  ) : (
                    <AdminCenterDocumentsView />
                  )}
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
