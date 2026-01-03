import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

interface TopSpecialtiesChartProps {
  dataType?: "All" | "Year" | "Monthly" | "ThreeMonths" | "Weekly";
  data?: { especialidad: string; rating: number }[];
  config?: ChartConfig;
  title?: string;
  description?: string;
}

function TopSpecialtiesChart({
  data = [],
  title = "Top Especialidades",
  description = "Especialidades más solicitadas",
  config,
}: TopSpecialtiesChartProps) {
  // Ordenar por rating descendente y tomar el top 5
  const top5 = [...data].sort((a, b) => b.rating - a.rating).slice(0, 5);

  // Configuración por defecto para el color de la barra
  const chartConfig: ChartConfig = config ?? {
    rating: {
      label: "Rating",
      color: "var(--accent)",
    },
  };

  return (
    <Card className="h-full flex flex-col rounded-3xl border-none">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-base md:text-lg font-semibold ">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs md:text-sm  font-normal ">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex items-center justify-center h-full">
        <ChartContainer
          config={config ?? chartConfig}
          className="h-full w-full"
        >
          <BarChart
            data={top5}
            layout="vertical"
            margin={{ right: 16, left: 8, top: 8, bottom: 8 }}
            width={400}
            height={320}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="especialidad"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
            />
            <XAxis
              dataKey="rating"
              type="number"
              hide
              domain={[0, Math.max(...top5.map((d) => d.rating)) * 1.2]} // Aumenta el rango máximo un 20%
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="rating"
              layout="vertical"
              fill="var(--accent)"
              radius={4}
              barSize={24}
            >
              <LabelList
                dataKey="rating"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value.toFixed(1)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default TopSpecialtiesChart;
