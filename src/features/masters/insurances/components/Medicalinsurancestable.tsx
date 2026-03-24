import { useEffect, useState } from "react";
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
import MCServicesStatus from "@/shared/components/MCServicesStatus";
import MedicalInsurancesActions from "./Medicalinsurancesactions";
import type { InsuranceInterface } from "../hooks/useInsurance";
import { resolveStatus } from "../pages/Medicalinsurancespage";

interface MedicalInsurancesTableProps {
  insurances: InsuranceInterface[];
  onEdit?: (insurance: InsuranceInterface) => void;
  onDelete?: (insurance: InsuranceInterface) => void;
  onToggleStatus?: (insurance: InsuranceInterface) => void;
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

export default function MedicalInsurancesTable({
  insurances,
  onEdit,
  onDelete,
  onToggleStatus,
}: MedicalInsurancesTableProps) {
  const { t } = useTranslation("medicalInsurance");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(insurances.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = insurances.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [insurances.length, page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              {t("medicalInsurances.table.insurance")}
            </TableHead>
            <TableHead className="w-[160px]">
              {t("medicalInsurances.table.createdAt")}
            </TableHead>
            <TableHead className="w-[130px]">{t("table.status")}</TableHead>
            <TableHead className="w-[80px]">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[50px]">
                  <div className="flex items-center gap-3 rounded-full px-2 py-1">
                    <div className="relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center shrink-0">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        <AvatarImage
                          src={item.urlImage ?? ""}
                          alt={item.nombre}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                          {item.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="font-medium">{item.nombre}</span>
                  </div>
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
                  <MedicalInsurancesActions
                    insurance={item}
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
                colSpan={4} // Cambia a 4 columnas
                className="text-center py-8 text-muted-foreground"
              >
                {t("medicalInsurances.table.noData")}
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
