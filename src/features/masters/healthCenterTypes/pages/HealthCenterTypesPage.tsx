import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import MCTablesLayouts from "@/shared/components/MCTablesLayouts";
import MCPDFButton from "@/shared/components/forms/MCPDFButton";
import { MCFilterPopover } from "@/shared/components/filters/MCFilterPopover";
import MCFilterInput from "@/shared/components/filters/MCFilterInput";
import MCGeneratePDF from "@/shared/components/forms/MCGeneratePDF";
import MCButton from "@/shared/components/forms/MCButton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/shared/ui/empty";
import { Hospital, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import HealthCenterTypesTable, {
  type HealthCenterType,
} from "../components/HealthCenterTypesTable";
import HealthCenterTypesFilters from "../components/HealthCenterTypesFilters";
import CreateEditHealthCenterType from "../components/modals/CreateEditHealthCenterType";

const mockHealthCenterTypes: HealthCenterType[] = [
  { id: "1", name: "Hospital", createdAt: "10/01/2025", status: "active" },
  { id: "2", name: "Clínica", createdAt: "12/01/2025", status: "active" },
  {
    id: "3",
    name: "Centro de Diagnóstico",
    createdAt: "15/01/2025",
    status: "active",
  },
  {
    id: "4",
    name: "Laboratorio Clínico",
    createdAt: "18/01/2025",
    status: "active",
  },
  { id: "5", name: "Farmacia", createdAt: "20/01/2025", status: "active" },
  {
    id: "6",
    name: "Centro Especializado",
    createdAt: "22/01/2025",
    status: "active",
  },
  {
    id: "7",
    name: "Consultorio Médico",
    createdAt: "25/01/2025",
    status: "active",
  },
  {
    id: "8",
    name: "Centro de Rehabilitación",
    createdAt: "28/01/2025",
    status: "inactive",
  },
  { id: "9", name: "Policlínica", createdAt: "30/01/2025", status: "active" },
  {
    id: "10",
    name: "Unidad de Emergencias",
    createdAt: "02/02/2025",
    status: "inactive",
  },
];

function HealthCenterTypesPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();

  const [healthCenterTypes, setHealthCenterTypes] = useState<
    HealthCenterType[]
  >(mockHealthCenterTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: undefined as [Date, Date] | undefined,
  });

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "dateRange") return value !== undefined;
    return value !== "all";
  }).length;

  const clearFilters = () =>
    setFilters({ status: "all", dateRange: undefined });

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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

  const filteredHealthCenterTypes = useMemo(
    () =>
      healthCenterTypes.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          filters.status === "all" || item.status === filters.status;
        const matchesDate = matchesDateRange(item.createdAt, filters.dateRange);
        return matchesSearch && matchesStatus && matchesDate;
      }),
    [searchTerm, filters, healthCenterTypes],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = (data: { name: string }) => {
    const newItem: HealthCenterType = {
      id: String(Date.now()),
      name: data.name,
      createdAt: new Date().toLocaleDateString("es-DO"),
      status: "active",
    };
    setHealthCenterTypes((prev) => [newItem, ...prev]);
  };

  const handleEdit = (updated: HealthCenterType) => {
    setHealthCenterTypes((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const handleDelete = (target: HealthCenterType) => {
    setHealthCenterTypes((prev) =>
      prev.filter((item) => item.id !== target.id),
    );
  };

  const handleToggleStatus = (target: HealthCenterType) => {
    setHealthCenterTypes((prev) =>
      prev.map((item) =>
        item.id === target.id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item,
      ),
    );
  };

  // ── Sub-components ────────────────────────────────────────────────────────

  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t("healthCenterTypes.searchPlaceholder")}
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
            { title: t("healthCenterTypes.table.name"), key: "name" },
            { title: t("table.status"), key: "status" },
            { title: t("healthCenterTypes.table.createdAt"), key: "createdAt" },
          ],
          data: filteredHealthCenterTypes.map((item) => ({
            ...item,
            status:
              item.status === "active"
                ? t("healthCenterTypes.status.active")
                : t("healthCenterTypes.status.inactive"),
          })),
          fileName: "tipos-de-centro-de-salud",
          title: t("healthCenterTypes.title"),
          subtitle: t("healthCenterTypes.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <HealthCenterTypesFilters
        filters={filters}
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />
    </MCFilterPopover>
  );

  const actionPlusComponent = (
    <CreateEditHealthCenterType onConfirm={handleCreate}>
      <MCButton size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        {!isMobile && t("healthCenterTypes.create")}
      </MCButton>
    </CreateEditHealthCenterType>
  );

  const emptyState = (
    <Empty>
      <EmptyHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center justify-center gap-2 text-primary">
            {activeFiltersCount > 0 ? (
              <Filter className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            ) : (
              <Hospital className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("healthCenterTypes.empty.noResults")
                : t("healthCenterTypes.empty.noHealthCenterTypes")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {activeFiltersCount > 0
              ? t("healthCenterTypes.empty.noResultsDescription")
              : t("healthCenterTypes.empty.noHealthCenterTypesDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 ? (
            <MCButton variant="outline" onClick={clearFilters} size="sm">
              {t("healthCenterTypes.empty.clearFilters")}
            </MCButton>
          ) : (
            <CreateEditHealthCenterType onConfirm={handleCreate}>
              <MCButton size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("healthCenterTypes.create")}
              </MCButton>
            </CreateEditHealthCenterType>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredHealthCenterTypes.length === 0 ? (
      emptyState
    ) : (
      <HealthCenterTypesTable
        healthCenterTypes={filteredHealthCenterTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    );

  const metrics = [
    {
      title: t("healthCenterTypes.metrics.total"),
      value: healthCenterTypes.length,
      icon: <Hospital size={30} />,
      subtitle: t("healthCenterTypes.metrics.totalSubtitle"),
    },
    {
      title: t("healthCenterTypes.metrics.active"),
      value: healthCenterTypes.filter((i) => i.status === "active").length,
      icon: <CheckCircle size={30} />,
      subtitle: t("healthCenterTypes.metrics.activeSubtitle"),
    },
    {
      title: t("healthCenterTypes.metrics.inactive"),
      value: healthCenterTypes.filter((i) => i.status === "inactive").length,
      icon: <XCircle size={30} />,
      subtitle: t("healthCenterTypes.metrics.inactiveSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("healthCenterTypes.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
      actionPlusComponent={actionPlusComponent}
    />
  );
}

export default HealthCenterTypesPage;
