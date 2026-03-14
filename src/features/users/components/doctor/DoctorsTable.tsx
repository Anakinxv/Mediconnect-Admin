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

export interface Doctor {
  id: string;
  name: string;
  image?: string;
  status: UserStatus;
  registrationDate: string;
  phone: string;
  email: string;
  specialty: string;
}

interface DoctorsTableProps {
  doctors: Doctor[];
  onViewDetails?: (doctor: Doctor) => void;
}

const PAGE_SIZE = 10;

const truncate = (text: string | undefined, maxLength: number = 28): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function DoctorsTable({
  doctors,
  onViewDetails,
}: DoctorsTableProps) {
  const { t } = useTranslation("common");
  const [page, setPage] = React.useState(1);

  const totalPages = Math.ceil(doctors.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = doctors.slice(startIndex, startIndex + PAGE_SIZE);

  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [doctors.length, page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">
              {t("doctors.table.doctor")}
            </TableHead>
            <TableHead className="w-[140px]">
              {t("doctors.table.specialty")}
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
            paginatedData.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="w-[220px]">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center">
                      {doctor.image ? (
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          <AvatarImage
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-12 w-12 rounded-full">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <span className="font-medium">{doctor.name}</span>
                  </div>
                </TableCell>
                <TableCell className="w-[140px]">
                  <span className="font-medium text-primary">
                    {doctor.specialty}
                  </span>
                </TableCell>
                <TableCell className="w-[130px]">
                  <UserStatusBadge status={doctor.status} />
                </TableCell>
                <TableCell className="w-[160px]">
                  <span className="font-medium">{doctor.registrationDate}</span>
                </TableCell>
                <TableCell className="w-[200px]">
                  <div className="font-medium">{doctor.phone}</div>
                  {doctor.email.length > 28 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground cursor-help">
                            {truncate(doctor.email)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{doctor.email}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {doctor.email}
                    </div>
                  )}
                </TableCell>
                <TableCell className="w-[80px]">
                  <UserAction onViewDetails={() => onViewDetails?.(doctor)} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                {t("doctors.table.noData")}
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
