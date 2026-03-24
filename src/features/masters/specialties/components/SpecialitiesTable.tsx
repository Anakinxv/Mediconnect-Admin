import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import MCServicesStatus from "@/shared/components/MCServicesStatus";
import SpecialitiesActions from "./SpecialitiesActions";
import type { SpecialityInterface } from "../hooks/useSpecialities";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/shared/ui/tooltip";

interface SpecialitiesTableProps {
  specialities: SpecialityInterface[];
  onEdit?: (speciality: SpecialityInterface) => void;
  onDelete?: (speciality: SpecialityInterface) => void;
  onToggleStatus?: (speciality: SpecialityInterface) => void;
}

const PAGE_SIZE = 10;

const resolveStatus = (item: SpecialityInterface): string => {
  const raw =
    item.status ||
    (item as unknown as Record<string, string>).estado ||
    "inactive";
  return raw;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  try {
    const date = dateStr.includes("T")
      ? new Date(dateStr)
      : (() => {
          const [d, m, y] = dateStr.split("/");
          return new Date(Number(y), Number(m) - 1, Number(d));
        })();
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

function TruncatedCell({
  text,
  maxLength = 50,
}: {
  text: string;
  maxLength?: number;
}) {
  const isTruncated = text?.length > maxLength;
  const display = isTruncated ? text.slice(0, maxLength) + "…" : text;

  if (!isTruncated) {
    return <span className="text-sm text-muted-foreground">{display}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm text-muted-foreground cursor-default">
            {display}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-normal">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function SpecialitiesTable({
  specialities,
  onEdit,
  onDelete,
  onToggleStatus,
}: SpecialitiesTableProps) {
  const { t } = useTranslation("specialties");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(specialities.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = specialities.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [specialities.length, page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">
              {t("specialities.table.name", "Nombre")}
            </TableHead>
            <TableHead className="w-[300px] text-left">
              {t("specialties.table.description", "Descripción")}
            </TableHead>
            <TableHead className="w-[160px]">
              {t("specialties.table.createdAt", "Fecha de Creación")}
            </TableHead>
            <TableHead className="w-[130px]">
              {t("table.status", "Estado")}
            </TableHead>
            <TableHead className="w-[80px]">
              {t("table.actions", "Acciones")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((speciality) => (
              <TableRow key={speciality.id}>
                <TableCell className="w-[220px]">
                  <span className="font-medium">{speciality.nombre}</span>
                </TableCell>
                <TableCell className="w-[300px] text-left">
                  <TruncatedCell
                    text={speciality.descripcion}
                    maxLength={100}
                  />
                </TableCell>
                <TableCell className="w-[160px]">
                  <span className="font-medium">
                    {formatDate(speciality.creadoEn)}
                  </span>
                </TableCell>
                <TableCell className="w-[130px]">
                  <MCServicesStatus
                    status={resolveStatus(speciality)}
                    variant="default"
                  />
                </TableCell>
                <TableCell className="w-[80px]">
                  <SpecialitiesActions
                    speciality={speciality}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-left py-8 text-muted-foreground"
              >
                {t(
                  "specialties.table.noData",
                  "No hay especialidades registradas",
                )}
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
