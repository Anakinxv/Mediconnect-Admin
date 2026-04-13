import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import MCTablesLayouts from "@/shared/components/MCTablesLayouts";
import MCPDFButton from "@/shared/components/forms/MCPDFButton";
import { MCFilterPopover } from "@/shared/components/filters/MCFilterPopover";
import MCFilterInput from "@/shared/components/filters/MCFilterInput";
import MCGeneratePDF from "@/shared/components/forms/MCGeneratePDF";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/shared/ui/empty";
import MCButton from "@/shared/components/forms/MCButton";
import { Filter, Users } from "lucide-react";
import PatientsTable, {
  type Patient,
} from "../components/patient/PatientsTable";
import PatientFilters from "../components/filters/Patientfilters";
import {
  useGetPatientsAdmin,
  type PatientAdminListItem,
  type GetPatientsAdminParams,
} from "../hooks/patients/usePatients";

// ─── Mappers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const mapPatientToTableRow = (patient: PatientAdminListItem): Patient => ({
  id: patient.usuarioId.toString(),
  name: `${patient.nombre} ${patient.apellido}`.trim(),
  image: patient.fotoPerfil ?? undefined,
  status: patient.estado, // Añadimos el estado aquí
  registrationDate: formatDate(patient.creadoEn),
  phone: patient.telefono ?? "-",
  email: patient.email ?? "-",
});

const parseDate = (dateStr: string) => {
  if (!dateStr) return new Date(NaN);
  if (dateStr.includes("T")) return new Date(dateStr);
  const [d, m, y] = dateStr.split("/");
  if (!d || !m || !y) return new Date(NaN);
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const matchesDateRange = (dateStr: string, range?: [Date, Date]): boolean => {
  if (!range) return true;
  const date = parseDate(dateStr);
  date.setHours(0, 0, 0, 0);
  const start = new Date(range[0]);
  start.setHours(0, 0, 0, 0);
  const end = new Date(range[1]);
  end.setHours(23, 59, 59, 999);
  return date >= start && date <= end;
};

// ─── Página ───────────────────────────────────────────────────────────────────

function PatientsPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateRange: undefined as [Date, Date] | undefined,
    status: "all", // Nuevo estado para el filtro
  });

  const activeFiltersCount =
    (filters.dateRange ? 1 : 0) + (filters.status !== "all" ? 1 : 0);

  const clearFilters = () => {
    setFilters({ dateRange: undefined, status: "all" });
    setSearchTerm("");
  };

  // Parámetros API: Pasamos el estado al backend
  const apiParams = useMemo<GetPatientsAdminParams>(
    () => ({
      nombre: searchTerm?.trim() || undefined,
      estado: filters.status !== "all" ? filters.status : undefined,
      pagina: 1,
      limite: 100,
    }),
    [searchTerm, filters.status],
  );

  const { data: apiPatients = [] } = useGetPatientsAdmin(apiParams);

  const safePatients = Array.isArray(apiPatients) ? apiPatients : [];

  const tablePatients = useMemo(
    () => safePatients.map(mapPatientToTableRow),
    [safePatients],
  );

  // Filtros combinados en el lado del cliente (para búsqueda y fechas)
  const filteredPatients = useMemo(
    () =>
      tablePatients.filter((patient) => {
        const matchesSearch =
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm);

        const matchesDate = matchesDateRange(
          patient.registrationDate,
          filters.dateRange,
        );

        return matchesSearch && matchesDate;
      }),
    [tablePatients, searchTerm, filters.dateRange],
  );

  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t("patients.searchPlaceholder")}
        value={searchTerm}
        onChange={setSearchTerm}
      />
    </div>
  );

  const pdfGeneratorComponent = (
    <MCPDFButton
      onClick={async () => {
        await MCGeneratePDF({
          columns: [
            { title: t("patients.table.patient"), key: "name" },
            { title: t("table.status"), key: "status" }, // Agregado al PDF
            { title: t("table.registrationDate"), key: "registrationDate" },
            { title: t("table.phone"), key: "phone" },
            { title: t("table.email"), key: "email" },
          ],
          data: filteredPatients,
          fileName: "pacientes",
          title: t("patients.title"),
          subtitle: t("patients.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <PatientFilters
        filters={filters}
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />
    </MCFilterPopover>
  );

  const emptyState = (
    <Empty>
      <EmptyHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center justify-center gap-2 text-primary">
            {activeFiltersCount > 0 ? (
              <Filter className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            ) : (
              <Users className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("patients.empty.noResults")
                : t("patients.empty.noPatients")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t("patients.empty.noResultsDescription")
              : t("patients.empty.noPatientsDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 && (
            <MCButton
              variant="outline"
              onClick={clearFilters}
              className={isMobile ? "px-4 py-2" : "px-6 py-2"}
              size="sm"
            >
              {t("patients.empty.clearFilters")}
            </MCButton>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredPatients.length === 0 ? (
      emptyState
    ) : (
      <PatientsTable patients={filteredPatients} />
    );

  const metrics = [
    {
      title: t("patients.metrics.total"),
      value: safePatients.length,
      icon: <Users size={30} />,
      subtitle: t("patients.metrics.totalSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("patients.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
    />
  );
}

export default PatientsPage;
