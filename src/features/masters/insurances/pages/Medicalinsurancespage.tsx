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
import { ShieldPlus, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import MedicalInsurancesTable, {
  type MedicalInsurance,
} from "../components/Medicalinsurancestable";
import MedicalInsurancesFilters from "../components/Medicalinsurancesfilters";
import CreateEditMedicalInsurance from "../components/modals/Createeditmedicalinsurance";

// ── Mock insurance types (en producción vendrá de la API) ─────────────────────
const insuranceTypeOptions = [
  { value: "1", label: "ARS Contributivo" },
  { value: "2", label: "ARS Subsidiado" },
  { value: "3", label: "Seguro Privado" },
  { value: "4", label: "Seguro Colectivo" },
];

const mockMedicalInsurances: MedicalInsurance[] = [
  {
    id: "1",
    name: "ARS Humano",
    insuranceTypeId: "3",
    insuranceTypeName: "Seguro Privado",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ARS_Humano_logo.png/320px-ARS_Humano_logo.png",
    createdAt: "10/01/2025",
    status: "active",
  },
  {
    id: "2",
    name: "ARS Senasa",
    insuranceTypeId: "1",
    insuranceTypeName: "ARS Contributivo",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/SENASA_logo.svg/320px-SENASA_logo.svg.png",
    createdAt: "12/01/2025",
    status: "active",
  },
  {
    id: "3",
    name: "ARS Universal",
    insuranceTypeId: "1",
    insuranceTypeName: "ARS Contributivo",
    imageUrl: "",
    createdAt: "15/01/2025",
    status: "active",
  },
  {
    id: "4",
    name: "Meta Salud",
    insuranceTypeId: "3",
    insuranceTypeName: "Seguro Privado",
    imageUrl: "",
    createdAt: "18/01/2025",
    status: "inactive",
  },
  {
    id: "5",
    name: "Seguro Nacional de Salud",
    insuranceTypeId: "2",
    insuranceTypeName: "ARS Subsidiado",
    imageUrl: "",
    createdAt: "20/01/2025",
    status: "active",
  },
  {
    id: "6",
    name: "MAPFRE Salud",
    insuranceTypeId: "3",
    insuranceTypeName: "Seguro Privado",
    imageUrl: "",
    createdAt: "22/01/2025",
    status: "active",
  },
];

function MedicalInsurancesPage() {
  const { t } = useTranslation("medicalInsurance");
  const isMobile = useIsMobile();

  const [medicalInsurances, setMedicalInsurances] = useState<
    MedicalInsurance[]
  >(mockMedicalInsurances);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    insuranceTypeId: "all",
    dateRange: undefined as [Date, Date] | undefined,
  });

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "dateRange") return value !== undefined;
    return value !== "all";
  }).length;

  const clearFilters = () =>
    setFilters({ status: "all", insuranceTypeId: "all", dateRange: undefined });

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

  const filteredMedicalInsurances = useMemo(
    () =>
      medicalInsurances.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.insuranceTypeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
          filters.status === "all" || item.status === filters.status;
        const matchesType =
          filters.insuranceTypeId === "all" ||
          item.insuranceTypeId === filters.insuranceTypeId;
        const matchesDate = matchesDateRange(item.createdAt, filters.dateRange);
        return matchesSearch && matchesStatus && matchesType && matchesDate;
      }),
    [searchTerm, filters, medicalInsurances],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = (data: {
    name: string;
    insuranceTypeId: string;
    insuranceTypeName: string;
    imageUrl?: string;
  }) => {
    const newItem: MedicalInsurance = {
      id: String(Date.now()),
      name: data.name,
      insuranceTypeId: data.insuranceTypeId,
      insuranceTypeName: data.insuranceTypeName,
      imageUrl: data.imageUrl ?? "",
      createdAt: new Date().toLocaleDateString("es-DO"),
      status: "active",
    };
    setMedicalInsurances((prev) => [newItem, ...prev]);
  };

  const handleEdit = (updated: MedicalInsurance) => {
    setMedicalInsurances((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const handleDelete = (target: MedicalInsurance) => {
    setMedicalInsurances((prev) =>
      prev.filter((item) => item.id !== target.id),
    );
  };

  const handleToggleStatus = (target: MedicalInsurance) => {
    setMedicalInsurances((prev) =>
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
        placeholder={t("medicalInsurances.searchPlaceholder")}
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
            { title: t("medicalInsurances.table.insurance"), key: "name" },
            {
              title: t("medicalInsurances.table.insuranceType"),
              key: "insuranceTypeName",
            },
            { title: t("table.status"), key: "status" },
            { title: t("medicalInsurances.table.createdAt"), key: "createdAt" },
          ],
          data: filteredMedicalInsurances.map((item) => ({
            ...item,
            status:
              item.status === "active"
                ? t("medicalInsurances.status.active")
                : t("medicalInsurances.status.inactive"),
          })),
          fileName: "seguros-medicos",
          title: t("medicalInsurances.title"),
          subtitle: t("medicalInsurances.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <MedicalInsurancesFilters
        filters={filters}
        insuranceTypeOptions={insuranceTypeOptions}
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />
    </MCFilterPopover>
  );

  const actionPlusComponent = (
    <CreateEditMedicalInsurance
      insuranceTypeOptions={insuranceTypeOptions}
      onConfirm={handleCreate}
    >
      <MCButton size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        {!isMobile && t("medicalInsurances.create")}
      </MCButton>
    </CreateEditMedicalInsurance>
  );

  const emptyState = (
    <Empty>
      <EmptyHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center justify-center gap-2 text-primary">
            {activeFiltersCount > 0 ? (
              <Filter className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            ) : (
              <ShieldPlus className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("medicalInsurances.empty.noResults")
                : t("medicalInsurances.empty.noMedicalInsurances")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {activeFiltersCount > 0
              ? t("medicalInsurances.empty.noResultsDescription")
              : t("medicalInsurances.empty.noMedicalInsurancesDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 ? (
            <MCButton variant="outline" onClick={clearFilters} size="sm">
              {t("medicalInsurances.empty.clearFilters")}
            </MCButton>
          ) : (
            <CreateEditMedicalInsurance
              insuranceTypeOptions={insuranceTypeOptions}
              onConfirm={handleCreate}
            >
              <MCButton size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("medicalInsurances.create")}
              </MCButton>
            </CreateEditMedicalInsurance>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredMedicalInsurances.length === 0 ? (
      emptyState
    ) : (
      <MedicalInsurancesTable
        medicalInsurances={filteredMedicalInsurances}
        insuranceTypeOptions={insuranceTypeOptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    );

  const metrics = [
    {
      title: t("medicalInsurances.metrics.total"),
      value: medicalInsurances.length,
      icon: <ShieldPlus size={30} />,
      subtitle: t("medicalInsurances.metrics.totalSubtitle"),
    },
    {
      title: t("medicalInsurances.metrics.active"),
      value: medicalInsurances.filter((i) => i.status === "active").length,
      icon: <CheckCircle size={30} />,
      subtitle: t("medicalInsurances.metrics.activeSubtitle"),
    },
    {
      title: t("medicalInsurances.metrics.inactive"),
      value: medicalInsurances.filter((i) => i.status === "inactive").length,
      icon: <XCircle size={30} />,
      subtitle: t("medicalInsurances.metrics.inactiveSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("medicalInsurances.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
      actionPlusComponent={actionPlusComponent}
    />
  );
}

export default MedicalInsurancesPage;
