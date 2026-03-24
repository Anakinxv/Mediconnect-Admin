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
import AllergiesActions from "./AllergiesActions";
import type { AllergyInterface } from "../hooks/useAllergies";
import { resolveStatus } from "../pages/AllergiesPage";

interface AllergiesTableProps {
  allergies: AllergyInterface[];
  onEdit?: (item: AllergyInterface) => void;
  onDelete?: (item: AllergyInterface) => void;
  onToggleStatus?: (item: AllergyInterface) => void;
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

export default function AllergiesTable({
  allergies,
  onEdit,
  onDelete,
  onToggleStatus,
}: AllergiesTableProps) {
  const { t } = useTranslation("allergies");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(allergies.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = allergies.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [allergies.length, page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead className="w-[220px]">
              {t("allergies.table.name", "Nombre")}
            </TableHead>
            <TableHead className="w-[300px]">
              {t("allergies.table.description", "Descripción")}
            </TableHead>
            <TableHead className="w-[160px]">
              {t("allergies.table.createdAt", "Fecha de Creación")}
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
                <TableCell className="text-muted-foreground text-sm">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{item.nombre}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {item.descripcion}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {formatDate(item.creadoEn)}
                  </span>
                </TableCell>
                <TableCell>
                  <MCServicesStatus
                    status={resolveStatus(item)}
                    variant="default"
                  />
                </TableCell>
                <TableCell>
                  <AllergiesActions
                    allergy={item}
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
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                {t("allergies.table.noData", "No hay alergias registradas")}
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
