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
import { ShieldPlus, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import MedicalInsurancesTable from "../components/Medicalinsurancestable";
import MedicalInsurancesFilters from "../components/Medicalinsurancesfilters";
import CreateEditMedicalInsurance from "../components/modals/Createeditmedicalinsurance";
import {
  useGetInsurances,
  useCreateInsurance,
  useUpdateInsurance,
  useDeleteInsurance,
  useToggleInsuranceStatus,
  type InsuranceInterface,
  type GetInsurancesParams,
} from "../hooks/useInsurance";
import { useGetInsuranceTypes } from "../../insuranceTypes/hooks/useInsuranceTypes";

export const resolveStatus = (s: InsuranceInterface): "active" | "inactive" => {
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

function MedicalInsuresPage() {
  const { t } = useTranslation("medicalInsurance");
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

  const apiParams = useMemo<GetInsurancesParams>(
    () => ({
      estado:
        filters.status === "active"
          ? "Activo"
          : filters.status === "inactive"
            ? "Inactivo"
            : undefined,
      pagina: 1,
      limite: 100,
    }),
    [filters.status],
  );

  const { data: apiInsurances = [], isLoading } = useGetInsurances(apiParams);
  const { data: apiInsuranceTypes = [], isLoading: isLoadingTypes } =
    useGetInsuranceTypes({
      pagina: 1,
      limite: 100,
    });

  useEffect(() => {
    setIsLoading(isLoading || isLoadingTypes);
  }, [isLoading, isLoadingTypes, setIsLoading]);

  const createMutation = useCreateInsurance();
  const updateMutation = useUpdateInsurance();
  const deleteMutation = useDeleteInsurance();
  const toggleMutation = useToggleInsuranceStatus();

  const safeInsures = Array.isArray(apiInsurances) ? apiInsurances : [];
  const safeInsuranceTypes = Array.isArray(apiInsuranceTypes)
    ? apiInsuranceTypes
    : [];

  const filteredInsures = useMemo(
    () =>
      safeInsures.filter((item) => {
        const matchesSearch = item.nombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDate = matchesDateRange(item.creadoEn, filters.dateRange);
        return matchesSearch && matchesDate;
      }),
    [safeInsures, searchTerm, filters.dateRange],
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCreate = (data: {
    nombre: string;
    urlImage?: string;
    tiposPermitidosIds: number[];
  }) => {
    setIsLoading(true);
    createMutation.mutate(
      {
        nombre: data.nombre,
        urlImage: data.urlImage,
        estado: "Activo",
        tiposPermitidos: data.tiposPermitidosIds,
      },
      {
        onSuccess: () =>
          setToast({
            message: t("medicalInsures.toast.createSuccess"),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("medicalInsures.toast.createError"),
            type: "error",
            open: true,
          }),
        onSettled: () => setIsLoading(false),
      },
    );
  };

  const handleEdit = (updated: InsuranceInterface) => {
    setIsLoading(true);
    updateMutation.mutate(
      {
        id: updated.id,
        nombre: updated.nombre,
        urlImage: updated.urlImage,
        tiposPermitidos: updated.tiposPermitidos?.map((tp) => tp.id),
      },
      {
        onSuccess: () =>
          setToast({
            message: t("medicalInsures.toast.editSuccess"),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("medicalInsures.toast.editError"),
            type: "error",
            open: true,
          }),
        onSettled: () => setIsLoading(false),
      },
    );
  };

  const handleDelete = (target: InsuranceInterface) => {
    setIsLoading(true);
    deleteMutation.mutate(target.id, {
      onSuccess: () =>
        setToast({
          message: t("medicalInsures.toast.deleteSuccess", {
            name: target.nombre,
          }),
          type: "success",
          open: true,
        }),
      onError: () =>
        setToast({
          message: t("medicalInsures.toast.deleteError"),
          type: "error",
          open: true,
        }),
      onSettled: () => setIsLoading(false),
    });
  };

  const handleToggleStatus = (target: InsuranceInterface) => {
    const isActive = resolveStatus(target) === "active";
    setIsLoading(true);
    toggleMutation.mutate(
      { id: target.id, estado: isActive ? "Inactivo" : "Activo" },
      {
        onSuccess: () =>
          setToast({
            message: isActive
              ? t("medicalInsures.toast.deactivated", {
                  name: target.nombre,
                })
              : t("medicalInsures.toast.activated", { name: target.nombre }),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t("medicalInsures.toast.statusError"),
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
        placeholder={t("medicalInsures.searchPlaceholder")}
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
            { title: t("medicalInsures.table.insurance"), key: "nombre" },
            {
              title: t("medicalInsures.table.allowedTypes", "Tipos permitidos"),
              key: "tiposLabel",
            },
            { title: t("table.status"), key: "estadoLabel" },
            { title: t("medicalInsures.table.createdAt"), key: "creadoEn" },
          ],
          data: filteredInsures.map((item: InsuranceInterface) => ({
            ...item,
            tiposLabel:
              item.tiposPermitidos?.map((tp) => tp.nombre).join(", ") || "-",
            estadoLabel:
              resolveStatus(item) === "active"
                ? t("medicalInsures.status.active")
                : t("medicalInsures.status.inactive"),
          })),
          fileName: "seguros-medicos",
          title: t("medicalInsures.title"),
          subtitle: t("medicalInsures.subtitle"),
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
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />
    </MCFilterPopover>
  );

  const actionPlusComponent = (
    <CreateEditMedicalInsurance
      insuranceTypes={safeInsuranceTypes}
      onConfirm={handleCreate}
    >
      <MCButton size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        {!isMobile && t("medicalInsures.create")}
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
                ? t("medicalInsures.empty.noResults")
                : t("medicalInsures.empty.noMedicalInsures")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t("medicalInsures.empty.noResultsDescription")
              : t("medicalInsures.empty.noMedicalInsuresDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 ? (
            <MCButton variant="outline" onClick={clearFilters} size="sm">
              {t("medicalInsures.empty.clearFilters")}
            </MCButton>
          ) : (
            <CreateEditMedicalInsurance
              insuranceTypes={safeInsuranceTypes}
              onConfirm={handleCreate}
            >
              <MCButton size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("medicalInsures.create")}
              </MCButton>
            </CreateEditMedicalInsurance>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredInsures.length === 0 && !isLoading ? (
      emptyState
    ) : (
      <MedicalInsurancesTable
        insurances={filteredInsures}
        insuranceTypes={safeInsuranceTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    );

  const metrics = [
    {
      title: t("medicalInsures.metrics.total"),
      value: safeInsures.length,
      icon: <ShieldPlus size={30} />,
      subtitle: t("medicalInsures.metrics.totalSubtitle"),
    },
    {
      title: t("medicalInsures.metrics.active"),
      value: safeInsures.filter(
        (i: InsuranceInterface) => resolveStatus(i) === "active",
      ).length,
      icon: <CheckCircle size={30} />,
      subtitle: t("medicalInsures.metrics.activeSubtitle"),
    },
    {
      title: t("medicalInsures.metrics.inactive"),
      value: safeInsures.filter(
        (i: InsuranceInterface) => resolveStatus(i) === "inactive",
      ).length,
      icon: <XCircle size={30} />,
      subtitle: t("medicalInsures.metrics.inactiveSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("medicalInsures.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
      actionPlusComponent={actionPlusComponent}
    />
  );
}

export default MedicalInsuresPage;
