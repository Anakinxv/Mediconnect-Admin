// src/components/patient/ViewDetailsPatientDialog.tsx
import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/MCUserAvatar";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Separator } from "@/shared/ui/separator";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  useGetPatientAdminDetail,
  mapGender,
  calculateAge,
} from "../../hooks/patients/usePatients";

interface ViewDetailsPatientDialogProps {
  children: React.ReactNode;
  patientId: number | string;
  patientName?: string;
  patientImage?: string;
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <h4 className="text-sm md:text-md text-primary/75 font-medium">
        {label}
      </h4>
      <p className="text-base md:text-lg text-primary font-medium ">
        {value || "—"}
      </p>
    </div>
  );
}

function ViewDetailsPatientDialog({
  children,
  patientId,
  patientName = "Cargando...",
  patientImage,
}: ViewDetailsPatientDialogProps) {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();

  // Realizamos el fetch solo cuando el modal está montado con ese id
  const { data: patient, isLoading } = useGetPatientAdminDetail(patientId);

  const displayName = patient
    ? `${patient.nombre} ${patient.apellido}`
    : patientName;
  const displayImage = patient?.fotoPerfil || patientImage;

  return (
    <MCModalBase
      id={`patient-modal-${patientId}`}
      title={t("patientDetails.title")}
      trigger={children}
      variant="info"
      size="lgAuto"
    >
      <div className="flex flex-col gap-4 w-full pb-2">
        <header className="flex items-center gap-4">
          <Avatar
            className={`${isMobile ? "h-14 w-14" : "h-16 w-16"} bg-muted`}
          >
            {displayImage ? (
              <AvatarImage
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-full border border-primary/5">
                <MCUserAvatar
                  name={displayName}
                  square={false}
                  size={isMobile ? 48 : 64}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            )}
          </Avatar>
          <h3
            className={`${isMobile ? "text-xl" : "text-3xl"} font-semibold text-primary`}
          >
            {displayName}
          </h3>
        </header>

        <Separator className="my-1" />

        <section className="space-y-4">
          <h3 className="text-base sm:text-lg text-primary font-medium">
            {t("patientDetails.personalInfo")}
          </h3>
          {isLoading ? (
            <div
              className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-4 md:gap-6`}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div
              className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-4 md:gap-6`}
            >
              <InfoItem
                label={t("patientDetails.firstName")}
                value={patient?.nombre}
              />
              <InfoItem
                label={t("patientDetails.lastName")}
                value={patient?.apellido}
              />
              <InfoItem
                label={t("patientDetails.gender")}
                value={patient?.genero ? mapGender(patient.genero) : "—"}
              />
              <InfoItem
                label={t("patientDetails.birthDate")}
                value={
                  patient?.fechaNacimiento
                    ? new Date(patient.fechaNacimiento).toLocaleDateString()
                    : "—"
                }
              />
              <InfoItem
                label={t("patientDetails.age")}
                value={
                  patient?.fechaNacimiento
                    ? calculateAge(patient.fechaNacimiento)
                    : "—"
                }
              />
              <InfoItem
                label={t("patientDetails.idNumber")}
                value={patient?.numeroDocumentoIdentificacion}
              />
              <InfoItem
                label={t("patientDetails.bloodType")}
                value={patient?.tipoSangre}
              />
              <InfoItem
                label={t("patientDetails.weight")}
                value={patient?.peso ? `${patient.peso} kg` : "—"}
              />
              <InfoItem
                label={t("patientDetails.height")}
                value={patient?.altura ? `${patient.altura} cm` : "—"}
              />
            </div>
          )}
        </section>

        <Separator className="my-1" />

        <section className="space-y-4">
          <h3 className="text-base sm:text-lg text-primary font-medium">
            {t("patientDetails.contact")}
          </h3>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ) : (
            <div className={`flex flex-col gap-4 md:gap-6 items-start w-full`}>
              <div className="grid grid-cols-2 gap-4 md:col-span-1 w-full">
                <InfoItem
                  label={t("patientDetails.phone")}
                  value={patient?.telefono}
                />
                <InfoItem
                  label={t("patientDetails.email")}
                  value={patient?.email}
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </MCModalBase>
  );
}

export default ViewDetailsPatientDialog;
