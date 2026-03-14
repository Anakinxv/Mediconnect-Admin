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
import { UserCheck, UserX, Clock, Filter, Stethoscope } from "lucide-react";
import DoctorsTable, { type Doctor } from "../components/doctor/DoctorsTable";
import DoctorFilters from "../components/filters/DoctorFilters";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Francisco Madera",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "pending",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "francisco.m@correo.com",
    specialty: "Cardiología",
  },
  {
    id: "2",
    name: "Emmanuel Jimenez",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "pending",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "emmanuelj@correo.com",
    specialty: "Neurología",
  },
  {
    id: "3",
    name: "Derek Hernandez",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "approved",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "derekh@correo.com",
    specialty: "Dermatología",
  },
  {
    id: "4",
    name: "Jackson Martinez",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "approved",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "jacksonm@correo.com",
    specialty: "Pediatría",
  },
  {
    id: "5",
    name: "Gabriela Melo",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    status: "pending",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "gabrielam@correo.com",
    specialty: "Ginecología",
  },
  {
    id: "6",
    name: "Juan Olivo",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    status: "rejected",
    registrationDate: "11/10/2025",
    phone: "809-432-9532",
    email: "juanolivo@correo.com",
    specialty: "Traumatología",
  },
];

function DoctorsPage() {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    specialty: "all",
    dateRange: undefined as [Date, Date] | undefined,
  });

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "dateRange") return value !== undefined;
    return value !== "all" && value !== "";
  }).length;

  const clearFilters = () =>
    setFilters({ status: "all", specialty: "all", dateRange: undefined });

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

  const filteredDoctors = useMemo(
    () =>
      mockDoctors.filter((doctor) => {
        const matchesSearch =
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.phone.includes(searchTerm) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filters.status === "all" || doctor.status === filters.status;
        const matchesSpecialty =
          filters.specialty === "all" ||
          doctor.specialty
            .toLowerCase()
            .includes(filters.specialty.toLowerCase());
        const matchesDate = matchesCustomDateRange(
          doctor.registrationDate,
          filters.dateRange,
        );
        return (
          matchesSearch && matchesStatus && matchesSpecialty && matchesDate
        );
      }),
    [searchTerm, filters],
  );

  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder={t("doctors.searchPlaceholder")}
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
            { title: t("doctors.table.doctor"), key: "name" },
            { title: t("doctors.table.specialty"), key: "specialty" },
            { title: t("table.status"), key: "status" },
            { title: t("table.registrationDate"), key: "registrationDate" },
            { title: t("table.phone"), key: "phone" },
            { title: t("table.email"), key: "email" },
          ],
          data: filteredDoctors.map((doctor) => ({
            ...doctor,
            status: t(`doctors.status.${doctor.status}`),
          })),
          fileName: "doctores",
          title: t("doctors.title"),
          subtitle: t("doctors.subtitle"),
        });
      }}
    />
  );

  const filterComponent = (
    <MCFilterPopover
      activeFiltersCount={activeFiltersCount}
      onClearFilters={clearFilters}
    >
      <DoctorFilters
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
              <Stethoscope className={isMobile ? "w-5 h-5" : "w-7 h-7"} />
            )}
            <EmptyTitle
              className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {activeFiltersCount > 0
                ? t("doctors.empty.noResults")
                : t("doctors.empty.noDoctors")}
            </EmptyTitle>
          </span>
          <EmptyDescription
            className={`text-muted-foreground text-center max-w-md mx-auto ${isMobile ? "text-sm" : "text-base"}`}
          >
            {activeFiltersCount > 0
              ? t("doctors.empty.noResultsDescription")
              : t("doctors.empty.noDoctorsDescription")}
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
              {t("doctors.empty.clearFilters")}
            </MCButton>
          )}
        </div>
      </EmptyContent>
    </Empty>
  );

  const tableComponent =
    filteredDoctors.length === 0 ? (
      emptyState
    ) : (
      <DoctorsTable
        doctors={filteredDoctors}
        onViewDetails={(doctor) =>
          navigate(ROUTES.DOCTOR_DETAILS.replace(":doctorId", doctor.id))
        }
      />
    );

  const metrics = [
    {
      title: t("doctors.metrics.total"),
      value: mockDoctors.filter((d) => d.status === "approved").length,
      icon: <UserCheck size={30} />,
      subtitle: t("doctors.metrics.totalSubtitle"),
    },
    {
      title: t("doctors.metrics.pending"),
      value: mockDoctors.filter((d) => d.status === "pending").length,
      icon: <Clock size={30} />,
      subtitle: t("doctors.metrics.pendingSubtitle"),
    },
    {
      title: t("doctors.metrics.rejected"),
      value: mockDoctors.filter((d) => d.status === "rejected").length,
      icon: <UserX size={30} />,
      subtitle: t("doctors.metrics.rejectedSubtitle"),
    },
    {
      title: t("doctors.metrics.approved"),
      value: mockDoctors.filter((d) => d.status === "approved").length,
      icon: <Stethoscope size={30} />,
      subtitle: t("doctors.metrics.approvedSubtitle"),
    },
  ];

  return (
    <MCTablesLayouts
      title={t("doctors.title")}
      metrics={metrics}
      tableComponent={tableComponent}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      filterComponent={filterComponent}
    />
  );
}

export default DoctorsPage;
