"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "Janeiro", registered: 5, debtors: 1 },
  { month: "Fevereiro", registered: 6, debtors: 2 },
  { month: "Março", registered: 8, debtors: 3 },
  { month: "Abril", registered: 9, debtors: 2 },
];

const chartConfig = {
  registered: {
    label: "Moradores",
    color: "hsl(var(--chart-1))",
  },
  debtors: {
    label: "Devedores",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ResidentsTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Moradores e Devedores</CardTitle>
        <CardDescription>Janeiro - Abril 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="registered"
              type="monotone"
              stroke="var(--color-registered)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="debtors"
              type="monotone"
              stroke="var(--color-debtors)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Moradores registrados aumentaram 12,5% este mês{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Exibindo dados de moradores e devedores dos últimos 4 meses
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
