import * as React from "react";
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

export interface Center {
  id: string;
  name: string;
  image?: string;
  status: UserStatus;
  registrationDate: string;
  phone: string;
  email: string;
  centerType: string;
}

interface CentersTableProps {
  centers: Center[];
  onViewDetails?: (center: Center) => void;
}

const PAGE_SIZE = 10;

const truncate = (text: string | undefined, maxLength: number = 28): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function CentersTable({
  centers,
  onViewDetails,
}: CentersTableProps) {
  const [page, setPage] = React.useState(1);

  const totalPages = Math.ceil(centers.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = centers.slice(startIndex, startIndex + PAGE_SIZE);

  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [centers.length, page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Centro</TableHead>
            <TableHead className="w-[140px]">Tipo de Centro</TableHead>
            <TableHead className="w-[130px]">Estado</TableHead>
            <TableHead className="w-[160px]">Fecha de Registro</TableHead>
            <TableHead className="w-[200px]">Contacto</TableHead>
            <TableHead className="w-[80px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((center) => (
              <TableRow key={center.id}>
                {/* Centro */}
                <TableCell className="w-[220px]">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center">
                      {center.image ? (
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          <AvatarImage
                            src={center.image}
                            alt={center.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {center.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-12 w-12 rounded-full">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {center.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <span className="font-medium">{center.name}</span>
                  </div>
                </TableCell>

                {/* Tipo de Centro */}
                <TableCell className="w-[140px]">
                  <span className="font-medium text-primary">
                    {center.centerType}
                  </span>
                </TableCell>

                {/* Estado */}
                <TableCell className="w-[130px]">
                  <UserStatusBadge status={center.status} />
                </TableCell>

                {/* Fecha de Registro */}
                <TableCell className="w-[160px]">
                  <span className="font-medium">{center.registrationDate}</span>
                </TableCell>

                {/* Contacto */}
                <TableCell className="w-[200px]">
                  <div className="font-medium">{center.phone}</div>
                  {center.email.length > 28 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground cursor-help">
                            {truncate(center.email)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{center.email}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {center.email}
                    </div>
                  )}
                </TableCell>

                {/* Acciones */}
                <TableCell className="w-[80px]">
                  <UserAction onViewDetails={() => onViewDetails?.(center)} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No hay centros para mostrar
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
