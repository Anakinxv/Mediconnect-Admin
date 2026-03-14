import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/shared/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";
import { useTranslation } from "react-i18next";

interface AreaChartProps {
  dataType?: "All" | "Year" | "Monthly" | "ThreeMonths" | "Weekly";
  data?: { label: string; consultas: number }[];
  config?: ChartConfig;
}

function AreaChart({ data = [], config }: AreaChartProps) {
  const { t } = useTranslation("dashboard");

  const autoConfig: ChartConfig = {
    consultas: {
      label: t("charts.consultations"),
    },
  };

  return (
    <Card className="h-full flex flex-col rounded-3xl border-none shadow-none p-0 m-0">
      <CardContent className="flex items-center justify-center h-full">
        <ChartContainer
          config={config ?? autoConfig}
          className="h-full w-full p-0 m-0"
        >
          <ResponsiveContainer width="100%" height={250}>
            <RechartsAreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="consultas"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.2}
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default AreaChart;
