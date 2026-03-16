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
import type { InsuranceTypeOption } from "./Medicalinsurancesfilters";

export interface MedicalInsurance {
  id: string;
  name: string;
  insuranceTypeId: string;
  insuranceTypeName: string;
  imageUrl?: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface MedicalInsurancesTableProps {
  medicalInsurances: MedicalInsurance[];
  insuranceTypeOptions: InsuranceTypeOption[];
  onEdit?: (medicalInsurance: MedicalInsurance) => void;
  onDelete?: (medicalInsurance: MedicalInsurance) => void;
  onToggleStatus?: (medicalInsurance: MedicalInsurance) => void;
}

const PAGE_SIZE = 10;

export default function MedicalInsurancesTable({
  medicalInsurances,
  insuranceTypeOptions,
  onEdit,
  onDelete,
  onToggleStatus,
}: MedicalInsurancesTableProps) {
  const { t } = useTranslation("medicalInsurance");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(medicalInsurances.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = medicalInsurances.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [medicalInsurances.length, page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[260px]">
              {t("medicalInsurances.table.insurance")}
            </TableHead>
            <TableHead className="w-[180px]">
              {t("medicalInsurances.table.insuranceType")}
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
                {/* Nombre + imagen */}
                <TableCell className="w-[260px]">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center shrink-0">
                      {item.imageUrl ? (
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          <AvatarImage
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {item.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-12 w-12 rounded-full">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {item.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                </TableCell>

                {/* Tipo de Seguro */}
                <TableCell className="w-[180px]">
                  <span className="font-medium text-primary">
                    {item.insuranceTypeName}
                  </span>
                </TableCell>

                {/* Fecha */}
                <TableCell className="w-[160px]">
                  <span className="font-medium">{item.createdAt}</span>
                </TableCell>

                {/* Estado */}
                <TableCell className="w-[130px]">
                  <MCServicesStatus status={item.status} variant="default" />
                </TableCell>

                {/* Acciones */}
                <TableCell className="w-[80px]">
                  <MedicalInsurancesActions
                    medicalInsurance={item}
                    insuranceTypeOptions={insuranceTypeOptions}
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
