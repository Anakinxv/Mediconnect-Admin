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
import { Stethoscope, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import SpecialitiesTable from "../components/SpecialitiesTable";
import SpecialitiesFilters from "../components/SpecialitiesFilters";
import CreateEditSpeciality from "../components/Createeditspeciality";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import {
  useGetSpecialities,
  useCreateSpeciality,
  useUpdateSpeciality,
  useDeleteSpeciality,
  useToggleSpecialityStatus,
  type SpecialityInterface,
  type GetSpecialitiesParams,
} from "../hooks/useSpecialities";

export const resolveStatus = (
  s: SpecialityInterface,
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

function SpecialitiesPage() {
  const { t } = useTranslation("specialties");
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

  const apiParams = useMemo<GetSpecialitiesParams>(
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
      translate_fields: ["nombre", "descripcion"],
    }),
    [searchTerm, filters.status],
  );

  // --- Loading for fetch specialities ---
  const {
    data: apiSpecialities = [],
    isLoading,
    isFetching,
  } = useGetSpecialities(apiParams);

  useEffect(() => {
    setIsLoading(isLoading || isFetching);
    return () => setIsLoading(false);
  }, [isLoading, isFetching, setIsLoading]);

  const createMutation = useCreateSpeciality();
  const updateMutation = useUpdateSpeciality();
  const deleteMutation = useDeleteSpeciality();
  const toggleMutation = useToggleSpecialityStatus();

  const safeSpecialities = Array.isArray(apiSpecialities)
    ? apiSpecialities
    : [];

  // Solo filtro client-side para dateRange (el API no lo soporta)
  const filteredSpecialities = useMemo(
    () =>
      safeSpecialities.filter((s) =>
        matchesDateRange(s.creadoEn, filters.dateRange),
      ),
    [safeSpecialities, filters.dateRange],
  );

  // Wrap mutation handlers to show/hide loading
  const handleCreate = (data: { name: string; description: string }) => {
    setIsLoading(true);
    createMutation.mutate(
      { nombre: data.name, descripcion: data.description, estado: "Activo" },
      {
        onSettled: () => setIsLoading(false),
        onSuccess: () =>
          setToast({
            message: t(
              "specialities.toast.createSuccess",
              "Especialidad creada correctamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "specialities.toast.createError",
              "Error al crear la especialidad",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleEdit = (updated: SpecialityInterface) => {
    setIsLoading(true);
    updateMutation.mutate(
      {
        id: updated.id,
        nombre: updated.nombre,
        descripcion: updated.descripcion,
      },
      {
        onSettled: () => setIsLoading(false),
        onSuccess: () =>
          setToast({
            message: t(
              "specialties.toast.editSuccess",
              "Especialidad actualizada correctamente",
            ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "specialties.toast.editError",
              "Error al actualizar la especialidad",
            ),
            type: "error",
            open: true,
          }),
      },
    );
  };

  const handleDelete = (target: SpecialityInterface) => {
    setIsLoading(true);
    deleteMutation.mutate(target.id, {
      onSettled: () => setIsLoading(false),
      onSuccess: () =>
        setToast({
          message: t(
            "specialties.toast.deleteSuccess",
            `"${target.nombre}" fue eliminada correctamente`,
          ),
          type: "success",
          open: true,
        }),
      onError: () =>
        setToast({
          message: t(
            "specialties.toast.deleteError",
            "Error al eliminar la especialidad",
          ),
          type: "error",
          open: true,
        }),
    });
  };

  const handleToggleStatus = (target: SpecialityInterface) => {
    setIsLoading(true);
    const isActive = resolveStatus(target) === "active";
    toggleMutation.mutate(
      { id: target.id, estado: isActive ? "Inactivo" : "Activo" },
      {
        onSettled: () => setIsLoading(false),
        onSuccess: () =>
          setToast({
            message: isActive
              ? t(
                  "specialties.toast.deactivated",
                  `"${target.nombre}" fue desactivada correctamente`,
                )
              : t(
                  "specialties.toast.activated",
                  `"${target.nombre}" fue activada correctamente`,
                ),
            type: "success",
            open: true,
          }),
        onError: () =>
          setToast({
            message: t(
              "specialties.toast.statusError",
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
        placeholder={t(
          "specialties.searchPlaceholder",
          "Buscar especialidad...",
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
            { title: t("specialties.table.name", "Nombre"), key: "nombre" },
            {
              title: t("specialties.table.description", "Descripción"),
              key: "descripcion",
            },
            { title: t("table.status", "Estado"), key: "estadoLabel" },
            {
              title: t("specialties.table.createdAt", "Fecha de Creación"),
              key: "creadoEn",
            },
          ],
          data: filteredSpecialities.map((s) => ({
            ...s,
            estadoLabel:
              resolveStatus(s) === "active"
                ? t("specialties.status.active", "Activo")
                : t("specialties.status.inactive", "Inactivo"),
          })),
          fileName: "especialidades",
          title: t("specialties.title", "Especialidades"),
          subtitle: t(
            "specialties.subtitle",
            "Listado de especialidades médicas",
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
      <SpecialitiesFilters
        filters={filters}
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />
    </MCFilterPopover>
  );

  const actionPlusComponent = (
    <CreateEditSpeciality onConfirm={handleCreate}>
      <MCButton size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        {!isMobile && t("specialties.create", "Nueva Especialidad")}
      </MCButton>
    </CreateEditSpeciality>
  );

  const emptyState = (
    <Empty>
      <EmptyHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center justify-center gap-2 text-primary">
            {activeFiltersCount > 0 ? (
              <Filter className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            ) : (
              <Stethoscope className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("specialties.empty.noResults", "Sin resultados")
                : t(
                    "specialties.empty.noSpecialities",
                    "No hay especialidades",
                  )}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t(
                  "specialties.empty.noResultsDescription",
                  "No hay especialidades que coincidan con los filtros aplicados.",
                )
              : t(
                  "specialties.empty.noSpecialitiesDescription",
                  "Aún no se han registrado especialidades. Crea la primera.",
                )}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 ? (
            <MCButton variant="outline" onClick={clearFilters} size="sm">
              {t("specialties.empty.clearFilters", "Limpiar filtros")}
            </MCButton>
          ) : (
            <CreateEditSpeciality onConfirm={handleCreate}>
              <MCButton size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("specialties.create", "Nueva Especialidad")}
              </MCButton>
            </CreateEditSpeciality>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredSpecialities.length === 0 ? (
      emptyState
    ) : (
      <SpecialitiesTable
        specialities={filteredSpecialities}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    );

  const metrics = [
    {
      title: t("specialties.metrics.total", "Total"),
      value: safeSpecialities.length,
      icon: <Stethoscope size={30} />,
      subtitle: t(
        "specialties.metrics.totalSubtitle",
        "Especialidades registradas",
      ),
    },
    {
      title: t("specialties.metrics.active", "Activas"),
      value: safeSpecialities.filter((s) => resolveStatus(s) === "active")
        .length,
      icon: <CheckCircle size={30} />,
      subtitle: t(
        "specialties.metrics.activeSubtitle",
        "Disponibles para médicos",
      ),
    },
    {
      title: t("specialties.metrics.inactive", "Inactivas"),
      value: safeSpecialities.filter((s) => resolveStatus(s) === "inactive")
        .length,
      icon: <XCircle size={30} />,
      subtitle: t("specialties.metrics.inactiveSubtitle", "No disponibles"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("specialties.title", "Especialidades")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
      actionPlusComponent={actionPlusComponent}
    />
  );
}

export default SpecialitiesPage;
