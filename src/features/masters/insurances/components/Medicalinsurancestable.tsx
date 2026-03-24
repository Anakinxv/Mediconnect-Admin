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
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui/tooltip";
import MCServicesStatus from "@/shared/components/MCServicesStatus";
import MedicalInsurancesActions from "./Medicalinsurancesactions";
import type { InsuranceInterface } from "../hooks/useInsurance";
import type { InsuranceTypeInterface } from "../../insuranceTypes/hooks/useInsuranceTypes";
import { resolveStatus } from "../pages/Medicalinsurancespage";

interface MedicalInsurancesTableProps {
  insurances: InsuranceInterface[];
  insuranceTypes: InsuranceTypeInterface[];
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
  insuranceTypes,
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
            <TableHead className="w-[240px]">
              {t("medicalInsurances.table.insurance")}
            </TableHead>
            <TableHead className="text-center">
              {t("medicalInsurances.table.allowedTypes", "Tipos permitidos")}
            </TableHead>
            <TableHead className="w-[140px]">
              {t("medicalInsurances.table.createdAt")}
            </TableHead>
            <TableHead className="w-[130px]">{t("table.status")}</TableHead>
            <TableHead className="w-[80px]">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => {
              const typeNames =
                item.tiposPermitidos
                  ?.map((tipo) => tipo.nombre)
                  .filter(Boolean) ?? [];
              const visibleNames = typeNames.slice(0, 3);
              const extraCount = Math.max(0, typeNames.length - 3);

              return (
                <TableRow key={item.id}>
                  {/* Nombre + imagen */}
                  <TableCell className="w-[240px]">
                    <div className="flex items-center gap-3">
                      <div className="relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center shrink-0">
                        <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                          <AvatarImage
                            src={item.urlImage ?? ""}
                            alt={item.nombre}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                            {item.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="font-medium text-sm">{item.nombre}</span>
                    </div>
                  </TableCell>

                  {/* Tipos permitidos */}
                  <TableCell className="text-center align-middle">
                    {typeNames.length > 0 ? (
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {visibleNames.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs"
                          >
                            {name}
                          </span>
                        ))}

                        {extraCount > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs underline underline-offset-2"
                              >
                                +{extraCount}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              {typeNames.join(", ")}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t(
                          "medicalInsurances.table.noTypes",
                          "Sin tipos asignados",
                        )}
                      </span>
                    )}
                  </TableCell>

                  {/* Fecha */}
                  <TableCell className="w-[140px]">
                    <span className="font-medium text-sm">
                      {formatDate(item.creadoEn)}
                    </span>
                  </TableCell>

                  {/* Estado */}
                  <TableCell className="w-[130px]">
                    <MCServicesStatus
                      status={resolveStatus(item)}
                      variant="default"
                    />
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="w-[80px]">
                    <MedicalInsurancesActions
                      insurance={item}
                      insuranceTypes={insuranceTypes}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
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
