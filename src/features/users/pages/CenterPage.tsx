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

const mockCenters: Center[] = [
  {
    id: "1",
    name: "Hospital General Santo Domingo",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400",
    status: "approved",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "info@hospitalgeneralsd.com",
    centerType: "Hospital",
  },
  {
    id: "2",
    name: "Clínica Dr. Raúl Báez Duarte",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400",
    status: "pending",
    registrationDate: "11/10/2025",
    phone: "809-432-9533",
    email: "contacto@clinicabaez.com",
    centerType: "Clínica",
  },
  {
    id: "3",
    name: "Centro Médico Plaza de la Salud",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
    status: "approved",
    registrationDate: "11/10/2025",
    phone: "809-432-9534",
    email: "info@plazadelasalud.com",
    centerType: "Centro Especializado",
  },
  {
    id: "4",
    name: "Laboratorio Referencia",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
    status: "approved",
    registrationDate: "11/10/2025",
    phone: "809-432-9535",
    email: "resultados@labreferencia.com",
    centerType: "Laboratorio",
  },
  {
    id: "5",
    name: "Centro de Diagnóstico Avanzado",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    status: "pending",
    registrationDate: "11/10/2025",
    phone: "809-432-9536",
    email: "citas@diagnosticoavanzado.com",
    centerType: "Centro de Diagnóstico",
  },
  {
    id: "6",
    name: "Farmacia Nacional Central",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    status: "rejected",
    registrationDate: "11/10/2025",
    phone: "809-432-9537",
    email: "info@farmacianacional.com",
    centerType: "Farmacia",
  },
];

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

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "dateRange") return value !== undefined;
    return value !== "all" && value !== "";
  }).length;

  const clearFilters = () =>
    setFilters({ status: "all", centerType: "all", dateRange: undefined });

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const matchesCustomDateRange = (
    dateStr: string,
    range?: [Date, Date],
  ): boolean => {
    if (!range) return true;
    const reg = parseDate(dateStr);
    reg.setHours(0, 0, 0, 0);
    const start = new Date(range[0]);
    start.setHours(0, 0, 0, 0);
    const end = new Date(range[1]);
    end.setHours(23, 59, 59, 999);
    return reg >= start && reg <= end;
  };

  const filteredCenters = useMemo(
    () =>
      mockCenters.filter((center) => {
        const matchesSearch =
          center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          center.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          center.phone.includes(searchTerm) ||
          center.centerType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filters.status === "all" || center.status === filters.status;
        const matchesCenterType =
          filters.centerType === "all" ||
          center.centerType
            .toLowerCase()
            .includes(filters.centerType.toLowerCase());
        const matchesDate = matchesCustomDateRange(
          center.registrationDate,
          filters.dateRange,
        );
        return (
          matchesSearch && matchesStatus && matchesCenterType && matchesDate
        );
      }),
    [searchTerm, filters],
  );

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
            { title: t("table.status"), key: "status" },
            { title: t("table.registrationDate"), key: "registrationDate" },
            { title: t("table.phone"), key: "phone" },
            { title: t("table.email"), key: "email" },
          ],
          data: filteredCenters.map((center) => ({
            ...center,
            status: t(`centers.status.${center.status}`),
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
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 && (
            <MCButton
              variant="outline"
              onClick={clearFilters}
              className={isMobile ? "px-4 py-2" : "px-6 py-2"}
              size="sm"
            >
              {t("centers.empty.clearFilters")}
            </MCButton>
          )}
        </div>
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
      value: mockCenters.filter((c) => c.status === "approved").length,
      icon: <CheckCircle size={30} />,
      subtitle: t("centers.metrics.totalSubtitle"),
    },
    {
      title: t("centers.metrics.pending"),
      value: mockCenters.filter((c) => c.status === "pending").length,
      icon: <Clock size={30} />,
      subtitle: t("centers.metrics.pendingSubtitle"),
    },
    {
      title: t("centers.metrics.rejected"),
      value: mockCenters.filter((c) => c.status === "rejected").length,
      icon: <XCircle size={30} />,
      subtitle: t("centers.metrics.rejectedSubtitle"),
    },
    {
      title: t("centers.metrics.approved"),
      value: mockCenters.filter((c) => c.status === "approved").length,
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
