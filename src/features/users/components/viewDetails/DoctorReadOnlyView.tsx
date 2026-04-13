import { useTranslation } from "react-i18next";
import type { DoctorPersonalInfo } from "@/schema/verifyInfo.schema";

const formatPhone = (phone?: string): string => {
  if (!phone || phone === "-") return phone ?? "-";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
};

const formatExequatur = (exequatur?: string): string => {
  if (!exequatur || exequatur === "-") return "-";
  const trimmed = exequatur.trim();
  return /^\d+$/.test(trimmed) ? `EXQ-${trimmed}` : trimmed;
};

const formatDominicanCedula = (value?: string): string => {
  if (!value || value === "-") return value ?? "-";
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return value;
  return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10)}`;
};

// ─── Componente ───────────────────────────────────────────────────────────────

interface DoctorReadOnlyViewProps {
  data: DoctorPersonalInfo;
}

function DoctorReadOnlyView({ data }: DoctorReadOnlyViewProps) {
  const { t } = useTranslation("common");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {/* Nombre */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.firstName")}
        </p>
        <p className="font-medium text-foreground break-words">
          {data.firstName}
        </p>
      </div>

      {/* Apellido */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.lastName")}
        </p>
        <p className="font-medium text-foreground break-words">
          {data.lastName}
        </p>
      </div>

      {/* Género */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.gender")}
        </p>
        <p className="font-medium text-foreground">{data.gender}</p>
      </div>

      {/* Correo */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.email")}
        </p>
        <p className="font-medium text-foreground break-words">{data.email}</p>
      </div>

      {/* Nacionalidad */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.nationality")}
        </p>
        <p className="font-medium text-foreground">{data.nationality}</p>
      </div>

      {/* Número de identificación */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.identificationNumber")}
        </p>
        <p className="font-medium text-foreground font-mono tracking-wide">
          {formatDominicanCedula(data.identificationNumber)}
        </p>
      </div>

      {/* Teléfono ✅ formateado */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.phone")}
        </p>
        <p className="font-medium text-foreground">{formatPhone(data.phone)}</p>
      </div>

      {/* Dirección física */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.physicalAddress")}
        </p>
        <p className="font-medium text-foreground break-words">
          {data.address}
        </p>
      </div>

      {/* Especialidad principal */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.primarySpecialty")}
        </p>
        <p className="font-medium text-foreground">{data.primarySpecialty}</p>
      </div>

      {/* Especialidad secundaria */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.secondarySpecialty")}
        </p>
        <p className="font-medium text-foreground">
          {data.secondarySpecialty || "-"}
        </p>
      </div>

      {/* Licencia médica (Exequatur) ✅ formateada */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {t("verification.identification.medicalLicense")}
        </p>
        <p className="font-medium text-foreground font-mono tracking-wide">
          {formatExequatur(data.medicalLicense)}
        </p>
      </div>
    </div>
  );
}

export default DoctorReadOnlyView;
