import { useState, useMemo, useEffect } from "react";
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
import HealthCenterTypesTable from "../components/HealthCenterTypesTable";
import HealthCenterTypesFilters from "../components/HealthCenterTypesFilters";
import CreateEditHealthCenterType from "../components/modals/CreateEditHealthCenterType";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import {
  useGetHealthCenterTypes,
  useCreateHealthCenterType,
  useUpdateHealthCenterType,
  useDeleteHealthCenterType,
  useToggleHealthCenterTypeStatus,
  type HealthCenterTypeInterface,
  type GetHealthCenterTypesParams,
} from "../hooks/useHealthCenterTypes";

export const resolveStatus = (
  item: HealthCenterTypeInterface,
): "active" | "inactive" => {
  const raw = (item.status ?? item.estado ?? "").toLowerCase();
  return raw === "active" || raw === "activo" ? "active" : "inactive";
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

function HealthCenterTypesPage() {
  const { t } = useTranslation("healthCenterType");
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

  const apiParams = useMemo<GetHealthCenterTypesParams>(
    () => ({
      nombre: searchTerm?.trim() || undefined,
      estado:
        filters.status === "active"
          ? "Activo"
          : filters.status === "inactive"
            ? "Inactivo"
            : undefined,
      pagina: 1,
      limite: 100,
      translate_fields: ["nombre"],
    }),
    [searchTerm, filters.status],
  );

  const {
    data: apiHealthCenterTypes = [],
    isLoading,
    isFetching,
  } = useGetHealthCenterTypes(apiParams);

  useEffect(() => {
    setIsLoading(isLoading || isFetching);
    return () => setIsLoading(false);
  }, [isLoading, isFetching, setIsLoading]);

  const createMutation = useCreateHealthCenterType();
  const updateMutation = useUpdateHealthCenterType();
  const deleteMutation = useDeleteHealthCenterType();
  const toggleMutation = useToggleHealthCenterTypeStatus();

  const safeHealthCenterTypes = Array.isArray(apiHealthCenterTypes)
    ? apiHealthCenterTypes
    : [];

  // Solo filtro client-side para dateRange (el API no lo soporta)
  const filteredHealthCenterTypes = useMemo(
    () =>
      safeHealthCenterTypes.filter((item) =>
        matchesDateRange(item.creadoEn, filters.dateRange),
      ),
    [safeHealthCenterTypes, filters.dateRange],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = (data: { name: string }) => {
    setIsLoading(true);
    createMutation.mutate(
      { nombre: data.name, estado: "Activo" },
      {
        onSettled: () => setIsLoading(false),
        onSuccess: () =>
          setToast({
            message: t("healthCenterTypes.toast.createSuccess"),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("healthCenterTypes.toast.createError"),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleEdit = (updated: HealthCenterTypeInterface) => {
    setIsLoading(true);
    updateMutation.mutate(
      { id: updated.id, nombre: updated.nombre },
      {
        onSettled: () => setIsLoading(false),
        onSuccess: () =>
          setToast({
            message: t("healthCenterTypes.toast.editSuccess"),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("healthCenterTypes.toast.editError"),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleDelete = (target: HealthCenterTypeInterface) => {
    setIsLoading(true);
    deleteMutation.mutate(target.id, {
      onSettled: () => setIsLoading(false),
      onSuccess: () =>
        setToast({
          message: t("healthCenterTypes.toast.deleteSuccess", {
            name: target.nombre,
          }),
          type: "success",
          open: true,
        }),
      onError: () =>
        setToast({
          message: t("healthCenterTypes.toast.deleteError"),
          type: "error",
          open: true,
        }),
    });
  };

  const handleToggleStatus = (target: HealthCenterTypeInterface) => {
    setIsLoading(true);
    const isActive = resolveStatus(target) === "active";
    toggleMutation.mutate(
      { id: target.id, estado: isActive ? "Inactivo" : "Activo" },
      {
        onSettled: () => setIsLoading(false),
        onSuccess: () =>
          setToast({
            message: isActive
              ? t("healthCenterTypes.toast.deactivated", {
                  name: target.nombre,
                })
              : t("healthCenterTypes.toast.activated", {
                  name: target.nombre,
                }),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("healthCenterTypes.toast.statusError"),
            type: "error",
            open: true,
          }),
      },
    );
  };

  // ── Sub-components ────────────────────────────────────────────────────────

  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t(
          "healthCenterTypes.searchPlaceholder",
          "Buscar tipo de centro...",
        )}
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
            {
              title: t("healthCenterTypes.table.name", "Nombre"),
              key: "nombre",
            },
            { title: t("table.status", "Estado"), key: "estadoLabel" },
            {
              title: t(
                "healthCenterTypes.table.createdAt",
                "Fecha de Creación",
              ),
              key: "creadoEn",
            },
          ],
          data: filteredHealthCenterTypes.map((item) => ({
            ...item,
            estadoLabel:
              resolveStatus(item) === "active"
                ? t("healthCenterTypes.status.active", "Activo")
                : t("healthCenterTypes.status.inactive", "Inactivo"),
          })),
          fileName: "tipos-de-centro-de-salud",
          title: t("healthCenterTypes.title", "Tipos de Centros de Salud"),
          subtitle: t(
            "healthCenterTypes.subtitle",
            "Listado de tipos de centros de salud",
          ),
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
        {!isMobile && t("healthCenterTypes.create", "Nuevo Tipo")}
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
                ? t("healthCenterTypes.empty.noResults", "Sin resultados")
                : t(
                    "healthCenterTypes.empty.noHealthCenterTypes",
                    "No hay tipos de centros",
                  )}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {activeFiltersCount > 0
              ? t(
                  "healthCenterTypes.empty.noResultsDescription",
                  "No hay tipos que coincidan con los filtros aplicados.",
                )
              : t(
                  "healthCenterTypes.empty.noHealthCenterTypesDescription",
                  "Aún no se han registrado tipos de centros. Crea el primero.",
                )}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 ? (
            <MCButton variant="outline" onClick={clearFilters} size="sm">
              {t("healthCenterTypes.empty.clearFilters", "Limpiar filtros")}
            </MCButton>
          ) : (
            <CreateEditHealthCenterType onConfirm={handleCreate}>
              <MCButton size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("healthCenterTypes.create", "Nuevo Tipo")}
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
      title: t("healthCenterTypes.metrics.total", "Total"),
      value: safeHealthCenterTypes.length,
      icon: <Hospital size={30} />,
      subtitle: t(
        "healthCenterTypes.metrics.totalSubtitle",
        "Tipos registrados",
      ),
    },
    {
      title: t("healthCenterTypes.metrics.active", "Activos"),
      value: safeHealthCenterTypes.filter(
        (item) => resolveStatus(item) === "active",
      ).length,
      icon: <CheckCircle size={30} />,
      subtitle: t(
        "healthCenterTypes.metrics.activeSubtitle",
        "Disponibles para centros",
      ),
    },
    {
      title: t("healthCenterTypes.metrics.inactive", "Inactivos"),
      value: safeHealthCenterTypes.filter(
        (item) => resolveStatus(item) === "inactive",
      ).length,
      icon: <XCircle size={30} />,
      subtitle: t(
        "healthCenterTypes.metrics.inactiveSubtitle",
        "No disponibles",
      ),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("healthCenterTypes.title", "Tipos de Centros de Salud")}
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
