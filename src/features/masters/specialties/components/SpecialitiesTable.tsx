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

export interface Speciality {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface SpecialitiesTableProps {
  specialities: Speciality[];
  onEdit?: (speciality: Speciality) => void;
  onDelete?: (speciality: Speciality) => void;
  onToggleStatus?: (speciality: Speciality) => void;
}

const PAGE_SIZE = 10;

export default function SpecialitiesTable({
  specialities,
  onEdit,
  onDelete,
  onToggleStatus,
}: SpecialitiesTableProps) {
  const { t } = useTranslation("common");
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
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead className="w-[220px]">
              {t("specialities.table.name", "Nombre")}
            </TableHead>
            <TableHead className="w-[300px]">
              {t("specialities.table.description", "Descripción")}
            </TableHead>
            <TableHead className="w-[160px]">
              {t("specialities.table.createdAt", "Fecha de Creación")}
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
            paginatedData.map((speciality, index) => (
              <TableRow key={speciality.id}>
                <TableCell className="text-muted-foreground text-sm">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="w-[220px]">
                  <span className="font-medium">{speciality.name}</span>
                </TableCell>
                <TableCell className="w-[300px]">
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {speciality.description}
                  </span>
                </TableCell>
                <TableCell className="w-[160px]">
                  <span className="font-medium">{speciality.createdAt}</span>
                </TableCell>
                <TableCell className="w-[130px]">
                  <MCServicesStatus
                    status={speciality.status}
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
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                {t(
                  "specialities.table.noData",
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
