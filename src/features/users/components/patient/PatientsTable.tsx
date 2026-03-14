import * as React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/shared/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { UserStatusBadge, type UserStatus } from "../UserStates";
import UserAction from "../UserAction";
import ViewDetailsPatientDialog from "./ViewDetailsPatientDialog";

export interface Patient {
  id: string;
  name: string;
  image?: string;
  status: UserStatus;
  registrationDate: string;
  phone: string;
  email: string;
}

interface PatientsTableProps {
  patients: Patient[];
  onViewDetails?: (patient: Patient) => void;
}

const PAGE_SIZE = 10;

const truncate = (text: string | undefined, maxLength: number = 28): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function PatientsTable({
  patients,
  onViewDetails,
}: PatientsTableProps) {
  const { t } = useTranslation("common");
  const [page, setPage] = React.useState(1);

  const totalPages = Math.ceil(patients.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = patients.slice(startIndex, startIndex + PAGE_SIZE);

  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [patients.length, page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              {t("patients.table.patient")}
            </TableHead>
            <TableHead className="w-[130px]">{t("table.status")}</TableHead>
            <TableHead className="w-[160px]">
              {t("table.registrationDate")}
            </TableHead>
            <TableHead className="w-[200px]">{t("table.contact")}</TableHead>
            <TableHead className="w-[80px]">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="w-[250px]">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center">
                      {patient.image ? (
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          <AvatarImage
                            src={patient.image}
                            alt={patient.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-12 w-12 rounded-full">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <span className="font-medium">{patient.name}</span>
                  </div>
                </TableCell>
                <TableCell className="w-[130px]">
                  <UserStatusBadge status={patient.status} />
                </TableCell>
                <TableCell className="w-[160px]">
                  <span className="font-medium">
                    {patient.registrationDate}
                  </span>
                </TableCell>
                <TableCell className="w-[200px]">
                  <div className="font-medium">{patient.phone}</div>
                  {patient.email.length > 28 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground cursor-help">
                            {truncate(patient.email)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{patient.email}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {patient.email}
                    </div>
                  )}
                </TableCell>
                <TableCell className="w-[80px]">
                  <ViewDetailsPatientDialog patientId={patient.id}>
                    <UserAction
                      onViewDetails={() => onViewDetails?.(patient)}
                    />
                  </ViewDetailsPatientDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                {t("patients.table.noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
