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
import { ShieldCheck, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import InsuranceTypesTable, {
  type InsuranceType,
} from "../components/InsuranceTypesTable";
import InsuranceTypesFilters from "../components/InsuranceTypesFilters";
import CreateEditInsuranceType from "../components/modals/CreateEditInsuranceType";

const mockInsuranceTypes: InsuranceType[] = [
  {
    id: "1",
    name: "Seguro Médico Básico",
    createdAt: "10/01/2025",
    status: "active",
  },
  {
    id: "2",
    name: "Seguro Médico Premium",
    createdAt: "12/01/2025",
    status: "active",
  },
  {
    id: "3",
    name: "Seguro Médico Internacional",
    createdAt: "15/01/2025",
    status: "inactive",
  },
  {
    id: "4",
    name: "Seguro Médico Familiar",
    createdAt: "18/01/2025",
    status: "active",
  },
  {
    id: "5",
    name: "Seguro Médico para Estudiantes",
    createdAt: "20/01/2025",
    status: "active",
  },
];

function InsuranceTypesPage() {
  const { t } = useTranslation("insuranceType");
  const isMobile = useIsMobile();

  const [insuranceTypes, setInsuranceTypes] =
    useState<InsuranceType[]>(mockInsuranceTypes);
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

  const filteredInsuranceTypes = useMemo(
    () =>
      insuranceTypes.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          filters.status === "all" || item.status === filters.status;
        const matchesDate = matchesDateRange(item.createdAt, filters.dateRange);
        return matchesSearch && matchesStatus && matchesDate;
      }),
    [searchTerm, filters, insuranceTypes],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = (data: { name: string }) => {
    const newItem: InsuranceType = {
      id: String(Date.now()),
      name: data.name,
      createdAt: new Date().toLocaleDateString("es-DO"),
      status: "active",
    };
    setInsuranceTypes((prev) => [newItem, ...prev]);
  };

  const handleEdit = (updated: InsuranceType) => {
    setInsuranceTypes((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const handleDelete = (target: InsuranceType) => {
    setInsuranceTypes((prev) => prev.filter((item) => item.id !== target.id));
  };

  const handleToggleStatus = (target: InsuranceType) => {
    setInsuranceTypes((prev) =>
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
        placeholder={t("insuranceTypes.searchPlaceholder")}
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
            { title: t("insuranceTypes.table.name"), key: "name" },
            { title: t("table.status"), key: "status" },
            { title: t("insuranceTypes.table.createdAt"), key: "createdAt" },
          ],
          data: filteredInsuranceTypes.map((item) => ({
            ...item,
            status:
              item.status === "active"
                ? t("insuranceTypes.status.active")
                : t("insuranceTypes.status.inactive"),
          })),
          fileName: "tipos-de-seguro",
          title: t("insuranceTypes.title"),
          subtitle: t("insuranceTypes.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <InsuranceTypesFilters
        filters={filters}
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />
    </MCFilterPopover>
  );

  const actionPlusComponent = (
    <CreateEditInsuranceType onConfirm={handleCreate}>
      <MCButton size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        {!isMobile && t("insuranceTypes.create")}
      </MCButton>
    </CreateEditInsuranceType>
  );

  const emptyState = (
    <Empty>
      <EmptyHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center justify-center gap-2 text-primary">
            {activeFiltersCount > 0 ? (
              <Filter className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            ) : (
              <ShieldCheck className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("insuranceTypes.empty.noResults")
                : t("insuranceTypes.empty.noInsuranceTypes")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {activeFiltersCount > 0
              ? t("insuranceTypes.empty.noResultsDescription")
              : t("insuranceTypes.empty.noInsuranceTypesDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 ? (
            <MCButton variant="outline" onClick={clearFilters} size="sm">
              {t("insuranceTypes.empty.clearFilters")}
            </MCButton>
          ) : (
            <CreateEditInsuranceType onConfirm={handleCreate}>
              <MCButton size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("insuranceTypes.create")}
              </MCButton>
            </CreateEditInsuranceType>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredInsuranceTypes.length === 0 ? (
      emptyState
    ) : (
      <InsuranceTypesTable
        insuranceTypes={filteredInsuranceTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    );

  const metrics = [
    {
      title: t("insuranceTypes.metrics.total"),
      value: insuranceTypes.length,
      icon: <ShieldCheck size={30} />,
      subtitle: t("insuranceTypes.metrics.totalSubtitle"),
    },
    {
      title: t("insuranceTypes.metrics.active"),
      value: insuranceTypes.filter((i) => i.status === "active").length,
      icon: <CheckCircle size={30} />,
      subtitle: t("insuranceTypes.metrics.activeSubtitle"),
    },
    {
      title: t("insuranceTypes.metrics.inactive"),
      value: insuranceTypes.filter((i) => i.status === "inactive").length,
      icon: <XCircle size={30} />,
      subtitle: t("insuranceTypes.metrics.inactiveSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("insuranceTypes.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
      actionPlusComponent={actionPlusComponent}
    />
  );
}

export default InsuranceTypesPage;
