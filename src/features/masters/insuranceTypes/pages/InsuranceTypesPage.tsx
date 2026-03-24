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
import InsuranceTypesTable from "../components/InsuranceTypesTable";
import InsuranceTypesFilters from "../components/InsuranceTypesFilters";
import CreateEditInsuranceType from "../components/modals/CreateEditInsuranceType";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import {
  useGetInsuranceTypes,
  useCreateInsuranceType,
  useUpdateInsuranceType,
  useDeleteInsuranceType,
  useToggleInsuranceTypeStatus,
  type InsuranceTypeInterface,
  type GetInsuranceTypesParams,
} from "../hooks/useInsuranceTypes";

export const resolveStatus = (
  s: InsuranceTypeInterface,
): "active" | "inactive" => {
  const raw = (s.status ?? s.estado ?? "").toLowerCase();
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

function InsuranceTypesPage() {
  const { t } = useTranslation("insuranceType");
  const isMobile = useIsMobile();
  const setToast = useGlobalUIStore((s) => s.setToast);

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

  const apiParams = useMemo<GetInsuranceTypesParams>(
    () => ({
      busqueda: searchTerm?.trim() || undefined,
      estado:
        filters.status === "active"
          ? "Activo"
          : filters.status === "inactive"
            ? "Inactivo"
            : undefined,
      pagina: 1,
      limite: 100,
      translate_fields: ["nombre", "descripcion"],
    }),
    [searchTerm, filters.status],
  );

  const { data: apiInsuranceTypes = [] } = useGetInsuranceTypes(apiParams);
  const createMutation = useCreateInsuranceType();
  const updateMutation = useUpdateInsuranceType();
  const deleteMutation = useDeleteInsuranceType();
  const toggleMutation = useToggleInsuranceTypeStatus();

  const safeInsuranceTypes = Array.isArray(apiInsuranceTypes)
    ? apiInsuranceTypes
    : [];

  const filteredInsuranceTypes = useMemo(
    () =>
      safeInsuranceTypes.filter((s) =>
        matchesDateRange(s.creadoEn, filters.dateRange),
      ),
    [safeInsuranceTypes, filters.dateRange],
  );

  const handleCreate = (data: { name: string; description?: string }) => {
    createMutation.mutate(
      {
        nombre: data.name,
        descripcion: data.description?.trim() || "",
      },
      {
        onSuccess: () =>
          setToast({
            message: t(
              "insuranceTypes.toast.createSuccess",
              "Tipo de seguro creado correctamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "insuranceTypes.toast.createError",
              "Error al crear el tipo de seguro",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleEdit = (updated: InsuranceTypeInterface) => {
    updateMutation.mutate(
      {
        id: updated.id,
        nombre: updated.nombre,
        descripcion: updated.descripcion ?? "",
      },
      {
        onSuccess: () =>
          setToast({
            message: t(
              "insuranceTypes.toast.editSuccess",
              "Tipo de seguro actualizado correctamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "insuranceTypes.toast.editError",
              "Error al actualizar el tipo de seguro",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleDelete = (target: InsuranceTypeInterface) => {
    deleteMutation.mutate(target.id, {
      onSuccess: () =>
        setToast({
          message: t(
            "insuranceTypes.toast.deleteSuccess",
            `"${target.nombre}" fue eliminado correctamente`,
          ),
          type: "success",
          open: true,
        }),
      onError: () =>
        setToast({
          message: t(
            "insuranceTypes.toast.deleteError",
            "Error al eliminar el tipo de seguro",
          ),
          type: "error",
          open: true,
        }),
    });
  };

  const handleToggleStatus = (target: InsuranceTypeInterface) => {
    const isActive = resolveStatus(target) === "active";
    toggleMutation.mutate(
      { id: target.id, estado: isActive ? "Inactivo" : "Activo" },
      {
        onSuccess: () =>
          setToast({
            message: isActive
              ? t(
                  "insuranceTypes.toast.deactivated",
                  `"${target.nombre}" fue desactivado correctamente`,
                )
              : t(
                  "insuranceTypes.toast.activated",
                  `"${target.nombre}" fue activado correctamente`,
                ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "insuranceTypes.toast.statusError",
              "Error al cambiar el estado",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

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
            { title: t("insuranceTypes.table.name"), key: "nombre" },
            {
              title: t("insuranceTypes.table.description", "Descripción"),
              key: "descripcion",
            },
            { title: t("table.status"), key: "estadoLabel" },
            { title: t("insuranceTypes.table.createdAt"), key: "creadoEn" },
          ],
          data: filteredInsuranceTypes.map((item) => ({
            ...item,
            estadoLabel:
              resolveStatus(item) === "active"
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
      value: safeInsuranceTypes.length,
      icon: <ShieldCheck size={30} />,
      subtitle: t("insuranceTypes.metrics.totalSubtitle"),
    },
    {
      title: t("insuranceTypes.metrics.active"),
      value: safeInsuranceTypes.filter((i) => resolveStatus(i) === "active")
        .length,
      icon: <CheckCircle size={30} />,
      subtitle: t("insuranceTypes.metrics.activeSubtitle"),
    },
    {
      title: t("insuranceTypes.metrics.inactive"),
      value: safeInsuranceTypes.filter((i) => resolveStatus(i) === "inactive")
        .length,
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
