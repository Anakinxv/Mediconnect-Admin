import React, { useState, useMemo } from "react";
import MCTablesLayouts from "@/shared/components/MCTablesLayouts";
import MCButton from "@/shared/components/forms/MCButton";
import { Input } from "@/shared/ui/input";
import { Search, Plus, Users, UserCheck, UserX, Clock } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

// Mock data type
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  lastVisit: string;
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+1234567890",
    status: "active",
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "+1234567891",
    status: "inactive",
    lastVisit: "2023-12-20",
  },
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+1234567890",
    status: "active",
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "+1234567891",
    status: "inactive",
    lastVisit: "2023-12-20",
  },
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+1234567890",
    status: "active",
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "+1234567891",
    status: "inactive",
    lastVisit: "2023-12-20",
  },
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+1234567890",
    status: "active",
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "+1234567891",
    status: "inactive",
    lastVisit: "2023-12-20",
  },
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+1234567890",
    status: "active",
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "+1234567891",
    status: "inactive",
    lastVisit: "2023-12-20",
  },
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+1234567890",
    status: "active",
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "+1234567891",
    status: "inactive",
    lastVisit: "2023-12-20",
  },
];

function PatientsPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [data] = useState(mockPatients);

  // Métricas
  const metrics = [
    {
      title: "Atendidos Hoy",
      value: "10",
      icon: <UserCheck size={30} />,
      subtitle: "Cantidad de pacientes atendidos el día de hoy",
    },
    {
      title: "Pacientes Pendientes",
      value: "7",
      icon: <Clock size={30} />,
      subtitle: "Solicitudes de pacientes que no han sido atendidos",
    },
    {
      title: "Pacientes Rechazados",
      value: "30",
      icon: <UserX size={30} />,
      subtitle: "Pacientes rechazados por incumplimiento de los requisitos",
    },
    {
      title: "Pacientes Aceptados",
      value: "115",
      icon: <Users size={30} />,
      subtitle: "Pacientes aceptados en la app",
    },
  ];

  // Columnas de la tabla
  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: (info) => <span className=" py-3">{info.getValue()}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => <span className="px-4 py-3">{info.getValue()}</span>,
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: (info) => <span className="px-4 py-3">{info.getValue()}</span>,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-red-100 text-red-800",
          pending: "bg-yellow-100 text-yellow-800",
        };
        return (
          <span
            className={`px-3 py-2 rounded-full text-xs font-medium ${
              statusColors[status as keyof typeof statusColors]
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "lastVisit",
      header: "Última Visita",
      cell: (info) => <span className="px-4 py-3">{info.getValue()}</span>,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: () => (
        <div className="flex justify-end w-full px-4">
          <button
            className="px-4 py-3 flex items-center justify-center text-gray-400 hover:text-gray-600"
            title="Acciones"
          >
            <span className="text-2xl font-bold">...</span>
          </button>
        </div>
      ),
    },
  ];

  // Configuración de la tabla
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  // Componente de búsqueda
  const searchComponent = (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Buscar pacientes..."
        value={globalFilter ?? ""}
        onChange={(event) => setGlobalFilter(String(event.target.value))}
        className="pl-9"
      />
    </div>
  );

  // Componente de filtros (puedes expandir esto)
  const filterComponent = (
    <div className="flex gap-2">
      <select className="px-3 py-2 border border-border rounded-md bg-background">
        <option value="">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
        <option value="pending">Pendiente</option>
      </select>
    </div>
  );

  // Componente de tabla
  const tableComponent = (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-background border-none"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`text-lg font-bold bg-background ${
                    header.column.id === "actions"
                      ? "flex justify-end items-center"
                      : ""
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : String(
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="bg-background">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      cell.column.id === "actions"
                        ? "flex justify-end items-center"
                        : ""
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-background">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div className="flex items-center justify-between p-4">
        <div className="text-sm text-muted-foreground">
          Mostrando{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          a{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          de {table.getFilteredRowModel().rows.length} resultados
        </div>
        <div className="flex gap-2"></div>
      </div>
    </>
  );

  return (
    <MCTablesLayouts
      title="Gestión de Pacientes"
      metrics={metrics}
      searchComponent={searchComponent}
      filterComponent={filterComponent}
      tableComponent={tableComponent}
    />
  );
}

export default PatientsPage;
