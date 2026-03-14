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
import { useTranslation } from "react-i18next";

interface TopSpecialtiesChartProps {
  dataType?: "All" | "Year" | "Monthly" | "ThreeMonths" | "Weekly";
  data?: { especialidad: string; rating: number }[];
  config?: ChartConfig;
  title?: string;
  description?: string;
}

function TopSpecialtiesChart({
  data = [],
  title,
  description,
  config,
}: TopSpecialtiesChartProps) {
  const { t } = useTranslation("dashboard");

  const resolvedTitle = title ?? t("charts.topSpecialties");
  const resolvedDescription =
    description ?? t("charts.topSpecialtiesRequested");

  // Sort by rating descending and take top 5
  const top5 = [...data].sort((a, b) => b.rating - a.rating).slice(0, 5);

  // Default configuration for bar color
  const chartConfig: ChartConfig = config ?? {
    rating: {
      label: t("charts.ratingLabel"),
      color: "var(--accent)",
    },
  };

  return (
    <Card className="h-full flex flex-col rounded-3xl border-none">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-base md:text-lg font-semibold">
          {resolvedTitle}
        </CardTitle>
        {resolvedDescription && (
          <CardDescription className="text-xs md:text-sm font-normal">
            {resolvedDescription}
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
              domain={[0, Math.max(...top5.map((d) => d.rating)) * 1.2]}
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
