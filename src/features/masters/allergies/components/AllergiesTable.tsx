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

export interface Allergy {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface AllergiesTableProps {
  allergies: Allergy[];
  onEdit?: (allergy: Allergy) => void;
  onDelete?: (allergy: Allergy) => void;
  onToggleStatus?: (allergy: Allergy) => void;
}

const PAGE_SIZE = 10;

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
              {t("allergies.table.name")}
            </TableHead>
            <TableHead className="w-[300px]">
              {t("allergies.table.description")}
            </TableHead>
            <TableHead className="w-[160px]">
              {t("allergies.table.createdAt")}
            </TableHead>
            <TableHead className="w-[130px]">{t("table.status")}</TableHead>
            <TableHead className="w-[80px]">{t("table.actions")}</TableHead>
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
                  <span className="font-medium">{item.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{item.createdAt}</span>
                </TableCell>
                <TableCell>
                  <MCServicesStatus status={item.status} variant="default" />
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
                {t("allergies.table.noData")}
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
