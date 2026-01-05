import React from "react";

import MCMetricCard from "@/shared/components/MCMetricCard";

interface Metric {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  subtitle?: string; // Agrega esta línea
}

interface MCTablesLayoutsProps {
  title: string;
  metrics?: Metric[];
  searchComponent?: React.ReactNode;
  filterComponent?: React.ReactNode;
  tableComponent: React.ReactNode;
  toogleView?: React.ReactNode;
}

function MCTablesLayouts({
  title,
  metrics = [],
  searchComponent,
  filterComponent,
  tableComponent,
  toogleView,
}: MCTablesLayoutsProps) {
  return (
    <div className="flex flex-col gap-10 bg-background p-6 rounded-4xl mt-4 h-full">
      {/* Título y Botón de Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>

      {/* Métricas Cards */}
      {metrics.length > 0 && (
        <div className="flex gap-4  ">
          {metrics.map((metric, index) => (
            <MCMetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              subtitle={metric.subtitle} // Agrega esta línea
            />
          ))}
        </div>
      )}
      <div className="flex w-full justify-end items-end mt-4">
        {/* Búsqueda y Filtros */}
        {(searchComponent || filterComponent || toogleView) && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-end max-w-lg">
            {searchComponent}
            {filterComponent}
            {toogleView}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-card rounded-xl overflow-hidden">{tableComponent}</div>
    </div>
  );
}

export default MCTablesLayouts;
