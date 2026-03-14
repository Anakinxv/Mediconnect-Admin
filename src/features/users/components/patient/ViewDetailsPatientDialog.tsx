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
      <p className="text-base md:text-lg text-primary font-medium break-words max-w-xs">
        {value || "—"}
      </p>
    </div>
  );
}

function ViewDetailsPatientDialog({
  children,
  patientId,
  patientName = "Derek Hernandez",
  patientImage,
}: ViewDetailsPatientDialogProps) {
  const isMobile = useIsMobile();

  return (
    <MCModalBase
      id={`patient-modal-${patientId}`}
      title="Detalles del Paciente"
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
            Información Personal
          </h3>

          <div
            className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-4 md:gap-6`}
          >
            <InfoItem label="Nombre(s)" value="Derek" />
            <InfoItem label="Apellido(s)" value="Hernandez" />
            <InfoItem label="Género" value="Masculino" />
            <InfoItem label="Fecha de Nacimiento" value="20/10/2004" />
            <InfoItem label="Nacionalidad" value="Dominicano" />
            <InfoItem label="Número de identificación" value="402-3445875-4" />
          </div>
        </section>

        <Separator className="my-1" />

        <section className="space-y-4">
          <h3 className="text-base sm:text-lg text-primary font-medium">
            Contacto
          </h3>

          <div
            className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-2"} gap-4 md:gap-6`}
          >
            <InfoItem label="Teléfono móvil" value="809-002-1525" />
            <InfoItem label="Correo electrónico" value="derekh@coreo.com" />
            <InfoItem
              label="Dirección Física"
              value="Calle Benito Juárez, El Vergel, Zona Colonial, República Dominicana"
            />
          </div>
        </section>
      </div>
    </MCModalBase>
  );
}

export default ViewDetailsPatientDialog;
