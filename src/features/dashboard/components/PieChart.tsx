import { TrendingUp } from "lucide-react";
import { Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

interface PieChartProps {
  data: { name: string; value: number; color: string }[];
  config?: ChartConfig;
  title: string;
  description: string;
  width?: number; // Nuevo prop
  height?: number; // Nuevo prop
}

function PieChart({
  data = [],
  config,
  title,
  description,
  width = 220, // Valor por defecto
  height = 220, // Valor por defecto
}: PieChartProps) {
  const autoConfig: ChartConfig = Object.fromEntries(
    data.map((d) => [
      d.name,
      {
        label: d.name,
        color: d.color,
      },
    ])
  );

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
        <ChartContainer config={config ?? autoConfig} className="h-full w-full">
          <RechartsPieChart width={width} height={height}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey="value" nameKey="name">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            {/* <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="grid grid-cols-2 gap-2 justify-between items-center"
            /> */}
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PieChart;
