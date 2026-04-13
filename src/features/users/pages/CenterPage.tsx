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
import {
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Building2,
} from "lucide-react";
import CentersTable, { type Center } from "../components/center/CentersTable";
import CenterFilters from "../components/filters/CenterFilters";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import {
  useGetCentersAdmin,
  resolveCenterVerificationStatus,
  mapCenterStatusToApi,
  type CenterAdminListItem,
  type GetCentersAdminParams,
} from "../hooks/centers/useCenters";

// ─── Mapper API → Center (interfaz de la tabla) ───────────────────────────────

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

const mapCenterToTableRow = (center: CenterAdminListItem): Center => ({
  id: center.usuarioId.toString(),
  name: center.nombreComercial,
  image: center.usuario.fotoPerfil ?? undefined,
  status: resolveCenterVerificationStatus(center.estadoVerificacion),
  registrationDate: formatDate(center.creadoEn),
  phone: center.usuario.telefono ?? "-",
  email: center.usuario.email ?? "-",
  centerType: center.tipoCentro?.nombre ?? "-",
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

function CenterPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    centerType: "all",
    dateRange: undefined as [Date, Date] | undefined,
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.centerType !== "all" && filters.centerType !== "") count++;
    if (filters.dateRange) count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({ status: "all", centerType: "all", dateRange: undefined });
    setSearchTerm("");
  };

  // nombre server-side; estadoVerificacion server-side; centerType y dateRange client-side
  const apiParams = useMemo<GetCentersAdminParams>(
    () => ({
      nombre: searchTerm?.trim() || undefined,
      estadoVerificacion: mapCenterStatusToApi(filters.status),
      pagina: 1,
      limite: 100,
    }),
    [searchTerm, filters.status],
  );

  const { data: apiCenters = [] } = useGetCentersAdmin(apiParams);

  const safeCenters = Array.isArray(apiCenters) ? apiCenters : [];

  const tableCenters = useMemo(
    () => safeCenters.map(mapCenterToTableRow),
    [safeCenters],
  );

  // Filtros client-side: centerType + dateRange
  const filteredCenters = useMemo(
    () =>
      tableCenters.filter((center) => {
        const matchesCenterType =
          filters.centerType === "all" ||
          filters.centerType === "" ||
          center.centerType
            .toLowerCase()
            .includes(filters.centerType.toLowerCase());
        const matchesDate = matchesDateRange(
          center.registrationDate,
          filters.dateRange,
        );
        return matchesCenterType && matchesDate;
      }),
    [tableCenters, filters.centerType, filters.dateRange],
  );

  // ─── Sub-components ───────────────────────────────────────────────────────

  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t("centers.searchPlaceholder")}
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
            { title: t("centers.table.center"), key: "name" },
            { title: t("centers.table.centerType"), key: "centerType" },
            { title: t("table.status"), key: "statusLabel" },
            { title: t("table.registrationDate"), key: "registrationDate" },
            { title: t("table.phone"), key: "phone" },
            { title: t("table.email"), key: "email" },
          ],
          data: filteredCenters.map((center) => ({
            ...center,
            statusLabel: t(`centers.status.${center.status}`),
          })),
          fileName: "centros-medicos",
          title: t("centers.title"),
          subtitle: t("centers.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <CenterFilters
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
              <Building2 className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("centers.empty.noResults")
                : t("centers.empty.noCenters")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t("centers.empty.noResultsDescription")
              : t("centers.empty.noCentersDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        {activeFiltersCount > 0 && (
          <MCButton variant="outline" onClick={clearFilters} size="sm">
            {t("centers.empty.clearFilters")}
          </MCButton>
        )}
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredCenters.length === 0 ? (
      emptyState
    ) : (
      <CentersTable
        centers={filteredCenters}
        onViewDetails={(center) =>
          navigate(ROUTES.CENTER_DETAILS.replace(":centerId", center.id))
        }
      />
    );

  const metrics = [
    {
      title: t("centers.metrics.total"),
      value: safeCenters.filter(
        (c) =>
          resolveCenterVerificationStatus(c.estadoVerificacion) === "approved",
      ).length,
      icon: <CheckCircle size={30} />,
      subtitle: t("centers.metrics.totalSubtitle"),
    },
    {
      title: t("centers.metrics.pending"),
      value: safeCenters.filter(
        (c) =>
          resolveCenterVerificationStatus(c.estadoVerificacion) === "pending",
      ).length,
      icon: <Clock size={30} />,
      subtitle: t("centers.metrics.pendingSubtitle"),
    },
    {
      title: t("centers.metrics.rejected"),
      value: safeCenters.filter(
        (c) =>
          resolveCenterVerificationStatus(c.estadoVerificacion) === "rejected",
      ).length,
      icon: <XCircle size={30} />,
      subtitle: t("centers.metrics.rejectedSubtitle"),
    },
    {
      title: t("centers.metrics.approved"),
      value: safeCenters.filter(
        (c) =>
          resolveCenterVerificationStatus(c.estadoVerificacion) === "approved",
      ).length,
      icon: <Building size={30} />,
      subtitle: t("centers.metrics.approvedSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("centers.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
    />
  );
}

export default CenterPage;
