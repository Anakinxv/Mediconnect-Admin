import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis, // <-- Agrega esto
  Tooltip,
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

interface BarChartProps {
  dataType?: "All" | "Year" | "Monthly" | "ThreeMonths" | "Weekly";
  data?: { label: string; consultas: number }[];
  config?: ChartConfig;
}

function BarChart({ dataType = "Year", data = [], config }: BarChartProps) {
  const autoConfig: ChartConfig = {
    consultas: {
      label: "Consultas",
      color: "var(--primary)",
    },
  };

  return (
    <Card className="h-full flex flex-col  border-none p-0 m-0 shadow-none">
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
            <YAxis /> {/* <-- Esto agrega el eje Y a la izquierda */}
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="consultas"
              fill="var(--accent)"
              barSize={60}
              radius={[8, 8, 0, 0]} // Bordes superiores redondeados
            />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BarChart;
