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
import { AlertCircle, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import AllergiesTable, { type Allergy } from "../components/AllergiesTable";
import AllergiesFilters from "../components/AllergiesFilters";
import CreateEditAllergy from "../components/modals/CreateEditAllergy";

const mockAllergies: Allergy[] = [
  {
    id: "1",
    name: "Polen",
    description: "Alergia al polen de plantas y árboles. Común en primavera.",
    createdAt: "10/01/2025",
    status: "active",
  },
  {
    id: "2",
    name: "Ácaros",
    description: "Alergia a los ácaros del polvo doméstico.",
    createdAt: "12/01/2025",
    status: "active",
  },
  {
    id: "3",
    name: "Mariscos",
    description: "Reacción alérgica a crustáceos y moluscos.",
    createdAt: "15/01/2025",
    status: "active",
  },
  {
    id: "4",
    name: "Penicilina",
    description: "Alergia al antibiótico penicilina y derivados.",
    createdAt: "18/01/2025",
    status: "active",
  },
  {
    id: "5",
    name: "Látex",
    description:
      "Alergia al látex natural presente en guantes y productos médicos.",
    createdAt: "20/01/2025",
    status: "active",
  },
  {
    id: "6",
    name: "Gluten",
    description: "Intolerancia al gluten asociada a celiaquía.",
    createdAt: "22/01/2025",
    status: "inactive",
  },
  {
    id: "7",
    name: "Cacahuates",
    description: "Alergia severa a los cacahuates, puede causar anafilaxia.",
    createdAt: "25/01/2025",
    status: "active",
  },
  {
    id: "8",
    name: "Ibuprofeno",
    description: "Reacción alérgica al antiinflamatorio ibuprofeno.",
    createdAt: "28/01/2025",
    status: "inactive",
  },
];

function AllergiesPage() {
  const { t } = useTranslation("allergies");
  const isMobile = useIsMobile();

  const [allergies, setAllergies] = useState<Allergy[]>(mockAllergies);
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

  const filteredAllergies = useMemo(
    () =>
      allergies.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filters.status === "all" || item.status === filters.status;
        const matchesDate = matchesDateRange(item.createdAt, filters.dateRange);
        return matchesSearch && matchesStatus && matchesDate;
      }),
    [searchTerm, filters, allergies],
  );

  const handleCreate = (data: { name: string; description: string }) => {
    setAllergies((prev) => [
      {
        id: String(Date.now()),
        name: data.name,
        description: data.description,
        createdAt: new Date().toLocaleDateString("es-DO"),
        status: "active",
      },
      ...prev,
    ]);
  };

  const handleEdit = (updated: Allergy) =>
    setAllergies((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );

  const handleDelete = (target: Allergy) =>
    setAllergies((prev) => prev.filter((item) => item.id !== target.id));

  const handleToggleStatus = (target: Allergy) =>
    setAllergies((prev) =>
      prev.map((item) =>
        item.id === target.id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item,
      ),
    );

  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t("allergies.searchPlaceholder")}
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
            { title: t("allergies.table.name"), key: "name" },
            { title: t("allergies.table.description"), key: "description" },
            { title: t("table.status"), key: "status" },
            { title: t("allergies.table.createdAt"), key: "createdAt" },
          ],
          data: filteredAllergies.map((item) => ({
            ...item,
            status:
              item.status === "active"
                ? t("allergies.status.active")
                : t("allergies.status.inactive"),
          })),
          fileName: "alergias",
          title: t("allergies.title"),
          subtitle: t("allergies.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <AllergiesFilters
        filters={filters}
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />
    </MCFilterPopover>
  );

  const actionPlusComponent = (
    <CreateEditAllergy onConfirm={handleCreate}>
      <MCButton size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        {!isMobile && t("allergies.create")}
      </MCButton>
    </CreateEditAllergy>
  );

  const emptyState = (
    <Empty>
      <EmptyHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center justify-center gap-2 text-primary">
            {activeFiltersCount > 0 ? (
              <Filter className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            ) : (
              <AlertCircle className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("allergies.empty.noResults")
                : t("allergies.empty.noAllergies")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t("allergies.empty.noResultsDescription")
              : t("allergies.empty.noAllergiesDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 ? (
            <MCButton variant="outline" onClick={clearFilters} size="sm">
              {t("allergies.empty.clearFilters")}
            </MCButton>
          ) : (
            <CreateEditAllergy onConfirm={handleCreate}>
              <MCButton size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("allergies.create")}
              </MCButton>
            </CreateEditAllergy>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const metrics = [
    {
      title: t("allergies.metrics.total"),
      value: allergies.length,
      icon: <AlertCircle size={30} />,
      subtitle: t("allergies.metrics.totalSubtitle"),
    },
    {
      title: t("allergies.metrics.active"),
      value: allergies.filter((i) => i.status === "active").length,
      icon: <CheckCircle size={30} />,
      subtitle: t("allergies.metrics.activeSubtitle"),
    },
    {
      title: t("allergies.metrics.inactive"),
      value: allergies.filter((i) => i.status === "inactive").length,
      icon: <XCircle size={30} />,
      subtitle: t("allergies.metrics.inactiveSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("allergies.title")}
      metrics={metrics}
      tableComponent={
        filteredAllergies.length === 0 ? (
          emptyState
        ) : (
          <AllergiesTable
            allergies={filteredAllergies}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )
      }
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
      actionPlusComponent={actionPlusComponent}
    />
  );
}

export default AllergiesPage;
