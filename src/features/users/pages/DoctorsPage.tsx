import React, { useState, useMemo } from "react";
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
import { UserCheck, UserX, Clock, Filter, Stethoscope } from "lucide-react";
import DoctorsTable, { type Doctor } from "../components/doctor/DoctorsTable";
import DoctorFilters from "../components/filters/DoctorFilters";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import {
  useGetDoctorsAdmin,
  resolveVerificationStatus,
  mapStatusToApi,
  type DoctorAdminListItem,
  type GetDoctorsAdminParams,
} from "../hooks/doctors/useDoctors";

// ─── Mapper API → Doctor (interfaz de la tabla) ───────────────────────────────

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

const mapDoctorToTableRow = (doctor: DoctorAdminListItem): Doctor => ({
  id: doctor.id.toString(),
  name: `${doctor.nombre} ${doctor.apellido}`,
  image: doctor.usuario?.fotoPerfil,
  // ✅ El estado de la tabla usa estadoVerificacion (estado global)
  status: resolveVerificationStatus(doctor.estadoVerificacion),
  registrationDate: formatDate(doctor.creadoEn),
  // ✅ Mostrar "-" con nota cuando la API no devuelve usuario en lista
  phone: doctor.usuario?.telefono ?? "-",
  email: doctor.usuario?.email ?? "-",
  specialty:
    doctor.especialidades.find((e) => e.es_principal)?.nombre ??
    doctor.especialidades[0]?.nombre ??
    "-",
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

// ─── Page ─────────────────────────────────────────────────────────────────────

function DoctorsPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    specialty: "all",
    dateRange: undefined as [Date, Date] | undefined,
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.specialty !== "all" && filters.specialty !== "") count++;
    if (filters.dateRange) count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({ status: "all", specialty: "all", dateRange: undefined });
    setSearchTerm("");
  };

  // ── Params para la API ───────────────────────────────────────────────────
  const apiParams = useMemo<GetDoctorsAdminParams>(
    () => ({
      nombre: searchTerm?.trim() || undefined,
      estadoVerificacion: mapStatusToApi(filters.status),
      pagina: 1,
      limite: 100,
    }),
    [searchTerm, filters.status],
  );

  const { data: apiDoctors = [] } = useGetDoctorsAdmin(apiParams);

  const safeDoctors = Array.isArray(apiDoctors) ? apiDoctors : [];

  // ── Mapeo API → tabla ────────────────────────────────────────────────────
  const tableDoctors = useMemo(
    () => safeDoctors.map(mapDoctorToTableRow),
    [safeDoctors],
  );

  // ── Filtros client-side (specialty + dateRange) ──────────────────────────
  const filteredDoctors = useMemo(
    () =>
      tableDoctors.filter((doctor) => {
        const matchesSpecialty =
          filters.specialty === "all" ||
          filters.specialty === "" ||
          doctor.specialty
            .toLowerCase()
            .includes(filters.specialty.toLowerCase());
        const matchesDate = matchesDateRange(
          doctor.registrationDate,
          filters.dateRange,
        );
        return matchesSpecialty && matchesDate;
      }),
    [tableDoctors, filters.specialty, filters.dateRange],
  );

  // ─── Sub-components ───────────────────────────────────────────────────────

  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t("doctors.searchPlaceholder")}
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
            { title: t("doctors.table.doctor"), key: "name" },
            { title: t("doctors.table.specialty"), key: "specialty" },
            { title: t("table.status"), key: "statusLabel" },
            { title: t("table.registrationDate"), key: "registrationDate" },
            { title: t("table.phone"), key: "phone" },
            { title: t("table.email"), key: "email" },
          ],
          data: filteredDoctors.map((doctor) => ({
            ...doctor,
            statusLabel: t(`doctors.status.${doctor.status}`),
          })),
          fileName: "doctores",
          title: t("doctors.title"),
          subtitle: t("doctors.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <DoctorFilters
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
              <Stethoscope className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("doctors.empty.noResults")
                : t("doctors.empty.noDoctors")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t("doctors.empty.noResultsDescription")
              : t("doctors.empty.noDoctorsDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        {activeFiltersCount > 0 && (
          <MCButton variant="outline" onClick={clearFilters} size="sm">
            {t("doctors.empty.clearFilters")}
          </MCButton>
        )}
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredDoctors.length === 0 ? (
      emptyState
    ) : (
      <DoctorsTable
        doctors={filteredDoctors}
        onViewDetails={(doctor) =>
          navigate(ROUTES.DOCTOR_DETAILS.replace(":doctorId", doctor.id))
        }
      />
    );

  // ── Métricas (sobre safeDoctors completos, sin filtros cliente) ──────────
  const metrics = [
    {
      title: t("doctors.metrics.total"),
      value: safeDoctors.filter(
        (d) => resolveVerificationStatus(d.estadoVerificacion) === "approved",
      ).length,
      icon: <UserCheck size={30} />,
      subtitle: t("doctors.metrics.totalSubtitle"),
    },
    {
      title: t("doctors.metrics.pending"),
      value: safeDoctors.filter(
        (d) => resolveVerificationStatus(d.estadoVerificacion) === "pending",
      ).length,
      icon: <Clock size={30} />,
      subtitle: t("doctors.metrics.pendingSubtitle"),
    },
    {
      title: t("doctors.metrics.rejected"),
      value: safeDoctors.filter(
        (d) => resolveVerificationStatus(d.estadoVerificacion) === "rejected",
      ).length,
      icon: <UserX size={30} />,
      subtitle: t("doctors.metrics.rejectedSubtitle"),
    },
    {
      title: t("doctors.metrics.approved"),
      value: safeDoctors.filter(
        (d) => resolveVerificationStatus(d.estadoVerificacion) === "approved",
      ).length,
      icon: <Stethoscope size={30} />,
      subtitle: t("doctors.metrics.approvedSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("doctors.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
    />
  );
}

export default DoctorsPage;
