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
import { Stethoscope, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import SpecialitiesTable, {
  type Speciality,
} from "../components/SpecialitiesTable";
import SpecialitiesFilters from "../components/SpecialitiesFilters";
import CreateEditSpeciality from "../components/Createeditspeciality";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

const mockSpecialities: Speciality[] = [
  {
    id: "1",
    name: "Cardiología",
    description:
      "Especialidad médica que estudia, diagnostica y trata las enfermedades del corazón y del sistema cardiovascular.",
    createdAt: "10/01/2025",
    status: "active",
  },
  {
    id: "2",
    name: "Dermatología",
    description:
      "Rama de la medicina que se ocupa del estudio, diagnóstico y tratamiento de las enfermedades de la piel.",
    createdAt: "12/01/2025",
    status: "active",
  },
  {
    id: "3",
    name: "Neurología",
    description:
      "Especialidad médica que estudia la estructura, función y enfermedades del sistema nervioso.",
    createdAt: "15/01/2025",
    status: "active",
  },
  {
    id: "4",
    name: "Pediatría",
    description:
      "Especialidad médica que estudia al ser humano durante su infancia y adolescencia.",
    createdAt: "18/01/2025",
    status: "active",
  },
  {
    id: "5",
    name: "Psiquiatría",
    description:
      "Especialidad médica que estudia las enfermedades mentales desde un punto de vista médico.",
    createdAt: "20/01/2025",
    status: "inactive",
  },
  {
    id: "6",
    name: "Traumatología",
    description:
      "Especialidad médica que estudia las lesiones del sistema musculoesquelético.",
    createdAt: "22/01/2025",
    status: "active",
  },
  {
    id: "7",
    name: "Ginecología",
    description:
      "Especialidad médica y quirúrgica que trata las enfermedades del sistema reproductor femenino.",
    createdAt: "25/01/2025",
    status: "active",
  },
  {
    id: "8",
    name: "Oftalmología",
    description:
      "Especialidad médica que estudia las enfermedades de los ojos y su tratamiento.",
    createdAt: "28/01/2025",
    status: "inactive",
  },
];

function SpecialitiesPage() {
  const { t } = useTranslation("specialties");
  const isMobile = useIsMobile();
  const setToast = useGlobalUIStore((s) => s.setToast);

  const [specialities, setSpecialities] =
    useState<Speciality[]>(mockSpecialities);
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

  const filteredSpecialities = useMemo(
    () =>
      specialities.filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filters.status === "all" || s.status === filters.status;
        const matchesDate = matchesDateRange(s.createdAt, filters.dateRange);
        return matchesSearch && matchesStatus && matchesDate;
      }),
    [searchTerm, filters, specialities],
  );

  // Handlers
  const handleCreate = (data: { name: string; description: string }) => {
    const newSpeciality: Speciality = {
      id: String(Date.now()),
      name: data.name,
      description: data.description,
      createdAt: new Date().toLocaleDateString("es-DO"),
      status: "active",
    };
    setSpecialities((prev) => [newSpeciality, ...prev]);
  };

  const handleEdit = (updated: Speciality) => {
    setSpecialities((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
  };

  const handleDelete = (target: Speciality) => {
    setSpecialities((prev) => prev.filter((s) => s.id !== target.id));
  };

  const handleToggleStatus = (target: Speciality) => {
    setSpecialities((prev) =>
      prev.map((s) =>
        s.id === target.id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s,
      ),
    );
  };

  // Components
  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t(
          "specialities.searchPlaceholder",
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
            { title: t("specialities.table.name", "Nombre"), key: "name" },
            {
              title: t("specialities.table.description", "Descripción"),
              key: "description",
            },
            { title: t("table.status", "Estado"), key: "status" },
            {
              title: t("specialities.table.createdAt", "Fecha de Creación"),
              key: "createdAt",
            },
          ],
          data: filteredSpecialities.map((s) => ({
            ...s,
            status:
              s.status === "active"
                ? t("specialities.status.active", "Activo")
                : t("specialities.status.inactive", "Inactivo"),
          })),
          fileName: "especialidades",
          title: t("specialities.title", "Especialidades"),
          subtitle: t(
            "specialities.subtitle",
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
        {!isMobile && t("specialities.create", "Nueva Especialidad")}
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
                ? t("specialities.empty.noResults", "Sin resultados")
                : t(
                    "specialities.empty.noSpecialities",
                    "No hay especialidades",
                  )}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t(
                  "specialities.empty.noResultsDescription",
                  "No hay especialidades que coincidan con los filtros aplicados.",
                )
              : t(
                  "specialities.empty.noSpecialitiesDescription",
                  "Aún no se han registrado especialidades. Crea la primera.",
                )}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 ? (
            <MCButton variant="outline" onClick={clearFilters} size="sm">
              {t("specialities.empty.clearFilters", "Limpiar filtros")}
            </MCButton>
          ) : (
            <CreateEditSpeciality onConfirm={handleCreate}>
              <MCButton size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("specialities.create", "Nueva Especialidad")}
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
      title: t("specialities.metrics.total", "Total"),
      value: specialities.length,
      icon: <Stethoscope size={30} />,
      subtitle: t(
        "specialities.metrics.totalSubtitle",
        "Especialidades registradas",
      ),
    },
    {
      title: t("specialities.metrics.active", "Activas"),
      value: specialities.filter((s) => s.status === "active").length,
      icon: <CheckCircle size={30} />,
      subtitle: t(
        "specialities.metrics.activeSubtitle",
        "Disponibles para médicos",
      ),
    },
    {
      title: t("specialities.metrics.inactive", "Inactivas"),
      value: specialities.filter((s) => s.status === "inactive").length,
      icon: <XCircle size={30} />,
      subtitle: t("specialities.metrics.inactiveSubtitle", "No disponibles"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("specialities.title", "Especialidades")}
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
