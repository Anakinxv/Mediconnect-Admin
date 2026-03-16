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

export interface HealthCenterType {
  id: string;
  name: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface HealthCenterTypesTableProps {
  healthCenterTypes: HealthCenterType[];
  onEdit?: (healthCenterType: HealthCenterType) => void;
  onDelete?: (healthCenterType: HealthCenterType) => void;
  onToggleStatus?: (healthCenterType: HealthCenterType) => void;
}

const PAGE_SIZE = 10;

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
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead className="w-[300px]">
              {t("healthCenterTypes.table.name")}
            </TableHead>
            <TableHead className="w-[160px]">
              {t("healthCenterTypes.table.createdAt")}
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
                <TableCell className="w-[300px]">
                  <span className="font-medium">{item.name}</span>
                </TableCell>
                <TableCell className="w-[160px]">
                  <span className="font-medium">{item.createdAt}</span>
                </TableCell>
                <TableCell className="w-[130px]">
                  <MCServicesStatus status={item.status} variant="default" />
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
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                {t("healthCenterTypes.table.noData")}
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
