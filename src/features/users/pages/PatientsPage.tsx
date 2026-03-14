import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import MCTablesLayouts from "@/shared/components/MCTablesLayouts";
import MCPDFButton from "@/shared/components/forms/MCPDFButton";
import { MCFilterPopover } from "@/shared/components/filters/MCFilterPopover";
import MCFilterInput from "@/shared/components/filters/MCFilterInput";
import MCGeneratePDF from "@/shared/components/forms/MCGeneratePDF";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/shared/ui/empty";
import MCButton from "@/shared/components/forms/MCButton";
import { UserCheck, UserX, Clock, Filter, Users } from "lucide-react";
import PatientsTable, {
  type Patient,
} from "../components/patient/PatientsTable";
import PatientFilters from "../components/filters/Patientfilters";

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Francisco Madera",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "pending",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "francisco.m@correo.com",
  },
  {
    id: "2",
    name: "Emmanuel Jimenez",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "pending",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "emmanuelj@correo.com",
  },
  {
    id: "3",
    name: "Derek Hernandez",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "approved",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "derekh@correo.com",
  },
  {
    id: "4",
    name: "Jackson Martinez",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "approved",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "jacksonm@correo.com",
  },
  {
    id: "5",
    name: "Gabriela Melo",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    status: "pending",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "gabrielam@correo.com",
  },
  {
    id: "6",
    name: "Juan Olivo",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    status: "rejected",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "juanolivo@correo.com",
  },
];

function PatientsPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: undefined as [Date, Date] | undefined,
  });

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "dateRange") return value !== undefined;
    return value !== "all" && value !== "";
  }).length;

  const clearFilters = () =>
    setFilters({ status: "all", dateRange: undefined });

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const matchesCustomDateRange = (
    dateStr: string,
    range?: [Date, Date],
  ): boolean => {
    if (!range) return true;
    const reg = parseDate(dateStr);
    reg.setHours(0, 0, 0, 0);
    const start = new Date(range[0]);
    start.setHours(0, 0, 0, 0);
    const end = new Date(range[1]);
    end.setHours(23, 59, 59, 999);
    return reg >= start && reg <= end;
  };

  const filteredPatients = useMemo(
    () =>
      mockPatients.filter((patient) => {
        const matchesSearch =
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm);
        const matchesStatus =
          filters.status === "all" || patient.status === filters.status;
        const matchesDate = matchesCustomDateRange(
          patient.registrationDate,
          filters.dateRange,
        );
        return matchesSearch && matchesStatus && matchesDate;
      }),
    [searchTerm, filters],
  );

  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t("patients.searchPlaceholder")}
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
            { title: t("patients.table.patient"), key: "name" },
            { title: t("table.status"), key: "status" },
            { title: t("table.registrationDate"), key: "registrationDate" },
            { title: t("table.phone"), key: "phone" },
            { title: t("table.email"), key: "email" },
          ],
          data: filteredPatients.map((patient) => ({
            ...patient,
            status: t(`patients.status.${patient.status}`),
          })),
          fileName: "pacientes",
          title: t("patients.title"),
          subtitle: t("patients.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <PatientFilters
        filters={filters}
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />
    </MCFilterPopover>
  );

  const emptyState = (
    <Empty>
      <EmptyHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center justify-center gap-2 text-primary">
            {activeFiltersCount > 0 ? (
              <Filter className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            ) : (
              <Users className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("patients.empty.noResults")
                : t("patients.empty.noPatients")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t("patients.empty.noResultsDescription")
              : t("patients.empty.noPatientsDescription")}
          </EmptyDescription>
        </div>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col items-center gap-3">
          {activeFiltersCount > 0 && (
            <MCButton
              variant="outline"
              onClick={clearFilters}
              className={isMobile ? "px-4 py-2" : "px-6 py-2"}
              size="sm"
            >
              {t("patients.empty.clearFilters")}
            </MCButton>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredPatients.length === 0 ? (
      emptyState
    ) : (
      <PatientsTable
        patients={filteredPatients}
        onViewDetails={(patient) => console.log("View details:", patient)}
      />
    );

  const metrics = [
    {
      title: t("patients.metrics.total"),
      value: mockPatients.filter((p) => p.status === "approved").length,
      icon: <UserCheck size={30} />,
      subtitle: t("patients.metrics.totalSubtitle"),
    },
    {
      title: t("patients.metrics.pending"),
      value: mockPatients.filter((p) => p.status === "pending").length,
      icon: <Clock size={30} />,
      subtitle: t("patients.metrics.pendingSubtitle"),
    },
    {
      title: t("patients.metrics.rejected"),
      value: mockPatients.filter((p) => p.status === "rejected").length,
      icon: <UserX size={30} />,
      subtitle: t("patients.metrics.rejectedSubtitle"),
    },
    {
      title: t("patients.metrics.approved"),
      value: mockPatients.filter((p) => p.status === "approved").length,
      icon: <Users size={30} />,
      subtitle: t("patients.metrics.approvedSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("patients.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
    />
  );
}

export default PatientsPage;
