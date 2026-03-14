import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent } from "@/shared/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";
import { useTranslation } from "react-i18next";

interface BarChartProps {
  dataType?: "All" | "Year" | "Monthly" | "ThreeMonths" | "Weekly";
  data?: { label: string; consultas: number }[];
  config?: ChartConfig;
}

function BarChart({ data = [], config }: BarChartProps) {
  const { t } = useTranslation("dashboard");

  const autoConfig: ChartConfig = {
    consultas: {
      label: t("charts.consultations"),
      color: "var(--primary)",
    },
  };

  return (
    <Card className="h-full flex flex-col border-none p-0 m-0 shadow-none">
      <CardContent className="flex items-center justify-center h-full">
        <ChartContainer
          config={config ?? autoConfig}
          className="h-full w-full p-0 m-0"
        >
          <RechartsBarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="consultas"
              fill="var(--accent)"
              barSize={60}
              radius={[8, 8, 0, 0]}
            />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BarChart;
