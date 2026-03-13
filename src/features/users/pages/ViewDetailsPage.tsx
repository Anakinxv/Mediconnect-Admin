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

  return (
    <MCDashboardContent mainWidth="w-[100%]" noBg>
      <div className="min-h-screen w-full">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          <section className="flex flex-col gap-4 sm:grid sm:grid-cols-[3fr_7fr]">
            <VerificationProgressSidebar
              activeTab={activeTab}
              currentStatus={currentStatus}
              isDoctor={isDoctor}
              onTabChange={setActiveTab}
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
                  currentStatus={getDocumentsStatus()}
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
