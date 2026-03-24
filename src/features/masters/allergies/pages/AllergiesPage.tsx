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
import { ShieldAlert, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import AllergiesTable from "../components/AllergiesTable";
import AllergiesFilters from "../components/AllergiesFilters";
import CreateEditAllergy from "../components/modals/CreateEditAllergy";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import {
  useGetAllergies,
  useCreateAllergy,
  useUpdateAllergy,
  useDeleteAllergy,
  useToggleAllergyStatus,
  type AllergyInterface,
  type GetAllergiesParams,
} from "../hooks/useAllergies";

export const resolveStatus = (
  item: AllergyInterface,
): "active" | "inactive" => {
  const raw = (item.status ?? item.estado ?? "").toLowerCase();
  return raw === "active" || raw === "activa" ? "active" : "inactive";
};

const parseDate = (dateStr: string) => {
  if (!dateStr) return new Date(NaN);
  if (dateStr.includes("T")) return new Date(dateStr);
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return new Date(NaN);
  return new Date(Number(year), Number(month) - 1, Number(day));
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

function AllergiesPage() {
  const { t } = useTranslation("allergies");
  const isMobile = useIsMobile();
  const setToast = useGlobalUIStore((s) => s.setToast);
  const setIsLoading = useGlobalUIStore((s) => s.setIsLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: undefined as [Date, Date] | undefined,
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.dateRange) count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({ status: "all", dateRange: undefined });
    setSearchTerm("");
  };

  const apiParams = useMemo<GetAllergiesParams>(
    () => ({
      nombre: searchTerm?.trim() || undefined,
      estado:
        filters.status === "active"
          ? "Activa"
          : filters.status === "inactive"
            ? "Inactiva"
            : undefined,
      pagina: 1,
      limite: 100,
      translate_fields: ["nombre", "descripcion"],
    }),
    [searchTerm, filters.status],
  );

  const { data: apiAllergies = [] } = useGetAllergies(apiParams);
  const createMutation = useCreateAllergy();
  const updateMutation = useUpdateAllergy();
  const deleteMutation = useDeleteAllergy();
  const toggleMutation = useToggleAllergyStatus();

  const safeAllergies = Array.isArray(apiAllergies) ? apiAllergies : [];

  const filteredAllergies = useMemo(
    () =>
      safeAllergies.filter((item) =>
        matchesDateRange(item.creadoEn, filters.dateRange),
      ),
    [safeAllergies, filters.dateRange],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = (data: { name: string; description: string }) => {
    setIsLoading(true);
    createMutation.mutate(
      { nombre: data.name, descripcion: data.description },
      {
        onSuccess: () =>
          setToast({
            message: t("allergies.toast.createSuccess"),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("allergies.toast.createError"),
            type: "error",
            open: true,
          }),
        onSettled: () => setIsLoading(false),
      },
    );
  };

  const handleEdit = (updated: AllergyInterface) => {
    setIsLoading(true);
    updateMutation.mutate(
      {
        id: updated.id,
        nombre: updated.nombre,
        descripcion: updated.descripcion,
      },
      {
        onSuccess: () =>
          setToast({
            message: t("allergies.toast.editSuccess"),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("allergies.toast.editError"),
            type: "error",
            open: true,
          }),
        onSettled: () => setIsLoading(false),
      },
    );
  };

  const handleDelete = (target: AllergyInterface) => {
    setIsLoading(true);
    deleteMutation.mutate(target.id, {
      onSuccess: () =>
        setToast({
          message: t("allergies.toast.deleteSuccess", { name: target.nombre }),
          type: "success",
          open: true,
        }),
      onError: () =>
        setToast({
          message: t("allergies.toast.deleteError"),
          type: "error",
          open: true,
        }),
      onSettled: () => setIsLoading(false),
    });
  };

  const handleToggleStatus = (target: AllergyInterface) => {
    const isActive = resolveStatus(target) === "active";
    setIsLoading(true);
    toggleMutation.mutate(
      { id: target.id, estado: isActive ? "Inactiva" : "Activa" },
      {
        onSuccess: () =>
          setToast({
            message: isActive
              ? t("allergies.toast.deactivated", { name: target.nombre })
              : t("allergies.toast.activated", { name: target.nombre }),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("allergies.toast.statusError"),
            type: "error",
            open: true,
          }),
        onSettled: () => setIsLoading(false),
      },
    );
  };

  // ── Sub-components ────────────────────────────────────────────────────────

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
            { title: t("allergies.table.name"), key: "nombre" },
            { title: t("allergies.table.description"), key: "descripcion" },
            { title: t("table.status"), key: "estadoLabel" },
            { title: t("allergies.table.createdAt"), key: "creadoEn" },
          ],
          data: filteredAllergies.map((item) => ({
            ...item,
            estadoLabel:
              resolveStatus(item) === "active"
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
              <ShieldAlert className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
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
            className={`text-muted-foreground text-center max-w-md mx-auto ${
              isMobile ? "text-sm" : "text-base"
            }`}
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

  const tableComponent =
    filteredAllergies.length === 0 ? (
      emptyState
    ) : (
      <AllergiesTable
        allergies={filteredAllergies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    );

  const metrics = [
    {
      title: t("allergies.metrics.total"),
      value: safeAllergies.length,
      icon: <ShieldAlert size={30} />,
      subtitle: t("allergies.metrics.totalSubtitle"),
    },
    {
      title: t("allergies.metrics.active"),
      value: safeAllergies.filter((item) => resolveStatus(item) === "active")
        .length,
      icon: <CheckCircle size={30} />,
      subtitle: t("allergies.metrics.activeSubtitle"),
    },
    {
      title: t("allergies.metrics.inactive"),
      value: safeAllergies.filter((item) => resolveStatus(item) === "inactive")
        .length,
      icon: <XCircle size={30} />,
      subtitle: t("allergies.metrics.inactiveSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("allergies.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
      actionPlusComponent={actionPlusComponent}
    />
  );
}

export default AllergiesPage;
