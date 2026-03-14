import { useTranslation } from "react-i18next";
import { MCModalBase } from "@/shared/components/MCModalBase";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/MCUserAvatar";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Separator } from "@/shared/ui/separator";

interface ViewDetailsPatientDialogProps {
  children: React.ReactNode;
  patientId: number | string;
  patientName?: string;
  patientImage?: string;
}

function InfoItem({ label, value }: { label: string; value: string }) {
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
  patientName = "Valeria Gómez",
  patientImage,
}: ViewDetailsPatientDialogProps) {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();

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
            {patientImage ? (
              <AvatarImage
                src={patientImage}
                alt={patientName}
                className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-full border border-primary/5">
                <MCUserAvatar
                  name={patientName}
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
            {patientName}
          </h3>
        </header>

        <Separator className="my-1" />

        <section className="space-y-4">
          <h3 className="text-base sm:text-lg text-primary font-medium">
            {t("patientDetails.personalInfo")}
          </h3>
          <div
            className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-4 md:gap-6`}
          >
            <InfoItem label={t("patientDetails.firstName")} value="Valeria" />
            <InfoItem label={t("patientDetails.lastName")} value="Gómez" />
            <InfoItem label={t("patientDetails.gender")} value="Femenino" />
            <InfoItem
              label={t("patientDetails.birthDate")}
              value="15/03/1998"
            />
            <InfoItem
              label={t("patientDetails.nationality")}
              value="Mexicana"
            />
            <InfoItem
              label={t("patientDetails.idNumber")}
              value="123-4567890-1"
            />
          </div>
        </section>

        <Separator className="my-1" />

        <section className="space-y-4">
          <h3 className="text-base sm:text-lg text-primary font-medium">
            {t("patientDetails.contact")}
          </h3>
          <div className={`flex flex-col gap-4 md:gap-6 items-start w-full`}>
            <div className="grid grid-cols-2 gap-4 md:col-span-1 w-full">
              <InfoItem
                label={t("patientDetails.phone")}
                value="555-123-4567"
              />
              <InfoItem
                label={t("patientDetails.email")}
                value="valeria.gomez@email.com"
              />
            </div>
            <div className="md:col-span-2 flex flex-col h-full  w-full ">
              <InfoItem
                label={t("patientDetails.address")}
                value="Av. Reforma 123, Ciudad de México, México"
              />
            </div>
          </div>
        </section>
      </div>
    </MCModalBase>
  );
}

export default ViewDetailsPatientDialog;
