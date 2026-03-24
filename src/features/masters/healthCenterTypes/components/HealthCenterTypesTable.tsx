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
import HealthCenterTypesActions from "./HealthCenterTypesActions";
import type { HealthCenterTypeInterface } from "../hooks/useHealthCenterTypes";
import { resolveStatus } from "../pages/HealthCenterTypesPage";

interface HealthCenterTypesTableProps {
  healthCenterTypes: HealthCenterTypeInterface[];
  onEdit?: (item: HealthCenterTypeInterface) => void;
  onDelete?: (item: HealthCenterTypeInterface) => void;
  onToggleStatus?: (item: HealthCenterTypeInterface) => void;
}

const PAGE_SIZE = 10;

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

export default function HealthCenterTypesTable({
  healthCenterTypes,
  onEdit,
  onDelete,
  onToggleStatus,
}: HealthCenterTypesTableProps) {
  const { t } = useTranslation("healthCenterType");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(healthCenterTypes.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = healthCenterTypes.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [healthCenterTypes.length, page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              {t("healthCenterTypes.table.name", "Nombre")}
            </TableHead>
            <TableHead className="w-[160px]">
              {t("healthCenterTypes.table.createdAt", "Fecha de Creación")}
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
            paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="w-[300px]">
                  <span className="font-medium">{item.nombre}</span>
                </TableCell>
                <TableCell className="w-[160px]">
                  <span className="font-medium">
                    {formatDate(item.creadoEn)}
                  </span>
                </TableCell>
                <TableCell className="w-[130px]">
                  <MCServicesStatus
                    status={resolveStatus(item)}
                    variant="default"
                  />
                </TableCell>
                <TableCell className="w-[80px]">
                  <HealthCenterTypesActions
                    healthCenterType={item}
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
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                {t(
                  "healthCenterTypes.table.noData",
                  "No hay tipos de centros registrados",
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
